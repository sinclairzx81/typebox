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
import { type TTrimWhitespace, TrimWhitespace } from './internal/trim.ts'
import { type TTrim, Trim } from './internal/trim.ts'
import { type TTake, Take } from './internal/take.ts'

import { type TNewLine, NewLine } from './internal/char.ts'
import { type TWhiteSpace, WhiteSpace } from './internal/char.ts'

// ------------------------------------------------------------------
// TakeConst
// ------------------------------------------------------------------
type TTakeConst<Const extends string, Input extends string> = (
  TTake<[Const], Input>
)
function TakeConst<Const extends string, Input extends string>(const_: Const, input: Input): TTakeConst<Const, Input> {
  return Take([const_], input) as never
}
// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
/** Matches if next is the given Const value */
export type TConst<Const extends string, Input extends string> = (
  Const extends '' ? ['', Input] :
  Const extends `${infer First extends string}${string}` ? (
    First extends TNewLine ? TTakeConst<Const, TTrimWhitespace<Input>> :
    First extends TWhiteSpace ? TTakeConst<Const, Input> :
    TTakeConst<Const, TTrim<Input>>
  ) : never
)
/** Matches if next is the given Const value */
export function Const<Const extends string, Input extends string>(const_: Const, input: Input): TConst<Const, Input> {
  return (
    IsEqual(const_, '') ? ['', input] : (
      const_.startsWith(NewLine) ? TakeConst(const_, TrimWhitespace(input)) :
      const_.startsWith(WhiteSpace) ? TakeConst(const_, input) :
      TakeConst(const_, Trim(input))
    )
  ) as never
}
// deno-coverage-ignore-stop