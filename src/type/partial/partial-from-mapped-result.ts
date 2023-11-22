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
import { MappedResult, type TMappedResult } from '../mapped/index'
import { Partial, type TPartial } from './partial'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type FromProperties<
  K extends TProperties
> = (
  { [K2 in keyof K]: TPartial<K[K2]> }   
)
// prettier-ignore
function FromProperties<
  K extends TProperties
>(K: K, options: SchemaOptions): FromProperties<K> {
  return globalThis.Object.getOwnPropertyNames(K).reduce((Acc, K2) => {
    return {...Acc, [K2]: Partial(K[K2], options) }
  }, {}) as FromProperties<K>
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type FromMappedResult<
  K extends TMappedResult
> = (
    FromProperties<K['properties']>
  )
// prettier-ignore
function FromMappedResult<
  K extends TMappedResult
>(K: K, options: SchemaOptions): FromMappedResult<K> {
  return FromProperties(K.properties, options) as FromMappedResult<K>
}
// ------------------------------------------------------------------
// TPartialFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TPartialFromMappedResult<
  T extends TMappedResult,
  P extends TProperties = FromMappedResult<T>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function PartialFromMappedResult<
  T extends TMappedResult,
  P extends TProperties = FromMappedResult<T>
>(T: T, options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedResult(T, options) as unknown as P
  return MappedResult(P) 
}
