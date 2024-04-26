/*--------------------------------------------------------------------------

@sinclair/typebox/value

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

import { IsArray, IsBoolean, IsBigInt, IsDate, IsNull, IsNumber, IsStandardObject, IsString, IsSymbol, IsUint8Array, IsUndefined } from '../guard/index'
import { TypeBoxError } from '../../type/error/index'

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
export class ValueHashError extends TypeBoxError {
  constructor(public readonly value: unknown) {
    super(`Unable to hash value`)
  }
}
// ------------------------------------------------------------------
// ByteMarker
// ------------------------------------------------------------------
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
  Symbol,
  BigInt,
}
// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
let Accumulator = BigInt('14695981039346656037')
const [Prime, Size] = [BigInt('1099511628211'), BigInt('2') ** BigInt('64')]
const Bytes = Array.from({ length: 256 }).map((_, i) => BigInt(i))
const F64 = new Float64Array(1)
const F64In = new DataView(F64.buffer)
const F64Out = new Uint8Array(F64.buffer)
// ------------------------------------------------------------------
// NumberToBytes
// ------------------------------------------------------------------
function* NumberToBytes(value: number): IterableIterator<number> {
  const byteCount = value === 0 ? 1 : Math.ceil(Math.floor(Math.log2(value) + 1) / 8)
  for (let i = 0; i < byteCount; i++) {
    yield (value >> (8 * (byteCount - 1 - i))) & 0xff
  }
}
// ------------------------------------------------------------------
// Hashing Functions
// ------------------------------------------------------------------
function ArrayType(value: Array<unknown>) {
  FNV1A64(ByteMarker.Array)
  for (const item of value) {
    Visit(item)
  }
}
function BooleanType(value: boolean) {
  FNV1A64(ByteMarker.Boolean)
  FNV1A64(value ? 1 : 0)
}
function BigIntType(value: bigint) {
  FNV1A64(ByteMarker.BigInt)
  F64In.setBigInt64(0, value)
  for (const byte of F64Out) {
    FNV1A64(byte)
  }
}
function DateType(value: Date) {
  FNV1A64(ByteMarker.Date)
  Visit(value.getTime())
}
function NullType(value: null) {
  FNV1A64(ByteMarker.Null)
}
function NumberType(value: number) {
  FNV1A64(ByteMarker.Number)
  F64In.setFloat64(0, value)
  for (const byte of F64Out) {
    FNV1A64(byte)
  }
}
function ObjectType(value: Record<string, unknown>) {
  FNV1A64(ByteMarker.Object)
  for (const key of globalThis.Object.getOwnPropertyNames(value).sort()) {
    Visit(key)
    Visit(value[key])
  }
}
function StringType(value: string) {
  FNV1A64(ByteMarker.String)
  for (let i = 0; i < value.length; i++) {
    for (const byte of NumberToBytes(value.charCodeAt(i))) {
      FNV1A64(byte)
    }
  }
}
function SymbolType(value: symbol) {
  FNV1A64(ByteMarker.Symbol)
  Visit(value.description)
}
function Uint8ArrayType(value: Uint8Array) {
  FNV1A64(ByteMarker.Uint8Array)
  for (let i = 0; i < value.length; i++) {
    FNV1A64(value[i])
  }
}
function UndefinedType(value: undefined) {
  return FNV1A64(ByteMarker.Undefined)
}
function Visit(value: any) {
  if (IsArray(value)) return ArrayType(value)
  if (IsBoolean(value)) return BooleanType(value)
  if (IsBigInt(value)) return BigIntType(value)
  if (IsDate(value)) return DateType(value)
  if (IsNull(value)) return NullType(value)
  if (IsNumber(value)) return NumberType(value)
  if (IsStandardObject(value)) return ObjectType(value)
  if (IsString(value)) return StringType(value)
  if (IsSymbol(value)) return SymbolType(value)
  if (IsUint8Array(value)) return Uint8ArrayType(value)
  if (IsUndefined(value)) return UndefinedType(value)
  throw new ValueHashError(value)
}
function FNV1A64(byte: number) {
  Accumulator = Accumulator ^ Bytes[byte]
  Accumulator = (Accumulator * Prime) % Size
}
// ------------------------------------------------------------------
// Hash
// ------------------------------------------------------------------
/** Creates a FNV1A-64 non cryptographic hash of the given value */
export function Hash(value: unknown) {
  Accumulator = BigInt('14695981039346656037')
  Visit(value)
  return Accumulator
}
