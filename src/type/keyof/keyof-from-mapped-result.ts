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

import type { SchemaOptions } from '../schema/index'
import type { Ensure, Evaluate } from '../helpers/index'
import type { TProperties } from '../object/index'
import { MappedResult, type TMappedResult } from '../mapped/index'
import { KeyOf, type TKeyOfFromType } from './keyof'
import { Clone } from '../clone/value'
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<Properties extends TProperties> = (
  { [K2 in keyof Properties]: TKeyOfFromType<Properties[K2]> }   
)
// prettier-ignore
function FromProperties<Properties extends TProperties>(properties: Properties, options?: SchemaOptions): TFromProperties<Properties> {
  const result = {} as TProperties
  for(const K2 of globalThis.Object.getOwnPropertyNames(properties)) result[K2] = KeyOf(properties[K2], Clone(options))
  return result as never
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<MappedResult extends TMappedResult> = (
  Evaluate<TFromProperties<MappedResult['properties']>>
)
// prettier-ignore
function FromMappedResult<MappedResult extends TMappedResult>(mappedResult: MappedResult, options?: SchemaOptions): TFromMappedResult<MappedResult> {
  return FromProperties(mappedResult.properties, options) as never
}
// ------------------------------------------------------------------
// KeyOfFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TKeyOfFromMappedResult<
  MappedResult extends TMappedResult,
  Properties extends TProperties = TFromMappedResult<MappedResult>
> = (
  Ensure<TMappedResult<Properties>>
)
// prettier-ignore
export function KeyOfFromMappedResult<
  MappedResult extends TMappedResult,
  Properties extends TProperties = TFromMappedResult<MappedResult>
>(mappedResult: MappedResult, options?: SchemaOptions): TMappedResult<Properties> {
  const properties = FromMappedResult(mappedResult, options)
  return MappedResult(properties) as never
}
