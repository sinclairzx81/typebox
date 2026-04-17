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
import { type TEnum, type TEnumValue, IsEnum } from '../../types/enum.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TExtends, Extends, ExtendsResult } from '../../extends/index.ts'
import { type TEnumValuesToVariants, EnumValuesToVariants } from '../enum/index.ts'
import { type TEvaluateUnion, type TFlatten, EvaluateUnion, Flatten } from '../evaluate/index.ts'

// ------------------------------------------------------------------
// ExtractUnionLeft
// ------------------------------------------------------------------
type TExtractUnionLeft<Types extends TSchema[], Right extends TSchema, Result extends TSchema[] = []> = (
  Types extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TExtractUnionLeft<Tail, Right, [...Result, ...TExtractTypeLeft<Head, Right>]>
    : Result
)
function ExtractUnionLeft<Types extends TSchema[], Right extends TSchema>(types: [...Types], right: Right): TExtractUnionLeft<Types, Right> {
  return types.reduce((result, head) => {
    return [...result, ...ExtractTypeLeft(head, right)]
  }, [] as TSchema[]) as never
}
// ------------------------------------------------------------------
// ExtractTypeLeft
// ------------------------------------------------------------------
type TExtractTypeLeft<Left extends TSchema, Right extends TSchema,
  Check extends ExtendsResult.TResult = TExtends<{}, Left, Right>,
  Result extends TSchema[] = Check extends ExtendsResult.TExtendsTrueLike<infer _> ? [Left] : []
> = Result
function ExtractTypeLeft<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExtractTypeLeft<Left, Right> {
  const check = Extends({}, left, right)
  const result = ExtendsResult.IsExtendsTrueLike(check) ? [left] : []
  return result as never
}
// ------------------------------------------------------------------
// Operation
// ------------------------------------------------------------------
export type TExtractOperation<Left extends TSchema, Right extends TSchema,
  Remaining extends TSchema[] = (
    Left extends TEnum<infer Values extends TEnumValue[]> ? TExtractUnionLeft<TEnumValuesToVariants<Values>, Right> : 
    Left extends TUnion<infer Types extends TSchema[]> ? TExtractUnionLeft<TFlatten<Types>, Right> : 
    TExtractTypeLeft<Left, Right>
  ),
  Result extends TSchema = TEvaluateUnion<Remaining>
> = Result
export function ExtractOperation<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExtractOperation<Left, Right> {
  const remaining = (
    IsEnum(left) ? ExtractUnionLeft(EnumValuesToVariants(left.enum), right) :
    IsUnion(left) ? ExtractUnionLeft(Flatten(left.anyOf), right) :
    ExtractTypeLeft(left, right)
  ) as TSchema[]
  const result = EvaluateUnion(remaining)
  return result as never
}