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

import { TUnreachable, Unreachable } from '../../../system/unreachable/index.ts'
import { Guard } from '../../../guard/index.ts'

import { type TLiteral, type TLiteralValue, Literal, IsLiteral } from '../../types/literal.ts'
import { type TSchema, IsSchema } from '../../types/schema.ts'
import { type TString, String } from '../../types/string.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template-literal.ts'
import { type TUnion, Union, IsUnion } from '../../types/union.ts'

import { type TParsePatternIntoTypes, ParsePatternIntoTypes } from '../patterns/pattern.ts'
import { type TIsTemplateLiteralFinite, IsTemplateLiteralFinite } from './is-finite.ts'
import { TemplateLiteralCreate } from './create.ts'

// ------------------------------------------------------------------
// FromLiteral
// ------------------------------------------------------------------
type TFromLiteralPush<Variants extends string[], Value extends TLiteralValue, Result extends string[] = []> = 
  Variants extends [infer Left extends string, ...infer Right extends string[]]
    ? TFromLiteralPush<Right, Value, [...Result, `${Left}${Value}`]>
    : Result

function FromLiteralPush<Variants extends string[], Value extends TLiteralValue>(variants: [...Variants], value: Value, result: string[] = []): TFromLiteralPush<Variants, Value> {
  const [left, ...right] = variants
  return (Guard.IsString(left) ? FromLiteralPush(right, value, [...result, `${left}${value}`]): result) as never
}
type TFromLiteral<Variants extends string[], Value extends TLiteralValue> =
  Variants extends [] ? [`${Value}`] : TFromLiteralPush<Variants, Value>

