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
import { type TAny, IsAny } from '../../types/any.ts'
import { type TNever, Never, IsNever } from '../../types/never.ts'
import { type TUnknown, IsUnknown } from '../../types/unknown.ts'
import { type TCompare, type TCompareResult, Compare, CompareResultLeftInside, CompareResultRightInside, CompareResultEqual } from './compare.ts'
import { type TComposite, type TCanComposite, Composite, CanComposite } from './composite.ts'

// ------------------------------------------------------------------
// NarrowCompareRule
// ------------------------------------------------------------------
type TNarrowCompareRule<Left extends TSchema, Right extends TSchema,
  Result extends TCompareResult = TCompare<Left, Right>,
> = (
  Result extends typeof CompareResultLeftInside  ? Left  :
  Result extends typeof CompareResultRightInside ? Right :
  Result extends typeof CompareResultEqual ? Right : 
  TNever
)
function NarrowCompareRule<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TNarrow<Left, Right> {
  const result = Compare(left, right) as TCompareResult
  return (
    Guard.IsEqual(result, CompareResultLeftInside) ? left :
    Guard.IsEqual(result, CompareResultRightInside) ? right :
    Guard.IsEqual(result, CompareResultEqual) ? right :
    Never()
  ) as never
}
// ------------------------------------------------------------------
// NarrowCompositeRule
// ------------------------------------------------------------------
type TNarrowCompositeRule<Left extends TSchema, Right extends TSchema,
  CanCompositeLeft extends boolean = TCanComposite<Left>,
  CanCompositeRight extends boolean = TCanComposite<Right>,
> = (
  [CanCompositeLeft, CanCompositeRight] extends [true, true] ? TComposite<Left, Right> :
  [CanCompositeLeft, CanCompositeRight] extends [true, false] ? Left :
  [CanCompositeLeft, CanCompositeRight] extends [false, true] ? Right :
  TNarrowCompareRule<Left, Right>
)
function NarrowCompositeRule<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TNarrowCompositeRule<Left, Right> {
  const canCompositeLeft = CanComposite(left)
  const canCompositeRight = CanComposite(right)
  return (
    canCompositeLeft && canCompositeRight ? Composite(left, right) :
    canCompositeLeft && !canCompositeRight ? left :
    !canCompositeLeft && canCompositeRight ? right :
    NarrowCompareRule(left, right)
  ) as never
}
// ------------------------------------------------------------------
// Narrow
// ------------------------------------------------------------------
export type TNarrow<Left extends TSchema, Right extends TSchema> = (
  Left extends TNever ? TNever :
  Left extends TAny ? TAny :
  Left extends TUnknown ? Right :
  Right extends TNever ? TNever :
  Right extends TAny ? TAny :
  Right extends TUnknown ? Left :
  TNarrowCompositeRule<Left, Right>
)
export function Narrow<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TNarrow<Left, Right> {
  return (
    IsNever(left) ? left :
    IsAny (left) ? left :
    IsUnknown(left) ? right :
    IsNever(right) ? right :
    IsAny (right) ? right :
    IsUnknown(right) ? left :
    NarrowCompositeRule(left, right)
  ) as never
}
