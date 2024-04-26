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

import type { TSchema } from '../schema/index'
import type { TProperties } from '../object/index'
import { MappedResult, type TMappedResult } from '../mapped/index'
import { Extract, type TExtract } from './extract'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<
  P extends TProperties,
  T extends TSchema
> = (
  { [K2 in keyof P]: TExtract<P[K2], T> }   
)
// prettier-ignore
function FromProperties<
  P extends TProperties,
  T extends TSchema
>(P: P, T: T): TFromProperties<P, T> {
  const Acc = {} as TProperties
  for(const K2 of globalThis.Object.getOwnPropertyNames(P)) Acc[K2] = Extract(P[K2], T)
  return Acc as never
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
>(R: R, T: T): TFromMappedResult<R, T> {
  return FromProperties(R.properties, T) as never
}
// ------------------------------------------------------------------
// ExtractFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TExtractFromMappedResult<
  R extends TMappedResult,
  T extends TSchema,
  P extends TProperties = TFromMappedResult<R, T>
> = (
  TMappedResult<P>
)
// prettier-ignore
export function ExtractFromMappedResult<
  R extends TMappedResult,
  T extends TSchema,
  P extends TProperties = TFromMappedResult<R, T>
>(R: R, T: T): TMappedResult<P> {
  const P = FromMappedResult(R, T)
  return MappedResult(P) as never
}
