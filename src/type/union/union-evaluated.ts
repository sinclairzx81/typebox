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

import type { SchemaOptions, TSchema } from '../schema/index'
import { OptionalKind } from '../symbols/index'
import { CloneType } from '../clone/type'
import { Discard } from '../discard/index'
import { Never, type TNever } from '../never/index'
import { Optional, type TOptional } from '../optional/index'
import type { TReadonly } from '../readonly/index'
import type { TUnion } from './union-type'
import { UnionCreate } from './union-create'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TOptional as IsOptionalType 
} from '../guard/type'
// ------------------------------------------------------------------
// IsUnionOptional
// ------------------------------------------------------------------
// prettier-ignore
type IsUnionOptional<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] ? 
    L extends TOptional<TSchema> 
      ? true 
      : IsUnionOptional<R> 
    : false
)
// prettier-ignore
function IsUnionOptional<T extends TSchema[]>(T: T): IsUnionOptional<T> {
  const [L, ...R] = T
  return (
    T.length > 0 
      ? IsOptionalType(L) 
        ? true 
        : IsUnionOptional(R) 
      : false
  ) as IsUnionOptional<T>
}
// ------------------------------------------------------------------
// RemoveOptionalFromRest
// ------------------------------------------------------------------
// prettier-ignore
type RemoveOptionalFromRest<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
  ? L extends TOptional<infer S extends TSchema>
    ? [RemoveOptionalFromType<S>, ...RemoveOptionalFromRest<R>]
    : [L, ...RemoveOptionalFromRest<R>]
  : []
)
// prettier-ignore
function RemoveOptionalFromRest<T extends TSchema[]>(T: T): RemoveOptionalFromRest<T> {
  return (
    T.map(T => RemoveOptionalFromType(T))
  )  as RemoveOptionalFromRest<T>
}
// ------------------------------------------------------------------
// RemoveOptionalFromType
// ------------------------------------------------------------------
// prettier-ignore
type RemoveOptionalFromType<T extends TSchema> = (
  T extends TReadonly<infer S extends TSchema> ? TReadonly<RemoveOptionalFromType<S>> :
  T extends TOptional<infer S extends TSchema> ? RemoveOptionalFromType<S> :
  T
)
// prettier-ignore
function RemoveOptionalFromType<T extends TSchema>(T: T): RemoveOptionalFromType<T> {
  return (
    Discard(T, [OptionalKind])
  ) as RemoveOptionalFromType<T>
}
// ------------------------------------------------------------------
// ResolveUnion
// ------------------------------------------------------------------
// prettier-ignore
type ResolveUnion<T extends TSchema[], R extends TSchema[] = RemoveOptionalFromRest<T>> = (
  IsUnionOptional<T> extends true 
    ? TOptional<TUnion<R>> 
    : TUnion<R>
)
// prettier-ignore
function ResolveUnion<T extends TSchema[]>(T: T, options: SchemaOptions): ResolveUnion<T> {
  return (
    IsUnionOptional(T)
      ? Optional(UnionCreate(RemoveOptionalFromRest(T) as TSchema[], options))
      : UnionCreate(RemoveOptionalFromRest(T) as TSchema[], options)
  ) as ResolveUnion<T>
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
export type UnionEvaluated<T extends TSchema[]> = (
  T extends [] ? TNever :
  T extends [TSchema] ? T[0] :
  ResolveUnion<T>
)
/** `[Json]` Creates an evaluated Union type */
export function UnionEvaluated<T extends TSchema[], R = UnionEvaluated<T>>(T: [...T], options: SchemaOptions = {}): R {
  // prettier-ignore
  return (
    T.length === 0 ? Never(options) :
    T.length === 1 ? CloneType(T[0], options) :
    ResolveUnion(T, options)
  ) as R
}
