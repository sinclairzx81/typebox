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
import { IsEqual, IsString } from './internal/guard.ts'

// ------------------------------------------------------------------
// TakeOne
// ------------------------------------------------------------------
type TTakeOne<Input extends string> = (
  Input extends `${infer Left extends string}${infer Right extends string}`
    ? [Left, Right]
    : []
)
function TakeOne<Input extends string>(input: string): TTakeOne<Input> {
  const result = IsEqual(input, '') ? [] : [input.slice(0, 1), input.slice(1)]
  return result as never
}
// ------------------------------------------------------------------
// IsInputMatchSentinal
// ------------------------------------------------------------------
type TIsInputMatchSentinal<End extends string[], Input extends string> = (
  End extends [infer Left extends string, ...infer Right extends string[]] 
    ? Input extends `${Left}${string}` 
      ? true
      : TIsInputMatchSentinal<Right, Input>
    : false
)
function IsInputMatchSentinal<End extends string[], Input extends string>(end: [...End], input: Input): TIsInputMatchSentinal<End, Input> {
  const [left, ...right] = end
  return (
    IsString(left) 
      ? input.startsWith(left) 
        ? true 
        : IsInputMatchSentinal(right, input) 
      : false
  ) as never
}

// ------------------------------------------------------------------
// Until
//
// Implementation Note: This function performs a 1-character lookahead 
// check against the Sentinel set. We must check IsInputMatchSentinal 
// against the current Input *before* consuming the next character via 
// TUntil recursion. 
//
// We cannot check the Sentinel before TakeOne because the Sentinel 
// length is variable; we only know when to stop (Match), not how 
// far to advance on a non-match. Therefore, we advance by a 
// fixed 1-character increment until a Sentinel prefix is detected.
//
// ------------------------------------------------------------------
/** Match Input until but not including End. No match if End not found. */
export type TUntil<End extends string[], Input extends string, Result extends string = ''> = (
  TTakeOne<Input> extends [infer One extends string, infer Rest extends string]
    ? TIsInputMatchSentinal<End, Input> extends true
      ? [Result, Input]                      // ok: at sentinal 
      : TUntil<End, Rest, `${Result}${One}`> // fail: advance + 1
    : []
)
/** Match Input until but not including End. No match if End not found. */
export function Until<End extends string[], Input extends string>(end: [...End], input: Input, result: string = ''): TUntil<End, Input> {
  return Match(TakeOne(input), (One, Rest) => 
    IsInputMatchSentinal(end, input)
      ? [result, input]                     // ok: at sentinal 
      : Until(end, Rest, `${result}${One}`) // fail: advance + 1
    , () => []) as never
}
// deno-coverage-ignore-stop