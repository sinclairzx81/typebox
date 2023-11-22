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

import type { SchemaOptions } from '../schema/index'
import type { TProperties } from '../object/index'
import { MappedResult, type TMappedResult, type TMappedKey } from '../mapped/index'
import { Intrinsic, type TIntrinsic, type IntrinsicMode } from './intrinsic'
import { Literal, TLiteral, TLiteralValue } from '../literal/index'

// ------------------------------------------------------------------
// MappedIntrinsicPropertyKey
// ------------------------------------------------------------------
// prettier-ignore
type MappedIntrinsicPropertyKey<
  K extends PropertyKey,
  M extends IntrinsicMode,
  P extends TLiteralValue = K extends TLiteralValue ? K : never
> = {
    [_ in K]: TIntrinsic<TLiteral<P>, M>
  }
// prettier-ignore
function MappedIntrinsicPropertyKey<
  K extends PropertyKey,
  M extends IntrinsicMode,
>(K: K, M: M, options: SchemaOptions): MappedIntrinsicPropertyKey<K, M> {
  return {
    [K]: Intrinsic(Literal(K as any), M, options)
  } as MappedIntrinsicPropertyKey<K, M>
}
// ------------------------------------------------------------------
// MappedIntrinsicPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
type MappedIntrinsicPropertyKeys<
  K extends PropertyKey[],
  M extends IntrinsicMode,
> = (
    K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
      ? MappedIntrinsicPropertyKey<L, M> & MappedIntrinsicPropertyKeys<R, M>
      : {}
  )
// prettier-ignore
function MappedIntrinsicPropertyKeys<
  K extends PropertyKey[],
  M extends IntrinsicMode
>(K: [...K], M: M, options: SchemaOptions): MappedIntrinsicPropertyKeys<K, M> {
  const [L, ...R] = K
  return (
    K.length > 0
      ? { ...MappedIntrinsicPropertyKey(L, M, options), ...MappedIntrinsicPropertyKeys(R, M, options) }
      : {}
  ) as MappedIntrinsicPropertyKeys<K, M>
}
// ------------------------------------------------------------------
// MappedIntrinsicProperties
// ------------------------------------------------------------------
// prettier-ignore
type MappedIntrinsicProperties<
  K extends TMappedKey,
  M extends IntrinsicMode,
> = (
    MappedIntrinsicPropertyKeys<K['keys'], M>
  )
// prettier-ignore
function MappedIntrinsicProperties<
  K extends TMappedKey,
  M extends IntrinsicMode,
>(T: K, M: M, options: SchemaOptions): MappedIntrinsicProperties<K, M> {
  return MappedIntrinsicPropertyKeys(T['keys'], M, options) as MappedIntrinsicProperties<K, M>
}
// ------------------------------------------------------------------
// TIntrinsicFromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
export type TIntrinsicFromMappedKey<
  K extends TMappedKey,
  M extends IntrinsicMode,
  P extends TProperties = MappedIntrinsicProperties<K, M>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function IntrinsicFromMappedKey<
  K extends TMappedKey,
  M extends IntrinsicMode,
  P extends TProperties = MappedIntrinsicProperties<K, M>
>(T: K, M: M, options: SchemaOptions): TMappedResult<P> {
  const P = MappedIntrinsicProperties(T, M, options) as unknown as P
  return MappedResult(P) 
}
