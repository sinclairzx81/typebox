/*--------------------------------------------------------------------------

@sinclair/typebox/hash

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

export class ValueHashError extends Error {
  constructor(public readonly value: unknown) {
    super(`Hash: Unable to hash value`)
  }
}

export namespace ValueHash {
  enum ByteMarker {
    Undefined,
    Null,
    Boolean,
    Number,
    String,
    Object,
    Array,
    Date,
    Uint8Array,
  }

  // ----------------------------------------------------
  // State
  // ----------------------------------------------------

  let Hash = globalThis.BigInt('14695981039346656037')
  const [Prime, Size] = [globalThis.BigInt('1099511628211'), globalThis.BigInt('2') ** globalThis.BigInt('64')]
  const Bytes = globalThis.Array.from({ length: 256 }).map((_, i) => globalThis.BigInt(i))
  const F64 = new globalThis.Float64Array(1)
  const F64In = new globalThis.DataView(F64.buffer)
  const F64Out = new globalThis.Uint8Array(F64.buffer)

  // ----------------------------------------------------
  // Guards
  // ----------------------------------------------------

  function IsDate(value: unknown): value is Date {
    return value instanceof globalThis.Date
  }

  function IsUint8Array(value: unknown): value is Uint8Array {
    return value instanceof globalThis.Uint8Array
  }

  function IsArray(value: unknown): value is Array<unknown> {
    return globalThis.Array.isArray(value)
  }

  function IsBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }

  function IsNull(value: unknown): value is null {
    return value === null
  }

  function IsNumber(value: unknown): value is number {
    return typeof value === 'number'
  }

  function IsObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !IsArray(value) && !IsDate(value) && !IsUint8Array(value)
  }

  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }

  function IsUndefined(value: unknown): value is undefined {
    return value === undefined
  }

  // ----------------------------------------------------
  // Encoding
  // ----------------------------------------------------

  function Array(value: Array<unknown>) {
    Fnv1A64(ByteMarker.Array)
    for (const item of value) {
      Visit(item)
    }
  }

  function Boolean(value: boolean) {
    Fnv1A64(ByteMarker.Boolean)
    Fnv1A64(value ? 1 : 0)
  }

  function Date(value: Date) {
    Fnv1A64(ByteMarker.Date)
    Visit(value.getTime())
  }

  function Null(value: null) {
    Fnv1A64(ByteMarker.Null)
  }

  function Number(value: number) {
    Fnv1A64(ByteMarker.Number)
    F64In.setFloat64(0, value)
    for (const byte of F64Out) {
      Fnv1A64(byte)
    }
  }

  function Object(value: Record<string, unknown>) {
    Fnv1A64(ByteMarker.Object)
    for (const key of globalThis.Object.keys(value).sort()) {
      Visit(key)
      Visit(value[key])
    }
  }

  function String(value: string) {
    Fnv1A64(ByteMarker.String)
    for (let i = 0; i < value.length; i++) {
      Fnv1A64(value.charCodeAt(i))
    }
  }

  function Uint8Array(value: Uint8Array) {
    Fnv1A64(ByteMarker.Uint8Array)
    for (let i = 0; i < value.length; i++) {
      Fnv1A64(value[i])
    }
  }

  function Undefined(value: undefined) {
    return Fnv1A64(ByteMarker.Undefined)
  }

  function Visit(value: any) {
    if (IsArray(value)) {
      Array(value)
    } else if (IsBoolean(value)) {
      Boolean(value)
    } else if (IsDate(value)) {
      Date(value)
    } else if (IsNull(value)) {
      Null(value)
    } else if (IsNumber(value)) {
      Number(value)
    } else if (IsObject(value)) {
      Object(value)
    } else if (IsString(value)) {
      String(value)
    } else if (IsUint8Array(value)) {
      Uint8Array(value)
    } else if (IsUndefined(value)) {
      Undefined(value)
    } else {
      throw new ValueHashError(value)
    }
  }

  function Fnv1A64(byte: number) {
    Hash = Hash ^ Bytes[byte]
    Hash = (Hash * Prime) % Size
  }

  /** Creates a FNV1A-64 non cryptographic hash of the given value */
  export function Create(value: unknown) {
    Hash = globalThis.BigInt('14695981039346656037')
    Visit(value)
    return Hash
  }
}
