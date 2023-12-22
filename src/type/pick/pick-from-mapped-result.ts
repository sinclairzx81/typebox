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
import { Pick, type TPick } from './pick'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<
  P extends TProperties,
  K extends PropertyKey[],
> = (
  { [K2 in keyof P]: TPick<P[K2], K> }   
)
// prettier-ignore
function FromProperties<
  P extends TProperties,
  K extends PropertyKey[],
>(P: P, K: [...K], options: SchemaOptions): TFromProperties<P, K> {
  return globalThis.Object.getOwnPropertyNames(P).reduce((Acc, K2) => {
    return {...Acc, [K2]: Pick(P[K2], K, options) }
  }, {}) as TFromProperties<P, K>
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<
  R extends TMappedResult,
  K extends PropertyKey[],
> = (
  TFromProperties<R['properties'], K>
)
// prettier-ignore
function FromMappedResult<
  R extends TMappedResult,
  K extends PropertyKey[]
>(R: R, K: [...K], options: SchemaOptions): TFromMappedResult<R, K> {
  return FromProperties(R.properties, K, options) as TFromMappedResult<R, K>
}
// ------------------------------------------------------------------
// PickFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TPickFromMappedResult<
  T extends TMappedResult,
  K extends PropertyKey[],
  P extends TProperties = TFromMappedResult<T, K>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function PickFromMappedResult<
  R extends TMappedResult,
  K extends PropertyKey[],
  P extends TProperties = TFromMappedResult<R, K>
>(R: R, K: [...K], options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedResult(R, K, options) as unknown as P
  return MappedResult(P) 
}
