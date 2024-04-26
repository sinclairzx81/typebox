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
import type { Static } from '../static/index'
import type { Evaluate, Ensure, Assert } from '../helpers/index'
import { Object, type TObject, type TProperties, type TAdditionalProperties, type ObjectOptions } from '../object/index'
import { type TLiteral, type TLiteralValue } from '../literal/index'
import { Never, type TNever } from '../never/index'
import { Union, type TUnion } from '../union/index'
import { type TRegExp } from '../regexp/index'
import { type TString } from '../string/index'
import { type TInteger } from '../integer/index'
import { type TNumber } from '../number/index'
import { type TEnum } from '../enum/index'

import { IsTemplateLiteralFinite, TIsTemplateLiteralFinite, type TTemplateLiteral } from '../template-literal/index'
import { PatternStringExact, PatternNumberExact } from '../patterns/index'
import { IndexPropertyKeys } from '../indexed/index'
import { Kind, Hint } from '../symbols/index'
import { CloneType } from '../clone/type'
// ------------------------------------------------------------------
// ValueGuard
// ------------------------------------------------------------------
import { IsUndefined } from '../guard/value'
// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsInteger, IsLiteral, IsNumber, IsString, IsRegExp, IsTemplateLiteral, IsUnion } from '../guard/kind'
// ------------------------------------------------------------------
// RecordCreateFromPattern
// ------------------------------------------------------------------
// prettier-ignore
function RecordCreateFromPattern(pattern: string, T: TSchema, options: ObjectOptions): TRecord<TSchema, TSchema> {
  return { 
    ...options, 
    [Kind]: 'Record', 
    type: 'object', 
    patternProperties: { [pattern]: CloneType(T) } 
  } as never
}
// ------------------------------------------------------------------
// RecordCreateFromKeys
// ------------------------------------------------------------------
// prettier-ignore
function RecordCreateFromKeys(K: string[], T: TSchema, options: ObjectOptions): TObject<TProperties> {
  const Acc = {} as TProperties
  for(const K2 of K) Acc[K2] = CloneType(T)
  return Object(Acc, { ...options, [Hint]: 'Record' })
}
// ------------------------------------------------------------------
// FromTemplateLiteralKey (Fast Inference)
// ------------------------------------------------------------------
// prettier-ignore
type TFromTemplateLiteralKeyInfinite<K extends TTemplateLiteral, T extends TSchema> = Ensure<TRecord<K, T>>
// prettier-ignore
type TFromTemplateLiteralKeyFinite<K extends TTemplateLiteral, T extends TSchema, I extends string = Static<K>> = (
  Ensure<TObject<Evaluate<{ [_ in I]: T }>>>
)
// prettier-ignore
type TFromTemplateLiteralKey<K extends TTemplateLiteral, T extends TSchema> = TIsTemplateLiteralFinite<K> extends false
  ? TFromTemplateLiteralKeyInfinite<K, T>
  : TFromTemplateLiteralKeyFinite<K, T>
// prettier-ignore
function FromTemplateLiteralKey<K extends TTemplateLiteral, T extends TSchema>(K: K, T: T, options: ObjectOptions): TFromTemplateLiteralKey<K, T> {
  return (
    IsTemplateLiteralFinite(K)
      ? RecordCreateFromKeys(IndexPropertyKeys(K), T, options)
      : RecordCreateFromPattern(K.pattern, T, options)
  ) as never
}
// ------------------------------------------------------------------
// FromEnumKey (Special Case)
// ------------------------------------------------------------------
// prettier-ignore
type TFromEnumKey<K extends Record<string, string | number>, T extends TSchema> = Ensure<TObject<{ [_ in K[keyof K]]: T }>>
// ------------------------------------------------------------------
// FromUnionKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnionKeyLiteralString<K extends TLiteral<string>, T extends TSchema> = { [_ in K['const']]: T }
// prettier-ignore
type TFromUnionKeyLiteralNumber<K extends TLiteral<number>, T extends TSchema> = { [_ in K['const']]: T }
// prettier-ignore
type TFromUnionKeyRest<K extends TSchema[], T extends TSchema> = 
  K extends [infer L extends TSchema, ...infer R extends TSchema[]] ? (
    L extends TUnion<infer S> ? TFromUnionKeyRest<S, T> & TFromUnionKeyRest<R, T> :
    L extends TLiteral<string> ? TFromUnionKeyLiteralString<L, T> & TFromUnionKeyRest<R, T> :
    L extends TLiteral<number> ? TFromUnionKeyLiteralNumber<L, T> & TFromUnionKeyRest<R, T> :
  {}) : {}
