/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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

// deno-lint-ignore-file ban-types
// deno-fmt-ignore-file

import { type TSchema } from '../../types/schema.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TExtends, Extends, ExtendsResult } from '../../extends/index.ts'

import { type TEvaluateType, EvaluateType } from '../evaluate/evaluate.ts'
import { type TEvaluateUnion, EvaluateUnion } from '../evaluate/evaluate.ts'

// ------------------------------------------------------------------
// ExtractType
// ------------------------------------------------------------------
type TExtractType<Left extends TSchema, Right extends TSchema,
  Check extends ExtendsResult.TResult = TExtends<{}, Left, Right>,
  Result extends TSchema[] = Check extends ExtendsResult.TExtendsTrueLike ? [Left] : []
> = Result
function ExtractType<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExtractType<Left, Right> {
  const check = Extends({}, left, right)
  const result = ExtendsResult.IsExtendsTrueLike(check) ? [left] : []
  return result as never
}
// ------------------------------------------------------------------
// ExtractUnion
// ------------------------------------------------------------------
type TExtractUnion<Types extends TSchema[], Right extends TSchema, Result extends TSchema[] = []> = (
  Types extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TExtractUnion<Tail, Right, [...Result, ...TExtractType<Head, Right>]>
    : Result
)
function ExtractUnion<Types extends TSchema[], Right extends TSchema>(types: [...Types], right: Right): TExtractUnion<Types, Right> {
  return types.reduce((result, head) => {
    return [...result, ...ExtractType(head, right)]
  }, [] as TSchema[]) as never
}
// ------------------------------------------------------------------
// Operation
// ------------------------------------------------------------------
export type TExtractOperation<Left extends TSchema, Right extends TSchema,
  Evaluated extends TSchema = TEvaluateType<Left>,
  Canonical extends TSchema[] = Evaluated extends TUnion<infer Types extends TSchema[]> ? Types : [Evaluated],
  Remaining extends TSchema[] = TExtractUnion<Canonical, Right>,
  Result extends TSchema = TEvaluateUnion<Remaining>
> = Result
export function ExtractOperation<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExtractOperation<Left, Right> {
  const evaluated = EvaluateType(left)
  const canonical = IsUnion(evaluated) ? evaluated.anyOf : [evaluated]
  const remaining = ExtractUnion(canonical, right)
  const result = EvaluateUnion(remaining)
  return result as never
}