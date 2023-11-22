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

import type { Ensure, Assert, Trim } from '../helpers/index'
import type { TTemplateLiteralKind, TTemplateLiteral } from './index'
import { type TLiteral, Literal } from '../literal/index'
import { type TBoolean, Boolean } from '../boolean/index'
import { type TBigInt, BigInt } from '../bigint/index'
import { type TNumber, Number } from '../number/index'
import { type TString, String } from '../string/index'
import { Union, UnionEvaluated } from '../union/index'
import { Never } from '../never/index'

// ------------------------------------------------------------------
// SyntaxParsers
// ------------------------------------------------------------------
// prettier-ignore
function* FromUnion(syntax: string): IterableIterator<TTemplateLiteralKind> {
  const trim = syntax.trim().replace(/"|'/g, '')
  return (
    trim === 'boolean' ? yield Boolean() :
    trim === 'number' ? yield Number() :
    trim === 'bigint' ? yield BigInt() :
    trim === 'string' ? yield String() :
    yield (() => {
      const literals = trim.split('|').map((literal) => Literal(literal.trim()))
      return (
        literals.length === 0 ? Never() :
        literals.length === 1 ? literals[0] :
        Union(literals)
      )
    })()
  )
}
// prettier-ignore
function* FromTerminal(syntax: string): IterableIterator<TTemplateLiteralKind> {
  if (syntax[1] !== '{') {
    const L = Literal('$')
    const R = FromSyntax(syntax.slice(1))
    return yield* [L, ...R]
  }
  for (let i = 2; i < syntax.length; i++) {
    if (syntax[i] === '}') {
      const L = FromUnion(syntax.slice(2, i))
      const R = FromSyntax(syntax.slice(i + 1))
      return yield* [...L, ...R]
    }
  }
  yield Literal(syntax)
}
// prettier-ignore
function* FromSyntax(syntax: string): IterableIterator<TTemplateLiteralKind> {
  for (let i = 0; i < syntax.length; i++) {
    if (syntax[i] === '$') {
      const L = Literal(syntax.slice(0, i))
      const R = FromTerminal(syntax.slice(i))
      return yield* [L, ...R]
    }
  }
  yield Literal(syntax)
}
// prettier-ignore
type FromUnionLiteral<T extends string> =
  T extends `${infer L}|${infer R}` ? [TLiteral<Trim<L>>, ...FromUnionLiteral<R>] :
  T extends `${infer L}` ? [TLiteral<Trim<L>>] :
  []
type FromUnion<T extends string> = UnionEvaluated<FromUnionLiteral<T>>
// prettier-ignore
type FromTerminal<T extends string> =
  T extends 'boolean' ? TBoolean :
  T extends 'bigint' ? TBigInt :
  T extends 'number' ? TNumber :
  T extends 'string' ? TString :
  FromUnion<T>
// prettier-ignore
type FromString<T extends string> =
  T extends `{${infer L}}${infer R}` ? [FromTerminal<L>, ...FromString<R>] :
  T extends `${infer L}$${infer R}` ? [TLiteral<L>, ...FromString<R>] :
  T extends `${infer L}` ? [TLiteral<L>] :
  []

// ------------------------------------------------------------------
// TemplateLiteralSyntax
// ------------------------------------------------------------------
// prettier-ignore
export type TemplateLiteralSyntax<T extends string> = (
  TTemplateLiteral<Assert<FromString<T>, TTemplateLiteralKind[]>>
)

// prettier-ignore
/** Parses TemplateLiteralSyntax and returns a tuple of TemplateLiteralKinds */
export function TemplateLiteralSyntax(syntax: string): TTemplateLiteralKind[] {
  return [...FromSyntax(syntax)]
}
