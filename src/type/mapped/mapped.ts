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
import type { Ensure, Evaluate, Assert } from '../helpers/index'
import { Kind, OptionalKind, ReadonlyKind } from '../symbols/index'
import { CloneType } from '../clone/type'
import { Discard } from '../discard/index'
// evaluation types
import { Array, type TArray } from '../array/index'
import { AsyncIterator, type TAsyncIterator } from '../async-iterator/index'
import { Constructor, type TConstructor } from '../constructor/index'
import { Function as FunctionType, type TFunction } from '../function/index'
import { IndexPropertyKeys, type TIndexPropertyKeys } from '../indexed/index'
import { Intersect, type TIntersect } from '../intersect/index'
import { Iterator, type TIterator } from '../iterator/index'
import { Literal, type TLiteral, type TLiteralValue } from '../literal/index'
import { Object, type TObject, type TProperties, type ObjectOptions } from '../object/index'
import { Optional, type TOptional } from '../optional/index'
import { Promise, type TPromise } from '../promise/index'
import { Readonly, type TReadonly } from '../readonly/index'
import { Tuple, type TTuple } from '../tuple/index'
import { Union, type TUnion } from '../union/index'
// operator
import { SetIncludes, type TSetIncludes } from '../sets/index'
// mapping types
import { MappedResult, type TMappedResult } from './mapped-result'
import type { TMappedKey } from './mapped-key'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsArray, IsAsyncIterator, IsConstructor, IsFunction, IsIntersect, IsIterator, IsReadonly, IsMappedResult, IsMappedKey, IsObject, IsOptional, IsPromise, IsSchema, IsTuple, IsUnion } from '../guard/kind'
// ------------------------------------------------------------------
// FromMappedResult
//
// We only evaluate the context (K) if it is a keyof P. Otherwise we
// remap the back to a MappedResult with the expectation it will be
// evaluated by an outer context. Note that overlapping keys in the
// outer context may result in incorrect evaluation of the outer
// context. Reproduction code below.
//
// type S = {
//   [L in 'A' | 'B']: {
//     [R in 'B' | 'C']: [L, R] // issue: overlapping 'B'
//   }
// }
//
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<K extends PropertyKey, P extends TProperties> = (
  K extends keyof P 
    ? FromSchemaType<K, P[K]>
    : TMappedResult<P>
)
// prettier-ignore
function FromMappedResult<K extends PropertyKey, P extends TProperties>(K: K, P: P): TFromMappedResult<K, P> {
  return (
    K in P 
      ? FromSchemaType(K, P[K as string])
      : MappedResult(P)
  ) as never
}
// ------------------------------------------------------------------
// MappedKeyToKnownMappedResultProperties
//
// This path is used when K is in the PropertyKey set of P. This is
// the standard (fast) path when not nesting mapped types.
// ------------------------------------------------------------------
// prettier-ignore
type TMappedKeyToKnownMappedResultProperties<K extends PropertyKey> = {
  [_ in K]: TLiteral<Assert<K, TLiteralValue>>
}
// prettier-ignore
function MappedKeyToKnownMappedResultProperties<K extends PropertyKey>(K: K): TMappedKeyToKnownMappedResultProperties<K> {
  return { [K]: Literal(K as TLiteralValue) } as never
}
// ------------------------------------------------------------------
// MappedKeyToUnknownMappedResultProperties
//
// This path is used when K is outside the set of P. This indicates
// that the K originates from outside the current mappped type. This
// path is very slow as we need to construct a full MappedResult
// to be evaluated by the exterior mapped type.
// ------------------------------------------------------------------
// prettier-ignore
type TMappedKeyToUnknownMappedResultProperties<P extends PropertyKey[], Acc extends TProperties = {}> = (
  P extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TMappedKeyToUnknownMappedResultProperties<R, Acc & { [_ in L]: TLiteral<Assert<L, TLiteralValue>> }>
    : Acc
)
// prettier-ignore
function MappedKeyToUnknownMappedResultProperties<P extends PropertyKey[]>(P: [...P]): TMappedKeyToUnknownMappedResultProperties<P> {
  const Acc = {} as Record<PropertyKey, TSchema>
  for(const L of P) Acc[L] = Literal(L as TLiteralValue)
  return Acc as never
}
// ------------------------------------------------------------------
// MappedKeyToMappedResultProperties
// ------------------------------------------------------------------
// prettier-ignore
type TMappedKeyToMappedResultProperties<K extends PropertyKey, P extends PropertyKey[]> = (
  TSetIncludes<P, K> extends true
    ? TMappedKeyToKnownMappedResultProperties<K>
    : TMappedKeyToUnknownMappedResultProperties<P>
)
// prettier-ignore
function MappedKeyToMappedResultProperties<K extends PropertyKey, P extends PropertyKey[]>(K: K, P: [...P]): TMappedKeyToMappedResultProperties<K, P> {
  return (
    SetIncludes(P, K)
      ? MappedKeyToKnownMappedResultProperties(K)
      : MappedKeyToUnknownMappedResultProperties(P)
  ) as never
}
// prettier-ignore
type TFromMappedKey<
  K extends PropertyKey, 
  P extends PropertyKey[],
  R extends TProperties = TMappedKeyToMappedResultProperties<K, P>
