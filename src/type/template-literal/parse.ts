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

import { TypeBoxError } from '../error/index'

// ------------------------------------------------------------------
// TemplateLiteralParserError
// ------------------------------------------------------------------
export class TemplateLiteralParserError extends TypeBoxError {}
// ------------------------------------------------------------------
// TemplateLiteralParse
// ------------------------------------------------------------------
// prettier-ignore
export type Expression = ExpressionAnd | ExpressionOr | ExpressionConst
export type ExpressionConst = { type: 'const'; const: string }
export type ExpressionAnd = { type: 'and'; expr: Expression[] }
export type ExpressionOr = { type: 'or'; expr: Expression[] }
// -------------------------------------------------------------------
// Unescape
//
// Unescape for these control characters specifically. Note that this
// function is only called on non union group content, and where we
// still want to allow the user to embed control characters in that
// content. For review.
// -------------------------------------------------------------------
// prettier-ignore
function Unescape(pattern: string) {
  return pattern
    .replace(/\\\$/g, '$')
    .replace(/\\\*/g, '*')
    .replace(/\\\^/g, '^')
    .replace(/\\\|/g, '|')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
}
// -------------------------------------------------------------------
// Control Characters
// -------------------------------------------------------------------
function IsNonEscaped(pattern: string, index: number, char: string) {
  return pattern[index] === char && pattern.charCodeAt(index - 1) !== 92
}
function IsOpenParen(pattern: string, index: number) {
  return IsNonEscaped(pattern, index, '(')
}
function IsCloseParen(pattern: string, index: number) {
  return IsNonEscaped(pattern, index, ')')
}
function IsSeparator(pattern: string, index: number) {
  return IsNonEscaped(pattern, index, '|')
}
// -------------------------------------------------------------------
// Control Groups
// -------------------------------------------------------------------
function IsGroup(pattern: string) {
  if (!(IsOpenParen(pattern, 0) && IsCloseParen(pattern, pattern.length - 1))) return false
  let count = 0
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index)) count += 1
    if (IsCloseParen(pattern, index)) count -= 1
    if (count === 0 && index !== pattern.length - 1) return false
  }
  return true
}
// prettier-ignore
function InGroup(pattern: string) {
  return pattern.slice(1, pattern.length - 1)
}
// prettier-ignore
function IsPrecedenceOr(pattern: string) {
  let count = 0
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index)) count += 1
    if (IsCloseParen(pattern, index)) count -= 1
    if (IsSeparator(pattern, index) && count === 0) return true
  }
  return false
}
// prettier-ignore
function IsPrecedenceAnd(pattern: string) {
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index)) return true
  }
  return false
}
// prettier-ignore
function Or(pattern: string): Expression {
  let [count, start] = [0, 0]
  const expressions: Expression[] = []
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index)) count += 1
    if (IsCloseParen(pattern, index)) count -= 1
    if (IsSeparator(pattern, index) && count === 0) {
      const range = pattern.slice(start, index)
      if (range.length > 0) expressions.push(TemplateLiteralParse(range))
      start = index + 1
    }
  }
  const range = pattern.slice(start)
  if (range.length > 0) expressions.push(TemplateLiteralParse(range))
  if (expressions.length === 0) return { type: 'const', const: '' }
  if (expressions.length === 1) return expressions[0]
  return { type: 'or', expr: expressions }
}
// prettier-ignore
function And(pattern: string): Expression {
  function Group(value: string, index: number): [number, number] {
    if (!IsOpenParen(value, index)) throw new TemplateLiteralParserError(`TemplateLiteralParser: Index must point to open parens`)
    let count = 0
    for (let scan = index; scan < value.length; scan++) {
      if (IsOpenParen(value, scan)) count += 1
      if (IsCloseParen(value, scan)) count -= 1
      if (count === 0) return [index, scan]
    }
    throw new TemplateLiteralParserError(`TemplateLiteralParser: Unclosed group parens in expression`)
  }
  function Range(pattern: string, index: number): [number, number] {
    for (let scan = index; scan < pattern.length; scan++) {
      if (IsOpenParen(pattern, scan)) return [index, scan]
    }
    return [index, pattern.length]
  }
  const expressions: Expression[] = []
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index)) {
      const [start, end] = Group(pattern, index)
      const range = pattern.slice(start, end + 1)
      expressions.push(TemplateLiteralParse(range))
      index = end
    } else {
      const [start, end] = Range(pattern, index)
      const range = pattern.slice(start, end)
      if (range.length > 0) expressions.push(TemplateLiteralParse(range))
      index = end - 1
    }
  }
  return (
    (expressions.length === 0) ? { type: 'const', const: '' } :
    (expressions.length === 1) ? expressions[0] :
    { type: 'and', expr: expressions }
  )
}
// ------------------------------------------------------------------
// TemplateLiteralParse
// ------------------------------------------------------------------
/** Parses a pattern and returns an expression tree */
export function TemplateLiteralParse(pattern: string): Expression {
  // prettier-ignore
  return (
    IsGroup(pattern) ? TemplateLiteralParse(InGroup(pattern)) :
    IsPrecedenceOr(pattern) ? Or(pattern) :
    IsPrecedenceAnd(pattern) ? And(pattern) :
    { type: 'const', const: Unescape(pattern) }
  )
}
// ------------------------------------------------------------------
// TemplateLiteralParseExact
// ------------------------------------------------------------------
/** Parses a pattern and strips forward and trailing ^ and $ */
export function TemplateLiteralParseExact(pattern: string): Expression {
  return TemplateLiteralParse(pattern.slice(1, pattern.length - 1))
}
