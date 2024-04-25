/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import * as ValueGuard from '../guard/value'

function ArrayType(value: unknown[]) {
  return (value as any).map((value: unknown) => Visit(value as any))
}
function DateType(value: Date) {
  return new Date(value.getTime())
}
function Uint8ArrayType(value: Uint8Array) {
  return new Uint8Array(value)
}
function RegExpType(value: RegExp) {
  return new RegExp(value.source, value.flags)
}
function ObjectType(value: Record<keyof any, unknown>) {
  const result = {} as Record<PropertyKey, unknown>
  for (const key of Object.getOwnPropertyNames(value)) {
    result[key] = Visit(value[key])
  }
  for (const key of Object.getOwnPropertySymbols(value)) {
    result[key] = Visit(value[key])
  }
  return result
}
// prettier-ignore
function Visit(value: unknown): any {
  return (
    ValueGuard.IsArray(value) ? ArrayType(value) : 
    ValueGuard.IsDate(value) ? DateType(value) : 
    ValueGuard.IsUint8Array(value) ? Uint8ArrayType(value) : 
    ValueGuard.IsRegExp(value) ? RegExpType(value) :
    ValueGuard.IsObject(value) ? ObjectType(value) : 
    value
  )
}
/** Clones a value */
export function Clone<T>(value: T): T {
  return Visit(value)
}
