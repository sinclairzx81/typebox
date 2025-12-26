/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

// deno-fmt-ignore-file

import { type TSchema } from '../../types/index.ts'
import { type TLiteral, Literal } from '../../types/literal.ts'
import { type TEvaluateUnionFast, EvaluateUnionFast } from '../evaluate/evaluate.ts'
export type TFromTuple<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [...infer Left extends TSchema[], infer _ extends TSchema]
    ? TFromTuple<Left, [TLiteral<Left['length']>, ...Result]>
    : TEvaluateUnionFast<Result>
)
export function FromTuple<Types extends TSchema[]>(types: [...Types]): TFromTuple<Types> {
  const result = types.map((_, index) => Literal(index))
  return EvaluateUnionFast(result) as never
}
