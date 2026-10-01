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

import { Hashing } from '../../system/index.ts'
import { Guard } from '../../guard/index.ts'
import * as Schema from '../types/index.ts'

const HASH_PREFIX = 'x-'
const DEFS_PREFIX = '#/$defs/'
const PLACEHOLDER_PREFIX = 'x-ref-'

// ------------------------------------------------------------------
// HashKey
// ------------------------------------------------------------------
export function HashKey(schema: Schema.XSchema): string {
  return `${HASH_PREFIX}${Hashing.Hash(schema)}`
}
export function IsHashKey(key: string, schema: Schema.XSchema): boolean {
  return key.startsWith(HASH_PREFIX) && Guard.IsEqual(key, HashKey(schema))
}
// ------------------------------------------------------------------
// PlaceholderKey
// ------------------------------------------------------------------
export function PlaceholderKey(completed: number, depth: number): string {
  return `${PLACEHOLDER_PREFIX}${completed}-${depth}`
}
export function IsPlaceholderKey(key: string): boolean {
  return key.startsWith(PLACEHOLDER_PREFIX)
}
// ------------------------------------------------------------------
// DefsRef
// ------------------------------------------------------------------
export function DefsRef(key: string): string {
  return `${DEFS_PREFIX}${key}`
}
export function IsDefsRef(ref: string): boolean {
  return ref.startsWith(DEFS_PREFIX)
}
export function DefsKey(ref: string): string {
  return ref.slice(DEFS_PREFIX.length)
}
