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

import * as Guard from './guard.ts'

// --------------------------------------------------------------------------
// Native
// --------------------------------------------------------------------------
/** Returns true if this value is a F32 */
export function IsF32(value: unknown): value is number {
  return Guard.IsNumber(value) &&
    Guard.IsEqual(value, Math.fround(value))
}
/** Returns true if this value is a F64 */
export function IsF64(value: unknown): value is number {
  return Guard.IsNumber(value)
}
/** Returns true if this value is a U8 */
export function IsU8(value: unknown): value is number {
  return Guard.IsInteger(value) &&
    Guard.IsGreaterEqualThan(value, 0) &&
    Guard.IsLessEqualThan(value, 255)
}
/** Returns true if this value is a U16 */
export function IsU16(value: unknown): value is number {
  return Guard.IsInteger(value) &&
    Guard.IsGreaterEqualThan(value, 0) &&
    Guard.IsLessEqualThan(value, 65535)
}
/** Returns true if this value is a U32 */
export function IsU32(value: unknown): value is number {
  return Guard.IsInteger(value) &&
    Guard.IsGreaterEqualThan(value, 0) &&
    Guard.IsLessEqualThan(value, 4294967295)
}
/** Returns true if this value is a U64 */
export function IsU64(value: unknown): value is number {
  return Guard.IsInteger(value) &&
    Guard.IsGreaterEqualThan(value, 0)
}
/** Returns true if this value is a I8 */
export function IsI8(value: unknown): value is number {
  return Guard.IsInteger(value) &&
    Guard.IsGreaterEqualThan(value, -128) &&
    Guard.IsLessEqualThan(value, 127)
}
/** Returns true if this value is a I16 */
export function IsI16(value: unknown): value is number {
  return Guard.IsInteger(value) &&
    Guard.IsGreaterEqualThan(value, -32768) &&
    Guard.IsLessEqualThan(value, 32767)
}
/** Returns true if this value is a I32 */
export function IsI32(value: unknown): value is number {
  return Guard.IsInteger(value) &&
    Guard.IsGreaterEqualThan(value, -2147483648) &&
    Guard.IsLessEqualThan(value, 2147483647)
}
/** Returns true if this value is a I64 */
export function IsI64(value: unknown): value is number | bigint {
  return Guard.IsBigInt(value) &&
    Guard.IsGreaterEqualThan(value, BigInt('-9223372036854775808')) &&
    Guard.IsLessEqualThan(value, BigInt('9223372036854775807'))
}
