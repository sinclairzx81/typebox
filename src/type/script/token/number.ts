/*--------------------------------------------------------------------------

ParseBox

The MIT License (MIT)

Copyright (c) 2024-2025 Haydn Paterson

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
import { IsResult } from './internal/result.ts'
import { type TTrim, Trim } from './internal/trim.ts'
import { type TTake, Take } from './internal/take.ts'
import { type TMany, Many } from './internal/many.ts'
import { type TOptional, Optional } from './internal/optional.ts'

import { type TDigit, Digit, TUnderScore, UnderScore } from './internal/char.ts'
import { type TDot, Dot } from './internal/char.ts'
import { type THyphen, Hyphen } from './internal/char.ts'
import { type TInteger, Integer } from './integer.ts'

// ------------------------------------------------------------------
// AllowedDigits
// ------------------------------------------------------------------
type TAllowedDigits = [...TDigit, TUnderScore]
const AllowedDigits = [...Digit, UnderScore] as TAllowedDigits

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
// IsLeadingDot
// ------------------------------------------------------------------
type TIsLeadingDot<Input extends string> = (
  TTake<[TDot], Input> extends [string, string] ? true : false
)
function IsLeadingDot<Input extends string>(input: Input): TIsLeadingDot<Input> {
  return IsResult(Take([Dot], input)) as never
}
// ------------------------------------------------------------------
// TakeFractional
// ------------------------------------------------------------------
type TTakeFractional<Input extends string> = (
  TMany<TAllowedDigits, [TUnderScore], Input> extends [infer Digits extends string, infer Rest extends string]
    ? Digits extends ''
      ? [] // fail: no Digits
      : [Digits, Rest]
    : [] // fail: did not match Digits
)
function TakeFractional<Input extends string>(input: Input): TTakeFractional<Input> {
  const digits = Many(AllowedDigits, [UnderScore], input)
  return (
    IsResult(digits)
      ? IsEqual(digits[0], '')
        ? [] // fail: no Digits
        : [digits[0], digits[1]]
      : [] // fail: did not match Digits
  ) as never
}
// ------------------------------------------------------------------
// LeadingDot
// ------------------------------------------------------------------
type TLeadingDot<Sign extends string, Input extends string> = (
  TTake<[TDot], Input> extends [infer Dot extends string, infer Rest extends string]
    ? TTakeFractional<Rest> extends [infer Fractional extends string, infer Rest extends string]
      ? [`${Sign}0${Dot}${Fractional}`, Rest]
      : [] // fail: did not match Fractional
    : [] // fail: did not match Dot
)
function LeadingDot<Sign extends string, Input extends string>
  (sign: Sign, input: Input): 
    TLeadingDot<Sign, Input> {
  const dot = Take([Dot], input)
  return (
    IsResult(dot) ? (() => {
      const fractional = TakeFractional(dot[1])
      return IsResult(fractional)
        ? [`${sign}0${dot[0]}${fractional[0]}`, fractional[1]]   
        : [] // fail: did not match Fractional
    })() : [] // fail: did not match Dot
  ) as never
}
// ------------------------------------------------------------------
// TakeLeadingInteger
// ------------------------------------------------------------------
type TLeadingInteger<Sign extends string, Input extends string> = (
  TInteger<Input> extends [infer Integer extends string, infer IntegerRest extends string]
    ? TTake<[TDot], IntegerRest> extends [infer Dot extends string, infer DotRest extends string]
      ? TTakeFractional<DotRest> extends [infer Fractional extends string, infer FractionalRest extends string]
        ? [`${Sign}${Integer}${Dot}${Fractional}`, FractionalRest]
        : [`${Sign}${Integer}`, DotRest] // fail: did not match Fractional, use Integer
      : [`${Sign}${Integer}`, IntegerRest] // fail: did not match Dot, use Integer
    : [] // fail: did not match Integer
)
function LeadingInteger<Sign extends string, Input extends string>
  (sign: Sign, input: Input): 
    TLeadingInteger<Sign, Input> {
  const integer = Integer(input)
  return (
    IsResult(integer) ? (() => {
      const dot = Take([Dot], integer[1])
      return IsResult(dot) ? (() => {
        const fractional = TakeFractional(dot[1])
        return IsResult(fractional)
          ? [`${sign}${integer[0]}${dot[0]}${fractional[0]}`, fractional[1]]
          : [`${sign}${integer[0]}`, dot[1]] // fail: did not match Fractional, use Integer
      })() : [`${sign}${integer[0]}`, integer[1]] // fail: did not match Dot, use Integer
    })() : [] // fail: did not match Integer
  ) as never
}
// ------------------------------------------------------------------
// TakeNumber
// ------------------------------------------------------------------
type TTakeNumber<Input extends string> = (
  TTakeSign<Input> extends [infer Sign extends string, infer SignRest extends string]
    ? TIsLeadingDot<SignRest> extends true
      ? TLeadingDot<Sign, SignRest>
      : TLeadingInteger<Sign, SignRest>
    : [] // fail: did not match Sign
)
function TakeNumber<Input extends string>(input: Input): TTakeNumber<Input>{
  const sign = TakeSign(input)
  return (
    IsResult(sign)
      ? IsLeadingDot(sign[1])
        ? LeadingDot(sign[0], sign[1])
        : LeadingInteger(sign[0], sign[1])
      : [] // fail: did not match Sign
  ) as never
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
/** Matches if next is a literal Number */
export type TNumber<Input extends string> = (
  TTakeNumber<TTrim<Input>>
)
/** Matches if next is a literal Number */
export function Number<Input extends string>(input: Input): TNumber<Input> {
  return TakeNumber(Trim(input)) as never
}
// deno-coverage-ignore-stop