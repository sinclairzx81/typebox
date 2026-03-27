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

import { IsEqual } from './internal/guard.ts'
import { IsMatch, Match } from './internal/match.ts'
import { type TTrim, Trim } from './internal/trim.ts'
import { type TTake, Take } from './internal/take.ts'
import { type TMany, Many } from './internal/many.ts'
import { type TDigit, type TUnderScore, Digit, UnderScore } from './internal/char.ts'
import { type TDot, Dot } from './internal/char.ts'

import { type TUnsignedInteger, UnsignedInteger } from './unsigned_integer.ts'

// ------------------------------------------------------------------
// AllowedDigits
// ------------------------------------------------------------------
type TAllowedDigits = [...TDigit, TUnderScore]
const AllowedDigits = [...Digit, UnderScore] as TAllowedDigits

// ------------------------------------------------------------------
// IsLeadingDot
// ------------------------------------------------------------------
type TIsLeadingDot<Input extends string> = (
  TTake<[TDot], Input> extends [string, string] ? true : false
)
function IsLeadingDot<Input extends string>(input: Input): TIsLeadingDot<Input> {
  return IsMatch(Take([Dot], input)) as never
}
// ------------------------------------------------------------------
// TakeFractional
// ------------------------------------------------------------------
type TTakeFractional<Input extends string> = (
  TMany<TAllowedDigits, [TUnderScore], Input> extends [infer Digits extends string, infer DigitsRest extends string]
    ? Digits extends ''
      ? [] // fail: no Digits
      : [Digits, DigitsRest]
    : [] // fail: did not match Digits
)
function TakeFractional<Input extends string>(input: Input): TTakeFractional<Input> {
  return Match(Many(AllowedDigits, [UnderScore], input), (Digits, DigitsRest) => 
    IsEqual(Digits, '')
      ? [] // fail: no Digits
      : [Digits, DigitsRest]
    , () => []) as never // fail: did not match Digits
}
// ------------------------------------------------------------------
// LeadingDot
// ------------------------------------------------------------------
type TLeadingDot<Input extends string> = (
  TTake<[TDot], Input> extends [infer Dot extends string, infer DotRest extends string]
    ? TTakeFractional<DotRest> extends [infer Fractional extends string, infer FractionalRest extends string]
      ? [`0${Dot}${Fractional}`, FractionalRest]
      : [] // fail: did not match Fractional
    : [] // fail: did not match Dot
)
function LeadingDot<Input extends string>(input: Input): TLeadingDot<Input> {
  return Match(Take([Dot], input), (Dot, DotRest) => 
    Match(TakeFractional(DotRest), (Fractional, FractionalRest) => 
      [`0${Dot}${Fractional}`, FractionalRest], 
      () => []), // fail: did not match Fractional
    () => []) as never // fail: did not match Dot
}
// ------------------------------------------------------------------
// TakeLeadingInteger
// ------------------------------------------------------------------
type TLeadingInteger<Input extends string> = (
  TUnsignedInteger<Input> extends [infer Integer extends string, infer IntegerRest extends string]
    ? TTake<[TDot], IntegerRest> extends [infer Dot extends string, infer DotRest extends string]
      ? TTakeFractional<DotRest> extends [infer Fractional extends string, infer FractionalRest extends string]
        ? [`${Integer}${Dot}${Fractional}`, FractionalRest]
        : [`${Integer}`, DotRest] // fail: did not match Fractional, use Integer
      : [`${Integer}`, IntegerRest] // fail: did not match Dot, use Integer
    : [] // fail: did not match Integer
)
function LeadingInteger<Input extends string>(input: Input): TLeadingInteger<Input> {
  return Match(UnsignedInteger(input), (Integer, IntegerRest) => 
    Match(Take([Dot], IntegerRest), (Dot, DotRest) => 
      Match(TakeFractional(DotRest), (Fractional, FractionalRest) => 
        [`${Integer}${Dot}${Fractional}`, FractionalRest],
        () => [`${Integer}`, DotRest]), // fail: did not match Fractional, use Integer
      () => [`${Integer}`, IntegerRest]), // fail: did not match Dot, use Integer
    () => []) as never // fail: did not match Integer
}
// ------------------------------------------------------------------
// TakeUnsignedNumber
// ------------------------------------------------------------------
type TTakeUnsignedNumber<Input extends string> = (
  TIsLeadingDot<Input> extends true
    ? TLeadingDot<Input>
    : TLeadingInteger<Input>
)
function TakeUnsignedNumber<Input extends string>(input: Input): TTakeUnsignedNumber<Input> {
  return (IsLeadingDot(input) 
    ? LeadingDot(input) 
    : LeadingInteger(input)) as never
}
// ------------------------------------------------------------------
// UnsignedNumber
// ------------------------------------------------------------------
/** Matches if next is a UnsignedNumber */
export type TUnsignedNumber<Input extends string> = (
  TTakeUnsignedNumber<TTrim<Input>>
)
/** Matches if next is a UnsignedNumber */
export function UnsignedNumber<Input extends string>(input: Input): TUnsignedNumber<Input> {
  return TakeUnsignedNumber(Trim(input)) as never
}
// deno-coverage-ignore-stop