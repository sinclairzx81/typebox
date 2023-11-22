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
import type { Static } from '../static/index'
import type { Evaluate, Ensure, Assert } from '../helpers/index'
import { type TObject, type TProperties, type TAdditionalProperties, type ObjectOptions, Object } from '../object/index'
import { type TLiteral, TLiteralValue } from '../literal/index'
import { type TNever, Never } from '../never/index'
import { type TUnion, Union } from '../union/index'
import { type TString } from '../string/index'
import { type TInteger } from '../integer/index'
import { type TNumber } from '../number/index'
import { type TEnum } from '../enum/index'

import { TTemplateLiteral, IsTemplateLiteralFinite, TemplateLiteralParseExact } from '../template-literal/index'
import { PatternStringExact, PatternNumberExact } from '../patterns/index'
import { IndexPropertyKeys } from '../indexed/index'
import { Kind, Hint } from '../symbols/index'
import { CloneType } from '../clone/type'
import { IsUndefined } from '../guard/value'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  TInteger as IsIntegerType, 
  TLiteral as IsLiteralType, 
  TNumber as IsNumberType,
  TString as IsStringType,
  TTemplateLiteral as IsTemplateLiteralType, 
  TUnion as IsUnionType, 
} from '../guard/type'

// ------------------------------------------------------------------
// FromPattern
// ------------------------------------------------------------------
// prettier-ignore
function FromPattern(pattern: string, T: TSchema) {
  return { [Kind]: 'Record', type: 'object', patternProperties: { [pattern]: CloneType(T) } }
}
// ------------------------------------------------------------------
// FromKeys
// ------------------------------------------------------------------
// prettier-ignore
function FromKeys(keys: string[], T: TSchema) {
  const properties = keys.reduce((acc, key) => ({ ...acc, [key]: CloneType(T) }), {} as TProperties)
  return Object(properties, { [Hint]: 'Record' })
}
// ------------------------------------------------------------------
// FromTemplateLiteralKey (Fast Inference)
// ------------------------------------------------------------------
// prettier-ignore
type FromTemplateLiteralKeyInfinite<K extends TTemplateLiteral, T extends TSchema> = Ensure<TRecord<K, T>>
// prettier-ignore
type FromTemplateLiteralKeyFinite<K extends TTemplateLiteral, T extends TSchema, I extends string = Static<K>> = (
  Ensure<TObject<Evaluate<{ [_ in I]: T }>>>
)
// prettier-ignore
type FromTemplateLiteralKey<K extends TTemplateLiteral, T extends TSchema> = IsTemplateLiteralFinite<K> extends false
  ? FromTemplateLiteralKeyInfinite<K, T>
  : FromTemplateLiteralKeyFinite<K, T>
// prettier-ignore
function FromTemplateLiteralKey<K extends TTemplateLiteral, T extends TSchema>(K: K, T: T): FromTemplateLiteralKey<K, T> {
  const expression = TemplateLiteralParseExact(K.pattern)
  return (
    IsTemplateLiteralFinite(expression)
      ? FromKeys(IndexPropertyKeys(K), T)
      : FromPattern(K.pattern, T)
  ) as FromTemplateLiteralKey<K, T>
}
// ------------------------------------------------------------------
// FromEnumKey (Special Case)
// ------------------------------------------------------------------
// prettier-ignore
type FromEnumKey<K extends Record<string, string | number>, T extends TSchema> = Ensure<TObject<{ [_ in K[keyof K]]: T }>>
// ------------------------------------------------------------------
// FromUnionKey
// ------------------------------------------------------------------
// prettier-ignore
type FromUnionKeyLiteralString<K extends TLiteral<string>, T extends TSchema> = { [_ in K['const']]: T }
// prettier-ignore
type FromUnionKeyLiteralNumber<K extends TLiteral<number>, T extends TSchema> = { [_ in K['const']]: T }
// prettier-ignore
type FromUnionKeyRest<K extends TSchema[], T extends TSchema> = 
  K extends [infer L extends TSchema, ...infer R extends TSchema[]] ? (
    L extends TUnion<infer S> ? FromUnionKeyRest<S, T> & FromUnionKeyRest<R, T> :
    L extends TLiteral<string> ? FromUnionKeyLiteralString<L, T> & FromUnionKeyRest<R, T> :
    L extends TLiteral<number> ? FromUnionKeyLiteralNumber<L, T> & FromUnionKeyRest<R, T> :
  {}) : {}
