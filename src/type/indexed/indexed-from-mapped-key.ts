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
import type { Ensure, Evaluate } from '../helpers/index'
import type { TProperties } from '../object/index'
import { Index, type TIndex } from './indexed'
import { MappedResult, type TMappedResult, type TMappedKey } from '../mapped/index'
import { Clone } from '../clone/value'

// ------------------------------------------------------------------
// MappedIndexPropertyKey
// ------------------------------------------------------------------
// prettier-ignore
type TMappedIndexPropertyKey<Type extends TSchema, Key extends PropertyKey> = {
  [_ in Key]: TIndex<Type, [Key]>
}
// prettier-ignore
function MappedIndexPropertyKey<Type extends TSchema, Key extends PropertyKey>(type: Type, key: Key, options?: SchemaOptions): TMappedIndexPropertyKey<Type, Key> {
  return { [key]: Index(type, [key], Clone(options)) } as never
}
// ------------------------------------------------------------------
// MappedIndexPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
type TMappedIndexPropertyKeys<Type extends TSchema, PropertyKeys extends PropertyKey[], Result extends TProperties = {}> = (
  PropertyKeys extends [infer Left extends PropertyKey, ...infer Right extends PropertyKey[]]
    ? TMappedIndexPropertyKeys<Type, Right, Result & TMappedIndexPropertyKey<Type, Left>>
    : Result
)
// prettier-ignore
function MappedIndexPropertyKeys<
  Type extends TSchema, 
  PropertyKeys extends PropertyKey[]
>(type: Type, propertyKeys: [...PropertyKeys], options?: SchemaOptions): TMappedIndexPropertyKeys<Type, PropertyKeys> {
  return propertyKeys.reduce((result, left) => {
    return { ...result, ...MappedIndexPropertyKey(type, left, options) }
  }, {} as TProperties) as never
}
// ------------------------------------------------------------------
// MappedIndexProperties
// ------------------------------------------------------------------
// prettier-ignore
type TMappedIndexProperties<Type extends TSchema, MappedKey extends TMappedKey> = Evaluate<
  TMappedIndexPropertyKeys<Type, MappedKey['keys']>
>
// prettier-ignore
function MappedIndexProperties<Type extends TSchema, MappedKey extends TMappedKey
>(type: Type, mappedKey: MappedKey, options?: SchemaOptions): TMappedIndexProperties<Type, MappedKey> {
  return MappedIndexPropertyKeys(type, mappedKey.keys, options) as never
}
// ------------------------------------------------------------------
// TIndexFromMappedKey
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexFromMappedKey<Type extends TSchema, MappedKey extends TMappedKey, 
  Properties extends TProperties = TMappedIndexProperties<Type, MappedKey>
> = (
  Ensure<TMappedResult<Properties>>
)
// prettier-ignore
export function IndexFromMappedKey<Type extends TSchema, MappedKey extends TMappedKey, 
  Properties extends TProperties = TMappedIndexProperties<Type, MappedKey>
>(type: Type, mappedKey: MappedKey, options?: SchemaOptions): TMappedResult<Properties> {
  const properties = MappedIndexProperties(type, mappedKey, options)
  return MappedResult(properties) as never
}
