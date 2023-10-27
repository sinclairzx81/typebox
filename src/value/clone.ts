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

import type { ObjectType, ArrayType, TypedArrayType, ValueType } from './guard'
import { IsArray, IsDate, IsMap, IsSet, IsObject, IsTypedArray, IsValueType } from './guard'
import * as Types from '../typebox'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class CloneError extends Types.TypeBoxError {
  constructor(public readonly value: unknown) {
    super('Unable to clone value')
  }
}
// --------------------------------------------------------------------------
// Clonable
// --------------------------------------------------------------------------
function CloneTypedArray(value: TypedArrayType): any {
  return value.slice()
}
function CloneArray(value: ArrayType): any {
  return value.map((element: any) => Clone(element))
}
function CloneDate(value: Date): any {
  return new Date(value.getTime())
}
function CloneMap(value: Map<unknown, unknown>): any {
  return new Map(value.entries())
}
function CloneSet(value: Set<unknown>): any {
  return new Set(value.values())
}
function CloneObject(value: ObjectType): any {
  const keys = [...Object.getOwnPropertyNames(value), ...Object.getOwnPropertySymbols(value)]
  return keys.reduce((acc, key) => ({ ...acc, [key]: Clone(value[key]) }), {})
}
function CloneValueType(value: ValueType): any {
  return value
}
// --------------------------------------------------------------------------
// Clone
// --------------------------------------------------------------------------
/** Returns a structural clone of the given value */
export function Clone<T extends unknown>(value: T): T {
  // prettier-ignore
  return (
    IsTypedArray(value) ? CloneTypedArray(value) :
    IsMap(value) ? CloneMap(value) :
    IsSet(value) ? CloneSet(value) :
    IsDate(value) ? CloneDate(value) :
    IsArray(value) ? CloneArray(value) :
    IsObject(value) ? CloneObject(value) :
    IsValueType(value) ? CloneValueType(value) :
    (() => { throw new CloneError(value) })
  )
}
