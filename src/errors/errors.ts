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
import * as Types from '../typebox'
import { TypeSystem } from '../system/index'
import { ValueHash } from '../value/hash'

// -------------------------------------------------------------------
// ValueErrorType
// -------------------------------------------------------------------
export enum ValueErrorType {
  Array,
  ArrayMinItems,
  ArrayMaxItems,
  ArrayUniqueItems,
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
  Literal,
  Never,
  Not,
  Null,
  Number,
  NumberMultipleOf,
  NumberExclusiveMinimum,
  NumberExclusiveMaximum,
  NumberMinumum,
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
// -------------------------------------------------------------------
// ValueError
// -------------------------------------------------------------------
export interface ValueError {
  type: ValueErrorType
  schema: Types.TSchema
  path: string
  value: unknown
  message: string
}
// -------------------------------------------------------------------
// ValueErrorIterator
// -------------------------------------------------------------------
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
// -------------------------------------------------------------------
// ValueErrors
// -------------------------------------------------------------------
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
/** Provides functionality to generate a sequence of errors against a TypeBox type.  */
export namespace ValueErrors {
  // ----------------------------------------------------------------------
  // Guards
  // ----------------------------------------------------------------------
  function IsBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  }
  function IsInteger(value: unknown): value is number {
    return globalThis.Number.isInteger(value)
  }
  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }
  function IsDefined<T>(value: unknown): value is T {
    return value !== undefined
  }
  // ----------------------------------------------------------------------
  // Policies
  // ----------------------------------------------------------------------
  function IsExactOptionalProperty(value: Record<keyof any, unknown>, key: string) {
    return TypeSystem.ExactOptionalPropertyTypes ? key in value : value[key] !== undefined
  }
  function IsObject(value: unknown): value is Record<keyof any, unknown> {
    const result = typeof value === 'object' && value !== null
    return TypeSystem.AllowArrayObjects ? result : result && !globalThis.Array.isArray(value)
  }
  function IsRecordObject(value: unknown): value is Record<keyof any, unknown> {
    return IsObject(value) && !(value instanceof globalThis.Date) && !(value instanceof globalThis.Uint8Array)
  }
  function IsNumber(value: unknown): value is number {
    const result = typeof value === 'number'
    return TypeSystem.AllowNaN ? result : result && globalThis.Number.isFinite(value)
  }
  function IsVoid(value: unknown): value is void {
    const result = value === undefined
    return TypeSystem.AllowVoidNull ? result || value === null : result
  }

  // ----------------------------------------------------------------------
  // Types
  // ----------------------------------------------------------------------
  function* Any(schema: Types.TAny, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {}
  function* Array(schema: Types.TArray, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!globalThis.Array.isArray(value)) {
      return yield { type: ValueErrorType.Array, schema, path, value, message: `Expected array` }
    }
    if (IsDefined<number>(schema.minItems) && !(value.length >= schema.minItems)) {
      yield { type: ValueErrorType.ArrayMinItems, schema, path, value, message: `Expected array length to be greater or equal to ${schema.minItems}` }
    }
    if (IsDefined<number>(schema.maxItems) && !(value.length <= schema.maxItems)) {
      yield { type: ValueErrorType.ArrayMinItems, schema, path, value, message: `Expected array length to be less or equal to ${schema.maxItems}` }
    }
    // prettier-ignore
    if (schema.uniqueItems === true && !((function () { const set = new Set(); for (const element of value) { const hashed = ValueHash.Create(element); if (set.has(hashed)) { return false } else { set.add(hashed) } } return true })())) {
      yield { type: ValueErrorType.ArrayUniqueItems, schema, path, value, message: `Expected array elements to be unique` }
    }
    for (let i = 0; i < value.length; i++) {
      yield* Visit(schema.items, references, `${path}/${i}`, value[i])
    }
  }
  function* BigInt(schema: Types.TBigInt, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!IsBigInt(value)) {
      return yield { type: ValueErrorType.BigInt, schema, path, value, message: `Expected bigint` }
    }
    if (IsDefined<bigint>(schema.multipleOf) && !(value % schema.multipleOf === globalThis.BigInt(0))) {
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
  function* Boolean(schema: Types.TBoolean, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'boolean')) {
      return yield { type: ValueErrorType.Boolean, schema, path, value, message: `Expected boolean` }
    }
  }
  function* Constructor(schema: Types.TConstructor, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    yield* Visit(schema.returns, references, path, value.prototype)
  }
  function* Date(schema: Types.TNumeric, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(value instanceof globalThis.Date)) {
      return yield { type: ValueErrorType.Date, schema, path, value, message: `Expected Date object` }
    }
    if (!globalThis.isFinite(value.getTime())) {
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
  function* Function(schema: Types.TFunction, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'function')) {
      return yield { type: ValueErrorType.Function, schema, path, value, message: `Expected function` }
    }
  }
  function* Integer(schema: Types.TNumeric, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!IsInteger(value)) {
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
  function* Intersect(schema: Types.TIntersect, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    for (const subschema of schema.allOf) {
      const next = Visit(subschema, references, path, value).next()
      if (!next.done) {
        yield next.value
        yield { type: ValueErrorType.Intersect, schema, path, value, message: `Expected all sub schemas to be valid` }
        return
      }
    }
    if (schema.unevaluatedProperties === false) {
      const schemaKeys = Types.KeyResolver.Resolve(schema)
      const valueKeys = globalThis.Object.getOwnPropertyNames(value)
      for (const valueKey of valueKeys) {
        if (!schemaKeys.includes(valueKey)) {
          yield { type: ValueErrorType.IntersectUnevaluatedProperties, schema, path: `${path}/${valueKey}`, value, message: `Unexpected property` }
        }
      }
    }
    if (typeof schema.unevaluatedProperties === 'object') {
      const schemaKeys = Types.KeyResolver.Resolve(schema)
      const valueKeys = globalThis.Object.getOwnPropertyNames(value)
      for (const valueKey of valueKeys) {
        if (!schemaKeys.includes(valueKey)) {
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
  function* Literal(schema: Types.TLiteral, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(value === schema.const)) {
      const error = typeof schema.const === 'string' ? `'${schema.const}'` : schema.const
      return yield { type: ValueErrorType.Literal, schema, path, value, message: `Expected ${error}` }
    }
  }
  function* Never(schema: Types.TNever, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    yield { type: ValueErrorType.Never, schema, path, value, message: `Value cannot be validated` }
  }
  function* Not(schema: Types.TNot, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (Visit(schema.allOf[0].not, references, path, value).next().done === true) {
      yield { type: ValueErrorType.Not, schema, path, value, message: `Value should not validate` }
    }
    yield* Visit(schema.allOf[1], references, path, value)
  }
  function* Null(schema: Types.TNull, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(value === null)) {
      return yield { type: ValueErrorType.Null, schema, path, value, message: `Expected null` }
    }
  }
  function* Number(schema: Types.TNumeric, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
      yield { type: ValueErrorType.NumberMaximum, schema, path, value, message: `Expected number to be greater or equal to ${schema.minimum}` }
    }
    if (IsDefined<number>(schema.maximum) && !(value <= schema.maximum)) {
      yield { type: ValueErrorType.NumberMinumum, schema, path, value, message: `Expected number to be less or equal to ${schema.maximum}` }
    }
  }
  function* Object(schema: Types.TObject, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!IsObject(value)) {
      return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected object` }
    }
    if (IsDefined<number>(schema.minProperties) && !(globalThis.Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
      yield { type: ValueErrorType.ObjectMinProperties, schema, path, value, message: `Expected object to have at least ${schema.minProperties} properties` }
    }
    if (IsDefined<number>(schema.maxProperties) && !(globalThis.Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
      yield { type: ValueErrorType.ObjectMaxProperties, schema, path, value, message: `Expected object to have less than ${schema.minProperties} properties` }
    }
    const requiredKeys = globalThis.Array.isArray(schema.required) ? schema.required : ([] as string[])
    const knownKeys = globalThis.Object.getOwnPropertyNames(schema.properties)
    const unknownKeys = globalThis.Object.getOwnPropertyNames(value)
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
  function* Promise(schema: Types.TPromise, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'object' && typeof value.then === 'function')) {
      yield { type: ValueErrorType.Promise, schema, path, value, message: `Expected Promise` }
    }
  }
  function* Record(schema: Types.TRecord, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!IsRecordObject(value)) {
      return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected record object` }
    }
    if (IsDefined<number>(schema.minProperties) && !(globalThis.Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
      yield { type: ValueErrorType.ObjectMinProperties, schema, path, value, message: `Expected object to have at least ${schema.minProperties} properties` }
    }
    if (IsDefined<number>(schema.maxProperties) && !(globalThis.Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
      yield { type: ValueErrorType.ObjectMaxProperties, schema, path, value, message: `Expected object to have less than ${schema.minProperties} properties` }
    }
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const regex = new RegExp(keyPattern)
    if (!globalThis.Object.getOwnPropertyNames(value).every((key) => regex.test(key))) {
      const numeric = keyPattern === Types.PatternNumberExact
      const type = numeric ? ValueErrorType.RecordKeyNumeric : ValueErrorType.RecordKeyString
      const message = numeric ? 'Expected all object property keys to be numeric' : 'Expected all object property keys to be strings'
      return yield { type, schema, path, value, message }
    }
    for (const [propKey, propValue] of globalThis.Object.entries(value)) {
      yield* Visit(valueSchema, references, `${path}/${propKey}`, propValue)
    }
  }
  function* Ref(schema: Types.TRef<any>, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
    if (index === -1) throw new ValueErrorsDereferenceError(schema)
    const target = references[index]
    yield* Visit(target, references, path, value)
  }
  function* String(schema: Types.TString, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!IsString(value)) {
      return yield { type: ValueErrorType.String, schema, path, value, message: 'Expected string' }
    }
    if (IsDefined<number>(schema.minLength) && !(value.length >= schema.minLength)) {
      yield { type: ValueErrorType.StringMinLength, schema, path, value, message: `Expected string length greater or equal to ${schema.minLength}` }
    }
    if (IsDefined<number>(schema.maxLength) && !(value.length <= schema.maxLength)) {
      yield { type: ValueErrorType.StringMaxLength, schema, path, value, message: `Expected string length less or equal to ${schema.maxLength}` }
    }
    if (schema.pattern !== undefined) {
      const regex = new RegExp(schema.pattern)
      if (!regex.test(value)) {
        yield { type: ValueErrorType.StringPattern, schema, path, value, message: `Expected string to match pattern ${schema.pattern}` }
      }
    }
    if (schema.format !== undefined) {
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
  function* Symbol(schema: Types.TSymbol, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'symbol')) {
      return yield { type: ValueErrorType.Symbol, schema, path, value, message: 'Expected symbol' }
    }
  }
  function* TemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!IsString(value)) {
      return yield { type: ValueErrorType.String, schema, path, value, message: 'Expected string' }
    }
    const regex = new RegExp(schema.pattern)
    if (!regex.test(value)) {
      yield { type: ValueErrorType.StringPattern, schema, path, value, message: `Expected string to match pattern ${schema.pattern}` }
    }
  }
  function* This(schema: Types.TThis, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
    if (index === -1) throw new ValueErrorsDereferenceError(schema)
    const target = references[index]
    yield* Visit(target, references, path, value)
  }
  function* Tuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!globalThis.Array.isArray(value)) {
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
  function* Undefined(schema: Types.TUndefined, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(value === undefined)) {
      yield { type: ValueErrorType.Undefined, schema, path, value, message: `Expected undefined` }
    }
  }
  function* Union(schema: Types.TUnion, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
  function* Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(value instanceof globalThis.Uint8Array)) {
      return yield { type: ValueErrorType.Uint8Array, schema, path, value, message: `Expected Uint8Array` }
    }
    if (IsDefined<number>(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
      yield { type: ValueErrorType.Uint8ArrayMaxByteLength, schema, path, value, message: `Expected Uint8Array to have a byte length less or equal to ${schema.maxByteLength}` }
    }
    if (IsDefined<number>(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
      yield { type: ValueErrorType.Uint8ArrayMinByteLength, schema, path, value, message: `Expected Uint8Array to have a byte length greater or equal to ${schema.maxByteLength}` }
    }
  }
  function* Unknown(schema: Types.TUnknown, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {}
  function* Void(schema: Types.TVoid, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!IsVoid(value)) {
      return yield { type: ValueErrorType.Void, schema, path, value, message: `Expected void` }
    }
  }
  function* UserDefined(schema: Types.TSchema, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
        return yield* Any(schema_, references_, path, value)
      case 'Array':
        return yield* Array(schema_, references_, path, value)
      case 'BigInt':
        return yield* BigInt(schema_, references_, path, value)
      case 'Boolean':
        return yield* Boolean(schema_, references_, path, value)
      case 'Constructor':
        return yield* Constructor(schema_, references_, path, value)
      case 'Date':
        return yield* Date(schema_, references_, path, value)
      case 'Function':
        return yield* Function(schema_, references_, path, value)
      case 'Integer':
        return yield* Integer(schema_, references_, path, value)
      case 'Intersect':
        return yield* Intersect(schema_, references_, path, value)
      case 'Literal':
        return yield* Literal(schema_, references_, path, value)
      case 'Never':
        return yield* Never(schema_, references_, path, value)
      case 'Not':
        return yield* Not(schema_, references_, path, value)
      case 'Null':
        return yield* Null(schema_, references_, path, value)
      case 'Number':
        return yield* Number(schema_, references_, path, value)
      case 'Object':
        return yield* Object(schema_, references_, path, value)
      case 'Promise':
        return yield* Promise(schema_, references_, path, value)
      case 'Record':
        return yield* Record(schema_, references_, path, value)
      case 'Ref':
        return yield* Ref(schema_, references_, path, value)
      case 'String':
        return yield* String(schema_, references_, path, value)
      case 'Symbol':
        return yield* Symbol(schema_, references_, path, value)
      case 'TemplateLiteral':
        return yield* TemplateLiteral(schema_, references_, path, value)
      case 'This':
        return yield* This(schema_, references_, path, value)
      case 'Tuple':
        return yield* Tuple(schema_, references_, path, value)
      case 'Undefined':
        return yield* Undefined(schema_, references_, path, value)
      case 'Union':
        return yield* Union(schema_, references_, path, value)
      case 'Uint8Array':
        return yield* Uint8Array(schema_, references_, path, value)
      case 'Unknown':
        return yield* Unknown(schema_, references_, path, value)
      case 'Void':
        return yield* Void(schema_, references_, path, value)
      default:
        if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueErrorsUnknownTypeError(schema)
        return yield* UserDefined(schema_, references_, path, value)
    }
  }
  export function Errors<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: any): ValueErrorIterator {
    const iterator = Visit(schema, references, '', value)
    return new ValueErrorIterator(iterator)
  }
}
