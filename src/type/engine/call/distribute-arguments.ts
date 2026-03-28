/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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

// deno-fmt-ignore-file

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TDeferred, IsDeferred } from '../../types/deferred.ts'

// ------------------------------------------------------------------
// Expand
// ------------------------------------------------------------------
type TExpand<Type extends TSchema> = (
  Type extends TUnion<infer Types extends TSchema[]>
    ? [...Types]
    : [Type]
)
function Expand<Type extends TSchema>(type: Type): TExpand<Type> {
  return (
    IsUnion(type)
      ? [...type.anyOf]
      : [type]
  ) as never
}
// ------------------------------------------------------------------
// Append
// ------------------------------------------------------------------
type TAppend<Current extends TSchema[][], Type extends TSchema, Result extends TSchema[][] = []> = (
  Current extends [infer Left extends TSchema[], ...infer Right extends TSchema[][]]
    ? TAppend<Right, Type, [...Result, [...Left, Type]]>
    : Result
)
function Append<Current extends TSchema[][], Type extends TSchema>(current: [...Current], type: Type): TAppend<Current, Type> {
  return current.reduce((result, left) =>
    [...result, [...left, type]]
    , [] as TSchema[][]) as never
}
// ------------------------------------------------------------------
// Cross
// ------------------------------------------------------------------
type TCross<Current extends TSchema[][], Variants extends TSchema[], Result extends TSchema[][] = []> = (
  Variants extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TCross<Current, Right, [...Result, ...TAppend<Current, Left>]>
    : Result
)
function Cross<Current extends TSchema[][], Variants extends TSchema[]>(current: [...Current], variants: [...Variants]): TCross<Current, Variants> {
  return variants.reduce((result, left) => {
    return [...result, ...Append(current, left)]
  }, [] as TSchema[][]) as never
}
// -----------------------------------------------------------------------
// Distribute
// -----------------------------------------------------------------------
type TDistribute<Types extends TSchema[], Result extends TSchema[][] = [[]]> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TDistribute<Right, TCross<Result, TExpand<Left>>>
    : Result
)
function Distribute<Types extends TSchema[]>(types: [...Types]): TDistribute<Types> {
  return types.reduce((result, type) => {
    return Cross(result, Expand(type))
  }, [[]] as TSchema[][]) as never
}
// -----------------------------------------------------------------------
// DistributeArguments
// -----------------------------------------------------------------------
export type TDistributeArguments<Arguments extends TSchema[], Expression extends TSchema,
  Result extends TSchema[][] = Expression extends TDeferred<'Conditional', TSchema[]>
  ? TDistribute<Arguments>
  : [Arguments]
> = Result
export function DistributedArguments<Arguments extends TSchema[], Expression extends TSchema>
  (arguments_: [...Arguments], expression: Expression):
  TDistributeArguments<Arguments, Expression> {
  return (
    IsDeferred(expression) && Guard.IsEqual(expression.action, 'Conditional')
      ? Distribute(arguments_)
      : [arguments_]
  ) as never
}