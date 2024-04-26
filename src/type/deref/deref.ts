/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import type { TSchema } from '../schema/index'
import type { Evaluate } from '../helpers/index'
import type { TTuple } from '../tuple/index'
import type { TIntersect } from '../intersect/index'
import type { TUnion } from '../union/index'
import type { TPromise } from '../promise/index'
import type { TAsyncIterator } from '../async-iterator/index'
import type { TIterator } from '../iterator/index'
import type { TArray } from '../array/index'
import type { TConstructor } from '../constructor/index'
import type { TFunction } from '../function/index'
import type { TRef } from '../ref/index'
import type { TObject, TProperties } from '../object/index'
import { CloneType, CloneRest } from '../clone/type'
import { Discard } from '../discard/index'
import { IsUndefined } from '../guard/value'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsConstructor, IsFunction, IsIntersect, IsUnion, IsTuple, IsArray, IsObject, IsPromise, IsAsyncIterator, IsIterator, IsRef } from '../guard/kind'
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
export type TFromRest<T extends TSchema[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
   ? TFromRest<R, [...Acc, TDeref<L>]>
   : Acc
)
function FromRest<T extends TSchema[]>(schema: [...T], references: TSchema[]): TFromRest<T> {
  return schema.map((schema) => Deref(schema, references)) as never
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type FromProperties<T extends TProperties> = Evaluate<{
  [K in keyof T]: TDeref<T[K]>
}>
// prettier-ignore
function FromProperties(properties: TProperties, references: TSchema[]) {
  const Acc = {} as TProperties
  for(const K of globalThis.Object.getOwnPropertyNames(properties)) {
    Acc[K] = Deref(properties[K], references)
  }
  return Acc as never
}
// prettier-ignore
function FromConstructor(schema: TConstructor, references: TSchema[]) {
  schema.parameters = FromRest(schema.parameters, references)
  schema.returns = Deref(schema.returns, references)
  return schema
}
// prettier-ignore
function FromFunction(schema: TFunction, references: TSchema[]) {
  schema.parameters = FromRest(schema.parameters, references)
  schema.returns = Deref(schema.returns, references)
  return schema
}
// prettier-ignore
function FromIntersect(schema: TIntersect, references: TSchema[]) {
  schema.allOf = FromRest(schema.allOf, references)
  return schema
}
// prettier-ignore
function FromUnion(schema: TUnion, references: TSchema[]) {
  schema.anyOf = FromRest(schema.anyOf, references)
  return schema
}
// prettier-ignore
function FromTuple(schema: TTuple, references: TSchema[]) {
  if(IsUndefined(schema.items)) return schema
  schema.items = FromRest(schema.items, references)
  return schema
}
// prettier-ignore
function FromArray(schema: TArray, references: TSchema[]) {
  schema.items = Deref(schema.items, references)
  return schema
}
// prettier-ignore
function FromObject(schema: TObject, references: TSchema[]) {
  schema.properties = FromProperties(schema.properties, references)
  return schema
}
// prettier-ignore
function FromPromise(schema: TPromise, references: TSchema[]) {
  schema.item = Deref(schema.item, references)
  return schema
}
// prettier-ignore
function FromAsyncIterator(schema: TAsyncIterator, references: TSchema[]) {
  schema.items = Deref(schema.items, references)
  return schema
}
// prettier-ignore
function FromIterator(schema: TIterator, references: TSchema[]) {
  schema.items = Deref(schema.items, references)
  return schema
}
// prettier-ignore
function FromRef(schema: TRef, references: TSchema[]) {
  const target = references.find(remote => remote.$id === schema.$ref)
  if(target === undefined) throw Error(`Unable to dereference schema with $id ${schema.$ref}`)
  const discard = Discard(target, ['$id']) as TSchema
  return Deref(discard, references)
}
// prettier-ignore
function DerefResolve<T extends TSchema>(schema: T, references: TSchema[]): TDeref<T>  {
  return (
    IsConstructor(schema) ? FromConstructor(schema, references) :
    IsFunction(schema) ? FromFunction(schema, references) :
    IsIntersect(schema) ? FromIntersect(schema, references) :
    IsUnion(schema) ? FromUnion(schema, references) :
    IsTuple(schema) ? FromTuple(schema, references) :
    IsArray(schema) ? FromArray(schema, references) :
    IsObject(schema) ? FromObject(schema, references) :
    IsPromise(schema) ? FromPromise(schema, references) :
    IsAsyncIterator(schema) ? FromAsyncIterator(schema, references) :
    IsIterator(schema) ? FromIterator(schema, references) :
    IsRef(schema) ? FromRef(schema, references) :
    schema
  ) as never
}
// prettier-ignore
export type TDeref<T extends TSchema> =
  T extends TConstructor<infer S extends TSchema[], infer R extends TSchema> ? TConstructor<TFromRest<S>, TDeref<R>> :
  T extends TFunction<infer S extends TSchema[], infer R extends TSchema> ? TFunction<TFromRest<S>, TDeref<R>> :
  T extends TIntersect<infer S extends TSchema[]> ? TIntersect<TFromRest<S>> :
  T extends TUnion<infer S extends TSchema[]> ? TUnion<TFromRest<S>> :
  T extends TTuple<infer S extends TSchema[]> ? TTuple<TFromRest<S>> :
  T extends TObject<infer S extends TProperties> ? TObject<FromProperties<S>> :
  T extends TArray<infer S extends TSchema> ? TArray<TDeref<S>> :
  T extends TPromise<infer S extends TSchema> ? TPromise<TDeref<S>> :
  T extends TAsyncIterator<infer S extends TSchema> ? TAsyncIterator<TDeref<S>> :
  T extends TIterator<infer S extends TSchema> ? TIterator<TDeref<S>> :
  T extends TRef<infer S extends TSchema> ? TDeref<S> :
  T
// ------------------------------------------------------------------
// TDeref
// ------------------------------------------------------------------
/** `[Json]` Creates a dereferenced type */
export function Deref<T extends TSchema>(schema: T, references: TSchema[]): TDeref<T> {
  return DerefResolve(CloneType(schema), CloneRest(references))
}
