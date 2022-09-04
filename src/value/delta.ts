/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Is, ObjectType, ArrayType, TypedArrayType, ValueType } from './is'
import { ValueClone } from './clone'
import { ValuePointer } from './pointer'

export type Edit<T = unknown> = Insert<T> | Update<T> | Delete<T>

export interface Insert<T> {
  brand: T
  type: 'insert'
  path: string
  value: any
}

export interface Update<T> {
  brand: T
  type: 'update'
  path: string
  value: any
}

export interface Delete<T> {
  brand: T
  type: 'delete'
  path: string
}

export namespace ValueDelta {
  // ---------------------------------------------------------------------
  // Edits
  // ---------------------------------------------------------------------

  function Update(path: string, value: unknown): Edit<any> {
    return { type: 'update', path, value } as any
  }

  function Insert(path: string, value: unknown): Edit<any> {
    return { type: 'insert', path, value } as any
  }

  function Delete(path: string): Edit<any> {
    return { type: 'delete', path } as any
  }

  // ---------------------------------------------------------------------
  // Diff
  // ---------------------------------------------------------------------

  function* Object(path: string, current: ObjectType, next: unknown): IterableIterator<Edit<any>> {
    if (!Is.Object(next)) return yield Update(path, next)
    const currentKeys = [...globalThis.Object.keys(current), ...globalThis.Object.getOwnPropertySymbols(current)]
    const nextKeys = [...globalThis.Object.keys(next), ...globalThis.Object.getOwnPropertySymbols(next)]
    for (const key of currentKeys) {
      if (typeof key === 'symbol') throw Error('ValueDelta: Cannot produce diff symbol keys')
      if (next[key] === undefined && nextKeys.includes(key)) yield Update(`${path}/${String(key)}`, undefined)
    }
    for (const key of nextKeys) {
      if (current[key] === undefined || next[key] === undefined) continue
      if (typeof key === 'symbol') throw Error('ValueDelta: Cannot produce diff symbol keys')
      yield* Visit(`${path}/${String(key)}`, current[key], next[key])
    }
    for (const key of nextKeys) {
      if (typeof key === 'symbol') throw Error('ValueDelta: Cannot produce diff symbol keys')
      if (current[key] === undefined) yield Insert(`${path}/${String(key)}`, next[key])
    }
    for (const key of currentKeys.reverse()) {
      if (typeof key === 'symbol') throw Error('ValueDelta: Cannot produce diff symbol keys')
      if (next[key] === undefined && !nextKeys.includes(key)) yield Delete(`${path}/${String(key)}`)
    }
  }

  function* Array(path: string, current: ArrayType, next: unknown): IterableIterator<Edit<any>> {
    if (!Is.Array(next)) return yield Update(path, next)
    for (let i = 0; i < Math.min(current.length, next.length); i++) {
      yield* Visit(`${path}/${i}`, current[i], next[i])
    }
    for (let i = 0; i < next.length; i++) {
      if (i < current.length) continue
      yield Insert(`${path}/${i}`, next[i])
    }
    for (let i = current.length - 1; i >= 0; i--) {
      if (i < next.length) continue
      yield Delete(`${path}/${i}`)
    }
  }

  function* TypedArray(path: string, current: TypedArrayType, next: unknown): IterableIterator<Edit<any>> {
    if (!Is.TypedArray(next) || current.length !== next.length || globalThis.Object.getPrototypeOf(current).constructor.name !== globalThis.Object.getPrototypeOf(next).constructor.name) return yield Update(path, next)
    for (let i = 0; i < Math.min(current.length, next.length); i++) {
      yield* Visit(`${path}/${i}`, current[i], next[i])
    }
  }

  function* Value(path: string, current: ValueType, next: unknown): IterableIterator<Edit<any>> {
    if (current === next) return
    yield Update(path, next)
  }

  function* Visit(path: string, current: unknown, next: unknown): IterableIterator<Edit<any>> {
    if (Is.Object(current)) {
      return yield* Object(path, current, next)
    } else if (Is.Array(current)) {
      return yield* Array(path, current, next)
    } else if (Is.TypedArray(current)) {
      return yield* TypedArray(path, current, next)
    } else if (Is.Value(current)) {
      return yield* Value(path, current, next)
    } else {
      console.log('left', current)
      throw new Error('ValueDelta: Cannot produce edits for value')
    }
  }

  export function Diff<T>(current: T, next: T): Edit<T>[] {
    return [...Visit('', current, next)]
  }

  // ---------------------------------------------------------------------
  // Patch
  // ---------------------------------------------------------------------

  function IsRootUpdate<T>(edits: Edit<T>[]): edits is [Update<T>] {
    return edits.length > 0 && edits[0].path === '' && edits[0].type === 'update'
  }

  function IsIdentity<T>(edits: Edit<T>[]) {
    return edits.length === 0
  }

  export function Patch<T>(current: T, edits: Edit<T>[]): T {
    if (IsRootUpdate(edits)) {
      return ValueClone.Clone(edits[0].value)
    }
    if (IsIdentity(edits)) {
      return ValueClone.Clone(current)
    }
    const clone = ValueClone.Clone(current)
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
    return clone
  }
}
