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

import { Is, ObjectType, ArrayType, TypedArrayType, ValueType } from './is'

export namespace ValueClone {
  function AsyncIterator(value: AsyncIterableIterator<unknown>): any {
    return value
  }
  function Iterator(value: IterableIterator<unknown>): any {
    return value
  }
  function Promise(value: Promise<unknown>): any {
    return value
  }
  function Array(value: ArrayType): any {
    return value.map((element: any) => Clone(element))
  }
  function Date(value: Date): any {
    return new globalThis.Date(value.toISOString())
  }
  function Object(value: ObjectType): any {
    const keys = [...globalThis.Object.getOwnPropertyNames(value), ...globalThis.Object.getOwnPropertySymbols(value)]
    return keys.reduce((acc, key) => ({ ...acc, [key]: Clone(value[key]) }), {})
  }
  function TypedArray(value: TypedArrayType): any {
    return value.slice()
  }
  function Value(value: ValueType): any {
    return value
  }
  export function Clone<T extends unknown>(value: T): T {
    if (Is.AsyncIterator(value)) return AsyncIterator(value)
    if (Is.Iterator(value)) return Iterator(value)
    if (Is.Promise(value)) return Promise(value)
    if (Is.Date(value)) return Date(value)
    if (Is.Object(value)) return Object(value)
    if (Is.Array(value)) return Array(value)
    if (Is.TypedArray(value)) return TypedArray(value)
    if (Is.Value(value)) return Value(value)
    throw new Error('ValueClone: Unable to clone value')
  }
}
