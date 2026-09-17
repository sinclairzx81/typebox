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

import * as Schema from '../../../schema/index.ts'
import { StaticSchema } from './schema.ts'

// ------------------------------------------------------------------
// CyclicGuard
// ------------------------------------------------------------------
function CyclicCheck(stack: string[], maxLength: number): boolean {
  return stack.length <= maxLength
}
function CyclicGuard(stack: string[], ref: string): boolean {
  return stack.includes(ref) ? CyclicCheck(stack, 2) : true
}
// ------------------------------------------------------------------
// Normal
// ------------------------------------------------------------------
function Normal(pointer: string): string {
  return pointer.startsWith('#') ? pointer.slice(1) : pointer
}
// ------------------------------------------------------------------
// StaticRef
// ------------------------------------------------------------------
export function StaticRef(stack: string[], root: Schema.XSchema, ref: string): string {
  const normal = Normal(ref)
  const target = Schema.Pointer.Get(root, normal)
  const schema = Schema.IsSchema(target) ? target : {}
  return CyclicGuard(stack, ref)
    ? StaticSchema([...stack, ref], root, schema)
    : 'any' // terminate-recursive
}