> = (
  TFromMappedResult<K, R>
)
// prettier-ignore
function FromMappedKey<K extends PropertyKey, P extends PropertyKey[]>(K: K, P: [...P]): TFromMappedKey<K, P> {
  const R = MappedKeyToMappedResultProperties(K, P)
  return FromMappedResult(K, R) as never
}
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<K extends PropertyKey, T extends TSchema[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TFromRest<K, R, [...Acc, FromSchemaType<K, L>]>
    : Acc
)
// prettier-ignore
function FromRest<K extends PropertyKey, T extends TSchema[]>(K: K, T: [...T]): TFromRest<K, T> {
  return T.map(L => FromSchemaType(K, L)) as never
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type FromProperties<K extends PropertyKey, T extends TProperties, R extends TProperties = Evaluate<{
  [K2 in keyof T]: FromSchemaType<K, T[K2]>
}>> = R
// prettier-ignore
function FromProperties<K extends PropertyKey, T extends TProperties>(K: K, T: T): FromProperties<K, T> {
  const Acc = {} as Record<PropertyKey, TSchema>
  for(const K2 of globalThis.Object.getOwnPropertyNames(T)) Acc[K2] = FromSchemaType(K, T[K2])
  return Acc as never
}
// ------------------------------------------------------------------
// FromMappedPropertyKey
// ------------------------------------------------------------------
// prettier-ignore
type FromSchemaType<K extends PropertyKey, T extends TSchema> = (
  // unevaluated modifier types
  T extends TReadonly<infer S> ? TReadonly<FromSchemaType<K, S>> :
  T extends TOptional<infer S> ? TOptional<FromSchemaType<K, S>> :
  // unevaluated mapped types
  T extends TMappedResult<infer P> ? TFromMappedResult<K, P> :
  T extends TMappedKey<infer P> ? TFromMappedKey<K, P> :
  // unevaluated types
  T extends TConstructor<infer S extends TSchema[], infer R extends TSchema> ? TConstructor<TFromRest<K, S>, FromSchemaType<K, R>> :
  T extends TFunction<infer S extends TSchema[], infer R extends TSchema> ? TFunction<TFromRest<K, S>, FromSchemaType<K, R>> :
  T extends TAsyncIterator<infer S> ? TAsyncIterator<FromSchemaType<K, S>> :
  T extends TIterator<infer S> ? TIterator<FromSchemaType<K, S>> :
  T extends TIntersect<infer S> ? TIntersect<TFromRest<K, S>> :
  T extends TUnion<infer S> ? TUnion<TFromRest<K, S>> :
  T extends TTuple<infer S> ? TTuple<TFromRest<K, S>> :
  T extends TObject<infer S> ? TObject<FromProperties<K, S>> :
  T extends TArray<infer S> ? TArray<FromSchemaType<K, S>> :
  T extends TPromise<infer S> ? TPromise<FromSchemaType<K, S>> :
  T
)
// prettier-ignore
function FromSchemaType<K extends PropertyKey, T extends TSchema>(K: K, T: T): FromSchemaType<K, T> {
  return (
    // unevaluated modifier types
    IsOptional(T) ? Optional(FromSchemaType(K, Discard(T, [OptionalKind]) as TSchema)) :
    IsReadonly(T) ? Readonly(FromSchemaType(K, Discard(T, [ReadonlyKind]) as TSchema)) :
    // unevaluated mapped types
    IsMappedResult(T) ? FromMappedResult(K, T.properties) :
    IsMappedKey(T) ? FromMappedKey(K, T.keys) :
    // unevaluated types
    IsConstructor(T) ? Constructor(FromRest(K, T.parameters), FromSchemaType(K, T.returns)) :
    IsFunction(T) ? FunctionType(FromRest(K, T.parameters), FromSchemaType(K, T.returns)) :
    IsAsyncIterator(T) ? AsyncIterator(FromSchemaType(K, T.items)) :
    IsIterator(T) ? Iterator(FromSchemaType(K, T.items)) :
    IsIntersect(T) ? Intersect(FromRest(K, T.allOf)) :
    IsUnion(T) ? Union(FromRest(K, T.anyOf)) :
    IsTuple(T) ? Tuple(FromRest(K, T.items ?? [])) :
    IsObject(T) ? Object(FromProperties(K, T.properties)) :
    IsArray(T) ? Array(FromSchemaType(K, T.items)) :
    IsPromise(T) ? Promise(FromSchemaType(K, T.item)) :
    T
  ) as never
}
// ------------------------------------------------------------------
// MappedFunctionReturnType
// ------------------------------------------------------------------
// prettier-ignore
export type TMappedFunctionReturnType<K extends PropertyKey[], T extends TSchema, Acc extends TProperties = {}> = (
  K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TMappedFunctionReturnType<R, T, Acc & { [_ in L]: FromSchemaType<L, T> }>
    : Acc
)
// prettier-ignore
export function MappedFunctionReturnType<K extends PropertyKey[], T extends TSchema>(K: [...K], T: T): TMappedFunctionReturnType<K, T> {
  const Acc = {} as Record<PropertyKey, TSchema>
  for(const L of K) Acc[L] = FromSchemaType(L, T)
  return Acc as never
}
// ------------------------------------------------------------------
// TMappedFunction
// ------------------------------------------------------------------
// prettier-ignore
export type TMappedFunction<K extends PropertyKey[], I = TMappedKey<K>> = (T: I) => TSchema
// ------------------------------------------------------------------
// TMapped
// ------------------------------------------------------------------
// prettier-ignore
export type TMapped<
  K extends PropertyKey[], 
  F extends TMappedFunction<K>,
  R extends TProperties = Evaluate<TMappedFunctionReturnType<K, ReturnType<F>>>, 
> = Ensure<TObject<R>>

/** `[Json]` Creates a Mapped object type */
export function Mapped<K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>, F extends TMappedFunction<I> = TMappedFunction<I>, R extends TMapped<I, F> = TMapped<I, F>>(key: K, map: F, options?: ObjectOptions): R
/** `[Json]` Creates a Mapped object type */
export function Mapped<K extends PropertyKey[], F extends TMappedFunction<K> = TMappedFunction<K>, R extends TMapped<K, F> = TMapped<K, F>>(key: [...K], map: F, options?: ObjectOptions): R
/** `[Json]` Creates a Mapped object type */
export function Mapped(key: any, map: Function, options: ObjectOptions = {}) {
  const K = IsSchema(key) ? IndexPropertyKeys(key) : (key as PropertyKey[])
  const RT = map({ [Kind]: 'MappedKey', keys: K } as TMappedKey)
  const R = MappedFunctionReturnType(K, RT)
  return CloneType(Object(R), options)
}
