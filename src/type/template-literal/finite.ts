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
import type { TUnion } from '../union/index'
import type { TString } from '../string/index'
import type { TBoolean } from '../boolean/index'
import type { TNumber } from '../number/index'
import type { TInteger } from '../integer/index'
import type { TBigInt } from '../bigint/index'
import type { TLiteral } from '../literal/index'
import type { Expression } from './parser'

// ------------------------------------------------------------------
// TemplateLiteralFiniteError
// ------------------------------------------------------------------
export class TemplateLiteralFiniteError extends Error {}

// ------------------------------------------------------------------
// IsTemplateLiteralFiniteCheck
// ------------------------------------------------------------------
// prettier-ignore
function IsNumberExpression(expression: Expression): boolean {
  return (
    expression.type === 'or' &&
    expression.expr.length === 2 &&
    expression.expr[0].type === 'const' &&
    expression.expr[0].const === '0' &&
    expression.expr[1].type === 'const' &&
    expression.expr[1].const === '[1-9][0-9]*'
  )
}
// prettier-ignore
function IsBooleanExpression(expression: Expression): boolean {
  return (
    expression.type === 'or' &&
    expression.expr.length === 2 &&
    expression.expr[0].type === 'const' &&
    expression.expr[0].const === 'true' &&
    expression.expr[1].type === 'const' &&
    expression.expr[1].const === 'false'
  )
}
// prettier-ignore
function IsStringExpression(expression: Expression) {
  return expression.type === 'const' && expression.const === '.*'
}
// prettier-ignore
type IsTemplateLiteralFiniteCheck<T> =
  T extends TTemplateLiteral<infer U extends TTemplateLiteralKind[]> ? IsTemplateLiteralFiniteArray<U> :
  T extends TUnion<infer U extends TTemplateLiteralKind[]> ? IsTemplateLiteralFiniteArray<U> :
  T extends TString ? false :
  T extends TBoolean ? false :
  T extends TNumber ? false :
  T extends TInteger ? false :
  T extends TBigInt ? false :
  T extends TLiteral ? true :
  false
// prettier-ignore
type IsTemplateLiteralFiniteArray<T extends TTemplateLiteralKind[]> =
  T extends [infer L extends TTemplateLiteralKind, ...infer R extends TTemplateLiteralKind[]] 
    ? IsTemplateLiteralFiniteCheck<L> extends false 
      ? false 
      : IsTemplateLiteralFiniteArray<R> :
  true
// ------------------------------------------------------------------
// IsTemplateLiteralFinite
// ------------------------------------------------------------------
// prettier-ignore
export type IsTemplateLiteralFinite<T> = 
  T extends TTemplateLiteral<infer U> 
    ? IsTemplateLiteralFiniteArray<U> 
    : false
// prettier-ignore
export function IsTemplateLiteralFinite(expression: Expression): boolean {
  return (
    IsBooleanExpression(expression) ? true :
    IsNumberExpression(expression) || IsStringExpression(expression) ? false :
    (expression.type === 'and') ? expression.expr.every((expr) => IsTemplateLiteralFinite(expr)) :
    (expression.type === 'or') ? expression.expr.every((expr) => IsTemplateLiteralFinite(expr)) :
    (expression.type === 'const') ? true :
    (() => { throw new TemplateLiteralFiniteError(`Unknown expression type`) })()
  )
}
