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

import type { TSchema, SchemaOptions } from '../schema/index'
import { Intersect, type TIntersect } from '../intersect/index'
import { Union, type TUnion } from '../union/index'
import { type TPromise } from '../promise/index'
import { CloneType } from '../clone/type'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsIntersect, IsUnion, IsPromise } from '../guard/kind'
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<T extends TSchema[], Acc extends TSchema[] = []> =
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TFromRest<R, [...Acc, TAwaited<L>]>
    : Acc
// prettier-ignore
function FromRest<T extends TSchema[]>(T: [...T]) : TFromRest<T> {
  return T.map(L => AwaitedResolve(L)) as never
}
// ----------------------------------------------------------------
// FromIntersect
// ----------------------------------------------------------------
// prettier-ignore
type TFromIntersect<T extends TSchema[]> = TIntersect<TFromRest<T>>
// prettier-ignore
function FromIntersect<T extends TSchema[]>(T: [...T]): TFromIntersect<T> {
  return Intersect(FromRest(T) as TSchema[]) as never
}
// ----------------------------------------------------------------
// FromUnion
// ----------------------------------------------------------------
// prettier-ignore
type TFromUnion<T extends TSchema[]> = TUnion<TFromRest<T>>
// prettier-ignore
function FromUnion<T extends TSchema[]>(T: [...T]): TFromUnion<T> {
  return Union(FromRest(T) as TSchema[]) as never
}
// ----------------------------------------------------------------
// Promise
// ----------------------------------------------------------------
type TFromPromise<T extends TSchema> = TAwaited<T>
// prettier-ignore
function FromPromise<T extends TSchema>(T: T): TFromPromise<T> {
  return AwaitedResolve(T) as never
}
// ----------------------------------------------------------------
// AwaitedResolve
// ----------------------------------------------------------------
// prettier-ignore
function AwaitedResolve<T extends TSchema>(T: T): TAwaited<T> {
  return (
    IsIntersect(T) ? FromIntersect(T.allOf) :
    IsUnion(T) ? FromUnion(T.anyOf) :
    IsPromise(T) ? FromPromise(T.item) :
    T
  ) as never
}
// ------------------------------------------------------------------
// TAwaited
// ------------------------------------------------------------------
// prettier-ignore
export type TAwaited<T extends TSchema> =
  T extends TIntersect<infer S> ? TIntersect<TFromRest<S>> :
  T extends TUnion<infer S> ? TUnion<TFromRest<S>> :
  T extends TPromise<infer S> ? TAwaited<S> :
  T
/** `[JavaScript]` Constructs a type by recursively unwrapping Promise types */
export function Awaited<T extends TSchema>(T: T, options: SchemaOptions = {}): TAwaited<T> {
  return CloneType(AwaitedResolve(T), options)
}
