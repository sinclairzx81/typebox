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
import type { UnionToTuple, AssertRest, AssertType } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import { type TTemplateLiteral } from '../template-literal/index'
import { Union, type TUnion } from '../union/index'
import { Never, type TNever } from '../never/index'
import { type Static } from '../static/index'
import { type TUnionEvaluated } from '../union/index'
import { ExtendsCheck, ExtendsResult } from '../extends/index'
import { CloneType } from '../clone/type'
import { ExcludeFromMappedResult, type TExcludeFromMappedResult } from './exclude-from-mapped-result'
import { ExcludeFromTemplateLiteral, type TExcludeFromTemplateLiteral } from './exclude-from-template-literal'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedResult, IsTemplateLiteral, IsUnion } from '../guard/kind'
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
  L extends TUnion<infer S> ? TExcludeRest<S, R> :
  L extends R ? TNever : L
)
/** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
export function Exclude<L extends TMappedResult, R extends TSchema>(unionType: L, excludedMembers: R, options?: SchemaOptions): TExcludeFromMappedResult<L, R>
/** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
export function Exclude<L extends TTemplateLiteral, R extends TSchema>(unionType: L, excludedMembers: R, options?: SchemaOptions): TExcludeFromTemplateLiteral<L, R>
/** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
export function Exclude<L extends TSchema, R extends TSchema>(unionType: L, excludedMembers: R, options?: SchemaOptions): TExclude<L, R>
/** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
export function Exclude(L: TSchema, R: TSchema, options: SchemaOptions = {}): any {
  // overloads
  if (IsTemplateLiteral(L)) return CloneType(ExcludeFromTemplateLiteral(L, R), options)
  if (IsMappedResult(L)) return CloneType(ExcludeFromMappedResult(L, R), options)
  // prettier-ignore
  return CloneType(
    IsUnion(L) ? ExcludeRest(L.anyOf, R) : 
    ExtendsCheck(L, R) !== ExtendsResult.False ? Never() : L
  , options)
}
