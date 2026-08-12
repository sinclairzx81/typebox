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
// deno-fmt-ignore-file

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

import { type TNarrow, Narrow } from './narrow.ts'
import { type TEvaluateIntersect, EvaluateIntersect } from './evaluate.ts'
import { type TEvaluateType, EvaluateType } from './evaluate.ts'

// ------------------------------------------------------------------
// ShouldEvaluate (if either operand is Union)
// ------------------------------------------------------------------
type TShouldEvaluate<Left extends TSchema, Right extends TSchema,
  IsUnionLeft extends boolean = Left extends TUnion ? true : false,
  IsUnionRight extends boolean = Right extends TUnion ? true : false,
  Result extends boolean = IsUnionLeft extends true ? true : IsUnionRight extends true ? true : false
> = Result
function ShouldEvaluate<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TShouldEvaluate<Left, Right> {
  const result = IsUnion(left) || IsUnion(right)
  return result as never
}
// -----------------------------------------------------------------------------------------
// DistributeOperation
// -----------------------------------------------------------------------------------------
type TDistributeOperation<Left extends TSchema, Right extends TSchema,
  EvaluatedLeft extends TSchema = TEvaluateType<Left>,
  EvaluatedRight extends TSchema = TEvaluateType<Right>,
  ShouldEvaluate extends boolean = TShouldEvaluate<EvaluatedLeft, EvaluatedRight>,
  Result extends TSchema = [ShouldEvaluate] extends [true] 
    ? TEvaluateIntersect<[EvaluatedLeft, EvaluatedRight]> 
    : TNarrow<EvaluatedLeft, EvaluatedRight>
> = Result
function DistributeOperation<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TDistributeOperation<Left, Right> {
  const evaluatedLeft = EvaluateType(left)
  const evaluatedRight = EvaluateType(right)
  const shouldEvaluate = ShouldEvaluate(evaluatedLeft, evaluatedRight)
  const result = shouldEvaluate 
    ? EvaluateIntersect([evaluatedLeft, evaluatedRight]) 
    : Narrow(evaluatedLeft, evaluatedRight)
  return result as never
}
// -----------------------------------------------------------------------------------------
// DistributeType
// -----------------------------------------------------------------------------------------
type TDistributeType<Type extends TSchema, Distribution extends TSchema[], Result extends TSchema[] = []> = (
  Distribution extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TDistributeType<Type, Right, [ ...Result, TDistributeOperation<Left, Type>]>
    : Result extends [] 
      ? [Type]
      : Result
)
function DistributeType<Type extends TSchema, Distribution extends TSchema[]>(type: Type, types: [...Distribution], result: TSchema[] = []): TDistributeType<Type, Distribution> {
  return Guard.ShiftLeft(types, (left, right) => 
    DistributeType(type, right, [...result, DistributeOperation(left, type)]),
    () => Guard.IsEqual(result.length, 0)
      ? [type]
      : result) as never
}
// -----------------------------------------------------------------------------------------
// DistributeUnion
// -----------------------------------------------------------------------------------------
type TDistributeUnion<Types extends TSchema[], Distribution extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
   ? TDistributeUnion<Right, Distribution, [...Result, ...TDistribute<[Left], Distribution>]>
   : Result
)
function DistributeUnion<Types extends TSchema[], Distribution extends TSchema[]>(types: [...Types], distribution: [...Distribution], result: TSchema[] = []): TDistributeUnion<Types, Distribution> {
  return Guard.ShiftLeft(types, (left, right) => 
    DistributeUnion(right, distribution, [...result, ...Distribute([left], distribution)]),
    () => result) as never
}
// -----------------------------------------------------------------------------------------
// Distribute
// -----------------------------------------------------------------------------------------
export type TDistribute<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? Left extends TUnion<infer UnionTypes extends TSchema[]> 
      ? TDistribute<Right, TDistributeUnion<UnionTypes, Result>>
      : TDistribute<Right, TDistributeType<Left, Result>>
    : Result
)
export function Distribute<Types extends TSchema[]>(types: [...Types], result: TSchema[] = []): TDistribute<Types> {
  return Guard.ShiftLeft(types, (left, right) => 
    IsUnion(left)
      ? Distribute(right, DistributeUnion(left.anyOf, result))
      : Distribute(right, DistributeType(left, result)),
    () => result) as never
}
