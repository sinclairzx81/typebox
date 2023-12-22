/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export type ObjectType = Record<PropertyKey, unknown>
export type ArrayType = unknown[]
export type ValueType = null | undefined | symbol | bigint | number | boolean | string
// prettier-ignore
export type TypedArrayType = 
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
// Iterators
// --------------------------------------------------------------------------
/** Returns true if this value is an async iterator */
export function IsAsyncIterator(value: unknown): value is AsyncIterableIterator<any> {
  return IsObject(value) && Symbol.asyncIterator in value
}
/** Returns true if this value is an iterator */
export function IsIterator(value: unknown): value is IterableIterator<any> {
  return IsObject(value) && Symbol.iterator in value
}
// --------------------------------------------------------------------------
// Nominal
// --------------------------------------------------------------------------
/** Returns true if this value is a typed array */
export function IsTypedArray(value: unknown): value is TypedArrayType {
  return ArrayBuffer.isView(value)
}
/** Returns true if this value is a Promise */
export function IsPromise(value: unknown): value is Promise<unknown> {
  return value instanceof Promise
}
/** Returns true if the value is a Uint8Array */
export function IsUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array
}
/** Returns true if this value is a Date */
export function IsDate(value: unknown): value is Date {
  return value instanceof Date && Number.isFinite(value.getTime())
}
// --------------------------------------------------------------------------
// Standard
// --------------------------------------------------------------------------
/** Returns true if this value has this property key */
export function HasPropertyKey<K extends PropertyKey>(value: Record<any, unknown>, key: K): value is ObjectType & Record<K, unknown> {
  return key in value
}
/** Returns true if this object is not an instance of any other type */
export function IsPlainObject(value: unknown): value is ObjectType {
  return IsObject(value) && IsFunction(value.constructor) && value.constructor.name === 'Object'
}
/** Returns true of this value is an object type */
export function IsObject(value: unknown): value is ObjectType {
  return value !== null && typeof value === 'object'
}
/** Returns true if this value is an array, but not a typed array */
export function IsArray(value: unknown): value is ArrayType {
  return Array.isArray(value) && !ArrayBuffer.isView(value)
}
/** Returns true if this value is an undefined */
export function IsUndefined(value: unknown): value is undefined {
  return value === undefined
}
/** Returns true if this value is an null */
export function IsNull(value: unknown): value is null {
  return value === null
}
/** Returns true if this value is an boolean */
export function IsBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}
/** Returns true if this value is an number */
export function IsNumber(value: unknown): value is number {
  return typeof value === 'number'
}
/** Returns true if this value is an integer */
export function IsInteger(value: unknown): value is number {
  return IsNumber(value) && Number.isInteger(value)
}
/** Returns true if this value is bigint */
export function IsBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}
/** Returns true if this value is string */
export function IsString(value: unknown): value is string {
  return typeof value === 'string'
}
/** Returns true if this value is a function */
export function IsFunction(value: unknown): value is Function {
  return typeof value === 'function'
}
/** Returns true if this value is a symbol */
export function IsSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}
/** Returns true if this value is a value type such as number, string, boolean */
export function IsValueType(value: unknown): value is ValueType {
  // prettier-ignore
  return (
    IsBigInt(value) ||
    IsBoolean(value) || 
    IsNull(value) || 
    IsNumber(value) || 
    IsString(value) ||
    IsSymbol(value) ||
    IsUndefined(value)
  )
}
