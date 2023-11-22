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
import { MappedResult, type TMappedResult } from '../mapped/index'
import { Exclude, type TExclude } from './exclude'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<
  K extends TProperties,
  T extends TSchema
> = (
  { [K2 in keyof K]: TExclude<K[K2], T> }   
)
// prettier-ignore
function FromProperties<
  P extends TProperties,
  T extends TSchema
>(P: P, U: T, options: SchemaOptions): TFromProperties<P, T> {
  return globalThis.Object.getOwnPropertyNames(P).reduce((Acc, K2) => {
    return {...Acc, [K2]: Exclude(P[K2], U, options) }
  }, {}) as TFromProperties<P, T>
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<
  R extends TMappedResult,
  T extends TSchema
> = (
  TFromProperties<R['properties'], T>
  )
// prettier-ignore
function FromMappedResult<
  R extends TMappedResult,
  T extends TSchema
>(R: R, T: T, options: SchemaOptions): TFromMappedResult<R, T> {
  return FromProperties(R.properties, T, options) as TFromMappedResult<R, T>
}
// ------------------------------------------------------------------
// ExcludeFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TExcludeFromMappedResult<
  R extends TMappedResult,
  T extends TSchema,
  P extends TProperties = TFromMappedResult<R, T>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function ExcludeFromMappedResult<
  R extends TMappedResult,
  T extends TSchema,
  P extends TProperties = TFromMappedResult<R, T>
>(R: R, T: T, options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedResult(R, T, options) as unknown as P
  return MappedResult(P) 
}
