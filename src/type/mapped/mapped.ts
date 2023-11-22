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
// mapping types
import { MappedResult, type TMappedResult } from './mapped-result'
import type { TMappedKey } from './mapped-key'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import {
  TArray as IsArrayType,
  TAsyncIterator as IsAsyncIteratorType,
  TConstructor as IsConstructorType,
  TFunction as IsFunctionType,
  TIntersect as IsIntersectType,
  TIterator as IsIteratorType,
  TReadonly as IsReadonlyType,
  TMappedResult as IsMappedResultType,
  TMappedKey as IsMappedKeyType,
  TObject as IsObjectType,
  TOptional as IsOptionalType,
  TPromise as IsPromiseType,
  TSchema as IsSchemaType,
  TTuple as IsTupleType,
  TUnion as IsUnionType,
} from '../guard/type'

// ------------------------------------------------------------------
// FromMappedResult
//
// We only evaluate the context (K) if it is a keyof P. Otherwise we
// remap the back to a MappedResult with the expectation it will be
// evaluated by an outer context. Note that overlapping keys in the
// outer context may result in incorrect evaluation of the outer
// context. Reproduction code below.
//
// [reproduction]
//
// type S = {
//   [L in 'A' | 'B']: {
//       [R in 'B' | 'C']: L
//   }
// }
//
// [correct evaluation]
//
// type S = {
//   A: {
//       B: "A";
//       C: "A";
//   };
//   B: {
//       B: "B";
//       C: "B";
//   };
// }
//
// [errored evaluation (overlapping B)]
//
// type T = {
//   A: {
//       B: "B"; // error
//       C: "A";
//   };
//   B: {
//       B: "B";
//       C: "B";
//   };
// }
//
// ------------------------------------------------------------------
// prettier-ignore
type FromMappedResult<K extends PropertyKey, P extends TProperties> = (
  K extends keyof P 
    ? FromSchemaType<K, P[K]>
    : TMappedResult<P>
)
// prettier-ignore
function FromMappedResult<K extends PropertyKey, P extends TProperties>(K: K, P: P): FromMappedResult<K, P> {
  return (
    K in P 
      ? FromSchemaType(K, P[K as string])
      : MappedResult(P)
  ) as FromMappedResult<K, P>
}
// ------------------------------------------------------------------
// FromMappedKey
//
// Here we remap MappedKey into MappedResult and have it evaluated
// via FromMappedResult using the context key (K). This is required
// in cases where the caller is nesting Mapped types and attempts to
// collect on the outer context (K) which is unknown to the inner
// context. The FromMappedResult only evaluates if (K) is a keyof
// (P), otherwise it remaps itself back into a MappedResult to be
// evaluated by the outer Mapped context. See above.
//
// ------------------------------------------------------------------
// prettier-ignore
type MappedKeyToMappedResultProperties<K extends PropertyKey, P extends PropertyKey[]> = (
  P extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? { [_ in L]: TLiteral<Assert<L, TLiteralValue>> } & MappedKeyToMappedResultProperties<K, R>
    : {}
)
// prettier-ignore
function MappedKeyToMappedResultProperties<K extends PropertyKey, P extends PropertyKey[]>(K: K, P: [...P]): MappedKeyToMappedResultProperties<K, P> {
  const [L, ...R] = P
  return (
    P.length > 0
      ? { [L]: Literal(L as string), ...MappedKeyToMappedResultProperties(K, R) }
      : {}
  ) as MappedKeyToMappedResultProperties<K, P>
}
// prettier-ignore
type FromMappedKey<
  K extends PropertyKey, 
  P extends PropertyKey[],
  R extends TProperties = MappedKeyToMappedResultProperties<K, P>
> = (
  FromMappedResult<K, R>
)
// prettier-ignore
function FromMappedKey<K extends PropertyKey, P extends PropertyKey[]>(K: K, P: [...P]) {
  const R = MappedKeyToMappedResultProperties(K, P)
  return FromMappedResult(K, R)
}
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type FromRest<K extends PropertyKey, T extends TSchema[]> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? [FromSchemaType<K, L>, ...FromRest<K, R>]
    : []
