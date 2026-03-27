/*--------------------------------------------------------------------------

ParseBox

The MIT License (MIT)

Copyright (c) 2024-2026 Haydn Paterson

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

// deno-coverage-ignore-start - parsebox tested
// deno-fmt-ignore-file

import { Match } from './internal/match.ts'
import { type TTrim, Trim } from './internal/trim.ts'
import { type TOptional, Optional } from './internal/optional.ts'
import { type THyphen, Hyphen } from './internal/char.ts'

import { type TUnsignedInteger, UnsignedInteger } from './unsigned_integer.ts'

// ------------------------------------------------------------------
// TakeSign
// ------------------------------------------------------------------
type TTakeSign<Input extends string> = (
  TOptional<THyphen, Input>
)
function TakeSign<Input extends string>(input: Input): TTakeSign<Input> {
  return Optional(Hyphen, input) as never
}
// ------------------------------------------------------------------
// TakeSignedInteger
// ------------------------------------------------------------------
type TTakeSignedInteger<Input extends string> = (
  TTakeSign<Input> extends [infer Sign extends string, infer SignRest extends string]
    ? TUnsignedInteger<SignRest> extends [infer UnsignedInteger extends string, infer UnsignedIntegerRest extends string]
      ? [`${Sign}${UnsignedInteger}`, UnsignedIntegerRest]
      : [] // fail: did not match unsigned integer
    : [] // fail: did not match Sign
)
function TakeSignedInteger<Input extends string>(input: Input): TTakeSignedInteger<Input> {
  return Match(TakeSign(input), (Sign, SignRest) => 
    Match(UnsignedInteger(SignRest), (UnsignedInteger, UnsignedIntegerRest) => 
      [`${Sign}${UnsignedInteger}`, UnsignedIntegerRest],
      () => []), // fail: did not match unsigned integer
    () => []) as never // fail: did not match Sign
}
// ------------------------------------------------------------------
// Integer
// ------------------------------------------------------------------
/** Matches if next is a signed or unsigned Integer */
export type TInteger<Input extends string> = (
  TTakeSignedInteger<TTrim<Input>>
)
/** Matches if next is a signed or unsigned Integer */
export function Integer<Input extends string>(input: Input): TInteger<Input> {
  return TakeSignedInteger(Trim(input)) as never
}
// deno-coverage-ignore-stop