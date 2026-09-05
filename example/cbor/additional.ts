/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

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

import Cbor from 'typebox/cbor'

// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
Cbor.SetCodec(globalThis.Date, {
  tag: 1,
  Encode: (value) => value.getTime() / 1000,
  Decode: (data: number) => new Date(data * 1000)
})
// ------------------------------------------------------------------
// URL
// ------------------------------------------------------------------
Cbor.SetCodec(globalThis.URL, {
  tag: 32,
  Encode: (value) => value.href,
  Decode: (data: string) => new globalThis.URL(data)
})
// ------------------------------------------------------------------
// RegExp
// ------------------------------------------------------------------
Cbor.SetCodec(globalThis.RegExp, {
  tag: 27,
  Encode: (value) => ['RegExp', value.source, value.flags],
  Decode: (data: [string, string, string]) => new globalThis.RegExp(data[1], data[2])
})
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
Cbor.SetCodec(globalThis.Set, {
  tag: 258,
  Encode: (value) => [...value],
  Decode: (data: unknown[]) => new globalThis.Set(data)
})
// ------------------------------------------------------------------
// Map
// ------------------------------------------------------------------
// Map is handled directly in encodeValue (not via tag) to match cbor-x's
// native MT 5 encoding. Tag 259 is registered for decode only.
Cbor.SetCodec(globalThis.Map, {
  tag: 259,
  Encode: (value) => Object.fromEntries(value.entries()),
  Decode: (data: Record<string, unknown>) => new globalThis.Map(Object.entries(data))
})
// ------------------------------------------------------------------
// Uint16Array  (tag 69 = little-endian, RFC 8746)
// ------------------------------------------------------------------
Cbor.SetCodec(globalThis.Uint16Array, {
  tag: 69,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new globalThis.Uint16Array(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})
// ------------------------------------------------------------------
// Uint32Array  (tag 70 = little-endian, RFC 8746)
// ------------------------------------------------------------------
Cbor.SetCodec(globalThis.Uint32Array, {
  tag: 70,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new Uint32Array(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})
// ------------------------------------------------------------------
// BigUint64Array  (tag 71 = little-endian, RFC 8746)
// ------------------------------------------------------------------
Cbor.SetCodec(BigUint64Array, {
  tag: 71,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new BigUint64Array(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})
// ------------------------------------------------------------------
// Uint8ClampedArray  (tag 68)
// ------------------------------------------------------------------
Cbor.SetCodec(globalThis.Uint8ClampedArray, {
  tag: 68,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new Uint8ClampedArray(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})
// ------------------------------------------------------------------
// Int8Array  (tag 72)
// ------------------------------------------------------------------
Cbor.SetCodec(Int8Array, {
  tag: 72,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new globalThis.Int8Array(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})
// ------------------------------------------------------------------
// Int16Array  (tag 77 = little-endian, RFC 8746)
// ------------------------------------------------------------------
Cbor.SetCodec(Int16Array, {
  tag: 77,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new globalThis.Int16Array(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})
// ------------------------------------------------------------------
// Int32Array  (tag 78 = little-endian, RFC 8746)
// ------------------------------------------------------------------
Cbor.SetCodec(Int32Array, {
  tag: 78,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new globalThis.Int32Array(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})
// ------------------------------------------------------------------
// BigInt64Array  (tag 79 = little-endian, RFC 8746)
// ------------------------------------------------------------------
Cbor.SetCodec(BigInt64Array, {
  tag: 79,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new BigInt64Array(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})
// ------------------------------------------------------------------
// Float32Array  (tag 85 = little-endian, RFC 8746)
// ------------------------------------------------------------------
Cbor.SetCodec(Float32Array, {
  tag: 85,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new Float32Array(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})
// ------------------------------------------------------------------
// Float64Array  (tag 86 = little-endian, RFC 8746)
// ------------------------------------------------------------------
Cbor.SetCodec(globalThis.Float64Array, {
  tag: 86,
  Encode: (value) => new globalThis.Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  Decode: (data) =>
    new globalThis.Float64Array(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    )
})