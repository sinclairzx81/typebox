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

import type { ObjectType, ArrayType, TypedArrayType, ValueType } from '../guard/index'

// ------------------------------------------------------------------
// ValueGuard
// ------------------------------------------------------------------
import { IsArray, IsDate, IsStandardObject, IsTypedArray, IsValueType } from '../guard/index'
// ------------------------------------------------------------------
// Clonable
// ------------------------------------------------------------------
function ObjectType(value: ObjectType): any {
  const Acc = {} as Record<PropertyKey, unknown>
  for (const key of Object.getOwnPropertyNames(value)) {
    Acc[key] = Clone(value[key])
  }
  for (const key of Object.getOwnPropertySymbols(value)) {
    Acc[key] = Clone(value[key])
  }
  return Acc
}
function ArrayType(value: ArrayType): any {
  return value.map((element: any) => Clone(element))
}
function TypedArrayType(value: TypedArrayType): any {
  return value.slice()
}
function DateType(value: Date): any {
  return new Date(value.toISOString())
}
function ValueType(value: ValueType): any {
  return value
}
// ------------------------------------------------------------------
// Clone
// ------------------------------------------------------------------
/** Returns a clone of the given value */
export function Clone<T extends unknown>(value: T): T {
  if (IsArray(value)) return ArrayType(value)
  if (IsDate(value)) return DateType(value)
  if (IsStandardObject(value)) return ObjectType(value)
  if (IsTypedArray(value)) return TypedArrayType(value)
  if (IsValueType(value)) return ValueType(value)
  throw new Error('ValueClone: Unable to clone value')
}
