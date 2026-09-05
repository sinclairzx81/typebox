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

import { Unreachable } from '../system/unreachable/index.ts'
import { GetCodecByTag } from './_registry.ts'

const MT_UINT = 0
const MT_NEGINT = 1
const MT_BYTES = 2
const MT_TEXT = 3
const MT_ARRAY = 4
const MT_MAP = 5
const MT_TAG = 6
const MT_FLOAT = 7

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER)
const MIN_SAFE = BigInt(Number.MIN_SAFE_INTEGER)

const textDecoder = new TextDecoder()
const floatBuffer = new Uint8Array(8)
const floatView = new DataView(floatBuffer.buffer)

// ------------------------------------------------------------------
// Reader
// ------------------------------------------------------------------
let readBuffer: Uint8Array<ArrayBufferLike> = new Uint8Array(0)
let readOffset = 0

function ReadU8(): number {
  return readBuffer[readOffset++]
}
function ReadU16(): number {
  const offset = readOffset
  readOffset += 2
  return (readBuffer[offset] << 8) | readBuffer[offset + 1]
}
function ReadU32(): number {
  const offset = readOffset
  readOffset += 4
  return ((readBuffer[offset] << 24) | (readBuffer[offset + 1] << 16) |
    (readBuffer[offset + 2] << 8) | readBuffer[offset + 3]) >>> 0
}
function ReadU64(): bigint {
  const offset = readOffset
  readOffset += 8
  return (
    (BigInt(readBuffer[offset]) << 56n) |
    (BigInt(readBuffer[offset + 1]) << 48n) |
    (BigInt(readBuffer[offset + 2]) << 40n) |
    (BigInt(readBuffer[offset + 3]) << 32n) |
    (BigInt(readBuffer[offset + 4]) << 24n) |
    (BigInt(readBuffer[offset + 5]) << 16n) |
    (BigInt(readBuffer[offset + 6]) << 8n) |
    BigInt(readBuffer[offset + 7])
  )
}
function ReadF16(): number {
  const bits = ReadU16()
  const exp = (bits >> 10) & 0x1f
  const mant = bits & 0x3ff
  const sign = bits & 0x8000 ? -1 : 1
  if (exp === 0) return sign * Math.pow(2, -14) * (mant / 1024)
  if (exp === 31) return mant === 0 ? sign * Infinity : NaN
  return sign * Math.pow(2, exp - 15) * (1 + mant / 1024)
}
function ReadF32(): number {
  const offset = readOffset
  readOffset += 4
  floatBuffer[0] = readBuffer[offset]
  floatBuffer[1] = readBuffer[offset + 1]
  floatBuffer[2] = readBuffer[offset + 2]
  floatBuffer[3] = readBuffer[offset + 3]
  return floatView.getFloat32(0, false)
}
function ReadF64(): number {
  const offset = readOffset
  readOffset += 8
  floatBuffer[0] = readBuffer[offset]
  floatBuffer[1] = readBuffer[offset + 1]
  floatBuffer[2] = readBuffer[offset + 2]
  floatBuffer[3] = readBuffer[offset + 3]
  floatBuffer[4] = readBuffer[offset + 4]
  floatBuffer[5] = readBuffer[offset + 5]
  floatBuffer[6] = readBuffer[offset + 6]
  floatBuffer[7] = readBuffer[offset + 7]
  return floatView.getFloat64(0, false)
}
function ReadSlice(length: number): Uint8Array {
  const bytes = readBuffer.slice(readOffset, readOffset + length)
  readOffset += length
  return bytes
}
// ------------------------------------------------------------------
// Argument Decoding
// ------------------------------------------------------------------
function ReadArg(info: number): number | bigint {
  if (info <= 23) return info
  if (info === 24) return ReadU8()
  if (info === 25) return ReadU16()
  if (info === 26) return ReadU32()
  if (info === 27) return ReadU64()
  throw new Error(`CBOR Decode: unsupported additional info ${info}`)
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
function BytesToBigInt(bytes: Uint8Array): bigint {
  let result = 0n
  for (const byte of bytes) {
    result = (result << 8n) | BigInt(byte)
  }
  return result
}
// ------------------------------------------------------------------
// Decode
// ------------------------------------------------------------------
function DecodeUint(info: number): number | bigint {
  const arg = ReadArg(info)
  return typeof arg === 'bigint' ? (arg <= MAX_SAFE ? Number(arg) : arg) : arg
}
function DecodeNegint(info: number): number | bigint {
  const arg = ReadArg(info)
  const n = typeof arg === 'bigint' ? arg : BigInt(arg)
  const result = -1n - n
  return result >= MIN_SAFE ? Number(result) : result
}
function DecodeBytes(info: number): Uint8Array {
  return ReadSlice(ReadArg(info) as number)
}
function DecodeText(info: number): string {
  const len = ReadArg(info) as number
  const str = textDecoder.decode(
    readBuffer.subarray(readOffset, readOffset + len)
  )
  readOffset += len
  return str
}
function DecodeArray(info: number): unknown[] {
  const len = ReadArg(info) as number
  const arr = new Array(len)
  for (let i = 0; i < len; i++) arr[i] = DecodeValue()
  return arr
}
function DecodeMap(info: number): Record<string, unknown> {
  const len = ReadArg(info) as number
  const obj: Record<string, unknown> = {}
  for (let i = 0; i < len; i++) {
    const key = DecodeValue()
    const val = DecodeValue()
    obj[key as string] = val
  }
  return obj
}
function DecodeTag(info: number): unknown {
  const tag = ReadArg(info) as number
  const content = DecodeValue()
  if (tag === 2 || tag === 3) {
    const n = BytesToBigInt(content as Uint8Array)
    return tag === 2 ? n : -1n - n
  }
  const codec = GetCodecByTag(tag)
  return codec !== undefined ? codec.Decode(content) : content
}
function DecodeFloat(info: number): unknown {
  switch (info) {
    case 20:
      return false
    case 21:
      return true
    case 22:
      return null
    case 23:
      return undefined
    case 25:
      return ReadF16()
    case 26:
      return ReadF32()
    case 27:
      return ReadF64()
    default:
      throw new Error(`CBOR Decode: unsupported simple/float info ${info}`)
  }
}
function DecodeValue(): unknown {
  const initial = ReadU8()
  const major = initial >> 5
  const info = initial & 0x1f
  switch (major) {
    case MT_UINT:
      return DecodeUint(info)
    case MT_NEGINT:
      return DecodeNegint(info)
    case MT_BYTES:
      return DecodeBytes(info)
    case MT_TEXT:
      return DecodeText(info)
    case MT_ARRAY:
      return DecodeArray(info)
    case MT_MAP:
      return DecodeMap(info)
    case MT_TAG:
      return DecodeTag(info)
    case MT_FLOAT:
      return DecodeFloat(info)
    // deno-coverage-ignore-start note: fallthrough major type is 3 bits (0-7) should handle all 8 cases above
    default:
      Unreachable()
      // deno-coverage-ignore-stop
  }
}
// ------------------------------------------------------------------
// Decode
// ------------------------------------------------------------------
/** Decodes a CBOR-encoded buffer into a JavaScript value per RFC 8949. */
export function Decode(value: Uint8Array<ArrayBufferLike>): unknown {
  readBuffer = value
  readOffset = 0
  return DecodeValue()
}
