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
import { Intersect, type TIntersect } from '../intersect/index'
import { Union, type TUnion } from '../union/index'
import { Object, type TObject, type TProperties } from '../object/index'
import { IndexPropertyKeys, type TIndexPropertyKeys } from '../indexed/index'
import { Discard } from '../discard/index'
import { TransformKind } from '../symbols/index'
import { CloneType } from '../clone/type'
import { TMappedKey } from '../mapped/index'
import { OmitFromMappedKey, type TOmitFromMappedKey } from './omit-from-mapped-key'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TMappedKey as IsMappedKeyType, 
  TIntersect as IsIntersectType, 
  TUnion as IsUnionType, 
  TObject as IsObjectType, 
  TSchema as IsSchemaType 
} from '../guard/type'

// ------------------------------------------------------------------
// FromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type FromIntersect<T extends TSchema[], K extends PropertyKey[]> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? [OmitResolve<L, K>, ...FromIntersect<R, K>] 
    : []
// prettier-ignore
function FromIntersect<T extends TSchema[], K extends PropertyKey[]>(T: T, K: K) {
  return T.map((T) => OmitResolve(T, K)) as FromIntersect<T, K>
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type FromUnion<T extends TSchema[], K extends PropertyKey[]> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? [OmitResolve<L, K>, ...FromUnion<R, K>] 
    : []
// prettier-ignore
function FromUnion<T extends TSchema[], K extends PropertyKey[]>(T: T, K: K) {
  return T.map((T) => OmitResolve(T, K)) as FromUnion<T, K>
}
// ------------------------------------------------------------------
// FromProperty
// ------------------------------------------------------------------
// prettier-ignore
function FromProperty<T extends Record<any, any>, K extends PropertyKey>(T: T, K: K) {
  const { [K]: _, ...R } = T
  return R as TProperties
}
// prettier-ignore
type FromProperties<T extends TProperties, K extends PropertyKey[], I extends PropertyKey = TupleToUnion<K>> = Evaluate<Omit<T, I>>
// prettier-ignore
function FromProperties<T extends TProperties, K extends PropertyKey[]>(T: T, K: K) {
  return K.reduce((T, K2) => {
    return FromProperty(T, K2)
  }, T as TProperties)
}
// ------------------------------------------------------------------
// OmitResolve
// ------------------------------------------------------------------
// prettier-ignore
export type OmitResolve<T extends TProperties, K extends PropertyKey[]> = 
  T extends TRecursive<infer S> ? TRecursive<OmitResolve<S, K>> : 
  T extends TIntersect<infer S> ? TIntersect<FromIntersect<S, K>> : 
  T extends TUnion<infer S> ? TUnion<FromUnion<S, K>> : 
  T extends TObject<infer S> ? TObject<FromProperties<S, K>> : 
  TObject<{}>
// prettier-ignore
export function OmitResolve<T extends TSchema, K extends PropertyKey[]>(T: T, K: [...K]): OmitResolve<T, K> {
  return (
    IsIntersectType(T) ? Intersect(FromIntersect(T.allOf, K)) : 
    IsUnionType(T) ? Union(FromUnion(T.anyOf, K)) : 
    IsObjectType(T) ? Object(FromProperties(T.properties, K)) : 
    Object({})
  ) as OmitResolve<T, K>
}
// ------------------------------------------------------------------
// TOmit
// ------------------------------------------------------------------
// prettier-ignore
export type TOmit<T extends TSchema, K extends PropertyKey[]> = OmitResolve<T, K>

/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Omit<T extends TSchema, K extends TMappedKey>(T: T, K: K): TOmitFromMappedKey<T, K>
/** `[Json]` Constructs a type whose keys are omitted from the given type */
export function Omit<T extends TSchema, K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>>(T: T, K: K, options?: SchemaOptions): TOmit<T, I>
/** `[Json]` Constructs a type whose keys are omitted from the given type */
export function Omit<T extends TSchema, K extends PropertyKey[]>(T: T, K: readonly [...K], options?: SchemaOptions): TOmit<T, K>
export function Omit(T: TSchema, K: TSchema | readonly PropertyKey[], options: SchemaOptions = {}): any {
  if (IsMappedKeyType(K)) {
    return OmitFromMappedKey(T, K, options)
  } else {
    const I = IsSchemaType(K) ? IndexPropertyKeys(K) : (K as string[])
    const D = Discard(T, [TransformKind, '$id', 'required']) as TSchema
    const R = CloneType(OmitResolve(T, I), options)
    return { ...D, ...R }
  }
}
