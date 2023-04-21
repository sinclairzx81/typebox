/*--------------------------------------------------------------------------

@sinclair/typebox/template-dsl

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

import { Type, TTemplateLiteral, TLiteral, TTemplateLiteralKind, TNumber, TString, TBoolean, TBigInt, Assert,  Ensure, UnionType } from '@sinclair/typebox'

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------
export type Trim<T> = T extends `${' '}${infer U}` ? Trim<U> : T extends `${infer U}${' '}` ? Trim<U> : T
// -------------------------------------------------------------------------
// TTemplateLiteralParser
// -------------------------------------------------------------------------
// prettier-ignore
export type TTemplateLiteralParserUnionLiteral<T extends string> = 
  T extends `${infer L}|${infer R}` ? [TLiteral<Trim<L>>, ...TTemplateLiteralParserUnionLiteral<R>] : 
  T extends `${infer L}` ? [TLiteral<Trim<L>>] : 
  []
export type TTemplateLiteralParserUnion<T extends string> = UnionType<TTemplateLiteralParserUnionLiteral<T>>
// prettier-ignore
export type TTemplateLiteralParserTerminal<T extends string> = 
  T extends 'boolean' ? TBoolean :  
  T extends 'bigint' ? TBigInt :  
  T extends 'number' ? TNumber :
  T extends 'string' ? TString :
  TTemplateLiteralParserUnion<T>
// prettier-ignore
export type TTemplateLiteralParserTemplate<T extends string> = 
  T extends `{${infer L}}${infer R}` ? [TTemplateLiteralParserTerminal<L>, ...TTemplateLiteralParserTemplate<R>] :
  T extends `${infer L}$${infer R}`  ? [TLiteral<L>, ...TTemplateLiteralParserTemplate<R>] :
  T extends `${infer L}`             ? [TLiteral<L>] : 
  []
export type TTemplateLiteralParser<T extends string> = Ensure<TTemplateLiteral<Assert<TTemplateLiteralParserTemplate<T>, TTemplateLiteralKind[]>>>
// ---------------------------------------------------------------------
// TemplateLiteralParser
// ---------------------------------------------------------------------
namespace TemplateLiteralParser {
  export function * ParseUnion(template: string): IterableIterator<TTemplateLiteralKind> {
    const trim = template.trim()
    if(trim === 'boolean') return yield Type.Boolean()
    if(trim === 'number') return yield Type.Number()
    if(trim === 'bigint') return yield Type.BigInt()
    if(trim === 'string') return yield Type.String()
    const literals = trim.split('|').map(literal => Type.Literal(literal.trim()))
    return yield literals.length === 0 ? Type.Never() : literals.length === 1 ? literals[0] : Type.Union(literals)
  }
  export function * ParseTerminal(template: string): IterableIterator<TTemplateLiteralKind> {
    if(template[1] !== '{') {
      const L = Type.Literal('$')
      const R = ParseLiteral(template.slice(1))
      return yield * [L, ...R]
    }
    for(let i = 2; i < template.length; i++) {
      if(template[i] === '}') {
        const L = ParseUnion(template.slice(2, i))
        const R = ParseLiteral(template.slice(i+1))
        return yield * [...L, ...R]
      }
    }
    yield Type.Literal(template)
  }
  export function * ParseLiteral(template: string): IterableIterator<TTemplateLiteralKind> {
    for(let i = 0; i < template.length; i++) {
      if(template[i] === '$') {
        const L = Type.Literal(template.slice(0, i))
        const R = ParseTerminal(template.slice(i))
        return yield * [L, ...R]
      }
    }
    yield Type.Literal(template)
  }
  export function Parse(template: string): TTemplateLiteral {
    return Type.TemplateLiteral([...ParseLiteral(template)])
  }
}
// ------------------------------------------------------------------------------------------
// TemplateLiteral DSL
// ------------------------------------------------------------------------------------------
export function TemplateLiteral<T extends string>(template: T): TTemplateLiteralParser<T> {
  return TemplateLiteralParser.Parse(template)
}