function FromLiteral<Variants extends string[], Value extends TLiteralValue>(variants: [...Variants], value: Value): TFromLiteral<Variants, Value> {
  return (Guard.IsEqual(variants.length, 0) ? [`${value}`] : FromLiteralPush(variants, value)) as never
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
type TFromUnion<Variants extends string[], Types extends TSchema[], Result extends string[] = []> =
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromUnion<Variants, Right, [...Result, ...TFromType<Variants, Left>]>
    : Result
function FromUnion<Variants extends string[], Types extends TSchema[]>(variants: [...Variants], types: [...Types], result: string[] = []): TFromUnion<Variants, Types> {
  const [left, ...right] = types
  return (
    IsSchema(left) 
      ? FromUnion(variants, right, [...result, ...FromType(variants, left)])
      : result
  ) as never
}
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
type TFromType<Variants extends string[], Type extends TSchema,
  Result extends string[] = (
    Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Variants, Types> :
    Type extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral<Variants, Value> :
    TUnreachable // []
  )
> = Result

// ------------------------------------------------------------------
// deno-coverage-ignore-start - symmetric unreachable | internal
// 
// Parsed TemplateLiteral patterns only yield Literal or Union but
// we keep the fall-through to assert that no other types can reach 
// here without error.
//
// ------------------------------------------------------------------
function FromType<Variants extends string[], Type extends TSchema>(variants: [...Variants], type: Type): TFromType<Variants, Type> {
  const result = (
    IsUnion(type) ? FromUnion(variants, type.anyOf) :
    IsLiteral(type) ? FromLiteral(variants, type.const) :
    Unreachable() // []
  )
  return result as never
}
// deno-coverage-ignore-stop

// ------------------------------------------------------------------
// FromSpan
// ------------------------------------------------------------------
type TDecodeFromSpan<Variants extends string[], Types extends TSchema[]> = 
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TDecodeFromSpan<TFromType<Variants, Left>, Right>
    : Variants
function DecodeFromSpan<Variants extends string[], Types extends TSchema[]>(variants: [...Variants], types: [...Types]): TDecodeFromSpan<Variants, Types> {
  const [left, ...right] = types
  return (
    IsSchema(left) ? DecodeFromSpan(FromType(variants, left) as string[], right) : variants
  ) as never
}
// ------------------------------------------------------------------
// VariantsToLiterals
// ------------------------------------------------------------------
type TVariantsToLiterals<Variants extends string[], Result extends TSchema[] = []> = 
  Variants extends [infer Left extends string, ...infer Right extends string[]]
    ? TVariantsToLiterals<Right, [...Result, TLiteral<Left>]>
    : Result
function VariantsToLiterals<Variants extends string[]>(variants: [...Variants]): TVariantsToLiterals<Variants> {
  return variants.map(variant => Literal(variant)) as never
}
// ------------------------------------------------------------------
// DecodeTypesAsUnion
// ------------------------------------------------------------------
type TDecodeTypesAsUnion<Types extends TSchema[],
  Variants extends string[] = TDecodeFromSpan<[], Types>,
  Literals extends TSchema[] = TVariantsToLiterals<Variants>,
  Result extends TSchema = TUnion<Literals>
> = Result

function DecodeTypesAsUnion<Types extends TSchema[]>(types: [...Types]): TDecodeTypesAsUnion<Types> {
  const variants = DecodeFromSpan([], types)
  const literals = VariantsToLiterals(variants)
  const result = Union(literals)
  return result as never
}
// ------------------------------------------------------------------
// DecodeTypes
// ------------------------------------------------------------------
type TDecodeTypes<Types extends TSchema[],
  Result extends TSchema = (
    Types extends [] ? TUnreachable : // TLiteral<''> :
    Types extends [infer Type extends TLiteral] ? Type :
    TDecodeTypesAsUnion<Types>
  )
> = Result

// ------------------------------------------------------------------
// deno-coverage-ignore-start - internal
// 
// Cannot invoke the 0-length condition as the TemplateLiteral 
// parsers always return at least 1 TLiteral or TUnion. We would 
// return a empty string TLiteral for this case, but will use 
// Unreachable to catch parse inputs that trigger 0-length.
//
// ------------------------------------------------------------------
function DecodeTypes<Types extends TSchema[]>(types: [...Types]): TDecodeTypes<Types> {
  return (
    Guard.IsEqual(types.length, 0) ? Unreachable() : // Literal('') :
    Guard.IsEqual(types.length, 1) && IsLiteral(types[0]) ? types[0] :
    DecodeTypesAsUnion(types)
  ) as never
} 
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// TemplateLiteralDecodeUnsafe
// ------------------------------------------------------------------
/** Decodes a TemplateLiteral into a Type. */
export type TTemplateLiteralDecodeUnsafe<Pattern extends string,
  Types extends TSchema[] = TParsePatternIntoTypes<Pattern>,
  Result extends TSchema = (
    Types extends []                            // Failed to Parse | IsTemplateLiteralPattern
      ? TString
      : TIsTemplateLiteralFinite<Types> extends true
        ? TDecodeTypes<Types>
        : TTemplateLiteral<Pattern>
  )
> = Result
/**
 * (Internal) Decodes a TemplateLiteral pattern into a Type. This function is unsafe. Decoding a non-finite 
 * TemplateLiteral pattern may produce another TemplateLiteral pattern. During enumeration, this 
 * TemplateLiteral -> TemplateLiteral behavior can cause a StackOverflow. A better in-flight template-literal 
 * decoding algorithm is needed. (for review)
 */
export function TemplateLiteralDecodeUnsafe<Pattern extends string>(pattern: Pattern): TTemplateLiteralDecodeUnsafe<Pattern> {
  const types = ParsePatternIntoTypes(pattern)
  const result = Guard.IsEqual(types.length, 0) // Failed to Parse | IsTemplateLiteralPattern
    ? String()                                  // ... Pattern cannot be typed, so discard
    : IsTemplateLiteralFinite(types)              
      ? DecodeTypes(types)
      : TemplateLiteralCreate(pattern)
  return result as never
}
// ------------------------------------------------------------------
// TemplateLiteralDecode
// ------------------------------------------------------------------
/** Decodes a TemplateLiteral pattern but returns TString if the pattern in non-finite. */
export type TTemplateLiteralDecode<Pattern extends string,
  Decoded extends TSchema = TTemplateLiteralDecodeUnsafe<Pattern>,
  Result extends TSchema = Decoded extends TTemplateLiteral ? TString : Decoded
> = Result
/** Decodes a TemplateLiteral pattern but returns TString if the pattern in non-finite. */
export function TemplateLiteralDecode<Pattern extends string>(pattern: Pattern): TTemplateLiteralDecode<Pattern> {
  const decoded = TemplateLiteralDecodeUnsafe(pattern)
  const result = IsTemplateLiteral(decoded) ? String() : decoded
  return result as never
}