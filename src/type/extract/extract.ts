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

import type { TSchema, SchemaOptions } from '../schema/index'
import type { Assert, AssertRest, AssertType, UnionToTuple } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import { TemplateLiteralToUnion, type TTemplateLiteral } from '../template-literal/index'
import { type TLiteral } from '../literal/index'
import { Union, type TUnion } from '../union/index'
import { type Static } from '../static/index'
import { Never } from '../never/index'
import { type TUnionEvaluated } from '../union/index'
import { ExtendsCheck, ExtendsResult } from '../extends/index'
import { CloneType } from '../clone/type'
import { ExtractFromMappedResult, type TExtractFromMappedResult } from './extract-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedResult, IsTemplateLiteral, IsUnion } from '../guard/type'
// ------------------------------------------------------------------
// ExtractResolve
// ------------------------------------------------------------------
// prettier-ignore
type TFromTemplateLiteralResult<T extends string> = TUnionEvaluated<AssertRest<UnionToTuple<{ [K in T]: TLiteral<K> }[T]>>>
// prettier-ignore
type TFromTemplateLiteral<T extends TTemplateLiteral, U extends TSchema> = Extract<Static<T>, Static<U>> extends infer S ? TFromTemplateLiteralResult<Assert<S, string>> : never
// prettier-ignore
type TFromArray<T extends TSchema[], U extends TSchema> = AssertRest<UnionToTuple<
  { [K in keyof T]: Static<AssertType<T[K]>> extends Static<U> ? T[K] : never
}[number]>> extends infer R extends TSchema[] ? TUnionEvaluated<R> : never
// prettier-ignore
type TExtractResolve<T extends TSchema, U extends TSchema> = (
  T extends TTemplateLiteral ? TFromTemplateLiteral<T, U> :
  T extends TUnion<infer S> ? TFromArray<S, U> :
  T
)
// prettier-ignore
function ExtractResolve<L extends TSchema, R extends TSchema>(L: L, R: R): TExtractResolve<L, R> {
  return (
    IsTemplateLiteral(L)  ? ExtractResolve(TemplateLiteralToUnion(L), R) :
    IsTemplateLiteral(R) ? ExtractResolve(L, TemplateLiteralToUnion(R) as any) :
    IsUnion(L) ? (() => {
      const narrowed = L.anyOf.filter((inner) => ExtendsCheck(inner, R) !== ExtendsResult.False)
      return (narrowed.length === 1 ? narrowed[0] : Union(narrowed))
    })() :
      ExtendsCheck(L, R) !== ExtendsResult.False ? L :
      Never()
  ) as TExtractResolve<L, R>
}
// ------------------------------------------------------------------
// TExtract
// ------------------------------------------------------------------
// prettier-ignore
export type TExtract<T extends TSchema, U extends TSchema> = TExtractResolve<T, U>

/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract<L extends TMappedResult, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtractFromMappedResult<L, R>
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract<L extends TSchema, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtract<L, R>
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract(type: TSchema, union: TSchema, options: SchemaOptions = {}) {
  if (IsMappedResult(type)) {
    return ExtractFromMappedResult(type, union, options)
  } else {
    const E = ExtractResolve(type, union)
    return CloneType(E, options)
  }
}
