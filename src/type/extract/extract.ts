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
import { type TTemplateLiteral, TemplateLiteralToUnion } from '../template-literal/index'
import { type TLiteral } from '../literal/index'
import { type TUnion, Union } from '../union/index'
import { type Static } from '../static/index'
import { Never } from '../never/index'
import { UnionEvaluated } from '../union/index'
import { ExtendsCheck, ExtendsResult } from '../extends/index'
import { CloneType } from '../clone/type'

import { ExtractFromMappedResult, type TExtractFromMappedResult } from './extract-from-mapped-result'

// prettier-ignore
import { 
  TMappedResult as IsMappedResultType,
  TTemplateLiteral as IsTemplateLiteralType, 
  TUnion as IsUnionType 
} from '../guard/type'
// ------------------------------------------------------------------
// ExtractResolve
// ------------------------------------------------------------------
// prettier-ignore
type FromTemplateLiteralResult<T extends string> = UnionEvaluated<AssertRest<UnionToTuple<{ [K in T]: TLiteral<K> }[T]>>>
// prettier-ignore
type FromTemplateLiteral<T extends TTemplateLiteral, U extends TSchema> = Extract<Static<T>, Static<U>> extends infer S ? FromTemplateLiteralResult<Assert<S, string>> : never
// prettier-ignore
type FromArray<T extends TSchema[], U extends TSchema> = AssertRest<UnionToTuple<
  { [K in keyof T]: Static<AssertType<T[K]>> extends Static<U> ? T[K] : never
}[number]>> extends infer R extends TSchema[] ? UnionEvaluated<R> : never
// prettier-ignore
export type ExtractResolve<T extends TSchema, U extends TSchema> = (
  T extends TTemplateLiteral ? FromTemplateLiteral<T, U> :
  T extends TUnion<infer S> ? FromArray<S, U> :
  T extends U 
    ? T 
    : T // ?
)
// prettier-ignore
export function ExtractResolve<L extends TSchema, R extends TSchema>(L: L, R: R): ExtractResolve<L, R> {
  return (
    IsTemplateLiteralType(L)  ? ExtractResolve(TemplateLiteralToUnion(L), R) :
    IsTemplateLiteralType(R) ? ExtractResolve(L, TemplateLiteralToUnion(R) as any) :
    IsUnionType(L) ? (() => {
      const narrowed = L.anyOf.filter((inner) => ExtendsCheck(inner, R) !== ExtendsResult.False)
      return (narrowed.length === 1 ? narrowed[0] : Union(narrowed))
    })() :
      ExtendsCheck(L, R) !== ExtendsResult.False ? L :
      Never()
  ) as ExtractResolve<L, R>
}

// ------------------------------------------------------------------
// TExtract
// ------------------------------------------------------------------
// prettier-ignore
export type TExtract<T extends TSchema, U extends TSchema> = ExtractResolve<T, U>

/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract<L extends TMappedResult, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtractFromMappedResult<L, R>
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract<L extends TSchema, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtract<L, R>
/** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
export function Extract(type: TSchema, union: TSchema, options: SchemaOptions = {}) {
  if (IsMappedResultType(type)) {
    return ExtractFromMappedResult(type, union, options)
  } else {
    const E = ExtractResolve(type, union)
    return CloneType(E, options)
  }
}
