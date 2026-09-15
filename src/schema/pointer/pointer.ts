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
// Indices
// ------------------------------------------------------------------
export function Indices(pointer: string): string[] {
  const indices = pointer.split('/').map(index => index.replace(/~1/g, '/').replace(/~0/g, '~'))
  return indices[0] === '' ? indices.slice(1) : indices
}
// ------------------------------------------------------------------
// Has
// ------------------------------------------------------------------
export function Has(value: unknown, pointer: string): boolean {
  let current = value
  for (const index of Indices(pointer)) {
    if (!Guard.IsObject(current) || !Guard.HasPropertyKey(current, index)) return false
    current = current[index]
  }
  return true
}
// ------------------------------------------------------------------
// Get
// ------------------------------------------------------------------
export function Get(value: unknown, pointer: string): unknown {
  let current = value
  for (const index of Indices(pointer)) {
    if (!Guard.IsObject(current) || Guard.IsUnsafePropertyKey(index)) return undefined
    current = current[index]
  }
  return current
}
// ------------------------------------------------------------------
// Get
// ------------------------------------------------------------------
function Parent(value: unknown, indices: string[], last: string): Record<string, unknown> {
  let current = value
  for (const index of indices) {
    if (Guard.IsUnsafePropertyKey(index)) ThrowUnsafePropertyKey()
    current = Guard.IsObject(current) ? current[index] : undefined
  }
  if (Guard.IsUnsafePropertyKey(last)) ThrowUnsafePropertyKey()
  if (!Guard.IsObject(current)) ThrowCannotSetRoot()
  return current
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
export function Set(value: unknown, pointer: string, next: unknown): unknown {
  const indices = Indices(pointer)
  const last = indices.pop()
  if (Guard.IsUndefined(last)) ThrowCannotSetRoot()
  Parent(value, indices, last)[last] = next
  return value
}
// ------------------------------------------------------------------
// Delete
// ------------------------------------------------------------------
export function Delete(value: unknown, pointer: string): unknown {
  const indices = Indices(pointer)
  const last = indices.pop()
  if (Guard.IsUndefined(last)) ThrowCannotSetRoot()
  const parent = Parent(value, indices, last)
  if (Guard.IsArray(parent) && /^(0|[1-9]\d*)$/.test(last)) {
    parent.splice(Number(last), 1)
  } else {
    delete parent[last]
  }
  return value
}