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

import { type TSchema, SchemaOptions } from '../schema/index'
import { type TObject, type TProperties } from '../object/index'
import { type Assert } from '../helpers/index'
import { Never, type TNever } from '../never/index'
import { type TRecursive } from '../recursive/index'
import { type TIntersect } from '../intersect/index'
import { TMappedResult, type TMappedKey } from '../mapped/index'
import { type TUnion } from '../union/index'
import { type TTuple } from '../tuple/index'
import { type TArray } from '../array/index'
import { IntersectEvaluated, type TIntersectEvaluated } from '../intersect/index'
import { UnionEvaluated, type TUnionEvaluated } from '../union/index'
import { CloneType } from '../clone/type'

import { IndexPropertyKeys, type TIndexPropertyKeys } from './indexed-property-keys'
import { IndexFromMappedKey, type TIndexFromMappedKey } from './indexed-from-mapped-key'
import { IndexFromMappedResult, type TIndexFromMappedResult } from './indexed-from-mapped-result'
// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsArray, IsIntersect, IsObject, IsMappedKey, IsMappedResult, IsNever, IsSchema, IsTuple, IsUnion } from '../guard/type'

// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<T extends TSchema[], K extends PropertyKey, Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TFromRest<R, K, [...Acc, Assert<TFromKey<L, K>, TSchema>]>
    : Acc
)
// prettier-ignore
function FromRest<T extends TSchema[], K extends PropertyKey>(T: [...T], K: K): TFromRest<T, K> {
  return T.map(L => FromKey(L, K)) as TFromRest<T, K>
}
// ------------------------------------------------------------------
// FromIntersectRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersectRest<T extends TSchema[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? L extends TNever
      ? TFromIntersectRest<R, [...Acc]>
      : TFromIntersectRest<R, [...Acc, L]>
    : Acc
)
// prettier-ignore
function FromIntersectRest<T extends TSchema[]>(T: [...T]): TFromIntersectRest<T> {
  return T.filter(L => !IsNever(L)) as never
}
// prettier-ignore
type TFromIntersect<T extends TSchema[], K extends PropertyKey> = (
  TIntersectEvaluated<TFromIntersectRest<TFromRest<T, K>>>
)
// prettier-ignore
function FromIntersect<T extends TSchema[], K extends PropertyKey>(T: [...T], K: K): TFromIntersect<T, K> {
  return (
    IntersectEvaluated(FromIntersectRest(FromRest(T as TSchema[], K)))
  ) as TFromIntersect<T, K>
}
// ------------------------------------------------------------------
// FromUnionRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnionRest<T extends TSchema[]> = T
// prettier-ignore
function FromUnionRest<T extends TSchema[]>(T: [...T]): TFromUnionRest<T> {
  return T as never // review this
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<T extends TSchema[], K extends PropertyKey> = (
  TUnionEvaluated<TFromUnionRest<TFromRest<T, K>>>
)
// prettier-ignore
function FromUnion<T extends TSchema[], K extends PropertyKey>(T: [...T], K: K): TFromUnion<T, K> {
  return (
    UnionEvaluated(FromUnionRest(FromRest(T as TSchema[], K)))
  ) as TFromUnion<T, K>
}
// ------------------------------------------------------------------
// FromTuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<T extends TSchema[], K extends PropertyKey> = (
  K extends keyof T ? T[K] : 
  K extends '[number]' ? TUnionEvaluated<T> : 
  TNever
)
// prettier-ignore
function FromTuple<T extends TSchema[], K extends PropertyKey>(T: [...T], K: K): TFromTuple<T, K>  {
  return (
    K in T ? T[K as number] : 
    K === '[number]' ? UnionEvaluated(T) : 
    Never()
  ) as TFromTuple<T, K>
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
// prettier-ignore
type TFromArray<T extends TSchema, K extends PropertyKey> = (
  K extends '[number]' 
    ? T 
    : TNever
)
// prettier-ignore
function FromArray<T extends TSchema, K extends PropertyKey>(T: T, K: K): TFromArray<T, K>  {
  return (
    K === '[number]' 
      ? T 
      : Never()
  ) as TFromArray<T, K>
}
// ------------------------------------------------------------------
// FromProperty
// ------------------------------------------------------------------
type AssertPropertyKey<T> = Assert<T, string | number>

// prettier-ignore
type TFromProperty<
  T extends TProperties, 
  K extends PropertyKey,
> = (
  // evaluate for string keys
  K extends keyof T 
    ? T[K] 
    // evaluate for numeric keys
    : `${AssertPropertyKey<K>}` extends `${AssertPropertyKey<keyof T>}` 
      ? T[AssertPropertyKey<K>]
      : TNever
)
// prettier-ignore
function FromProperty<T extends TProperties, K extends PropertyKey>(T: T, K: K): TFromProperty<T, K> {
  return (K in T ? T[K as string] : Never()) as TFromProperty<T, K>
}
// ------------------------------------------------------------------
// FromKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromKey<T extends TSchema, K extends PropertyKey> = (
  T extends TRecursive<infer S> ? TFromKey<S, K> :
  T extends TIntersect<infer S> ? TFromIntersect<S, K> :
  T extends TUnion<infer S> ? TFromUnion<S, K> :
  T extends TTuple<infer S> ? TFromTuple<S, K> :
  T extends TArray<infer S> ? TFromArray<S, K> :
  T extends TObject<infer S> ? TFromProperty<S, K> :
  TNever
)
// prettier-ignore
function FromKey<T extends TSchema, K extends PropertyKey>(T: T, K: K): TFromKey<T, K> {
  return (
    IsIntersect(T) ? FromIntersect(T.allOf, K) :
    IsUnion(T) ? FromUnion(T.anyOf, K) :
    IsTuple(T) ? FromTuple(T.items ?? [], K) :
    IsArray(T) ? FromArray(T.items, K) :
    IsObject(T) ? FromProperty(T.properties, K) :
    Never()
  ) as TFromKey<T, K>
}
// ------------------------------------------------------------------
// FromKeys
// ------------------------------------------------------------------
// prettier-ignore
type TFromKeys<T extends TSchema, K extends PropertyKey[], Acc extends TSchema[] = []> = (
  K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TFromKeys<T, R, [...Acc, Assert<TFromKey<T, L>, TSchema>]>
    : Acc
)
// prettier-ignore
function FromKeys<T extends TSchema, K extends PropertyKey[]>(T: T, K: [...K]): TFromKeys<T, K> {
  return K.map(L => FromKey(T, L)) as TFromKeys<T, K>
}
// ------------------------------------------------------------------
// FromSchema
// ------------------------------------------------------------------
// prettier-ignore
type FromSchema<T extends TSchema, K extends PropertyKey[]> = (
  TUnionEvaluated<TFromKeys<T, K>>
)
// prettier-ignore
function FromSchema<T extends TSchema, K extends PropertyKey[]>(T: T, K: [...K]): FromSchema<T, K> {
  return (
    UnionEvaluated(FromKeys(T, K as PropertyKey[]))
  ) as FromSchema<T, K>
}
// ------------------------------------------------------------------
// TIndex
// ------------------------------------------------------------------
// prettier-ignore
export type TIndex<T extends TSchema, K extends PropertyKey[]> = (
  FromSchema<T, K>
)
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<T extends TSchema, K extends TMappedResult>(T: T, K: K, options?: SchemaOptions): TIndexFromMappedResult<T, K>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<T extends TSchema, K extends TMappedKey>(T: T, K: K, options?: SchemaOptions): TIndexFromMappedKey<T, K>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<T extends TSchema, K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>>(T: T, K: K, options?: SchemaOptions): TIndex<T, I>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<T extends TSchema, K extends PropertyKey[]>(T: T, K: readonly [...K], options?: SchemaOptions): TIndex<T, K>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index(T: TSchema, K: any, options: SchemaOptions = {}): any {
  // prettier-ignore
  return (
    IsMappedResult(K) ? CloneType(IndexFromMappedResult(T, K, options)) :
    IsMappedKey(K) ? CloneType(IndexFromMappedKey(T, K, options)) :
    IsSchema(K) ? CloneType(FromSchema(T, IndexPropertyKeys(K)), options) :
    CloneType(FromSchema(T, K as string[]), options)
  )
}
