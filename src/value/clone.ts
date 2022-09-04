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

import { ObjectType, ArrayType, ValueType, Is } from './is'

export namespace ValueClone {
  function Object(value: ObjectType): any {
    return globalThis.Object.entries(value).reduce((acc, [key, value]) => {
      return { ...acc, [key]: Clone(value) }
    }, {})
  }

  function Array(value: ArrayType): any {
    return value.map((element: any) => Clone(element))
  }

  function Value(value: ValueType): any {
    return value
  }

  export function Clone<T extends unknown>(value: T): T {
    if (Is.Object(value)) {
      return Object(value)
    } else if (Is.Array(value)) {
      return Array(value)
    } else if (Is.Value(value)) {
      return Value(value)
    } else {
      throw new Error('ValueClone: Unable to clone value')
    }
  }
}
