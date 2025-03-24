/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { CreateType } from '../create/type'
import { Kind, Hint } from '../symbols/index'
import type { TSchema } from '../schema/index'
import type { Static } from '../static/index'
import type { Evaluate, Ensure, Assert } from '../helpers/index'
import { type TAny } from '../any/index'
import { type TBoolean } from '../boolean/index'
import { type TEnumRecord, type TEnum } from '../enum/index'
import { type TInteger } from '../integer/index'
import { type TLiteral, type TLiteralValue } from '../literal/index'
import { type TNever, Never } from '../never/index'
import { type TNumber, Number } from '../number/index'
import { type TObject, type TProperties, type TAdditionalProperties, type ObjectOptions, Object } from '../object/index'
import { type TRegExp } from '../regexp/index'
import { type TString, String } from '../string/index'
import { type TUnion, Union } from '../union/index'

import { IsTemplateLiteralFinite, TIsTemplateLiteralFinite, type TTemplateLiteral } from '../template-literal/index'
import { PatternStringExact, PatternNumberExact, PatternNeverExact } from '../patterns/index'
import { IndexPropertyKeys } from '../indexed/index'

// ------------------------------------------------------------------
// ValueGuard
// ------------------------------------------------------------------
import { IsUndefined } from '../guard/value'
// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsInteger, IsLiteral, IsAny, IsBoolean, IsNever, IsNumber, IsString, IsRegExp, IsTemplateLiteral, IsUnion, IsRef, IsComputed } from '../guard/kind'

// ------------------------------------------------------------------
// RecordCreateFromPattern
// ------------------------------------------------------------------
// prettier-ignore
function RecordCreateFromPattern(pattern: string, T: TSchema, options: ObjectOptions): TRecord<TSchema, TSchema> {
  return CreateType({ [Kind]: 'Record', type: 'object', patternProperties: { [pattern]: T } }, options) as never
}
// ------------------------------------------------------------------
// RecordCreateFromKeys
// ------------------------------------------------------------------
// prettier-ignore
function RecordCreateFromKeys(K: string[], T: TSchema, options: ObjectOptions): TObject<TProperties> {
  const result = {} as TProperties
  for(const K2 of K) result[K2] = T
  return Object(result, { ...options, [Hint]: 'Record' })
}
// ------------------------------------------------------------------
// FromTemplateLiteralKey (Fast Inference)
// ------------------------------------------------------------------
// prettier-ignore
type TFromTemplateLiteralKeyInfinite<Key extends TTemplateLiteral, Type extends TSchema> = Ensure<TRecord<Key, Type>>
// prettier-ignore
type TFromTemplateLiteralKeyFinite<Key extends TTemplateLiteral, Type extends TSchema, I extends string = Static<Key>> = (
  Ensure<TObject<Evaluate<{ [_ in I]: Type }>>>
)
// prettier-ignore
type TFromTemplateLiteralKey<Key extends TTemplateLiteral, Type extends TSchema> = TIsTemplateLiteralFinite<Key> extends false
  ? TFromTemplateLiteralKeyInfinite<Key, Type>
  : TFromTemplateLiteralKeyFinite<Key, Type>
