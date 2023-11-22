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
import type { TProperties } from '../object/index'
import { MappedResult, type TMappedResult, type TMappedKey } from '../mapped/index'
import { Omit, type TOmit } from './omit'

// ------------------------------------------------------------------
// FromPropertyKey
// ------------------------------------------------------------------
// prettier-ignore
type FromPropertyKey<
  T extends TSchema,
  K extends PropertyKey,
> = {
    [_ in K]: TOmit<T, [K]>
  }
// prettier-ignore
function FromPropertyKey<
  T extends TSchema,
  K extends PropertyKey,
>(T: T, K: K, options: SchemaOptions): FromPropertyKey<T, K> {
  return {
    [K]: Omit(T, [K], options)
  } as FromPropertyKey<T, K>
}
// ------------------------------------------------------------------
// FromPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
type FromPropertyKeys<
  T extends TSchema,
  K extends PropertyKey[]
> = (
    K extends [infer LK extends PropertyKey, ...infer RK extends PropertyKey[]]
    ? FromPropertyKey<T, LK> & FromPropertyKeys<T, RK>
    : {}
  )
// prettier-ignore
function FromPropertyKeys<
  T extends TSchema,
  K extends PropertyKey[]
>(T: T, K: [...K], options: SchemaOptions): FromPropertyKeys<T, K> {
  const [LK, ...RK] = K
  return (
    K.length > 0
      ? { ...FromPropertyKey(T, LK, options), ...FromPropertyKeys(T, RK, options) }
      : {}
  ) as FromPropertyKeys<T, K>
}
// ------------------------------------------------------------------
// FromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
type FromMappedKey<
  T extends TSchema,
  K extends TMappedKey,
> = (
    FromPropertyKeys<T, K['keys']>
  )
// prettier-ignore
function FromMappedKey<
  T extends TSchema,
  K extends TMappedKey,
>(T: T, K: K, options: SchemaOptions): FromMappedKey<T, K> {
  return FromPropertyKeys(T, K.keys, options) as FromMappedKey<T, K>
}
// ------------------------------------------------------------------
// TOmitFromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
export type TOmitFromMappedKey<
  T extends TSchema,
  K extends TMappedKey,
  P extends TProperties = FromMappedKey<T, K>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function OmitFromMappedKey<
  T extends TSchema,
  K extends TMappedKey,
  P extends TProperties = FromMappedKey<T, K>
>(T: T, K: K, options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedKey(T, K, options) as unknown as P
  return MappedResult(P) 
}
