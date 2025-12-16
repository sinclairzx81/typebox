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

// --------------------------------------------------------------------------
// Guards
// --------------------------------------------------------------------------
/** Returns true if this value is an array */
export function IsArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
/** Returns true if this value is an async iterator */
export function IsAsyncIterator(value: unknown): value is AsyncIterableIterator<unknown> {
  return IsObject(value) && Symbol.asyncIterator in value
}
/** Returns true if this value is bigint */
export function IsBigInt(value: unknown): value is bigint {
  return IsEqual(typeof value, 'bigint')
}
/** Returns true if this value is a boolean */
export function IsBoolean(value: unknown): value is boolean {
  return IsEqual(typeof value, 'boolean')
}
/** Returns true if this value is a constructor */
export function IsConstructor(value: unknown): value is new (...args: never[]) => unknown {
  if (IsUndefined(value) || !IsFunction(value)) return false
  const result = Function.prototype.toString.call(value)
  if (/^class\s/.test(result)) return true
  if (/\[native code\]/.test(result)) return true
  return false
}
/** Returns true if this value is a function */
export function IsFunction(value: unknown): value is Function {
  return IsEqual(typeof value, 'function')
}
/** Returns true if this value is integer */
export function IsInteger(value: unknown): value is number {
  return Number.isInteger(value)
}
/** Returns true if this value is an iterator */
export function IsIterator(value: unknown): value is IterableIterator<unknown> {
  return IsObject(value) && Symbol.iterator in value
}
/** Returns true if this value is null */
export function IsNull(value: unknown): value is null {
  return IsEqual(value, null)
}
/** Returns true if this value is number */
export function IsNumber(value: unknown): value is number {
  return Number.isFinite(value)
}
/** Returns true if this value is an object but not an array */
export function IsObjectNotArray(value: unknown): value is Record<PropertyKey, unknown> {
  return IsObject(value) && !IsArray(value)
}
/** Returns true if this value is an object */
export function IsObject(value: unknown): value is Record<PropertyKey, unknown> {
  return IsEqual(typeof value, 'object') && !(IsNull(value))
}
/** Returns true if this value is string */
export function IsString(value: unknown): value is string {
  return IsEqual(typeof value, 'string')
}
/** Returns true if this value is symbol */
export function IsSymbol(value: unknown): value is symbol {
  return IsEqual(typeof value, 'symbol')
}
/** Returns true if this value is undefined */
export function IsUndefined(value: unknown): value is undefined {
  return IsEqual(value, undefined)
}
// --------------------------------------------------------------------------
// Relational
// --------------------------------------------------------------------------
export function IsEqual(left: unknown, right: unknown): boolean {
  return left === right
}
export function IsGreaterThan<Type extends number | bigint>(left: Type, right: Type): boolean {
  return left > right
}
export function IsLessThan<Type extends number | bigint>(left: Type, right: Type): boolean {
  return left < right
}
export function IsLessEqualThan<Type extends number | bigint>(left: Type, right: Type): boolean {
  return left <= right
}
export function IsGreaterEqualThan<Type extends number | bigint>(left: Type, right: Type): boolean {
  return left >= right
}
// --------------------------------------------------------------------------
// MultipleOf
// --------------------------------------------------------------------------
export function IsMultipleOf(dividend: bigint | number, divisor: bigint | number): boolean {
  if (IsBigInt(dividend) || IsBigInt(divisor)) {
    return BigInt(dividend) % BigInt(divisor) === 0n
  }
  const tolerance = 1e-10
  if (!IsNumber(dividend)) return true
  if (IsInteger(dividend) && (1 / divisor) % 1 === 0) return true
  const mod = dividend % divisor
  return Math.min(Math.abs(mod), Math.abs(mod - divisor)) < tolerance
}
// ------------------------------------------------------------------
// IsClassInstance
// ------------------------------------------------------------------
/** Returns true if the value appears to be an instance of a class. */
export function IsClassInstance(value: unknown): boolean {
  if (!IsObject(value)) return false
  const proto = globalThis.Object.getPrototypeOf(value)
  if (IsNull(proto)) return false
  return IsEqual(typeof proto.constructor, 'function') &&
    !(IsEqual(proto.constructor, globalThis.Object) ||
      IsEqual(proto.constructor.name, 'Object'))
}
// ------------------------------------------------------------------
// IsValueLike
// ------------------------------------------------------------------
export function IsValueLike(value: unknown): value is bigint | boolean | null | number | string | undefined {
  return IsBigInt(value) ||
    IsBoolean(value) ||
    IsNull(value) ||
    IsNumber(value) ||
    IsString(value) ||
    IsUndefined(value)
}
// --------------------------------------------------------------------------
// String
// --------------------------------------------------------------------------
/** Returns the number of Unicode Grapheme Clusters */
export function StringGraphemeCount(value: string): number {
  return Array.from(value).length
}
// --------------------------------------------------------------------------
// Array
// --------------------------------------------------------------------------
export function Every<T>(value: T[], offset: number, callback: (value: T, index: number) => boolean): boolean {
  for (let index = offset; index < value.length; index++) {
    if (!callback(value[index], index)) return false
  }
  return true
}
export function EveryAll<T>(value: T[], offset: number, callback: (value: T, index: number) => boolean): boolean {
  let result = true
  for (let index = offset; index < value.length; index++) {
    if (!callback(value[index], index)) result = false
  }
  return result
}
// --------------------------------------------------------------------------
// Object
// --------------------------------------------------------------------------
/** Returns true if this value has this property key */
export function HasPropertyKey<Key extends PropertyKey>(value: object, key: Key): value is { [_ in Key]: unknown } {
  const isProtoField = IsEqual(key, '__proto__') || IsEqual(key, 'constructor')
  return isProtoField ? Object.prototype.hasOwnProperty.call(value, key) : key in value
}
/** Returns object entries as `[RegExp, Value][]` */
export function EntriesRegExp<Value extends unknown = unknown>(value: Record<PropertyKey, Value>): [RegExp, Value][] {
  return Keys(value).map((key) => [new RegExp(`^${key}$`), value[key]]) as [RegExp, Value][]
}
/** Returns object entries as `[string, Value][]` */
export function Entries<Value extends unknown = unknown>(value: Record<PropertyKey, Value>): [string, Value][] {
  return Object.entries(value)
}
/** Returns the property keys for this object via `Object.getOwnPropertyKeys({ ... })` */
export function Keys(value: Record<PropertyKey, unknown>): string[] {
  return Object.getOwnPropertyNames(value)
}
/** Returns the property keys for this object via `Object.getOwnPropertyKeys({ ... })` */
export function Symbols(value: Record<PropertyKey, unknown>): symbol[] {
  return Object.getOwnPropertySymbols(value)
}
/** Returns the property values for the given object via `Object.values()` */
export function Values(value: Record<PropertyKey, unknown>): unknown[] {
  return Object.values(value)
}
// ------------------------------------------------------------------
// IsDeepEqual
// ------------------------------------------------------------------
function DeepEqualObject(left: Record<PropertyKey, unknown>, right: unknown): boolean {
  if (!IsObject(right)) return false
  const keys = Keys(left)
  return IsEqual(keys.length, Keys(right).length) &&
    keys.every((key) => IsDeepEqual(left[key], right[key]))
}
function DeepEqualArray(left: unknown[], right: unknown): boolean {
  return IsArray(right) && IsEqual(left.length, right.length) &&
    left.every((_, index) => IsDeepEqual(left[index], right[index]))
}
/** Tests values for deep equality */
export function IsDeepEqual(left: unknown, right: unknown): boolean {
  return (
    IsArray(left) ? DeepEqualArray(left, right) : IsObject(left) ? DeepEqualObject(left, right) : IsEqual(left, right)
  )
}
