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

import { type TUnreachable, Unreachable } from '../../../system/unreachable/index.ts'
import { Guard } from '../../../guard/index.ts'
import { type TSchema, IsSchema } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TEvaluateUnion, EvaluateUnion } from '../evaluate/evaluate.ts'
import { type TFromType, FromType } from './from-type.ts'

// ------------------------------------------------------------------
// CollapseUnionProperties
// ------------------------------------------------------------------
type TCollapseUnionProperties<Left extends TProperties, Right extends TProperties,
  SharedKeys extends PropertyKey = keyof Left & keyof Right,
  Result extends TProperties = {
    [Key in SharedKeys]: TEvaluateUnion<[Left[Key], Right[Key]]>
  }
> = Result
function CollapseUnionProperties<Left extends TProperties, Right extends TProperties>
  (left: Left, right: Right): 
    TCollapseUnionProperties<Left, Right> {
  const sharedKeys = Guard.Keys(left).filter((key) => key in right)
  const result = sharedKeys.reduce((result, key) => {
    return { ...result, [key]: EvaluateUnion([left[key], right[key]]) }
  }, {}) as never
  return result as never
}
// ------------------------------------------------------------------
// ReduceVariants
// ------------------------------------------------------------------
type TReduceVariants<Types extends TSchema[], Result extends TProperties> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? TReduceVariants<Right, TCollapseUnionProperties<Result, TFromType<Left>>>
  : Result
)
function ReduceVariants<Types extends TSchema[], Result extends TProperties>
  (types: [...Types], result: Result):
    TReduceVariants<Types, Result> {
  const [left, ...right] = types
  return (
    IsSchema(left)
      ? ReduceVariants(right, CollapseUnionProperties(result, FromType(left)))
      : result
  ) as never
}
// ------------------------------------------------------------------
// FromUnion
//
// deno-coverage-ignore-start - symmetric unreachable
//
// Interesting case where we need to destructure the first element as
// an initializer for TReduceVariants. These cases are quite rare.
//
// ------------------------------------------------------------------
export type TFromUnion<Types extends TSchema[]> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? TReduceVariants<Right, TFromType<Left>>
  : TUnreachable
)
export function FromUnion<Types extends TSchema[]>
  (types: [...Types]): 
    TFromUnion<Types> {
  const [left, ...right] = types
  return (
    IsSchema(left)
      ? ReduceVariants(right, FromType(left))
      : Unreachable()
  ) as never
}
// deno-coverage-ignore-stop