// prettier-ignore
function FromTemplateLiteralKey<Key extends TTemplateLiteral, Type extends TSchema>(K: Key, T: Type, options: ObjectOptions): TFromTemplateLiteralKey<Key, Type> {
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
type TFromEnumKey<Key extends Record<string, string | number>, Type extends TSchema> = Ensure<TObject<{ [_ in Key[keyof Key]]: Type }>>
// ------------------------------------------------------------------
// FromUnionKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnionKeyLiteralString<Key extends TLiteral<string>, Type extends TSchema> = { [_ in Key['const']]: Type }
// prettier-ignore
type TFromUnionKeyLiteralNumber<Key extends TLiteral<number>, Type extends TSchema> = { [_ in Key['const']]: Type }
// prettier-ignore
type TFromUnionKeyVariants<Keys extends TSchema[], Type extends TSchema, Result extends TProperties = {}> = 
  Keys extends [infer Left extends TSchema, ...infer Right extends TSchema[]] ? (
    Left extends TUnion<infer Types extends TSchema[]> ? TFromUnionKeyVariants<Right, Type, Result & TFromUnionKeyVariants<Types, Type>> :
    Left extends TLiteral<string> ? TFromUnionKeyVariants<Right, Type, Result & TFromUnionKeyLiteralString<Left, Type>> :
    Left extends TLiteral<number> ? TFromUnionKeyVariants<Right, Type, Result & TFromUnionKeyLiteralNumber<Left, Type>> :
  {}) : Result
// prettier-ignore
type TFromUnionKey<Key extends TSchema[], Type extends TSchema, Properties extends TProperties = TFromUnionKeyVariants<Key, Type>> = (
  Ensure<TObject<Evaluate<Properties>>>
)
// prettier-ignore
function FromUnionKey<Key extends TSchema[], Type extends TSchema>(key: Key, type: Type, options: ObjectOptions): TFromUnionKey<Key, Type> {
  return RecordCreateFromKeys(IndexPropertyKeys(Union(key)), type, options) as never
}
// ------------------------------------------------------------------
// FromLiteralKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromLiteralKey<Key extends TLiteralValue, Type extends TSchema> = (
  Ensure<TObject<{ [_ in Assert<Key, PropertyKey>]: Type }>>
)
// prettier-ignore
function FromLiteralKey<Key extends TLiteralValue, Type extends TSchema>(key: Key, type: Type, options: ObjectOptions): TFromLiteralKey<Key, Type> {
  return RecordCreateFromKeys([(key as string).toString()], type, options) as never
}
// ------------------------------------------------------------------
// TFromRegExpKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromRegExpKey<_Key extends TRegExp, Type extends TSchema> = (
  Ensure<TRecord<TRegExp, Type>>
)
// prettier-ignore
function FromRegExpKey<Key extends TRegExp, Type extends TSchema>(key: Key, type: Type, options: ObjectOptions): TFromRegExpKey<Key, Type> {
  return RecordCreateFromPattern(key.source, type, options) as never
}
// ------------------------------------------------------------------
// FromStringKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromStringKey<_Key extends TString, Type extends TSchema> = (
  Ensure<TRecord<TString, Type>>
)
// prettier-ignore
function FromStringKey<Key extends TString, Type extends TSchema>(key: Key, type: Type, options: ObjectOptions): TFromStringKey<Key, Type> {
  const pattern = IsUndefined(key.pattern) ? PatternStringExact : key.pattern
  return RecordCreateFromPattern(pattern, type, options) as never
}
// ------------------------------------------------------------------
// FromAnyKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromAnyKey<_Key extends TAny, Type extends TSchema> = (
  Ensure<TRecord<TAny, Type>>
)
// prettier-ignore
function FromAnyKey<Key extends TAny, Type extends TSchema>(_: Key, type: Type, options: ObjectOptions): TFromAnyKey<Key, Type> {
  return RecordCreateFromPattern(PatternStringExact, type, options) as never
}
// ------------------------------------------------------------------
// FromNeverKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromNeverKey<_Key extends TNever, Type extends TSchema> = (
  Ensure<TRecord<TNever, Type>>
)
// prettier-ignore
function FromNeverKey<Key extends TNever, Type extends TSchema>(_key: Key, type: Type, options: ObjectOptions): TFromNeverKey<Key, Type> {
  return RecordCreateFromPattern(PatternNeverExact, type, options) as never
}
// ------------------------------------------------------------------
// TromBooleanKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromBooleanKey<_Key extends TBoolean, Type extends TSchema> = (
  Ensure<TObject<{ true: Type, false: Type }>>
)
// prettier-ignore
function FromBooleanKey<Key extends TBoolean, Type extends TSchema>(_key: Key, type: Type, options: ObjectOptions): TFromBooleanKey<Key, Type> {
  return Object({ true: type, false: type }, options)
}
// ------------------------------------------------------------------
// FromIntegerKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntegerKey<_Key extends TSchema, Type extends TSchema> = (
  Ensure<TRecord<TNumber, Type>>
)
// prettier-ignore
function FromIntegerKey<Key extends TInteger, Type extends TSchema>(_key: Key, type: Type, options: ObjectOptions): TFromIntegerKey<Key, Type> {
  return RecordCreateFromPattern(PatternNumberExact, type, options) as never
}
// ------------------------------------------------------------------
// FromNumberKey
// ------------------------------------------------------------------
// prettier-ignore
type TFromNumberKey<_Key extends TSchema, Type extends TSchema> = (
  Ensure<TRecord<TNumber, Type>>
)
// prettier-ignore
function FromNumberKey<Key extends TNumber, Type extends TSchema>(_: Key, type: Type, options: ObjectOptions): TFromNumberKey<Key, Type> {
  return RecordCreateFromPattern(PatternNumberExact, type, options) as never
}
// ------------------------------------------------------------------
// TRecord
// ------------------------------------------------------------------
// prettier-ignore
type RecordStatic<Key extends TSchema, Type extends TSchema, P extends unknown[]> = (
  // Note: We would return a Record<K, T> here, but recursive Record<K, T> types will
  // break when T is self recursive. We can mitigate this by using a Mapped instead.
  Evaluate<{ [_ in Assert<Static<Key>, PropertyKey>]: Static<Type, P> }>
)
// prettier-ignore
export interface TRecord<Key extends TSchema = TSchema, Type extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Record'
  static: RecordStatic<Key, Type, this['params']>
  type: 'object'
  patternProperties: { [pattern: string]: Type }
  additionalProperties: TAdditionalProperties
}
// ------------------------------------------------------------------
// TRecordOrObject
// ------------------------------------------------------------------
// prettier-ignore
export type TRecordOrObject<Key extends TSchema, Type extends TSchema> = (
  Key extends TTemplateLiteral ? TFromTemplateLiteralKey<Key, Type> :  
  Key extends TEnum<infer Enum extends TEnumRecord> ? TFromEnumKey<Enum, Type> : // (Special: Ensure resolve Enum before Union)
  Key extends TUnion<infer Types extends TSchema[]> ? TFromUnionKey<Types, Type> :
  Key extends TLiteral<infer Value extends TLiteralValue> ? TFromLiteralKey<Value, Type> :
  Key extends TBoolean ? TFromBooleanKey<Key, Type> :
  Key extends TInteger ? TFromIntegerKey<Key, Type> :
  Key extends TNumber ? TFromNumberKey<Key, Type> :
  Key extends TRegExp ? TFromRegExpKey<Key, Type> :
  Key extends TString ? TFromStringKey<Key, Type> :
  Key extends TAny ? TFromAnyKey<Key, Type> :
  Key extends TNever ? TFromNeverKey<Key, Type> :
  TNever
)
// ------------------------------------------------------------------
// TRecordOrObject
// ------------------------------------------------------------------
/** `[Json]` Creates a Record type */
export function Record<Key extends TSchema, Type extends TSchema>(key: Key, type: Type, options: ObjectOptions = {}): TRecordOrObject<Key, Type> {
  // prettier-ignore
  return (
    IsUnion(key) ? FromUnionKey(key.anyOf, type, options) :
    IsTemplateLiteral(key) ? FromTemplateLiteralKey(key, type, options) :
    IsLiteral(key) ? FromLiteralKey(key.const, type, options) :
    IsBoolean(key) ?  FromBooleanKey(key, type, options) :
    IsInteger(key) ? FromIntegerKey(key, type, options) :
    IsNumber(key) ? FromNumberKey(key, type, options) :
    IsRegExp(key) ? FromRegExpKey(key, type, options) :
    IsString(key) ? FromStringKey(key, type, options) :
    IsAny(key) ? FromAnyKey(key, type, options) :
    IsNever(key) ? FromNeverKey(key, type, options) :
    Never(options)
  ) as never
}

