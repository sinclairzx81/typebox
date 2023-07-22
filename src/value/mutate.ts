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

import { ValuePointer } from './pointer'
import * as ValueClone from './clone'
import * as ValueGuard from './guard'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class ValueMutateTypeMismatchError extends Error {
  constructor() {
    super('ValueMutate: Cannot assign due type mismatch of assignable values')
  }
}
export class ValueMutateInvalidRootMutationError extends Error {
  constructor() {
    super('ValueMutate: Only object and array types can be mutated at the root level')
  }
}
// --------------------------------------------------------------------------
// Mutators
// --------------------------------------------------------------------------
export type Mutable = { [key: string]: unknown } | unknown[]
function Object(root: Mutable, path: string, current: unknown, next: Record<string, unknown>) {
  if (!ValueGuard.IsPlainObject(current)) {
    ValuePointer.Set(root, path, ValueClone.Clone(next))
  } else {
    const currentKeys = globalThis.Object.keys(current)
    const nextKeys = globalThis.Object.keys(next)
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
function Array(root: Mutable, path: string, current: unknown, next: unknown[]) {
  if (!ValueGuard.IsArray(current)) {
    ValuePointer.Set(root, path, ValueClone.Clone(next))
  } else {
    for (let index = 0; index < next.length; index++) {
      Visit(root, `${path}/${index}`, current[index], next[index])
    }
    current.splice(next.length)
  }
}
function TypedArray(root: Mutable, path: string, current: unknown, next: ValueGuard.TypedArrayType) {
  if (ValueGuard.IsTypedArray(current) && current.length === next.length) {
    for (let i = 0; i < current.length; i++) {
      current[i] = next[i]
    }
  } else {
    ValuePointer.Set(root, path, ValueClone.Clone(next))
  }
}
function Value(root: Mutable, path: string, current: unknown, next: unknown) {
  if (current === next) return
  ValuePointer.Set(root, path, next)
}
function Visit(root: Mutable, path: string, current: unknown, next: unknown) {
  if (ValueGuard.IsArray(next)) return Array(root, path, current, next)
  if (ValueGuard.IsTypedArray(next)) return TypedArray(root, path, current, next)
  if (ValueGuard.IsPlainObject(next)) return Object(root, path, current, next)
  if (ValueGuard.IsValueType(next)) return Value(root, path, current, next)
}
// --------------------------------------------------------------------------
// Mutate
// --------------------------------------------------------------------------
function IsNonMutableValue(value: unknown): value is Mutable {
  return ValueGuard.IsTypedArray(value) || ValueGuard.IsValueType(value)
}
function IsMismatchedValue(current: unknown, next: unknown) {
  // prettier-ignore
  return (
    (ValueGuard.IsPlainObject(current) && ValueGuard.IsArray(next)) || 
    (ValueGuard.IsArray(current) && ValueGuard.IsPlainObject(next))
  )
}
// --------------------------------------------------------------------------
// Mutate
// --------------------------------------------------------------------------
/** Performs a deep mutable value assignment while retaining internal references. */
export function Mutate(current: Mutable, next: Mutable): void {
  if (IsNonMutableValue(current) || IsNonMutableValue(next)) throw new ValueMutateInvalidRootMutationError()
  if (IsMismatchedValue(current, next)) throw new ValueMutateTypeMismatchError()
  Visit(current, '', current, next)
}
