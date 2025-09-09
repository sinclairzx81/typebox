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
import { type TLiteral, IsLiteralNumber, IsLiteralString } from '../../types/literal.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../../types/enum.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template-literal.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

import { type TEnumValuesToVariants, EnumValuesToVariants } from '../enum/index.ts'
import { type TTemplateLiteralDecode, TemplateLiteralDecode } from '../template-literal/decode.ts'

// ------------------------------------------------------------------
// FromTemplateLiteral
// ------------------------------------------------------------------
type TFromTemplateLiteral<Pattern extends string,
  Decoded extends TSchema = TTemplateLiteralDecode<Pattern>,
  Result extends TSchema = TFromType<Decoded>
> = Result

function FromTemplateLiteral<Pattern extends string>(pattern: Pattern): TFromTemplateLiteral<Pattern> {
  const decoded = TemplateLiteralDecode(pattern)
  const result = FromType(decoded)
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
// FromType
// ------------------------------------------------------------------
type TFromType<Type extends TSchema,
  Result extends TSchema[] = (
    Type extends TEnum<infer Values extends TEnumValue[]> ? TFromUnion<TEnumValuesToVariants<Values>> :
    Type extends TLiteral<string | number> ? [Type] :
    Type extends TTemplateLiteral<infer Pattern extends string> ? TFromTemplateLiteral<Pattern> :
    Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Types> :
    []
  )
> = Result
function FromType<Type extends TSchema>(type: Type): TFromType<Type> {
  const result = (
    IsEnum(type) ? FromUnion(EnumValuesToVariants(type.enum)) :
    IsLiteralString(type) || IsLiteralNumber(type) ? [type] :
    IsTemplateLiteral(type) ? FromTemplateLiteral(type.pattern) :
    IsUnion(type) ? FromUnion(type.anyOf) :
    []
  )
  return result as never
}
// ------------------------------------------------------------------
// MappedKeys
// ------------------------------------------------------------------
export type TMappedKeys<Type extends TSchema, 
  Result extends TSchema[] = TFromType<Type>
> = Result

export function MappedKeys<Type extends TSchema>(type: Type): TMappedKeys<Type> {
  const result = FromType(type)
  return result
}

