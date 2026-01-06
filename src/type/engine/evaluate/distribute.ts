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
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TObject, IsObject } from '../../types/object.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'
import { type TComposite, Composite } from './composite.ts'
import { type TNarrow, Narrow } from './narrow.ts'
import { type TEvaluateType, EvaluateType } from './evaluate.ts'

import { type TEvaluateIntersect, EvaluateIntersect } from './evaluate.ts'

// -----------------------------------------------------------------------------------------
// CanDistribute
// -----------------------------------------------------------------------------------------
type TCanDistribute<Type extends TSchema> 
  = Type extends TObject | TTuple ? true : false
function CanDistribute<Type extends TSchema>(type: Type) {
  return IsObject(type) || IsTuple(type)
}
// -----------------------------------------------------------------------------------------
//
// DistributeNormalize
//
// Distribute operands may be intersections, this function forces a conditional 
// sub-evaluation of an intersection to give either a TTObject | scalar. This 
// preflight mapping is used prior to running the logic for the DistributeOperation.
//
// -----------------------------------------------------------------------------------------
type TDistributeNormalize<Type extends TSchema> = 
  Type extends TIntersect<infer Types extends TSchema[]> 
    ? TEvaluateIntersect<Types> 
    : Type

function DistributeNormalize<Type extends TSchema>(type: Type): TDistributeNormalize<Type> {
  return (
    IsIntersect(type) 
      ? EvaluateIntersect(type.allOf) 
      : type
  ) as never
}
// -----------------------------------------------------------------------------------------
//
// DistributeOperation
//
// This function is crucial for type distribution and evaluation. Unlike TypeScript, 
// TypeBox does not distribute scalar types (e.g., numbers, strings) against object 
// types. When an object is encountered, the distribution shifts from scalar to 
// composite, with no option to revert to scalar distribution.
//
// This behavior is similar to TypeScript, where a number distributed against an object 
// is composited with the number's built-in methods. However, in TypeBox, numbers lack 
// methods and are treated as symbolic types. Discarding them is effectively the same 
// as compositing an empty `{}`. The empty object distribution for symbolic scalar 
// types is the rationale behind the following logic.
//
// -----------------------------------------------------------------------------------------
type TDistributeOperation<Left extends TSchema, Right extends TSchema,
  NormalLeft extends TSchema = TDistributeNormalize<Left>,
  NormalRight extends TSchema = TDistributeNormalize<Right>,
  IsObjectLeft extends boolean = TCanDistribute<NormalLeft>,
  IsObjectRight extends boolean = TCanDistribute<NormalRight>,
  Result extends TSchema = (
    [IsObjectLeft, IsObjectRight] extends [true, true] ? TComposite<TEvaluateType<NormalLeft>, NormalRight> :
    [IsObjectLeft, IsObjectRight] extends [true, false] ? TEvaluateType<NormalLeft> :
    [IsObjectLeft, IsObjectRight] extends [false, true] ? NormalRight :
    TNarrow<TEvaluateType<NormalLeft>, NormalRight>
  )
> = Result
function DistributeOperation<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TDistributeOperation<Left, Right> {
  const normalLeft = DistributeNormalize(left)
  const normalRight = DistributeNormalize(right)
  const isObjectLeft = CanDistribute(normalLeft)
  const IsObjectRight = CanDistribute(normalRight)
  const result = (
    isObjectLeft && IsObjectRight ? Composite(EvaluateType(normalLeft), normalRight) :
    isObjectLeft && !IsObjectRight ? EvaluateType(normalLeft) :
    !isObjectLeft && IsObjectRight ? normalRight :
    Narrow(EvaluateType(normalLeft), normalRight)
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
