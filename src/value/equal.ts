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
// Equality Checks
// --------------------------------------------------------------------------
function ObjectType(left: ValueGuard.ObjectType, right: unknown): boolean {
  if (!ValueGuard.IsPlainObject(right)) return false
  const leftKeys = [...Object.keys(left), ...Object.getOwnPropertySymbols(left)]
  const rightKeys = [...Object.keys(right), ...Object.getOwnPropertySymbols(right)]
  if (leftKeys.length !== rightKeys.length) return false
  return leftKeys.every((key) => Equal(left[key], right[key]))
}
function DateType(left: Date, right: unknown): any {
  return ValueGuard.IsDate(right) && left.getTime() === right.getTime()
}
function ArrayType(left: ValueGuard.ArrayType, right: unknown): any {
  if (!ValueGuard.IsArray(right) || left.length !== right.length) return false
  return left.every((value, index) => Equal(value, right[index]))
}
function TypedArrayType(left: ValueGuard.TypedArrayType, right: unknown): any {
  if (!ValueGuard.IsTypedArray(right) || left.length !== right.length || Object.getPrototypeOf(left).constructor.name !== Object.getPrototypeOf(right).constructor.name) return false
  return left.every((value, index) => Equal(value, right[index]))
}
function ValueType(left: ValueGuard.ValueType, right: unknown): any {
  return left === right
}
// --------------------------------------------------------------------------
// Equal
// --------------------------------------------------------------------------
/** Returns true if the left value deep-equals the right */
export function Equal<T>(left: T, right: unknown): right is T {
  if (ValueGuard.IsPlainObject(left)) return ObjectType(left, right)
  if (ValueGuard.IsDate(left)) return DateType(left, right)
  if (ValueGuard.IsTypedArray(left)) return TypedArrayType(left, right)
  if (ValueGuard.IsArray(left)) return ArrayType(left, right)
  if (ValueGuard.IsValueType(left)) return ValueType(left, right)
  throw new Error('ValueEquals: Unable to compare value')
}
