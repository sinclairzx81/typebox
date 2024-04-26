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

import type { SchemaOptions } from '../schema/index'
import type { TProperties } from '../object/index'
import { Assert } from '../helpers/index'
import { MappedResult, type TMappedResult, type TMappedKey } from '../mapped/index'
import { Intrinsic, type TIntrinsic, type IntrinsicMode } from './intrinsic'
import { Literal, type TLiteral, type TLiteralValue } from '../literal/index'

// ------------------------------------------------------------------
// MappedIntrinsicPropertyKey
// ------------------------------------------------------------------
// prettier-ignore
type TMappedIntrinsicPropertyKey<
  K extends PropertyKey,
  M extends IntrinsicMode,
> = {
    [_ in K]: TIntrinsic<TLiteral<Assert<K, TLiteralValue>>, M>
  }
// prettier-ignore
function MappedIntrinsicPropertyKey<
  K extends PropertyKey,
  M extends IntrinsicMode,
>(K: K, M: M, options: SchemaOptions): TMappedIntrinsicPropertyKey<K, M> {
  return {
    [K]: Intrinsic(Literal(K as TLiteralValue), M, options)
  } as never
}
// ------------------------------------------------------------------
// MappedIntrinsicPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
type TMappedIntrinsicPropertyKeys<
  K extends PropertyKey[],
  M extends IntrinsicMode,
  Acc extends TProperties = {}
> = (
  K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TMappedIntrinsicPropertyKeys<R, M, Acc & TMappedIntrinsicPropertyKey<L, M>>
    : Acc
)
// prettier-ignore
function MappedIntrinsicPropertyKeys<
  K extends PropertyKey[],
  M extends IntrinsicMode
>(K: [...K], M: M, options: SchemaOptions): TMappedIntrinsicPropertyKeys<K, M> {
  return K.reduce((Acc, L) => {
    return { ...Acc, ...MappedIntrinsicPropertyKey(L, M, options) }
  }, {} as TProperties) as never
}
// ------------------------------------------------------------------
// MappedIntrinsicProperties
// ------------------------------------------------------------------
// prettier-ignore
type TMappedIntrinsicProperties<
  K extends TMappedKey,
  M extends IntrinsicMode,
> = (
  TMappedIntrinsicPropertyKeys<K['keys'], M>
  )
// prettier-ignore
function MappedIntrinsicProperties<
  K extends TMappedKey,
  M extends IntrinsicMode,
>(T: K, M: M, options: SchemaOptions): TMappedIntrinsicProperties<K, M> {
  return MappedIntrinsicPropertyKeys(T['keys'], M, options) as never
}
// ------------------------------------------------------------------
// IntrinsicFromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
export type TIntrinsicFromMappedKey<
  K extends TMappedKey,
  M extends IntrinsicMode,
  P extends TProperties = TMappedIntrinsicProperties<K, M>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function IntrinsicFromMappedKey<
  K extends TMappedKey,
  M extends IntrinsicMode,
  P extends TProperties = TMappedIntrinsicProperties<K, M>
>(T: K, M: M, options: SchemaOptions): TMappedResult<P> {
  const P = MappedIntrinsicProperties(T, M, options)
  return MappedResult(P) as never
}
