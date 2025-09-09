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
import { TResult, Ok, Fail } from './try-result.ts'

// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
function FromBigInt(value: bigint): TResult<null> {
   return Guard.IsEqual(value, BigInt(0)) ? Ok(null) : Fail()
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
function FromBoolean(value: boolean): TResult<null> {
  return Guard.IsEqual(value, false) ? Ok(null) : Fail()
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
function FromNumber(value: number): TResult<null> { 
  return Guard.IsEqual(value, 0) ? Ok(null) : Fail()
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unreachable | guarded
function FromNull(value: null): TResult<null> { 
  return Ok(null)
}
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
function FromString(value: string): TResult<null> {
  const lowercase = value.toLowerCase()
  const predicate = Guard.IsEqual(lowercase, 'undefined')
    || Guard.IsEqual(lowercase, 'null')
    || Guard.IsEqual(value, '')
    || Guard.IsEqual(value, '0')
  return predicate ? Ok(null) : Fail()
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
function FromUndefined(value: undefined): TResult<null> { 
  return Ok(null)
}
// ------------------------------------------------------------------
// Try
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unreachable | guarded
export function TryNull(value: unknown): TResult<null> {
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