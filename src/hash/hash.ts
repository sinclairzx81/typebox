/*--------------------------------------------------------------------------

@sinclair/typebox/hash

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

export class ValueHashError extends Error {
  constructor(public readonly value: unknown) {
    super(`Hash: Unable to hash value`)
  }
}

export namespace ValueHash {
  type Byte = number
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
  // Buffers
  // ----------------------------------------------------

  const [Prime, Size] = [1099511628211n, 2n ** 64n]
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

  function* Array(value: Array<unknown>): IterableIterator<Byte> {
    yield ByteMarker.Array
    for (const item of value) {
      yield* Visit(item)
    }
  }

  function* Boolean(value: boolean): IterableIterator<Byte> {
    yield ByteMarker.Boolean
    yield value ? 1 : 0
  }

  function* Date(value: Date): IterableIterator<Byte> {
    yield ByteMarker.Date
    yield* Visit(value.getTime())
  }

  function* Null(value: null): IterableIterator<Byte> {
    yield ByteMarker.Null
  }

  function* Number(value: number): IterableIterator<Byte> {
    yield ByteMarker.Number
    F64In.setFloat64(0, value)
    yield* F64Out
  }

  function* Object(value: Record<string, unknown>): IterableIterator<Byte> {
    yield ByteMarker.Object
    for (const key of globalThis.Object.keys(value).sort()) {
      yield* Visit(key)
      yield* Visit(value[key])
    }
  }

  function* String(value: string): IterableIterator<Byte> {
    yield ByteMarker.String
    for (let i = 0; i < value.length; i++) {
      yield value.charCodeAt(i)
    }
  }

  function* Uint8Array(value: Uint8Array): IterableIterator<Byte> {
    yield ByteMarker.Uint8Array
    for (let i = 0; i < value.length; i++) {
      yield value[i]
    }
  }

  function* Undefined(value: undefined): IterableIterator<Byte> {
    yield ByteMarker.Undefined
  }

  function* Visit(value: any): IterableIterator<Byte> {
    if (IsArray(value)) {
      yield* Array(value)
    } else if (IsBoolean(value)) {
      yield* Boolean(value)
    } else if (IsDate(value)) {
      yield* Date(value)
    } else if (IsNull(value)) {
      yield* Null(value)
    } else if (IsNumber(value)) {
      yield* Number(value)
    } else if (IsObject(value)) {
      yield* Object(value)
    } else if (IsString(value)) {
      yield* String(value)
    } else if (IsUint8Array(value)) {
      yield* Uint8Array(value)
    } else if (IsUndefined(value)) {
      yield* Undefined(value)
    } else {
      throw new ValueHashError(value)
    }
  }

  /** Creates a FNV1A-64 non cryptographic hash of the given value */
  export function Hash(value: unknown): bigint {
    let hash = 14695981039346656037n
    for (const byte of Visit(value)) {
      hash = hash ^ Bytes[byte]
      hash = (hash * Prime) % Size
    }
    return hash
  }
}
