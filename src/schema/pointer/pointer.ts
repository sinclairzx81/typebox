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
// Asserts
// ------------------------------------------------------------------
function AssertNotRoot(indices: string[]) {
  if(indices.length === 0) throw Error('Cannot set root')
}
function AssertCanSet(value: unknown): asserts value is Record<string, unknown> {
  if(!Guard.IsObject(value)) throw Error('Cannot set value')
}
// ------------------------------------------------------------------
// Indices
// ------------------------------------------------------------------
function IsNumericIndex(index: string): boolean {
  return /^(0|[1-9]\d*)$/.test(index)
}
function TakeIndexRight(indices: string[]): [string[], string] {
  return [
    indices.slice(0, indices.length - 1),
    indices.slice(indices.length - 1)[0]
  ]
}
function HasIndex(index: string, value: unknown): value is Record<string, unknown> {
  return Guard.IsObject(value) && Guard.HasPropertyKey(value, index)
}
function GetIndex(index: string, value: unknown): unknown {
  return Guard.IsObject(value) ? value[index] : undefined
}
function GetIndices(indices: string[], value: unknown): unknown {
  return indices.reduce((value, index) => GetIndex(index, value), value)
}
// ------------------------------------------------------------------
// Indices
// ------------------------------------------------------------------
/** Returns an array of path indices for the given pointer */
export function Indices(pointer: string): string[] {
  if (Guard.IsEqual(pointer.length, 0)) return []
  const indices = pointer.split("/").map(index => index.replace(/~1/g, "/").replace(/~0/g, "~"))
  return (indices.length > 0 && indices[0] === '') ? indices.slice(1) : indices
}
// ------------------------------------------------------------------
// Has
// ------------------------------------------------------------------
/** Returns true if a value exists at the current pointer */
export function Has(value: unknown, pointer: string): unknown {
  let current = value
  return Indices(pointer).every(index => {
    if(!HasIndex(index, current)) return false
    current = current[index]
    return true
  })
}
// ------------------------------------------------------------------
// Get
// ------------------------------------------------------------------
/** Gets a value at the pointer, or undefined if not exists */
export function Get(value: unknown, pointer: string): unknown {
  const indices = Indices(pointer)
  return GetIndices(indices, value)
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
/** Sets a value at the given pointer. May throw if the target value is not indexable */
export function Set(value: unknown, pointer: string, next: unknown): unknown {
  const indices = Indices(pointer)
  AssertNotRoot(indices)
  const [head, index] = TakeIndexRight(indices)
  const parent = GetIndices(head, value)
  AssertCanSet(parent)
  parent[index] = next
  return value
}
// ------------------------------------------------------------------
// Delete
// ------------------------------------------------------------------
/** Deletes the value at the given pointer. May throw if the target value is not indexable */
export function Delete(value: unknown, pointer: string): unknown {
  const indices = Indices(pointer)
  AssertNotRoot(indices)
  const [head, index] = TakeIndexRight(indices)
  const parent = GetIndices(head, value)
  AssertCanSet(parent)
  if(Guard.IsArray(parent) && IsNumericIndex(index)) {
    parent.splice(+index, 1)
  } else {
    delete parent[index]
  }
  return value
}