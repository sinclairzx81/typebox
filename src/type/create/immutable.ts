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

function ImmutableArray(value: unknown[]) {
  return globalThis.Object.freeze(value as any).map((value: unknown) => Immutable(value as any))
}
function ImmutableDate(value: Date) {
  return value
}
function ImmutableUint8Array(value: Uint8Array) {
  return value
}
function ImmutableRegExp(value: RegExp) {
  return value
}
function ImmutableObject(value: Record<keyof any, unknown>) {
  const result = {} as Record<PropertyKey, unknown>
  for (const key of Object.getOwnPropertyNames(value)) {
    result[key] = Immutable(value[key])
  }
  for (const key of Object.getOwnPropertySymbols(value)) {
    result[key] = Immutable(value[key])
  }
  return globalThis.Object.freeze(result)
}

/** Specialized deep immutable value. Applies freeze recursively to the given value */
// prettier-ignore
export function Immutable(value: unknown): unknown {
  return (
    ValueGuard.IsArray(value) ? ImmutableArray(value) : 
    ValueGuard.IsDate(value) ? ImmutableDate(value) : 
    ValueGuard.IsUint8Array(value) ? ImmutableUint8Array(value) : 
    ValueGuard.IsRegExp(value) ? ImmutableRegExp(value) : 
    ValueGuard.IsObject(value) ? ImmutableObject(value) : 
    value
  )
}
