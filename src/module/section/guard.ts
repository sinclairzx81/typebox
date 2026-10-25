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

import { Unreachable } from '../../system/unreachable/index.ts'
import { Guard } from '../../guard/index.ts'
import * as BuildInfo from '../buildinfo/index.ts'
import { Banner } from './banner.ts'

// ------------------------------------------------------------------
// IsArray
// ------------------------------------------------------------------
const IsArray = () =>
  String.raw`  IsArray: (value: unknown): value is unknown[] => {
    return Array.isArray(value)
  }`
// ------------------------------------------------------------------
// IsBigInt
// ------------------------------------------------------------------
const IsBigInt = () =>
  String.raw`  IsBigInt: (value: unknown): value is bigint => {
    return typeof value === 'bigint'
  }`
// ------------------------------------------------------------------
// IsBoolean
// ------------------------------------------------------------------
const IsBoolean = () =>
  String.raw`  IsBoolean: (value: unknown): value is boolean => {
    return typeof value === 'boolean'
  }`
// ------------------------------------------------------------------
// IsConstructor
// ------------------------------------------------------------------
const IsConstructor = () =>
  String.raw`  IsConstructor: (value: unknown): value is new (...args: never[]) => unknown => {
    if (Guard.IsUndefined(value) || !Guard.IsFunction(value)) return false
    const result = Function.prototype.toString.call(value)
    if (/^class\s/.test(result)) return true
    if (/\[native code\]/.test(result)) return true
    return false
  }`
// ------------------------------------------------------------------
// IsFunction
// ------------------------------------------------------------------
const IsFunction = () =>
  String.raw`  IsFunction: (value: unknown): value is globalThis.Function => {
    return typeof value === 'function'
  }`
// ------------------------------------------------------------------
// IsInteger
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unused
const IsInteger = () =>
  String.raw`  IsInteger: (value: unknown): value is number => {
    return Number.isInteger(value)
  }`
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// IsNull
// ------------------------------------------------------------------
const IsNull = () =>
  String.raw`  IsNull: (value: unknown): value is null => {
    return value === null
  }`
// ------------------------------------------------------------------
// IsNumber
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unused
const IsNumber = () =>
  String.raw`  IsNumber: (value: unknown): value is number => {
    return Number.isFinite(value)
  }`
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// IsObject
// ------------------------------------------------------------------
const IsObject = () =>
  String.raw`  IsObject: (value: unknown): value is Record<PropertyKey, unknown> => {
    return typeof value === 'object' && value !== null
  }`
// ------------------------------------------------------------------
// IsString
// ------------------------------------------------------------------
const IsString = () =>
  String.raw`  IsString: (value: unknown): value is string => {
    return typeof value === 'string'
  }`
// ------------------------------------------------------------------
// IsSymbol
// ------------------------------------------------------------------
const IsSymbol = () =>
  String.raw`  IsSymbol: (value: unknown): value is symbol => {
    return typeof value === 'symbol'
  }`
// ------------------------------------------------------------------
// IsUndefined
// ------------------------------------------------------------------
const IsUndefined = () =>
  String.raw`  IsUndefined: (value: unknown): value is undefined => {
    return value === undefined
  }`
// ------------------------------------------------------------------
// CodePointCount
// ------------------------------------------------------------------
const CodePointCount = () =>
  String.raw`  CodePointCount: (value: string): number => {
    let result = 0, index = 0, prev = 0
    while (index < value.length) {
      const next = value.charCodeAt(index++) >> 0xA
      result += +(((prev << 8) | next) !== 0x3637)
      prev = next
    }
    return result
  }`
// ------------------------------------------------------------------
// IsMultipleOf
// ------------------------------------------------------------------
const IsMultipleOf = () =>
  String.raw`  IsMultipleOf: (dividend: bigint | number, divisor: bigint | number) => {
    if ((typeof dividend === 'bigint') || (typeof divisor === 'bigint')) {
      return BigInt(dividend) % BigInt(divisor) === 0n
    }
    const tolerance = 1e-10
    if (!Number.isFinite(dividend)) return true
    if (Number.isInteger(dividend) && (1 / divisor) % 1 === 0) return true
    const mod = dividend % divisor
    return Math.min(Math.abs(mod), Math.abs(mod - divisor), Math.abs(mod + divisor)) < tolerance
  }`
// ------------------------------------------------------------------
// IsDeepEqual
// ------------------------------------------------------------------
const IsDeepEqual = () =>
  String.raw`  IsEqual: (left: unknown, right: unknown): boolean => {
    return left === right
  },
  Keys: (value: Record<PropertyKey, unknown>): string[] => {
    return Object.getOwnPropertyNames(value)
  },
  IsDeepEqualObject: (left: Record<PropertyKey, unknown>, right: unknown): boolean => {
    if (!Guard.IsObject(right)) return false
    const keys = Guard.Keys(left)
    return Guard.IsEqual(keys.length, Guard.Keys(right).length) &&
      keys.every((key) => Guard.IsDeepEqual(left[key], right[key]))
  },
  IsDeepEqualArray: (left: unknown[], right: unknown) => {
    return Guard.IsArray(right) && Guard.IsEqual(left.length, right.length) &&
      left.every((_, index) => Guard.IsDeepEqual(left[index], right[index]))
  },
  IsDeepEqual: (left: unknown, right: unknown): boolean => {
    return (
      Guard.IsArray(left) ? Guard.IsDeepEqualArray(left, right) : 
      Guard.IsObject(left) ? Guard.IsDeepEqualObject(left, right) : 
      Guard.IsEqual(left, right)
    )
  }`
// ------------------------------------------------------------------
// GuardModule
// ------------------------------------------------------------------
/** Creates the Guard module. This function requires BuildInfo for conditional emit. */
export const GuardModule = (info: BuildInfo.BuildInfo): string => {
  const entries: [boolean, () => string][] = [
    [info.UseGuardIsArray, IsArray],
    [info.UseGuardIsBigInt, IsBigInt],
    [info.UseGuardIsBoolean, IsBoolean],
    [info.UseGuardIsConstructor, IsConstructor],
    [info.UseGuardIsFunction, IsFunction],
    [info.UseGuardIsInteger, IsInteger],
    [info.UseGuardIsNull, IsNull],
    [info.UseGuardIsNumber, IsNumber],
    [info.UseGuardIsObject, IsObject],
    [info.UseGuardIsString, IsString],
    [info.UseGuardIsSymbol, IsSymbol],
    [info.UseGuardIsUndefined, IsUndefined],
    [info.UseGuardCodePointCount, CodePointCount],
    [info.UseGuardMultipleOf, IsMultipleOf],
    [info.UseGuardIsDeepEqual, IsDeepEqual]
  ]
  const enabled = entries.filter(([use]) => use).map(([, emit]) => emit())
  // deno-coverage-ignore-start - guard by info.UseFormat
  if (Guard.IsEqual(enabled.length, 0)) Unreachable()
  // deno-coverage-ignore-stop
  return `${Banner('Guard')}\nconst ${info.NameOfGuard} = {\n${enabled.join(',\n')}\n}`
}
