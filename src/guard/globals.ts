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

// --------------------------------------------------------------------------
// Primitives
// --------------------------------------------------------------------------
export function IsBoolean(value: unknown): value is Boolean {
  return value instanceof Boolean
}
export function IsNumber(value: unknown): value is Number {
  return value instanceof Number
}
export function IsString(value: unknown): value is String {
  return value instanceof String
}
// ------------------------------------------------------------------
// TypeArray
// ------------------------------------------------------------------
export type TTypeArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array

// --------------------------------------------------------------------------
// TypeArray
// --------------------------------------------------------------------------
export function IsTypeArray(value: unknown): value is TTypeArray {
  return globalThis.ArrayBuffer.isView(value)
}
/** Returns true if the value is a Int8Array */
export function IsInt8Array(value: unknown): value is Int8Array {
  return value instanceof globalThis.Int8Array
}
/** Returns true if the value is a Uint8Array */
export function IsUint8Array(value: unknown): value is Uint8Array {
  return value instanceof globalThis.Uint8Array
}
/** Returns true if the value is a Uint8ClampedArray */
export function IsUint8ClampedArray(value: unknown): value is Uint8ClampedArray {
  return value instanceof globalThis.Uint8ClampedArray
}
/** Returns true if the value is a Int16Array */
export function IsInt16Array(value: unknown): value is Int16Array {
  return value instanceof globalThis.Int16Array
}
/** Returns true if the value is a Uint16Array */
export function IsUint16Array(value: unknown): value is Uint16Array {
  return value instanceof globalThis.Uint16Array
}
/** Returns true if the value is a Int32Array */
export function IsInt32Array(value: unknown): value is Int32Array {
  return value instanceof globalThis.Int32Array
}
/** Returns true if the value is a Uint32Array */
export function IsUint32Array(value: unknown): value is Uint32Array {
  return value instanceof globalThis.Uint32Array
}
/** Returns true if the value is a Float32Array */
export function IsFloat32Array(value: unknown): value is Float32Array {
  return value instanceof globalThis.Float32Array
}
/** Returns true if the value is a Float64Array */
export function IsFloat64Array(value: unknown): value is Float64Array {
  return value instanceof globalThis.Float64Array
}
/** Returns true if the value is a BigInt64Array */
export function IsBigInt64Array(value: unknown): value is BigInt64Array {
  return value instanceof globalThis.BigInt64Array
}
/** Returns true if the value is a BigUint64Array */
export function IsBigUint64Array(value: unknown): value is BigUint64Array {
  return value instanceof globalThis.BigUint64Array
}
// ------------------------------------------------------------------
// RegExp
// ------------------------------------------------------------------
/** Returns true if the value is a RegExp */
export function IsRegExp(value: unknown): value is globalThis.RegExp {
  return value instanceof globalThis.RegExp
}
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
/** Returns true if the value is a Date */
export function IsDate(value: unknown): value is globalThis.Date {
  return value instanceof globalThis.Date
}
// ------------------------------------------------------------------
// Set
// ------------------------------------------------------------------
/** Returns true if the value is a Set */
export function IsSet(value: unknown): value is globalThis.Set<unknown> {
  return value instanceof globalThis.Set
}
// ------------------------------------------------------------------
// Map
// ------------------------------------------------------------------
/** Returns true if the value is a Map */
export function IsMap(value: unknown): value is globalThis.Map<unknown, unknown> {
  return value instanceof globalThis.Map
}
