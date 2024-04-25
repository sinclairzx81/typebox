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

import { IsStandardObject, IsArray, IsTypedArray, IsValueType, type TypedArrayType } from '../guard/index'
import { ValuePointer } from '../pointer/index'
import { Clone } from '../clone/index'
import { TypeBoxError } from '../../type/error/index'

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
export class ValueMutateError extends TypeBoxError {
  constructor(message: string) {
    super(message)
  }
}
// ------------------------------------------------------------------
// Mutators
// ------------------------------------------------------------------
export type Mutable = { [key: string]: unknown } | unknown[]
function ObjectType(root: Mutable, path: string, current: unknown, next: Record<string, unknown>) {
  if (!IsStandardObject(current)) {
    ValuePointer.Set(root, path, Clone(next))
  } else {
    const currentKeys = Object.getOwnPropertyNames(current)
    const nextKeys = Object.getOwnPropertyNames(next)
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
function ArrayType(root: Mutable, path: string, current: unknown, next: unknown[]) {
  if (!IsArray(current)) {
    ValuePointer.Set(root, path, Clone(next))
  } else {
    for (let index = 0; index < next.length; index++) {
      Visit(root, `${path}/${index}`, current[index], next[index])
    }
    current.splice(next.length)
  }
}
function TypedArrayType(root: Mutable, path: string, current: unknown, next: TypedArrayType) {
  if (IsTypedArray(current) && current.length === next.length) {
    for (let i = 0; i < current.length; i++) {
      current[i] = next[i]
    }
  } else {
    ValuePointer.Set(root, path, Clone(next))
  }
}
function ValueType(root: Mutable, path: string, current: unknown, next: unknown) {
  if (current === next) return
  ValuePointer.Set(root, path, next)
}
function Visit(root: Mutable, path: string, current: unknown, next: unknown) {
  if (IsArray(next)) return ArrayType(root, path, current, next)
  if (IsTypedArray(next)) return TypedArrayType(root, path, current, next)
  if (IsStandardObject(next)) return ObjectType(root, path, current, next)
  if (IsValueType(next)) return ValueType(root, path, current, next)
}
// ------------------------------------------------------------------
// IsNonMutableValue
// ------------------------------------------------------------------
function IsNonMutableValue(value: unknown): value is Mutable {
  return IsTypedArray(value) || IsValueType(value)
}
function IsMismatchedValue(current: unknown, next: unknown) {
  // prettier-ignore
  return (
    (IsStandardObject(current) && IsArray(next)) || 
    (IsArray(current) && IsStandardObject(next))
  )
}
// ------------------------------------------------------------------
// Mutate
// ------------------------------------------------------------------
/** `[Mutable]` Performs a deep mutable value assignment while retaining internal references */
export function Mutate(current: Mutable, next: Mutable): void {
  if (IsNonMutableValue(current) || IsNonMutableValue(next)) throw new ValueMutateError('Only object and array types can be mutated at the root level')
  if (IsMismatchedValue(current, next)) throw new ValueMutateError('Cannot assign due type mismatch of assignable values')
  Visit(current, '', current, next)
}
