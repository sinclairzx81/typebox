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
import { type TCyclic, IsCyclic } from '../../types/cyclic.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../../types/enum.ts'
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TLiteral, type TLiteralValue, IsLiteral } from '../../types/literal.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TTemplateLiteral, IsTemplateLiteral } from '../../types/template-literal.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

import { TFromCyclic, FromCyclic } from './from-cyclic.ts'
import { TFromEnum, FromEnum } from './from-enum.ts'
import { TFromIntersect, FromIntersect } from './from-intersect.ts'
import { TFromLiteral, FromLiteral } from './from-literal.ts'
import { TFromTemplateLiteral, FromTemplateLiteral } from './from-template-literal.ts'
import { TFromUnion, FromUnion } from './from-union.ts'

export type TFromType<Indexer extends TSchema,
  Result extends string[] = (
    Indexer extends TCyclic<infer Defs extends TProperties, infer Ref extends string> ? TFromCyclic<Defs, Ref> :
    Indexer extends TEnum<infer Values extends TEnumValue[]> ? TFromEnum<Values> :
    Indexer extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect<Types> :
    Indexer extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteral<Value> :
    Indexer extends TTemplateLiteral<infer Pattern extends string> ? TFromTemplateLiteral<Pattern> :
    Indexer extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Types> :
    []
  )
> = Result
export function FromType<Indexer extends TSchema>(type: Indexer): TFromType<Indexer> {
  return (
    IsCyclic(type) ? FromCyclic(type.$defs, type.$ref) :
    IsEnum(type) ? FromEnum(type.enum) :
    IsIntersect(type) ? FromIntersect(type.allOf) :
    IsLiteral(type) ? FromLiteral(type.const) :
    IsTemplateLiteral(type) ? FromTemplateLiteral(type.pattern) :
    IsUnion(type) ? FromUnion(type.anyOf) :
    []
  ) as never
}