/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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
import { type TIntersect, Intersect, IsIntersect  } from '../../types/intersect.ts'
import { type TUnion, Union, IsUnion } from '../../types/union.ts'
import { type TLiteral, type TLiteralValue, Literal, IsLiteral } from '../../types/literal.ts'
import { type TNumber, Number } from '../../types/number.ts'
import { type TNever, Never  } from '../../types/never.ts'

import { type TExtends, Extends, ExtendsResult } from '../../extends/index.ts'
import { type TConvertToIntegerKey, ConvertToIntegerKey } from '../helpers/keys.ts'

// ------------------------------------------------------------------
// NormalizeLiteral
// ------------------------------------------------------------------
type TNormalizeLiteral<Value extends TLiteralValue,
  Result extends TSchema = TLiteral<TConvertToIntegerKey<Value>>
> = Result
function NormalizeLiteral<Value extends TLiteralValue>(value: Value): TNormalizeLiteral<Value> {
  return Literal(ConvertToIntegerKey(value))
}
// ------------------------------------------------------------------
// NormalizeIndexerTypes
// ------------------------------------------------------------------
type TNormalizeIndexerTypes<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TNormalizeIndexerTypes<Right, [...Result, TNormalizeIndexer<Left>]>
    : Result
)
function NormalizeIndexerTypes<Types extends TSchema[]>(types: [...Types]): TNormalizeIndexerTypes<Types> {
  return types.map(type => NormalizeIndexer(type)) as never
}
// ------------------------------------------------------------------
// NormalizeIndexer
// ------------------------------------------------------------------
export type TNormalizeIndexer<Type extends TSchema,
  Result extends TSchema = (
    Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TNormalizeIndexerTypes<Types>> :
    Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TNormalizeIndexerTypes<Types>> :
    Type extends TLiteral<infer Value extends TLiteralValue> ? TNormalizeLiteral<Value> :
    Type
  )
> = Result
export function NormalizeIndexer<Type extends TSchema>(type: Type): TNormalizeIndexer<Type> {
  return (
    IsIntersect(type) ? Intersect(NormalizeIndexerTypes(type.allOf)) :
    IsUnion(type) ? Union(NormalizeIndexerTypes(type.anyOf)) :
    IsLiteral(type) ? NormalizeLiteral(type.const) :
    type
  ) as never
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
export type TFromArray<Type extends TSchema, Indexer extends TSchema,
  NormalizedIndexer extends TSchema = TNormalizeIndexer<Indexer>,
  Check extends ExtendsResult.TResult = TExtends<{}, NormalizedIndexer, TNumber>,
  Result extends TSchema = Check extends ExtendsResult.TExtendsTrueLike ? Type : TNever
> = Result
export function FromArray<Type extends TSchema, Indexer extends TSchema>(type: Type, indexer: Indexer): TFromArray<Type, Indexer> {
  const normalizedIndexer = NormalizeIndexer(indexer)
  const check = Extends({}, normalizedIndexer, Number())
  const result = ExtendsResult.IsExtendsTrueLike(check) ? type : Never()
  return result as never
}

