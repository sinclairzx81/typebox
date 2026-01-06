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
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticUndefined = undefined
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a Undefined type. */
export interface TUndefined extends TSchema {
  '~kind': 'Undefined'
  type: 'undefined'
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Undefined type. */
export function Undefined(options?: TSchemaOptions): TUndefined {
  return Memory.Create({ '~kind': 'Undefined' }, { type: 'undefined' },  options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TUndefined. */
export function IsUndefined(value: unknown): value is TUndefined {
  return IsKind(value, 'Undefined')
}