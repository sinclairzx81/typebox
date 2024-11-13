/*--------------------------------------------------------------------------

@sinclair/typebox/errors

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

import { TypeSystemPolicy } from '../system/index'
import { KeyOfPattern } from '../type/keyof/index'
import { TypeRegistry, FormatRegistry } from '../type/registry/index'
import { ExtendsUndefinedCheck } from '../type/extends/extends-undefined'
import { GetErrorFunction } from './function'
import { TypeBoxError } from '../type/error/index'
import { Deref } from '../value/deref/index'
import { Hash } from '../value/hash/index'
import { Check } from '../value/check/index'
import { Kind } from '../type/symbols/index'

import type { TSchema } from '../type/schema/index'
import type { TAsyncIterator } from '../type/async-iterator/index'
import type { TAny } from '../type/any/index'
import type { TArray } from '../type/array/index'
import type { TBigInt } from '../type/bigint/index'
import type { TBoolean } from '../type/boolean/index'
import type { TDate } from '../type/date/index'
import type { TConstructor } from '../type/constructor/index'
import type { TFunction } from '../type/function/index'
import type { TImport } from '../type/module/index'
import type { TInteger } from '../type/integer/index'
import type { TIntersect } from '../type/intersect/index'
import type { TIterator } from '../type/iterator/index'
import type { TLiteral } from '../type/literal/index'
import { Never, type TNever } from '../type/never/index'
import type { TNot } from '../type/not/index'
import type { TNull } from '../type/null/index'
import type { TNumber } from '../type/number/index'
import type { TObject } from '../type/object/index'
import type { TPromise } from '../type/promise/index'
import type { TRecord } from '../type/record/index'
import type { TRef } from '../type/ref/index'
import type { TRegExp } from '../type/regexp/index'
import type { TTemplateLiteral } from '../type/template-literal/index'
import type { TThis } from '../type/recursive/index'
import type { TTuple } from '../type/tuple/index'
import type { TUnion } from '../type/union/index'
import type { TUnknown } from '../type/unknown/index'
import type { TString } from '../type/string/index'
import type { TSymbol } from '../type/symbol/index'
import type { TUndefined } from '../type/undefined/index'
import type { TUint8Array } from '../type/uint8array/index'
import type { TVoid } from '../type/void/index'
// ------------------------------------------------------------------
// ValueGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  IsArray, 
  IsUint8Array, 
  IsDate, 
  IsPromise, 
  IsFunction, 
  IsAsyncIterator, 
  IsIterator, 
  IsBoolean, 
  IsNumber, 
  IsBigInt, 
  IsString, 
  IsSymbol, 
  IsInteger, 
  IsNull, 
  IsUndefined 
} from '../value/guard/index'
// ------------------------------------------------------------------
// ValueErrorType
// ------------------------------------------------------------------
export enum ValueErrorType {
  ArrayContains,
  ArrayMaxContains,
  ArrayMaxItems,
  ArrayMinContains,
  ArrayMinItems,
  ArrayUniqueItems,
  Array,
  AsyncIterator,
  BigIntExclusiveMaximum,
  BigIntExclusiveMinimum,
  BigIntMaximum,
  BigIntMinimum,
  BigIntMultipleOf,
  BigInt,
  Boolean,
  DateExclusiveMaximumTimestamp,
  DateExclusiveMinimumTimestamp,
  DateMaximumTimestamp,
  DateMinimumTimestamp,
  DateMultipleOfTimestamp,
  Date,
  Function,
  IntegerExclusiveMaximum,
  IntegerExclusiveMinimum,
  IntegerMaximum,
  IntegerMinimum,
  IntegerMultipleOf,
  Integer,
  IntersectUnevaluatedProperties,
  Intersect,
  Iterator,
  Kind,
  Literal,
  Never,
  Not,
  Null,
  NumberExclusiveMaximum,
  NumberExclusiveMinimum,
  NumberMaximum,
  NumberMinimum,
  NumberMultipleOf,
  Number,
  ObjectAdditionalProperties,
  ObjectMaxProperties,
  ObjectMinProperties,
  ObjectRequiredProperty,
  Object,
  Promise,
  RegExp,
  StringFormatUnknown,
  StringFormat,
  StringMaxLength,
  StringMinLength,
  StringPattern,
  String,
  Symbol,
  TupleLength,
  Tuple,
  Uint8ArrayMaxByteLength,
  Uint8ArrayMinByteLength,
  Uint8Array,
  Undefined,
  Union,
  Void,
}
// ------------------------------------------------------------------
// ValueError
// ------------------------------------------------------------------
export interface ValueError {
  type: ValueErrorType
  schema: TSchema
  path: string
  value: unknown
  message: string
  errors: ValueErrorIterator[]
}
// ------------------------------------------------------------------
// ValueErrors
// ------------------------------------------------------------------
export class ValueErrorsUnknownTypeError extends TypeBoxError {
  constructor(public readonly schema: TSchema) {
    super('Unknown type')
  }
}
// ------------------------------------------------------------------
// EscapeKey
// ------------------------------------------------------------------
function EscapeKey(key: string): string {
  return key.replace(/~/g, '~0').replace(/\//g, '~1') // RFC6901 Path
}
// ------------------------------------------------------------------
// Guards
// ------------------------------------------------------------------
function IsDefined<T>(value: unknown): value is T {
  return value !== undefined
}
// ------------------------------------------------------------------
// ValueErrorIterator
// ------------------------------------------------------------------
export class ValueErrorIterator {
  constructor(private readonly iterator: IterableIterator<ValueError>) {}
  public [Symbol.iterator]() {
    return this.iterator
  }
  /** Returns the first value error or undefined if no errors */
  public First(): ValueError | undefined {
    const next = this.iterator.next()
    return next.done ? undefined : next.value
  }
}
// --------------------------------------------------------------------------
// Create
// --------------------------------------------------------------------------
function Create(errorType: ValueErrorType, schema: TSchema, path: string, value: unknown, errors: ValueErrorIterator[] = []): ValueError {
  return {
    type: errorType,
    schema,
    path,
    value,
    message: GetErrorFunction()({ errorType, path, schema, value, errors }),
    errors,
  }
}
// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
function* FromAny(schema: TAny, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {}
function* FromArray(schema: TArray, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsArray(value)) {
    return yield Create(ValueErrorType.Array, schema, path, value)
  }
  if (IsDefined<number>(schema.minItems) && !(value.length >= schema.minItems)) {
    yield Create(ValueErrorType.ArrayMinItems, schema, path, value)
  }
  if (IsDefined<number>(schema.maxItems) && !(value.length <= schema.maxItems)) {
    yield Create(ValueErrorType.ArrayMaxItems, schema, path, value)
  }
  for (let i = 0; i < value.length; i++) {
    yield* Visit(schema.items, references, `${path}/${i}`, value[i])
  }
  // prettier-ignore
  if (schema.uniqueItems === true && !((function () { const set = new Set(); for (const element of value) { const hashed = Hash(element); if (set.has(hashed)) { return false } else { set.add(hashed) } } return true })())) {
    yield Create(ValueErrorType.ArrayUniqueItems, schema, path, value)
  }
  // contains
  if (!(IsDefined(schema.contains) || IsDefined(schema.minContains) || IsDefined(schema.maxContains))) {
    return
  }
  const containsSchema = IsDefined<TSchema>(schema.contains) ? schema.contains : Never()
  const containsCount = value.reduce((acc: number, value, index) => (Visit(containsSchema, references, `${path}${index}`, value).next().done === true ? acc + 1 : acc), 0)
  if (containsCount === 0) {
    yield Create(ValueErrorType.ArrayContains, schema, path, value)
  }
  if (IsNumber(schema.minContains) && containsCount < schema.minContains) {
    yield Create(ValueErrorType.ArrayMinContains, schema, path, value)
  }
  if (IsNumber(schema.maxContains) && containsCount > schema.maxContains) {
    yield Create(ValueErrorType.ArrayMaxContains, schema, path, value)
  }
}
function* FromAsyncIterator(schema: TAsyncIterator, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsAsyncIterator(value)) yield Create(ValueErrorType.AsyncIterator, schema, path, value)
}
function* FromBigInt(schema: TBigInt, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsBigInt(value)) return yield Create(ValueErrorType.BigInt, schema, path, value)
  if (IsDefined<bigint>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    yield Create(ValueErrorType.BigIntExclusiveMaximum, schema, path, value)
  }
  if (IsDefined<bigint>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    yield Create(ValueErrorType.BigIntExclusiveMinimum, schema, path, value)
  }
  if (IsDefined<bigint>(schema.maximum) && !(value <= schema.maximum)) {
    yield Create(ValueErrorType.BigIntMaximum, schema, path, value)
  }
  if (IsDefined<bigint>(schema.minimum) && !(value >= schema.minimum)) {
    yield Create(ValueErrorType.BigIntMinimum, schema, path, value)
  }
  if (IsDefined<bigint>(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0))) {
    yield Create(ValueErrorType.BigIntMultipleOf, schema, path, value)
  }
}
function* FromBoolean(schema: TBoolean, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsBoolean(value)) yield Create(ValueErrorType.Boolean, schema, path, value)
}
function* FromConstructor(schema: TConstructor, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield* Visit(schema.returns, references, path, value.prototype)
}
function* FromDate(schema: TDate, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsDate(value)) return yield Create(ValueErrorType.Date, schema, path, value)
  if (IsDefined<number>(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) {
    yield Create(ValueErrorType.DateExclusiveMaximumTimestamp, schema, path, value)
  }
  if (IsDefined<number>(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) {
    yield Create(ValueErrorType.DateExclusiveMinimumTimestamp, schema, path, value)
  }
  if (IsDefined<number>(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) {
    yield Create(ValueErrorType.DateMaximumTimestamp, schema, path, value)
  }
  if (IsDefined<number>(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) {
    yield Create(ValueErrorType.DateMinimumTimestamp, schema, path, value)
  }
  if (IsDefined<number>(schema.multipleOfTimestamp) && !(value.getTime() % schema.multipleOfTimestamp === 0)) {
    yield Create(ValueErrorType.DateMultipleOfTimestamp, schema, path, value)
  }
}
function* FromFunction(schema: TFunction, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsFunction(value)) yield Create(ValueErrorType.Function, schema, path, value)
}
function* FromImport(schema: TImport, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  const definitions = globalThis.Object.values(schema.$defs) as TSchema[]
  const target = schema.$defs[schema.$ref] as TSchema
  yield* Visit(target, [...references, ...definitions], path, value)
}
function* FromInteger(schema: TInteger, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsInteger(value)) return yield Create(ValueErrorType.Integer, schema, path, value)
  if (IsDefined<number>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    yield Create(ValueErrorType.IntegerExclusiveMaximum, schema, path, value)
  }
  if (IsDefined<number>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    yield Create(ValueErrorType.IntegerExclusiveMinimum, schema, path, value)
  }
  if (IsDefined<number>(schema.maximum) && !(value <= schema.maximum)) {
    yield Create(ValueErrorType.IntegerMaximum, schema, path, value)
  }
  if (IsDefined<number>(schema.minimum) && !(value >= schema.minimum)) {
    yield Create(ValueErrorType.IntegerMinimum, schema, path, value)
  }
  if (IsDefined<number>(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    yield Create(ValueErrorType.IntegerMultipleOf, schema, path, value)
  }
}
function* FromIntersect(schema: TIntersect, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  let hasError = false
  for (const inner of schema.allOf) {
    for (const error of Visit(inner, references, path, value)) {
      hasError = true
      yield error
    }
  }
  if (hasError) {
    return yield Create(ValueErrorType.Intersect, schema, path, value)
  }
  if (schema.unevaluatedProperties === false) {
    const keyCheck = new RegExp(KeyOfPattern(schema))
    for (const valueKey of Object.getOwnPropertyNames(value)) {
      if (!keyCheck.test(valueKey)) {
        yield Create(ValueErrorType.IntersectUnevaluatedProperties, schema, `${path}/${valueKey}`, value)
      }
    }
  }
  if (typeof schema.unevaluatedProperties === 'object') {
    const keyCheck = new RegExp(KeyOfPattern(schema))
    for (const valueKey of Object.getOwnPropertyNames(value)) {
      if (!keyCheck.test(valueKey)) {
        const next = Visit(schema.unevaluatedProperties, references, `${path}/${valueKey}`, value[valueKey]).next()
        if (!next.done) yield next.value // yield interior
      }
    }
  }
}
function* FromIterator(schema: TIterator, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsIterator(value)) yield Create(ValueErrorType.Iterator, schema, path, value)
}
function* FromLiteral(schema: TLiteral, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!(value === schema.const)) yield Create(ValueErrorType.Literal, schema, path, value)
}
function* FromNever(schema: TNever, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield Create(ValueErrorType.Never, schema, path, value)
}
function* FromNot(schema: TNot, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (Visit(schema.not, references, path, value).next().done === true) yield Create(ValueErrorType.Not, schema, path, value)
}
function* FromNull(schema: TNull, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsNull(value)) yield Create(ValueErrorType.Null, schema, path, value)
}
function* FromNumber(schema: TNumber, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!TypeSystemPolicy.IsNumberLike(value)) return yield Create(ValueErrorType.Number, schema, path, value)
  if (IsDefined<number>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    yield Create(ValueErrorType.NumberExclusiveMaximum, schema, path, value)
  }
  if (IsDefined<number>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    yield Create(ValueErrorType.NumberExclusiveMinimum, schema, path, value)
  }
  if (IsDefined<number>(schema.maximum) && !(value <= schema.maximum)) {
    yield Create(ValueErrorType.NumberMaximum, schema, path, value)
  }
  if (IsDefined<number>(schema.minimum) && !(value >= schema.minimum)) {
    yield Create(ValueErrorType.NumberMinimum, schema, path, value)
  }
  if (IsDefined<number>(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    yield Create(ValueErrorType.NumberMultipleOf, schema, path, value)
  }
}
function* FromObject(schema: TObject, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!TypeSystemPolicy.IsObjectLike(value)) return yield Create(ValueErrorType.Object, schema, path, value)
  if (IsDefined<number>(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    yield Create(ValueErrorType.ObjectMinProperties, schema, path, value)
  }
  if (IsDefined<number>(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    yield Create(ValueErrorType.ObjectMaxProperties, schema, path, value)
  }
  const requiredKeys = Array.isArray(schema.required) ? schema.required : ([] as string[])
  const knownKeys = Object.getOwnPropertyNames(schema.properties)
  const unknownKeys = Object.getOwnPropertyNames(value)
  for (const requiredKey of requiredKeys) {
    if (unknownKeys.includes(requiredKey)) continue
    yield Create(ValueErrorType.ObjectRequiredProperty, schema.properties[requiredKey], `${path}/${EscapeKey(requiredKey)}`, undefined)
  }
  if (schema.additionalProperties === false) {
    for (const valueKey of unknownKeys) {
      if (!knownKeys.includes(valueKey)) {
        yield Create(ValueErrorType.ObjectAdditionalProperties, schema, `${path}/${EscapeKey(valueKey)}`, value[valueKey])
      }
    }
  }
  if (typeof schema.additionalProperties === 'object') {
    for (const valueKey of unknownKeys) {
      if (knownKeys.includes(valueKey)) continue
      yield* Visit(schema.additionalProperties as TSchema, references, `${path}/${EscapeKey(valueKey)}`, value[valueKey])
    }
  }
  for (const knownKey of knownKeys) {
    const property = schema.properties[knownKey]
    if (schema.required && schema.required.includes(knownKey)) {
      yield* Visit(property, references, `${path}/${EscapeKey(knownKey)}`, value[knownKey])
      if (ExtendsUndefinedCheck(schema) && !(knownKey in value)) {
        yield Create(ValueErrorType.ObjectRequiredProperty, property, `${path}/${EscapeKey(knownKey)}`, undefined)
      }
    } else {
      if (TypeSystemPolicy.IsExactOptionalProperty(value, knownKey)) {
        yield* Visit(property, references, `${path}/${EscapeKey(knownKey)}`, value[knownKey])
      }
    }
  }
}
function* FromPromise(schema: TPromise, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsPromise(value)) yield Create(ValueErrorType.Promise, schema, path, value)
}
function* FromRecord(schema: TRecord, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!TypeSystemPolicy.IsRecordLike(value)) return yield Create(ValueErrorType.Object, schema, path, value)
  if (IsDefined<number>(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    yield Create(ValueErrorType.ObjectMinProperties, schema, path, value)
  }
  if (IsDefined<number>(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    yield Create(ValueErrorType.ObjectMaxProperties, schema, path, value)
  }
  const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0]
  const regex = new RegExp(patternKey)
  for (const [propertyKey, propertyValue] of Object.entries(value)) {
    if (regex.test(propertyKey)) yield* Visit(patternSchema, references, `${path}/${EscapeKey(propertyKey)}`, propertyValue)
  }
  if (typeof schema.additionalProperties === 'object') {
    for (const [propertyKey, propertyValue] of Object.entries(value)) {
      if (!regex.test(propertyKey)) yield* Visit(schema.additionalProperties as TSchema, references, `${path}/${EscapeKey(propertyKey)}`, propertyValue)
    }
  }
  if (schema.additionalProperties === false) {
    for (const [propertyKey, propertyValue] of Object.entries(value)) {
      if (regex.test(propertyKey)) continue
      return yield Create(ValueErrorType.ObjectAdditionalProperties, schema, `${path}/${EscapeKey(propertyKey)}`, propertyValue)
    }
  }
}
function* FromRef(schema: TRef, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield* Visit(Deref(schema, references), references, path, value)
}
function* FromRegExp(schema: TRegExp, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsString(value)) return yield Create(ValueErrorType.String, schema, path, value)
  if (IsDefined<number>(schema.minLength) && !(value.length >= schema.minLength)) {
    yield Create(ValueErrorType.StringMinLength, schema, path, value)
  }
  if (IsDefined<number>(schema.maxLength) && !(value.length <= schema.maxLength)) {
    yield Create(ValueErrorType.StringMaxLength, schema, path, value)
  }
  const regex = new RegExp(schema.source, schema.flags)
  if (!regex.test(value)) {
    return yield Create(ValueErrorType.RegExp, schema, path, value)
  }
}
function* FromString(schema: TString, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsString(value)) return yield Create(ValueErrorType.String, schema, path, value)
  if (IsDefined<number>(schema.minLength) && !(value.length >= schema.minLength)) {
    yield Create(ValueErrorType.StringMinLength, schema, path, value)
  }
  if (IsDefined<number>(schema.maxLength) && !(value.length <= schema.maxLength)) {
    yield Create(ValueErrorType.StringMaxLength, schema, path, value)
  }
  if (IsString(schema.pattern)) {
    const regex = new RegExp(schema.pattern)
    if (!regex.test(value)) {
      yield Create(ValueErrorType.StringPattern, schema, path, value)
    }
  }
  if (IsString(schema.format)) {
    if (!FormatRegistry.Has(schema.format)) {
      yield Create(ValueErrorType.StringFormatUnknown, schema, path, value)
    } else {
      const format = FormatRegistry.Get(schema.format)!
      if (!format(value)) {
        yield Create(ValueErrorType.StringFormat, schema, path, value)
      }
    }
  }
}
function* FromSymbol(schema: TSymbol, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsSymbol(value)) yield Create(ValueErrorType.Symbol, schema, path, value)
}
function* FromTemplateLiteral(schema: TTemplateLiteral, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsString(value)) return yield Create(ValueErrorType.String, schema, path, value)
  const regex = new RegExp(schema.pattern)
  if (!regex.test(value)) {
    yield Create(ValueErrorType.StringPattern, schema, path, value)
  }
}
function* FromThis(schema: TThis, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield* Visit(Deref(schema, references), references, path, value)
}
function* FromTuple(schema: TTuple<any[]>, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsArray(value)) return yield Create(ValueErrorType.Tuple, schema, path, value)
  if (schema.items === undefined && !(value.length === 0)) {
    return yield Create(ValueErrorType.TupleLength, schema, path, value)
  }
  if (!(value.length === schema.maxItems)) {
    return yield Create(ValueErrorType.TupleLength, schema, path, value)
  }
  if (!schema.items) {
    return
  }
  for (let i = 0; i < schema.items.length; i++) {
    yield* Visit(schema.items[i], references, `${path}/${i}`, value[i])
  }
}
function* FromUndefined(schema: TUndefined, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsUndefined(value)) yield Create(ValueErrorType.Undefined, schema, path, value)
}
function* FromUnion(schema: TUnion, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (Check(schema, references, value)) return
  const errors = schema.anyOf.map((variant) => new ValueErrorIterator(Visit(variant, references, path, value)))
  yield Create(ValueErrorType.Union, schema, path, value, errors)
}
function* FromUint8Array(schema: TUint8Array, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsUint8Array(value)) return yield Create(ValueErrorType.Uint8Array, schema, path, value)
  if (IsDefined<number>(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
    yield Create(ValueErrorType.Uint8ArrayMaxByteLength, schema, path, value)
  }
  if (IsDefined<number>(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
    yield Create(ValueErrorType.Uint8ArrayMinByteLength, schema, path, value)
  }
}
function* FromUnknown(schema: TUnknown, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {}
function* FromVoid(schema: TVoid, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!TypeSystemPolicy.IsVoidLike(value)) yield Create(ValueErrorType.Void, schema, path, value)
}
function* FromKind(schema: TSchema, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  const check = TypeRegistry.Get(schema[Kind])!
  if (!check(schema, value)) yield Create(ValueErrorType.Kind, schema, path, value)
}
function* Visit<T extends TSchema>(schema: T, references: TSchema[], path: string, value: any): IterableIterator<ValueError> {
  const references_ = IsDefined<string>(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema_[Kind]) {
    case 'Any':
      return yield* FromAny(schema_, references_, path, value)
    case 'Array':
      return yield* FromArray(schema_, references_, path, value)
    case 'AsyncIterator':
      return yield* FromAsyncIterator(schema_, references_, path, value)
    case 'BigInt':
      return yield* FromBigInt(schema_, references_, path, value)
    case 'Boolean':
      return yield* FromBoolean(schema_, references_, path, value)
    case 'Constructor':
      return yield* FromConstructor(schema_, references_, path, value)
    case 'Date':
      return yield* FromDate(schema_, references_, path, value)
    case 'Function':
      return yield* FromFunction(schema_, references_, path, value)
    case 'Import':
      return yield* FromImport(schema_, references_, path, value)
    case 'Integer':
      return yield* FromInteger(schema_, references_, path, value)
    case 'Intersect':
      return yield* FromIntersect(schema_, references_, path, value)
    case 'Iterator':
      return yield* FromIterator(schema_, references_, path, value)
    case 'Literal':
      return yield* FromLiteral(schema_, references_, path, value)
    case 'Never':
      return yield* FromNever(schema_, references_, path, value)
    case 'Not':
      return yield* FromNot(schema_, references_, path, value)
    case 'Null':
      return yield* FromNull(schema_, references_, path, value)
    case 'Number':
      return yield* FromNumber(schema_, references_, path, value)
    case 'Object':
      return yield* FromObject(schema_, references_, path, value)
    case 'Promise':
      return yield* FromPromise(schema_, references_, path, value)
    case 'Record':
      return yield* FromRecord(schema_, references_, path, value)
    case 'Ref':
      return yield* FromRef(schema_, references_, path, value)
    case 'RegExp':
      return yield* FromRegExp(schema_, references_, path, value)
    case 'String':
      return yield* FromString(schema_, references_, path, value)
    case 'Symbol':
      return yield* FromSymbol(schema_, references_, path, value)
    case 'TemplateLiteral':
      return yield* FromTemplateLiteral(schema_, references_, path, value)
    case 'This':
      return yield* FromThis(schema_, references_, path, value)
    case 'Tuple':
      return yield* FromTuple(schema_, references_, path, value)
    case 'Undefined':
      return yield* FromUndefined(schema_, references_, path, value)
    case 'Union':
      return yield* FromUnion(schema_, references_, path, value)
    case 'Uint8Array':
      return yield* FromUint8Array(schema_, references_, path, value)
    case 'Unknown':
      return yield* FromUnknown(schema_, references_, path, value)
    case 'Void':
      return yield* FromVoid(schema_, references_, path, value)
    default:
      if (!TypeRegistry.Has(schema_[Kind])) throw new ValueErrorsUnknownTypeError(schema)
      return yield* FromKind(schema_, references_, path, value)
  }
}
/** Returns an iterator for each error in this value. */
export function Errors<T extends TSchema>(schema: T, references: TSchema[], value: unknown): ValueErrorIterator
/** Returns an iterator for each error in this value. */
export function Errors<T extends TSchema>(schema: T, value: unknown): ValueErrorIterator
/** Returns an iterator for each error in this value. */
export function Errors(...args: any[]) {
  const iterator = args.length === 3 ? Visit(args[0], args[1], '', args[2]) : Visit(args[0], [], '', args[1])
  return new ValueErrorIterator(iterator)
}
