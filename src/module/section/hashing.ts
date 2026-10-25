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

import * as BuildInfo from '../buildinfo/index.ts'
import { Banner } from './banner.ts'

/** Creates the Hashing module. */
export const HashingModule = (info: BuildInfo.BuildInfo) => (`${Banner('Hashing')}
const ${info.NameOfHashing} = (() => {
  function Unreachable() {
    throw globalThis.Error("Value cannot be hashed")
  }
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
  function IsIEEE754(value: unknown): value is number {
    return typeof value === 'number'
  }
  const ByteMarker = {
    Array: 0x0,
    BigInt: 0x1,
    Boolean: 0x2,
    Date: 0x3,
    Constructor: 0x4,
    Function: 0x5,
    Null: 0x6,
    Number: 0x7,
    Object: 0x8,
    RegExp: 0x9,
    String: 0xA,
    Symbol: 0xB,
    TypeArray: 0xC,
    Undefined: 0xD
  } as const

  let A0 = 0x2325, A1 = 0x8422, A2 = 0x9CE4, A3 = 0xCBF2
  const F64 = new Float64Array(1)
  const F64In = new DataView(F64.buffer)
  const F64Out = new Uint8Array(F64.buffer)

  function FNV1A64_OP(byte: number) {
    const L0 = A0 ^ byte
    const T0 = L0 * 0x1B3
    const T1 = A1 * 0x1B3 + (T0 >>> 16)
    const T2 = A2 * 0x1B3 + (T1 >>> 16) + (L0 << 8)
    const T3 = A3 * 0x1B3 + (T2 >>> 16) + (A1 << 8)
    A0 = T0 & 0xFFFF
    A1 = T1 & 0xFFFF
    A2 = T2 & 0xFFFF
    A3 = T3 & 0xFFFF
  }
  function FromArray(value: unknown[]): void {
    FNV1A64_OP(ByteMarker.Array)
    for (const item of value) {
      FromValue(item)
    }
  }
  function FromBigInt(value: bigint): void {
    FNV1A64_OP(ByteMarker.BigInt)
    F64In.setBigInt64(0, value)
    for (const byte of F64Out) {
      FNV1A64_OP(byte)
    }
  }
  function FromBoolean(value: boolean): void {
    FNV1A64_OP(ByteMarker.Boolean)
    FNV1A64_OP(value ? 1 : 0)
  }
  function FromConstructor(value: new () => unknown): void {
    FNV1A64_OP(ByteMarker.Constructor)
    FromValue(value.toString())
  }
  function FromDate(value: Date): void {
    FNV1A64_OP(ByteMarker.Date)
    FromValue(value.getTime())
  }
  function FromFunction(value: globalThis.Function): void {
    FNV1A64_OP(ByteMarker.Function)
    FromValue(value.toString())
  }
  function FromNull(_value: null): void {
    FNV1A64_OP(ByteMarker.Null)
  }
  function FromNumber(value: number): void {
    FNV1A64_OP(ByteMarker.Number)
    F64In.setFloat64(0, value, true /* little-endian */)
    for (const byte of F64Out) {
      FNV1A64_OP(byte)
    }
  }
  function FromObject(value: Record<PropertyKey, unknown>): void {
    FNV1A64_OP(ByteMarker.Object)
    for (const key of InstanceKeys(value).sort()) {
      FromValue(key)
      FromValue(value[key])
    }
  }
  function FromRegExp(value: RegExp): void {
    FNV1A64_OP(ByteMarker.RegExp)
    FromString(value.toString())
  }
  const encoder = new TextEncoder()
  function FromString(value: string): void {
    FNV1A64_OP(ByteMarker.String)
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i)
      if (code > 0x7F) {
        for (const byte of encoder.encode(value.slice(i))) {
          FNV1A64_OP(byte)
        }
        return
      }
      FNV1A64_OP(code)
    }
  }
  function FromSymbol(value: symbol): void {
    FNV1A64_OP(ByteMarker.Symbol)
    FromValue(value.toString())
  }
  function FromTypeArray(value: ArrayBufferView): void {
    FNV1A64_OP(ByteMarker.TypeArray)
    const buffer = new Uint8Array(value.buffer)
    for (let i = 0; i < buffer.length; i++) {
      FNV1A64_OP(buffer[i])
    }
  }
  function FromUndefined(_value: undefined): void {
    return FNV1A64_OP(ByteMarker.Undefined)
  }
  function FromValue(value: unknown): void {
    return (
      ${info.NameOfGlobalGuard}.IsTypeArray(value) ? FromTypeArray(value) :
      ${info.NameOfGlobalGuard}.IsDate(value) ? FromDate(value) :
      ${info.NameOfGlobalGuard}.IsRegExp(value) ? FromRegExp(value) :
      ${info.NameOfGlobalGuard}.IsBoolean(value) ? FromBoolean(value.valueOf()) :
      ${info.NameOfGlobalGuard}.IsString(value) ? FromString(value.valueOf()) :
      ${info.NameOfGlobalGuard}.IsNumber(value) ? FromNumber(value.valueOf()) :
      IsIEEE754(value) ? FromNumber(value) :
      ${info.NameOfGuard}.IsArray(value) ? FromArray(value) :
      ${info.NameOfGuard}.IsBoolean(value) ? FromBoolean(value) :
      ${info.NameOfGuard}.IsBigInt(value) ? FromBigInt(value) :
      ${info.NameOfGuard}.IsConstructor(value) ? FromConstructor(value) :
      ${info.NameOfGuard}.IsNull(value) ? FromNull(value) :
      ${info.NameOfGuard}.IsObject(value) ? FromObject(value) :
      ${info.NameOfGuard}.IsString(value) ? FromString(value) :
      ${info.NameOfGuard}.IsSymbol(value) ? FromSymbol(value) :
      ${info.NameOfGuard}.IsUndefined(value) ? FromUndefined(value) :
      ${info.NameOfGuard}.IsFunction(value) ? FromFunction(value) :
      Unreachable()
    )
  }
  function Hex(limb: number): string {
    return limb.toString(16).padStart(4, '0')
  }
  function Hash(value: unknown): string {
    A0 = 0x2325, A1 = 0x8422, A2 = 0x9CE4, A3 = 0xCBF2
    FromValue(value)
    return \`\${Hex(A3)}\${Hex(A2)}\${Hex(A1)}\${Hex(A0)}\`
  }
  return { Hash }
})()`)
