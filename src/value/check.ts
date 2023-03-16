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

import * as Types from '../typebox'
import { TypeSystem } from '../system/index'
import { ValueHash } from './hash'

export class ValueCheckUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super(`ValueCheck: ${schema[Types.Kind] ? `Unknown type '${schema[Types.Kind]}'` : 'Unknown type'}`)
  }
}

export namespace ValueCheck {
  // --------------------------------------------------------
  // Guards
  // --------------------------------------------------------
  function IsBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  }
  function IsNumber(value: unknown): value is number {
    return typeof value === 'number' && globalThis.Number.isFinite(value)
  }
  // --------------------------------------------------------
  // Guards
  // --------------------------------------------------------
  function Any(schema: Types.TAny, value: any): boolean {
    return true
  }
  function Array(schema: Types.TArray, value: any): boolean {
    if (!globalThis.Array.isArray(value)) {
      return false
    }
    if (IsNumber(schema.minItems) && !(value.length >= schema.minItems)) {
      return false
    }
    if (IsNumber(schema.maxItems) && !(value.length <= schema.maxItems)) {
      return false
    }
    // prettier-ignore
    if (schema.uniqueItems === true && !((function() { const set = new Set(); for(const element of value) { const hashed = ValueHash.Create(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true })())) {
      return false
    }
    return value.every((value) => Visit(schema.items, value))
  }
  function BigInt(schema: Types.TBigInt, value: any): boolean {
    if (typeof value !== 'bigint') {
      return false
    }
    if (IsBigInt(schema.multipleOf) && !(value % schema.multipleOf === globalThis.BigInt(0))) {
      return false
    }
    if (IsBigInt(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
      return false
    }
    if (IsBigInt(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
      return false
    }
    if (IsBigInt(schema.minimum) && !(value >= schema.minimum)) {
      return false
    }
    if (IsBigInt(schema.maximum) && !(value <= schema.maximum)) {
      return false
    }
    return true
  }
  function Boolean(schema: Types.TBoolean, value: any): boolean {
    return typeof value === 'boolean'
  }
  function Constructor(schema: Types.TConstructor, value: any): boolean {
    return Visit(schema.returns, value.prototype)
  }
  function Date(schema: Types.TDate, value: any): boolean {
    if (!(value instanceof globalThis.Date)) {
      return false
    }
    if (!globalThis.Number.isFinite(value.getTime())) {
      return false
    }
    if (IsNumber(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) {
      return false
    }
    if (IsNumber(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) {
      return false
    }
    if (IsNumber(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) {
      return false
    }
    if (IsNumber(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) {
      return false
    }
    return true
  }
  function Function(schema: Types.TFunction, value: any): boolean {
    return typeof value === 'function'
  }
  function Integer(schema: Types.TInteger, value: any): boolean {
    if (!(typeof value === 'number' && globalThis.Number.isInteger(value))) {
      return false
    }
    if (IsNumber(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
      return false
    }
    if (IsNumber(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
      return false
    }
    if (IsNumber(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
      return false
    }
    if (IsNumber(schema.minimum) && !(value >= schema.minimum)) {
      return false
    }
    if (IsNumber(schema.maximum) && !(value <= schema.maximum)) {
      return false
    }
    return true
  }
  function Intersect(schema: Types.TIntersect, value: any): boolean {
    if (!schema.allOf.every((schema) => Visit(schema, value))) {
      return false
    } else if (schema.unevaluatedProperties === false) {
      const schemaKeys = Types.KeyResolver.Resolve(schema)
      const valueKeys = globalThis.Object.getOwnPropertyNames(value)
      return valueKeys.every((key) => schemaKeys.includes(key))
    } else if (Types.TypeGuard.TSchema(schema.unevaluatedProperties)) {
      const schemaKeys = Types.KeyResolver.Resolve(schema)
      const valueKeys = globalThis.Object.getOwnPropertyNames(value)
      return valueKeys.every((key) => schemaKeys.includes(key) || Visit(schema.unevaluatedProperties as Types.TSchema, value[key]))
    } else {
      return true
    }
  }
  function Literal(schema: Types.TLiteral, value: any): boolean {
    return value === schema.const
  }
  function Never(schema: Types.TNever, value: any): boolean {
    return false
  }
  function Not(schema: Types.TNot, value: any): boolean {
    return !Visit(schema.allOf[0].not, value) && Visit(schema.allOf[1], value)
  }
  function Null(schema: Types.TNull, value: any): boolean {
    return value === null
  }
  function Number(schema: Types.TNumber, value: any): boolean {
    if (TypeSystem.AllowNaN) {
      if (!(typeof value === 'number')) {
        return false
      }
    } else {
      if (!(typeof value === 'number' && globalThis.Number.isFinite(value))) {
        return false
      }
    }
    if (IsNumber(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
      return false
    }
    if (IsNumber(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
      return false
    }
    if (IsNumber(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
      return false
    }
    if (IsNumber(schema.minimum) && !(value >= schema.minimum)) {
      return false
    }
    if (IsNumber(schema.maximum) && !(value <= schema.maximum)) {
      return false
    }
    return true
  }
  function Object(schema: Types.TObject, value: any): boolean {
    if (TypeSystem.AllowArrayObjects) {
      if (!(typeof value === 'object' && value !== null)) {
        return false
      }
    } else {
      if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
        return false
      }
    }
    if (IsNumber(schema.minProperties) && !(globalThis.Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
      return false
    }
    if (IsNumber(schema.maxProperties) && !(globalThis.Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
      return false
    }
    const schemaKeys = globalThis.Object.getOwnPropertyNames(schema.properties)
    for (const schemaKey of schemaKeys) {
      const property = schema.properties[schemaKey]
      if (schema.required && schema.required.includes(schemaKey)) {
        if (!Visit(property, value[schemaKey])) {
          return false
        }
        if (Types.ExtendsUndefined.Check(property)) {
          return schemaKey in value
        }
      } else {
        if (schemaKey in value && !Visit(property, value[schemaKey])) {
          return false
        }
      }
    }
    if (schema.additionalProperties === false) {
      const valueKeys = globalThis.Object.getOwnPropertyNames(value)
      // optimization: value is valid if schemaKey length matches the valueKey length
      if (schema.required && schema.required.length === schemaKeys.length && valueKeys.length === schemaKeys.length) {
        return true
      } else {
        return valueKeys.every((valueKey) => schemaKeys.includes(valueKey))
      }
    } else if (typeof schema.additionalProperties === 'object') {
      const valueKeys = globalThis.Object.getOwnPropertyNames(value)
      return valueKeys.every((key) => schemaKeys.includes(key) || Visit(schema.additionalProperties as Types.TSchema, value[key]))
    } else {
      return true
    }
  }
  function Promise(schema: Types.TPromise<any>, value: any): boolean {
    return typeof value === 'object' && typeof value.then === 'function'
  }
  function Record(schema: Types.TRecord<any, any>, value: any): boolean {
    if (TypeSystem.AllowArrayObjects) {
      if (!(typeof value === 'object' && value !== null && !(value instanceof globalThis.Date))) {
        return false
      }
    } else {
      if (!(typeof value === 'object' && value !== null && !(value instanceof globalThis.Date) && !globalThis.Array.isArray(value))) {
        return false
      }
    }
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const regex = new RegExp(keyPattern)
    if (!globalThis.Object.getOwnPropertyNames(value).every((key) => regex.test(key))) {
      return false
    }
    for (const propValue of globalThis.Object.values(value)) {
      if (!Visit(valueSchema, propValue)) return false
    }
    return true
  }
  function Ref(schema: Types.TRef<any>, value: any): boolean {
    return Visit(Types.ReferenceRegistry.DerefOne(schema), value)
  }
  function Self(schema: Types.TSelf, value: any): boolean {
    return Visit(Types.ReferenceRegistry.DerefOne(schema), value)
  }
  function String(schema: Types.TString, value: any): boolean {
    if (!(typeof value === 'string')) {
      return false
    }
    if (IsNumber(schema.minLength)) {
      if (!(value.length >= schema.minLength)) return false
    }
    if (IsNumber(schema.maxLength)) {
      if (!(value.length <= schema.maxLength)) return false
    }
    if (schema.pattern !== undefined) {
      const regex = new RegExp(schema.pattern)
      if (!regex.test(value)) return false
    }
    if (schema.format !== undefined) {
      if (!Types.FormatRegistry.Has(schema.format)) return false
      const func = Types.FormatRegistry.Get(schema.format)!
      return func(value)
    }
    return true
  }
  function Symbol(schema: Types.TSymbol, value: any): boolean {
    if (!(typeof value === 'symbol')) {
      return false
    }
    return true
  }
  function Tuple(schema: Types.TTuple<any[]>, value: any): boolean {
    if (!globalThis.Array.isArray(value)) {
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
      if (!Visit(schema.items[i], value[i])) return false
    }
    return true
  }
  function Undefined(schema: Types.TUndefined, value: any): boolean {
    return value === undefined
  }
  function Union(schema: Types.TUnion<any[]>, value: any): boolean {
    return schema.anyOf.some((inner) => Visit(inner, value))
  }
  function Uint8Array(schema: Types.TUint8Array, value: any): boolean {
    if (!(value instanceof globalThis.Uint8Array)) {
      return false
    }
    if (IsNumber(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
      return false
    }
    if (IsNumber(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
      return false
    }
    return true
  }
  function Unknown(schema: Types.TUnknown, value: any): boolean {
    return true
  }
  function Void(schema: Types.TVoid, value: any): boolean {
    return value === void 0 || value === null
  }
  function UserDefined(schema: Types.TSchema, value: unknown): boolean {
    if (!Types.TypeRegistry.Has(schema[Types.Kind])) return false
    const func = Types.TypeRegistry.Get(schema[Types.Kind])!
    return func(schema, value)
  }
  function Visit<T extends Types.TSchema>(schema: T, value: any): boolean {
    const anySchema = schema as any
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return Any(anySchema, value)
      case 'Array':
        return Array(anySchema, value)
      case 'BigInt':
        return BigInt(anySchema, value)
      case 'Boolean':
        return Boolean(anySchema, value)
      case 'Constructor':
        return Constructor(anySchema, value)
      case 'Date':
        return Date(anySchema, value)
      case 'Function':
        return Function(anySchema, value)
      case 'Integer':
        return Integer(anySchema, value)
      case 'Intersect':
        return Intersect(anySchema, value)
      case 'Literal':
        return Literal(anySchema, value)
      case 'Never':
        return Never(anySchema, value)
      case 'Not':
        return Not(anySchema, value)
      case 'Null':
        return Null(anySchema, value)
      case 'Number':
        return Number(anySchema, value)
      case 'Object':
        return Object(anySchema, value)
      case 'Promise':
        return Promise(anySchema, value)
      case 'Record':
        return Record(anySchema, value)
      case 'Ref':
        return Ref(anySchema, value)
      case 'Self':
        return Self(anySchema, value)
      case 'String':
        return String(anySchema, value)
      case 'Symbol':
        return Symbol(anySchema, value)
      case 'Tuple':
        return Tuple(anySchema, value)
      case 'Undefined':
        return Undefined(anySchema, value)
      case 'Union':
        return Union(anySchema, value)
      case 'Uint8Array':
        return Uint8Array(anySchema, value)
      case 'Unknown':
        return Unknown(anySchema, value)
      case 'Void':
        return Void(anySchema, value)
      default:
        if (!Types.TypeRegistry.Has(anySchema[Types.Kind])) throw new ValueCheckUnknownTypeError(anySchema)
        return UserDefined(anySchema, value)
    }
  }
  // -------------------------------------------------------------------------
  // Check
  // -------------------------------------------------------------------------
  export function Check<T extends Types.TSchema>(schema: T, value: any): boolean {
    return Visit(schema, value)
  }
}
