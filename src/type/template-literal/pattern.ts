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

import type { TSchema } from '../schema/index'
import type { TTemplateLiteralKind } from './index'
import { PatternNumber, PatternString, PatternBoolean } from '../patterns/index'
import { Kind } from '../symbols/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import {
  TTemplateLiteral as IsTemplateLiteralType,
  TUnion as IsUnionType,
  TNumber as IsNumberType,
  TInteger as IsIntegerType,
  TBigInt as IsBigIntType,
  TString as IsStringType,
  TLiteral as IsLiteralType,
  TBoolean as IsBooleanType,
} from '../guard/type'

// ------------------------------------------------------------------
// TemplateLiteralPatternError
// ------------------------------------------------------------------
export class TemplateLiteralPatternError extends Error {}

// ------------------------------------------------------------------
// TemplateLiteralPattern
// ------------------------------------------------------------------
function Escape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
// prettier-ignore
function Visit(schema: TSchema, acc: string): string {
  return (
    IsTemplateLiteralType(schema) ? schema.pattern.slice(1, schema.pattern.length - 1) : 
    IsUnionType(schema) ? `(${schema.anyOf.map((schema) => Visit(schema, acc)).join('|')})` : 
    IsNumberType(schema) ? `${acc}${PatternNumber}` : 
    IsIntegerType(schema) ? `${acc}${PatternNumber}` : 
    IsBigIntType(schema) ? `${acc}${PatternNumber}` : 
    IsStringType(schema) ? `${acc}${PatternString}` : 
    IsLiteralType(schema) ? `${acc}${Escape(schema.const.toString())}` : 
    IsBooleanType(schema) ? `${acc}${PatternBoolean}` : 
    (() => { throw new TemplateLiteralPatternError(`Unexpected Kind '${schema[Kind]}'`) })()
  )
}
export function TemplateLiteralPattern(kinds: TTemplateLiteralKind[]): string {
  return `^${kinds.map((schema) => Visit(schema, '')).join('')}\$`
}
