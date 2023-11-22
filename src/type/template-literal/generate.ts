/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import type { TTemplateLiteral, TTemplateLiteralKind } from './index'
import type { TLiteral, TLiteralValue } from '../literal/index'
import type { Expression, ExpressionAnd, ExpressionOr, ExpressionConst } from './parser'
import type { TUnion } from '../union/index'

// ------------------------------------------------------------------
// StringReducers
// ------------------------------------------------------------------
// StringReduceUnary<"A", ["B", "C"]> -> ["AB", "AC"]
// prettier-ignore
type StringReduceUnary<L extends string, R extends string[]> = 
  R extends [infer A extends string, ...infer B extends string[]] 
    ? [`${L}${A}`, ...StringReduceUnary<L, B>] 
    : []

// StringReduceBinary<['A', 'B'], ['C', 'D']> -> ["AC", "AD", "BC", "BD"]
// prettier-ignore
type StringReduceBinary<L extends string[], R extends string[]> = 
  L extends [infer A extends string, ...infer B extends string[]] 
    ? [...StringReduceUnary<A, R>, ...StringReduceBinary<B, R>] 
    : []

// StringReduceMany<[['A', 'B'], ['C', 'D'], ['E']]> -> [["ACE", "ADE", "BCE", "BDE"]]
// prettier-ignore
type StringReduceMany<T extends string[][]> = 
  T extends [infer L extends string[], infer R extends string[], ...infer Rest extends string[][]] 
    ? StringReduceMany<[StringReduceBinary<L, R>, ...Rest]> 
    : T

// Reduce<[['A', 'B'], ['C', 'D'], ['E']]> -> ["ACE", "ADE", "BCE", "BDE"]
// prettier-ignore
type StringReduce<T extends string[][], O = StringReduceMany<T>> = 
  0 extends keyof O 
    ? O[0] 
    : []
// prettier-ignore
type TemplateLiteralReduceUnion<T extends TTemplateLiteralKind[]> = 
  T extends [infer L extends TLiteral, ...infer R extends TLiteral[]]
    ? [L['const'], ...TemplateLiteralReduceUnion<R>]
    : []
// prettier-ignore
type TemplateLiteralReduce<T extends TTemplateLiteralKind[]> =
  T extends [infer L extends TTemplateLiteralKind, ...infer R extends TTemplateLiteralKind[]]
    ? L extends TLiteral<infer S extends TLiteralValue> ? [[S], ...TemplateLiteralReduce<R>] :
      L extends TUnion  <infer S extends TTemplateLiteralKind[]> 
        ? [TemplateLiteralReduceUnion<S>, ...TemplateLiteralReduce<R>] 
        : []
    : []

// ------------------------------------------------------------------
// GenerateFromExpression
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
  return yield* GenerateReduce(expression.expr.map((expr) => [...TemplateLiteralGenerate(expr)]))
}
// prettier-ignore
function* GenerateOr(expression: ExpressionOr): IterableIterator<string> {
  for (const expr of expression.expr) yield* TemplateLiteralGenerate(expr)
}
// prettier-ignore
function* GenerateConst(expression: ExpressionConst): IterableIterator<string> {
  return yield expression.const
}
// ------------------------------------------------------------------
// TemplateLiteralGenerateError
// ------------------------------------------------------------------
export class TemplateLiteralGenerateError extends Error {}
// ------------------------------------------------------------------
// TemplateLiteralGenerate
// ------------------------------------------------------------------
// prettier-ignore
export type TemplateLiteralGenerate<T> =
  T extends TTemplateLiteral<infer S extends TTemplateLiteralKind[]>
    ? TemplateLiteralReduce<S> extends infer R extends string[][]
      ? StringReduce<R>
      : []
    : []
export function* TemplateLiteralGenerate(expression: Expression): IterableIterator<string> {
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
