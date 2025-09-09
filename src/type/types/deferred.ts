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

import { Memory } from '../../system/memory/index.ts'
import { IsKind, type TSchema, type TSchemaOptions } from './schema.ts'

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
/** Represents a deferred action. */
export interface TDeferred<Action extends string = string, Types extends TSchema[] = TSchema[]> extends TSchema {
  '~kind': 'Deferred'
  action: Action
  parameters: Types
  options: TSchemaOptions
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Deferred action. */
export function Deferred<Action extends string, Types extends TSchema[]>(action: Action, parameters: [...Types], options: TSchemaOptions): TDeferred<Action, Types> {
  return Memory.Create({ '~kind': 'Deferred' }, { action, parameters, options }, {}) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TDeferred. */
export function IsDeferred(value: unknown): value is TDeferred {
  return IsKind(value, 'Deferred')
}
