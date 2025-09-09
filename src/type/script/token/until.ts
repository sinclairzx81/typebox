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

import { IsEqual, IsString } from './internal/guard.ts'

// ------------------------------------------------------------------
// IsEnd
// ------------------------------------------------------------------
type TIsEnd<End extends string[], Input extends string> = (
  End extends [infer Left extends string, ...infer Right extends string[]] 
    ? Input extends `${Left}${string}` 
      ? true
      : TIsEnd<Right, Input>
    : false
)
function IsEnd<End extends string[], Input extends string>
  (end: [...End], input: Input): 
    TIsEnd<End, Input> {
  const [left, ...right] = end
  return (
    IsString(left) 
      ? input.startsWith(left) 
        ? true 
        : IsEnd(right, input) 
      : false
  ) as never
}
// ------------------------------------------------------------------
// Until
// ------------------------------------------------------------------
/** Match Input until but not including End. No match if End not found. */
export type TUntil<End extends string[], Input extends string, Result extends string = ''> = (
  Input extends ``
    ? [] // fail: Input is empty
    : TIsEnd<End, Input> extends true 
      ? [Result, Input]
      : Input extends `${infer Left extends string}${infer Right extends string}` 
        ? TUntil<End, Right, `${Result}${Left}`>
        : []
)
/** Match Input until but not including End. No match if End not found. */
export function Until<End extends string[], Input extends string>
  (end: [...End], input: Input, result: string = ''): TUntil<End, Input> {
  return (
    IsEqual(input, '') 
      ? [] // fail: Input is empty
      : IsEnd(end, input) ? [result, input] : (() => {
        const [left, right] = [input.slice(0, 1), input.slice(1)]
        return Until(end, right, `${result}${left}`)
      })()
  ) as never
}
// deno-coverage-ignore-stop