// ------------------------------------------------------------------
// Record Utilities
// ------------------------------------------------------------------
/** Gets the Records Pattern */
export function RecordPattern(record: TRecord): string {
  return globalThis.Object.getOwnPropertyNames(record.patternProperties)[0]
}
// ------------------------------------------------------------------
// RecordKey
// ------------------------------------------------------------------
/** Gets the Records Key Type */
// prettier-ignore
export type TRecordKey<Type extends TRecord,
  Result extends TSchema = Type extends TRecord<infer Key extends TSchema, TSchema> ? (
    Key extends TNumber ? TNumber :
    Key extends TString ? TString :
    TString
  ) : TString
> = Result
/** Gets the Records Key Type */
// prettier-ignore
export function RecordKey<Type extends TRecord>(type: Type): TRecordKey<Type> {
  const pattern = RecordPattern(type)
  return (
    pattern === PatternStringExact ? String() :
    pattern === PatternNumberExact ? Number() :
    String({ pattern })
  ) as never
}
// ------------------------------------------------------------------
// RecordValue
// ------------------------------------------------------------------
/** Gets a Record Value Type */
// prettier-ignore
export type TRecordValue<Type extends TRecord,
  Result extends TSchema = (
    Type extends TRecord<TSchema, infer Value extends TSchema> 
      ? Value 
      : TNever
    )
> = Result
/** Gets a Record Value Type */
// prettier-ignore
export function RecordValue<Type extends TRecord>(type: Type): TRecordValue<Type> {
  return type.patternProperties[RecordPattern(type)] as never
}
