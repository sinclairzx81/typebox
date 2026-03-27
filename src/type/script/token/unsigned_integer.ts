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
import { type TTake, Take } from './internal/take.ts'
import { type TMany, Many } from './internal/many.ts'
import { type TDigit, Digit } from './internal/char.ts'
import { type TZero, Zero } from './internal/char.ts'
import { type TNonZero, NonZero } from './internal/char.ts'
import { type TUnderScore, UnderScore } from './internal/char.ts'

// ------------------------------------------------------------------
// TakeNonZero
// ------------------------------------------------------------------
type TTakeNonZero<Input extends string> = (
  TTake<TNonZero, Input>
)
function TakeNonZero<Input extends string>(input: Input): TTakeNonZero<Input> {
  return Take(NonZero, input)
}
// ------------------------------------------------------------------
// TakeDigits
// ------------------------------------------------------------------
type TAllowedDigits = [...TDigit, TUnderScore]
const AllowedDigits = [...Digit, UnderScore] as TAllowedDigits
// ...
type TTakeDigits<Input extends string> = (
  TMany<TAllowedDigits, [TUnderScore], Input>
)
function TakeDigits<Input extends string>(input: Input): TTakeDigits<Input> {
  return Many(AllowedDigits, [UnderScore], input) as never
}
// ------------------------------------------------------------------
// TakeUnsignedInteger
// ------------------------------------------------------------------
type TTakeUnsignedInteger<Input extends string> = (
  TTake<[TZero], Input> extends [infer Zero extends string, infer ZeroRest extends string]
    ? [Zero, ZeroRest]
    : TTakeNonZero<Input> extends [infer NonZero extends string, infer NonZeroRest extends string]
      ? TTakeDigits<NonZeroRest> extends [infer Digits extends string, infer DigitsRest extends string]
        ? [`${NonZero}${Digits}`, DigitsRest]
        : [] // fail: did not match Digits
      : [] // fail: did not match NonZero
)
function TakeUnsignedInteger<Input extends string>(input: Input): TTakeUnsignedInteger<Input> {
  return Match(Take([Zero], input), (Zero, ZeroRest) => 
    [Zero, ZeroRest], 
    () => Match(TakeNonZero(input), (NonZero, NonZeroRest) => 
      Match(TakeDigits(NonZeroRest), (Digits, DigitsRest) => 
        [`${NonZero}${Digits}`, DigitsRest], 
        () => []), // fail: did not match Digits
    () => [])) as never // fail: did not match NonZero
}
// ------------------------------------------------------------------
// UnsignedInteger
// ------------------------------------------------------------------
/** Matches if next is a UnsignedInteger */
export type TUnsignedInteger<Input extends string> = (
  TTakeUnsignedInteger<TTrim<Input>>
)
/** Matches if next is a UnsignedInteger */
export function UnsignedInteger<Input extends string>(input: Input): TUnsignedInteger<Input> {
  return TakeUnsignedInteger(Trim(input)) as never
}
// deno-coverage-ignore-stop