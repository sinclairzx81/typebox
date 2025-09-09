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

import { type TSchema } from '../../types/index.ts'
import { type TUnknown, IsUnknown } from '../../types/unknown.ts'
import { type TExtends, Extends, ExtendsResult } from "../../extends/index.ts"

// ------------------------------------------------------------------
// TCompare
// ------------------------------------------------------------------
export const ResultEqual = 'equal'
export const ResultDisjoint = 'disjoint'
export const ResultLeftInside = 'left-inside'
export const ResultRightInside = 'right-inside'

export type TCompareResult = 
  | typeof ResultEqual         // left and right equal
  | typeof ResultDisjoint      // left and right are disjoint
  | typeof ResultLeftInside    // left inside right set
  | typeof ResultRightInside   // right inside left set

/** Compares left and right types and determines their set relationship */
export type TCompare<Left extends TSchema, Right extends TSchema, 
  Extends extends [ExtendsResult.TResult, ExtendsResult.TResult] = [
    Left extends TUnknown ? ExtendsResult.TExtendsFalse : TExtends<{}, Left, Right>,
    Left extends TUnknown ? ExtendsResult.TExtendsTrue : TExtends<{}, Right, Left>,
  ]
> = ( // TCompareResult
  Extends extends [ExtendsResult.TExtendsTrueLike, ExtendsResult.TExtendsTrueLike] ? typeof ResultEqual :
  Extends extends [ExtendsResult.TExtendsTrueLike, ExtendsResult.TExtendsFalse] ? typeof ResultLeftInside :
  Extends extends [ExtendsResult.TExtendsFalse, ExtendsResult.TExtendsTrueLike] ? typeof ResultRightInside :
  typeof ResultDisjoint
)
/** Compares left and right types and determines their set relationship. */
export function Compare<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TCompare<Left, Right> {
  const extendsCheck = [
    IsUnknown(left) ? ExtendsResult.ExtendsFalse() : Extends({}, left, right),
    IsUnknown(left) ? ExtendsResult.ExtendsTrue({}) : Extends({}, right, left),
  ]
  return (
    ExtendsResult.IsExtendsTrueLike(extendsCheck[0]) && ExtendsResult.IsExtendsTrueLike(extendsCheck[1]) ? ResultEqual :
    ExtendsResult.IsExtendsTrueLike(extendsCheck[0]) && ExtendsResult.IsExtendsFalse(extendsCheck[1]) ? ResultLeftInside :
    ExtendsResult.IsExtendsFalse(extendsCheck[0]) && ExtendsResult.IsExtendsTrueLike(extendsCheck[1]) ? ResultRightInside :
    ResultDisjoint
  ) as never
}
