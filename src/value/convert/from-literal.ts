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

import { Unreachable } from '../../system/unreachable/index.ts'
import { Guard } from '../../guard/index.ts'
import { TLiteral, TProperties, IsLiteralBigInt, IsLiteralBoolean, IsLiteralNumber, IsLiteralString } from '../../type/index.ts'
import { Try } from './try/index.ts'

// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
function FromLiteralBigInt(context: TProperties, type: TLiteral<bigint>, value: unknown): unknown {
  const result = Try.TryBigInt(value)
  return Try.IsOk(result) && Guard.IsEqual(type.const, result.value) ? result.value : value
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
function FromLiteralBoolean(context: TProperties, type: TLiteral<boolean>, value: unknown): unknown {
  const result = Try.TryBoolean(value)
  return Try.IsOk(result) && Guard.IsEqual(type.const, result.value) ? result.value : value
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
function FromLiteralNumber(context: TProperties, type: TLiteral<number>, value: unknown): unknown {
  const result = Try.TryNumber(value)
  return Try.IsOk(result) && Guard.IsEqual(type.const, result.value) ? result.value : value
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
function FromLiteralString(context: TProperties, type: TLiteral<string>, value: unknown): unknown {
  const result = Try.TryString(value)
  return Try.IsOk(result) && Guard.IsEqual(type.const, result.value) ? result.value : value
}
// deno-coverage-ignore-start - unreachable | guarded
export function FromLiteral(context: TProperties, type: TLiteral, value: unknown): unknown {
  if(Guard.IsEqual(type.const, value)) return value
  return (
    IsLiteralBigInt(type) ? FromLiteralBigInt(context, type, value) :
    IsLiteralBoolean(type) ? FromLiteralBoolean(context, type, value) :
    IsLiteralNumber(type) ? FromLiteralNumber(context, type, value) :
    IsLiteralString(type) ? FromLiteralString(context, type, value) :
    Unreachable()
  )
}
// deno-coverage-ignore-stop