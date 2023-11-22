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

import { IsPlainObject, IsArray, IsTypedArray, IsValueType, IsSymbol, IsUndefined } from '../guard/index'
import type { ObjectType, ArrayType, TypedArrayType, ValueType } from '../guard/index'
import type { Static } from '../../type/static/index'
import { ValuePointer } from '../pointer/index'
import { Clone } from '../clone/index'
import { TypeBoxError } from '../../type/error/index'

import { Literal as CreateLiteral } from '../../type/literal/index'
import { Object as CreateObject } from '../../type/object/index'
import { String as CreateString } from '../../type/string/index'
import { Unknown as CreateUnknown } from '../../type/unknown/index'
import { Union as CreateUnion } from '../../type/union/index'

// ------------------------------------------------------------------
// Commands
// ------------------------------------------------------------------
export type Insert = Static<typeof Insert>
export const Insert = CreateObject({
  type: CreateLiteral('insert'),
  path: CreateString(),
  value: CreateUnknown(),
})
export type Update = Static<typeof Update>
export const Update = CreateObject({
  type: CreateLiteral('update'),
  path: CreateString(),
  value: CreateUnknown(),
})
export type Delete = Static<typeof Delete>
export const Delete = CreateObject({
  type: CreateLiteral('delete'),
  path: CreateString(),
})
export type Edit = Static<typeof Edit>
export const Edit = CreateUnion([Insert, Update, Delete])
// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
export class ValueDeltaError extends TypeBoxError {
  constructor(public readonly value: unknown, message: string) {
    super(message)
  }
}
export class ValueDeltaSymbolError extends ValueDeltaError {
  constructor(public readonly value: unknown) {
    super(value, 'Cannot diff objects with symbol keys')
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
// Diffing Generators
// ------------------------------------------------------------------
function* ObjectType(path: string, current: ObjectType, next: unknown): IterableIterator<Edit> {
  if (!IsPlainObject(next)) return yield CreateUpdate(path, next)
  const currentKeys = [...globalThis.Object.keys(current), ...globalThis.Object.getOwnPropertySymbols(current)]
  const nextKeys = [...globalThis.Object.keys(next), ...globalThis.Object.getOwnPropertySymbols(next)]
  for (const key of currentKeys) {
    if (IsSymbol(key)) throw new ValueDeltaSymbolError(key)
    if (IsUndefined(next[key]) && nextKeys.includes(key)) yield CreateUpdate(`${path}/${globalThis.String(key)}`, undefined)
  }
  for (const key of nextKeys) {
    if (IsUndefined(current[key]) || IsUndefined(next[key])) continue
    if (IsSymbol(key)) throw new ValueDeltaSymbolError(key)
    yield* Visit(`${path}/${globalThis.String(key)}`, current[key], next[key])
  }
  for (const key of nextKeys) {
    if (IsSymbol(key)) throw new ValueDeltaSymbolError(key)
    if (IsUndefined(current[key])) yield CreateInsert(`${path}/${globalThis.String(key)}`, next[key])
  }
  for (const key of currentKeys.reverse()) {
    if (IsSymbol(key)) throw new ValueDeltaSymbolError(key)
    if (IsUndefined(next[key]) && !nextKeys.includes(key)) yield CreateDelete(`${path}/${globalThis.String(key)}`)
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
  if (IsPlainObject(current)) return yield* ObjectType(path, current, next)
  if (IsArray(current)) return yield* ArrayType(path, current, next)
  if (IsTypedArray(current)) return yield* TypedArrayType(path, current, next)
  if (IsValueType(current)) return yield* ValueType(path, current, next)
  throw new ValueDeltaError(current, 'Unable to create diff edits for unknown value')
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
