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

import { Guard, GlobalsGuard } from '../../guard/index.ts'
import { type TEdit, type TUpdate, type TInsert, type TDelete } from './edit.ts'
import { Equal } from '../equal/index.ts'

// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
function CreateUpdate(path: string, value: unknown): TUpdate {
  return { type: 'update', path, value }
}
function CreateInsert(path: string, value: unknown): TInsert {
  return { type: 'insert', path, value }
}
function CreateDelete(path: string): TDelete {
  return { type: 'delete', path }
}

// ------------------------------------------------------------------
// Assert
// ------------------------------------------------------------------
function AssertCanDiffObject(value: unknown): asserts value is Record<string | number, unknown> {
  if (Guard.IsObject(value) && Guard.IsEqual(Guard.Symbols(value).length, 0)) return
  throw new Error('Cannot create diffs for objects with symbols keys')
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
function* FromObject(path: string, left: Record<PropertyKey, unknown>, right: unknown): IterableIterator<TEdit> {
  if (!Guard.IsObject(right) || Guard.IsArray(right)) return yield CreateUpdate(path, right)
  AssertCanDiffObject(left)
  AssertCanDiffObject(right)
  const leftKeys = Guard.Keys(left)
  const rightKeys = Guard.Keys(right)
  // ----------------------------------------------------------------
  // Insert
  // ----------------------------------------------------------------
  for (const key of rightKeys) {
    if (Guard.HasPropertyKey(left, key)) continue
    yield CreateInsert(`${path}/${key}`, right[key])
  }
  // ----------------------------------------------------------------
  // Update
  // ----------------------------------------------------------------
  for (const key of leftKeys) {
    if (!Guard.HasPropertyKey(right, key)) continue
    if (Equal(left, right)) continue
    yield* FromValue(`${path}/${key}`, left[key], right[key])
  }
  // ----------------------------------------------------------------
  // Delete
  // ----------------------------------------------------------------
  for (const key of leftKeys) {
    if (Guard.HasPropertyKey(right, key)) continue
    yield CreateDelete(`${path}/${key}`)
  }
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
function* FromArray(path: string, left: unknown[], right: unknown): IterableIterator<TEdit> {
  if (!Guard.IsArray(right)) return yield CreateUpdate(path, right)
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    yield* FromValue(`${path}/${i}`, left[i], right[i])
  }
  for (let i = 0; i < right.length; i++) {
    if (i < left.length) continue
    yield CreateInsert(`${path}/${i}`, right[i])
  }
  for (let i = left.length - 1; i >= 0; i--) {
    if (i < right.length) continue
    yield CreateDelete(`${path}/${i}`)
  }
}
// ------------------------------------------------------------------
// TypedArray
// ------------------------------------------------------------------
function* FromTypedArray(path: string, left: GlobalsGuard.TTypeArray, right: unknown): IterableIterator<TEdit> {
  const typeLeft = globalThis.Object.getPrototypeOf(left).constructor.name
  const typeRight = globalThis.Object.getPrototypeOf(right).constructor.name
  const predicate = GlobalsGuard.IsTypeArray(right) 
    && Guard.IsEqual(left.length, right.length)
    && Guard.IsEqual(typeLeft, typeRight)
  if(predicate) {
    for (let index = 0; index < Math.min(left.length, right.length); index++) {
      yield* FromValue(`${path}/${index}`, left[index], right[index])
    }
  } else {
    return yield CreateUpdate(path, right)
  }
}
// ------------------------------------------------------------------
// Unknown
// ------------------------------------------------------------------
function* FromUnknown(path: string, left: unknown, right: unknown): IterableIterator<TEdit> {
  if (left === right) return
  yield CreateUpdate(path, right)
}
// ------------------------------------------------------------------
// Value
// ------------------------------------------------------------------
function* FromValue(path: string, left: unknown, right: unknown): IterableIterator<TEdit> {
  return (
    GlobalsGuard.IsTypeArray(left) ? yield* FromTypedArray(path, left, right) :
    Guard.IsArray(left) ? yield* FromArray(path, left, right) :
    Guard.IsObject(left) ?  yield* FromObject(path, left, right) :
    yield* FromUnknown(path, left, right)
  )
}
// ------------------------------------------------------------------
// Diff
// ------------------------------------------------------------------
/** 
 * Generates a sequence of Edit commands to transform the current value into the next value.
 * These commands can be serialized and sent over a network to synchronize a remote
 * value, applied with Patch, or tested with Hash. Edit commands should be treated as
 * opaque data structures; TypeBox may enhance this functionality in the future to
 * support full operational transformation and may change the commands. Do not apply
 * any logic directly to the command structures.
 */
export function Diff(current: unknown, next: unknown): TEdit[] {
  return [...FromValue('', current, next)]
}