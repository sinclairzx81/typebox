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

// deno-lint-ignore-file ban-types
// deno-fmt-ignore-file

import { type TSchema } from '../../types/index.ts'
import { type TExtends, Extends, ExtendsResult } from "../../extends/index.ts"

// ------------------------------------------------------------------
// TCompare
// ------------------------------------------------------------------
export const CompareResultEqual = 0 // 'equal'
export const CompareResultDisjoint = 1 // 'disjoint'
export const CompareResultLeftInside = 2 // 'left-inside'
export const CompareResultRightInside = 3 // 'right-inside'

export type TCompareResult = (
  | typeof CompareResultEqual // left and right equal
  | typeof CompareResultDisjoint // left and right are disjoint
  | typeof CompareResultLeftInside // left inside right set
  | typeof CompareResultRightInside // right inside left set
)
/** Compares left and right types and determines their set relationship */
export type TCompare<Left extends TSchema, Right extends TSchema, 
  Extends extends [ExtendsResult.TResult, ExtendsResult.TResult] = [TExtends<{}, Left, Right>, TExtends<{}, Right, Left>]
> = (
  Extends extends [ExtendsResult.TExtendsTrueLike, ExtendsResult.TExtendsTrueLike] ? typeof CompareResultEqual :
  Extends extends [ExtendsResult.TExtendsTrueLike, ExtendsResult.TExtendsFalse] ? typeof CompareResultLeftInside :
  Extends extends [ExtendsResult.TExtendsFalse, ExtendsResult.TExtendsTrueLike] ? typeof CompareResultRightInside :
  typeof CompareResultDisjoint
)
/** Compares left and right types and determines their set relationship. */
export function Compare<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TCompare<Left, Right> {
  const extendsCheck = [Extends({}, left, right), Extends({}, right, left)]
  return (
    ExtendsResult.IsExtendsTrueLike(extendsCheck[0]) && ExtendsResult.IsExtendsTrueLike(extendsCheck[1]) ? CompareResultEqual :
    ExtendsResult.IsExtendsTrueLike(extendsCheck[0]) && ExtendsResult.IsExtendsFalse(extendsCheck[1]) ? CompareResultLeftInside :
    ExtendsResult.IsExtendsFalse(extendsCheck[0]) && ExtendsResult.IsExtendsTrueLike(extendsCheck[1]) ? CompareResultRightInside :
    CompareResultDisjoint
  ) as never
}
