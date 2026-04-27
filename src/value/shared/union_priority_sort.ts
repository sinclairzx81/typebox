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

import { Guard } from '../../guard/index.ts'
import { Compare, type TSchema } from '../../type/index.ts'

// ------------------------------------------------------------------
// DeterministicCompare
//
// Provides a deterministic tie-break for schemas. This is used when
// schemas are structurally disjoint or mutually inclusive. While
// JSON serialization incurs a performance overhead, it serves as a
// reliable mechanism to ensure stable ordering and preserves the
// alphabetical alignment of named constants.
//
// ------------------------------------------------------------------
function DeterministicCompare(left: TSchema, right: TSchema): number {
  return JSON.stringify(left).localeCompare(JSON.stringify(right))
}
// ------------------------------------------------------------------
// UnionPrioritySort
//
// Performs a deterministic sort on Union members. By default, this
// function ensures that narrow (more specific) types precede broader
// types in the resulting array. The order can be reversed by setting
// the order property to -1 which will reverse unions from broader
// to more narrow.
//
// ------------------------------------------------------------------

/** Deterministically sorts schemas by structural relationship (narrow to broad) */
export function UnionPrioritySort(types: TSchema[], order: number = 1): TSchema[] {
  return types.sort((left, right) => {
    const result = Compare(left, right) as string
    return (
      Guard.IsEqual(result, 'disjoint') ? DeterministicCompare(left, right) : 
      Guard.IsEqual(result, 'right-inside') ? 1 : 
      Guard.IsEqual(result, 'left-inside') ? -1 : 
      DeterministicCompare(left, right)
    ) * order
  })
}
