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

import { CreateType } from '../create/type'
import type { SchemaOptions, TSchema } from '../schema/index'
import { OptionalKind } from '../symbols/index'
import { Discard } from '../discard/index'
import { Never, type TNever } from '../never/index'
import { Optional, type TOptional } from '../optional/index'
import type { TReadonly } from '../readonly/index'
import type { TUnion } from './union-type'
import { UnionCreate } from './union-create'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsOptional } from '../guard/kind'
// ------------------------------------------------------------------
// IsUnionOptional
// ------------------------------------------------------------------
// prettier-ignore
type TIsUnionOptional<Types extends TSchema[]> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? 
    Left extends TOptional<TSchema> 
      ? true 
      : TIsUnionOptional<Right> 
    : false
)
// prettier-ignore
function IsUnionOptional<Types extends TSchema[]>(types: Types): TIsUnionOptional<Types> {
  return types.some(type => IsOptional(type)) as never
}
// ------------------------------------------------------------------
// RemoveOptionalFromRest
// ------------------------------------------------------------------
// prettier-ignore
type TRemoveOptionalFromRest<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? Left extends TOptional<infer S extends TSchema>
      ? TRemoveOptionalFromRest<Right, [...Result, TRemoveOptionalFromType<S>]>
      : TRemoveOptionalFromRest<Right, [...Result, Left]>
    : Result
)
// prettier-ignore
function RemoveOptionalFromRest<Types extends TSchema[]>(types: Types): TRemoveOptionalFromRest<Types> {
  return types.map(left => IsOptional(left) ? RemoveOptionalFromType(left) : left) as never
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
function RemoveOptionalFromType<Type extends TSchema>(T: Type): TRemoveOptionalFromType<Type> {
  return (
    Discard(T, [OptionalKind])
  ) as never
}
// ------------------------------------------------------------------
// ResolveUnion
// ------------------------------------------------------------------
// prettier-ignore
type TResolveUnion<Types extends TSchema[], 
  Result extends TSchema[] = TRemoveOptionalFromRest<Types>,
  IsOptional extends boolean = TIsUnionOptional<Types>
> = (
  IsOptional extends true 
    ? TOptional<TUnion<Result>> 
    : TUnion<Result>
)
// prettier-ignore
function ResolveUnion<Types extends TSchema[]>(types: Types, options?: SchemaOptions): TResolveUnion<Types> {
  const isOptional = IsUnionOptional(types)
  return (
    isOptional
      ? Optional(UnionCreate(RemoveOptionalFromRest(types) as TSchema[], options))
      : UnionCreate(RemoveOptionalFromRest(types) as TSchema[], options)
  ) as never
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
export type TUnionEvaluated<Types extends TSchema[]> = (
  Types extends [TSchema] ? Types[0] :
  Types extends [] ? TNever :
  TResolveUnion<Types>
)
/** `[Json]` Creates an evaluated Union type */
export function UnionEvaluated<Types extends TSchema[], Result = TUnionEvaluated<Types>>(T: [...Types], options?: SchemaOptions): Result {
  // prettier-ignore
  return (
    T.length === 1 ? CreateType(T[0], options) :
    T.length === 0 ? Never(options) :
    ResolveUnion(T, options)
  ) as never
}