// prettier-ignore
type TFromUnionKey<K extends TSchema[], T extends TSchema, P extends TProperties = TFromUnionKeyRest<K, T>> = (
  Ensure<TObject<Evaluate<P>>>
)
// prettier-ignore
function FromUnionKey<K extends TSchema[], T extends TSchema>(K: K, T: T, options: ObjectOptions): TFromUnionKey<K, T> {
  return RecordCreateFromKeys(IndexPropertyKeys(Union(K)), T, options) as never
}
// ------------------------------------------------------------------
// FromLiteralKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromLiteralKey<K extends TLiteralValue, T extends TSchema> = (
  Ensure<TObject<{ [_ in Assert<K, PropertyKey>]: T }>>
)
// prettier-ignore
function FromLiteralKey<K extends TLiteralValue, T extends TSchema>(K: K, T: T, options: ObjectOptions): TFromLiteralKey<K, T> {
  return RecordCreateFromKeys([(K as string).toString()], T, options) as never
}
// ------------------------------------------------------------------
// TFromRegExpKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromRegExpKey<_ extends TRegExp, T extends TSchema> = (
  Ensure<TRecord<TRegExp, T>>
)
// prettier-ignore
function FromRegExpKey<K extends TRegExp, T extends TSchema>(K: K, T: T, options: ObjectOptions): TFromRegExpKey<K, T> {
  return RecordCreateFromPattern(K.source, T, options) as never
}
// ------------------------------------------------------------------
// FromStringKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromStringKey<_ extends TString, T extends TSchema> = (
  Ensure<TRecord<TString, T>>
)
// prettier-ignore
function FromStringKey<K extends TString, T extends TSchema>(K: K, T: T, options: ObjectOptions): TFromStringKey<K, T> {
  const pattern = IsUndefined(K.pattern) ? PatternStringExact : K.pattern
  return RecordCreateFromPattern(pattern, T, options) as never
}
// ------------------------------------------------------------------
// FromIntegerKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntegerKey<_ extends TSchema, T extends TSchema> = (
  Ensure<TRecord<TNumber, T>>
)
// prettier-ignore
function FromIntegerKey<K extends TInteger, T extends TSchema>(_: K, T: T, options: ObjectOptions): TFromIntegerKey<K, T> {
  return RecordCreateFromPattern(PatternNumberExact, T, options) as never
}
// ------------------------------------------------------------------
// FromNumberKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromNumberKey<_ extends TSchema, T extends TSchema> = (
  Ensure<TRecord<TNumber, T>>
)
// prettier-ignore
function FromNumberKey<K extends TNumber, T extends TSchema>(_: K, T: T, options: ObjectOptions): TFromNumberKey<K, T> {
  return RecordCreateFromPattern(PatternNumberExact, T, options) as never
}
// ------------------------------------------------------------------
// TRecord
// ------------------------------------------------------------------
// prettier-ignore
type RecordStatic<K extends TSchema, T extends TSchema, P extends unknown[]> = (
  Evaluate<{ [_ in Assert<Static<K>, PropertyKey>]: Static<T, P>; }>
)
// prettier-ignore
export interface TRecord<K extends TSchema = TSchema, T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Record'
  static: RecordStatic<K, T, this['params']>
  type: 'object'
  patternProperties: { [pattern: string]: T }
  additionalProperties: TAdditionalProperties
}
// ------------------------------------------------------------------
// TRecordOrObject
// ------------------------------------------------------------------
// prettier-ignore
export type TRecordOrObject<K extends TSchema, T extends TSchema> =
  K extends TTemplateLiteral ? TFromTemplateLiteralKey<K, T> :  
  K extends TEnum<infer S> ? TFromEnumKey<S, T> : // (Special: Ensure resolve Enum before Union)
  K extends TUnion<infer S> ? TFromUnionKey<S, T> :
  K extends TLiteral<infer S> ? TFromLiteralKey<S, T> :
  K extends TInteger ? TFromIntegerKey<K, T> :
  K extends TNumber ? TFromNumberKey<K, T> :
  K extends TRegExp ? TFromRegExpKey<K, T> :
  K extends TString ? TFromStringKey<K, T> :
  TNever
// ------------------------------------------------------------------
// TRecordOrObject
// ------------------------------------------------------------------
/** `[Json]` Creates a Record type */
export function Record<K extends TSchema, T extends TSchema>(K: K, T: T, options: ObjectOptions = {}): TRecordOrObject<K, T> {
  // prettier-ignore
  return (
    IsUnion(K) ? FromUnionKey(K.anyOf, T, options) :
    IsTemplateLiteral(K) ? FromTemplateLiteralKey(K, T, options) :
    IsLiteral(K) ? FromLiteralKey(K.const, T, options) :
    IsInteger(K) ? FromIntegerKey(K, T, options) :
    IsNumber(K) ? FromNumberKey(K, T, options) :
    IsRegExp(K) ? FromRegExpKey(K, T, options) :
    IsString(K) ? FromStringKey(K, T, options) :
    Never(options)
  ) as never
}
