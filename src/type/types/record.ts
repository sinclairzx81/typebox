/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

// deno-fmt-ignore-file

import { Memory } from '../../system/memory/index.ts'
import { Guard } from '../../guard/index.ts'
import { type TSchema, type TObjectOptions, IsKind } from './schema.ts'
import { type StaticType, type StaticDirection } from './static.ts'
import { type TProperties } from './properties.ts'
import { type TInteger, Integer, IntegerPattern } from './integer.ts'
import { type TNumber, Number, NumberPattern } from './number.ts'
import { type TString, String, StringPattern } from './string.ts'
import { type TDeferred, Deferred } from './deferred.ts'

import { type TInstantiate, Instantiate } from '../engine/instantiate.ts'
import { type TTemplateLiteralStatic } from '../engine/template-literal/index.ts'
import { CreateRecord } from '../engine/record/record-create.ts'

// -------------------------------------------------------------------
// Static
// -------------------------------------------------------------------
type StaticPropertyKey<Key extends string, Result extends PropertyKey = (
  Key extends TStringKey ? string :
  Key extends TIntegerKey ? number :
  Key extends TNumberKey ? number :
  Key extends `^${string}$` ? TTemplateLiteralStatic<Key> : 
  string
)> = Result
export type StaticRecord<Stack extends string[], Direction extends StaticDirection, Context extends TProperties, This extends TProperties, Key extends string, Value extends TSchema, 
  StaticKey extends PropertyKey = StaticPropertyKey<Key>,  
  StaticValue extends unknown = StaticType<Stack, Direction, Context, This, Value>,
> = Record<StaticKey, StaticValue>
// -------------------------------------------------------------------
// Keys
// -------------------------------------------------------------------
export type TStringKey = typeof StringKey
export type TIntegerKey = typeof IntegerKey
export type TNumberKey = typeof NumberKey

export const IntegerKey = `^${IntegerPattern}$`
export const NumberKey = `^${NumberPattern}$`
export const StringKey = `^${StringPattern}$`

// -------------------------------------------------------------------
// Type
// -------------------------------------------------------------------
export interface TRecord<Key extends string = string, Value extends TSchema = TSchema> extends TSchema {
  '~kind': 'Record'
  type: 'object',
  patternProperties: { [_ in Key]: Value }
}
// -------------------------------------------------------------------
// Deferred
// -------------------------------------------------------------------
/** Represents a deferred Record action. */
export type TRecordDeferred<Key extends TSchema, Value extends TSchema> = (
  TDeferred<'Record', [Key, Value]>
)
/** Represents a deferred Record action. */
export function RecordDeferred<Key extends TSchema, Value extends TSchema>(key: Key, value: Value, options: TObjectOptions = {}): TRecordDeferred<Key, Value> {
  return Deferred('Record', [key, value], options)
}
// -------------------------------------------------------------------
// Construct
// -------------------------------------------------------------------
export type TRecordConstruct<Key extends TSchema, Value extends TSchema> = (
  TInstantiate<{}, TRecordDeferred<Key, Value>>
)
export function RecordConstruct<Key extends TSchema, Value extends TSchema>(key: Key, value: Value, options: TObjectOptions = {}): TRecordConstruct<Key, Value> {
  return Instantiate({}, RecordDeferred(key, value, options)) as never
}
// -------------------------------------------------------------------
// Factory
// -------------------------------------------------------------------
/** Creates a Record type. */
export function Record<Key extends TSchema, Value extends TSchema>(key: Key, value: Value, options: TObjectOptions = {}): TRecordConstruct<Key, Value> {
  return RecordConstruct(key, value, options) as never
}
// -------------------------------------------------------------------
// FromPattern
// -------------------------------------------------------------------
/** Creates a Record type from regular expression pattern. */
export function RecordFromPattern<Pattern extends string, Value extends TSchema>(key: Pattern, value: Value) {
  return CreateRecord(key, value)
}
// -------------------------------------------------------------------
// RecordPattern
// -------------------------------------------------------------------
/** Returns the raw string pattern used for the Record key  */
export type TRecordPattern<Type extends TRecord,
  Result extends string = Extract<keyof Type['patternProperties'], string>
> = Result
/** Returns the raw string pattern used for the Record key  */
export function RecordPattern<Type extends TRecord>(type: Type): TRecordPattern<Type> {
  return Guard.Keys(type.patternProperties)[0] as never
}
// -------------------------------------------------------------------
// RecordKey
// -------------------------------------------------------------------
/** Returns the Record key as a TypeBox type  */
export type TRecordKey<Type extends TRecord,
  Pattern extends string = TRecordPattern<Type>,
  Result extends TSchema = (
    Pattern extends typeof IntegerKey ? TInteger :
    Pattern extends typeof NumberKey ? TNumber :
    TString
  )
> = Result
/** Returns the Record key as a TypeBox type  */
export function RecordKey<Type extends TRecord>(type: Type): TRecordKey<Type> {
  const pattern = RecordPattern(type)
  const result = (
    Guard.IsEqual(pattern, IntegerKey) ? Integer() :
    Guard.IsEqual(pattern, NumberKey) ? Number() :
    String()
  )
  return result as never
}
// -------------------------------------------------------------------
// RecordValue
// -------------------------------------------------------------------
export type TRecordValue<Type extends TRecord,
  Result extends TSchema = Type['patternProperties'][TRecordPattern<Type>]
> = Result
export function RecordValue<Type extends TRecord>(type: Type): TRecordValue<Type> {
  return type.patternProperties[RecordPattern(type)] as never
}
// -------------------------------------------------------------------
// Guard
// -------------------------------------------------------------------
export function IsRecord(value: unknown): value is TRecord {
  return IsKind(value, 'Record')
}
// -------------------------------------------------------------------
// Options
// -------------------------------------------------------------------
export function RecordOptions(type: TRecord): TObjectOptions {
  return Memory.Discard(type, ['~kind', 'type', 'patternProperties'])
}