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
import type { TProperties } from '../object/index'
import type { Assert } from '../helpers/index'
import { MappedResult, type TMappedResult, type TMappedKey } from '../mapped/index'
import { Literal, type TLiteral, type TLiteralValue } from '../literal/index'
import { Extends, type TExtends } from './extends'

// ------------------------------------------------------------------
// FromPropertyKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromPropertyKey<
  K extends PropertyKey,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema
> = {
    [_ in K]: TExtends<TLiteral<Assert<K, TLiteralValue>>, U, L, R>
  }
// prettier-ignore
function FromPropertyKey<
  K extends PropertyKey,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema
>(K: K, U: U, L: L, R: R, options: SchemaOptions): TFromPropertyKey<K, U, L, R> {
  return {
    [K]: Extends(Literal(K as TLiteralValue), U, L, R, options) as any
  } as never
}
// ------------------------------------------------------------------
// FromPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
type TFromPropertyKeys<
  K extends PropertyKey[],
  U extends TSchema,
  L extends TSchema,
  R extends TSchema,
  Acc extends TProperties = {}
> = (
  K extends [infer LK extends PropertyKey, ...infer RK extends PropertyKey[]]
    ? TFromPropertyKeys<RK, U, L, R, Acc & TFromPropertyKey<LK, U, L, R>>
    : Acc
)
// prettier-ignore
function FromPropertyKeys<
  K extends PropertyKey[],
  U extends TSchema,
  L extends TSchema,
  R extends TSchema
>(K: [...K], U: U, L: L, R: R, options: SchemaOptions): TFromPropertyKeys<K, U, L, R> {
  return K.reduce((Acc, LK) => {
    return { ...Acc, ...FromPropertyKey(LK, U, L, R, options) }
  }, {} as TProperties) as never
}
// ------------------------------------------------------------------
// FromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedKey<
  K extends TMappedKey,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema
> = (
    TFromPropertyKeys<K['keys'], U, L, R>
  )
// prettier-ignore
function FromMappedKey<
  K extends TMappedKey,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema
>(K: K, U: U, L: L, R: R, options: SchemaOptions): TFromMappedKey<K, U, L, R> {
  return FromPropertyKeys(K.keys, U, L, R, options) as never
}
// ------------------------------------------------------------------
// ExtendsFromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
export type TExtendsFromMappedKey<
  T extends TMappedKey,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema,
  P extends TProperties = TFromMappedKey<T, U, L, R>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function ExtendsFromMappedKey<
  T extends TMappedKey,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema,
  P extends TProperties = TFromMappedKey<T, U, L, R>
>(T: T, U: U, L: L, R: R, options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedKey(T, U, L, R, options)
  return MappedResult(P) as never
}
