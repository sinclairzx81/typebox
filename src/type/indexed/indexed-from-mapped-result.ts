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
import { MappedResult, type TMappedResult } from '../mapped/index'
import { IndexPropertyKeys, type TIndexPropertyKeys } from './indexed-property-keys'
import { Index, type TIndex } from './index'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<
  T extends TSchema,
  P extends TProperties
> = (
  { [K2 in keyof P]: TIndex<T, TIndexPropertyKeys<P[K2]>> }   
)
// prettier-ignore
function FromProperties<
  T extends TSchema,
  P extends TProperties
>(T: T, P: P, options: SchemaOptions): TFromProperties<T, P> {
  const Acc = {} as Record<PropertyKey, TSchema>
  for(const K2 of Object.getOwnPropertyNames(P)) {
    Acc[K2] = Index(T, IndexPropertyKeys(P[K2]), options)
  }
  return Acc as never
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<
  T extends TSchema,
  R extends TMappedResult
> = (
  TFromProperties<T, R['properties']>
)
// prettier-ignore
function FromMappedResult<
  T extends TSchema,
  R extends TMappedResult
>(T: T, R: R, options: SchemaOptions): TFromMappedResult<T, R> {
  return FromProperties(T, R.properties, options) as never
}
// ------------------------------------------------------------------
// TIndexFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexFromMappedResult<
  T extends TSchema,
  R extends TMappedResult,
  P extends TProperties = TFromMappedResult<T, R>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function IndexFromMappedResult<
  T extends TSchema,
  R extends TMappedResult,
  P extends TProperties = TFromMappedResult<T, R>
>(T: T, R: R, options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedResult(T, R, options)
  return MappedResult(P) as never
}
