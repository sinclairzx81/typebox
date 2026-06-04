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

// deno-fmt-ignore-file

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/index.ts'
import { type TLiteral, type TLiteralValue, Literal, IsLiteral } from '../../types/literal.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../../types/enum.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template_literal.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

import { type TEvaluateEnum, EvaluateEnum } from '../evaluate/evaluate.ts'
import { type TEvaluateTemplateLiteral, EvaluateTemplateLiteral  } from '../evaluate/evaluate.ts'

// ------------------------------------------------------------------
// FromTemplateLiteral
// ------------------------------------------------------------------
type TFromTemplateLiteral<Pattern extends string,
  Evaluated extends TSchema = TEvaluateTemplateLiteral<Pattern>,
  Result extends TSchema[] = TFromType<Evaluated>
> = Result
function FromTemplateLiteral<Pattern extends string>(pattern: Pattern): TFromTemplateLiteral<Pattern> {
  const evaluated = EvaluateTemplateLiteral(pattern)
  const result = FromType(evaluated)
  return result as never
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
type TFromUnion<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromUnion<Right, [...Result, ...TFromType<Left>]>
    : Result
)
function FromUnion<Types extends TSchema[]>(types: [...Types]): TFromUnion<Types> {
  return types.reduce((result, left) => {
    return [...result, ...FromType(left)]
  }, [] as TSchema[]) as never
}
// ------------------------------------------------------------------
// FromEnum
// ------------------------------------------------------------------
type TFromEnum<Values extends TEnumValue[],
  Evaluated extends TSchema = TEvaluateEnum<Values>,
  Result extends TSchema[] = TFromType<Evaluated>
> = Result
function FromEnum<Values extends TEnumValue[]>(values: [...Values]): TFromEnum<Values> {
  const evaluated = EvaluateEnum(values)
  const result = FromType(evaluated)
  return result as never
}
// ------------------------------------------------------------------
// FromLiteral
// ------------------------------------------------------------------
type TFromLiteral<Value extends TLiteralValue, 
  Result extends TSchema[] = Value extends number ? [TLiteral<`${Value}`>] : [TLiteral<Value>]
> = Result
function FromLiteral<Value extends TLiteralValue>(value: Value): TFromLiteral<Value> {
  const result = Guard.IsNumber(value) ? [Literal(`${value}`)] : [Literal(value)]
  return result as never
}
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
type TFromType<Type extends TSchema,
  Result extends TSchema[] = (
    Type extends TEnum<infer Values extends TEnumValue[]> ? TFromEnum<Values> :
    Type extends TLiteral<infer Value extends number> ? TFromLiteral<Value> :
    Type extends TTemplateLiteral<infer Pattern extends string> ? TFromTemplateLiteral<Pattern> :
    Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Types> :
    [Type]
  )
> = Result
function FromType<Type extends TSchema>(type: Type): TFromType<Type> {
  const result = (
    IsEnum(type) ? FromEnum(type.enum) :
    IsLiteral(type) ? FromLiteral(type.const) :
    IsTemplateLiteral(type) ? FromTemplateLiteral(type.pattern) :
    IsUnion(type) ? FromUnion(type.anyOf) :
    [type]
  )
  return result as never
}
// ------------------------------------------------------------------
// MappedVariants
// ------------------------------------------------------------------
export type TMappedVariants<Type extends TSchema, 
  Result extends TSchema[] = TFromType<Type>
> = Result
export function MappedVariants<Type extends TSchema>(type: Type): TMappedVariants<Type> {
  const result = FromType(type)
  return result as never
}