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

import type { SchemaOptions, TSchema } from '../schema/index'
import { OptionalKind } from '../symbols/index'
import { CloneType } from '../clone/type'
import { Discard } from '../discard/index'

import { Never, type TNever } from '../never/index'
import { Optional, type TOptional } from '../optional/index'
import type { TReadonly } from '../readonly/index'

import { TIntersect, IntersectOptions } from './intersect-type'
import { IntersectCreate } from './intersect-create'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsOptional, IsTransform } from '../guard/kind'

// ------------------------------------------------------------------
// IsIntersectOptional
// ------------------------------------------------------------------
// prettier-ignore
type TIsIntersectOptional<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? L extends TOptional<TSchema> 
      ? TIsIntersectOptional<R> 
      : false 
    : true
)
// prettier-ignore
function IsIntersectOptional<T extends TSchema[]>(T: T): TIsIntersectOptional<T> {
  return T.every(L => IsOptional(L)) as never
}
// ------------------------------------------------------------------
// RemoveOptionalFromType
// ------------------------------------------------------------------
// prettier-ignore
type TRemoveOptionalFromType<T extends TSchema> = (
  T extends TReadonly<infer S extends TSchema> ? TReadonly<TRemoveOptionalFromType<S>> :
  T extends TOptional<infer S extends TSchema> ? TRemoveOptionalFromType<S> :
  T
)
// prettier-ignore
function RemoveOptionalFromType<T extends TSchema>(T: T): TRemoveOptionalFromType<T> {
  return (
    Discard(T, [OptionalKind])
    ) as never
}
// ------------------------------------------------------------------
// RemoveOptionalFromRest
// ------------------------------------------------------------------
// prettier-ignore
type TRemoveOptionalFromRest<T extends TSchema[], Acc extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
  ? L extends TOptional<infer S extends TSchema>
    ? TRemoveOptionalFromRest<R, [...Acc, TRemoveOptionalFromType<S>]>
    : TRemoveOptionalFromRest<R, [...Acc, L]>
  : Acc
)
// prettier-ignore
function RemoveOptionalFromRest<T extends TSchema[]>(T: T): TRemoveOptionalFromRest<T> {
  return T.map(L => IsOptional(L) ? RemoveOptionalFromType(L) : L) as never
}
// ------------------------------------------------------------------
// ResolveIntersect
// ------------------------------------------------------------------
// prettier-ignore
type TResolveIntersect<T extends TSchema[]> = (
  TIsIntersectOptional<T> extends true 
    ? TOptional<TIntersect<TRemoveOptionalFromRest<T>>> 
    : TIntersect<TRemoveOptionalFromRest<T>>
)
// prettier-ignore
function ResolveIntersect<T extends TSchema[]>(T: [...T], options: SchemaOptions): TResolveIntersect<T> {
  return (
    IsIntersectOptional(T)
      ? Optional(IntersectCreate(RemoveOptionalFromRest(T) as TSchema[], options))
      : IntersectCreate(RemoveOptionalFromRest(T) as TSchema[], options)
  ) as never
}
// ------------------------------------------------------------------
// IntersectEvaluated
// ------------------------------------------------------------------
// prettier-ignore
export type TIntersectEvaluated<T extends TSchema[]> = (
  T extends [] ? TNever :
  T extends [TSchema] ? T[0] :
  TResolveIntersect<T>
)
/** `[Json]` Creates an evaluated Intersect type */
export function IntersectEvaluated<T extends TSchema[], R = TIntersectEvaluated<T>>(T: [...T], options: IntersectOptions = {}): R {
  if (T.length === 0) return Never(options) as R
  if (T.length === 1) return CloneType(T[0], options) as R
  if (T.some((schema) => IsTransform(schema))) throw new Error('Cannot intersect transform types')
  return ResolveIntersect(T, options) as R
}
