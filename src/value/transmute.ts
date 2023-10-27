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

import { IsObject, IsArray, IsTypedArray, IsValueType, type TypedArrayType } from './guard'
import { ValuePointer } from './pointer'
import { Clone } from './clone'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class ValueMutateTypeMismatchError extends Error {
  constructor() {
    super('Cannot assign due type mismatch of assignable values')
  }
}
export class ValueMutateInvalidRootMutationError extends Error {
  constructor() {
    super('Only object and array types can be mutated at the root level')
  }
}
// --------------------------------------------------------------------------
// Transmutable
// --------------------------------------------------------------------------

export type Transmutable = Record<PropertyKey, unknown> | Array<unknown>

function ObjectType(root: Transmutable, path: string, current: unknown, next: Record<string, unknown>) {
  if (!IsObject(current)) {
    ValuePointer.Set(root, path, Clone(next))
  } else {
    const currentKeys = Object.keys(current)
    const nextKeys = Object.keys(next)
    for (const currentKey of currentKeys) {
      if (!nextKeys.includes(currentKey)) {
        delete current[currentKey]
      }
    }
    for (const nextKey of nextKeys) {
      if (!currentKeys.includes(nextKey)) {
        current[nextKey] = null
      }
    }
    for (const nextKey of nextKeys) {
      Visit(root, `${path}/${nextKey}`, current[nextKey], next[nextKey])
    }
  }
}
function ArrayType(root: Transmutable, path: string, current: unknown, next: unknown[]) {
  if (!IsArray(current)) {
    ValuePointer.Set(root, path, Clone(next))
  } else {
    for (let index = 0; index < next.length; index++) {
      Visit(root, `${path}/${index}`, current[index], next[index])
    }
    current.splice(next.length)
  }
}
function TypedArrayType(root: Transmutable, path: string, current: unknown, next: TypedArrayType) {
  if (IsTypedArray(current) && current.length === next.length) {
    for (let i = 0; i < current.length; i++) {
      current[i] = next[i]
    }
  } else {
    ValuePointer.Set(root, path, Clone(next))
  }
}
function ValueType(root: Transmutable, path: string, current: unknown, next: unknown) {
  if (current === next) return
  ValuePointer.Set(root, path, next)
}
function Visit(root: Transmutable, path: string, current: unknown, next: unknown) {
  if (IsArray(next)) return ArrayType(root, path, current, next)
  if (IsTypedArray(next)) return TypedArrayType(root, path, current, next)
  if (IsObject(next)) return ObjectType(root, path, current, next)
  if (IsValueType(next)) return ValueType(root, path, current, next)
}
// --------------------------------------------------------------------------
// Mutate
// --------------------------------------------------------------------------
function IsNonMutableValue(value: unknown): value is Transmutable {
  return IsTypedArray(value) || IsValueType(value)
}
function IsMismatchedValue(current: unknown, next: unknown) {
  // prettier-ignore
  return (
    (IsObject(current) && IsArray(next)) || 
    (IsArray(current) && IsObject(next))
  )
}
// --------------------------------------------------------------------------
// Transmute
// --------------------------------------------------------------------------
/** Transforms the current value into the next value and returns the result. This function performs mutable operations on the input value. To avoid mutation, clone the input value before passing to this function. */
export function Transmute<Next extends Transmutable>(current: Transmutable, next: Next): Next {
  if (IsNonMutableValue(current) || IsNonMutableValue(next)) throw new ValueMutateInvalidRootMutationError()
  if (IsMismatchedValue(current, next)) throw new ValueMutateTypeMismatchError()
  Visit(current, '', current, next)
  return next
}
