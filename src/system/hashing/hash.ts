/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

// deno-fmt-ignore-file

import { Unreachable } from '../unreachable/index.ts'
import { Guard, GlobalsGuard } from '../../guard/index.ts'

// ------------------------------------------------------------------
// InstanceKeys
//
// Retrieves all enumerable and non-enumerable own property keys 
// and inherited prototype keys (excluding symbols and the 'constructor') 
// from an object instance.
//
// This function is useful for differentiating between class instances 
// based on their structural keys rather than relying on the 
// constructor name. It provides a more reliable structural comparison 
// by capturing both own and prototype properties.
//
// ------------------------------------------------------------------
function InstanceKeys(value: Record<PropertyKey, unknown>): PropertyKey[] {
  const propertyKeys = new Set<PropertyKey>()
  let current = value
  while (current && current !== Object.prototype) {
    for (const key of Reflect.ownKeys(current)) {
      if (key !== 'constructor' && typeof key !== 'symbol') propertyKeys.add(key)
    }
    current = Object.getPrototypeOf(current)
  }
  return [...propertyKeys]
}
// ------------------------------------------------------------------
// IsIEEE754
//
// TypeBox guards do not consider +/- Infinity or NaN as valid
// numbers, but they are valid IEEE754 numbers. We use a special
// guard to ensure these numbers are considered for hashing.
//
// ------------------------------------------------------------------
function IsIEEE754(value: unknown): value is number {
  return typeof value === 'number'
}
// ------------------------------------------------------------------
// ByteMarker
// ------------------------------------------------------------------
enum ByteMarker {
  Array = 0x0,
  BigInt = 0x1,
  Boolean = 0x2,
  Date = 0x3,
  Constructor = 0x4,
  Function = 0x5,
  Null = 0x6,
  Number = 0x7,
  Object = 0x8,
  RegExp = 0x9,
  String = 0xA,
  Symbol = 0xB,
  TypeArray = 0xC,
  Undefined = 0xD,
}
// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
let Accumulator = BigInt('14695981039346656037')
const [Prime, Size] = [BigInt('1099511628211'), BigInt('18446744073709551616' /* 2 ^ 64 */)]
const Bytes = Array.from({ length: 256 }).map((_, i) => BigInt(i))
const F64 = new Float64Array(1)
const F64In = new DataView(F64.buffer)
const F64Out = new Uint8Array(F64.buffer)
// ------------------------------------------------------------------
// Operation
// ------------------------------------------------------------------
function FNV1A64_OP(byte: number) {
  Accumulator = Accumulator ^ Bytes[byte]
  Accumulator = (Accumulator * Prime) % Size
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
function FromArray(value: unknown[]): void {
  FNV1A64_OP(ByteMarker.Array)
  for (const item of value) {
    FromValue(item)
  }
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
function FromBigInt(value: bigint): void {
  FNV1A64_OP(ByteMarker.BigInt)
  F64In.setBigInt64(0, value)
  for (const byte of F64Out) {
    FNV1A64_OP(byte)
  }
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
function FromBoolean(value: boolean): void {
  FNV1A64_OP(ByteMarker.Boolean)
  FNV1A64_OP(value ? 1 : 0)
}
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
function FromConstructor(value: new () => unknown): void {
  FNV1A64_OP(ByteMarker.Constructor)
  FromValue(value.toString())
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
function FromDate(value: Date): void {
  FNV1A64_OP(ByteMarker.Date)
  FromValue(value.getTime())
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
function FromFunction(value: Function): void {
  FNV1A64_OP(ByteMarker.Function)
  FromValue(value.toString())
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
function FromNull(_value: null): void {
  FNV1A64_OP(ByteMarker.Null)
}
// ------------------------------------------------------------------
// Number | IEEE754
// ------------------------------------------------------------------
function FromNumber(value: number): void {
  FNV1A64_OP(ByteMarker.Number)
  F64In.setFloat64(0, value, true /* little-endian */)
  for (const byte of F64Out) {
    FNV1A64_OP(byte)
  }
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
function FromObject(value: Record<PropertyKey, unknown>): void {
  FNV1A64_OP(ByteMarker.Object)
  for (const key of InstanceKeys(value).sort()) {
    FromValue(key)
    FromValue(value[key])
  }
}
// ------------------------------------------------------------------
// RegExp
// ------------------------------------------------------------------
function FromRegExp(value: RegExp): void {
  FNV1A64_OP(ByteMarker.RegExp)
  FromString(value.toString())
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
const encoder = new TextEncoder()
function FromString(value: string): void {
  FNV1A64_OP(ByteMarker.String)
  for (const byte of encoder.encode(value)) {
    FNV1A64_OP(byte)
  }
}
// ------------------------------------------------------------------
// Symbol
// ------------------------------------------------------------------
function FromSymbol(value: symbol): void {
  FNV1A64_OP(ByteMarker.Symbol)
  FromValue(value.toString())
}
// ------------------------------------------------------------------
// TypeArray
// ------------------------------------------------------------------
function FromTypeArray(value: GlobalsGuard.TTypeArray): void {
  FNV1A64_OP(ByteMarker.TypeArray)
  const buffer = new Uint8Array(value.buffer)
  for (let i = 0; i < buffer.length; i++) {
    FNV1A64_OP(buffer[i])
  }
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
function FromUndefined(_value: undefined): void {
  return FNV1A64_OP(ByteMarker.Undefined)
}
// ------------------------------------------------------------------
// Hash
//
// deno-coverage-ignore-start - unreachable
//
// This function should all JavaScript values so we can't reach the
// fall-through. We use Unreachable to assert that no values pass
// through. We will need to handle these should they arise.
//
// ------------------------------------------------------------------
function FromValue(value: unknown): void {
  return (
    GlobalsGuard.IsTypeArray(value) ? FromTypeArray(value) :
    GlobalsGuard.IsDate(value) ? FromDate(value) :
    GlobalsGuard.IsRegExp(value) ? FromRegExp(value) :
    GlobalsGuard.IsBoolean(value) ? FromBoolean(value.valueOf()) :
    GlobalsGuard.IsString(value) ? FromString(value.valueOf()) :
    GlobalsGuard.IsNumber(value) ? FromNumber(value.valueOf()) :
    IsIEEE754(value) ? FromNumber(value) :
    Guard.IsArray(value) ? FromArray(value) :
    Guard.IsBoolean(value) ? FromBoolean(value) :
    Guard.IsBigInt(value) ? FromBigInt(value) :
    Guard.IsConstructor(value) ? FromConstructor(value) :
    Guard.IsNull(value) ? FromNull(value) :
    Guard.IsObject(value) ? FromObject(value) :
    Guard.IsString(value) ? FromString(value) :
    Guard.IsSymbol(value) ? FromSymbol(value) :
    Guard.IsUndefined(value) ? FromUndefined(value) :
    Guard.IsFunction(value) ? FromFunction(value) :
    Unreachable()
  )
}
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// Hash
// ------------------------------------------------------------------
/** Generates a FNV1A-64 non cryptographic hash of the given value */
export function HashCode(value: unknown): bigint {
  Accumulator = BigInt('14695981039346656037')
  FromValue(value)
  return Accumulator
}
/** Generates a FNV1A-64 non cryptographic hash of the given value */
export function Hash(value: unknown): string {
  return HashCode(value).toString(16).padStart(16, '0')
}