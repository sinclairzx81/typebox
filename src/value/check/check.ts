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

import { IsArray, IsUint8Array, IsDate, IsPromise, IsFunction, IsAsyncIterator, IsIterator, IsBoolean, IsNumber, IsBigInt, IsString, IsSymbol, IsInteger, IsNull, IsUndefined } from '../guard/index'
import { TypeSystemPolicy } from '../../system/index'
import { Deref } from '../deref/index'
import { Hash } from '../hash/index'
import { Kind } from '../../type/symbols/index'
import { KeyOfPattern } from '../../type/keyof/index'
import { ExtendsUndefinedCheck } from '../../type/extends/index'
import { TSchema as IsSchemaType } from '../../type/guard/type'
import { TypeRegistry, FormatRegistry } from '../../type/registry/index'

import type { TSchema } from '../../type/schema/index'
import type { TAsyncIterator } from '../../type/async-iterator/index'
import type { TAny } from '../../type/any/index'
import type { TArray } from '../../type/array/index'
import type { TBigInt } from '../../type/bigint/index'
import type { TBoolean } from '../../type/boolean/index'
import type { TDate } from '../../type/date/index'
import type { TConstructor } from '../../type/constructor/index'
import type { TFunction } from '../../type/function/index'
import type { TInteger } from '../../type/integer/index'
import type { TIntersect } from '../../type/intersect/index'
import type { TIterator } from '../../type/iterator/index'
import type { TLiteral } from '../../type/literal/index'
import { Never, type TNever } from '../../type/never/index'
import type { TNot } from '../../type/not/index'
import type { TNull } from '../../type/null/index'
import type { TNumber } from '../../type/number/index'
import type { TObject } from '../../type/object/index'
import type { TPromise } from '../../type/promise/index'
import type { TRecord } from '../../type/record/index'
import type { TRef } from '../../type/ref/index'
import type { TTemplateLiteral, TTemplateLiteralKind } from '../../type/template-literal/index'
import type { TThis } from '../../type/recursive/index'
import type { TTuple } from '../../type/tuple/index'
import type { TUnion } from '../../type/union/index'
import type { TUnknown } from '../../type/unknown/index'
import type { Static } from '../../type/static/index'
import type { TString } from '../../type/string/index'
import type { TSymbol } from '../../type/symbol/index'
import type { TUndefined } from '../../type/undefined/index'
import type { TUint8Array } from '../../type/uint8array/index'
import type { TVoid } from '../../type/void/index'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class ValueCheckUnknownTypeError extends Error {
  constructor(public readonly schema: TSchema) {
    super(`Unknown type`)
  }
}
// --------------------------------------------------------------------------
// TypeGuards
// --------------------------------------------------------------------------
function IsAnyOrUnknown(schema: TSchema) {
  return schema[Kind] === 'Any' || schema[Kind] === 'Unknown'
}
// --------------------------------------------------------------------------
// Guards
// --------------------------------------------------------------------------
function IsDefined<T>(value: unknown): value is T {
  return value !== undefined
}
// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
function TAny(schema: TAny, references: TSchema[], value: any): boolean {
  return true
}
function TArray(schema: TArray, references: TSchema[], value: any): boolean {
  if (!IsArray(value)) return false
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
  if (schema.uniqueItems === true && !((function() { const set = new Set(); for(const element of value) { const hashed = Hash(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true })())) {
      return false
    }
  // contains
  if (!(IsDefined(schema.contains) || IsNumber(schema.minContains) || IsNumber(schema.maxContains))) {
    return true // exit
  }
  const containsSchema = IsDefined<TSchema>(schema.contains) ? schema.contains : Never()
  const containsCount = value.reduce((acc: number, value) => (Visit(containsSchema, references, value) ? acc + 1 : acc), 0)
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
function TAsyncIterator(schema: TAsyncIterator, references: TSchema[], value: any): boolean {
  return IsAsyncIterator(value)
}
function TBigInt(schema: TBigInt, references: TSchema[], value: any): boolean {
  if (!IsBigInt(value)) return false
  if (IsDefined<bigint>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    return false
  }
  if (IsDefined<bigint>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    return false
  }
  if (IsDefined<bigint>(schema.maximum) && !(value <= schema.maximum)) {
    return false
  }
  if (IsDefined<bigint>(schema.minimum) && !(value >= schema.minimum)) {
    return false
  }
  if (IsDefined<bigint>(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0))) {
    return false
  }
  return true
}
function TBoolean(schema: TBoolean, references: TSchema[], value: any): boolean {
  return IsBoolean(value)
}
function TConstructor(schema: TConstructor, references: TSchema[], value: any): boolean {
  return Visit(schema.returns, references, value.prototype)
}
function TDate(schema: TDate, references: TSchema[], value: any): boolean {
  if (!IsDate(value)) return false
  if (IsDefined<number>(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) {
    return false
  }
  if (IsDefined<number>(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) {
    return false
  }
  if (IsDefined<number>(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) {
    return false
  }
  if (IsDefined<number>(schema.multipleOfTimestamp) && !(value.getTime() % schema.multipleOfTimestamp === 0)) {
    return false
  }
  return true
}
function TFunction(schema: TFunction, references: TSchema[], value: any): boolean {
  return IsFunction(value)
}
function TInteger(schema: TInteger, references: TSchema[], value: any): boolean {
  if (!IsInteger(value)) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    return false
  }
  if (IsDefined<number>(schema.maximum) && !(value <= schema.maximum)) {
    return false
  }
  if (IsDefined<number>(schema.minimum) && !(value >= schema.minimum)) {
    return false
  }
  if (IsDefined<number>(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    return false
  }
  return true
}
function TIntersect(schema: TIntersect, references: TSchema[], value: any): boolean {
  const check1 = schema.allOf.every((schema) => Visit(schema, references, value))
  if (schema.unevaluatedProperties === false) {
    const keyPattern = new RegExp(KeyOfPattern(schema))
    const check2 = Object.getOwnPropertyNames(value).every((key) => keyPattern.test(key))
    return check1 && check2
  } else if (IsSchemaType(schema.unevaluatedProperties)) {
    const keyCheck = new RegExp(KeyOfPattern(schema))
    const check2 = Object.getOwnPropertyNames(value).every((key) => keyCheck.test(key) || Visit(schema.unevaluatedProperties as TSchema, references, value[key]))
    return check1 && check2
  } else {
    return check1
  }
}
function TIterator(schema: TIterator, references: TSchema[], value: any): boolean {
  return IsIterator(value)
}
function TLiteral(schema: TLiteral, references: TSchema[], value: any): boolean {
  return value === schema.const
}
function TNever(schema: TNever, references: TSchema[], value: any): boolean {
  return false
}
function TNot(schema: TNot, references: TSchema[], value: any): boolean {
  return !Visit(schema.not, references, value)
}
function TNull(schema: TNull, references: TSchema[], value: any): boolean {
  return IsNull(value)
}
function TNumber(schema: TNumber, references: TSchema[], value: any): boolean {
  if (!TypeSystemPolicy.IsNumberLike(value)) return false
  if (IsDefined<number>(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    return false
  }
  if (IsDefined<number>(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    return false
  }
  if (IsDefined<number>(schema.minimum) && !(value >= schema.minimum)) {
    return false
  }
  if (IsDefined<number>(schema.maximum) && !(value <= schema.maximum)) {
    return false
  }
  if (IsDefined<number>(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    return false
  }
  return true
}
function TObject(schema: TObject, references: TSchema[], value: any): boolean {
  if (!TypeSystemPolicy.IsObjectLike(value)) return false
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
      if ((ExtendsUndefinedCheck(property) || IsAnyOrUnknown(property)) && !(knownKey in value)) {
        return false
      }
    } else {
      if (TypeSystemPolicy.IsExactOptionalProperty(value, knownKey) && !Visit(property, references, value[knownKey])) {
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
    return valueKeys.every((key) => knownKeys.includes(key) || Visit(schema.additionalProperties as TSchema, references, value[key]))
  } else {
    return true
  }
}
function TPromise(schema: TPromise<any>, references: TSchema[], value: any): boolean {
  return IsPromise(value)
}
function TRecord(schema: TRecord<any, any>, references: TSchema[], value: any): boolean {
  if (!TypeSystemPolicy.IsRecordLike(value)) {
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
  // prettier-ignore
  const check1 = Object.entries(value).every(([key, value]) => {
    return (regex.test(key)) ? Visit(patternSchema, references, value) : true
  })
  // prettier-ignore
  const check2 = typeof schema.additionalProperties === 'object' ? Object.entries(value).every(([key, value]) => {
    return (!regex.test(key)) ? Visit(schema.additionalProperties as TSchema, references, value) : true
  }) : true
  const check3 =
    schema.additionalProperties === false
      ? Object.getOwnPropertyNames(value).every((key) => {
          return regex.test(key)
        })
      : true
  return check1 && check2 && check3
}
function TRef(schema: TRef<any>, references: TSchema[], value: any): boolean {
  return Visit(Deref(schema, references), references, value)
}
function TString(schema: TString, references: TSchema[], value: any): boolean {
  if (!IsString(value)) {
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
    if (!FormatRegistry.Has(schema.format)) return false
    const func = FormatRegistry.Get(schema.format)!
    return func(value)
  }
  return true
}
function TSymbol(schema: TSymbol, references: TSchema[], value: any): boolean {
  return IsSymbol(value)
}
function TTemplateLiteral(schema: TTemplateLiteralKind, references: TSchema[], value: any): boolean {
  return IsString(value) && new RegExp(schema.pattern).test(value)
}
function TThis(schema: TThis, references: TSchema[], value: any): boolean {
  return Visit(Deref(schema, references), references, value)
}
function TTuple(schema: TTuple<any[]>, references: TSchema[], value: any): boolean {
  if (!IsArray(value)) {
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
function TUndefined(schema: TUndefined, references: TSchema[], value: any): boolean {
  return IsUndefined(value)
}
function TUnion(schema: TUnion<any[]>, references: TSchema[], value: any): boolean {
  return schema.anyOf.some((inner) => Visit(inner, references, value))
}
function TUint8Array(schema: TUint8Array, references: TSchema[], value: any): boolean {
  if (!IsUint8Array(value)) {
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
function TUnknown(schema: TUnknown, references: TSchema[], value: any): boolean {
  return true
}
function TVoid(schema: TVoid, references: TSchema[], value: any): boolean {
  return TypeSystemPolicy.IsVoidLike(value)
}
function TKind(schema: TSchema, references: TSchema[], value: unknown): boolean {
  if (!TypeRegistry.Has(schema[Kind])) return false
  const func = TypeRegistry.Get(schema[Kind])!
  return func(schema, value)
}
function Visit<T extends TSchema>(schema: T, references: TSchema[], value: any): boolean {
  const references_ = IsDefined<string>(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema_[Kind]) {
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
      if (!TypeRegistry.Has(schema_[Kind])) throw new ValueCheckUnknownTypeError(schema_)
      return TKind(schema_, references_, value)
  }
}
// --------------------------------------------------------------------------
// Check
// --------------------------------------------------------------------------
/** Returns true if the value matches the given type. */
export function Check<T extends TSchema>(schema: T, references: TSchema[], value: unknown): value is Static<T>
/** Returns true if the value matches the given type. */
export function Check<T extends TSchema>(schema: T, value: unknown): value is Static<T>
/** Returns true if the value matches the given type. */
export function Check(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], args[2]) : Visit(args[0], [], args[1])
}
