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
import { type TSchema } from '../../types/schema.ts'
import { type TDependent, IsDependent } from '../../types/dependent.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../../types/enum.ts'
import { type TLiteral, Literal } from '../../types/literal.ts'
import { type TIntersect, IsIntersect, Intersect } from '../../types/intersect.ts'
import { type TNever, Never } from '../../types/never.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template_literal.ts'
import { type TUnion, Union, IsUnion } from '../../types/union.ts'

import { type TDistribute, Distribute } from './distribute.ts'
import { type TBroaden, Broaden } from './broaden.ts'
import { type TExcludeOperation, ExcludeOperation } from '../exclude/operation.ts'
import { type TTemplateLiteralDecode, TemplateLiteralDecode } from '../template_literal/decode.ts'

// ------------------------------------------------------------------
// EvaluateDependent
// ------------------------------------------------------------------
export type TEvaluateDependent<If extends TSchema, Then extends TSchema, Else extends TSchema,
  Intersect extends TSchema = TIntersect<[If, Then]>,
  Excluded extends TSchema = TExcludeOperation<Else, If>,
  Result extends TSchema = TEvaluateUnion<[Intersect, Excluded]>
> = Result
export function EvaluateDependent<If extends TSchema, Then extends TSchema, Else extends TSchema>
  (if_: If, then_: Then, else_: Else): TEvaluateDependent<If, Then, Else> {
  const intersect = Intersect([if_, then_])
  const excluded = ExcludeOperation(else_, if_)
  const result = EvaluateUnion([intersect, excluded])
  return result as never
}
// ------------------------------------------------------------------
// EvaluateEnum
// ------------------------------------------------------------------
export type TEvaluateEnum<Values extends TEnumValue[], Result extends TSchema[] = []> = (
  Values extends [infer Left extends TEnumValue, ...infer Right extends TEnumValue[]]
  ? TEvaluateEnum<Right, [...Result, TLiteral<Left>]>
  : TEvaluateUnion<Result>
)
export function EvaluateEnum<Values extends TEnumValue[]>(values: [...Values]): TEvaluateEnum<Values> {
  const result = values.map(value => Literal(value))
  return EvaluateUnion(result) as never
}
// ------------------------------------------------------------------
// EvaluateIntersect
// ------------------------------------------------------------------
export type TEvaluateIntersect<Types extends TSchema[],
  Distribution extends TSchema[] = TDistribute<Types>,
  Broadend extends TSchema[] = TBroaden<Distribution>,
  Result extends TSchema = TEvaluateUnionFast<Broadend>
> = Result
export function EvaluateIntersect<Types extends TSchema[]>(types: [...Types]): TEvaluateIntersect<Types> {
  const distribution = Distribute(types) as TSchema[]
  const broadend = Broaden(distribution) as TSchema[]
  const result = EvaluateUnionFast(broadend)
  return result as never
}
// ------------------------------------------------------------------
// EvaluateTemplateLiteral
// ------------------------------------------------------------------
export type TEvaluateTemplateLiteral<Pattern extends string,
  Evaluated extends TSchema = TTemplateLiteralDecode<Pattern>,
  Result extends TSchema = TEvaluateType<Evaluated>
> = Result
export function EvaluateTemplateLiteral<Pattern extends string>(pattern: Pattern): TEvaluateTemplateLiteral<Pattern> {
  const evaluated = TemplateLiteralDecode(pattern)
  const result = EvaluateType(evaluated)
  return result as never
}
// ------------------------------------------------------------------
// EvaluateUnion
// ------------------------------------------------------------------
export type TEvaluateUnion<Types extends TSchema[],
  Broadend extends TSchema[] = TBroaden<Types>,
  Result extends TSchema = TEvaluateUnionFast<Broadend>
> = Result
export function EvaluateUnion<Types extends TSchema[]>(types: [...Types]): TEvaluateUnion<Types> {
  const broadend = Broaden(types) as TSchema[]
  const result = EvaluateUnionFast(broadend)
  return result as never
}
// ------------------------------------------------------------------
// EvaluateType
// ------------------------------------------------------------------
export type TEvaluateType<Type extends TSchema,
  Result extends TSchema = (
    Type extends TDependent<infer If extends TSchema, infer Then extends TSchema, infer Else extends TSchema> ? TEvaluateDependent<If, Then, Else> :
    Type extends TEnum<infer Values extends TEnumValue[]> ? TEvaluateEnum<Values> :
    Type extends TIntersect<infer Types extends TSchema[]> ? TEvaluateIntersect<Types> :
    Type extends TTemplateLiteral<infer Pattern extends string> ? TEvaluateTemplateLiteral<Pattern> :
    Type extends TUnion<infer Types extends TSchema[]> ? TEvaluateUnion<Types> :
    Type
  )
> = Result
export function EvaluateType<Type extends TSchema>(type: Type): TEvaluateType<Type> {
  return (
    IsDependent(type) ? EvaluateDependent(type.if, type.then, type.else) :
    IsEnum(type) ? EvaluateEnum(type.enum) :
    IsIntersect(type) ? EvaluateIntersect(type.allOf) :
    IsTemplateLiteral(type) ? EvaluateTemplateLiteral(type.pattern) :
    IsUnion(type) ? EvaluateUnion(type.anyOf) :
    type
  ) as never
}
// ------------------------------------------------------------------
// EvaluateUnionFast
//
// Evaluates a union using a fast path. This evaluation assumes
// all constituent types are already distinct and therefore skips
// any broadening or deduplication steps. This assumption holds
// for property keys in TProperties and tuple indices of TTuple.
//
// ------------------------------------------------------------------
export type TEvaluateUnionFast<Types extends TSchema[],
  Result extends TSchema = (
    Types extends [infer Type extends TSchema] ? Type :
    Types extends [] ? TNever :
    TUnion<Types>
  )
> = Result
export function EvaluateUnionFast<Types extends TSchema[]>
  (types: [...Types]): TEvaluateUnionFast<Types> {
  const result = (
    Guard.IsEqual(types.length, 1) ? types[0] :
    Guard.IsEqual(types.length, 0) ? Never() :
    Union(types)
  )
  return result as never
}