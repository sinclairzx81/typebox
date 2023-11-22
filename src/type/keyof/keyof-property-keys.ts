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
import { OperatorUnionMany, OperatorIntersectMany } from '../operators/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TIntersect as IsIntersectType, 
  TUnion as IsUnionType, 
  TTuple as IsTupleType, 
  TArray as IsArrayType, 
  TObject as IsObjectType, 
  TRecord as IsRecordType
} from '../guard/type'

// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type FromRest<T extends TSchema[]> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? [KeyOfPropertyKeys<L>, ...FromRest<R>]
    : []
)
// prettier-ignore
function FromRest<T extends TSchema[]>(T: [...T]): FromRest<T> {
  const [L, ...R] = T
  return (
    T.length > 0
      ? [KeyOfPropertyKeys(L), ...FromRest(R)]
      : []
  ) as FromRest<T>
}
// ------------------------------------------------------------------
// FromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type FromIntersect<T extends TSchema[], C extends PropertyKey[][] = FromRest<T>> = (
  OperatorUnionMany<C>
)
// prettier-ignore
function FromIntersect<T extends TSchema[]>(T: [...T], C = FromRest(T)): FromIntersect<T> {
  return (
    OperatorUnionMany(C as PropertyKey[][]) as FromIntersect<T>
  )
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type FromUnion<T extends TSchema[], C extends PropertyKey[][] = FromRest<T>> = (
  OperatorIntersectMany<C>
)
// prettier-ignore
function FromUnion<T extends TSchema[]>(T: [...T]): FromUnion<T> {
  const C = FromRest(T) as PropertyKey[][]
  return (
    OperatorIntersectMany(C) as FromUnion<T>
  )
}
// ------------------------------------------------------------------
// FromTuple
// ------------------------------------------------------------------
// prettier-ignore
type FromTuple<T extends TSchema[], I extends string = ZeroString> = 
  T extends [infer _ extends TSchema, ...infer R extends TSchema[]]
    ? [I, ...FromTuple<R, Increment<I>>]
    : []
// prettier-ignore
function FromTuple<T extends TSchema[]>(T: [...T], I = '0'): FromTuple<T> {
  const [_, ...R] = T
  return (
    T.length > 0
      ? [I, ...FromTuple(R, Increment(I))]
      : []
  ) as FromTuple<T>
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
// prettier-ignore
type FromArray<_ extends TSchema> = (
  ['[number]']
)
// prettier-ignore
function FromArray<_ extends TSchema>(_: _): FromArray<_> {
  return (
    ['[number]']
  )
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type FromProperties<T extends TProperties> = (
  UnionToTuple<keyof T>
)
// prettier-ignore
function FromProperties<T extends TProperties>(T: T): FromProperties<T> {
  return (
    globalThis.Object.getOwnPropertyNames(T)
  ) as FromProperties<T>
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
export type KeyOfPropertyKeys<T extends TSchema> = (
  T extends TRecursive<infer S> ? KeyOfPropertyKeys<S> :
  T extends TIntersect<infer S> ? FromIntersect<S> :
  T extends TUnion<infer S> ? FromUnion<S> :
  T extends TTuple<infer S> ? FromTuple<S> :
  T extends TArray<infer S> ? FromArray<S> :
  T extends TObject<infer S> ? FromProperties<S> :
  []
)
/** Returns a tuple of PropertyKeys derived from the given TSchema. */
// prettier-ignore
export function KeyOfPropertyKeys<T extends TSchema>(T: T): KeyOfPropertyKeys<T> {
  return (
    IsIntersectType(T) ? FromIntersect(T.allOf) :
    IsUnionType(T) ? FromUnion(T.anyOf) :
    IsTupleType(T) ? FromTuple(T.items ?? []) :
    IsArrayType(T) ? FromArray(T.items) :
    IsObjectType(T) ? FromProperties(T.properties) :
    IsRecordType(T) ? FromPatternProperties(T.patternProperties) :
    []
  ) as KeyOfPropertyKeys<T>
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