// prettier-ignore
type FromUnionKey<K extends TSchema[], T extends TSchema, P extends TProperties = FromUnionKeyRest<K, T>> = (
  Ensure<TObject<P>>
)
// prettier-ignore
function FromUnionKey<K extends TSchema[], T extends TSchema>(K: K, T: T): FromUnionKey<K, T> {
  return FromKeys(IndexPropertyKeys(Union(K)), T) as  FromUnionKey<K, T>
}
// ------------------------------------------------------------------
// FromLiteralKey
// ------------------------------------------------------------------
// prettier-ignore
type FromLiteralKey<K extends TLiteralValue, T extends TSchema> = (
  Ensure<TObject<{ [_ in Assert<K, PropertyKey>]: T }>>
)
// prettier-ignore
function FromLiteralKey<K extends TLiteralValue, T extends TSchema>(K: K, T: T): FromLiteralKey<K, T> {
  return FromKeys([(K as string).toString()], T) as FromLiteralKey<K, T>
}
// ------------------------------------------------------------------
// FromStringKey
// ------------------------------------------------------------------
// prettier-ignore
type FromStringKey<_ extends TString, T extends TSchema> = (
  Ensure<TRecord<TString, T>>
)
// prettier-ignore
function FromStringKey<K extends TString, T extends TSchema>(K: K, T: T): FromStringKey<K, T> {
  const pattern = IsUndefined(K.pattern) ? PatternStringExact : K.pattern
  return FromPattern(pattern, T) as FromStringKey<K, T>
}
// ------------------------------------------------------------------
// FromIntegerKey
// ------------------------------------------------------------------
// prettier-ignore
type FromIntegerKey<_ extends TSchema, T extends TSchema> = (
  Ensure<TRecord<TNumber, T>>
)
// prettier-ignore
function FromIntegerKey<K extends TInteger, T extends TSchema>(_: K, T: T): FromIntegerKey<K, T> {
  return FromPattern(PatternNumberExact, T) as FromIntegerKey<K, T>
}
// ------------------------------------------------------------------
// FromNumberKey
// ------------------------------------------------------------------
// prettier-ignore
type FromNumberKey<_ extends TSchema, T extends TSchema> = (
  Ensure<TRecord<TNumber, T>>
)
// prettier-ignore
function FromNumberKey<K extends TNumber, T extends TSchema>(_: K, T: T): FromIntegerKey<K, T> {
  return FromPattern(PatternNumberExact, T) as FromIntegerKey<K, T>
}
// ------------------------------------------------------------------
// RecordResolve
//
// Todo: Refactor this using the Union, Intersect pattern. This should
// be used for all factory types that return conditional types based
// on type parameters, in the Record case, the result will either be
// a TRecord (infinite keys) or TObject (finite keys)
//
// ------------------------------------------------------------------
// prettier-ignore
export type RecordResolve<K extends TSchema, T extends TSchema> =
  K extends TEnum<infer S> ? FromEnumKey<S, T> : // (Special: Ensure resolve Enum before Union)
  K extends TUnion<infer S> ? FromUnionKey<S, T> :
  K extends TTemplateLiteral ? FromTemplateLiteralKey<K, T> :
  K extends TLiteral<infer S> ? FromLiteralKey<S, T> :
  K extends TInteger ? FromIntegerKey<K, T> :
  K extends TNumber ? FromNumberKey<K, T> :
  K extends TString ? FromStringKey<K, T> :
  TNever
// prettier-ignore
function RecordResolve<K extends TSchema, T extends TSchema>(K: K, T: T): RecordResolve<K, T> {
  return (
    IsUnionType(K) ? FromUnionKey(K.anyOf, T) :
    IsTemplateLiteralType(K) ? FromTemplateLiteralKey(K, T) :
    IsLiteralType(K) ? FromLiteralKey(K.const, T) :
    IsStringType(K) ? FromStringKey(K, T) :
    IsIntegerType(K) ? FromIntegerKey(K, T) :
    IsNumberType(K) ? FromNumberKey(K, T) :
    Never()
  ) as unknown as RecordResolve<K, T>
}
// ------------------------------------------------------------------
// TRecord
// ------------------------------------------------------------------
// prettier-ignore
export interface TRecord<K extends TSchema = TSchema, T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Record'
  static: Record<Assert<Static<K>, string | number>, Static<T, this['params']>>
  type: 'object'
  patternProperties: { [pattern: string]: T }
  additionalProperties: TAdditionalProperties
}

// prettier-ignore
/** `[Json]` Creates a Record type */
export function Record<K extends TSchema, T extends TSchema>(K: K, T: T, options: ObjectOptions = {}): RecordResolve<K, T> {
  return CloneType(RecordResolve(K, T), options)
}
