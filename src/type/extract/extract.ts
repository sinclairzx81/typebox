/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import type { TSchema, SchemaOptions } from '../schema/index'
import type { AssertRest, AssertType, UnionToTuple } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import { Union, type TUnion } from '../union/index'
import { type Static } from '../static/index'
import { Never, type TNever } from '../never/index'
import { type TUnionEvaluated } from '../union/index'
import { type TTemplateLiteral } from '../template-literal/index'
import { ExtendsCheck, ExtendsResult } from '../extends/index'
import { CloneType } from '../clone/type'
import { ExtractFromMappedResult, type TExtractFromMappedResult } from './extract-from-mapped-result'
import { ExtractFromTemplateLiteral, type TExtractFromTemplateLiteral } from './extract-from-template-literal'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedResult, IsTemplateLiteral, IsUnion } from '../guard/kind'

// ------------------------------------------------------------------
// ExtractRest
// ------------------------------------------------------------------
// prettier-ignore
type TExtractRest<L extends TSchema[], R extends TSchema> = AssertRest<UnionToTuple<
  { [K in keyof L]: Static<AssertType<L[K]>> extends Static<R> ? L[K] : never
}[number]>> extends infer R extends TSchema[] ? TUnionEvaluated<R> : never

function ExtractRest<L extends TSchema[], R extends TSchema>(L: [...L], R: R) {
  const extracted = L.filter((inner) => ExtendsCheck(inner, R) !== ExtendsResult.False)
  return extracted.length === 1 ? extracted[0] : Union(extracted)
}
// ------------------------------------------------------------------
// TExtract
// ------------------------------------------------------------------
// prettier-ignore
export type TExtract<L extends TSchema, U extends TSchema> = (
  L extends TUnion<infer S> ? TExtractRest<S, U> :
  L extends U ? L : TNever
)
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract<L extends TMappedResult, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtractFromMappedResult<L, R>
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract<L extends TTemplateLiteral, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtractFromTemplateLiteral<L, R>
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract<L extends TSchema, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtract<L, R>
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract(L: TSchema, R: TSchema, options: SchemaOptions = {}): any {
  // overloads
  if (IsTemplateLiteral(L)) return CloneType(ExtractFromTemplateLiteral(L, R), options)
  if (IsMappedResult(L)) return CloneType(ExtractFromMappedResult(L, R), options)
  // prettier-ignore
  return CloneType(
    IsUnion(L) ? ExtractRest(L.anyOf, R) :
    ExtendsCheck(L, R) !== ExtendsResult.False ? L : Never()
  , options)
}
