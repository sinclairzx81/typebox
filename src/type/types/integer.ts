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

import { Memory } from '../../system/memory/index.ts'
import { type TSchema, type TNumberOptions, IsKind } from './schema.ts'

// ------------------------------------------------------------------
// Pattern
// ------------------------------------------------------------------
export const IntegerPattern = '-?(?:0|[1-9][0-9]*)'
// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticInteger = number
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents an integer type. */
export interface TInteger extends TSchema {
  '~kind': 'Integer'
  type: 'integer'
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Integer type. */
export function Integer(options?: TNumberOptions): TInteger {
  return Memory.Create({ '~kind': 'Integer' }, { type: 'integer' }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TInteger. */
export function IsInteger(value: unknown): value is TInteger {
  return IsKind(value, 'Integer')
}