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
import { type TTrim, Trim } from './internal/trim.ts'
import { type TTake, Take } from './internal/take.ts'

import { type TAlpha, Alpha } from './internal/char.ts'
import { type TDigit, Digit } from './internal/char.ts'
import { type TUnderScore, UnderScore } from './internal/char.ts'
import { type TDollarSign, DollarSign } from './internal/char.ts'

// ------------------------------------------------------------------
// TakeInitial
// ------------------------------------------------------------------
type TInitial = [...TAlpha, TUnderScore, TDollarSign]
const Initial = [...Alpha, UnderScore, DollarSign]

type TTakeInitial<Input extends string> = (
  TTake<TInitial, Input>
)
function TakeInitial<Input extends string>(input: Input): TTakeInitial<Input> {
  return Take(Initial, input) as never
}
// ------------------------------------------------------------------
// TakeRemaining
// ------------------------------------------------------------------
type TRemaining = [...TInitial, ...TDigit]
const Remaining = [...Initial, ...Digit]

type TTakeRemaining<Input extends string, Result extends string = ''> = (
  TTake<TRemaining, Input> extends [infer Remaining extends string, infer RemainingRest extends string]
    ? TTakeRemaining<RemainingRest, `${Result}${Remaining}`>
    : [Result, Input]
)
function TakeRemaining<Input extends string>(input: Input, result: string = ''): TTakeRemaining<Input> {
  const remaining = Take(Remaining, input) as string[]
  return (
    IsResult(remaining)
      ? TakeRemaining(remaining[1], `${result}${remaining[0]}`)
      : [result, input]
  ) as never
}
// ------------------------------------------------------------------
// TakeIdent
// ------------------------------------------------------------------
type TTakeIdent<Input extends string> = (
  TTakeInitial<Input> extends [infer Initial extends string, infer InitialRest extends string]
    ? TTakeRemaining<InitialRest> extends [infer Remaining extends string, infer RemainingRest extends string]
      ? [`${Initial}${Remaining}`, RemainingRest]
      : [] // fail: did not match Remaining
    : [] // fail: did not match Initial
)
function TakeIdent<Input extends string>(input: Input): TTakeIdent<Input> {
  const initial = TakeInitial(input) as string[]
  return (
    IsResult(initial) ? (() => {
      const remaining = TakeRemaining(initial[1])
      return IsResult(remaining)
        ? [`${initial[0]}${remaining[0]}`, remaining[1]]
        : [] // fail: did not match Remaining
    })() : [] // fail: did not match Initial
  ) as never
}
// ------------------------------------------------------------------
// Ident
// ------------------------------------------------------------------
/** Matches if next is an Ident */
export type TIdent<Input extends string> = (
  TTakeIdent<TTrim<Input>>
)
/** Matches if next is an Ident */
export function Ident<Input extends string>(input: Input): TIdent<Input> {
  return TakeIdent(Trim(input)) as never
}
// deno-coverage-ignore-stop