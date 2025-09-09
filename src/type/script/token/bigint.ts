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
import { type TInteger, Integer } from './integer.ts'

// ------------------------------------------------------------------
// TakeBigInt
// ------------------------------------------------------------------
type TTakeBigInt<Input extends string> = (
  TInteger<Input> extends [infer Integer extends string, infer IntegerRest extends string]
    ? TTake<['n'], IntegerRest> extends [infer N extends string, infer NRest extends string]
      ? [`${Integer}`, NRest]
      : [] // fail: did not match 'n'
    : [] // fail: did not match Integer
)
function TakeBigInt<Input extends string>(input: Input): TTakeBigInt<Input> {
  const integer = Integer(input)
  return (
    IsResult(integer) ? (() => {
      const n = Take(['n'], integer[1])
      return IsResult(n)
        ? [`${integer[0]}`, n[1]]
        : [] // fail: did not match 'n'
    })() : [] // fail: did not match Integer
  ) as never
}
// ------------------------------------------------------------------
// BigInt
// ------------------------------------------------------------------
/** Matches if next is a Integer literal with trailing 'n'. Trailing 'n' is omitted in result. */
export type TBigInt<Input extends string> = (
  TTakeBigInt<Input>
)
/** Matches if next is a Integer literal with trailing 'n'. Trailing 'n' is omitted in result. */
export function BigInt<Input extends string>(input: Input): TBigInt<Input> {
  return TakeBigInt(input) as never
}
// deno-coverage-ignore-stop