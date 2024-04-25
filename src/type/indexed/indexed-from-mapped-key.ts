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
import type { Ensure, Evaluate } from '../helpers/index'
import type { TProperties } from '../object/index'
import { Index, type TIndex } from './indexed'
import { MappedResult, type TMappedResult, type TMappedKey } from '../mapped/index'

// ------------------------------------------------------------------
// MappedIndexPropertyKey
// ------------------------------------------------------------------
// prettier-ignore
type TMappedIndexPropertyKey<
  T extends TSchema, 
  K extends PropertyKey
> = {
  [_ in K]: TIndex<T, [K]>
}
// prettier-ignore
function MappedIndexPropertyKey<
  T extends TSchema, 
  K extends PropertyKey
>(T: T, K: K, options: SchemaOptions): TMappedIndexPropertyKey<T, K> {
  return { [K]: Index(T, [K], options) } as never
}
// ------------------------------------------------------------------
// MappedIndexPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
type TMappedIndexPropertyKeys<T extends TSchema, K extends PropertyKey[], Acc extends TProperties = {}> = (
  K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? TMappedIndexPropertyKeys<T, R, Acc & TMappedIndexPropertyKey<T, L>>
    : Acc
)
// prettier-ignore
function MappedIndexPropertyKeys<
  T extends TSchema, 
  K extends PropertyKey[]
>(T: T, K: [...K], options: SchemaOptions): TMappedIndexPropertyKeys<T, K> {
  return K.reduce((Acc, L) => {
    return { ...Acc, ...MappedIndexPropertyKey(T, L, options) }
  }, {} as TProperties) as never
}
// ------------------------------------------------------------------
// MappedIndexProperties
// ------------------------------------------------------------------
// prettier-ignore
type TMappedIndexProperties<T extends TSchema, K extends TMappedKey> = Evaluate<
  TMappedIndexPropertyKeys<T, K['keys']>
>
// prettier-ignore
function MappedIndexProperties<
  T extends TSchema, 
  K extends TMappedKey
>(T: T, K: K, options: SchemaOptions): TMappedIndexProperties<T, K> {
  return MappedIndexPropertyKeys(T, K.keys, options) as never
}
// ------------------------------------------------------------------
// TIndexFromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexFromMappedKey<
  T extends TSchema, 
  K extends TMappedKey, 
  P extends TProperties = TMappedIndexProperties<T, K>
> = (
  Ensure<TMappedResult<P>>
)
// prettier-ignore
export function IndexFromMappedKey<
  T extends TSchema, 
  K extends TMappedKey, 
  P extends TProperties = TMappedIndexProperties<T, K>
>(T: T, K: K, options: SchemaOptions): TMappedResult<P> {
  const P = MappedIndexProperties(T, K, options)
  return MappedResult(P) as never
}
