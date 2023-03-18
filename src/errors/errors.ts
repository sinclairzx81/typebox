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
/** Provides functionality to generate a sequence of errors against a TypeBox type.  */
export namespace ValueErrors {
  function IsBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  }
  function IsNumber(value: unknown): value is number {
    return typeof value === 'number' && globalThis.isFinite(value)
  }

  function* Any(schema: Types.TAny, path: string, value: any): IterableIterator<ValueError> {}

  function* Array(schema: Types.TArray, path: string, value: any): IterableIterator<ValueError> {
    if (!globalThis.Array.isArray(value)) {
      return yield { type: ValueErrorType.Array, schema, path, value, message: `Expected array` }
    }
    if (IsNumber(schema.minItems) && !(value.length >= schema.minItems)) {
      yield { type: ValueErrorType.ArrayMinItems, schema, path, value, message: `Expected array length to be greater or equal to ${schema.minItems}` }
    }
    if (IsNumber(schema.maxItems) && !(value.length <= schema.maxItems)) {
      yield { type: ValueErrorType.ArrayMinItems, schema, path, value, message: `Expected array length to be less or equal to ${schema.maxItems}` }
    }
    // prettier-ignore
    if (schema.uniqueItems === true && !((function () { const set = new Set(); for (const element of value) { const hashed = ValueHash.Create(element); if (set.has(hashed)) { return false } else { set.add(hashed) } } return true })())) {
      yield { type: ValueErrorType.ArrayUniqueItems, schema, path, value, message: `Expected array elements to be unique` }
    }
    for (let i = 0; i < value.length; i++) {
      yield* Visit(schema.items, `${path}/${i}`, value[i])
    }
  }
  function* BigInt(schema: Types.TBigInt, path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'bigint')) {
      return yield { type: ValueErrorType.BigInt, schema, path, value, message: `Expected bigint` }
    }
    if (IsBigInt(schema.multipleOf) && !(value % schema.multipleOf === globalThis.BigInt(0))) {
      yield { type: ValueErrorType.BigIntMultipleOf, schema, path, value, message: `Expected bigint to be a multiple of ${schema.multipleOf}` }
    }
    if (IsBigInt(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
      yield { type: ValueErrorType.BigIntExclusiveMinimum, schema, path, value, message: `Expected bigint to be greater than ${schema.exclusiveMinimum}` }
    }
    if (IsBigInt(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
      yield { type: ValueErrorType.BigIntExclusiveMaximum, schema, path, value, message: `Expected bigint to be less than ${schema.exclusiveMaximum}` }
    }
    if (IsBigInt(schema.minimum) && !(value >= schema.minimum)) {
      yield { type: ValueErrorType.BigIntMinimum, schema, path, value, message: `Expected bigint to be greater or equal to ${schema.minimum}` }
    }
    if (IsBigInt(schema.maximum) && !(value <= schema.maximum)) {
      yield { type: ValueErrorType.BigIntMaximum, schema, path, value, message: `Expected bigint to be less or equal to ${schema.maximum}` }
    }
  }
  function* Boolean(schema: Types.TBoolean, path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'boolean')) {
      return yield { type: ValueErrorType.Boolean, schema, path, value, message: `Expected boolean` }
    }
  }

  function* Constructor(schema: Types.TConstructor, path: string, value: any): IterableIterator<ValueError> {
    yield* Visit(schema.returns, path, value.prototype)
  }

  function* Date(schema: Types.TNumeric, path: string, value: any): IterableIterator<ValueError> {
    if (!(value instanceof globalThis.Date)) {
      return yield { type: ValueErrorType.Date, schema, path, value, message: `Expected Date object` }
    }
    if (!globalThis.isFinite(value.getTime())) {
      return yield { type: ValueErrorType.Date, schema, path, value, message: `Invalid Date` }
    }
    if (IsNumber(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) {
      yield { type: ValueErrorType.DateExclusiveMinimumTimestamp, schema, path, value, message: `Expected Date timestamp to be greater than ${schema.exclusiveMinimum}` }
    }
    if (IsNumber(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) {
      yield { type: ValueErrorType.DateExclusiveMaximumTimestamp, schema, path, value, message: `Expected Date timestamp to be less than ${schema.exclusiveMaximum}` }
    }
    if (IsNumber(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) {
      yield { type: ValueErrorType.DateMinimumTimestamp, schema, path, value, message: `Expected Date timestamp to be greater or equal to ${schema.minimum}` }
    }
    if (IsNumber(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) {
      yield { type: ValueErrorType.DateMaximumTimestamp, schema, path, value, message: `Expected Date timestamp to be less or equal to ${schema.maximum}` }
    }
  }

  function* Function(schema: Types.TFunction, path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'function')) {
      return yield { type: ValueErrorType.Function, schema, path, value, message: `Expected function` }
    }
  }

  function* Integer(schema: Types.TNumeric, path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'number' && globalThis.Number.isInteger(value))) {
      return yield { type: ValueErrorType.Integer, schema, path, value, message: `Expected integer` }
    }
    if (IsNumber(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
      yield { type: ValueErrorType.IntegerMultipleOf, schema, path, value, message: `Expected integer to be a multiple of ${schema.multipleOf}` }
    }
    if (IsNumber(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
      yield { type: ValueErrorType.IntegerExclusiveMinimum, schema, path, value, message: `Expected integer to be greater than ${schema.exclusiveMinimum}` }
    }
    if (IsNumber(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
      yield { type: ValueErrorType.IntegerExclusiveMaximum, schema, path, value, message: `Expected integer to be less than ${schema.exclusiveMaximum}` }
    }
    if (IsNumber(schema.minimum) && !(value >= schema.minimum)) {
      yield { type: ValueErrorType.IntegerMinimum, schema, path, value, message: `Expected integer to be greater or equal to ${schema.minimum}` }
    }
    if (IsNumber(schema.maximum) && !(value <= schema.maximum)) {
      yield { type: ValueErrorType.IntegerMaximum, schema, path, value, message: `Expected integer to be less or equal to ${schema.maximum}` }
    }
  }

  function* Intersect(schema: Types.TIntersect, path: string, value: any): IterableIterator<ValueError> {
    for (const subschema of schema.allOf) {
      const next = Visit(subschema, path, value).next()
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
          const next = Visit(schema.unevaluatedProperties, `${path}/${valueKey}`, value[valueKey]).next()
          if (!next.done) {
            yield next.value
            yield { type: ValueErrorType.IntersectUnevaluatedProperties, schema, path: `${path}/${valueKey}`, value, message: `Invalid additional property` }
            return
          }
        }
      }
    }
  }

  function* Literal(schema: Types.TLiteral, path: string, value: any): IterableIterator<ValueError> {
    if (!(value === schema.const)) {
      const error = typeof schema.const === 'string' ? `'${schema.const}'` : schema.const
      return yield { type: ValueErrorType.Literal, schema, path, value, message: `Expected ${error}` }
    }
  }

  function* Never(schema: Types.TNever, path: string, value: any): IterableIterator<ValueError> {
    yield { type: ValueErrorType.Never, schema, path, value, message: `Value cannot be validated` }
  }

  function* Not(schema: Types.TNot, path: string, value: any): IterableIterator<ValueError> {
    if (Visit(schema.allOf[0].not, path, value).next().done === true) {
      yield { type: ValueErrorType.Not, schema, path, value, message: `Value should not validate` }
    }
    yield* Visit(schema.allOf[1], path, value)
  }

  function* Null(schema: Types.TNull, path: string, value: any): IterableIterator<ValueError> {
    if (!(value === null)) {
      return yield { type: ValueErrorType.Null, schema, path, value, message: `Expected null` }
    }
  }

  function* Number(schema: Types.TNumeric, path: string, value: any): IterableIterator<ValueError> {
    if (TypeSystem.AllowNaN) {
      if (!(typeof value === 'number')) {
        return yield { type: ValueErrorType.Number, schema, path, value, message: `Expected number` }
      }
    } else {
      if (!(typeof value === 'number' && globalThis.Number.isFinite(value))) {
        return yield { type: ValueErrorType.Number, schema, path, value, message: `Expected number` }
      }
    }
    if (IsNumber(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
      yield { type: ValueErrorType.NumberMultipleOf, schema, path, value, message: `Expected number to be a multiple of ${schema.multipleOf}` }
    }
    if (IsNumber(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
      yield { type: ValueErrorType.NumberExclusiveMinimum, schema, path, value, message: `Expected number to be greater than ${schema.exclusiveMinimum}` }
    }
    if (IsNumber(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
      yield { type: ValueErrorType.NumberExclusiveMaximum, schema, path, value, message: `Expected number to be less than ${schema.exclusiveMaximum}` }
    }
    if (IsNumber(schema.minimum) && !(value >= schema.minimum)) {
      yield { type: ValueErrorType.NumberMaximum, schema, path, value, message: `Expected number to be greater or equal to ${schema.minimum}` }
    }
    if (IsNumber(schema.maximum) && !(value <= schema.maximum)) {
      yield { type: ValueErrorType.NumberMinumum, schema, path, value, message: `Expected number to be less or equal to ${schema.maximum}` }
    }
  }

  function* Object(schema: Types.TObject, path: string, value: any): IterableIterator<ValueError> {
    if (TypeSystem.AllowArrayObjects) {
      if (!(typeof value === 'object' && value !== null)) {
        return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected object` }
      }
    } else {
      if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
        return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected object` }
      }
    }
    if (IsNumber(schema.minProperties) && !(globalThis.Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
      yield { type: ValueErrorType.ObjectMinProperties, schema, path, value, message: `Expected object to have at least ${schema.minProperties} properties` }
    }
    if (IsNumber(schema.maxProperties) && !(globalThis.Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
      yield { type: ValueErrorType.ObjectMaxProperties, schema, path, value, message: `Expected object to have less than ${schema.minProperties} properties` }
    }
    const requiredKeys = globalThis.Array.isArray(schema.required) ? schema.required : ([] as string[])
    const schemaKeys = globalThis.Object.getOwnPropertyNames(schema.properties)
    const valueKeys = globalThis.Object.getOwnPropertyNames(value)
    for (const schemaKey of schemaKeys) {
      const property = schema.properties[schemaKey]
      if (schema.required && schema.required.includes(schemaKey)) {
        yield* Visit(property, `${path}/${schemaKey}`, value[schemaKey])
        if (Types.ExtendsUndefined.Check(schema) && !(schemaKey in value)) {
          yield { type: ValueErrorType.ObjectRequiredProperties, schema: property, path: `${path}/${schemaKey}`, value: undefined, message: `Expected required property` }
        }
      } else {
        if (schemaKey in value) {
          yield* Visit(property, `${path}/${schemaKey}`, value[schemaKey])
        }
      }
    }
    for (const requiredKey of requiredKeys) {
      if (valueKeys.includes(requiredKey)) continue
      yield { type: ValueErrorType.ObjectRequiredProperties, schema: schema.properties[requiredKey], path: `${path}/${requiredKey}`, value: undefined, message: `Expected required property` }
    }
    if (schema.additionalProperties === false) {
      for (const valueKey of valueKeys) {
        if (!schemaKeys.includes(valueKey)) {
          yield { type: ValueErrorType.ObjectAdditionalProperties, schema, path: `${path}/${valueKey}`, value: value[valueKey], message: `Unexpected property` }
        }
      }
    }
    if (typeof schema.additionalProperties === 'object') {
      for (const valueKey of valueKeys) {
        if (schemaKeys.includes(valueKey)) continue
        yield* Visit(schema.additionalProperties as Types.TSchema, `${path}/${valueKey}`, value[valueKey])
      }
    }
  }

  function* Promise(schema: Types.TPromise, path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'object' && typeof value.then === 'function')) {
      yield { type: ValueErrorType.Promise, schema, path, value, message: `Expected Promise` }
    }
  }

  function* Record(schema: Types.TRecord, path: string, value: any): IterableIterator<ValueError> {
    if (TypeSystem.AllowArrayObjects) {
      if (!(typeof value === 'object' && value !== null && !(value instanceof globalThis.Date))) {
        return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected object` }
      }
    } else {
      if (!(typeof value === 'object' && value !== null && !(value instanceof globalThis.Date) && !globalThis.Array.isArray(value))) {
        return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected object` }
      }
    }
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const regex = new RegExp(keyPattern)
    if (!globalThis.Object.getOwnPropertyNames(value).every((key) => regex.test(key))) {
      const numeric = keyPattern === '^(0|[1-9][0-9]*)$'
      const type = numeric ? ValueErrorType.RecordKeyNumeric : ValueErrorType.RecordKeyString
      const message = numeric ? 'Expected all object property keys to be numeric' : 'Expected all object property keys to be strings'
      return yield { type, schema, path, value, message }
    }
    for (const [propKey, propValue] of globalThis.Object.entries(value)) {
      yield* Visit(valueSchema, `${path}/${propKey}`, propValue)
    }
  }

  function* Ref(schema: Types.TRef<any>, path: string, value: any): IterableIterator<ValueError> {
    yield* Visit(Types.ReferenceRegistry.DerefOne(schema), path, value)
  }

  function* Self(schema: Types.TSelf, path: string, value: any): IterableIterator<ValueError> {
    yield* Visit(Types.ReferenceRegistry.DerefOne(schema), path, value)
  }

  function* String(schema: Types.TString, path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'string')) {
      return yield { type: ValueErrorType.String, schema, path, value, message: 'Expected string' }
    }
    if (IsNumber(schema.minLength) && !(value.length >= schema.minLength)) {
      yield { type: ValueErrorType.StringMinLength, schema, path, value, message: `Expected string length greater or equal to ${schema.minLength}` }
    }
    if (IsNumber(schema.maxLength) && !(value.length <= schema.maxLength)) {
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
  function* Symbol(schema: Types.TSymbol, path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'symbol')) {
      return yield { type: ValueErrorType.Symbol, schema, path, value, message: 'Expected symbol' }
    }
  }
  function* Tuple(schema: Types.TTuple<any[]>, path: string, value: any): IterableIterator<ValueError> {
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
      yield* Visit(schema.items[i], `${path}/${i}`, value[i])
    }
  }

  function* Undefined(schema: Types.TUndefined, path: string, value: any): IterableIterator<ValueError> {
    if (!(value === undefined)) {
      yield { type: ValueErrorType.Undefined, schema, path, value, message: `Expected undefined` }
    }
  }

  function* Union(schema: Types.TUnion, path: string, value: any): IterableIterator<ValueError> {
    const errors: ValueError[] = []
    for (const inner of schema.anyOf) {
      const variantErrors = [...Visit(inner, path, value)]
      if (variantErrors.length === 0) return
      errors.push(...variantErrors)
    }
    for (const error of errors) {
      yield error
    }
    if (errors.length > 0) {
      yield { type: ValueErrorType.Union, schema, path, value, message: 'Expected value of union' }
    }
  }

  function* Uint8Array(schema: Types.TUint8Array, path: string, value: any): IterableIterator<ValueError> {
    if (!(value instanceof globalThis.Uint8Array)) {
      return yield { type: ValueErrorType.Uint8Array, schema, path, value, message: `Expected Uint8Array` }
    }
    if (IsNumber(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
      yield { type: ValueErrorType.Uint8ArrayMaxByteLength, schema, path, value, message: `Expected Uint8Array to have a byte length less or equal to ${schema.maxByteLength}` }
    }
    if (IsNumber(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
      yield { type: ValueErrorType.Uint8ArrayMinByteLength, schema, path, value, message: `Expected Uint8Array to have a byte length greater or equal to ${schema.maxByteLength}` }
    }
  }

  function* Unknown(schema: Types.TUnknown, path: string, value: any): IterableIterator<ValueError> {}

  function* Void(schema: Types.TVoid, path: string, value: any): IterableIterator<ValueError> {
    if (TypeSystem.AllowVoidNull) {
      if (!(value === undefined || value === null)) {
        return yield { type: ValueErrorType.Void, schema, path, value, message: `Expected null or undefined` }
      }
    } else {
      if (!(value === undefined)) {
        return yield { type: ValueErrorType.Void, schema, path, value, message: `Expected undefined` }
      }
    }
  }

  function* UserDefined(schema: Types.TSchema, path: string, value: any): IterableIterator<ValueError> {
    const check = Types.TypeRegistry.Get(schema[Types.Kind])!
    if (!check(schema, value)) {
      return yield { type: ValueErrorType.Custom, schema, path, value, message: `Expected kind ${schema[Types.Kind]}` }
    }
  }

  function* Visit<T extends Types.TSchema>(schema: T, path: string, value: any): IterableIterator<ValueError> {
    const anySchema = schema as any
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return yield* Any(anySchema, path, value)
      case 'Array':
        return yield* Array(anySchema, path, value)
      case 'BigInt':
        return yield* BigInt(anySchema, path, value)
      case 'Boolean':
        return yield* Boolean(anySchema, path, value)
      case 'Constructor':
        return yield* Constructor(anySchema, path, value)
      case 'Date':
        return yield* Date(anySchema, path, value)
      case 'Function':
        return yield* Function(anySchema, path, value)
      case 'Integer':
        return yield* Integer(anySchema, path, value)
      case 'Intersect':
        return yield* Intersect(anySchema, path, value)
      case 'Literal':
        return yield* Literal(anySchema, path, value)
      case 'Never':
        return yield* Never(anySchema, path, value)
      case 'Not':
        return yield* Not(anySchema, path, value)
      case 'Null':
        return yield* Null(anySchema, path, value)
      case 'Number':
        return yield* Number(anySchema, path, value)
      case 'Object':
        return yield* Object(anySchema, path, value)
      case 'Promise':
        return yield* Promise(anySchema, path, value)
      case 'Record':
        return yield* Record(anySchema, path, value)
      case 'Ref':
        return yield* Ref(anySchema, path, value)
      case 'Self':
        return yield* Self(anySchema, path, value)
      case 'String':
        return yield* String(anySchema, path, value)
      case 'Symbol':
        return yield* Symbol(anySchema, path, value)
      case 'Tuple':
        return yield* Tuple(anySchema, path, value)
      case 'Undefined':
        return yield* Undefined(anySchema, path, value)
      case 'Union':
        return yield* Union(anySchema, path, value)
      case 'Uint8Array':
        return yield* Uint8Array(anySchema, path, value)
      case 'Unknown':
        return yield* Unknown(anySchema, path, value)
      case 'Void':
        return yield* Void(anySchema, path, value)
      default:
        if (!Types.TypeRegistry.Has(anySchema[Types.Kind])) throw new ValueErrorsUnknownTypeError(schema)
        return yield* UserDefined(anySchema, path, value)
    }
  }
  export function Errors<T extends Types.TSchema>(schema: T, value: any): ValueErrorIterator {
    return new ValueErrorIterator(Visit(schema, '', value))
  }
}
