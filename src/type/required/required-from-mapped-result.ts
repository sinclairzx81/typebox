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
import { Required, type TRequired } from './required'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<
  P extends TProperties
> = (
  { [K2 in keyof P]: TRequired<P[K2]> }   
)
// prettier-ignore
function FromProperties<
  P extends TProperties
>(P: P, options: SchemaOptions): TFromProperties<P> {
  return globalThis.Object.getOwnPropertyNames(P).reduce((Acc, K2) => {
    return {...Acc, [K2]: Required(P[K2], options) }
  }, {}) as TFromProperties<P>
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<
  R extends TMappedResult
> = (
  TFromProperties<R['properties']>
)
// prettier-ignore
function FromMappedResult<
  R extends TMappedResult
>(R: R, options: SchemaOptions): TFromMappedResult<R> {
  return FromProperties(R.properties, options) as TFromMappedResult<R>
}
// ------------------------------------------------------------------
// TRequiredFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TRequiredFromMappedResult<
  R extends TMappedResult,
  P extends TProperties = TFromMappedResult<R>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function RequiredFromMappedResult<
  R extends TMappedResult,
  P extends TProperties = TFromMappedResult<R>
>(R: R, options: SchemaOptions): TMappedResult<P> {
  const P = FromMappedResult(R, options) as unknown as P
  return MappedResult(P) 
}
