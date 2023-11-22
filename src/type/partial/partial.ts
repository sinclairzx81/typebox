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
import { type TOptional, Optional } from '../optional/index'
import { type TReadonly } from '../readonly/index'
import { type TRecursive } from '../recursive/index'
import { type TObject, type TProperties, Object } from '../object/index'
import { type TIntersect, Intersect } from '../intersect/index'
import { type TUnion, Union } from '../union/index'
import { Discard } from '../discard/index'
import { TransformKind } from '../symbols/index'
import { CloneType } from '../clone/type'

import { PartialFromMappedResult, type TPartialFromMappedResult } from './partial-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TMappedResult as IsMappedResultType,
  TIntersect as IsIntersectType, 
  TUnion as IsUnionType, 
  TObject as IsObjectType 
} from '../guard/type'

// ------------------------------------------------------------------
// FromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type FromIntersect<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? [PartialResolve<L>, ...FromIntersect<R>]
    : []
)
// prettier-ignore
function FromIntersect<T extends TSchema[]>(T: [...T]) : FromIntersect<T> {
  const [L, ...R] = T
  return (
    T.length > 0
    ? [PartialResolve(L), ...FromIntersect(R)]
    : []
  ) as FromIntersect<T>
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type FromUnion<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? [PartialResolve<L>, ...FromUnion<R>]
    : []
)
// prettier-ignore
function FromUnion<T extends TSchema[]>(T: [...T]): FromUnion<T> {
  const [L, ...R] = T
  return (
    T.length > 0
    ? [PartialResolve(L), ...FromUnion(R)]
    : []
  ) as FromUnion<T>
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type FromProperties<T extends TProperties> = Evaluate<{
  [K in keyof T]: 
    T[K] extends (TReadonlyOptional<infer S>) ? TReadonlyOptional<S> : 
    T[K] extends (TReadonly<infer S>) ? TReadonlyOptional<S> : 
    T[K] extends (TOptional<infer S>) ? TOptional<S> : 
    TOptional<T[K]>
}>
// prettier-ignore
function FromProperties<T extends TProperties>(T: T) {
  return globalThis.Object.getOwnPropertyNames(T).reduce((Acc, K) => {
    return { ...Acc, [K]: Optional(T[K]) }
  }, {} as TProperties)
}
// ------------------------------------------------------------------
// PartialResolve
// ------------------------------------------------------------------
// prettier-ignore
type PartialResolve<T extends TSchema> = (
  T extends TRecursive<infer S> ? TRecursive<PartialResolve<S>> :
  T extends TIntersect<infer S> ? TIntersect<FromIntersect<S>> :
  T extends TUnion<infer S> ? TUnion<FromUnion<S>> :
  T extends TObject<infer S> ? TObject<FromProperties<S>> :
  TObject<{}>
)
// prettier-ignore
function PartialResolve<T extends TSchema>(T: T): PartialResolve<T> {
  return (
    IsIntersectType(T) ? Intersect(FromIntersect(T.allOf)) :
    IsUnionType(T) ? Union(FromUnion(T.anyOf)) :
    IsObjectType(T) ? Object(FromProperties(T.properties)) :
    Object({})
  ) as PartialResolve<T>
}

// ------------------------------------------------------------------
// TPartial
// ------------------------------------------------------------------
export type TPartial<T extends TSchema> = PartialResolve<T>

/** `[Json]` Constructs a type where all properties are optional */
export function Partial<T extends TMappedResult>(T: T, options?: SchemaOptions): TPartialFromMappedResult<T>
/** `[Json]` Constructs a type where all properties are optional */
export function Partial<T extends TSchema>(T: T, options?: SchemaOptions): TPartial<T>
/** `[Json]` Constructs a type where all properties are optional */
export function Partial(T: TSchema, options: SchemaOptions = {}) {
  if (IsMappedResultType(T)) {
    return PartialFromMappedResult(T, options) as any
  } else {
    const D = Discard(T, [TransformKind, '$id', 'required']) as TSchema
    const R = CloneType(PartialResolve(T), options)
    return { ...D, ...R } as any
  }
}
