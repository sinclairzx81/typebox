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
import { CreateType } from '../create/type'
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
type TIsIntersectOptional<Types extends TSchema[]> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] 
    ? Left extends TOptional<TSchema> 
      ? TIsIntersectOptional<Right> 
      : false 
    : true
)
// prettier-ignore
function IsIntersectOptional<Types extends TSchema[]>(types: [...Types]): TIsIntersectOptional<Types> {
  return types.every(left => IsOptional(left)) as never
}
// ------------------------------------------------------------------
// RemoveOptionalFromType
// ------------------------------------------------------------------
// prettier-ignore
type TRemoveOptionalFromType<Type extends TSchema> = (
  Type extends TReadonly<infer Type extends TSchema> ? TReadonly<TRemoveOptionalFromType<Type>> :
  Type extends TOptional<infer Type extends TSchema> ? TRemoveOptionalFromType<Type> :
  Type
)
// prettier-ignore
function RemoveOptionalFromType<Type extends TSchema>(type: Type): TRemoveOptionalFromType<Type> {
  return (
    Discard(type, [OptionalKind])
    ) as never
}
// ------------------------------------------------------------------
// RemoveOptionalFromRest
// ------------------------------------------------------------------
// prettier-ignore
type TRemoveOptionalFromRest<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? Left extends TOptional<infer Type extends TSchema>
    ? TRemoveOptionalFromRest<Right, [...Result, TRemoveOptionalFromType<Type>]>
    : TRemoveOptionalFromRest<Right, [...Result, Left]>
  : Result
)
// prettier-ignore
function RemoveOptionalFromRest<Types extends TSchema[]>(types: [...Types]): TRemoveOptionalFromRest<Types> {
  return types.map(left => IsOptional(left) ? RemoveOptionalFromType(left) : left) as never
}
// ------------------------------------------------------------------
// ResolveIntersect
// ------------------------------------------------------------------
// prettier-ignore
type TResolveIntersect<Types extends TSchema[]> = (
  TIsIntersectOptional<Types> extends true 
    ? TOptional<TIntersect<TRemoveOptionalFromRest<Types>>> 
    : TIntersect<TRemoveOptionalFromRest<Types>>
)
// prettier-ignore
function ResolveIntersect<Types extends TSchema[]>(types: [...Types], options: SchemaOptions): TResolveIntersect<Types> {
  return (
    IsIntersectOptional(types)
      ? Optional(IntersectCreate(RemoveOptionalFromRest(types) as TSchema[], options))
      : IntersectCreate(RemoveOptionalFromRest(types) as TSchema[], options)
  ) as never
}
// ------------------------------------------------------------------
// IntersectEvaluated
// ------------------------------------------------------------------
// prettier-ignore
export type TIntersectEvaluated<Types extends TSchema[]> = (
  Types extends [TSchema] ? Types[0] :
  Types extends [] ? TNever :
  TResolveIntersect<Types>
)
/** `[Json]` Creates an evaluated Intersect type */
export function IntersectEvaluated<Types extends TSchema[], Result extends TSchema = TIntersectEvaluated<Types>>(types: [...Types], options: IntersectOptions = {}): Result {
  if (types.length === 1) return CreateType(types[0], options) as never
  if (types.length === 0) return Never(options) as never
  if (types.some((schema) => IsTransform(schema))) throw new Error('Cannot intersect transform types')
  return ResolveIntersect(types, options) as never
}
