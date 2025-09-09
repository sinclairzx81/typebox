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
import { type TUntil, Until } from './until.ts'

// ------------------------------------------------------------------
// Until_1
// ------------------------------------------------------------------
/** Match Input until but not including End. No match if End not found or match is zero-length. */
export type TUntil_1<End extends string[], Input extends string> = (
  TUntil<End, Input> extends [infer Until extends string, infer UntilRest extends string] 
    ? Until extends '' 
      ? [] // fail: match has no characters
      : [Until, UntilRest]
    : [] // fail: did not match Until
)
/** Match Input until but not including End. No match if End not found or match is zero-length. */
export function Until_1<End extends string[], Input extends string>
  (end: [...End], input: Input): 
    TUntil_1<End, Input> {
  const until = Until(end, input)
  return (
    IsResult(until) 
      ? IsEqual(until[0], '') 
        ? [] // fail: match has no characters
        : until 
      : [] // fail: did not match Until
  ) as never
}
// deno-coverage-ignore-stop