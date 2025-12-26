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
import { type TLiteral, Literal } from '../../types/literal.ts'
import { type TNumber, IsNumber } from '../../types/number.ts'
import { type TInteger, IsInteger } from '../../types/integer.ts'

import { type TEvaluateUnionFast, EvaluateUnionFast } from '../evaluate/evaluate.ts'
import { type TExtends, Extends, ExtendsResult } from '../../extends/index.ts'
import { type TFormatArrayIndexer, FormatArrayIndexer } from './array-indexer.ts'

// ------------------------------------------------------------------
// IndexElementsWithIndexer
// ------------------------------------------------------------------
type TIndexElementsWithIndexer<Types extends TSchema[], Indexer extends TSchema, Result extends TSchema[] = []> = (
  Types extends [...infer Left extends TSchema[], infer Right extends TSchema]
    ? TExtends<{}, TLiteral<Left['length']>, Indexer> extends ExtendsResult.TExtendsTrueLike
      ? TIndexElementsWithIndexer<Left, Indexer, [Right, ...Result]>
      : TIndexElementsWithIndexer<Left, Indexer, Result>
    : Result
)
function IndexElementsWithIndexer<Types extends TSchema[], Indexer extends TSchema>(types: [...Types], indexer: Indexer): TIndexElementsWithIndexer<Types, Indexer> {
  return types.reduceRight((result, right, index) => {
    const check = Extends({}, Literal(index), indexer)
    return ExtendsResult.IsExtendsTrueLike(check)
      ? [right, ...result]
      : result
  }, [] as TSchema[]) as never
}
// ...
type TFromTupleWithIndexer<Types extends TSchema[], Indexer extends TSchema,
  ArrayIndexer extends TSchema = TFormatArrayIndexer<Indexer>,
  Elements extends TSchema[] = TIndexElementsWithIndexer<Types, ArrayIndexer>,
  Result extends TSchema = TEvaluateUnionFast<Elements> // expensive
> = Result
function FromTupleWithIndexer<Types extends TSchema[], Indexer extends TSchema>(types: [...Types], indexer: Indexer): TFromTupleWithIndexer<Types, Indexer> {
  const formattedArrayIndexer = FormatArrayIndexer(indexer)
  const elements = IndexElementsWithIndexer(types, formattedArrayIndexer) as TSchema[]
  return EvaluateUnionFast(elements) as never 
}
// ------------------------------------------------------------------
// FromTupleNoIndexer
// ------------------------------------------------------------------
type TFromTupleWithoutIndexer<Types extends TSchema[],
  Result extends TSchema = TEvaluateUnionFast<Types> // expensive
> = Result
function FromTupleWithoutIndexer<Types extends TSchema[]>(types: [...Types]): TFromTupleWithoutIndexer<Types> {
  return EvaluateUnionFast(types) as never
}
// ------------------------------------------------------------------
// FromTuple
// ------------------------------------------------------------------
export type TFromTuple<Types extends TSchema[], Indexer extends TSchema,
  Result extends TSchema = (
    Indexer extends TNumber | TInteger
      ? TFromTupleWithoutIndexer<Types>
      : TFromTupleWithIndexer<Types, Indexer>
  )
> = Result
export function FromTuple<Types extends TSchema[], Indexer extends TSchema>(types: [...Types], indexer: Indexer): TFromTuple<Types, Indexer> {
  
  return (
    IsNumber(indexer) || IsInteger(indexer)
      ? FromTupleWithoutIndexer(types)
      : FromTupleWithIndexer(types, indexer)
  ) as never
}