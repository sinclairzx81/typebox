/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

import { Memory } from '../../../system/memory/index.ts'
import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TFromType, FromType } from './from-type.ts'
import { type TEvaluateIntersect, EvaluateIntersect } from '../evaluate/evaluate.ts'

// ------------------------------------------------------------------
// CollapseProperties
// ------------------------------------------------------------------
type TCollapseIntersectProperties<Left extends TProperties, Right extends TProperties,
  LeftKeys extends keyof Left = Exclude<keyof Left, keyof Right>,
  RightKeys extends keyof Right = Exclude<keyof Right, keyof Left>,
  SharedKeys extends keyof Left & keyof Right = Extract<keyof Left, keyof Right>,

  LeftProperties extends TProperties = { [Key in LeftKeys]: Left[Key] },
  RightProperties extends TProperties = { [Key in RightKeys]: Right[Key] },
  SharedProperties extends TProperties = { [Key in SharedKeys]: TEvaluateIntersect<[Left[Key], Right[Key]]> },

  Unique extends TProperties = Memory.TAssign<LeftProperties, RightProperties>,
  Shared extends TProperties = Memory.TAssign<Unique, SharedProperties>
> = Shared

function CollapseIntersectProperties<Left extends TProperties, Right extends TProperties>(left: Left, right: Right): TCollapseIntersectProperties<Left, Right> {
  const leftKeys = Guard.Keys(left).filter((key) => !Guard.HasPropertyKey(right, key))
  const rightKeys = Guard.Keys(right).filter((key) => !Guard.HasPropertyKey(left, key))
  const sharedKeys = Guard.Keys(left).filter((key) => Guard.HasPropertyKey(right, key))

  const leftProperties = leftKeys.reduce((result, key) => ({ ...result, [key]: left[key] }), {})
  const rightProperties = rightKeys.reduce((result, key) => ({ ...result, [key]: right[key] }), {})
  const sharedProperties = sharedKeys.reduce((result, key) => ({ ...result, [key]: EvaluateIntersect([left[key], right[key]]) }), {})

  const unique = Memory.Assign(leftProperties, rightProperties)
  const shared = Memory.Assign(unique, sharedProperties)
  return shared as never
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
export type TFromIntersect<Types extends TSchema[], Result extends TProperties = {}> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? TFromIntersect<Right, TCollapseIntersectProperties<Result, TFromType<Left>>>
  : { [Key in keyof Result]: Result[Key] }
)
export function FromIntersect<Types extends TSchema[]>(types: [...Types]): TFromIntersect<Types> {
  return types.reduce((result, left) => {
    return CollapseIntersectProperties(result, FromType(left))
  }, {}) as never
}
