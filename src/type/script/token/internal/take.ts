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

import { IsEqual, IsString } from './guard.ts'

// ------------------------------------------------------------------
// TakeString
// ------------------------------------------------------------------
type TTakeVariant<Variant extends string, Input extends string> = (
  Input extends `${Variant}${infer Rest extends string}` 
    ? [Variant, Rest]
    : []
)
function TakeVariant<Variant extends string, Input extends string>(variant: Variant, input: Input): TTakeVariant<Variant, Input> {
  return (
    IsEqual(input.indexOf(variant), 0) 
      ? [variant, input.slice(variant.length)] 
      : []
  ) as never
}
// ------------------------------------------------------------------
// Take
// ------------------------------------------------------------------
/** Takes one of the given variants or fail */
export type TTake<Variants extends string[], Input extends string> = (
  Variants extends [infer ValueLeft extends string, ...infer ValueRight extends string[]]
  ? TTakeVariant<ValueLeft, Input> extends [infer Take extends string, infer Rest extends string] 
    ? [Take, Rest]
    : TTake<ValueRight, Input>
  : []
)
/** Takes one of the given variants or fail */
export function Take<Variants extends string[], Input extends string>(variants: [...Variants], input: Input): TTake<Variants, Input> {
  const [left, ...right] = variants
  return (
    IsString(left)
      ? (() => {
        const result = TakeVariant(left, input)
        return IsEqual(result.length, 2) ? result : Take(right, input)
      })()
      : []
  ) as never
}
// deno-coverage-ignore-stop