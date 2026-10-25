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

/** Creates the GlobalsGuard. This is a dependency for the Hashing module. */
export const GlobalsGuardModule = (info: BuildInfo.BuildInfo) => (`${Banner('GlobalsGuard')}
const ${info.NameOfGlobalGuard} = {
  IsBoolean: (value: unknown): value is globalThis.Boolean => {
    return value instanceof globalThis.Boolean
  },
  IsNumber: (value: unknown): value is globalThis.Number => {
    return value instanceof globalThis.Number
  },
  IsString: (value: unknown): value is globalThis.String => {
    return value instanceof globalThis.String
  },
  IsTypeArray: (value: unknown): value is ArrayBufferView => {
    return globalThis.ArrayBuffer.isView(value)
  },
  IsInt8Array: (value: unknown): value is Int8Array => {
    return value instanceof globalThis.Int8Array
  },
  IsUint8Array: (value: unknown): value is Uint8Array => {
    return value instanceof globalThis.Uint8Array
  },
  IsUint8ClampedArray: (value: unknown): value is Uint8ClampedArray => {
    return value instanceof globalThis.Uint8ClampedArray
  },
  IsInt16Array: (value: unknown): value is Int16Array => {
    return value instanceof globalThis.Int16Array
  },
  IsUint16Array: (value: unknown): value is Uint16Array => {
    return value instanceof globalThis.Uint16Array
  },
  IsInt32Array: (value: unknown): value is Int32Array => {
    return value instanceof globalThis.Int32Array
  },
  IsUint32Array: (value: unknown): value is Uint32Array => {
    return value instanceof globalThis.Uint32Array
  },
  IsFloat32Array: (value: unknown): value is Float32Array => {
    return value instanceof globalThis.Float32Array
  },
  IsFloat64Array: (value: unknown): value is Float64Array => {
    return value instanceof globalThis.Float64Array
  },
  IsBigInt64Array: (value: unknown): value is BigInt64Array => {
    return value instanceof globalThis.BigInt64Array
  },
  IsBigUint64Array: (value: unknown): value is BigUint64Array => {
    return value instanceof globalThis.BigUint64Array
  },
  IsRegExp: (value: unknown): value is globalThis.RegExp => {
    return value instanceof globalThis.RegExp
  },
  IsDate: (value: unknown): value is globalThis.Date => {
    return value instanceof globalThis.Date
  },
  IsSet: (value: unknown): value is globalThis.Set<unknown> => {
    return value instanceof globalThis.Set
  },
  IsMap: (value: unknown): value is globalThis.Map<unknown, unknown> => {
    return value instanceof globalThis.Map
  }
}`)
