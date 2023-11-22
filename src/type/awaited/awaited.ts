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
import { type TIntersect, Intersect } from '../intersect/index'
import { type TUnion, Union } from '../union/index'
import { type TPromise } from '../promise/index'
import { CloneType } from '../clone/type'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TIntersect as IsIntersectType, 
  TUnion as IsUnionType, 
  TPromise as IsPromiseType 
} from '../guard/type'

// ------------------------------------------------------------------
// AwaitedResolve
// ------------------------------------------------------------------
// prettier-ignore
type AwaitedUnwrap<T extends TSchema[]> =
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? [AwaitedResolve<L>, ...AwaitedUnwrap<R>]
    : []
// prettier-ignore
function AwaitedUnwrap<T extends TSchema[]>(T: [...T]) : AwaitedUnwrap<T> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? [Resolve(L), ...AwaitedUnwrap(R)]
      : []
  ) as AwaitedUnwrap<T>
}
// ----------------------------------------------------------------
// IntersectRest
// ----------------------------------------------------------------
// prettier-ignore
type AwaitedIntersectRest<T extends TSchema[]> = TIntersect<AwaitedUnwrap<T>>
// prettier-ignore
function AwaitedIntersectRest<T extends TSchema[]>(T: [...T]): AwaitedIntersectRest<T> {
  return Intersect(AwaitedUnwrap(T) as TSchema[]) as unknown as AwaitedIntersectRest<T>
}
// ----------------------------------------------------------------
// UnionRest
// ----------------------------------------------------------------
// prettier-ignore
type AwaitedUnionRest<T extends TSchema[]> = TUnion<AwaitedUnwrap<T>>
// prettier-ignore
function AwaitedUnionRest<T extends TSchema[]>(T: [...T]): AwaitedUnionRest<T> {
  return Union(AwaitedUnwrap(T) as TSchema[]) as unknown as AwaitedUnionRest<T>
}
// ----------------------------------------------------------------
// Promise
// ----------------------------------------------------------------
type AwaitedPromise<T extends TSchema> = AwaitedResolve<T>
// prettier-ignore
function AwaitedPromise<T extends TSchema>(T: T): AwaitedPromise<T> {
  return Resolve(T) as AwaitedPromise<T>
}
// ----------------------------------------------------------------
// Resolve
// ----------------------------------------------------------------
// prettier-ignore
export type AwaitedResolve<T extends TSchema> =
  T extends TIntersect<infer S> ? TIntersect<AwaitedUnwrap<S>> :
  T extends TUnion<infer S> ? TUnion<AwaitedUnwrap<S>> :
  T extends TPromise<infer S> ? AwaitedResolve<S> :
  T
// prettier-ignore
export function Resolve<T extends TSchema>(T: T): AwaitedResolve<T> {
  return (
    IsIntersectType(T) ? AwaitedIntersectRest(T.allOf) :
    IsUnionType(T) ? AwaitedUnionRest(T.anyOf) :
    IsPromiseType(T) ? AwaitedPromise(T.item) :
    T
  ) as AwaitedResolve<T>
}
// ------------------------------------------------------------------
// TAwaited
// ------------------------------------------------------------------
export type TAwaited<T extends TSchema> = AwaitedResolve<T>

/** `[JavaScript]` Constructs a type by recursively unwrapping Promise types */
export function Awaited<T extends TSchema>(T: T, options: SchemaOptions = {}): AwaitedResolve<T> {
  return CloneType(Resolve(T), options)
}