// prettier-ignore
function FromRest<K extends PropertyKey, T extends TSchema[]>(K: K, T: [...T]): FromRest<K, T> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? [FromSchemaType(K, L), ...FromRest(K, R)]
      : []
  ) as  FromRest<K, T>
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
  return globalThis.Object.getOwnPropertyNames(T).reduce((Acc, K2) => {
    return { ...Acc, [K2]: FromSchemaType(K, T[K2]) }
  }, {}) as FromProperties<K, T>
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
  T extends TMappedResult<infer P> ? FromMappedResult<K, P> :
  T extends TMappedKey<infer P> ? FromMappedKey<K, P> :
  // unevaluated types
  T extends TConstructor<infer S extends TSchema[], infer R extends TSchema> ? TConstructor<FromRest<K, S>, FromSchemaType<K, R>> :
  T extends TFunction<infer S extends TSchema[], infer R extends TSchema> ? TFunction<FromRest<K, S>, FromSchemaType<K, R>> :
  T extends TAsyncIterator<infer S> ? TAsyncIterator<FromSchemaType<K, S>> :
  T extends TIterator<infer S> ? TIterator<FromSchemaType<K, S>> :
  T extends TIntersect<infer S> ? TIntersect<FromRest<K, S>> :
  T extends TUnion<infer S> ? TUnion<FromRest<K, S>> :
  T extends TTuple<infer S> ? TTuple<FromRest<K, S>> :
  T extends TObject<infer S> ? TObject<FromProperties<K, S>> :
  T extends TArray<infer S> ? TArray<FromSchemaType<K, S>> :
  T extends TPromise<infer S> ? TPromise<FromSchemaType<K, S>> :
  T
)
// prettier-ignore
function FromSchemaType<K extends PropertyKey, T extends TSchema>(K: K, T: T): FromSchemaType<K, T> {
  return (
    // unevaluated modifier types
    IsOptionalType(T) ? Optional(FromSchemaType(K, Discard(T, [OptionalKind]) as TSchema)) :
    IsReadonlyType(T) ? Readonly(FromSchemaType(K, Discard(T, [ReadonlyKind]) as TSchema)) :
    // unevaluated mapped types
    IsMappedResultType(T) ? FromMappedResult(K, T.properties) :
    IsMappedKeyType(T) ? FromMappedKey(K, T.keys) :
    // unevaluated types
    IsConstructorType(T) ? Constructor(FromRest(K, T.parameters), FromSchemaType(K, T.returns)) :
    IsFunctionType(T) ? FunctionType(FromRest(K, T.parameters), FromSchemaType(K, T.returns)) :
    IsAsyncIteratorType(T) ? AsyncIterator(FromSchemaType(K, T.items)) :
    IsIteratorType(T) ? Iterator(FromSchemaType(K, T.items)) :
    IsIntersectType(T) ? Intersect(FromRest(K, T.allOf)) :
    IsUnionType(T) ? Union(FromRest(K, T.anyOf)) :
    IsTupleType(T) ? Tuple(FromRest(K, T.items ?? [])) :
    IsObjectType(T) ? Object(FromProperties(K, T.properties)) :
    IsArrayType(T) ? Array(FromSchemaType(K, T.items)) :
    IsPromiseType(T) ? Promise(FromSchemaType(K, T.item)) :
    T
  ) as FromSchemaType<K, T>
}
// ------------------------------------------------------------------
// FromMappedFunctionReturnType
// ------------------------------------------------------------------
// prettier-ignore
type FromMappedFunctionReturnType<K extends PropertyKey[], T extends TSchema> = (
  K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? { [_ in L]: FromSchemaType<L, T> } & FromMappedFunctionReturnType<R, T> 
    : {}
)
// prettier-ignore
function FromMappedFunctionReturnType<K extends PropertyKey[], T extends TSchema>(K: [...K], T: T): FromMappedFunctionReturnType<K, T> {
  const [L, ...R] = K
  return (
    K.length > 0
      ? { [L]: FromSchemaType(L, T), ...FromMappedFunctionReturnType(R, T) }
      : {}
  ) as FromMappedFunctionReturnType<K, T>
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
  R extends TProperties = Evaluate<FromMappedFunctionReturnType<K, ReturnType<F>>>, 
> = Ensure<TObject<R>>

/** `[Json]` Creates a Mapped object type */
export function Mapped<K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>, F extends TMappedFunction<I> = TMappedFunction<I>, R extends TMapped<I, F> = TMapped<I, F>>(key: K, map: F, options?: ObjectOptions): R
/** `[Json]` Creates a Mapped object type */
export function Mapped<K extends PropertyKey[], F extends TMappedFunction<K> = TMappedFunction<K>, R extends TMapped<K, F> = TMapped<K, F>>(key: [...K], map: F, options?: ObjectOptions): R
/** `[Json]` Creates a Mapped object type */
export function Mapped(key: any, map: Function, options: ObjectOptions = {}) {
  const K = IsSchemaType(key) ? IndexPropertyKeys(key) : (key as PropertyKey[])
  const RT = map({ [Kind]: 'MappedKey', keys: K } as TMappedKey)
  const R = FromMappedFunctionReturnType(K, RT)
  return CloneType(Object(R), options)
}
