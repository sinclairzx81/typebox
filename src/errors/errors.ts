/*--------------------------------------------------------------------------

@sinclair/typebox/errors

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

import { IsArray, IsUint8Array, IsDate, IsPromise, IsFunction, IsAsyncIterator, IsIterator, IsBoolean, IsNumber, IsBigInt, IsString, IsSymbol, IsInteger, IsNull, IsUndefined } from '../value/guard'
import { TypeSystemPolicy, TypeSystemErrorFunction } from '../system/system'
import { Deref } from '../value/deref'
import { Hash } from '../value/hash'
import * as Types from '../typebox'

// --------------------------------------------------------------------------
// ValueErrorType
// --------------------------------------------------------------------------
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
// --------------------------------------------------------------------------
// ValueError
// --------------------------------------------------------------------------
export interface ValueError {
  type: ValueErrorType
  schema: Types.TSchema
  path: string
  value: unknown
  message: string
}
// --------------------------------------------------------------------------
// ValueErrors
// --------------------------------------------------------------------------
export class ValueErrorsUnknownTypeError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema) {
    super('Unknown type')
  }
}
// --------------------------------------------------------------------------
// Guards
// --------------------------------------------------------------------------
function IsDefined<T>(value: unknown): value is T {
  return value !== undefined
}
// --------------------------------------------------------------------------
// ValueErrorIterator
// --------------------------------------------------------------------------
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
function Create(type: ValueErrorType, schema: Types.TSchema, path: string, value: unknown): ValueError {
  return { type, schema, path, value, message: TypeSystemErrorFunction.Get()(schema, type) }
}
// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
function* TAny(schema: Types.TAny, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {}
function* TArray(schema: Types.TArray, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
  const containsSchema = IsDefined<Types.TSchema>(schema.contains) ? schema.contains : Types.Type.Never()
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
function* TAsyncIterator(schema: Types.TAsyncIterator, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsAsyncIterator(value)) yield Create(ValueErrorType.AsyncIterator, schema, path, value)
}
function* TBigInt(schema: Types.TBigInt, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
function* TBoolean(schema: Types.TBoolean, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsBoolean(value)) yield Create(ValueErrorType.Boolean, schema, path, value)
}
function* TConstructor(schema: Types.TConstructor, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield* Visit(schema.returns, references, path, value.prototype)
}
function* TDate(schema: Types.TDate, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
function* TFunction(schema: Types.TFunction, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsFunction(value)) yield Create(ValueErrorType.Function, schema, path, value)
}
function* TInteger(schema: Types.TInteger, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
function* TIntersect(schema: Types.TIntersect, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  for (const inner of schema.allOf) {
    const next = Visit(inner, references, path, value).next()
    if (!next.done) {
      yield Create(ValueErrorType.Intersect, schema, path, value)
      yield next.value
    }
  }
  if (schema.unevaluatedProperties === false) {
    const keyCheck = new RegExp(Types.KeyResolver.ResolvePattern(schema))
    for (const valueKey of Object.getOwnPropertyNames(value)) {
      if (!keyCheck.test(valueKey)) {
        yield Create(ValueErrorType.IntersectUnevaluatedProperties, schema, `${path}/${valueKey}`, value)
      }
    }
  }
  if (typeof schema.unevaluatedProperties === 'object') {
    const keyCheck = new RegExp(Types.KeyResolver.ResolvePattern(schema))
    for (const valueKey of Object.getOwnPropertyNames(value)) {
      if (!keyCheck.test(valueKey)) {
        const next = Visit(schema.unevaluatedProperties, references, `${path}/${valueKey}`, value[valueKey]).next()
        if (!next.done) yield next.value // yield interior
      }
    }
  }
}
function* TIterator(schema: Types.TIterator, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsIterator(value)) yield Create(ValueErrorType.Iterator, schema, path, value)
}
function* TLiteral(schema: Types.TLiteral, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!(value === schema.const)) yield Create(ValueErrorType.Literal, schema, path, value)
}
function* TNever(schema: Types.TNever, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield Create(ValueErrorType.Never, schema, path, value)
}
function* TNot(schema: Types.TNot, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (Visit(schema.not, references, path, value).next().done === true) yield Create(ValueErrorType.Not, schema, path, value)
}
function* TNull(schema: Types.TNull, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsNull(value)) yield Create(ValueErrorType.Null, schema, path, value)
}
function* TNumber(schema: Types.TNumber, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
function* TObject(schema: Types.TObject, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
    yield Create(ValueErrorType.ObjectRequiredProperty, schema.properties[requiredKey], `${path}/${requiredKey}`, undefined)
  }
  if (schema.additionalProperties === false) {
    for (const valueKey of unknownKeys) {
      if (!knownKeys.includes(valueKey)) {
        yield Create(ValueErrorType.ObjectAdditionalProperties, schema, `${path}/${valueKey}`, value[valueKey])
      }
    }
  }
  if (typeof schema.additionalProperties === 'object') {
    for (const valueKey of unknownKeys) {
      if (knownKeys.includes(valueKey)) continue
      yield* Visit(schema.additionalProperties as Types.TSchema, references, `${path}/${valueKey}`, value[valueKey])
    }
  }
  for (const knownKey of knownKeys) {
    const property = schema.properties[knownKey]
    if (schema.required && schema.required.includes(knownKey)) {
      yield* Visit(property, references, `${path}/${knownKey}`, value[knownKey])
      if (Types.ExtendsUndefined.Check(schema) && !(knownKey in value)) {
        yield Create(ValueErrorType.ObjectRequiredProperty, property, `${path}/${knownKey}`, undefined)
      }
    } else {
      if (TypeSystemPolicy.IsExactOptionalProperty(value, knownKey)) {
        yield* Visit(property, references, `${path}/${knownKey}`, value[knownKey])
      }
    }
  }
}
function* TPromise(schema: Types.TPromise, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsPromise(value)) yield Create(ValueErrorType.Promise, schema, path, value)
}
function* TRecord(schema: Types.TRecord, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
    if (regex.test(propertyKey)) yield* Visit(patternSchema, references, `${path}/${propertyKey}`, propertyValue)
  }
  if (typeof schema.additionalProperties === 'object') {
    for (const [propertyKey, propertyValue] of Object.entries(value)) {
      if (!regex.test(propertyKey)) yield* Visit(schema.additionalProperties as Types.TSchema, references, `${path}/${propertyKey}`, propertyValue)
    }
  }
  if (schema.additionalProperties === false) {
    for (const [propertyKey, propertyValue] of Object.entries(value)) {
      if (regex.test(propertyKey)) continue
      return yield Create(ValueErrorType.ObjectAdditionalProperties, schema, `${path}/${propertyKey}`, propertyValue)
    }
  }
}
function* TRef(schema: Types.TRef<any>, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield* Visit(Deref(schema, references), references, path, value)
}
function* TString(schema: Types.TString, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
    if (!Types.FormatRegistry.Has(schema.format)) {
      yield Create(ValueErrorType.StringFormatUnknown, schema, path, value)
    } else {
      const format = Types.FormatRegistry.Get(schema.format)!
      if (!format(value)) {
        yield Create(ValueErrorType.StringFormat, schema, path, value)
      }
    }
  }
}
function* TSymbol(schema: Types.TSymbol, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsSymbol(value)) yield Create(ValueErrorType.Symbol, schema, path, value)
}
function* TTemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsString(value)) return yield Create(ValueErrorType.String, schema, path, value)
  const regex = new RegExp(schema.pattern)
  if (!regex.test(value)) {
    yield Create(ValueErrorType.StringPattern, schema, path, value)
  }
}
function* TThis(schema: Types.TThis, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield* Visit(Deref(schema, references), references, path, value)
}
function* TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
function* TUndefined(schema: Types.TUndefined, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsUndefined(value)) yield Create(ValueErrorType.Undefined, schema, path, value)
}
function* TUnion(schema: Types.TUnion, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  let count = 0
  for (const subschema of schema.anyOf) {
    const errors = [...Visit(subschema, references, path, value)]
    if (errors.length === 0) return // matched
    count += errors.length
  }
  if (count > 0) {
    yield Create(ValueErrorType.Union, schema, path, value)
  }
}
function* TUint8Array(schema: Types.TUint8Array, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsUint8Array(value)) return yield Create(ValueErrorType.Uint8Array, schema, path, value)
  if (IsDefined<number>(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
    yield Create(ValueErrorType.Uint8ArrayMaxByteLength, schema, path, value)
  }
  if (IsDefined<number>(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
    yield Create(ValueErrorType.Uint8ArrayMinByteLength, schema, path, value)
  }
}
function* TUnknown(schema: Types.TUnknown, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {}
function* TVoid(schema: Types.TVoid, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!TypeSystemPolicy.IsVoidLike(value)) yield Create(ValueErrorType.Void, schema, path, value)
}
function* TKind(schema: Types.TSchema, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  const check = Types.TypeRegistry.Get(schema[Types.Kind])!
  if (!check(schema, value)) yield Create(ValueErrorType.Kind, schema, path, value)
}
function* Visit<T extends Types.TSchema>(schema: T, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  const references_ = IsDefined<string>(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema_[Types.Kind]) {
    case 'Any':
      return yield* TAny(schema_, references_, path, value)
    case 'Array':
      return yield* TArray(schema_, references_, path, value)
    case 'AsyncIterator':
      return yield* TAsyncIterator(schema_, references_, path, value)
    case 'BigInt':
      return yield* TBigInt(schema_, references_, path, value)
    case 'Boolean':
      return yield* TBoolean(schema_, references_, path, value)
    case 'Constructor':
      return yield* TConstructor(schema_, references_, path, value)
    case 'Date':
      return yield* TDate(schema_, references_, path, value)
    case 'Function':
      return yield* TFunction(schema_, references_, path, value)
    case 'Integer':
      return yield* TInteger(schema_, references_, path, value)
    case 'Intersect':
      return yield* TIntersect(schema_, references_, path, value)
    case 'Iterator':
      return yield* TIterator(schema_, references_, path, value)
    case 'Literal':
      return yield* TLiteral(schema_, references_, path, value)
    case 'Never':
      return yield* TNever(schema_, references_, path, value)
    case 'Not':
      return yield* TNot(schema_, references_, path, value)
    case 'Null':
      return yield* TNull(schema_, references_, path, value)
    case 'Number':
      return yield* TNumber(schema_, references_, path, value)
    case 'Object':
      return yield* TObject(schema_, references_, path, value)
    case 'Promise':
      return yield* TPromise(schema_, references_, path, value)
    case 'Record':
      return yield* TRecord(schema_, references_, path, value)
    case 'Ref':
      return yield* TRef(schema_, references_, path, value)
    case 'String':
      return yield* TString(schema_, references_, path, value)
    case 'Symbol':
      return yield* TSymbol(schema_, references_, path, value)
    case 'TemplateLiteral':
      return yield* TTemplateLiteral(schema_, references_, path, value)
    case 'This':
      return yield* TThis(schema_, references_, path, value)
    case 'Tuple':
      return yield* TTuple(schema_, references_, path, value)
    case 'Undefined':
      return yield* TUndefined(schema_, references_, path, value)
    case 'Union':
      return yield* TUnion(schema_, references_, path, value)
    case 'Uint8Array':
      return yield* TUint8Array(schema_, references_, path, value)
    case 'Unknown':
      return yield* TUnknown(schema_, references_, path, value)
    case 'Void':
      return yield* TVoid(schema_, references_, path, value)
    default:
      if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueErrorsUnknownTypeError(schema)
      return yield* TKind(schema_, references_, path, value)
  }
}
/** Returns an iterator for each error in this value. */
export function Errors<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): ValueErrorIterator
/** Returns an iterator for each error in this value. */
export function Errors<T extends Types.TSchema>(schema: T, value: unknown): ValueErrorIterator
/** Returns an iterator for each error in this value. */
export function Errors(...args: any[]) {
  const iterator = args.length === 3 ? Visit(args[0], args[1], '', args[2]) : Visit(args[0], [], '', args[1])
  return new ValueErrorIterator(iterator)
}
