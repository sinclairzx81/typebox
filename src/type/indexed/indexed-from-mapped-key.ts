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
import { type TProperties } from '../object/index'
import { IndexResult, type TIndexResult } from './indexed-result'
import { MappedResult, type TMappedResult, type TMappedKey } from '../mapped/index'
import { Evaluate } from '../helpers/index'

// ------------------------------------------------------------------
// MappedIndexPropertyKey
// ------------------------------------------------------------------
// prettier-ignore
type MappedIndexPropertyKey<
  T extends TSchema, 
  K extends PropertyKey
> = {
  [_ in K]: TIndexResult<T, [K]>
}
// prettier-ignore
function MappedIndexPropertyKey<
  T extends TSchema, 
  K extends PropertyKey
>(T: T, K: K, options: SchemaOptions): MappedIndexPropertyKey<T, K> {
  // todo: propogate options into index result. This type looks like it
  // could use a clean up, possibly inlining it into indexed.ts to
  // bring it inline with other mapping types.
  return { [K]: IndexResult(T, [K], options) } as MappedIndexPropertyKey<T, K>
}
// ------------------------------------------------------------------
// MappedIndexPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
type MappedIndexPropertyKeys<T extends TSchema, K extends PropertyKey[]> = (
  K extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? MappedIndexPropertyKey<T, L> & MappedIndexPropertyKeys<T, R>
    : {}
)
// prettier-ignore
function MappedIndexPropertyKeys<
  T extends TSchema, 
  K extends PropertyKey[]
>(T: T, K: [...K], options: SchemaOptions): MappedIndexPropertyKeys<T, K> {
  const [L, ...R] = K
  return (
    K.length > 0 
      ? { ...MappedIndexPropertyKey(T, L, options), ...MappedIndexPropertyKeys(T, R, options) } as any // TS 5.4-dev
      : {}
    ) as MappedIndexPropertyKeys<T, K>
}
// ------------------------------------------------------------------
// MappedIndexProperties
// ------------------------------------------------------------------
// prettier-ignore
type MappedIndexProperties<T extends TSchema, K extends TMappedKey> = Evaluate<
  MappedIndexPropertyKeys<T, K['keys']>
>
// prettier-ignore
function MappedIndexProperties<
  T extends TSchema, 
  K extends TMappedKey
>(T: T, K: K, options: SchemaOptions): MappedIndexProperties<T, K> {
  return MappedIndexPropertyKeys(T, K.keys, options) as MappedIndexProperties<T, K>
}
// ------------------------------------------------------------------
// TIndexFromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexFromMappedKey<
  T extends TSchema, 
  K extends TMappedKey, 
  P extends TProperties = MappedIndexProperties<T, K>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function IndexFromMappedKey<
  T extends TSchema, 
  K extends TMappedKey, 
  P extends TProperties = MappedIndexProperties<T, K>
>(T: T, K: K, options: SchemaOptions): TMappedResult<P> {
  const P = MappedIndexProperties(T, K, options) as unknown as P
  return MappedResult(P)
}
