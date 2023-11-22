/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
import { CloneType } from '../clone/type'
import { Discard } from '../discard/index'
import { IsUndefined } from '../guard/value'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import {
  TConstructor as IsConstructorType,
  TFunction as IsFunctionType,
  TIntersect as IsIntersectType,
  TUnion as IsUnionType,
  TTuple as IsTupleType,
  TArray as IsArrayType,
  TObject as IsObjectType,
  TPromise as IsPromiseType,
  TAsyncIterator as IsAsyncIteratorType,
  TIterator as IsIteratorType,
  TRef as IsRefType,
} from '../guard/type'

// ------------------------------------------------------------------
// DerefResolve
// ------------------------------------------------------------------
// prettier-ignore
export type FromRest<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
   ? [DerefResolve<L>, ...FromRest<R>]
   : []
)
function FromRest(schema: TSchema[], references: TSchema[]) {
  return schema.map((schema) => Deref(schema, references))
}
// prettier-ignore
type FromProperties<T extends TProperties> = Evaluate<{
  [K in keyof T]: DerefResolve<T[K]>
}>
// prettier-ignore
function FromProperties(properties: TProperties, references: TSchema[]) {
  return globalThis.Object.getOwnPropertyNames(properties).reduce((acc, key) => {
    return {...acc, [key]: Deref(properties[key], references) }
  }, {} as TProperties)
}
// prettier-ignore
function FromConstructor(schema: TConstructor, references: TSchema[]) {
  const clone = CloneType(schema)
  clone.parameters = FromRest(clone.parameters, references)
  clone.returns = Deref(clone.returns, references)
  return clone
}
// prettier-ignore
function FromFunction(schema: TFunction, references: TSchema[]) {
  const clone = CloneType(schema)
  clone.parameters = FromRest(clone.parameters, references)
  clone.returns = Deref(clone.returns, references)
  return clone
}
// prettier-ignore
function FromIntersect(schema: TIntersect, references: TSchema[]) {
  const clone = CloneType(schema)
  clone.allOf = FromRest(clone.allOf, references)
  return clone
}
// prettier-ignore
function FromUnion(schema: TUnion, references: TSchema[]) {
  const clone = CloneType(schema)
  clone.anyOf = FromRest(clone.anyOf, references)
  return clone
}
// prettier-ignore
function FromTuple(schema: TTuple, references: TSchema[]) {
  const clone = CloneType(schema)
  if(IsUndefined(clone.items)) return clone
  clone.items = FromRest(clone.items, references)
  return clone
}
// prettier-ignore
function FromArray(schema: TArray, references: TSchema[]) {
  const clone = CloneType(schema)
  clone.items = Deref(clone.items, references)
  return clone
}
// prettier-ignore
function FromObject(schema: TObject, references: TSchema[]) {
  const clone = CloneType(schema)
  clone.properties = FromProperties(clone.properties, references)
  return clone
}
// prettier-ignore
function FromPromise(schema: TPromise, references: TSchema[]) {
  const clone = CloneType(schema)
  clone.item = Deref(clone.item, references)
  return clone
}
// prettier-ignore
function FromAsyncIterator(schema: TAsyncIterator, references: TSchema[]) {
  const clone = CloneType(schema)
  clone.items = Deref(clone.items, references)
  return clone
}
// prettier-ignore
function FromIterator(schema: TIterator, references: TSchema[]) {
  const clone = CloneType(schema)
  clone.items = Deref(clone.items, references)
  return clone
}
// prettier-ignore
function FromRef(schema: TRef, references: TSchema[]) {
  const target = references.find(remote => remote.$id === schema.$ref)
  if(target === undefined) throw Error(`Unable to dereference schema with $id ${schema.$ref}`)
  const discard = Discard(target, ['$id']) as TSchema
  return Deref(discard, references)
}
// prettier-ignore
export type DerefResolve<T extends TSchema> =
  T extends TConstructor<infer S extends TSchema[], infer R extends TSchema> ? TConstructor<FromRest<S>, DerefResolve<R>> :
  T extends TFunction<infer S extends TSchema[], infer R extends TSchema> ? TFunction<FromRest<S>, DerefResolve<R>> :
  T extends TIntersect<infer S extends TSchema[]> ? TIntersect<FromRest<S>> :
  T extends TUnion<infer S extends TSchema[]> ? TUnion<FromRest<S>> :
  T extends TTuple<infer S extends TSchema[]> ? TTuple<FromRest<S>> :
  T extends TObject<infer S extends TProperties> ? TObject<FromProperties<S>> :
  T extends TArray<infer S extends TSchema> ? TArray<DerefResolve<S>> :
  T extends TPromise<infer S extends TSchema> ? TPromise<DerefResolve<S>> :
  T extends TAsyncIterator<infer S extends TSchema> ? TAsyncIterator<DerefResolve<S>> :
  T extends TIterator<infer S extends TSchema> ? TIterator<DerefResolve<S>> :
  T extends TRef<infer S extends TSchema> ? DerefResolve<S> :
  T
// prettier-ignore
export function DerefResolve<T extends TSchema>(schema: T, references: TSchema[]): TDeref<T>  {
  return (
    IsConstructorType(schema) ? FromConstructor(schema, references) :
    IsFunctionType(schema) ? FromFunction(schema, references) :
    IsIntersectType(schema) ? FromIntersect(schema, references) :
    IsUnionType(schema) ? FromUnion(schema, references) :
    IsTupleType(schema) ? FromTuple(schema, references) :
    IsArrayType(schema) ? FromArray(schema, references) :
    IsObjectType(schema) ? FromObject(schema, references) :
    IsPromiseType(schema) ? FromPromise(schema, references) :
    IsAsyncIteratorType(schema) ? FromAsyncIterator(schema, references) :
    IsIteratorType(schema) ? FromIterator(schema, references) :
    IsRefType(schema) ? FromRef(schema, references) :
    schema
  ) as TDeref<T> 
}
// ------------------------------------------------------------------
// TDeref
// ------------------------------------------------------------------
export type TDeref<T extends TSchema> = DerefResolve<T>

/** `[Json]` Creates a dereferenced type */
export function Deref<T extends TSchema>(schema: T, references: TSchema[]): TDeref<T> {
  return DerefResolve(schema, references)
}
