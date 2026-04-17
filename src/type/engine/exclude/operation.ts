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
// ExcludeUnionLeft
// ------------------------------------------------------------------
type TExcludeUnionLeft<Types extends TSchema[], Right extends TSchema, Result extends TSchema[] = []> = (
  Types extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TExcludeUnionLeft<Tail, Right, [...Result, ...TExcludeTypeLeft<Head, Right>]>
    : Result
)
function ExcludeUnionLeft<Types extends TSchema[], Right extends TSchema>(types: [...Types], right: Right): TExcludeUnionLeft<Types, Right> {
  return types.reduce((result, head) => {
    return [...result, ...ExcludeTypeLeft(head, right)]
  }, [] as TSchema[]) as never
}
// ------------------------------------------------------------------
// ExcludeTypeLeft
// ------------------------------------------------------------------
type TExcludeTypeLeft<Left extends TSchema, Right extends TSchema,
  Check extends ExtendsResult.TResult = TExtends<{}, Left, Right>,
  Result extends TSchema[] = Check extends ExtendsResult.TExtendsTrueLike<infer _> ? [] : [Left]
> = Result
function ExcludeTypeLeft<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExcludeTypeLeft<Left, Right> {
  const check = Extends({}, left, right)
  const result = ExtendsResult.IsExtendsTrueLike(check) ? [] : [left]
  return result as never
}
// ------------------------------------------------------------------
// Operation
// ------------------------------------------------------------------
export type TExcludeOperation<Left extends TSchema, Right extends TSchema,
  Remaining extends TSchema[] = (
    Left extends TEnum<infer Values extends TEnumValue[]> ? TExcludeUnionLeft<TEnumValuesToVariants<Values>, Right> : 
    Left extends TUnion<infer Types extends TSchema[]> ? TExcludeUnionLeft<TFlatten<Types>, Right> : 
    TExcludeTypeLeft<Left, Right>
  ),
  Result extends TSchema = TEvaluateUnion<Remaining>
> = Result
export function ExcludeOperation<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExcludeOperation<Left, Right> {
  const remaining = (
    IsEnum(left) ? ExcludeUnionLeft(EnumValuesToVariants(left.enum), right) :
    IsUnion(left) ? ExcludeUnionLeft(Flatten(left.anyOf), right) :
    ExcludeTypeLeft(left, right)
  ) as TSchema[]
  const result = EvaluateUnion(remaining)
  return result as never
}