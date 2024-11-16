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
import { Omit, type TOmit } from './omit'
import { Clone } from '../clone/value'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<Properties extends TProperties, PropertyKeys extends PropertyKey[]> = (
  { [K2 in keyof Properties]: TOmit<Properties[K2], PropertyKeys> }   
)
// prettier-ignore
function FromProperties<Properties extends TProperties, PropertyKeys extends PropertyKey[]>(properties: Properties, propertyKeys: [...PropertyKeys], options?: SchemaOptions): TFromProperties<Properties, PropertyKeys> {
  const result = {} as TProperties
  for(const K2 of globalThis.Object.getOwnPropertyNames(properties)) result[K2] = Omit(properties[K2], propertyKeys, Clone(options))
  return result as never
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<MappedResult extends TMappedResult, PropertyKeys extends PropertyKey[]> = (
  Evaluate<TFromProperties<MappedResult['properties'], PropertyKeys>>
)
// prettier-ignore
function FromMappedResult<MappedResult extends TMappedResult, PropertyKeys extends PropertyKey[]>(mappedResult: MappedResult, propertyKeys: [...PropertyKeys], options?: SchemaOptions): TFromMappedResult<MappedResult, PropertyKeys> {
  return FromProperties(mappedResult.properties, propertyKeys, options) as never
}
// ------------------------------------------------------------------
// TOmitFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TOmitFromMappedResult<
  MappedResult extends TMappedResult,
  PropertyKeys extends PropertyKey[],
  Properties extends TProperties = TFromMappedResult<MappedResult, PropertyKeys>
> = (
  Ensure<TMappedResult<Properties>>
)
// prettier-ignore
export function OmitFromMappedResult<
  MappedResult extends TMappedResult,
  PropertyKeys extends PropertyKey[],
  Properties extends TProperties = TFromMappedResult<MappedResult, PropertyKeys>
>(mappedResult: MappedResult, propertyKeys: [...PropertyKeys], options?: SchemaOptions): TMappedResult<Properties> {
  const properties = FromMappedResult(mappedResult, propertyKeys, options)
  return MappedResult(properties) as never
}
