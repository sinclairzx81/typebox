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

import type { TTemplateLiteral } from './template-literal'
import { type TUnion, Union } from '../union/index'
import { type TLiteral, Literal } from '../literal/index'
import { type TString, String } from '../string/index'
import { type TNever } from '../never/index'
import { TemplateLiteralGenerate } from './generate'
import { TemplateLiteralParseExact } from './parser'
import { IsTemplateLiteralFinite } from './finite'

// ------------------------------------------------------------------
// TemplateLiteralToUnion
// ------------------------------------------------------------------
/** Resolves a template literal as a TUnion */
export function TemplateLiteralToUnion(template: TTemplateLiteral): TNever | TString | TUnion<TLiteral[]> {
  const expression = TemplateLiteralParseExact(template.pattern)
  if (!IsTemplateLiteralFinite(expression)) return String()
  const literals = [...TemplateLiteralGenerate(expression)].map((value) => Literal(value))
  return Union(literals)
}
