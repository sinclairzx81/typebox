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

import { GetCodecByConstructor } from './_registry.ts'

const MT_UINT = 0
const MT_NEGINT = 1
const MT_BYTES = 2
const MT_TEXT = 3
const MT_ARRAY = 4
const MT_MAP = 5
const MT_TAG = 6
const MT_FLOAT = 7

const UINT64_MAX = 18446744073709551615n
const utf8 = new TextEncoder()

// ------------------------------------------------------------------
// Writer
// ------------------------------------------------------------------
let writeBuffer = new Uint8Array(131072)
let writeView = new DataView(writeBuffer.buffer)
let writeOffset = 0

function WriteEnsure(bytes: number): void {
  const required = writeOffset + bytes
  if (required <= writeBuffer.length) return
  let capacity = writeBuffer.length
  while (capacity < required) capacity *= 2
  const next = new Uint8Array(capacity)
  next.set(writeBuffer)
  writeBuffer = next
  writeView = new DataView(writeBuffer.buffer)
}
function WriteU8(value: number): void {
  WriteEnsure(1)
  writeBuffer[writeOffset++] = value
}
function WriteU16(value: number): void {
  WriteEnsure(2)
  writeView.setUint16(writeOffset, value, false)
  writeOffset += 2
}
function WriteU32(value: number): void {
  WriteEnsure(4)
  writeView.setUint32(writeOffset, value, false)
  writeOffset += 4
}
function WriteU64(value: bigint): void {
  WriteEnsure(8)
  writeView.setBigUint64(writeOffset, value, false)
  writeOffset += 8
}
function WriteF16(value: number): void {
  WriteEnsure(2)
  let bits = 0
  if (isNaN(value)) {
    bits = 0x7e00
  } else if (!isFinite(value)) {
    bits = value > 0 ? 0x7c00 : 0xfc00
  }
  writeView.setUint16(writeOffset, bits, false)
  writeOffset += 2
}
function WriteF64(value: number): void {
  WriteEnsure(8)
  writeView.setFloat64(writeOffset, value, false)
  writeOffset += 8
}
function WriteBytes(value: Uint8Array): void {
  WriteEnsure(value.length)
  writeBuffer.set(value, writeOffset)
  writeOffset += value.length
}
// ------------------------------------------------------------------
// Head
// ------------------------------------------------------------------
function EncodeHead(major: number, arg: number | bigint): void {
  const base = major << 5
  if (typeof arg === 'bigint') {
    WriteU8(base | 27)
    WriteU64(arg)
    return
  }
  if (arg <= 23) {
    WriteU8(base | arg)
  } else if (arg <= 0xff) {
    WriteU8(base | 24)
    WriteU8(arg)
  } else if (arg <= 0xffff) {
    WriteU8(base | 25)
    WriteU16(arg)
  } else if (arg <= 0xffffffff) {
    WriteU8(base | 26)
    WriteU32(arg)
  } else {
    WriteU8(base | 27)
    WriteU64(BigInt(arg))
  }
}
function EncodeFloat16(value: number): void {
  WriteU8((MT_FLOAT << 5) | 25)
  WriteF16(value)
}
function EncodeFloat64(value: number): void {
  WriteU8((MT_FLOAT << 5) | 27)
  WriteF64(value)
}
function EncodeNumber(value: number): void {
  if (!isFinite(value) || isNaN(value)) return EncodeFloat16(value)
  if (Number.isInteger(value)) {
    return value >= 0 ? EncodeHead(MT_UINT, value) : EncodeHead(MT_NEGINT, -1 - value)
  }
  return EncodeFloat64(value)
}
function EncodeBigInt(value: bigint): void {
  if (value >= 0n) {
    if (value <= UINT64_MAX) return EncodeHead(MT_UINT, value)
    EncodeHead(MT_TAG, 2)
    const bytes = bigIntToBytes(value)
    EncodeHead(MT_BYTES, bytes.length)
    WriteBytes(bytes)
  } else {
    const magnitude = -1n - value
    if (magnitude <= UINT64_MAX) return EncodeHead(MT_NEGINT, magnitude)
    EncodeHead(MT_TAG, 3)
    const bytes = bigIntToBytes(magnitude)
    EncodeHead(MT_BYTES, bytes.length)
    WriteBytes(bytes)
  }
}
function bigIntToBytes(value: bigint): Uint8Array {
  const hex = value.toString(16)
  const padded = hex.length % 2 === 0 ? hex : '0' + hex
  const bytes = new Uint8Array(padded.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(padded.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}
function EncodeString(value: string): void {
  const bytes = utf8.encode(value)
  EncodeHead(MT_TEXT, bytes.length)
  WriteBytes(bytes)
}
function EncodeObject(value: object): void {
  if (value instanceof Uint8Array) {
    EncodeHead(MT_BYTES, value.length)
    return WriteBytes(value)
  }
  if (Array.isArray(value)) {
    EncodeHead(MT_ARRAY, value.length)
    for (const item of value) EncodeValue(item)
    return
  }
  if (value instanceof Map) {
    EncodeHead(MT_MAP, value.size)
    for (const [key, val] of value) {
      EncodeValue(key)
      EncodeValue(val)
    }
    return
  }
  const codec = GetCodecByConstructor(value)
  if (codec !== undefined) {
    EncodeHead(MT_TAG, codec.tag)
    return EncodeValue(codec.Encode(value))
  }
  const result = value as Record<string, unknown>
  let keyCount = 0
  for (const _ in result) keyCount++
  EncodeHead(MT_MAP, keyCount)
  for (const key in result) {
    EncodeString(key)
    EncodeValue(result[key])
  }
}
// ------------------------------------------------------------------
// EncodeValue
// ------------------------------------------------------------------
function EncodeValue(value: unknown): void {
  if (value === null) return WriteU8(0xf6)
  if (value === undefined) return WriteU8(0xf7)
  switch (typeof value) {
    case 'boolean':
      return WriteU8(value ? 0xf5 : 0xf4)
    case 'number':
      return EncodeNumber(value)
    case 'bigint':
      return EncodeBigInt(value)
    case 'string':
      return EncodeString(value)
    case 'object':
      return EncodeObject(value)
    default:
      throw new Error(`CBOR Encode: unsupported type "${typeof value}"`)
  }
}
// ------------------------------------------------------------------
// Encode
// ------------------------------------------------------------------
/** Encodes a JavaScript value into a CBOR buffer per RFC 8949. */
export function Encode(value: unknown): Uint8Array {
  writeOffset = 0
  EncodeValue(value)
  return writeBuffer.slice(0, writeOffset)
}
