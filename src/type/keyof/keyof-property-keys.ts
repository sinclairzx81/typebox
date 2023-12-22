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

import type { TSchema } from '../schema/index'
import { type ZeroString, type UnionToTuple, Increment } from '../helpers/index'
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
import { IsIntersect, IsUnion, IsTuple, IsArray, IsObject, IsRecord } from '../guard/type'
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<T extends TSchema[], Acc extends PropertyKey[][] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TFromRest<R, [...Acc, TKeyOfPropertyKeys<L>]>
    : Acc
)
// prettier-ignore
function FromRest<T extends TSchema[]>(T: [...T]): TFromRest<T> {
  return T.reduce((Acc, L) => {
    return [...Acc, KeyOfPropertyKeys(L)]
  }, [] as PropertyKey[][]) as TFromRest<T>
}
// ------------------------------------------------------------------
// FromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type FromIntersect<
  T extends TSchema[], 
  C extends PropertyKey[][] = TFromRest<T>,
  R extends PropertyKey[] = TSetUnionMany<C>
> = R
// prettier-ignore
function FromIntersect<T extends TSchema[]>(T: [...T]): FromIntersect<T> {
  const C = FromRest(T) as PropertyKey[][]
  const R = SetUnionMany(C)
  return R as FromIntersect<T>
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type FromUnion<
  T extends TSchema[], 
  C extends PropertyKey[][] = TFromRest<T>,
  R extends PropertyKey[] = TSetIntersectMany<C>
> = R
// prettier-ignore
function FromUnion<T extends TSchema[]>(T: [...T]): FromUnion<T> {
  const C = FromRest(T) as PropertyKey[][]
  const R = SetIntersectMany(C)
  return R as FromUnion<T>
}
// ------------------------------------------------------------------
// FromTuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<T extends TSchema[], I extends string = ZeroString, Acc extends PropertyKey[] = []> = 
  T extends [infer _ extends TSchema, ...infer R extends TSchema[]]
    ? TFromTuple<R, Increment<I>, [...Acc, I]>
    : Acc
// prettier-ignore
function FromTuple<T extends TSchema[]>(T: [...T]): TFromTuple<T> {
  return T.map((_, I) => I.toString()) as TFromTuple<T>
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
type TFromProperties<T extends TProperties> = (
  UnionToTuple<keyof T>
)
// prettier-ignore
function FromProperties<T extends TProperties>(T: T): TFromProperties<T> {
  return (
    globalThis.Object.getOwnPropertyNames(T)
  ) as TFromProperties<T>
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
export type TKeyOfPropertyKeys<T extends TSchema> = (
  T extends TRecursive<infer S> ? TKeyOfPropertyKeys<S> :
  T extends TIntersect<infer S> ? FromIntersect<S> :
  T extends TUnion<infer S> ? FromUnion<S> :
  T extends TTuple<infer S> ? TFromTuple<S> :
  T extends TArray<infer S> ? TFromArray<S> :
  T extends TObject<infer S> ? TFromProperties<S> :
  []
)
/** Returns a tuple of PropertyKeys derived from the given TSchema. */
// prettier-ignore
export function KeyOfPropertyKeys<T extends TSchema>(T: T): TKeyOfPropertyKeys<T> {
  return (
    IsIntersect(T) ? FromIntersect(T.allOf) :
    IsUnion(T) ? FromUnion(T.anyOf) :
    IsTuple(T) ? FromTuple(T.items ?? []) :
    IsArray(T) ? FromArray(T.items) :
    IsObject(T) ? FromProperties(T.properties) :
    IsRecord(T) ? FromPatternProperties(T.patternProperties) :
    []
  ) as TKeyOfPropertyKeys<T>
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
