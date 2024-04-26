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

import { IsTemplateLiteralExpressionFinite, TIsTemplateLiteralFinite } from './finite'
import { TemplateLiteralParseExact } from './parse'
import { TypeBoxError } from '../error/index'

import type { Assert } from '../helpers/index'
import type { TBoolean } from '../boolean/index'
import type { TTemplateLiteral, TTemplateLiteralKind } from './index'
import type { TLiteral, TLiteralValue } from '../literal/index'
import type { Expression, ExpressionAnd, ExpressionOr, ExpressionConst } from './parse'
import type { TUnion } from '../union/index'

// ------------------------------------------------------------------
// TemplateLiteralGenerateError
// ------------------------------------------------------------------
export class TemplateLiteralGenerateError extends TypeBoxError {}
// ------------------------------------------------------------------
// StringReducers
// ------------------------------------------------------------------
// StringReduceUnary<"A", ["B", "C"]> -> ["AB", "AC"]
// prettier-ignore
type TStringReduceUnary<L extends string, R extends string[], Acc extends string[] = []> = 
  R extends [infer A extends string, ...infer B extends string[]] 
    ? TStringReduceUnary<L, B, [...Acc, `${L}${A}`]>
    : Acc
// StringReduceBinary<['A', 'B'], ['C', 'D']> -> ["AC", "AD", "BC", "BD"]
// prettier-ignore
type TStringReduceBinary<L extends string[], R extends string[], Acc extends string[] = []> = 
  L extends [infer A extends string, ...infer B extends string[]]
    ? TStringReduceBinary<B, R, [...Acc, ...TStringReduceUnary<A, R>]>
    : Acc
// StringReduceMany<[['A', 'B'], ['C', 'D'], ['E']]> -> [["ACE", "ADE", "BCE", "BDE"]]
// prettier-ignore
type TStringReduceMany<T extends string[][]> = // consider optimizing
  T extends [infer L extends string[], infer R extends string[], ...infer Rest extends string[][]] 
    ? TStringReduceMany<[TStringReduceBinary<L, R>, ...Rest]> 
    : T
// Reduce<[['A', 'B'], ['C', 'D'], ['E']]> -> ["ACE", "ADE", "BCE", "BDE"]
// prettier-ignore
type TStringReduce<T extends string[][], O = TStringReduceMany<T>> = 
  0 extends keyof O
    ? Assert<O[0], string[]>
    : []
// ------------------------------------------------------------------
// FromTemplateLiteralUnionKinds
// ------------------------------------------------------------------
// prettier-ignore
type TFromTemplateLiteralUnionKinds<T extends TTemplateLiteralKind[]> = 
  T extends [infer L extends TLiteral, ...infer R extends TLiteral[]]
    ? [`${L['const']}`, ...TFromTemplateLiteralUnionKinds<R>]
    : []
// ------------------------------------------------------------------
// FromTemplateLiteralKinds
// ------------------------------------------------------------------
// prettier-ignore
type TFromTemplateLiteralKinds<T extends TTemplateLiteralKind[], Acc extends TLiteralValue[][] = []> = 
  T extends [infer L extends TTemplateLiteralKind, ...infer R extends TTemplateLiteralKind[]]
    ? (
     L extends TLiteral<infer S extends TLiteralValue> ? TFromTemplateLiteralKinds<R, [...Acc, [S]]> : 
     L extends TUnion<infer S extends TTemplateLiteralKind[]> ? TFromTemplateLiteralKinds<R, [...Acc, TFromTemplateLiteralUnionKinds<S>]> : 
     L extends TBoolean ? TFromTemplateLiteralKinds<R, [...Acc, ['true', 'false']]> : 
     Acc
  ) : Acc
// ------------------------------------------------------------------
// TemplateLiteralExpressionGenerate
// ------------------------------------------------------------------
// prettier-ignore
function* GenerateReduce(buffer: string[][]): IterableIterator<string> {
  if (buffer.length === 1) return yield* buffer[0]
  for (const left of buffer[0]) {
    for (const right of GenerateReduce(buffer.slice(1))) {
      yield `${left}${right}`
    }
  }
}
// prettier-ignore
function* GenerateAnd(expression: ExpressionAnd): IterableIterator<string> {
  return yield* GenerateReduce(expression.expr.map((expr) => [...TemplateLiteralExpressionGenerate(expr)]))
}
// prettier-ignore
function* GenerateOr(expression: ExpressionOr): IterableIterator<string> {
  for (const expr of expression.expr) yield* TemplateLiteralExpressionGenerate(expr)
}
// prettier-ignore
function* GenerateConst(expression: ExpressionConst): IterableIterator<string> {
  return yield expression.const
}
export function* TemplateLiteralExpressionGenerate(expression: Expression): IterableIterator<string> {
  return expression.type === 'and'
    ? yield* GenerateAnd(expression)
    : expression.type === 'or'
    ? yield* GenerateOr(expression)
    : expression.type === 'const'
    ? yield* GenerateConst(expression)
    : (() => {
        throw new TemplateLiteralGenerateError('Unknown expression')
      })()
}
// ------------------------------------------------------------------
// TTemplateLiteralGenerate
// ------------------------------------------------------------------
// prettier-ignore
export type TTemplateLiteralGenerate<T extends TTemplateLiteral, F = TIsTemplateLiteralFinite<T>> =
  F extends true
    ? (
    T extends TTemplateLiteral<infer S extends TTemplateLiteralKind[]>
      ? TFromTemplateLiteralKinds<S> extends infer R extends string[][]
        ? TStringReduce<R>
        : []
      : []
  ) : []
/** Generates a tuple of strings from the given TemplateLiteral. Returns an empty tuple if infinite. */
export function TemplateLiteralGenerate<T extends TTemplateLiteral>(schema: T): TTemplateLiteralGenerate<T> {
  const expression = TemplateLiteralParseExact(schema.pattern)
  // prettier-ignore
  return (
    IsTemplateLiteralExpressionFinite(expression)
     ? [...TemplateLiteralExpressionGenerate(expression)]
     : []
  ) as never
}
