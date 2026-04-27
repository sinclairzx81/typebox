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
import { type TUnion, Union, IsUnion } from '../../types/union.ts'
import { type TIntersect, Intersect, IsIntersect  } from '../../types/intersect.ts'
import { type TLiteral, type TLiteralValue, Literal, IsLiteral } from '../../types/literal.ts'
import { type TConvertToIntegerKey, ConvertToIntegerKey } from '../helpers/keys.ts'

// ------------------------------------------------------------------
// ConvertLiteral
// ------------------------------------------------------------------
type TConvertLiteral<Value extends TLiteralValue,
  Result extends TSchema = TLiteral<TConvertToIntegerKey<Value>>
> = Result
function ConvertLiteral<Value extends TLiteralValue>(value: Value): TConvertLiteral<Value> {
  return Literal(ConvertToIntegerKey(value))
}
// ------------------------------------------------------------------
// ArrayIndexerTypes
// ------------------------------------------------------------------
type TArrayIndexerTypes<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TArrayIndexerTypes<Right, [...Result, TFormatArrayIndexer<Left>]>
    : Result
)
function ArrayIndexerTypes<Types extends TSchema[]>(types: [...Types]): TArrayIndexerTypes<Types> {
  return types.map(type => FormatArrayIndexer(type)) as never
}
// ------------------------------------------------------------------
// FormatArrayIndexer
// ------------------------------------------------------------------
/** Formats embedded integer-like strings on an Indexer to be number values inline with TS indexing | coercion behaviors. */
export type TFormatArrayIndexer<Type extends TSchema,
  Result extends TSchema = (
    Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TArrayIndexerTypes<Types>> :
    Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TArrayIndexerTypes<Types>> :
    Type extends TLiteral<infer Value extends TLiteralValue> ? TConvertLiteral<Value> :
    Type
  )
> = Result
/** Formats embedded integer-like strings on an Indexer to be number values inline with TS indexing | coercion behaviors. */
export function FormatArrayIndexer<Type extends TSchema>(type: Type): TFormatArrayIndexer<Type> {
  return (
    IsIntersect(type) ? Intersect(ArrayIndexerTypes(type.allOf)) :
    IsUnion(type) ? Union(ArrayIndexerTypes(type.anyOf)) :
    IsLiteral(type) ? ConvertLiteral(type.const) :
    type
  ) as never
}