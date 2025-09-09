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

import { Guard } from '../../guard/index.ts'

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
class ValuePointerRootSetError extends Error {
  constructor(public readonly value: unknown, public readonly path: string, public readonly update: unknown) {
    super('Cannot set root value')
  }
}
class ValuePointerRootDeleteError extends Error {
  constructor(public readonly value: unknown, public readonly path: string) {
    super('Cannot delete root value')
  }
}
// ------------------------------------------------------------------
// ObjectLike
// ------------------------------------------------------------------
type ObjectLike = Record<PropertyKey, any>

// ------------------------------------------------------------------
// ValuePointer
// ------------------------------------------------------------------
/** Provides functionality to update values through RFC6901 string pointers */
function Escape(component: string): string {
  const decoded = decodeURIComponent(component)
  return decoded.replace(/~1/g, '/').replace(/~0/g, '~')
}
// ------------------------------------------------------------------
// Format
// ------------------------------------------------------------------
/** Transforms a pointer into navigable key components */
export function* Format(pointer: string): IterableIterator<string> {
  if (pointer === '') return
  let [start, end] = [0, 0]
  for (let i = 0; i < pointer.length; i++) {
    const char = pointer.charAt(i)
    if (char === '/') {
      if (i === 0) {
        start = i + 1
      } else {
        end = i
        yield Escape(pointer.slice(start, end))
        start = i + 1
      }
    } else {
      end = i
    }
  }
  yield Escape(pointer.slice(start))
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
/** 
 * Sets the value at the given pointer and returns the updated value. If the pointer 
 * path does not exist, the path will be created.
 */
export function Set(value: ObjectLike, pointer: string, update: unknown): ObjectLike {
  if (pointer === '') throw new ValuePointerRootSetError(value, pointer, update)
  let [owner, next, key] = [null, value, ''] as [unknown, ObjectLike, string]
  for (const component of Format(pointer)) {
    if (Guard.IsUndefined(next[component])) next[component] = {}
    owner = next
    next = next[component]
    key = component
  }
  if(Guard.IsObject(owner)) {
    owner[key] = update
  }
  return value
}
// ------------------------------------------------------------------
// Delete
// ------------------------------------------------------------------
/** 
 * Deletes a value at the given pointer and returns the updated value.
 */
export function Delete(value: ObjectLike, pointer: string): ObjectLike {
  if (pointer === '') throw new ValuePointerRootDeleteError(value, pointer)
  let [owner, next, key] = [null, value, ''] as [unknown, ObjectLike, string]
  for (const component of Format(pointer)) {
    if (Guard.IsUndefined(next[component]) || Guard.IsNull(next[component])) {
      return value
    }
    owner = next
    next = next[component]
    key = component
  }
  if (Guard.IsArray(owner)) {
    const index = parseInt(key)
    owner.splice(index, 1)
  } else if (Guard.IsObject(owner)) {
    delete owner[key]
  }
  return value
}
// ------------------------------------------------------------------
// Has
// ------------------------------------------------------------------
/** Returns true if a property or element exists at the given pointer */
export function Has(value: ObjectLike, pointer: string): boolean {
  if (pointer === '') return true
  let [owner, next, key] = [null, value, ''] as [unknown, ObjectLike, string]
  for (const component of Format(pointer)) {
    if (Guard.IsUndefined(next[component]) || Guard.IsNull(next[component])) {
      return false
    }
    owner = next
    next = next[component]
    key = component
  }
  return Object.getOwnPropertyNames(owner).includes(key)
}
// ------------------------------------------------------------------
// Get
// ------------------------------------------------------------------
/** Gets the value at the given pointer or undefined if not exists. */
export function Get(value: ObjectLike, pointer: string): unknown | undefined {
  if (pointer === '') return value
  let current = value
  for (const component of Format(pointer)) {
    if (current[component] === undefined) return undefined
    current = current[component]
  }
  return current
}