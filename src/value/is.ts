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

export type ValueType = null | undefined | Function | symbol | bigint | number | boolean | string
export type ObjectType = Record<string | number | symbol, unknown>
export type TypedArrayType = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array
export type ArrayType = unknown[]

export namespace Is {
  export function Object(value: unknown): value is ObjectType {
    return value !== null && typeof value === 'object' && !globalThis.Array.isArray(value) && !ArrayBuffer.isView(value)
  }

  export function Array(value: unknown): value is ArrayType {
    return globalThis.Array.isArray(value) && !ArrayBuffer.isView(value)
  }

  export function Value(value: unknown): value is ValueType {
    return value === null || value === undefined || typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string'
  }

  export function TypedArray(value: unknown): value is TypedArrayType {
    return ArrayBuffer.isView(value)
  }
}
