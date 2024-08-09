/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { HasPropertyKey, IsStandardObject, IsArray, IsTypedArray, IsValueType } from '../guard/index'
import type { ObjectType, ArrayType, TypedArrayType, ValueType } from '../guard/index'
import type { Static } from '../../type/static/index'
import { ValuePointer } from '../pointer/index'
import { Clone } from '../clone/index'
import { Equal } from '../equal/equal'
import { TypeBoxError } from '../../type/error/index'

import { Literal, type TLiteral } from '../../type/literal/index'
import { Object, type TObject } from '../../type/object/index'
import { String, type TString } from '../../type/string/index'
import { Unknown, type TUnknown } from '../../type/unknown/index'
import { Union, type TUnion } from '../../type/union/index'

// ------------------------------------------------------------------
// Commands
// ------------------------------------------------------------------

// Note: A TypeScript 5.4.2 compiler regression resulted in the type
// import paths being generated incorrectly. We can resolve this by
// explicitly importing the correct TSchema types above. Note also
// that the left-side annotations are optional, but since the types
// are imported we might as well use them. We should check this
// regression in future. The regression occured between TypeScript
// versions 5.3.3 -> 5.4.2.

export type Insert = Static<typeof Insert>
export const Insert: TObject<{
  type: TLiteral<'insert'>
  path: TString
  value: TUnknown
}> = Object({
  type: Literal('insert'),
  path: String(),
  value: Unknown(),
})
export type Update = Static<typeof Update>
export const Update: TObject<{
  type: TLiteral<'update'>
  path: TString
  value: TUnknown
}> = Object({
  type: Literal('update'),
  path: String(),
  value: Unknown(),
})
export type Delete = Static<typeof Delete>
export const Delete: TObject<{
  type: TLiteral<'delete'>
  path: TString
}> = Object({
  type: Literal('delete'),
  path: String(),
})
export type Edit = Static<typeof Edit>
export const Edit: TUnion<[typeof Insert, typeof Update, typeof Delete]> = Union([Insert, Update, Delete])

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
export class ValueDiffError extends TypeBoxError {
  constructor(public readonly value: unknown, message: string) {
    super(message)
  }
}
// ------------------------------------------------------------------
// Command Factory
// ------------------------------------------------------------------
function CreateUpdate(path: string, value: unknown): Edit {
  return { type: 'update', path, value }
}
function CreateInsert(path: string, value: unknown): Edit {
  return { type: 'insert', path, value }
}
function CreateDelete(path: string): Edit {
  return { type: 'delete', path }
}
// ------------------------------------------------------------------
// AssertDiffable
// ------------------------------------------------------------------
function AssertDiffable(value: unknown): asserts value is Record<string | number, unknown> {
  if (globalThis.Object.getOwnPropertySymbols(value).length > 0) throw new ValueDiffError(value, 'Cannot diff objects with symbols')
}
// ------------------------------------------------------------------
// Diffing Generators
// ------------------------------------------------------------------
function* ObjectType(path: string, current: ObjectType, next: unknown): IterableIterator<Edit> {
  AssertDiffable(current)
  AssertDiffable(next)
  if (!IsStandardObject(next)) return yield CreateUpdate(path, next)
  const currentKeys = globalThis.Object.getOwnPropertyNames(current)
  const nextKeys = globalThis.Object.getOwnPropertyNames(next)
  // ----------------------------------------------------------------
  // inserts
  // ----------------------------------------------------------------
  for (const key of nextKeys) {
    if (HasPropertyKey(current, key)) continue
    yield CreateInsert(`${path}/${key}`, next[key])
  }
  // ----------------------------------------------------------------
  // updates
  // ----------------------------------------------------------------
  for (const key of currentKeys) {
    if (!HasPropertyKey(next, key)) continue
    if (Equal(current, next)) continue
    yield* Visit(`${path}/${key}`, current[key], next[key])
  }
  // ----------------------------------------------------------------
  // deletes
  // ----------------------------------------------------------------
  for (const key of currentKeys) {
    if (HasPropertyKey(next, key)) continue
    yield CreateDelete(`${path}/${key}`)
  }
}
function* ArrayType(path: string, current: ArrayType, next: unknown): IterableIterator<Edit> {
  if (!IsArray(next)) return yield CreateUpdate(path, next)
  for (let i = 0; i < Math.min(current.length, next.length); i++) {
    yield* Visit(`${path}/${i}`, current[i], next[i])
  }
  for (let i = 0; i < next.length; i++) {
    if (i < current.length) continue
    yield CreateInsert(`${path}/${i}`, next[i])
  }
  for (let i = current.length - 1; i >= 0; i--) {
    if (i < next.length) continue
    yield CreateDelete(`${path}/${i}`)
  }
}
function* TypedArrayType(path: string, current: TypedArrayType, next: unknown): IterableIterator<Edit> {
  if (!IsTypedArray(next) || current.length !== next.length || globalThis.Object.getPrototypeOf(current).constructor.name !== globalThis.Object.getPrototypeOf(next).constructor.name) return yield CreateUpdate(path, next)
  for (let i = 0; i < Math.min(current.length, next.length); i++) {
    yield* Visit(`${path}/${i}`, current[i], next[i])
  }
}
function* ValueType(path: string, current: ValueType, next: unknown): IterableIterator<Edit> {
  if (current === next) return
  yield CreateUpdate(path, next)
}
function* Visit(path: string, current: unknown, next: unknown): IterableIterator<Edit> {
  if (IsStandardObject(current)) return yield* ObjectType(path, current, next)
  if (IsArray(current)) return yield* ArrayType(path, current, next)
  if (IsTypedArray(current)) return yield* TypedArrayType(path, current, next)
  if (IsValueType(current)) return yield* ValueType(path, current, next)
  throw new ValueDiffError(current, 'Unable to diff value')
}
// ------------------------------------------------------------------
// Diff
// ------------------------------------------------------------------
export function Diff(current: unknown, next: unknown): Edit[] {
  return [...Visit('', current, next)]
}
// ------------------------------------------------------------------
// Patch
// ------------------------------------------------------------------
function IsRootUpdate(edits: Edit[]): edits is [Update] {
  return edits.length > 0 && edits[0].path === '' && edits[0].type === 'update'
}
function IsIdentity(edits: Edit[]) {
  return edits.length === 0
}
export function Patch<T = any>(current: unknown, edits: Edit[]): T {
  if (IsRootUpdate(edits)) {
    return Clone(edits[0].value) as T
  }
  if (IsIdentity(edits)) {
    return Clone(current) as T
  }
  const clone = Clone(current)
  for (const edit of edits) {
    switch (edit.type) {
      case 'insert': {
        ValuePointer.Set(clone, edit.path, edit.value)
        break
      }
      case 'update': {
        ValuePointer.Set(clone, edit.path, edit.value)
        break
      }
      case 'delete': {
        ValuePointer.Delete(clone, edit.path)
        break
      }
    }
  }
  return clone as T
}
