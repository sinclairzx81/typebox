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

import { IsResult } from './result.ts'
import { type TTake, Take } from './take.ts'

// ------------------------------------------------------------------
// IsDiscard
// ------------------------------------------------------------------
type TIsDiscard<Discard extends string[], Input extends string> = (
  Discard extends [infer Left extends string, ...infer Right extends string[]]
    ? Input extends Left
      ? true
      : TIsDiscard<Right, Input>
    : false
)
function IsDiscard<Discard extends string[], Input extends string>
  (discard: [...Discard], input: Input): 
    TIsDiscard<Discard, Input> {
  return discard.includes(input) as never
}
// ------------------------------------------------------------------
// Many
// ------------------------------------------------------------------
/** Takes characters from the Input until no-match. The Discard set is used to omit characters from the match */
export type TMany<Allowed extends string[], Discard extends string[], Input extends string, Result extends string = ''> = (
  TTake<Allowed, Input> extends [infer Char extends string, infer Rest extends string]
    ? TIsDiscard<Discard, Char> extends true
      ? TMany<Allowed, Discard, Rest, Result>
      : TMany<Allowed, Discard, Rest, `${Result}${Char}`>
    : [Result, Input]
)
/** Takes characters from the Input until no-match. The Discard set is used to omit characters from the match */
export function Many<Allowed extends string[], Discard extends string[], Input extends string>
  (allowed: [...Allowed], discard: [...Discard], input: Input, result: string = ''): 
    TMany<Allowed, Discard, Input> {
  const takeResult = Take(allowed, input) as [string, string]
  return (
    IsResult(takeResult)
      ? IsDiscard(discard, takeResult[0])
        ? Many(allowed, discard, takeResult[1], result)
        : Many(allowed, discard, takeResult[1], `${result}${takeResult[0]}`)
      : [result, input]
  ) as never
}
// deno-coverage-ignore-stop