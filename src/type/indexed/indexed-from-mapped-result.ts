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

import type { TSchema, SchemaOptions } from '../schema/index'
import type { TProperties } from '../object/index'
import { MappedResult, type TMappedResult } from '../mapped/index'
import { IndexPropertyKeys, type TIndexPropertyKeys } from './indexed-property-keys'
import { Index, type TIndex } from './index'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<Type extends TSchema, Properties extends TProperties> = (
  { [K2 in keyof Properties]: TIndex<Type, TIndexPropertyKeys<Properties[K2]>> }   
)
// prettier-ignore
function FromProperties<Type extends TSchema, Properties extends TProperties>(type: Type, properties: Properties, options?: SchemaOptions): TFromProperties<Type, Properties> {
  const result = {} as Record<PropertyKey, TSchema>
  for(const K2 of Object.getOwnPropertyNames(properties)) {
    result[K2] = Index(type, IndexPropertyKeys(properties[K2]), options)
  }
  return result as never
}
// ------------------------------------------------------------------
// FromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedResult<Type extends TSchema, MappedResult extends TMappedResult> = (
  TFromProperties<Type, MappedResult['properties']>
)
// prettier-ignore
function FromMappedResult<Type extends TSchema, MappedResult extends TMappedResult>(type: Type, mappedResult: MappedResult, options?: SchemaOptions): TFromMappedResult<Type, MappedResult> {
  return FromProperties(type, mappedResult.properties, options) as never
}
// ------------------------------------------------------------------
// TIndexFromMappedResult
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexFromMappedResult<Type extends TSchema, MappedResult extends TMappedResult,
  Properties extends TProperties = TFromMappedResult<Type, MappedResult>
> = (
  TMappedResult<Properties>
)
// prettier-ignore
export function IndexFromMappedResult<Type extends TSchema, MappedResult extends TMappedResult,
  Properties extends TProperties = TFromMappedResult<Type, MappedResult>
>(type: Type, mappedResult: MappedResult, options?: SchemaOptions): TMappedResult<Properties> {
  const properties = FromMappedResult(type, mappedResult, options)
  return MappedResult(properties) as never
}
