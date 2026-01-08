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
import { type TSchema, IsSchema } from '../../types/schema.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TObject, IsObject } from '../../types/object.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'
import { type TComposite, Composite } from './composite.ts'
import { type TNarrow, Narrow } from './narrow.ts'

import { type TEvaluateType, EvaluateType } from './evaluate.ts'
import { type TEvaluateIntersect, EvaluateIntersect } from './evaluate.ts'

// ------------------------------------------------------------------
// IsObjectLike
// ------------------------------------------------------------------
type TIsObjectLike<Type extends TSchema> 
  = Type extends TObject | TTuple ? true : false
function IsObjectLike<Type extends TSchema>(type: Type) {
  return IsObject(type) || IsTuple(type)
}
// ------------------------------------------------------------------
// IsUnionOperand
// ------------------------------------------------------------------
type TIsUnionOperand<Left extends TSchema, Right extends TSchema,
  IsUnionLeft extends boolean = Left extends TUnion ? true : false,
  IsUnionRight extends boolean = Right extends TUnion ? true : false,
  Result extends boolean = IsUnionLeft extends true ? true : IsUnionRight extends true ? true : false
> = Result
function IsUnionOperand<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TIsUnionOperand<Left, Right> {
  const isUnionLeft = IsUnion(left)
  const isUnionRight = IsUnion(right)
  const result = isUnionLeft || isUnionRight
  return result as never
}
// -----------------------------------------------------------------------------------------
// DistributeOperation
// -----------------------------------------------------------------------------------------
type TDistributeOperation<Left extends TSchema, Right extends TSchema,
  EvaluatedLeft extends TSchema = TEvaluateType<Left>,
  EvaluatedRight extends TSchema = TEvaluateType<Right>,
  IsUnionOperand extends boolean = TIsUnionOperand<EvaluatedLeft, EvaluatedRight>,
  IsObjectLeft extends boolean = TIsObjectLike<EvaluatedLeft>,
  IsObjectRight extends boolean = TIsObjectLike<EvaluatedRight>,
  Result extends TSchema = (
    [IsUnionOperand] extends [true] ? TEvaluateIntersect<[EvaluatedLeft, EvaluatedRight]> :
    [IsObjectLeft, IsObjectRight] extends [true, true] ? TComposite<EvaluatedLeft, EvaluatedRight> :
    [IsObjectLeft, IsObjectRight] extends [true, false] ? EvaluatedLeft :
    [IsObjectLeft, IsObjectRight] extends [false, true] ? EvaluatedRight :
    TNarrow<EvaluatedLeft, EvaluatedRight>
  )
> = Result
function DistributeOperation<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TDistributeOperation<Left, Right> {
  const evaluatedLeft = EvaluateType(left)
  const evaluatedRight = EvaluateType(right)
  const isUnionOperand = IsUnionOperand(evaluatedLeft, evaluatedRight)
  const isObjectLeft = IsObjectLike(evaluatedLeft)
  const IsObjectRight = IsObjectLike(evaluatedRight)
  const result = (
    isUnionOperand ? EvaluateIntersect([evaluatedLeft, evaluatedRight]) :
    isObjectLeft && IsObjectRight ? Composite(evaluatedLeft, evaluatedRight) :
    isObjectLeft && !IsObjectRight ? evaluatedLeft :
    !isObjectLeft && IsObjectRight ? evaluatedRight :
    Narrow(evaluatedLeft, evaluatedRight)
  )
  return result as never
}
// -----------------------------------------------------------------------------------------
// DistributeType
// -----------------------------------------------------------------------------------------
type TDistributeType<Type extends TSchema, Distribution extends TSchema[], Result extends TSchema[] = []> = (
  Distribution extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TDistributeType<Type, Right, [ ...Result, TDistributeOperation<Type, Left>]>
    : Result extends [] 
      ? [Type] 
      : Result
)
function DistributeType<Type extends TSchema, Distribution extends TSchema[]>(type: Type, types: [...Distribution], result: TSchema[] = []): TDistributeType<Type, Distribution> {
  const [left, ...right]  = types
  return (
    !Guard.IsUndefined(left) // TSchema[]
      ? DistributeType(type, right, [...result, DistributeOperation(type, left)])
      : result.length === 0
        ? [type]
        : result
  ) as never
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
  const [left, ...right] = types
  return (
    IsSchema(left)
      ? DistributeUnion(right, distribution, [...result, ...Distribute([left], distribution)])
      : result
  ) as never
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
  const [left, ...right] = types
  return (
    IsSchema(left)
      ? IsUnion(left) 
        ? Distribute(right, DistributeUnion(left.anyOf, result))
        : Distribute(right, DistributeType(left, result))
      : result
  ) as never
}
