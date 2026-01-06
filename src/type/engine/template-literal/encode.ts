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

import { type TSchema, IsSchema } from '../../types/schema.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../../types/enum.ts'
import { type TLiteral, type TLiteralValue, Literal, IsLiteral } from '../../types/literal.ts'
import { type TUnion, Union, IsUnion } from '../../types/union.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template-literal.ts'
import { type TBigInt, IsBigInt, BigIntPattern } from '../../types/bigint.ts'
import { type TString, IsString, StringPattern } from '../../types/string.ts'
import { type TNumber, IsNumber, NumberPattern } from '../../types/number.ts'
import { type TInteger, IsInteger, IntegerPattern } from '../../types/integer.ts'
import { type TBoolean, IsBoolean } from '../../types/boolean.ts'
import { NeverPattern } from '../../types/never.ts'
import { TemplateLiteralCreate } from './create.ts'

import { type TEnumValuesToVariants, EnumValuesToVariants } from '../enum/enum-to-union.ts'

// ------------------------------------------------------------------
// JoinString
// ------------------------------------------------------------------
type TJoinString<Input extends string[], Result extends string = ''> = (
  Input extends [infer Left extends string, ...infer Right extends string[]]
    ? Result extends '' 
      ? TJoinString<Right, Left>
      : TJoinString<Right, `${Result}|${Left}`>
    : Result
)
function JoinString<Input extends string[]>(input: [...Input]): TJoinString<Input> {
  return input.join('|') as never
}
// ------------------------------------------------------------------
// UnwrapTemplateLiteralPattern
// ------------------------------------------------------------------
type TUnwrapTemplateLiteralPattern<Pattern extends string> = (
  Pattern extends `^${infer Pattern extends string}$` ? Pattern : never
)
function UnwrapTemplateLiteralPattern<Pattern extends string>
  (pattern: Pattern): 
    TUnwrapTemplateLiteralPattern<Pattern> {
  return pattern.slice(1, pattern.length - 1) as never
}
// ------------------------------------------------------------------
// EncodeLiteral
// ------------------------------------------------------------------
type TEncodeLiteral<Value extends TLiteralValue, Right extends TSchema[], Pattern extends string> = (
  TEncodeTypes<Right, `${Pattern}${Value}`>
)
function EncodeLiteral<Value extends TLiteralValue, Right extends TSchema[], Pattern extends string>
  (value: Value, right: [...Right], pattern: Pattern): 
    TEncodeLiteral<Value, Right, Pattern> {
  return EncodeTypes(right, `${pattern}${value}`) as never
}
// ------------------------------------------------------------------
// EncodeBigInt
// ------------------------------------------------------------------
type TEncodeBigInt<Right extends TSchema[], Pattern extends string> = (
   TEncodeTypes<Right, `${Pattern}${typeof BigIntPattern}`>
)
function EncodeBigInt<Right extends TSchema[], Pattern extends string>
  (right: [...Right], pattern: Pattern): 
    TEncodeBigInt<Right, Pattern> {
  return EncodeTypes(right, `${pattern}${BigIntPattern}`) as never
}
// ------------------------------------------------------------------
// EncodeInteger
// ------------------------------------------------------------------
type TEncodeInteger<Right extends TSchema[], Pattern extends string> = (
  TEncodeTypes<Right, `${Pattern}${typeof IntegerPattern}`>
)

function EncodeInteger<Right extends TSchema[], Pattern extends string>
  (right: [...Right], pattern: Pattern): 
    TEncodeInteger<Right, Pattern> {
  return EncodeTypes(right, `${pattern}${IntegerPattern}`) as never
}
// ------------------------------------------------------------------
// EncodeNumber
// ------------------------------------------------------------------
type TEncodeNumber<Right extends TSchema[], Pattern extends string> = (
  TEncodeTypes<Right, `${Pattern}${typeof NumberPattern}`>
)
function EncodeNumber<Right extends TSchema[], Pattern extends string>
  (right: [...Right], pattern: Pattern): 
    TEncodeNumber<Right, Pattern> {
  return EncodeTypes(right, `${pattern}${NumberPattern}`) as never
}
// ------------------------------------------------------------------
// EncodeBoolean
//
// Boolean is encoded as TUnion<[TLiteral<'false'>, TLiteral<'true'>]>
// which enables the encoder to generate finite variants. This is
// different to other primitive values which are interpretted to be
// infinitely expansive.
// ------------------------------------------------------------------
type TEncodeBoolean<Right extends TSchema[], Pattern extends string> = (
  TEncodeType<TUnion<[TLiteral<'false'>, TLiteral<'true'>]>, Right, Pattern>
)
function EncodeBoolean<Right extends TSchema[], Pattern extends string>
  (right: [...Right], pattern: Pattern): 
    TEncodeBoolean<Right, Pattern> {
  return EncodeType(Union([Literal('false'), Literal('true')]), right, pattern) as never
}
// ------------------------------------------------------------------
// EncodeString
// ------------------------------------------------------------------
type TEncodeString<Right extends TSchema[], Pattern extends string> = (
   TEncodeTypes<Right, `${Pattern}${typeof StringPattern}`>
)
function EncodeString<Right extends TSchema[], Pattern extends string>
  (right: [...Right], pattern: Pattern): 
    TEncodeString<Right, Pattern> {
  return EncodeTypes(right, `${pattern}${StringPattern}`) as never
}
// ------------------------------------------------------------------
// FromTemplateLiteral
// ------------------------------------------------------------------
type TEncodeTemplateLiteral<TemplatePattern extends string, Right extends TSchema[], Pattern extends string> = (
  TEncodeTypes<Right, `${Pattern}${TUnwrapTemplateLiteralPattern<TemplatePattern>}`>
)
function EncodeTemplateLiteral<TemplatePattern extends string, Right extends TSchema[], Pattern extends string>
  (templatePattern: TemplatePattern, right: [...Right], pattern: Pattern): 
    TEncodeTemplateLiteral<TemplatePattern, Right, Pattern> {
  return EncodeTypes(right, `${pattern}${UnwrapTemplateLiteralPattern(templatePattern)}`) as never
}
// ------------------------------------------------------------------
// EncodeEnum
// ------------------------------------------------------------------
type TEncodeEnum<Types extends TEnumValue[], Right extends TSchema[], Pattern extends string,
  Variants extends TSchema[] = TEnumValuesToVariants<Types>
