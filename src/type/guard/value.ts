/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

// --------------------------------------------------------------------------
// PropertyKey
// --------------------------------------------------------------------------
/** Returns true if this value has this property key */
export function HasPropertyKey<K extends PropertyKey>(value: Record<any, unknown>, key: K): value is Record<PropertyKey, unknown> & { [_ in K]: unknown } {
  return key in value
}
// --------------------------------------------------------------------------
// Object Instances
// --------------------------------------------------------------------------
/** Returns true if this value is an async iterator */
export function IsAsyncIterator(value: unknown): value is AsyncIterableIterator<unknown> {
  return IsObject(value) && !IsArray(value) && !IsUint8Array(value) && Symbol.asyncIterator in value
}
/** Returns true if this value is an array */
export function IsArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
/** Returns true if this value is bigint */
export function IsBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}
/** Returns true if this value is a boolean */
export function IsBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}
/** Returns true if this value is a Date object */
export function IsDate(value: unknown): value is Date {
  return value instanceof globalThis.Date
}
/** Returns true if this value is a function */
export function IsFunction(value: unknown): value is Function {
  return typeof value === 'function'
}
/** Returns true if this value is an iterator */
export function IsIterator(value: unknown): value is IterableIterator<unknown> {
  return IsObject(value) && !IsArray(value) && !IsUint8Array(value) && Symbol.iterator in value
}
/** Returns true if this value is null */
export function IsNull(value: unknown): value is null {
  return value === null
}
/** Returns true if this value is number */
export function IsNumber(value: unknown): value is number {
  return typeof value === 'number'
}
/** Returns true if this value is an object */
export function IsObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null
}
/** Returns true if this value is RegExp */
export function IsRegExp(value: unknown): value is RegExp {
  return value instanceof globalThis.RegExp
}
/** Returns true if this value is string */
export function IsString(value: unknown): value is string {
  return typeof value === 'string'
}
/** Returns true if this value is symbol */
export function IsSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}
/** Returns true if this value is a Uint8Array */
export function IsUint8Array(value: unknown): value is Uint8Array {
  return value instanceof globalThis.Uint8Array
}
/** Returns true if this value is undefined */
export function IsUndefined(value: unknown): value is undefined {
  return value === undefined
}
