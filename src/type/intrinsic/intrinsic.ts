/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import type { TSchema, SchemaOptions } from '../schema/index'
import { TemplateLiteral, TemplateLiteralParseExact, IsTemplateLiteralExpressionFinite, TemplateLiteralExpressionGenerate, type TTemplateLiteral, type TTemplateLiteralKind } from '../template-literal/index'
import { IntrinsicFromMappedKey, type TIntrinsicFromMappedKey } from './intrinsic-from-mapped-key'
import { Literal, type TLiteral, type TLiteralValue } from '../literal/index'
import { Union, type TUnion } from '../union/index'
import { type TMappedKey } from '../mapped/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedKey, IsTemplateLiteral, IsUnion, IsLiteral } from '../guard/kind'
// ------------------------------------------------------------------
// Apply
// ------------------------------------------------------------------
function ApplyUncapitalize(value: string): string {
  const [first, rest] = [value.slice(0, 1), value.slice(1)]
  return [first.toLowerCase(), rest].join('')
}
function ApplyCapitalize(value: string): string {
  const [first, rest] = [value.slice(0, 1), value.slice(1)]
  return [first.toUpperCase(), rest].join('')
}
function ApplyUppercase(value: string): string {
  return value.toUpperCase()
}
function ApplyLowercase(value: string): string {
  return value.toLowerCase()
}
// ------------------------------------------------------------------
// IntrinsicMode
// ------------------------------------------------------------------
export type IntrinsicMode = 'Uppercase' | 'Lowercase' | 'Capitalize' | 'Uncapitalize'
// ------------------------------------------------------------------
// FromTemplateLiteral
// ------------------------------------------------------------------
// prettier-ignore
type TFromTemplateLiteral<T extends TTemplateLiteralKind[], M extends IntrinsicMode> =
  M extends IntrinsicMode ?
    T extends [infer L extends TTemplateLiteralKind, ...infer R extends TTemplateLiteralKind[]]
      ? [TIntrinsic<L, M>, ...TFromTemplateLiteral<R, M>]
      : T
    : T
function FromTemplateLiteral<T extends TTemplateLiteralKind[], M extends IntrinsicMode>(schema: TTemplateLiteral, mode: IntrinsicMode, options: SchemaOptions): TFromTemplateLiteral<T, M> {
  // note: template literals require special runtime handling as they are encoded in string patterns.
  // This diverges from the mapped type which would otherwise map on the template literal kind.
  const expression = TemplateLiteralParseExact(schema.pattern)
  const finite = IsTemplateLiteralExpressionFinite(expression)
  if (!finite) return { ...schema, pattern: FromLiteralValue(schema.pattern, mode) } as any
  const strings = [...TemplateLiteralExpressionGenerate(expression)]
  const literals = strings.map((value) => Literal(value))
  const mapped = FromRest(literals as any, mode)
  const union = Union(mapped)
  return TemplateLiteral([union], options) as never
}
// ------------------------------------------------------------------
// FromLiteralValue
// ------------------------------------------------------------------
// prettier-ignore
type TFromLiteralValue<T, M extends IntrinsicMode> = (
    T extends string ?
      M extends 'Uncapitalize' ? Uncapitalize<T> :
      M extends 'Capitalize' ? Capitalize<T> :
      M extends 'Uppercase' ? Uppercase<T> :
      M extends 'Lowercase' ? Lowercase<T> :
      string
    : T
)
// prettier-ignore
function FromLiteralValue(value: TLiteralValue, mode: IntrinsicMode) {
  return (
    typeof value === 'string' ? (
      mode === 'Uncapitalize' ? ApplyUncapitalize(value) :
      mode === 'Capitalize' ? ApplyCapitalize(value) :
      mode === 'Uppercase' ? ApplyUppercase(value) :
      mode === 'Lowercase' ? ApplyLowercase(value) :
      value
    ) : value.toString()
  )
}
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<T extends TSchema[], M extends IntrinsicMode, Acc extends TSchema[] = []> =
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TFromRest<R, M, [...Acc, TIntrinsic<L, M>]>
    : Acc
// prettier-ignore
function FromRest<T extends TSchema[], M extends IntrinsicMode>(T: [...T], M: M): TFromRest<T, M> {
  return T.map(L => Intrinsic(L, M)) as never
}
// ------------------------------------------------------------------
// TIntrinsic
// ------------------------------------------------------------------
// prettier-ignore
export type TIntrinsic<T extends TSchema, M extends IntrinsicMode> =
  // Intrinsic-Mapped-Inference
  T extends TMappedKey ? TIntrinsicFromMappedKey<T, M> :
  // Standard-Inference
  T extends TTemplateLiteral<infer S> ? TTemplateLiteral<TFromTemplateLiteral<S, M>> :
  T extends TUnion<infer S> ? TUnion<TFromRest<S, M>> :
  T extends TLiteral<infer S> ? TLiteral<TFromLiteralValue<S, M>> :
  T
/** Applies an intrinsic string manipulation to the given type. */
export function Intrinsic<T extends TMappedKey, M extends IntrinsicMode>(schema: T, mode: M, options?: SchemaOptions): TIntrinsicFromMappedKey<T, M>
/** Applies an intrinsic string manipulation to the given type. */
export function Intrinsic<T extends TSchema, M extends IntrinsicMode>(schema: T, mode: M, options?: SchemaOptions): TIntrinsic<T, M>
/** Applies an intrinsic string manipulation to the given type. */
export function Intrinsic(schema: TSchema, mode: IntrinsicMode, options: SchemaOptions = {}): any {
  // prettier-ignore
  return (
    // Intrinsic-Mapped-Inference
    IsMappedKey(schema) ? IntrinsicFromMappedKey(schema, mode, options) :
    // Standard-Inference
    IsTemplateLiteral(schema) ? FromTemplateLiteral(schema, mode, schema) :
    IsUnion(schema) ? Union(FromRest(schema.anyOf, mode), options) :
    IsLiteral(schema) ? Literal(FromLiteralValue(schema.const, mode), options) :
    schema
  )
}