> = TEncodeUnion<Variants, Right, Pattern>
function EncodeEnum<Types extends TEnumValue[], Right extends TSchema[], Pattern extends string>
  (types: [...Types], right: Right, pattern: Pattern, result: string[] = []): 
    TEncodeEnum<Types, Right, Pattern> {
  const variants = EnumValuesToVariants(types) as TSchema[]
  return EncodeUnion(variants, right, pattern) as never
}
// ------------------------------------------------------------------
// EncodeUnion
// ------------------------------------------------------------------
type TEncodeUnion<Types extends TSchema[], Right extends TSchema[], Pattern extends string, Result extends string[] = []> = 
  Types extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TEncodeUnion<Tail, Right, Pattern, [...Result, TEncodeType<Head, [], ''>]>
    : TEncodeTypes<Right, `${Pattern}(${TJoinString<Result>})`>
function EncodeUnion<Types extends TSchema[], Right extends TSchema[], Pattern extends string>
  (types: [...Types], right: Right, pattern: Pattern, result: string[] = []): 
    TEncodeUnion<Types, Right, Pattern> {
  const [head, ...tail] = types
  return (
    IsSchema(head)
      ? EncodeUnion(tail, right, pattern, [...result, EncodeType(head, [], '')])
      : EncodeTypes(right, `${pattern}(${JoinString(result)})`)
  ) as never
}
// ------------------------------------------------------------------
// EncodeType
// ------------------------------------------------------------------
type TEncodeType<Type extends TSchema, Right extends TSchema[], Pattern extends string> = (
  Type extends TEnum<infer Values extends TEnumValue[]> ? TEncodeEnum<Values, Right, Pattern> :
  Type extends TInteger ? TEncodeInteger<Right, Pattern> :
  Type extends TLiteral<infer Value extends TLiteralValue> ? TEncodeLiteral<Value, Right, Pattern> :
  Type extends TBigInt ? TEncodeBigInt<Right, Pattern> :
  Type extends TBoolean ? TEncodeBoolean<Right, Pattern> :
  Type extends TNumber ? TEncodeNumber<Right, Pattern> :
  Type extends TString ? TEncodeString<Right, Pattern> :
  Type extends TTemplateLiteral<infer TemplatePattern extends string> ? TEncodeTemplateLiteral<TemplatePattern, Right, Pattern> :
  Type extends TUnion<infer Types extends TSchema[]> ? TEncodeUnion<Types, Right, Pattern> :
  typeof NeverPattern
)
function EncodeType<Type extends TSchema, Right extends TSchema[], Pattern extends string>
  (type: Type, right: [...Right], pattern: Pattern): 
    TEncodeType<Type, Right, Pattern> {
  return (
    IsEnum(type) ? EncodeEnum(type.enum, right, pattern) : 
    IsInteger(type) ? EncodeInteger(right, pattern) :
    IsLiteral(type) ? EncodeLiteral(type.const, right, pattern) :
    IsBigInt(type) ? EncodeBigInt(right, pattern) :
    IsBoolean(type) ? EncodeBoolean(right, pattern) :
    IsNumber(type) ? EncodeNumber(right, pattern) :
    IsString(type) ? EncodeString(right, pattern) :
    IsTemplateLiteral(type) ? EncodeTemplateLiteral(type.pattern, right, pattern) :
    IsUnion(type) ? EncodeUnion(type.anyOf, right, pattern) :
    NeverPattern
  ) as never
}
// ------------------------------------------------------------------
// EncodeTypes
// ------------------------------------------------------------------
type TEncodeTypes<Types extends TSchema[], Pattern extends string> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TEncodeType<Left, Right, Pattern>
    : Pattern
)
function EncodeTypes<Types extends TSchema[], Pattern extends string>
  (types: [...Types], pattern: Pattern): TEncodeTypes<Types, Pattern> {
  const [left, ...right] = types
  return (
    IsSchema(left)
      ? EncodeType(left, right, pattern)
      : pattern
  ) as never
}
// ------------------------------------------------------------------
// EncodePattern
// ------------------------------------------------------------------
type TEncodePattern<Types extends TSchema[],
  Encoded extends string = TEncodeTypes<Types, ''>,
  Result extends string = `^${Encoded}$`
> = Result
function EncodePattern<Types extends TSchema[]>(types: [...Types]): TEncodePattern<Types> {
  const encoded = EncodeTypes(types, '')
  const result = `^${encoded}$`
  return result as never
}
// ------------------------------------------------------------------
// TemplateLiteralEncode
// ------------------------------------------------------------------
/** Encodes a TemplateLiteral type sequence into a TemplateLiteral */
export type TTemplateLiteralEncode<Types extends TSchema[],
  Pattern extends string = TEncodePattern<Types>,
  Result extends TSchema = TTemplateLiteral<Pattern>
> = Result
/** Encodes a TemplateLiteral type sequence into a TemplateLiteral */
export function TemplateLiteralEncode<Types extends TSchema[]>
  (types: [...Types]): 
    TTemplateLiteralEncode<Types> {
  const pattern = EncodePattern(types)
  const result = TemplateLiteralCreate(pattern)
  return result as never
}