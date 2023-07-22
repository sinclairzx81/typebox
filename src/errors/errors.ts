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

import { TypeSystem } from '../system/index'
import * as Types from '../typebox'
import * as ValueHash from '../value/hash'
import * as ValueGuard from '../value/guard'

// --------------------------------------------------------------------------
// ValueErrorType
// --------------------------------------------------------------------------
export enum ValueErrorType {
  Array,
  ArrayMinItems,
  ArrayMaxItems,
  ArrayContains,
  ArrayMinContains,
  ArrayMaxContains,
  ArrayUniqueItems,
  AsyncIterator,
  BigInt,
  BigIntMultipleOf,
  BigIntExclusiveMinimum,
  BigIntExclusiveMaximum,
  BigIntMinimum,
  BigIntMaximum,
  Boolean,
  Date,
  DateExclusiveMinimumTimestamp,
  DateExclusiveMaximumTimestamp,
  DateMinimumTimestamp,
  DateMaximumTimestamp,
  Function,
  Integer,
  IntegerMultipleOf,
  IntegerExclusiveMinimum,
  IntegerExclusiveMaximum,
  IntegerMinimum,
  IntegerMaximum,
  Intersect,
  IntersectUnevaluatedProperties,
  Iterator,
  Literal,
  Never,
  Not,
  Null,
  Number,
  NumberMultipleOf,
  NumberExclusiveMinimum,
  NumberExclusiveMaximum,
  NumberMinimum,
  NumberMaximum,
  Object,
  ObjectMinProperties,
  ObjectMaxProperties,
  ObjectAdditionalProperties,
  ObjectRequiredProperties,
  Promise,
  RecordKeyNumeric,
  RecordKeyString,
  String,
  StringMinLength,
  StringMaxLength,
  StringPattern,
  StringFormatUnknown,
  StringFormat,
  Symbol,
  TupleZeroLength,
  TupleLength,
  Undefined,
  Union,
  Uint8Array,
  Uint8ArrayMinByteLength,
  Uint8ArrayMaxByteLength,
  Void,
  Custom,
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
// ValueErrors
// --------------------------------------------------------------------------
export class ValueErrorsUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueErrors: Unknown type')
  }
}
export class ValueErrorsDereferenceError extends Error {
  constructor(public readonly schema: Types.TRef | Types.TThis) {
    super(`ValueErrors: Unable to dereference schema with $id '${schema.$ref}'`)
  }
}
// --------------------------------------------------------------------------
// Guards
// --------------------------------------------------------------------------
function IsDefined<T>(value: unknown): value is T {
  return value !== undefined
}
// --------------------------------------------------------------------------
// Policies
// --------------------------------------------------------------------------
function IsExactOptionalProperty(value: Record<keyof any, unknown>, key: string) {
  return TypeSystem.ExactOptionalPropertyTypes ? key in value : value[key] !== undefined
}
function IsObject(value: unknown): value is Record<keyof any, unknown> {
  const isObject = ValueGuard.IsObject(value)
  return TypeSystem.AllowArrayObjects ? isObject : isObject && !ValueGuard.IsArray(value)
}
function IsRecordObject(value: unknown): value is Record<keyof any, unknown> {
  return IsObject(value) && !(value instanceof Date) && !(value instanceof Uint8Array)
}
function IsNumber(value: unknown): value is number {
  const isNumber = ValueGuard.IsNumber(value)
  return TypeSystem.AllowNaN ? isNumber : isNumber && Number.isFinite(value)
}
function IsVoid(value: unknown): value is void {
  const isUndefined = ValueGuard.IsUndefined(value)
  return TypeSystem.AllowVoidNull ? isUndefined || value === null : isUndefined
}
// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
function* TAny(schema: Types.TAny, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {}
function* TArray(schema: Types.TArray, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsArray(value)) {
    return yield { type: ValueErrorType.Array, schema, path, value, message: `Expected array` }
  }
  if (IsDefined<number>(schema.minItems) && !(value.length >= schema.minItems)) {
    yield { type: ValueErrorType.ArrayMinItems, schema, path, value, message: `Expected array length to be greater or equal to ${schema.minItems}` }
  }
  if (IsDefined<number>(schema.maxItems) && !(value.length <= schema.maxItems)) {
    yield { type: ValueErrorType.ArrayMinItems, schema, path, value, message: `Expected array length to be less or equal to ${schema.maxItems}` }
  }

  for (let i = 0; i < value.length; i++) {
    yield* Visit(schema.items, references, `${path}/${i}`, value[i])
  }
  // prettier-ignore
  if (schema.uniqueItems === true && !((function () { const set = new Set(); for (const element of value) { const hashed = ValueHash.Hash(element); if (set.has(hashed)) { return false } else { set.add(hashed) } } return true })())) {
    yield { type: ValueErrorType.ArrayUniqueItems, schema, path, value, message: `Expected array elements to be unique` }
  }
  // contains
  if (!(IsDefined(schema.contains) || IsNumber(schema.minContains) || IsNumber(schema.maxContains))) {
    return
  }
  const containsSchema = IsDefined<Types.TSchema>(schema.contains) ? schema.contains : Types.Type.Never()
  const containsCount = value.reduce((acc: number, value, index) => (Visit(containsSchema, references, `${path}${index}`, value).next().done === true ? acc + 1 : acc), 0)
  if (containsCount === 0) {
    yield { type: ValueErrorType.ArrayContains, schema, path, value, message: `Expected array to contain at least one matching type` }
  }
  if (ValueGuard.IsNumber(schema.minContains) && containsCount < schema.minContains) {
    yield { type: ValueErrorType.ArrayMinContains, schema, path, value, message: `Expected array to contain at least ${schema.minContains} matching types` }
  }
  if (ValueGuard.IsNumber(schema.maxContains) && containsCount > schema.maxContains) {
    yield { type: ValueErrorType.ArrayMaxContains, schema, path, value, message: `Expected array to contain no more than ${schema.maxContains} matching types` }
  }
}
function* TAsyncIterator(schema: Types.TAsyncIterator, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsAsyncIterator(value)) {
    yield { type: ValueErrorType.AsyncIterator, schema, path, value, message: `Expected value to be an async iterator` }
  }
}
function* TBigInt(schema: Types.TBigInt, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsBigInt(value)) {
    return yield { type: ValueErrorType.BigInt, schema, path, value, message: `Expected bigint` }
  }
  if (IsDefined<bigint>(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0))) {
    yield { type: ValueErrorType.BigIntMultipleOf, schema, path, value, message: `Expected bigint to be a multiple of ${schema.multipleOf}` }
  }
  if (IsDefined<bigint>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    yield { type: ValueErrorType.BigIntExclusiveMinimum, schema, path, value, message: `Expected bigint to be greater than ${schema.exclusiveMinimum}` }
  }
  if (IsDefined<bigint>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    yield { type: ValueErrorType.BigIntExclusiveMaximum, schema, path, value, message: `Expected bigint to be less than ${schema.exclusiveMaximum}` }
  }
  if (IsDefined<bigint>(schema.minimum) && !(value >= schema.minimum)) {
    yield { type: ValueErrorType.BigIntMinimum, schema, path, value, message: `Expected bigint to be greater or equal to ${schema.minimum}` }
  }
  if (IsDefined<bigint>(schema.maximum) && !(value <= schema.maximum)) {
    yield { type: ValueErrorType.BigIntMaximum, schema, path, value, message: `Expected bigint to be less or equal to ${schema.maximum}` }
  }
}
function* TBoolean(schema: Types.TBoolean, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsBoolean(value)) {
    return yield { type: ValueErrorType.Boolean, schema, path, value, message: `Expected boolean` }
  }
}
function* TConstructor(schema: Types.TConstructor, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield* Visit(schema.returns, references, path, value.prototype)
}
function* TDate(schema: Types.TDate, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsDate(value)) {
    return yield { type: ValueErrorType.Date, schema, path, value, message: `Expected Date object` }
  }
  if (!isFinite(value.getTime())) {
    return yield { type: ValueErrorType.Date, schema, path, value, message: `Invalid Date` }
  }
  if (IsDefined<number>(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) {
    yield { type: ValueErrorType.DateExclusiveMinimumTimestamp, schema, path, value, message: `Expected Date timestamp to be greater than ${schema.exclusiveMinimum}` }
  }
  if (IsDefined<number>(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) {
    yield { type: ValueErrorType.DateExclusiveMaximumTimestamp, schema, path, value, message: `Expected Date timestamp to be less than ${schema.exclusiveMaximum}` }
  }
  if (IsDefined<number>(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) {
    yield { type: ValueErrorType.DateMinimumTimestamp, schema, path, value, message: `Expected Date timestamp to be greater or equal to ${schema.minimum}` }
  }
  if (IsDefined<number>(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) {
    yield { type: ValueErrorType.DateMaximumTimestamp, schema, path, value, message: `Expected Date timestamp to be less or equal to ${schema.maximum}` }
  }
}
function* TFunction(schema: Types.TFunction, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsFunction(value)) {
    return yield { type: ValueErrorType.Function, schema, path, value, message: `Expected function` }
  }
}
function* TInteger(schema: Types.TInteger, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsInteger(value)) {
    return yield { type: ValueErrorType.Integer, schema, path, value, message: `Expected integer` }
  }
  if (IsDefined<number>(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    yield { type: ValueErrorType.IntegerMultipleOf, schema, path, value, message: `Expected integer to be a multiple of ${schema.multipleOf}` }
  }
  if (IsDefined<number>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    yield { type: ValueErrorType.IntegerExclusiveMinimum, schema, path, value, message: `Expected integer to be greater than ${schema.exclusiveMinimum}` }
  }
  if (IsDefined<number>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    yield { type: ValueErrorType.IntegerExclusiveMaximum, schema, path, value, message: `Expected integer to be less than ${schema.exclusiveMaximum}` }
  }
  if (IsDefined<number>(schema.minimum) && !(value >= schema.minimum)) {
    yield { type: ValueErrorType.IntegerMinimum, schema, path, value, message: `Expected integer to be greater or equal to ${schema.minimum}` }
  }
  if (IsDefined<number>(schema.maximum) && !(value <= schema.maximum)) {
    yield { type: ValueErrorType.IntegerMaximum, schema, path, value, message: `Expected integer to be less or equal to ${schema.maximum}` }
  }
}
function* TIntersect(schema: Types.TIntersect, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  for (const inner of schema.allOf) {
    const next = Visit(inner, references, path, value).next()
    if (!next.done) {
      yield next.value
      yield { type: ValueErrorType.Intersect, schema, path, value, message: `Expected all sub schemas to be valid` }
      return
    }
  }
  if (schema.unevaluatedProperties === false) {
    const keyCheck = new RegExp(Types.KeyResolver.ResolvePattern(schema))
    for (const valueKey of Object.getOwnPropertyNames(value)) {
      if (!keyCheck.test(valueKey)) {
        yield { type: ValueErrorType.IntersectUnevaluatedProperties, schema, path: `${path}/${valueKey}`, value, message: `Unexpected property` }
      }
    }
  }
  if (typeof schema.unevaluatedProperties === 'object') {
    const keyCheck = new RegExp(Types.KeyResolver.ResolvePattern(schema))
    for (const valueKey of Object.getOwnPropertyNames(value)) {
      if (!keyCheck.test(valueKey)) {
        const next = Visit(schema.unevaluatedProperties, references, `${path}/${valueKey}`, value[valueKey]).next()
        if (!next.done) {
          yield next.value
          yield { type: ValueErrorType.IntersectUnevaluatedProperties, schema, path: `${path}/${valueKey}`, value, message: `Invalid additional property` }
          return
        }
      }
    }
  }
}
function* TIterator(schema: Types.TIterator, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!(IsObject(value) && Symbol.iterator in value)) {
    yield { type: ValueErrorType.Iterator, schema, path, value, message: `Expected value to be an iterator` }
  }
}
function* TLiteral(schema: Types.TLiteral, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!(value === schema.const)) {
    const error = typeof schema.const === 'string' ? `'${schema.const}'` : schema.const
    return yield { type: ValueErrorType.Literal, schema, path, value, message: `Expected ${error}` }
  }
}
function* TNever(schema: Types.TNever, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  yield { type: ValueErrorType.Never, schema, path, value, message: `Value cannot be validated` }
}
function* TNot(schema: Types.TNot, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (Visit(schema.not, references, path, value).next().done === true) {
    yield { type: ValueErrorType.Not, schema, path, value, message: `Value should not validate` }
  }
}
function* TNull(schema: Types.TNull, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsNull(value)) {
    return yield { type: ValueErrorType.Null, schema, path, value, message: `Expected null` }
  }
}
function* TNumber(schema: Types.TNumber, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsNumber(value)) {
    return yield { type: ValueErrorType.Number, schema, path, value, message: `Expected number` }
  }
  if (IsDefined<number>(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    yield { type: ValueErrorType.NumberMultipleOf, schema, path, value, message: `Expected number to be a multiple of ${schema.multipleOf}` }
  }
  if (IsDefined<number>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    yield { type: ValueErrorType.NumberExclusiveMinimum, schema, path, value, message: `Expected number to be greater than ${schema.exclusiveMinimum}` }
  }
  if (IsDefined<number>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    yield { type: ValueErrorType.NumberExclusiveMaximum, schema, path, value, message: `Expected number to be less than ${schema.exclusiveMaximum}` }
  }
  if (IsDefined<number>(schema.minimum) && !(value >= schema.minimum)) {
    yield { type: ValueErrorType.NumberMinimum, schema, path, value, message: `Expected number to be greater or equal to ${schema.minimum}` }
  }
  if (IsDefined<number>(schema.maximum) && !(value <= schema.maximum)) {
    yield { type: ValueErrorType.NumberMaximum, schema, path, value, message: `Expected number to be less or equal to ${schema.maximum}` }
  }
}
function* TObject(schema: Types.TObject, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsObject(value)) {
    return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected object` }
  }
  if (IsDefined<number>(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    yield { type: ValueErrorType.ObjectMinProperties, schema, path, value, message: `Expected object to have at least ${schema.minProperties} properties` }
  }
  if (IsDefined<number>(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    yield { type: ValueErrorType.ObjectMaxProperties, schema, path, value, message: `Expected object to have no more than ${schema.maxProperties} properties` }
  }
  const requiredKeys = Array.isArray(schema.required) ? schema.required : ([] as string[])
  const knownKeys = Object.getOwnPropertyNames(schema.properties)
  const unknownKeys = Object.getOwnPropertyNames(value)
  for (const knownKey of knownKeys) {
    const property = schema.properties[knownKey]
    if (schema.required && schema.required.includes(knownKey)) {
      yield* Visit(property, references, `${path}/${knownKey}`, value[knownKey])
      if (Types.ExtendsUndefined.Check(schema) && !(knownKey in value)) {
        yield { type: ValueErrorType.ObjectRequiredProperties, schema: property, path: `${path}/${knownKey}`, value: undefined, message: `Expected required property` }
      }
    } else {
      if (IsExactOptionalProperty(value, knownKey)) {
        yield* Visit(property, references, `${path}/${knownKey}`, value[knownKey])
      }
    }
  }
  for (const requiredKey of requiredKeys) {
    if (unknownKeys.includes(requiredKey)) continue
    yield { type: ValueErrorType.ObjectRequiredProperties, schema: schema.properties[requiredKey], path: `${path}/${requiredKey}`, value: undefined, message: `Expected required property` }
  }
  if (schema.additionalProperties === false) {
    for (const valueKey of unknownKeys) {
      if (!knownKeys.includes(valueKey)) {
        yield { type: ValueErrorType.ObjectAdditionalProperties, schema, path: `${path}/${valueKey}`, value: value[valueKey], message: `Unexpected property` }
      }
    }
  }
  if (typeof schema.additionalProperties === 'object') {
    for (const valueKey of unknownKeys) {
      if (knownKeys.includes(valueKey)) continue
      yield* Visit(schema.additionalProperties as Types.TSchema, references, `${path}/${valueKey}`, value[valueKey])
    }
  }
}
function* TPromise(schema: Types.TPromise, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsPromise(value)) {
    yield { type: ValueErrorType.Promise, schema, path, value, message: `Expected Promise` }
  }
}
function* TRecord(schema: Types.TRecord, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsRecordObject(value)) {
    return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected record object` }
  }
  if (IsDefined<number>(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    yield { type: ValueErrorType.ObjectMinProperties, schema, path, value, message: `Expected object to have at least ${schema.minProperties} properties` }
  }
  if (IsDefined<number>(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    yield { type: ValueErrorType.ObjectMaxProperties, schema, path, value, message: `Expected object to have no more than ${schema.maxProperties} properties` }
  }
  const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0]
  const regex = new RegExp(patternKey)
  for (const [propertyKey, propertyValue] of Object.entries(value)) {
    if (regex.test(propertyKey)) {
      yield* Visit(patternSchema, references, `${path}/${propertyKey}`, propertyValue)
      continue
    }
    if (typeof schema.additionalProperties === 'object') {
      yield* Visit(schema.additionalProperties, references, `${path}/${propertyKey}`, propertyValue)
    }
    if (schema.additionalProperties === false) {
      const propertyPath = `${path}/${propertyKey}`
      const message = `Unexpected property '${propertyPath}'`
      return yield { type: ValueErrorType.ObjectAdditionalProperties, schema, path: propertyPath, value: propertyValue, message }
    }
  }
}
function* TRef(schema: Types.TRef<any>, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueErrorsDereferenceError(schema)
  const target = references[index]
  yield* Visit(target, references, path, value)
}
function* TString(schema: Types.TString, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsString(value)) {
    return yield { type: ValueErrorType.String, schema, path, value, message: 'Expected string' }
  }
  if (IsDefined<number>(schema.minLength) && !(value.length >= schema.minLength)) {
    yield { type: ValueErrorType.StringMinLength, schema, path, value, message: `Expected string length greater or equal to ${schema.minLength}` }
  }
  if (IsDefined<number>(schema.maxLength) && !(value.length <= schema.maxLength)) {
    yield { type: ValueErrorType.StringMaxLength, schema, path, value, message: `Expected string length less or equal to ${schema.maxLength}` }
  }
  if (ValueGuard.IsString(schema.pattern)) {
    const regex = new RegExp(schema.pattern)
    if (!regex.test(value)) {
      yield { type: ValueErrorType.StringPattern, schema, path, value, message: `Expected string to match pattern ${schema.pattern}` }
    }
  }
  if (ValueGuard.IsString(schema.format)) {
    if (!Types.FormatRegistry.Has(schema.format)) {
      yield { type: ValueErrorType.StringFormatUnknown, schema, path, value, message: `Unknown string format '${schema.format}'` }
    } else {
      const format = Types.FormatRegistry.Get(schema.format)!
      if (!format(value)) {
        yield { type: ValueErrorType.StringFormat, schema, path, value, message: `Expected string to match format '${schema.format}'` }
      }
    }
  }
}
function* TSymbol(schema: Types.TSymbol, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsSymbol(value)) {
    return yield { type: ValueErrorType.Symbol, schema, path, value, message: 'Expected symbol' }
  }
}
function* TTemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsString(value)) {
    return yield { type: ValueErrorType.String, schema, path, value, message: 'Expected string' }
  }
  const regex = new RegExp(schema.pattern)
  if (!regex.test(value)) {
    yield { type: ValueErrorType.StringPattern, schema, path, value, message: `Expected string to match pattern ${schema.pattern}` }
  }
}
function* TThis(schema: Types.TThis, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueErrorsDereferenceError(schema)
  const target = references[index]
  yield* Visit(target, references, path, value)
}
function* TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsArray(value)) {
    return yield { type: ValueErrorType.Array, schema, path, value, message: 'Expected Array' }
  }
  if (schema.items === undefined && !(value.length === 0)) {
    return yield { type: ValueErrorType.TupleZeroLength, schema, path, value, message: 'Expected tuple to have 0 elements' }
  }
  if (!(value.length === schema.maxItems)) {
    yield { type: ValueErrorType.TupleLength, schema, path, value, message: `Expected tuple to have ${schema.maxItems} elements` }
  }
  if (!schema.items) {
    return
  }
  for (let i = 0; i < schema.items.length; i++) {
    yield* Visit(schema.items[i], references, `${path}/${i}`, value[i])
  }
}
function* TUndefined(schema: Types.TUndefined, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!(value === undefined)) {
    yield { type: ValueErrorType.Undefined, schema, path, value, message: `Expected undefined` }
  }
}
function* TUnion(schema: Types.TUnion, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  const errors: ValueError[] = []
  for (const inner of schema.anyOf) {
    const variantErrors = [...Visit(inner, references, path, value)]
    if (variantErrors.length === 0) return
    errors.push(...variantErrors)
  }
  if (errors.length > 0) {
    yield { type: ValueErrorType.Union, schema, path, value, message: 'Expected value of union' }
  }
  for (const error of errors) {
    yield error
  }
}
function* TUint8Array(schema: Types.TUint8Array, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!ValueGuard.IsUint8Array(value)) {
    return yield { type: ValueErrorType.Uint8Array, schema, path, value, message: `Expected Uint8Array` }
  }
  if (IsDefined<number>(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
    yield { type: ValueErrorType.Uint8ArrayMaxByteLength, schema, path, value, message: `Expected Uint8Array to have a byte length less or equal to ${schema.maxByteLength}` }
  }
  if (IsDefined<number>(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
    yield { type: ValueErrorType.Uint8ArrayMinByteLength, schema, path, value, message: `Expected Uint8Array to have a byte length greater or equal to ${schema.maxByteLength}` }
  }
}
function* TUnknown(schema: Types.TUnknown, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {}
function* TVoid(schema: Types.TVoid, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  if (!IsVoid(value)) {
    return yield { type: ValueErrorType.Void, schema, path, value, message: `Expected void` }
  }
}
function* TUserDefined(schema: Types.TSchema, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
  const check = Types.TypeRegistry.Get(schema[Types.Kind])!
  if (!check(schema, value)) {
    return yield { type: ValueErrorType.Custom, schema, path, value, message: `Expected kind ${schema[Types.Kind]}` }
  }
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
      return yield* TUserDefined(schema_, references_, path, value)
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
