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

export class HashError extends Error {
  constructor(public readonly value: unknown) {
    super(`Hash: Unable to hash value`)
  }
}

export namespace Hash {
  type Byte = number
  enum ByteMarker {
    Undefined = 0,
    Null = 1,
    Boolean = 2,
    Number = 3,
    Object = 4,
    Array = 5,
  }

  // ----------------------------------------------------
  // Buffers
  // ----------------------------------------------------

  const [prime, size] = [1099511628211n, 2n ** 64n]
  const bytes = globalThis.Array.from({ length: 256 }).map((_, i) => BigInt(i))
  const f64 = new Float64Array(1)
  const f64In = new DataView(f64.buffer)
  const f64Out = new Uint8Array(f64.buffer)

  // ----------------------------------------------------
  // Guards
  // ----------------------------------------------------

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
    return typeof value === 'object' && value !== null
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

  function* Number(value: number): IterableIterator<Byte> {
    yield ByteMarker.Number
    f64In.setFloat64(0, value)
    yield* f64Out
  }

  function* Object(value: Record<string, unknown>): IterableIterator<Byte> {
    yield ByteMarker.Object
    for (const key of globalThis.Object.keys(value).sort()) {
      yield* Visit(key)
      yield* Visit(value[key])
    }
  }

  function* String(value: string): IterableIterator<Byte> {
    for (let i = 0; i < value.length; i++) {
      yield value.charCodeAt(i)
    }
  }

  function* Undefined(value: undefined): IterableIterator<Byte> {
    yield ByteMarker.Undefined
  }

  function* Null(value: null): IterableIterator<Byte> {
    yield ByteMarker.Null
  }

  function* Visit(value: any): IterableIterator<Byte> {
    if (IsObject(value)) {
      yield* Object(value)
    } else if (IsArray(value)) {
      yield* Array(value)
    } else if (IsBoolean(value)) {
      yield* Boolean(value)
    } else if (IsNumber(value)) {
      yield* Number(value)
    } else if (IsString(value)) {
      yield* String(value)
    } else if (IsUndefined(value)) {
      yield* Undefined(value)
    } else if (IsNull(value)) {
      yield* Null(value)
    } else {
      throw new HashError(value)
    }
  }

  /** Returns a FVN1A64 non cryptographic hash of the given value */
  export function Create(value: unknown): bigint {
    let hash = 14695981039346656037n
    for (const byte of Visit(value)) {
      hash = hash ^ bytes[byte]
      hash = (hash * prime) % size
    }
    return hash
  }
}
