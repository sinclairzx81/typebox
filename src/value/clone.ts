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
function ObjectType(value: ValueGuard.ObjectType): any {
  const keys = [...Object.getOwnPropertyNames(value), ...Object.getOwnPropertySymbols(value)]
  return keys.reduce((acc, key) => ({ ...acc, [key]: Clone(value[key]) }), {})
}
function ArrayType(value: ValueGuard.ArrayType): any {
  return value.map((element: any) => Clone(element))
}
function TypedArrayType(value: ValueGuard.TypedArrayType): any {
  return value.slice()
}
function DateType(value: Date): any {
  return new Date(value.toISOString())
}
function ValueType(value: ValueGuard.ValueType): any {
  return value
}
// --------------------------------------------------------------------------
// Non-Clonable
// --------------------------------------------------------------------------
function AsyncIteratorType(value: AsyncIterableIterator<unknown>): any {
  return value
}
function IteratorType(value: IterableIterator<unknown>): any {
  return value
}
function FunctionType(value: Function): any {
  return value
}
function PromiseType(value: Promise<unknown>): any {
  return value
}
// --------------------------------------------------------------------------
// Clone
// --------------------------------------------------------------------------
/** Returns a clone of the given value */
export function Clone<T extends unknown>(value: T): T {
  if (ValueGuard.IsArray(value)) return ArrayType(value)
  if (ValueGuard.IsAsyncIterator(value)) return AsyncIteratorType(value)
  if (ValueGuard.IsFunction(value)) return FunctionType(value)
  if (ValueGuard.IsIterator(value)) return IteratorType(value)
  if (ValueGuard.IsPromise(value)) return PromiseType(value)
  if (ValueGuard.IsDate(value)) return DateType(value)
  if (ValueGuard.IsPlainObject(value)) return ObjectType(value)
  if (ValueGuard.IsTypedArray(value)) return TypedArrayType(value)
  if (ValueGuard.IsValueType(value)) return ValueType(value)
  throw new Error('ValueClone: Unable to clone value')
}
