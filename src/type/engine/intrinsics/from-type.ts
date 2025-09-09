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

import { type TUnreachable, Unreachable } from '../../../system/unreachable/index.ts'

import { type TSchema } from '../../types/schema.ts'
import { type TLiteral, type TLiteralValue, IsLiteral } from '../../types/literal.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template-literal.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

import { type TMappingType, type TMappingFunc } from './mapping.ts'
import { type TFromLiteral, FromLiteral } from './from-literal.ts'
import { type TFromTemplateLiteral, FromTemplateLiteral } from './from-template-literal.ts'
import { type TFromUnion, FromUnion } from './from-union.ts'

export type TFromType<Mapping extends TMappingType, Type extends TSchema> = (
  Type extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral<Mapping, Value> :
  Type extends TTemplateLiteral<infer Pattern extends string> ? TFromTemplateLiteral<Mapping, Pattern> :
  Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Mapping, Types> :
  Type
)
export function FromType(mapping: TMappingFunc, type: TSchema): TSchema {
  return (
    IsLiteral(type) ? FromLiteral(mapping, type.const) :
    IsTemplateLiteral(type) ? FromTemplateLiteral(mapping, type.pattern) :
    IsUnion(type) ? FromUnion(mapping, type.anyOf) :
    type
  )
}