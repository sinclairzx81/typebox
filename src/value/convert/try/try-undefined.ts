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
function FromBigInt(value: bigint): TResult<undefined> {
   return Guard.IsEqual(value, BigInt(0)) ? Ok(undefined) : Fail()
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
function FromBoolean(value: boolean): TResult<undefined> {
  return Guard.IsEqual(value, false) ? Ok(undefined) : Fail()
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
function FromNumber(value: number): TResult<undefined> { 
  return Guard.IsEqual(value, 0) ? Ok(undefined) : Fail()
}
// ------------------------------------------------------------------
// Null
// ------------------------------------------------------------------
function FromNull(value: null): TResult<undefined> { 
  return Ok(undefined)
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
function FromString(value: string): TResult<undefined> {
  const lowercase = value.toLowerCase()
  const predicate = Guard.IsEqual(lowercase, 'undefined')
    || Guard.IsEqual(lowercase, 'null')
    || Guard.IsEqual(value, '')
    || Guard.IsEqual(value, '0')
  return predicate ? Ok(undefined) : Fail()
}
// ------------------------------------------------------------------
// Undefined
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unreachable | guarded
function FromUndefined(value: undefined): TResult<undefined> { 
  return Ok(undefined)
}
// deno-coverage-ignore-stop

// ------------------------------------------------------------------
// Try
// ------------------------------------------------------------------
// deno-coverage-ignore-start - unreachable | guarded
export function TryUndefined(value: unknown): TResult<undefined> {
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