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
import { Discard } from '../discard/discard'
import type { SchemaOptions, TSchema } from '../schema/index'
import type { TupleToUnion, Evaluate, Ensure } from '../helpers/index'
import { type TRecursive } from '../recursive/index'
import type { TMappedKey, TMappedResult } from '../mapped/index'
import { Intersect, type TIntersect } from '../intersect/index'
import { Union, type TUnion } from '../union/index'
import { Object, type TObject, type TProperties } from '../object/index'
import { IndexPropertyKeys, type TIndexPropertyKeys } from '../indexed/index'
import { OmitFromMappedKey, type TOmitFromMappedKey } from './omit-from-mapped-key'
import { OmitFromMappedResult, type TOmitFromMappedResult } from './omit-from-mapped-result'
import { TransformKind } from '../symbols/symbols'
// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedKey, IsIntersect, IsUnion, IsObject, IsSchema, IsMappedResult } from '../guard/kind'

// ------------------------------------------------------------------
// FromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<T extends TSchema[], K extends PropertyKey[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? TFromIntersect<R, K, [...Acc, TOmit<L, K>]>
    : Acc
)
// prettier-ignore
function FromIntersect<T extends TSchema[], K extends PropertyKey[]>(T: T, K: K) {
  return T.map((T) => OmitResolve(T, K)) as never
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<T extends TSchema[], K extends PropertyKey[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? TFromUnion<R, K, [...Acc, TOmit<L, K>]>
    : Acc
)
// prettier-ignore
function FromUnion<T extends TSchema[], K extends PropertyKey[]>(T: T, K: K) {
  return T.map((T) => OmitResolve(T, K)) as never
}
// ------------------------------------------------------------------
// FromProperty
// ------------------------------------------------------------------
// prettier-ignore
function FromProperty<T extends Record<any, any>, K extends PropertyKey>(T: T, K: K): TProperties {
  const { [K]: _, ...R } = T
  return R
}
// prettier-ignore
type TFromProperties<T extends TProperties, K extends PropertyKey[], I extends PropertyKey = TupleToUnion<K>> = Evaluate<Omit<T, I>>
// prettier-ignore
function FromProperties<T extends TProperties, K extends PropertyKey[]>(T: T, K: K) {
  return K.reduce((T, K2) => FromProperty(T, K2), T as TProperties)
}
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
// prettier-ignore
type TFromObject<T extends TObject, K extends PropertyKey[], Properties extends TProperties = T['properties']> = Ensure<TObject<(
  TFromProperties<Properties, K>
)>>
// prettier-ignore
function FromObject<T extends TObject, K extends PropertyKey[]>(T: T, K: K): TFromObject<T, K> {
  const options = Discard(T, [TransformKind, '$id', 'required', 'properties'])
  const properties = FromProperties(T['properties'], K)
  return Object(properties, options) as never
}
// ------------------------------------------------------------------
// OmitResolve
// ------------------------------------------------------------------
// prettier-ignore
function OmitResolve<T extends TSchema, K extends PropertyKey[]>(T: T, K: [...K]): TOmit<T, K> {
  return (
    IsIntersect(T) ? Intersect(FromIntersect(T.allOf, K)) : 
    IsUnion(T) ? Union(FromUnion(T.anyOf, K)) : 
    IsObject(T) ? FromObject(T, K) : 
    Object({})
  ) as never
}
// prettier-ignore
export type TOmit<T extends TProperties, K extends PropertyKey[]> = (
  T extends TRecursive<infer S extends TSchema> ? TRecursive<TOmit<S, K>> : 
  T extends TIntersect<infer S extends TSchema[]> ? TIntersect<TFromIntersect<S, K>> : 
  T extends TUnion<infer S extends TSchema[]> ? TUnion<TFromUnion<S, K>> : 
  T extends TObject<infer S extends TProperties> ? TFromObject<TObject<S>, K> : 
  TObject<{}>
)
// ------------------------------------------------------------------
// TOmit
// ------------------------------------------------------------------
/** `[Json]` Constructs a type whose keys are omitted from the given type */
export function Omit<T extends TMappedResult, K extends PropertyKey[]>(T: T, K: [...K], options?: SchemaOptions): TOmitFromMappedResult<T, K>
/** `[Json]` Constructs a type whose keys are omitted from the given type */
export function Omit<T extends TSchema, K extends TMappedKey>(T: T, K: K, options?: SchemaOptions): TOmitFromMappedKey<T, K>
/** `[Json]` Constructs a type whose keys are omitted from the given type */
export function Omit<T extends TSchema, K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>>(T: T, K: K, options?: SchemaOptions): TOmit<T, I>
/** `[Json]` Constructs a type whose keys are omitted from the given type */
export function Omit<T extends TSchema, K extends PropertyKey[]>(T: T, K: readonly [...K], options?: SchemaOptions): TOmit<T, K>
export function Omit(T: TSchema, K: any, options?: SchemaOptions): any {
  // mapped
  if (IsMappedKey(K)) return OmitFromMappedKey(T, K, options)
  if (IsMappedResult(T)) return OmitFromMappedResult(T, K, options)
  // non-mapped
  const I = IsSchema(K) ? IndexPropertyKeys(K) : (K as string[])
  // special: mapping types require overridable options
  return CreateType({ ...OmitResolve(T, I), ...options })
}
