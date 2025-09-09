/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

// deno-fmt-ignore-file

import { type TSchema } from '../../types/schema.ts'
import { type TUnion } from '../../types/union.ts'
import { type TBigInt } from '../../types/bigint.ts'
import { type TString } from '../../types/string.ts'
import { type TNumber } from '../../types/number.ts'
import { type TInteger } from '../../types/integer.ts'
import { type TLiteral, type TLiteralValue } from '../../types/literal.ts'

import { type TParsePatternIntoTypes } from '../patterns/pattern.ts'

// ------------------------------------------------------------------
// Terminals
// ------------------------------------------------------------------
type TFromLiteral<Template extends string, Value extends TLiteralValue> = `${Template}${Value}`
type TFromBigInt<Template extends string> = `${Template}${bigint}`
type TFromString<Template extends string> = `${Template}${string}`
type TFromNumber<Template extends string> = `${Template}${number}`
type TFromInteger<Template extends string> = `${Template}${number}`
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
type TFromUnion<Template extends string, Types extends TSchema[], Result extends string = never> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromUnion<Template, Right, Result | TFromType<'', Left>>
    : `${Template}${Result}`
)
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
type TFromType<Template extends string, Type extends TSchema,
  Result extends string = (
    Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Template, Types> :
    Type extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral<Template, Value> :
    Type extends TBigInt ? TFromBigInt<Template> :
    Type extends TString ? TFromString<Template> :
    Type extends TNumber ? TFromNumber<Template> :
    Type extends TInteger ? TFromInteger<Template> :
    never
  )
> = Result
// ------------------------------------------------------------------
// FromSpan
// ------------------------------------------------------------------
type TFromSpan<Template extends string, Types extends TSchema[]> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromSpan<TFromType<Template, Left>, Right>
    : Template
)
// ------------------------------------------------------------------
// TTemplateLiteralStatic
// ------------------------------------------------------------------
export type TTemplateLiteralStatic<Pattern extends string, 
  Types extends TSchema[] = TParsePatternIntoTypes<Pattern>,
> = TFromSpan<'', Types>