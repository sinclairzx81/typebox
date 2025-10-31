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

import * as Schema from '../types/index.ts'
import { Guard } from '../../guard/index.ts'
import { FindIdQualified, FindIdExact } from './find-id.ts'
import { FindPointer } from './find-pointer.ts'
import { FindAnchor } from './find-anchor.ts'
import { Fragment } from './fragment.ts'

// ------------------------------------------------------------------
// FindUriWithFragment
// ------------------------------------------------------------------
function FindIdWithFragment(schema: Schema.XSchema, ref: string, base: URL) {
  const [id, fragment] = ref.includes('#') ? ref.split('#') : [ref, '']
  const found = FindIdQualified(schema, id, base)
  if (Guard.IsUndefined(found)) return found
  if (Guard.IsEqual(fragment, '')) return found
  return FindFragment(found, `#${fragment}`)
}
// ------------------------------------------------------------------
// FindFragment
// ------------------------------------------------------------------
function FindFragment(schema: Schema.XSchema, ref: string) {
  const fragment = Fragment(ref)
  return (
    FindIdExact(schema, ref) ??
    FindPointer(schema, fragment) ??
    FindAnchor(schema, fragment)
  )
}
// ------------------------------------------------------------------
// FindRef
// ------------------------------------------------------------------
export function FindRef(root: Schema.XSchema, base: URL, ref: string): Schema.XSchema | undefined {
  base = Schema.IsId(root) ? new URL(root.$id, base) : base
  return FindIdWithFragment(root, new URL(ref, base).href, base) ?? FindFragment(root, ref)
}
