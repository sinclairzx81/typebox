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

import { Arguments } from '../../system/arguments/index.ts'
import { Memory } from '../../system/memory/index.ts'
import { type TSchema, IsKind } from '../types/schema.ts'
import { type TUnknown, Unknown } from '../types/unknown.ts'

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
/** Represents an Infer instruction. */
export interface TInfer<Name extends string = string, Extends extends TSchema = TSchema> extends TSchema {
  '~kind': 'Infer'
  type: 'infer'
  name: Name
  extends: Extends
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates an Infer instruction. */
export function Infer<Name extends string, Extends extends TSchema>(name: Name, extends_: Extends): TInfer<Name, Extends>
/** Creates an Infer instruction. */
export function Infer<Name extends string>(name: Name): TInfer<Name, TUnknown>
/** Creates an Infer instruction. */
export function Infer(...args: unknown[]): never {
  const [name, extends_] = Arguments.Match<[string, TSchema]>(args, {
    2: (name, extends_) => [name, extends_, extends_],
    1: (name) => [name, Unknown(), Unknown()],
  })
  return Memory.Create({ ['~kind']: 'Infer' }, { type: 'infer', name, extends: extends_ }, {}) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TInfer. */
export function IsInfer(value: unknown): value is TInfer {
  return IsKind(value, 'Infer')
}