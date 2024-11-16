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
import { type ZeroString, type UnionToTuple, type TIncrement } from '../helpers/index'
import type { TRecursive } from '../recursive/index'
import type { TIntersect } from '../intersect/index'
import type { TUnion } from '../union/index'
import type { TTuple } from '../tuple/index'
import type { TArray } from '../array/index'
import type { TObject, TProperties } from '../object/index'
import { SetUnionMany, SetIntersectMany, type TSetUnionMany, type TSetIntersectMany } from '../sets/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsIntersect, IsUnion, IsTuple, IsArray, IsObject, IsRecord } from '../guard/kind'
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<Types extends TSchema[], Result extends PropertyKey[][] = []> = (
  Types extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TFromRest<R, [...Result, TKeyOfPropertyKeys<L>]>
    : Result
)
// prettier-ignore
function FromRest<Types extends TSchema[]>(types: [...Types]): TFromRest<Types> {
  const result = [] as PropertyKey[][]
  for(const L of types) result.push(KeyOfPropertyKeys(L))
  return result as never
}
// ------------------------------------------------------------------
// FromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Types extends TSchema[], 
  PropertyKeysArray extends PropertyKey[][] = TFromRest<Types>,
  PropertyKeys extends PropertyKey[] = TSetUnionMany<PropertyKeysArray>
> = PropertyKeys
// prettier-ignore
function FromIntersect<Types extends TSchema[]>(types: [...Types]): TFromIntersect<Types> {
  const propertyKeysArray = FromRest(types) as PropertyKey[][]
  const propertyKeys = SetUnionMany(propertyKeysArray)
  return propertyKeys as never
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Types extends TSchema[], 
  PropertyKeysArray extends PropertyKey[][] = TFromRest<Types>,
  PropertyKeys extends PropertyKey[] = TSetIntersectMany<PropertyKeysArray>
> = PropertyKeys
// prettier-ignore
function FromUnion<Types extends TSchema[]>(types: [...Types]): TFromUnion<Types> {
  const propertyKeysArray = FromRest(types) as PropertyKey[][]
  const propertyKeys = SetIntersectMany(propertyKeysArray)
  return propertyKeys as never
}
// ------------------------------------------------------------------
// FromTuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<Types extends TSchema[], Indexer extends string = ZeroString, Acc extends PropertyKey[] = []> = 
  Types extends [infer _ extends TSchema, ...infer R extends TSchema[]]
    ? TFromTuple<R, TIncrement<Indexer>, [...Acc, Indexer]>
    : Acc
// prettier-ignore
function FromTuple<Types extends TSchema[]>(types: [...Types]): TFromTuple<Types> {
  return types.map((_, indexer) => indexer.toString()) as never
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
// prettier-ignore
type TFromArray<_ extends TSchema> = (
  ['[number]']
)
// prettier-ignore
function FromArray<_ extends TSchema>(_: _): TFromArray<_> {
  return (
    ['[number]']
  )
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<Properties extends TProperties> = (
  UnionToTuple<keyof Properties>
)
// prettier-ignore
function FromProperties<Properties extends TProperties>(T: Properties): TFromProperties<Properties> {
  return (
    globalThis.Object.getOwnPropertyNames(T)
  ) as never
}
// ------------------------------------------------------------------
// FromPatternProperties
// ------------------------------------------------------------------
// prettier-ignore
function FromPatternProperties(patternProperties: Record<PropertyKey, TSchema>): string[] {
  if(!includePatternProperties) return []
  const patternPropertyKeys = globalThis.Object.getOwnPropertyNames(patternProperties)
  return patternPropertyKeys.map(key => {
    return (key[0] === '^' && key[key.length - 1] === '$') 
      ? key.slice(1, key.length - 1) 
      : key
  })
}
// ------------------------------------------------------------------
// KeyOfPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
export type TKeyOfPropertyKeys<Type extends TSchema> = (
  Type extends TRecursive<infer Type extends TSchema> ? TKeyOfPropertyKeys<Type> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect<Types> :
  Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Types> :
  Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple<Types> :
  Type extends TArray<infer Type extends TSchema> ? TFromArray<Type> :
  Type extends TObject<infer Properties extends TProperties> ? TFromProperties<Properties> :
  []
)
/** Returns a tuple of PropertyKeys derived from the given TSchema. */
// prettier-ignore
export function KeyOfPropertyKeys<Type extends TSchema>(type: Type): TKeyOfPropertyKeys<Type> {
  return (
    IsIntersect(type) ? FromIntersect(type.allOf) :
    IsUnion(type) ? FromUnion(type.anyOf) :
    IsTuple(type) ? FromTuple(type.items ?? []) :
    IsArray(type) ? FromArray(type.items) :
    IsObject(type) ? FromProperties(type.properties) :
    IsRecord(type) ? FromPatternProperties(type.patternProperties) :
    []
  ) as never
}
// ----------------------------------------------------------------
// KeyOfPattern
// ----------------------------------------------------------------
let includePatternProperties = false
/** Returns a regular expression pattern derived from the given TSchema */
export function KeyOfPattern(schema: TSchema): string {
  includePatternProperties = true
  const keys = KeyOfPropertyKeys(schema)
  includePatternProperties = false
  const pattern = keys.map((key) => `(${key})`)
  return `^(${pattern.join('|')})$`
}
