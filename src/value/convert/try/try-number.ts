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
// deno-lint-ignore-file

import { Guard } from '../../../guard/index.ts'
import { TResult, Ok, Fail, IsOk } from './try-result.ts'

// ------------------------------------------------------------------
// Two-Phase
// ------------------------------------------------------------------
import { TryBigInt } from './try-bigint.ts'

// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
const maxBigInt = BigInt(Number.MAX_SAFE_INTEGER)
const minBigInt = BigInt(Number.MIN_SAFE_INTEGER)
function CanBigIntDowncast(value: bigint): boolean {
  return (value <= maxBigInt && value >= minBigInt)
}
function FromBigInt(value: bigint): TResult<number> {
  return CanBigIntDowncast(value) ? Ok(Number(value)) : Fail()
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
function FromBoolean(value: boolean): TResult<number> {
  return value ? Ok(1) : Ok(0)
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unreachable | guarded
function FromNumber(value: number): TResult<number> {
  return Ok(value)
}
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
function FromNull(value: null): TResult<number> {
  return Ok(0)
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
function FromString(value: string): TResult<number> {
  const coerced = +value
  if (Guard.IsNumber(coerced)) return Ok(coerced)
  
  const lowercase = value.toLowerCase()
  if(Guard.IsEqual(lowercase, 'false')) return Ok(0)
  if(Guard.IsEqual(lowercase, 'true')) return Ok(1)

  const result = TryBigInt(value)
  if (IsOk(result)) return FromBigInt(result.value)
  return Fail()
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
function FromUndefined(value: undefined): TResult<number> {
  return Ok(0)
}
// ------------------------------------------------------------------
// Try
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unreachable | guarded
export function TryNumber(value: unknown): TResult<number> {
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