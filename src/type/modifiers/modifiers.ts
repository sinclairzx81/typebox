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
import type { TReadonly } from '../readonly/index'
import { type TIntersect, Intersect } from '../intersect/index'
import { type TUnion, Union } from '../union/index'
import { type TOptional, Optional } from '../optional/index'
import { Discard } from '../discard/index'
import { OptionalKind } from '../symbols/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TOptional as IsOptionalType 
} from '../guard/type'

// ------------------------------------------------------------------
// IsOptionalFromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type IsOptionalFromIntersect<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? L extends TOptional<TSchema> 
      ? IsOptionalFromIntersect<R> 
      : false 
    : true
)
// prettier-ignore
function IsOptionalFromIntersect<T extends TSchema[]>(T: T): IsOptionalFromIntersect<T> {
  const [L, ...R] = T
  return ( 
    T.length > 0 
      ? IsOptionalType(L) 
        ? IsOptionalFromIntersect(R) 
        : false 
      : true 
  ) as IsOptionalFromIntersect<T>
}
// ------------------------------------------------------------------
// IsOptionalFromUnion
// ------------------------------------------------------------------
// prettier-ignore
type IsOptionalFromUnion<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] ? 
    L extends TOptional<TSchema> 
      ? true 
      : IsOptionalFromUnion<R> 
    : false
)
// prettier-ignore
function IsOptionalFromUnion<T extends TSchema[]>(T: T): IsOptionalFromUnion<T> {
  const [L, ...R] = T
  return (
    T.length > 0 
      ? IsOptionalType(L) 
        ? true 
        : IsOptionalFromUnion(R) 
      : false
  ) as IsOptionalFromUnion<T>
}
// ------------------------------------------------------------------
// RemoveOptionalFromRest
// ------------------------------------------------------------------
// prettier-ignore
type RemoveOptionalFromRest<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
  ? L extends TOptional<infer S extends TSchema>
    ? [RemoveOptionalFromSchema<S>, ...RemoveOptionalFromRest<R>]
    : [L, ...RemoveOptionalFromRest<R>]
  : []
)
// prettier-ignore
function RemoveOptionalFromRest<T extends TSchema[]>(T: T): RemoveOptionalFromRest<T> {
  return (
    T.map(T => RemoveOptionalFromSchema(T))
  )  as RemoveOptionalFromRest<T>
}
// ------------------------------------------------------------------
// RemoveOptionalFromSchema
// ------------------------------------------------------------------
// prettier-ignore
type RemoveOptionalFromSchema<T extends TSchema> = (
  T extends TReadonly<infer S extends TSchema> ? TReadonly<RemoveOptionalFromSchema<S>> :
  T extends TOptional<infer S extends TSchema> ? RemoveOptionalFromSchema<S> :
  T
)
// prettier-ignore
function RemoveOptionalFromSchema<T extends TSchema>(T: T): RemoveOptionalFromSchema<T> {
  return (
    Discard(T, [OptionalKind])
    ) as RemoveOptionalFromSchema<T>
}
// ------------------------------------------------------------------
// OptionalFromIntersect
// ------------------------------------------------------------------
// prettier-ignore
export type OptionalFromIntersect<T extends TSchema[], D extends TSchema[] = RemoveOptionalFromRest<T>> = (
  IsOptionalFromIntersect<T> extends true 
    ? TOptional<TIntersect<D>> 
    : TIntersect<T>
)
// prettier-ignore
export function OptionalFromIntersect<T extends TSchema[]>(T: T): OptionalFromIntersect<T> {
  const D = RemoveOptionalFromRest(T) as TSchema[]
  return (
    IsOptionalFromIntersect(T)
    ? Optional(Intersect(D))
    : Intersect(T)
  ) as unknown as OptionalFromIntersect<T>
}
// ------------------------------------------------------------------
// OptionalFromUnion
// ------------------------------------------------------------------
// prettier-ignore
export type OptionalFromUnion<T extends TSchema[], D extends TSchema[] = RemoveOptionalFromRest<T>> = (
  IsOptionalFromUnion<T> extends true 
    ? TOptional<TUnion<D>> 
    : TUnion<T>
)
// prettier-ignore
export function OptionalFromUnion<T extends TSchema[]>(T: T): OptionalFromUnion<T> {
  const D = RemoveOptionalFromRest(T) as TSchema[]
  return (
    IsOptionalFromUnion(T)
    ? Optional(Union(D))
    : Union(T)
  ) as OptionalFromUnion<T>
}
