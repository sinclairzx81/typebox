/*--------------------------------------------------------------------------

@sinclair/typebox/system

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

import { IsObject, IsArray, IsNumber, IsUndefined } from '../value/guard'
import { ValueErrorType } from '../errors/errors'
import * as Types from '../typebox'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class TypeSystemDuplicateTypeKind extends Types.TypeBoxError {
  constructor(kind: string) {
    super(`Duplicate type kind '${kind}' detected`)
  }
}
export class TypeSystemDuplicateFormat extends Types.TypeBoxError {
  constructor(kind: string) {
    super(`Duplicate string format '${kind}' detected`)
  }
}
// -------------------------------------------------------------------------------------------
// TypeSystem
// -------------------------------------------------------------------------------------------
/** Creates user defined types and formats and provides overrides for value checking behaviours */
export namespace TypeSystem {
  /** Creates a new type */
  export function Type<Type, Options = Record<PropertyKey, unknown>>(kind: string, check: (options: Options, value: unknown) => boolean) {
    if (Types.TypeRegistry.Has(kind)) throw new TypeSystemDuplicateTypeKind(kind)
    Types.TypeRegistry.Set(kind, check)
    return (options: Partial<Options> = {}) => Types.Type.Unsafe<Type>({ ...options, [Types.Kind]: kind })
  }
  /** Creates a new string format */
  export function Format<F extends string>(format: F, check: (value: string) => boolean): F {
    if (Types.FormatRegistry.Has(format)) throw new TypeSystemDuplicateFormat(format)
    Types.FormatRegistry.Set(format, check)
    return format
  }
}
// --------------------------------------------------------------------------
// TypeSystemErrorFunction
// --------------------------------------------------------------------------
/** Manages error message providers */
export namespace TypeSystemErrorFunction {
  let errorMessageFunction: ErrorFunction = DefaultErrorFunction
  /** Resets the error message function to en-us */
  export function Reset() {
    errorMessageFunction = DefaultErrorFunction
  }
  /** Sets the error message function used to generate error messages */
  export function Set(callback: ErrorFunction) {
    errorMessageFunction = callback
  }
  /** Gets the error message function */
  export function Get(): ErrorFunction {
    return errorMessageFunction
  }
}
// --------------------------------------------------------------------------
// TypeSystemPolicy
// --------------------------------------------------------------------------
/** Shared assertion routines used by the value and errors modules */
export namespace TypeSystemPolicy {
  /** Sets whether TypeBox should assert optional properties using the TypeScript `exactOptionalPropertyTypes` assertion policy. The default is `false` */
  export let ExactOptionalPropertyTypes: boolean = false
  /** Sets whether arrays should be treated as a kind of objects. The default is `false` */
  export let AllowArrayObject: boolean = false
  /** Sets whether `NaN` or `Infinity` should be treated as valid numeric values. The default is `false` */
  export let AllowNaN: boolean = false
  /** Sets whether `null` should validate for void types. The default is `false` */
  export let AllowNullVoid: boolean = false
  /** Asserts this value using the ExactOptionalPropertyTypes policy */
  export function IsExactOptionalProperty(value: Record<keyof any, unknown>, key: string) {
    return ExactOptionalPropertyTypes ? key in value : value[key] !== undefined
  }
  /** Asserts this value using the AllowArrayObjects policy */
  export function IsObjectLike(value: unknown): value is Record<keyof any, unknown> {
    const isObject = IsObject(value)
    return AllowArrayObject ? isObject : isObject && !IsArray(value)
  }
  /** Asserts this value as a record using the AllowArrayObjects policy */
  export function IsRecordLike(value: unknown): value is Record<keyof any, unknown> {
    return IsObjectLike(value) && !(value instanceof Date) && !(value instanceof Uint8Array)
  }
  /** Asserts this value using the AllowNaN policy */
  export function IsNumberLike(value: unknown): value is number {
    const isNumber = IsNumber(value)
    return AllowNaN ? isNumber : isNumber && Number.isFinite(value)
  }
  /** Asserts this value using the AllowVoidNull policy */
  export function IsVoidLike(value: unknown): value is void {
    const isUndefined = IsUndefined(value)
    return AllowNullVoid ? isUndefined || value === null : isUndefined
  }
}
// --------------------------------------------------------------------------
// ErrorFunction
// --------------------------------------------------------------------------
export type ErrorFunction = (schema: Types.TSchema, type: ValueErrorType) => string
// --------------------------------------------------------------------------
// DefaultErrorFunction
// --------------------------------------------------------------------------
/** Creates an error message using en-US as the default locale */
export function DefaultErrorFunction(schema: Types.TSchema, errorType: ValueErrorType) {
  switch (errorType) {
    case ValueErrorType.ArrayContains:
      return 'Expected array to contain at least one matching value'
    case ValueErrorType.ArrayMaxContains:
      return `Expected array to contain no more than ${schema.maxContains} matching values`
    case ValueErrorType.ArrayMinContains:
      return `Expected array to contain at least ${schema.minContains} matching values`
    case ValueErrorType.ArrayMaxItems:
      return `Expected array length to be less or equal to ${schema.maxItems}`
    case ValueErrorType.ArrayMinItems:
      return `Expected array length to be greater or equal to ${schema.minItems}`
    case ValueErrorType.ArrayUniqueItems:
      return 'Expected array elements to be unique'
    case ValueErrorType.Array:
      return 'Expected array'
    case ValueErrorType.AsyncIterator:
      return 'Expected AsyncIterator'
    case ValueErrorType.BigIntExclusiveMaximum:
      return `Expected bigint to be less than ${schema.exclusiveMaximum}`
    case ValueErrorType.BigIntExclusiveMinimum:
      return `Expected bigint to be greater than ${schema.exclusiveMinimum}`
    case ValueErrorType.BigIntMaximum:
      return `Expected bigint to be less or equal to ${schema.maximum}`
    case ValueErrorType.BigIntMinimum:
      return `Expected bigint to be greater or equal to ${schema.minimum}`
    case ValueErrorType.BigIntMultipleOf:
      return `Expected bigint to be a multiple of ${schema.multipleOf}`
    case ValueErrorType.BigInt:
      return 'Expected bigint'
    case ValueErrorType.Boolean:
      return 'Expected boolean'
    case ValueErrorType.DateExclusiveMinimumTimestamp:
      return `Expected Date timestamp to be greater than ${schema.exclusiveMinimumTimestamp}`
    case ValueErrorType.DateExclusiveMaximumTimestamp:
      return `Expected Date timestamp to be less than ${schema.exclusiveMaximumTimestamp}`
    case ValueErrorType.DateMinimumTimestamp:
      return `Expected Date timestamp to be greater or equal to ${schema.minimumTimestamp}`
    case ValueErrorType.DateMaximumTimestamp:
      return `Expected Date timestamp to be less or equal to ${schema.maximumTimestamp}`
    case ValueErrorType.DateMultipleOfTimestamp:
      return `Expected Date timestamp to be a multiple of ${schema.multipleOfTimestamp}`
    case ValueErrorType.Date:
      return 'Expected Date'
    case ValueErrorType.Function:
      return 'Expected function'
    case ValueErrorType.IntegerExclusiveMaximum:
      return `Expected integer to be less than ${schema.exclusiveMaximum}`
    case ValueErrorType.IntegerExclusiveMinimum:
      return `Expected integer to be greater than ${schema.exclusiveMinimum}`
    case ValueErrorType.IntegerMaximum:
      return `Expected integer to be less or equal to ${schema.maximum}`
    case ValueErrorType.IntegerMinimum:
      return `Expected integer to be greater or equal to ${schema.minimum}`
    case ValueErrorType.IntegerMultipleOf:
      return `Expected integer to be a multiple of ${schema.multipleOf}`
    case ValueErrorType.Integer:
      return 'Expected integer'
    case ValueErrorType.IntersectUnevaluatedProperties:
      return 'Unexpected property'
    case ValueErrorType.Intersect:
      return 'Expected all values to match'
    case ValueErrorType.Iterator:
      return 'Expected Iterator'
    case ValueErrorType.Literal:
      return `Expected ${typeof schema.const === 'string' ? `'${schema.const}'` : schema.const}`
    case ValueErrorType.Never:
      return 'Never'
    case ValueErrorType.Not:
      return 'Value should not match'
    case ValueErrorType.Null:
      return 'Expected null'
    case ValueErrorType.NumberExclusiveMaximum:
      return `Expected number to be less than ${schema.exclusiveMaximum}`
    case ValueErrorType.NumberExclusiveMinimum:
      return `Expected number to be greater than ${schema.exclusiveMinimum}`
    case ValueErrorType.NumberMaximum:
      return `Expected number to be less or equal to ${schema.maximum}`
    case ValueErrorType.NumberMinimum:
      return `Expected number to be greater or equal to ${schema.minimum}`
    case ValueErrorType.NumberMultipleOf:
      return `Expected number to be a multiple of ${schema.multipleOf}`
    case ValueErrorType.Number:
      return 'Expected number'
    case ValueErrorType.Object:
      return 'Expected object'
    case ValueErrorType.ObjectAdditionalProperties:
      return 'Unexpected property'
    case ValueErrorType.ObjectMaxProperties:
      return `Expected object to have no more than ${schema.maxProperties} properties`
    case ValueErrorType.ObjectMinProperties:
      return `Expected object to have at least ${schema.minProperties} properties`
    case ValueErrorType.ObjectRequiredProperty:
      return 'Required property'
    case ValueErrorType.Promise:
      return 'Expected Promise'
    case ValueErrorType.StringFormatUnknown:
      return `Unknown format '${schema.format}'`
    case ValueErrorType.StringFormat:
      return `Expected string to match '${schema.format}' format`
    case ValueErrorType.StringMaxLength:
      return `Expected string length less or equal to ${schema.maxLength}`
    case ValueErrorType.StringMinLength:
      return `Expected string length greater or equal to ${schema.minLength}`
    case ValueErrorType.StringPattern:
      return `Expected string to match '${schema.pattern}'`
    case ValueErrorType.String:
      return 'Expected string'
    case ValueErrorType.Symbol:
      return 'Expected symbol'
    case ValueErrorType.TupleLength:
      return `Expected tuple to have ${schema.maxItems || 0} elements`
    case ValueErrorType.Tuple:
      return 'Expected tuple'
    case ValueErrorType.Uint8ArrayMaxByteLength:
      return `Expected byte length less or equal to ${schema.maxByteLength}`
    case ValueErrorType.Uint8ArrayMinByteLength:
      return `Expected byte length greater or equal to ${schema.minByteLength}`
    case ValueErrorType.Uint8Array:
      return 'Expected Uint8Array'
    case ValueErrorType.Undefined:
      return 'Expected undefined'
    case ValueErrorType.Union:
      return 'Expected union value'
    case ValueErrorType.Void:
      return 'Expected void'
    case ValueErrorType.Kind:
      return `Expected kind '${schema[Types.Kind]}'`
    default:
      return 'Unknown error type'
  }
}
