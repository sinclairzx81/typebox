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

export namespace ValueEqual {
  function Object(left: ObjectType, right: unknown): boolean {
    if (!Is.Object(right)) return false
    const leftKeys = [...globalThis.Object.keys(left), ...globalThis.Object.getOwnPropertySymbols(left)]
    const rightKeys = [...globalThis.Object.keys(right), ...globalThis.Object.getOwnPropertySymbols(right)]
    if (leftKeys.length !== rightKeys.length) return false
    return leftKeys.every((key) => Equal(left[key], right[key]))
  }

  function Array(left: ArrayType, right: unknown): any {
    if (!Is.Array(right) || left.length !== right.length) return false
    return left.every((value, index) => Equal(value, right[index]))
  }

  function TypedArray(left: TypedArrayType, right: unknown): any {
    if (!Is.TypedArray(right) || left.length !== right.length || globalThis.Object.getPrototypeOf(left).constructor.name !== globalThis.Object.getPrototypeOf(right).constructor.name) return false
    return left.every((value, index) => Equal(value, right[index]))
  }

  function Value(left: ValueType, right: unknown): any {
    return left === right
  }

  export function Equal<T>(left: T, right: unknown): right is T {
    if (Is.Object(left)) {
      return Object(left, right)
    } else if (Is.TypedArray(left)) {
      return TypedArray(left, right)
    } else if (Is.Array(left)) {
      return Array(left, right)
    } else if (Is.Value(left)) {
      return Value(left, right)
    } else {
      throw new Error('ValueEquals: Unable to compare value')
    }
  }
}
