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

import { Clone } from '../clone/index.ts'
import { Pointer } from '../pointer/index.ts'

import { type TEdit, type TUpdate } from './edit.ts'

function IsRoot(edits: TEdit[]): edits is [TUpdate] {
  return edits.length > 0 && edits[0].path === '' && edits[0].type === 'update'
}
function IsEmpty(edits: TEdit[]): edits is [] {
  return edits.length === 0
}
// ------------------------------------------------------------------
// Patch
// ------------------------------------------------------------------
/**
 * Applies a sequence of Edit commands to a current value, producing a new value that incorporates 
 * all edits. This function returns unknown so callers should Check the return value before use. 
 * This function mutates the provided value. If mutation is not wanted, you should Clone the value 
 * before passing to this function.
 */
export function Patch(current: unknown, edits: TEdit[]): unknown {
  if (IsRoot(edits)) return Clone(edits[0].value)
  if (IsEmpty(edits)) return Clone(current)
  const clone = Clone(current) as Record<PropertyKey, unknown>
  for (const edit of edits) {
    switch (edit.type) {
      case 'insert': {
        Pointer.Set(clone, edit.path, edit.value)
        break
      }
      case 'update': {
        Pointer.Set(clone, edit.path, edit.value)
        break
      }
      case 'delete': {
        Pointer.Delete(clone, edit.path)
        break
      }
    }
  }
  return clone
}