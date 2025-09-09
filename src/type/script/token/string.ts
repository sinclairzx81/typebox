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

import { IsResult } from './internal/result.ts'
import { type TTake, Take } from './internal/take.ts'
import { type TTrim, Trim } from './internal/trim.ts'
import { type TSpan, Span } from './span.ts'

// ------------------------------------------------------------------
// TakeInitial
// ------------------------------------------------------------------
type TTakeInitial<Quotes extends string[], Input extends string> = (
  TTake<Quotes, Input>
)
function TakeInitial<Quotes extends string[], Input extends string>(quotes: [...Quotes], input: Input): TTakeInitial<Quotes, Input> {
  return Take(quotes, input)
}
// ------------------------------------------------------------------
// TakeSpan
// ------------------------------------------------------------------
type TTakeSpan<Quote extends string, Input extends string> = (
  TSpan<Quote, Quote, false, Input>
)
function TakeSpan<Quote extends string, Input extends string>(quote: Quote, input: Input): TTakeSpan<Quote, Input> {
  return Span(quote, quote, false, input) as never
}
// ------------------------------------------------------------------
// TakeString
// ------------------------------------------------------------------
type TTakeString<Quotes extends string[], Input extends string> = (
  TTakeInitial<Quotes, Input> extends [infer Initial extends string, infer InitialRest extends string]
    ? TTakeSpan<Initial, `${Initial}${InitialRest}`>
    : [] // fail: did not match Initial
)
function TakeString<Quotes extends string[], Input extends string>(quotes: [...Quotes], input: Input): TTakeString<Quotes, Input> {
  const initial = TakeInitial(quotes, input) as [string, string]
  return (
    IsResult(initial)
      ? TakeSpan(initial[0], `${initial[0]}${initial[1]}`)
      : [] // fail: did not match Initial
  ) as never
}
/** Matches a literal String with the given quotes */
export type TString<Quotes extends string[], Input extends string> = (
  TTakeString<Quotes, TTrim<Input>>
)
/** Matches a literal String with the given quotes */
export function String<Quotes extends string[], Input extends string>(quotes: [...Quotes], input: Input): TString<Quotes, Input> {
  return TakeString(quotes, Trim(input)) as never
}
// deno-coverage-ignore-stop