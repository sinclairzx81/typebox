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
import { Extends, type TExtends } from './extends'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type FromProperties<
  K extends TProperties,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema
> = (
  { [K2 in keyof K]: TExtends<K[K2], U, L, R> }   
)
// prettier-ignore
function FromProperties<
  K extends TProperties,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema
>(K: K, U: U, L: L, R: R, options: SchemaOptions): FromProperties<K, U, L, R> {
  return globalThis.Object.getOwnPropertyNames(K).reduce((Acc, K2) => {
    return {...Acc, [K2]: Extends(K[K2], U, L, R, options) }
  }, {}) as FromProperties<K, U, L, R>
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type FromMappedResult<
  K extends TMappedResult,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema
> = (
    FromProperties<K['properties'], U, L, R>
  )
// prettier-ignore
function FromMappedResult<
  K extends TMappedResult,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema
>(K: K, U: U, L: L, R: R, options: SchemaOptions): FromMappedResult<K, U, L, R> {
  return FromProperties(K.properties, U, L, R, options) as FromMappedResult<K, U, L, R>
}
// ------------------------------------------------------------------
// TExtendsFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TExtendsFromMappedResult<
  T extends TMappedResult,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema,
  P extends TProperties = FromMappedResult<T, U, L, R>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function ExtendsFromMappedResult<
  T extends TMappedResult,
  U extends TSchema,
  L extends TSchema,
  R extends TSchema,
  P extends TProperties = FromMappedResult<T, U, L, R>
>(T: T, U: U, L: L, R: R, options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedResult(T, U, L, R, options) as unknown as P
  return MappedResult(P) 
}
