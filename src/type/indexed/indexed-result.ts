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
import { type TNever, Never } from '../never/index'
import { type TRecursive } from '../recursive/index'
import { type TIntersect } from '../intersect/index'
import { type TUnion } from '../union/index'
import { type TTuple } from '../tuple/index'
import { type TArray } from '../array/index'
import { IntersectEvaluated } from '../intersect/index'
import { UnionEvaluated } from '../union/index'
import { CloneType } from '../clone/type'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import {
  TArray as IsArrayType,
  TIntersect as IsIntersectType,
  TObject as IsObjectType, 
  TNever as IsNeverType,
  TTuple as IsTupleType, 
  TUnion as IsUnionType
} from '../guard/type'

// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type FromRest<T extends TSchema[], K extends PropertyKey> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? [FromKey<L, K>, ...FromRest<R, K>]
    : []
)
// prettier-ignore
function FromRest<T extends TSchema[], K extends PropertyKey>(T: [...T], K: K): FromRest<T, K> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? [FromKey(L, K), ...FromRest(R, K)]
      : []
  ) as FromRest<T, K>
}
// ------------------------------------------------------------------
// FromIntersectRest
// ------------------------------------------------------------------
// prettier-ignore
type FromIntersectRest<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? L extends TNever
      ? [...FromIntersectRest<R>]
      : [L, ...FromIntersectRest<R>]
    : []
)
// prettier-ignore
function FromIntersectRest<T extends TSchema[]>(T: [...T]): FromIntersectRest<T> {
  const [L, ...R] = T
  return (
    T.length > 0 
      ? IsNeverType(L)
        ? [...FromIntersectRest(R)]
        : [L, ...FromIntersectRest(R)]
      : []
  ) as FromIntersectRest<T>
}
// prettier-ignore
type FromIntersect<T extends TSchema[], K extends PropertyKey> = (
  IntersectEvaluated<FromIntersectRest<FromRest<T, K>>>
)
// prettier-ignore
function FromIntersect<T extends TSchema[], K extends PropertyKey>(T: [...T], K: K): FromIntersect<T, K> {
  return (
    IntersectEvaluated(FromIntersectRest(FromRest(T as TSchema[], K)))
  ) as FromIntersect<T, K>
}
// ------------------------------------------------------------------
// FromUnionRest
// ------------------------------------------------------------------
// prettier-ignore
type FromUnionRest<T extends TSchema[], S = T> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? L extends TNever
      ? []
      : FromUnionRest<R, S>
    : S
)
// prettier-ignore
function FromUnionRest<T extends TSchema[]>(T: [...T], S = T): FromUnionRest<T> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? IsNeverType(L)
        ? []
        : FromUnionRest(R, S)
      : S
  ) as FromUnionRest<T>
}
// prettier-ignore
type FromUnion<T extends TSchema[], K extends PropertyKey> = (
  UnionEvaluated<FromUnionRest<FromRest<T, K>>>
)
// prettier-ignore
function FromUnion<T extends TSchema[], K extends PropertyKey>(T: [...T], K: K): FromUnion<T, K> {
  return (
    UnionEvaluated(FromUnionRest(FromRest(T as TSchema[], K)))
  ) as FromUnion<T, K>
}
// ------------------------------------------------------------------
// FromTuple
// ------------------------------------------------------------------
// prettier-ignore
type FromTuple<T extends TSchema[], K extends PropertyKey> = (
  K extends keyof T ? T[K] : 
  K extends '[number]' ? UnionEvaluated<T> : 
  TNever
)
// prettier-ignore
function FromTuple<T extends TSchema[], K extends PropertyKey>(T: [...T], K: K): FromTuple<T, K>  {
  return (
    K in T ? T[K as number] : 
    K === '[number]' ? UnionEvaluated(T) : 
    Never()
  ) as FromTuple<T, K>
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
// prettier-ignore
type FromArray<T extends TSchema, K extends PropertyKey> = (
  K extends '[number]' 
    ? T 
    : TNever
)
// prettier-ignore
function FromArray<T extends TSchema, K extends PropertyKey>(T: T, K: K): FromArray<T, K>  {
  return (
    K === '[number]' 
      ? T 
      : Never()
  ) as FromArray<T, K>
}
// ------------------------------------------------------------------
// FromProperty
// ------------------------------------------------------------------
// prettier-ignore
type FromProperty<T extends TProperties, K extends PropertyKey> = (
  K extends keyof T 
    ? T[K] 
    : TNever
)
// prettier-ignore
function FromProperty<T extends TProperties, K extends PropertyKey>(T: T, K: K): FromProperty<T, K> {
  return (
    K in T 
    ? T[K as string] 
    : Never()
  ) as FromProperty<T, K>
}
// ------------------------------------------------------------------
// FromKey
// ------------------------------------------------------------------
// prettier-ignore
type FromKey<T extends TSchema, K extends PropertyKey> = (
  T extends TRecursive<infer S> ? FromKey<S, K> :
  T extends TIntersect<infer S> ? FromIntersect<S, K> :
  T extends TUnion<infer S> ? FromUnion<S, K> :
  T extends TTuple<infer S> ? FromTuple<S, K> :
  T extends TArray<infer S> ? FromArray<S, K> :
  T extends TObject<infer S> ? FromProperty<S, K> :
  TNever
)
// prettier-ignore
function FromKey<T extends TSchema, K extends PropertyKey>(T: T, K: K): FromKey<T, K> {
  return (
    IsIntersectType(T) ? FromIntersect(T.allOf, K) :
    IsUnionType(T) ? FromUnion(T.anyOf, K) :
    IsTupleType(T) ? FromTuple(T.items ?? [], K) :
    IsArrayType(T) ? FromArray(T.items, K) :
    IsObjectType(T) ? FromProperty(T.properties, K) :
    Never()
  ) as FromKey<T, K>
}
// ------------------------------------------------------------------
// FromKeys
// ------------------------------------------------------------------
// prettier-ignore
type FromKeys<T extends TSchema, K extends PropertyKey[]> = (
  K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? [FromKey<T, L>, ...FromKeys<T, R>]
    : []
)
// prettier-ignore
function FromKeys<T extends TSchema, K extends PropertyKey[]>(T: T, K: [...K]): FromKeys<T, K> {
  const [L, ...R] = K
  return (
    K.length > 0
    ? [FromKey(T, L), ...FromKeys(T, R)]
    : []
  ) as FromKeys<T, K>
}

// ------------------------------------------------------------------
// IndexedTypeResolve
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexResult<T extends TSchema, K extends PropertyKey[]> = (
  UnionEvaluated<FromKeys<T, K>>
)
// prettier-ignore
export function IndexResult<T extends TSchema, K extends PropertyKey[]>(T: T, K: [...K], options: SchemaOptions): TIndexResult<T, K> {
  return (
    CloneType(UnionEvaluated(FromKeys(T, K as PropertyKey[])), options)
  ) as TIndexResult<T, K>
}
