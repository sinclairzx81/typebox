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

import { CreateType } from '../create/type'
import type { TSchema, SchemaOptions } from '../schema/index'
import type { TupleToUnion, Evaluate } from '../helpers/index'
import { type TRecursive } from '../recursive/index'
import { type TIntersect, Intersect } from '../intersect/index'
import { type TUnion, Union } from '../union/index'
import { type TObject, type TProperties, type TPropertyKey, Object } from '../object/index'
import type { TMappedKey, TMappedResult } from '../mapped/index'
import { IndexPropertyKeys, type TIndexPropertyKeys } from '../indexed/index'
import { Discard } from '../discard/index'
import { TransformKind } from '../symbols/index'
import { PickFromMappedKey, type TPickFromMappedKey } from './pick-from-mapped-key'
import { PickFromMappedResult, type TPickFromMappedResult } from './pick-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedKey, IsMappedResult, IsIntersect, IsUnion, IsObject, IsSchema } from '../guard/kind'
// ------------------------------------------------------------------
// FromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type FromIntersect<T extends TSchema[], K extends PropertyKey[], Acc extends TSchema[] = []> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? FromIntersect<R, K, [...Acc, TPick<L, K>]>
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
    ? FromUnion<R, K, [...Acc, TPick<L, K>]>
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
  const Acc = {} as TProperties
  for(const K2 of K) if(K2 in T) Acc[K2 as TPropertyKey] = T[K2 as keyof T]
  return Acc as never
}
// ------------------------------------------------------------------
// PickResolve
// ------------------------------------------------------------------
// prettier-ignore
function PickResolve<T extends TSchema, K extends PropertyKey[]>(T: T, K: [...K]): TPick<T, K> {
  return (
    IsIntersect(T) ? Intersect(FromIntersect(T.allOf, K)) : 
    IsUnion(T) ? Union(FromUnion(T.anyOf, K)) : 
    IsObject(T) ? Object(FromProperties(T.properties, K), Discard(T, [TransformKind, '$id', 'required'])) :
    Object({})
  ) as never
}
// prettier-ignore
export type TPick<T extends TProperties, K extends PropertyKey[]> = 
  T extends TRecursive<infer S> ? TRecursive<TPick<S, K>> : 
  T extends TIntersect<infer S> ? TIntersect<FromIntersect<S, K>> : 
  T extends TUnion<infer S> ? TUnion<FromUnion<S, K>> : 
  T extends TObject<infer S> ? TObject<FromProperties<S, K>> : 
  TObject<{}>

/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Pick<T extends TMappedResult, K extends PropertyKey[]>(T: T, K: [...K], options?: SchemaOptions): TPickFromMappedResult<T, K>
/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Pick<T extends TSchema, K extends TMappedKey>(T: T, K: K, options?: SchemaOptions): TPickFromMappedKey<T, K>
/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Pick<T extends TSchema, K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>>(T: T, K: K, options?: SchemaOptions): TPick<T, I>
/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Pick<T extends TSchema, K extends PropertyKey[]>(T: T, K: readonly [...K], options?: SchemaOptions): TPick<T, K>
export function Pick(T: TSchema, K: any, options?: SchemaOptions): any {
  // mapped
  if (IsMappedKey(K)) return PickFromMappedKey(T, K, options)
  if (IsMappedResult(T)) return PickFromMappedResult(T, K, options)
  // non-mapped
  const I = IsSchema(K) ? IndexPropertyKeys(K) : (K as string[])
  return CreateType(PickResolve(T, I), options)
}
