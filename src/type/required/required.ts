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

import type { TSchema, SchemaOptions } from '../schema/index'
import type { Evaluate } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import { type TReadonlyOptional } from '../readonly-optional/index'
import { type TOptional } from '../optional/index'
import { type TReadonly } from '../readonly/index'
import { type TRecursive } from '../recursive/index'
import { type TIntersect, Intersect } from '../intersect/index'
import { type TUnion, Union } from '../union/index'
import { type TObject, type TProperties, Object } from '../object/index'

import { OptionalKind, TransformKind } from '../symbols/index'
import { CloneType } from '../clone/type'
import { Discard } from '../discard/index'

import { RequiredFromMappedResult, type TRequiredFromMappedResult } from './required-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedResult, IsIntersect, IsUnion, IsObject } from '../guard/type'
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<T extends TSchema[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TFromRest<R, [...Acc, TRequiredResolve<L>]>
    : Acc
)
// prettier-ignore
function FromRest<T extends TSchema[]>(T: [...T]) : TFromRest<T> {
  return T.map(L => RequiredResolve(L)) as TFromRest<T>
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<T extends TProperties> = Evaluate<{
  [K in keyof T]:
    T[K] extends (TReadonlyOptional<infer S>) ? TReadonly<S> :
    T[K] extends (TReadonly<infer S>) ? TReadonly<S> :
    T[K] extends (TOptional<infer S>) ? S :
    T[K]
}>
// prettier-ignore
function FromProperties<T extends TProperties>(T: T) {
  return globalThis.Object.getOwnPropertyNames(T).reduce((Acc, K) => {
    return { ...Acc, [K]: Discard(T[K], [OptionalKind]) as TSchema }
  }, {} as TProperties)
}
// ------------------------------------------------------------------
// RequiredResolve
// ------------------------------------------------------------------
// prettier-ignore
type TRequiredResolve<T extends TSchema> = (
  T extends TRecursive<infer S> ? TRecursive<TRequiredResolve<S>> :
  T extends TIntersect<infer S> ? TIntersect<TFromRest<S>> :
  T extends TUnion<infer S> ? TUnion<TFromRest<S>> :
  T extends TObject<infer S> ? TObject<TFromProperties<S>> :
  TObject<{}>
)
// prettier-ignore
function RequiredResolve<T extends TSchema>(T: T): TRequiredResolve<T> {
  return (
    IsIntersect(T) ? Intersect(FromRest(T.allOf)) :
    IsUnion(T) ?  Union(FromRest(T.anyOf)) :
    IsObject(T) ? Object(FromProperties(T.properties)) :
    Object({})
  ) as TRequiredResolve<T>
}
// ------------------------------------------------------------------
// TRequired
// ------------------------------------------------------------------
export type TRequired<T extends TSchema> = TRequiredResolve<T>

/** `[Json]` Constructs a type where all properties are required */
export function Required<T extends TMappedResult>(T: T, options?: SchemaOptions): TRequiredFromMappedResult<T>
/** `[Json]` Constructs a type where all properties are required */
export function Required<T extends TSchema>(T: T, options?: SchemaOptions): TRequired<T>
/** `[Json]` Constructs a type where all properties are required */
export function Required<T extends TSchema>(T: T, options: SchemaOptions = {}) {
  if (IsMappedResult(T)) {
    return RequiredFromMappedResult(T, options)
  } else {
    const D = Discard(T, [TransformKind, '$id', 'required']) as TSchema
    const R = CloneType(RequiredResolve(T) as any, options)
    return { ...D, ...R }
  }
}
