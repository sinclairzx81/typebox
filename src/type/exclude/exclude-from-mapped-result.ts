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
type FromProperties<
  K extends TProperties,
  U extends TSchema
> = (
  { [K2 in keyof K]: TExclude<K[K2], U> }   
)
// prettier-ignore
function FromProperties<
  K extends TProperties,
  U extends TSchema
>(K: K, U: U, options: SchemaOptions): FromProperties<K, U> {
  return globalThis.Object.getOwnPropertyNames(K).reduce((Acc, K2) => {
    return {...Acc, [K2]: Exclude(K[K2], U, options) }
  }, {}) as FromProperties<K, U>
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type FromMappedResult<
  K extends TMappedResult,
  U extends TSchema
> = (
    FromProperties<K['properties'], U>
  )
// prettier-ignore
function FromMappedResult<
  K extends TMappedResult,
  U extends TSchema
>(K: K, U: U, options: SchemaOptions): FromMappedResult<K, U> {
  return FromProperties(K.properties, U, options) as FromMappedResult<K, U>
}
// ------------------------------------------------------------------
// TExcludeFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TExcludeFromMappedResult<
  T extends TMappedResult,
  U extends TSchema,
  P extends TProperties = FromMappedResult<T, U>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function ExcludeFromMappedResult<
  T extends TMappedResult,
  U extends TSchema,
  P extends TProperties = FromMappedResult<T, U>
>(T: T, U: U, options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedResult(T, U, options) as unknown as P
  return MappedResult(P) 
}
