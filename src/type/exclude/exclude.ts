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
import type { UnionToTuple, AssertRest, AssertType, Assert } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import { TemplateLiteralToUnion, type TTemplateLiteral } from '../template-literal/index'
import { Union, type TUnion } from '../union/index'
import { Never, type TNever } from '../never/index'
import { type TLiteral } from '../literal/index'
import { type Static } from '../static/index'
import { type TUnionEvaluated } from '../union/index'
import { ExtendsCheck, ExtendsResult } from '../extends/index'
import { CloneType } from '../clone/type'
import { ExcludeFromMappedResult, type TExcludeFromMappedResult } from './exclude-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedResult, IsTemplateLiteral, IsUnion } from '../guard/type'
// ------------------------------------------------------------------
// ExcludeTemplateLiteral
// ------------------------------------------------------------------
// prettier-ignore
type TExcludeTemplateLiteralResult<T extends string> = TUnionEvaluated<AssertRest<UnionToTuple<{ [K in T]: TLiteral<K> }[T]>>>
// prettier-ignore
type TExcludeTemplateLiteral<L extends TTemplateLiteral, R extends TSchema> = (
  Exclude<Static<L>, Static<R>> extends infer S ? TExcludeTemplateLiteralResult<Assert<S, string>> : never
)
// ------------------------------------------------------------------
// ExcludeRest
// ------------------------------------------------------------------
// prettier-ignore
type TExcludeRest<L extends TSchema[], R extends TSchema> = AssertRest<UnionToTuple<{
  [K in keyof L]: Static<AssertType<L[K]>> extends Static<R> ? never : L[K]
}[number]>> extends infer R extends TSchema[] ? TUnionEvaluated<R> : never

function ExcludeRest<L extends TSchema[], R extends TSchema>(L: [...L], R: R) {
  const excluded = L.filter((inner) => ExtendsCheck(inner, R) === ExtendsResult.False)
  return excluded.length === 1 ? excluded[0] : Union(excluded)
}
// ------------------------------------------------------------------
// TExclude
// ------------------------------------------------------------------
// prettier-ignore
export type TExclude<L extends TSchema, R extends TSchema> = (
  L extends TMappedResult<L> ? TExcludeFromMappedResult<L, R> :
  L extends TTemplateLiteral ? TExcludeTemplateLiteral<L, R> :
  L extends TUnion<infer S> ? TExcludeRest<S, R> :
  L extends R ? TNever : L
)
/** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
export function Exclude<L extends TSchema, R extends TSchema>(L: L, R: R, options: SchemaOptions = {}): TExclude<L, R> {
  // prettier-ignore
  return CloneType((
    IsMappedResult(L) ? ExcludeFromMappedResult(L, R, options) :
    IsTemplateLiteral(L) ? Exclude(TemplateLiteralToUnion(L), R) :
    IsTemplateLiteral(R) ? Exclude(L, TemplateLiteralToUnion(R)) :
    IsUnion(L) ? ExcludeRest(L.anyOf, R) :
    ExtendsCheck(L, R) !== ExtendsResult.False ? Never() : L
  ), options) as never
}
