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

import { Guard, GlobalsGuard } from '../../guard/index.ts'
import { MutateError } from './error.ts'
import { FromValue } from './from-value.ts'

export type TMutable = { [key: string]: unknown } | unknown[]

// ------------------------------------------------------------------
// IsNonMutableValue
// ------------------------------------------------------------------
function IsNonMutableValue(value: unknown): value is TMutable {
  return GlobalsGuard.IsTypeArray(value) 
    || GlobalsGuard.IsDate(value)
    || GlobalsGuard.IsMap(value)
    || GlobalsGuard.IsSet(value)
    || Guard.IsNumber(value)
    || Guard.IsString(value)
    || Guard.IsBoolean(value)
    || Guard.IsSymbol(value)
}
// ------------------------------------------------------------------
// IsTrueObject
// ------------------------------------------------------------------
function IsMismatchedValue(left: unknown, right: unknown): boolean {
  return (
    (Guard.IsObjectNotArray(left) && Guard.IsArray(right)) || 
    (Guard.IsArray(left) && Guard.IsObjectNotArray(right))
  )
}
// ------------------------------------------------------------------
// Mutate
// ------------------------------------------------------------------
/** 
 * Performs a deep structural assignment, applying values from next to current while retaining internal references. This function 
 * is written for use in infrastructure that interprets reference changes as a signal to perform some action (i.e. React redraw), this
 * function can mitigate this by applying mutable updates deep within a value, ensuring parent references are retained.
 */
export function Mutate(current: TMutable, next: TMutable): void {
  if (IsNonMutableValue(current) || IsNonMutableValue(next)) throw new MutateError('Only object and array types can be mutated at the root level')
  if (IsMismatchedValue(current, next)) throw new MutateError('Cannot assign due type mismatch of assignable values')
  FromValue(current, '', current, next)
}
