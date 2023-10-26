/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { IsPlainObject, IsArray, IsTypedArray, IsValueType, IsSymbol, IsUndefined } from './guard'
import type { ObjectType, ArrayType, TypedArrayType, ValueType } from './guard'
import { Type, Static } from '../typebox'
import { ValuePointer } from './pointer'
import { Clone } from './clone'

// --------------------------------------------------------------------------
// Commands
// --------------------------------------------------------------------------
export type Insert = Static<typeof Insert>
export const Insert = Type.Object({
  type: Type.Literal('insert'),
  path: Type.String(),
  value: Type.Unknown(),
})
export type Update = Static<typeof Update>
export const Update = Type.Object({
  type: Type.Literal('update'),
  path: Type.String(),
  value: Type.Unknown(),
})
export type Delete = Static<typeof Delete>
export const Delete = Type.Object({
  type: Type.Literal('delete'),
  path: Type.String(),
})
export type Edit = Static<typeof Edit>
export const Edit = Type.Union([Insert, Update, Delete])
// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class ValueDeltaObjectWithSymbolKeyError extends Error {
  constructor(public readonly key: unknown) {
    super('Cannot diff objects with symbol keys')
  }
}
export class ValueDeltaUnableToDiffUnknownValue extends Error {
  constructor(public readonly value: unknown) {
    super('Unable to create diff edits for unknown value')
  }
}
// --------------------------------------------------------------------------
// Command Factory
// --------------------------------------------------------------------------
function CreateUpdate(path: string, value: unknown): Edit {
  return { type: 'update', path, value }
}
function CreateInsert(path: string, value: unknown): Edit {
  return { type: 'insert', path, value }
}
function CreateDelete(path: string): Edit {
  return { type: 'delete', path }
}
// --------------------------------------------------------------------------
// Diffing Generators
// --------------------------------------------------------------------------
function* ObjectType(path: string, current: ObjectType, next: unknown): IterableIterator<Edit> {
  if (!IsPlainObject(next)) return yield CreateUpdate(path, next)
  const currentKeys = [...Object.keys(current), ...Object.getOwnPropertySymbols(current)]
  const nextKeys = [...Object.keys(next), ...Object.getOwnPropertySymbols(next)]
  for (const key of currentKeys) {
    if (IsSymbol(key)) throw new ValueDeltaObjectWithSymbolKeyError(key)
    if (IsUndefined(next[key]) && nextKeys.includes(key)) yield CreateUpdate(`${path}/${String(key)}`, undefined)
  }
  for (const key of nextKeys) {
    if (IsUndefined(current[key]) || IsUndefined(next[key])) continue
    if (IsSymbol(key)) throw new ValueDeltaObjectWithSymbolKeyError(key)
    yield* Visit(`${path}/${String(key)}`, current[key], next[key])
  }
  for (const key of nextKeys) {
    if (IsSymbol(key)) throw new ValueDeltaObjectWithSymbolKeyError(key)
    if (IsUndefined(current[key])) yield CreateInsert(`${path}/${String(key)}`, next[key])
  }
  for (const key of currentKeys.reverse()) {
    if (IsSymbol(key)) throw new ValueDeltaObjectWithSymbolKeyError(key)
    if (IsUndefined(next[key]) && !nextKeys.includes(key)) yield CreateDelete(`${path}/${String(key)}`)
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
  if (!IsTypedArray(next) || current.length !== next.length || Object.getPrototypeOf(current).constructor.name !== Object.getPrototypeOf(next).constructor.name) return yield CreateUpdate(path, next)
  for (let i = 0; i < Math.min(current.length, next.length); i++) {
    yield* Visit(`${path}/${i}`, current[i], next[i])
  }
}
function* ValueType(path: string, current: ValueType, next: unknown): IterableIterator<Edit> {
  if (current === next) return
  yield CreateUpdate(path, next)
}
function* Visit(path: string, current: unknown, next: unknown): IterableIterator<Edit> {
  if (IsPlainObject(current)) return yield* ObjectType(path, current, next)
  if (IsArray(current)) return yield* ArrayType(path, current, next)
  if (IsTypedArray(current)) return yield* TypedArrayType(path, current, next)
  if (IsValueType(current)) return yield* ValueType(path, current, next)
  throw new ValueDeltaUnableToDiffUnknownValue(current)
}
// ---------------------------------------------------------------------
// Diff
// ---------------------------------------------------------------------
/** Returns edits to transform the current value into the next value */
export function Diff(current: unknown, next: unknown): Edit[] {
  return [...Visit('', current, next)]
}
// ---------------------------------------------------------------------
// Patch
// ---------------------------------------------------------------------
function IsRootUpdate(edits: Edit[]): edits is [Update] {
  return edits.length > 0 && edits[0].path === '' && edits[0].type === 'update'
}
function IsIdentity(edits: Edit[]) {
  return edits.length === 0
}

/** `[Immutable]` Returns a new value with edits applied to the given value */
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
