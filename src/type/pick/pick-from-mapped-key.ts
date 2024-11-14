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
import { MappedResult, type TMappedResult, type TMappedKey } from '../mapped/index'
import { Pick, type TPick } from './pick'
import { Clone } from '../clone/value'

// ------------------------------------------------------------------
// FromPropertyKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromPropertyKey<Type extends TSchema, Key extends PropertyKey> = {
  [_ in Key]: TPick<Type, [Key]>
}
// prettier-ignore
function FromPropertyKey<Type extends TSchema, Key extends PropertyKey>(type: Type, key: Key, options?: SchemaOptions): TFromPropertyKey<Type, Key> {
  return {
    [key]: Pick(type, [key], Clone(options))
  } as never
}
// ------------------------------------------------------------------
// FromPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
type TFromPropertyKeys<Type extends TSchema, PropertyKeys extends PropertyKey[], Result extends TProperties = {}> = (
  PropertyKeys extends [infer LeftKey extends PropertyKey, ...infer RightKeys extends PropertyKey[]]
    ? TFromPropertyKeys<Type, RightKeys, Result & TFromPropertyKey<Type, LeftKey>>
    : Result
)
// prettier-ignore
function FromPropertyKeys<Type extends TSchema, PropertyKeys extends PropertyKey[]>(type: Type, propertyKeys: [...PropertyKeys], options?: SchemaOptions): TFromPropertyKeys<Type, PropertyKeys> {
  return propertyKeys.reduce((result, leftKey) => {
    return { ...result, ...FromPropertyKey(type, leftKey, options) }
  }, {} as TProperties) as never
}
// ------------------------------------------------------------------
// FromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromMappedKey<Type extends TSchema, MappedKey extends TMappedKey> = (
  TFromPropertyKeys<Type, MappedKey['keys']>
)
// prettier-ignore
function FromMappedKey<Type extends TSchema, MappedKey extends TMappedKey>(type: Type, mappedKey: MappedKey, options?: SchemaOptions): TFromMappedKey<Type, MappedKey> {
  return FromPropertyKeys(type, mappedKey.keys, options) as never
}
// ------------------------------------------------------------------
// PickFromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
export type TPickFromMappedKey<Type extends TSchema, MappedKey extends TMappedKey,
  Properties extends TProperties = TFromMappedKey<Type, MappedKey>
> = (
  TMappedResult<Properties>
)
// prettier-ignore
export function PickFromMappedKey<Type extends TSchema, MappedKey extends TMappedKey,
  Properties extends TProperties = TFromMappedKey<Type, MappedKey>
>(type: Type, mappedKey: MappedKey, options?: SchemaOptions): TMappedResult<Properties> {
  const properties = FromMappedKey(type, mappedKey, options)
  return MappedResult(properties) as never
}
