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

import type { Static } from '../static/index'
import type { TTemplateLiteral } from './template-literal'
import type { UnionToTuple } from '../helpers/index'
import { UnionEvaluated, type TUnionEvaluated } from '../union/index'
import { Literal, type TLiteral } from '../literal/index'
import { TemplateLiteralGenerate } from './generate'

// ------------------------------------------------------------------
// TemplateLiteralToUnion
// ------------------------------------------------------------------
// prettier-ignore
export type TTemplateLiteralToUnionLiteralArray<T extends string[], Acc extends TLiteral[] = []> = (
  T extends [infer L extends string, ...infer R extends string[]]
    ? TTemplateLiteralToUnionLiteralArray<R, [...Acc, TLiteral<L>]>
    : Acc
)
// prettier-ignore
export type TTemplateLiteralToUnion<
  T extends TTemplateLiteral,
  U extends string[] = UnionToTuple<Static<T>>
> = TUnionEvaluated<TTemplateLiteralToUnionLiteralArray<U>>

/** Returns a Union from the given TemplateLiteral */
export function TemplateLiteralToUnion<T extends TTemplateLiteral>(schema: TTemplateLiteral): TTemplateLiteralToUnion<T> {
  const R = TemplateLiteralGenerate(schema) as string[]
  const L = R.map((S) => Literal(S))
  return UnionEvaluated(L)
}
