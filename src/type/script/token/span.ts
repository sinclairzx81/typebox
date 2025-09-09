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
import { type TNewLine, NewLine } from './internal/char.ts'
import { type TUntil, Until } from './until.ts'

// ------------------------------------------------------------------
// MultiLine
// ------------------------------------------------------------------
type TMultiLine<Start extends string, End extends string, Input extends string> = (
  Input extends `${Start}${infer Rest extends string}`
    ? TUntil<[End], Rest> extends [infer Until extends string, infer UntilRest extends string]
      ? UntilRest extends `${End}${infer Rest extends string}`
        ? [`${Until}`, Rest]
        : [] // fail: did not match End
      : [] // fail: did not match Until
    : [] // fail: did not match Start
)
function MultiLine<Start extends string, End extends string, Input extends string>
  (start: Start, end: End, input: Input): 
    TMultiLine<Start, End, Input> {
  return (
    input.startsWith(start) ? (() => {
      const until = Until([end], input.slice(start.length))
      return IsResult(until) ? (() => {
        return until[1].startsWith(end)
          ? [`${until[0]}`, until[1].slice(end.length)]
          : [] // fail: did not match End
        })() : [] // fail: did not match Until
    })() : [] // fail: did not match Start
  ) as never
}
// ------------------------------------------------------------------
// SingleLine
// ------------------------------------------------------------------
type TSingleLine<Start extends string, End extends string, Input extends string> = (
  Input extends `${Start}${infer Rest extends string}`
    ? TUntil<[TNewLine, End], Rest> extends [infer Until extends string, infer UntilRest extends string]
      ? UntilRest extends `${End}${infer EndRest extends string}`
        ? [`${Until}`, EndRest]
        : [] // fail: did not match End
      : [] // fail: did not match Until
    : [] // fail: not match Start
)
function SingleLine<Start extends string, End extends string, Input extends string>
  (start: Start, end: End, input: Input): 
    TSingleLine<Start, End, Input> {
  return (
    input.startsWith(start) ? (() => {
      const until = Until([NewLine, end], input.slice(start.length))
      return IsResult(until) ? (() => {
        return until[1].startsWith(end) 
          ? [`${until[0]}`, until[1].slice(end.length)] 
          : []  // fail: did not match End
      })() : [] // fail: did not match Until
    })() : [] // fail: not match Start
  ) as never
}
// ------------------------------------------------------------------
// Span
// ------------------------------------------------------------------
/** Matches from Start and End capturing everything in-between. Start and End are consumed. */
export type TSpan<Start extends string, End extends string, MultiLine extends boolean, Input extends string> = (
  MultiLine extends true
    ? TMultiLine<Start, End, TTrim<Input>>
    : TSingleLine<Start, End, TTrim<Input>>
)
/** Matches from Start and End capturing everything in-between. Start and End are consumed. */
export function Span<Start extends string, End extends string, MultiLine extends boolean, Input extends string>
  (start: Start, end: End, multiLine: MultiLine, input: Input): 
    TSpan<Start, End, MultiLine, Input> {
  return (
    multiLine
      ? MultiLine(start, end, Trim(input))
      : SingleLine(start, end, Trim(input))
  ) as never
}
// deno-coverage-ignore-stop