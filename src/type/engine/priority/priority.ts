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
import { type TCompare, type TCompareResult, Compare } from '../evaluate/compare.ts'

// ------------------------------------------------------------------
// Comparer
// ------------------------------------------------------------------
type TComparer<Left extends TSchema, Right extends TSchema,
  CompareResult extends TCompareResult = TCompare<Left, Right>,
  Result extends 0 | 1 = (
    CompareResult extends 'right-inside' ? 1 :
    CompareResult extends 'disjoint' ? 1 :
    0
  )
> = Result
function Comparer<Left extends TSchema, Right extends TSchema>
  (left: Left, right: Right): TComparer<Left, Right> {
  const compareResult = Compare(left, right)
  const result = (
    Guard.IsEqual(compareResult, 'right-inside') ? 1 : 
    Guard.IsEqual(compareResult, 'disjoint') ? 1 :
    0
  )
  return result as never
}
// ------------------------------------------------------------------
// Insert
// ------------------------------------------------------------------
type TInsert<Type extends TSchema, Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TComparer<Type, Left> extends 1
      ? TInsert<Type, Right, [...Result, Left]>
      : [...Result, Type, ...Types]
    : [...Result, Type]
)
function Insert<Type extends TSchema, Types extends TSchema[]>(type: Type, types: [...Types], result: TSchema[] = []): TInsert<Type, Types> {
  return Guard.ShiftLeft(types, (left, right) =>
    Guard.IsEqual(Comparer(type, left), 1)
      ? Insert(type, right, [...result, left])
      : [...result, type, ...types],
    () => [...result, type]) as never
}
// ------------------------------------------------------------------
// Sort
// ------------------------------------------------------------------
type TSort<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TSort<Right, TInsert<Left, Result>>
    : Result
)
function Sort<Types extends TSchema[]>(types: [...Types], result: TSchema[] = []): TSort<Types> {
  return Guard.ShiftLeft(types, (left, right) =>
    Sort(right, Insert(left, result)),
    () => result) as never
}
// ------------------------------------------------------------------
// Priority
// ------------------------------------------------------------------
/** 
 * Priority sorts types in sequence of narrowest to broadest using an Insertion Sort
 * algorithm. This function is typically used to sequence types for union variant
 * checks to ensure that values are checked against the most narrow types before
 * the broadest, which in turn helps ensure order-independent Union checking.
 */
export type TPriority<Types extends TSchema[],
  Result extends TSchema[] = TSort<Types>,
> = Result
/** 
 * Priority sorts types in sequence of narrowest to broadest using an Insertion Sort
 * algorithm. This function is typically used to sequence types for union variant
 * checks to ensure that values are checked against the most narrow types before
 * the broadest, which in turn helps ensure order-independent Union checking.
 */
export function Priority<Types extends TSchema[]>
  (types: [...Types]): TPriority<Types> {
  const result = Sort(types) as TSchema[]
  return result as never
}