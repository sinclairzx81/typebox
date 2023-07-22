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

import * as ValueGuard from './guard'

// --------------------------------------------------------------------------
// Clonable
// --------------------------------------------------------------------------
function Array(value: ValueGuard.ArrayType): any {
  return value.map((element: any) => Clone(element))
}
function Date(value: Date): any {
  return new globalThis.Date(value.toISOString())
}
function Object(value: ValueGuard.ObjectType): any {
  const keys = [...globalThis.Object.getOwnPropertyNames(value), ...globalThis.Object.getOwnPropertySymbols(value)]
  return keys.reduce((acc, key) => ({ ...acc, [key]: Clone(value[key]) }), {})
}
function TypedArray(value: ValueGuard.TypedArrayType): any {
  return value.slice()
}
function Value(value: ValueGuard.ValueType): any {
  return value
}
// --------------------------------------------------------------------------
// Non-Clonable
// --------------------------------------------------------------------------
function AsyncIterator(value: AsyncIterableIterator<unknown>): any {
  return value
}
function Iterator(value: IterableIterator<unknown>): any {
  return value
}
function Function(value: Function): any {
  return value
}
function Promise(value: Promise<unknown>): any {
  return value
}
// --------------------------------------------------------------------------
// Clone
// --------------------------------------------------------------------------
/** Returns a clone of the given value */
export function Clone<T extends unknown>(value: T): T {
  if (ValueGuard.IsArray(value)) return Array(value)
  if (ValueGuard.IsAsyncIterator(value)) return AsyncIterator(value)
  if (ValueGuard.IsFunction(value)) return Function(value)
  if (ValueGuard.IsIterator(value)) return Iterator(value)
  if (ValueGuard.IsPromise(value)) return Promise(value)
  if (ValueGuard.IsDate(value)) return Date(value)
  if (ValueGuard.IsPlainObject(value)) return Object(value)
  if (ValueGuard.IsTypedArray(value)) return TypedArray(value)
  if (ValueGuard.IsValueType(value)) return Value(value)
  throw new Error('ValueClone: Unable to clone value')
}
