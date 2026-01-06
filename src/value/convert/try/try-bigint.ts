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

// deno-fmt-ignore-file
// deno-lint-ignore-file

import { Guard } from '../../../guard/index.ts'
import { TResult, Ok, Fail } from './try-result.ts'

// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unreachable | guarded
function FromBigInt(value: bigint): TResult<bigint> {
   return Ok(value)
}
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
function FromBoolean(value: boolean): TResult<bigint> {
  return Guard.IsEqual(value, true) ? Ok(BigInt(1)) : Ok(BigInt(0))
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
function FromNumber(value: number): TResult<bigint> { 
  return Ok(BigInt(Math.trunc(value)))
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
function FromNull(value: null): TResult<bigint> { 
  return Ok(BigInt(0))
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
const bigintPattern = /^-?(0|[1-9]\d*)n$/
const decimalPattern = /^-?(0|[1-9]\d*)\.\d+$/
const integerPattern = /^-?(0|[1-9]\d*)$/
function IsStringBigIntLike(value: string): boolean {
  return bigintPattern.test(value)
}
function IsStringDecimalLike(value: string): boolean {
  return decimalPattern.test(value)
}
function IsStringIntegerLike(value: string): boolean {
  return integerPattern.test(value)
}
function FromString(value: string): TResult<bigint> {
  const lowercase = value.toLowerCase()
  return (
    IsStringBigIntLike(value) ? Ok(BigInt(value.slice(0, value.length - 1))) :
    IsStringDecimalLike(value) ? Ok(BigInt(value.split('.')[0])) :
    IsStringIntegerLike(value) ? Ok(BigInt(value)) :
    Guard.IsEqual(lowercase, 'false') ? Ok(BigInt(0)) :
    Guard.IsEqual(lowercase, 'true') ? Ok(BigInt(1)) :
    Fail()
  )
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
function FromUndefined(value: undefined): TResult<bigint> { 
  return Ok(BigInt(0))
}
// ------------------------------------------------------------------
// Try
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unreachable | guarded
export function TryBigInt(value: unknown): TResult<bigint> {
  return (
    Guard.IsBigInt(value) ? FromBigInt(value) :
    Guard.IsBoolean(value) ? FromBoolean(value) :
    Guard.IsNumber(value) ? FromNumber(value) :
    Guard.IsNull(value) ? FromNull(value) :
    Guard.IsString(value) ? FromString(value) :
    Guard.IsUndefined(value) ? FromUndefined(value) :
    Fail()
  )
}
// deno-coverage-ignore-stop