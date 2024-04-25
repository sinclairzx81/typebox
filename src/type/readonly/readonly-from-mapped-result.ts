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

import type { TProperties } from '../object/index'
import { MappedResult, type TMappedResult } from '../mapped/index'
import { Readonly, type TReadonlyWithFlag } from './readonly'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<
  P extends TProperties,
  F extends boolean,
> = (
  { [K2 in keyof P]: TReadonlyWithFlag<P[K2], F> }   
)
// prettier-ignore
function FromProperties<
  P extends TProperties,
  F extends boolean,
>(K: P, F: F): TFromProperties<P, F> {
  const Acc = {} as TProperties
  for(const K2 of globalThis.Object.getOwnPropertyNames(K)) Acc[K2] = Readonly(K[K2], F)
  return Acc as never
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<
  R extends TMappedResult,
  F extends boolean,
> = (
    TFromProperties<R['properties'], F>
  )
// prettier-ignore
function FromMappedResult<
  R extends TMappedResult,
  F extends boolean,
>(R: R, F: F): TFromMappedResult<R, F> {
  return FromProperties(R.properties, F) as never
}
// ------------------------------------------------------------------
// ReadonlyFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TReadonlyFromMappedResult<
  R extends TMappedResult,
  F extends boolean,
  P extends TProperties = TFromMappedResult<R, F>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function ReadonlyFromMappedResult<
  R extends TMappedResult,
  F extends boolean,
  P extends TProperties = TFromMappedResult<R, F>
>(R: R, F: F): TMappedResult<P> {
  const P = FromMappedResult(R, F)
  return MappedResult(P) as never
}
