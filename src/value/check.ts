/*--------------------------------------------------------------------------

@sinclair/typebox/value

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
import * as ValueGuard from './guard'
import * as ValueHash from './hash'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class ValueCheckUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super(`ValueCheck: ${schema[Types.Kind] ? `Unknown type '${schema[Types.Kind]}'` : 'Unknown type'}`)
  }
}
export class ValueCheckDereferenceError extends Error {
  constructor(public readonly schema: Types.TRef | Types.TThis) {
    super(`ValueCheck: Unable to dereference type with $id '${schema.$ref}'`)
  }
}
// --------------------------------------------------------------------------
// TypeGuards
// --------------------------------------------------------------------------
function IsAnyOrUnknown(schema: Types.TSchema) {
  return schema[Types.Kind] === 'Any' || schema[Types.Kind] === 'Unknown'
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
function TAny(schema: Types.TAny, references: Types.TSchema[], value: any): boolean {
  return true
}
function TArray(schema: Types.TArray, references: Types.TSchema[], value: any): boolean {
  if (!Array.isArray(value)) {
    return false
  }
  if (IsDefined<number>(schema.minItems) && !(value.length >= schema.minItems)) {
    return false
  }
  if (IsDefined<number>(schema.maxItems) && !(value.length <= schema.maxItems)) {
    return false
  }
  if (!value.every((value) => Visit(schema.items, references, value))) {
    return false
  }
  // prettier-ignore
  if (schema.uniqueItems === true && !((function() { const set = new Set(); for(const element of value) { const hashed = ValueHash.Hash(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true })())) {
      return false
    }
  // contains
  if (!(IsDefined(schema.contains) || IsNumber(schema.minContains) || IsNumber(schema.maxContains))) {
    return true // exit
  }
  const containsSchema = IsDefined<Types.TSchema>(schema.contains) ? schema.contains : Types.Type.Never()
  const containsCount = value.reduce((acc, value) => (Visit(containsSchema, references, value) ? acc + 1 : acc), 0)
  if (containsCount === 0) {
    return false
  }
  if (IsNumber(schema.minContains) && containsCount < schema.minContains) {
    return false
  }
  if (IsNumber(schema.maxContains) && containsCount > schema.maxContains) {
    return false
  }
  return true
}
function TAsyncIterator(schema: Types.TAsyncIterator, references: Types.TSchema[], value: any): boolean {
  return IsObject(value) && Symbol.asyncIterator in value
}
function TBigInt(schema: Types.TBigInt, references: Types.TSchema[], value: any): boolean {
  if (!ValueGuard.IsBigInt(value)) {
    return false
  }
  if (IsDefined<bigint>(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0))) {
    return false
  }
  if (IsDefined<bigint>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    return false
  }
  if (IsDefined<bigint>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    return false
  }
  if (IsDefined<bigint>(schema.minimum) && !(value >= schema.minimum)) {
    return false
  }
  if (IsDefined<bigint>(schema.maximum) && !(value <= schema.maximum)) {
    return false
  }
  return true
}
function TBoolean(schema: Types.TBoolean, references: Types.TSchema[], value: any): boolean {
  return typeof value === 'boolean'
}
function TConstructor(schema: Types.TConstructor, references: Types.TSchema[], value: any): boolean {
  return Visit(schema.returns, references, value.prototype)
}
function TDate(schema: Types.TDate, references: Types.TSchema[], value: any): boolean {
  if (!(value instanceof Date)) {
    return false
  }
  if (!IsNumber(value.getTime())) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) {
    return false
  }
  if (IsDefined<number>(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) {
    return false
  }
  if (IsDefined<number>(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) {
    return false
  }
  return true
}
function TFunction(schema: Types.TFunction, references: Types.TSchema[], value: any): boolean {
  return typeof value === 'function'
}
function TInteger(schema: Types.TInteger, references: Types.TSchema[], value: any): boolean {
  if (!ValueGuard.IsInteger(value)) {
    return false
  }
  if (IsDefined<number>(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    return false
  }
  if (IsDefined<number>(schema.minimum) && !(value >= schema.minimum)) {
    return false
  }
  if (IsDefined<number>(schema.maximum) && !(value <= schema.maximum)) {
    return false
  }
  return true
}
function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: any): boolean {
  const check1 = schema.allOf.every((schema) => Visit(schema, references, value))
  if (schema.unevaluatedProperties === false) {
    const keyPattern = new RegExp(Types.KeyResolver.ResolvePattern(schema))
    const check2 = Object.getOwnPropertyNames(value).every((key) => keyPattern.test(key))
    return check1 && check2
  } else if (Types.TypeGuard.TSchema(schema.unevaluatedProperties)) {
    const keyCheck = new RegExp(Types.KeyResolver.ResolvePattern(schema))
    const check2 = Object.getOwnPropertyNames(value).every((key) => keyCheck.test(key) || Visit(schema.unevaluatedProperties as Types.TSchema, references, value[key]))
    return check1 && check2
  } else {
    return check1
  }
}
function TIterator(schema: Types.TIterator, references: Types.TSchema[], value: any): boolean {
  return IsObject(value) && Symbol.iterator in value
}
function TLiteral(schema: Types.TLiteral, references: Types.TSchema[], value: any): boolean {
  return value === schema.const
}
function TNever(schema: Types.TNever, references: Types.TSchema[], value: any): boolean {
  return false
}
function TNot(schema: Types.TNot, references: Types.TSchema[], value: any): boolean {
  return !Visit(schema.not, references, value)
}
function TNull(schema: Types.TNull, references: Types.TSchema[], value: any): boolean {
  return value === null
}
function TNumber(schema: Types.TNumber, references: Types.TSchema[], value: any): boolean {
  if (!IsNumber(value)) {
    return false
  }
  if (IsDefined<number>(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    return false
  }
  if (IsDefined<number>(schema.minimum) && !(value >= schema.minimum)) {
    return false
  }
  if (IsDefined<number>(schema.maximum) && !(value <= schema.maximum)) {
    return false
  }
  return true
}
function TObject(schema: Types.TObject, references: Types.TSchema[], value: any): boolean {
  if (!IsObject(value)) {
    return false
  }
  if (IsDefined<number>(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    return false
  }
  if (IsDefined<number>(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    return false
  }
  const knownKeys = Object.getOwnPropertyNames(schema.properties)
  for (const knownKey of knownKeys) {
    const property = schema.properties[knownKey]
    if (schema.required && schema.required.includes(knownKey)) {
      if (!Visit(property, references, value[knownKey])) {
        return false
      }
      if ((Types.ExtendsUndefined.Check(property) || IsAnyOrUnknown(property)) && !(knownKey in value)) {
        return false
      }
    } else {
      if (IsExactOptionalProperty(value, knownKey) && !Visit(property, references, value[knownKey])) {
        return false
      }
    }
  }
  if (schema.additionalProperties === false) {
    const valueKeys = Object.getOwnPropertyNames(value)
    // optimization: value is valid if schemaKey length matches the valueKey length
    if (schema.required && schema.required.length === knownKeys.length && valueKeys.length === knownKeys.length) {
      return true
    } else {
      return valueKeys.every((valueKey) => knownKeys.includes(valueKey))
    }
  } else if (typeof schema.additionalProperties === 'object') {
    const valueKeys = Object.getOwnPropertyNames(value)
    return valueKeys.every((key) => knownKeys.includes(key) || Visit(schema.additionalProperties as Types.TSchema, references, value[key]))
  } else {
    return true
  }
}
function TPromise(schema: Types.TPromise<any>, references: Types.TSchema[], value: any): boolean {
  return typeof value === 'object' && typeof value.then === 'function'
}
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any): boolean {
  if (!IsRecordObject(value)) {
    return false
  }
  if (IsDefined<number>(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    return false
  }
  if (IsDefined<number>(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    return false
  }
  const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0]
  const regex = new RegExp(patternKey)
  return Object.entries(value).every(([key, value]) => {
    if (regex.test(key)) {
      return Visit(patternSchema, references, value)
    }
    if (typeof schema.additionalProperties === 'object') {
      return Visit(schema.additionalProperties, references, value)
    }
    if (schema.additionalProperties === false) {
      return false
    }
    return true
  })
}
function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: any): boolean {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueCheckDereferenceError(schema)
  const target = references[index]
  return Visit(target, references, value)
}
function TString(schema: Types.TString, references: Types.TSchema[], value: any): boolean {
  if (!ValueGuard.IsString(value)) {
    return false
  }
  if (IsDefined<number>(schema.minLength)) {
    if (!(value.length >= schema.minLength)) return false
  }
  if (IsDefined<number>(schema.maxLength)) {
    if (!(value.length <= schema.maxLength)) return false
  }
  if (IsDefined<string>(schema.pattern)) {
    const regex = new RegExp(schema.pattern)
    if (!regex.test(value)) return false
  }
  if (IsDefined<string>(schema.format)) {
    if (!Types.FormatRegistry.Has(schema.format)) return false
    const func = Types.FormatRegistry.Get(schema.format)!
    return func(value)
  }
  return true
}
function TSymbol(schema: Types.TSymbol, references: Types.TSchema[], value: any): boolean {
  if (!(typeof value === 'symbol')) {
    return false
  }
  return true
}
function TTemplateLiteral(schema: Types.TTemplateLiteralKind, references: Types.TSchema[], value: any): boolean {
  if (!ValueGuard.IsString(value)) {
    return false
  }
  return new RegExp(schema.pattern).test(value)
}
function TThis(schema: Types.TThis, references: Types.TSchema[], value: any): boolean {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueCheckDereferenceError(schema)
  const target = references[index]
  return Visit(target, references, value)
}
function TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: any): boolean {
  if (!ValueGuard.IsArray(value)) {
    return false
  }
  if (schema.items === undefined && !(value.length === 0)) {
    return false
  }
  if (!(value.length === schema.maxItems)) {
    return false
  }
  if (!schema.items) {
    return true
  }
  for (let i = 0; i < schema.items.length; i++) {
    if (!Visit(schema.items[i], references, value[i])) return false
  }
  return true
}
function TUndefined(schema: Types.TUndefined, references: Types.TSchema[], value: any): boolean {
  return value === undefined
}
function TUnion(schema: Types.TUnion<any[]>, references: Types.TSchema[], value: any): boolean {
  return schema.anyOf.some((inner) => Visit(inner, references, value))
}
function TUint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: any): boolean {
  if (!(value instanceof Uint8Array)) {
    return false
  }
  if (IsDefined<number>(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
    return false
  }
  if (IsDefined<number>(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
    return false
  }
  return true
}
function TUnknown(schema: Types.TUnknown, references: Types.TSchema[], value: any): boolean {
  return true
}
function TVoid(schema: Types.TVoid, references: Types.TSchema[], value: any): boolean {
  return IsVoid(value)
}
function TKind(schema: Types.TSchema, references: Types.TSchema[], value: unknown): boolean {
  if (!Types.TypeRegistry.Has(schema[Types.Kind])) return false
  const func = Types.TypeRegistry.Get(schema[Types.Kind])!
  return func(schema, value)
}
function Visit<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: any): boolean {
  const references_ = IsDefined<string>(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema_[Types.Kind]) {
    case 'Any':
      return TAny(schema_, references_, value)
    case 'Array':
      return TArray(schema_, references_, value)
    case 'AsyncIterator':
      return TAsyncIterator(schema_, references_, value)
    case 'BigInt':
      return TBigInt(schema_, references_, value)
    case 'Boolean':
      return TBoolean(schema_, references_, value)
    case 'Constructor':
      return TConstructor(schema_, references_, value)
    case 'Date':
      return TDate(schema_, references_, value)
    case 'Function':
      return TFunction(schema_, references_, value)
    case 'Integer':
      return TInteger(schema_, references_, value)
    case 'Intersect':
      return TIntersect(schema_, references_, value)
    case 'Iterator':
      return TIterator(schema_, references_, value)
    case 'Literal':
      return TLiteral(schema_, references_, value)
    case 'Never':
      return TNever(schema_, references_, value)
    case 'Not':
      return TNot(schema_, references_, value)
    case 'Null':
      return TNull(schema_, references_, value)
    case 'Number':
      return TNumber(schema_, references_, value)
    case 'Object':
      return TObject(schema_, references_, value)
    case 'Promise':
      return TPromise(schema_, references_, value)
    case 'Record':
      return TRecord(schema_, references_, value)
    case 'Ref':
      return TRef(schema_, references_, value)
    case 'String':
      return TString(schema_, references_, value)
    case 'Symbol':
      return TSymbol(schema_, references_, value)
    case 'TemplateLiteral':
      return TTemplateLiteral(schema_, references_, value)
    case 'This':
      return TThis(schema_, references_, value)
    case 'Tuple':
      return TTuple(schema_, references_, value)
    case 'Undefined':
      return TUndefined(schema_, references_, value)
    case 'Union':
      return TUnion(schema_, references_, value)
    case 'Uint8Array':
      return TUint8Array(schema_, references_, value)
    case 'Unknown':
      return TUnknown(schema_, references_, value)
    case 'Void':
      return TVoid(schema_, references_, value)
    default:
      if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueCheckUnknownTypeError(schema_)
      return TKind(schema_, references_, value)
  }
}
// --------------------------------------------------------------------------
// Check
// --------------------------------------------------------------------------
/** Returns true if the value matches the given type. */
export function Check<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): value is Types.Static<T>
/** Returns true if the value matches the given type. */
export function Check<T extends Types.TSchema>(schema: T, value: unknown): value is Types.Static<T>
/** Returns true if the value matches the given type. */
export function Check(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], args[2]) : Visit(args[0], [], args[1])
}
