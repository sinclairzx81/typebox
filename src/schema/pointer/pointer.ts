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

// ------------------------------------------------------------------
// Throw
// ------------------------------------------------------------------
function Throw(message: string): never {
  throw Error(message)
}
function ThrowUnsafePropertyKey(): never {
  Throw('Pointer contains unsafe property key')
}
function ThrowCannotSetRoot(): never {
  Throw('Cannot set value')
}
// ------------------------------------------------------------------
// EncodeFragment
// ------------------------------------------------------------------
/** Encodes a JSON Pointer fragment */
export function EncodeFragment(fragment: string): string {
  return fragment.replace(/~/g, '~0').replace(/\//g, '~1')
}
// ------------------------------------------------------------------
// DecodeFragment
// ------------------------------------------------------------------
/** Decodes a JSON Pointer fragment */
export function DecodeFragment(fragment: string): string {
  return fragment.replace(/~1/g, '/').replace(/~0/g, '~')
}
// ------------------------------------------------------------------
// Fragments
// ------------------------------------------------------------------
/** Returns the decoded fragments of a JSON Pointer */
export function Fragments(pointer: string): string[] {
  const fragments = pointer.split('/').map(DecodeFragment)
  return fragments[0] === '' ? fragments.slice(1) : fragments
}
// ------------------------------------------------------------------
// Has
// ------------------------------------------------------------------
export function Has(value: unknown, pointer: string): boolean {
  let current = value
  for (const fragment of Fragments(pointer)) {
    if (!Guard.IsObject(current) || !Guard.HasPropertyKey(current, fragment)) return false
    current = current[fragment]
  }
  return true
}
// ------------------------------------------------------------------
// Get
// ------------------------------------------------------------------
export function Get(value: unknown, pointer: string): unknown {
  let current = value
  for (const fragment of Fragments(pointer)) {
    if (!Guard.IsObject(current) || Guard.IsUnsafePropertyKey(fragment)) return undefined
    current = current[fragment]
  }
  return current
}
// ------------------------------------------------------------------
// Parent
// ------------------------------------------------------------------
function Parent(value: unknown, fragments: string[], last: string): Record<string, unknown> {
  let current = value
  for (const fragment of fragments) {
    if (Guard.IsUnsafePropertyKey(fragment)) ThrowUnsafePropertyKey()
    current = Guard.IsObject(current) ? current[fragment] : undefined
  }
  if (Guard.IsUnsafePropertyKey(last)) ThrowUnsafePropertyKey()
  if (!Guard.IsObject(current)) ThrowCannotSetRoot()
  return current
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
export function Set(value: unknown, pointer: string, next: unknown): unknown {
  const fragments = Fragments(pointer)
  const last = fragments.pop()
  if (Guard.IsUndefined(last)) ThrowCannotSetRoot()
  Parent(value, fragments, last)[last] = next
  return value
}
// ------------------------------------------------------------------
// Delete
// ------------------------------------------------------------------
export function Delete(value: unknown, pointer: string): unknown {
  const fragments = Fragments(pointer)
  const last = fragments.pop()
  if (Guard.IsUndefined(last)) ThrowCannotSetRoot()
  const parent = Parent(value, fragments, last)
  if (Guard.IsArray(parent) && /^(0|[1-9]\d*)$/.test(last)) {
    parent.splice(Number(last), 1)
  } else {
    delete parent[last]
  }
  return value
}