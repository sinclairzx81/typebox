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
import type { TupleToUnion, Evaluate } from '../helpers/index'
import { type TRecursive } from '../recursive/index'
import { type TIntersect, Intersect } from '../intersect/index'
import { type TUnion, Union } from '../union/index'
import { type TObject, type TProperties, Object } from '../object/index'
import type { TMappedKey, TMappedResult } from '../mapped/index'
import { IndexPropertyKeys, type TIndexPropertyKeys } from '../indexed/index'
import { Discard } from '../discard/index'
import { TransformKind } from '../symbols/index'
import { CloneType } from '../clone/type'
import { PickFromMappedKey, type TPickFromMappedKey } from './pick-from-mapped-key'
import { PickFromMappedResult, type TPickFromMappedResult } from './pick-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedKey, IsMappedResult, IsIntersect, IsUnion, IsObject, IsSchema } from '../guard/type'
// ------------------------------------------------------------------
// FromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type FromIntersect<T extends TSchema[], K extends PropertyKey[], Acc extends TSchema[] = []> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? FromIntersect<R, K, [...Acc, PickResolve<L, K>]>
    : Acc
function FromIntersect<T extends TSchema[], K extends PropertyKey[]>(T: T, K: K) {
  return T.map((T) => PickResolve(T, K)) as FromIntersect<T, K>
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type FromUnion<T extends TSchema[], K extends PropertyKey[], Acc extends TSchema[] = []> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? FromUnion<R, K, [...Acc, PickResolve<L, K>]>
    : Acc
// prettier-ignore
function FromUnion<T extends TSchema[], K extends PropertyKey[]>(T: T, K: K) {
  return T.map((T) => PickResolve(T, K)) as FromUnion<T, K>
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type FromProperties<T extends TProperties, K extends PropertyKey[], I extends PropertyKey = TupleToUnion<K>> = Evaluate<Pick<T, I & keyof T>>
// prettier-ignore
function FromProperties<T extends TProperties, K extends PropertyKey[]>(T: T, K: K) {
  return K.reduce((Acc, K) => {
    return K in T ? { ...Acc, [K]: T[K as keyof T] } : Acc
  }, {})
}
// ------------------------------------------------------------------
// PickResolve
// ------------------------------------------------------------------
// prettier-ignore
export type PickResolve<T extends TProperties, K extends PropertyKey[]> = 
  T extends TRecursive<infer S> ? TRecursive<PickResolve<S, K>> : 
  T extends TIntersect<infer S> ? TIntersect<FromIntersect<S, K>> : 
  T extends TUnion<infer S> ? TUnion<FromUnion<S, K>> : 
  T extends TObject<infer S> ? TObject<FromProperties<S, K>> : 
  TObject<{}>
// prettier-ignore
export function PickResolve<T extends TSchema, K extends PropertyKey[]>(T: T, K: [...K]): PickResolve<T, K> {
  return (
    IsIntersect(T) ? Intersect(FromIntersect(T.allOf, K)) : 
    IsUnion(T) ? Union(FromUnion(T.anyOf, K)) : 
    IsObject(T) ? Object(FromProperties(T.properties, K)) : 
    Object({})
  ) as PickResolve<T, K>
}
// ------------------------------------------------------------------
// TPick
// ------------------------------------------------------------------
export type TPick<T extends TSchema, K extends PropertyKey[]> = PickResolve<T, K>

/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Pick<T extends TMappedResult, K extends PropertyKey[]>(T: T, K: [...K], options?: SchemaOptions): TPickFromMappedResult<T, K>
/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Pick<T extends TSchema, K extends TMappedKey>(T: T, K: K, options?: SchemaOptions): TPickFromMappedKey<T, K>
/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Pick<T extends TSchema, K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>>(T: T, K: K, options?: SchemaOptions): TPick<T, I>
/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Pick<T extends TSchema, K extends PropertyKey[]>(T: T, K: readonly [...K], options?: SchemaOptions): TPick<T, K>
export function Pick(T: TSchema, K: any, options: SchemaOptions = {}): any {
  // mapped
  if (IsMappedKey(K)) return PickFromMappedKey(T, K, options)
  if (IsMappedResult(T)) return PickFromMappedResult(T, K, options)
  // non-mapped
  const I = IsSchema(K) ? IndexPropertyKeys(K) : (K as string[])
  const D = Discard(T, [TransformKind, '$id', 'required']) as TSchema
  const R = CloneType(PickResolve(T, I), options)
  return { ...D, ...R }
}
