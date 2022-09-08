/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
import { Format } from '../format'

export class ValueCheckUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCheck: Unknown type')
  }
}

export namespace ValueCheck {
  function Any(schema: Types.TAny, references: Types.TSchema[], value: any): boolean {
    return true
  }
  function Array(schema: Types.TArray, references: Types.TSchema[], value: any): boolean {
    if (!globalThis.Array.isArray(value)) {
      return false
    }
    if (schema.minItems !== undefined && !(value.length >= schema.minItems)) {
      return false
    }
    if (schema.maxItems !== undefined && !(value.length <= schema.maxItems)) {
      return false
    }
    if (schema.uniqueItems === true && !(new Set(value).size === value.length)) {
      return false
    }
    return value.every((val) => Visit(schema.items, references, val))
  }

  function Boolean(schema: Types.TBoolean, references: Types.TSchema[], value: any): boolean {
    return typeof value === 'boolean'
  }

  function Constructor(schema: Types.TConstructor, references: Types.TSchema[], value: any): boolean {
    return Visit(schema.returns, references, value.prototype)
  }

  function Function(schema: Types.TFunction, references: Types.TSchema[], value: any): boolean {
    return typeof value === 'function'
  }

  function Integer(schema: Types.TNumeric, references: Types.TSchema[], value: any): boolean {
    if (!(typeof value === 'number')) {
      return false
    }
    if (!globalThis.Number.isInteger(value)) {
      return false
    }
    if (schema.multipleOf !== undefined && !(value % schema.multipleOf === 0)) {
      return false
    }
    if (schema.exclusiveMinimum !== undefined && !(value > schema.exclusiveMinimum)) {
      return false
    }
    if (schema.exclusiveMaximum !== undefined && !(value < schema.exclusiveMaximum)) {
      return false
    }
    if (schema.minimum !== undefined && !(value >= schema.minimum)) {
      return false
    }
    if (schema.maximum !== undefined && !(value <= schema.maximum)) {
      return false
    }
    return true
  }

  function Literal(schema: Types.TLiteral, references: Types.TSchema[], value: any): boolean {
    return value === schema.const
  }

  function Never(schema: Types.TNever, references: Types.TSchema[], value: any): boolean {
    return false
  }

  function Null(schema: Types.TNull, references: Types.TSchema[], value: any): boolean {
    return value === null
  }

  function Number(schema: Types.TNumeric, references: Types.TSchema[], value: any): boolean {
    if (!(typeof value === 'number')) {
      return false
    }
    if (schema.multipleOf && !(value % schema.multipleOf === 0)) {
      return false
    }
    if (schema.exclusiveMinimum && !(value > schema.exclusiveMinimum)) {
      return false
    }
    if (schema.exclusiveMaximum && !(value < schema.exclusiveMaximum)) {
      return false
    }
    if (schema.minimum && !(value >= schema.minimum)) {
      return false
    }
    if (schema.maximum && !(value <= schema.maximum)) {
      return false
    }
    return true
  }

  function Object(schema: Types.TObject, references: Types.TSchema[], value: any): boolean {
    if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
      return false
    }
    if (schema.minProperties !== undefined && !(globalThis.Object.keys(value).length >= schema.minProperties)) {
      return false
    }
    if (schema.maxProperties !== undefined && !(globalThis.Object.keys(value).length <= schema.maxProperties)) {
      return false
    }
    const propertyKeys = globalThis.Object.keys(schema.properties)
    if (schema.additionalProperties === false) {
      // optimization: If the property key length matches the required keys length
      // then we only need check that the values property key length matches that
      // of the property key length. This is because exhaustive testing for values
      // will occur in subsequent property tests.
      if (schema.required && schema.required.length === propertyKeys.length && !(globalThis.Object.keys(value).length === propertyKeys.length)) {
        return false
      } else {
        if (!globalThis.Object.keys(value).every((key) => propertyKeys.includes(key))) {
          return false
        }
      }
    }
    for (const propertyKey of propertyKeys) {
      const propertySchema = schema.properties[propertyKey]
      if (schema.required && schema.required.includes(propertyKey)) {
        if (!Visit(propertySchema, references, value[propertyKey])) {
          return false
        }
      } else {
        if (value[propertyKey] !== undefined) {
          if (!Visit(propertySchema, references, value[propertyKey])) {
            return false
          }
        }
      }
    }
    return true
  }

  function Promise(schema: Types.TPromise<any>, references: Types.TSchema[], value: any): boolean {
    return typeof value === 'object' && typeof value.then === 'function'
  }

  function Record(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any): boolean {
    if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
      return false
    }
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const regex = new RegExp(keyPattern)
    if (!globalThis.Object.keys(value).every((key) => regex.test(key))) {
      return false
    }
    for (const propValue of globalThis.Object.values(value)) {
      if (!Visit(valueSchema, references, propValue)) return false
    }
    return true
  }

  function Ref(schema: Types.TRef<any>, references: Types.TSchema[], value: any): boolean {
    const reference = references.find((reference) => reference.$id === schema.$ref)
    if (reference === undefined) throw new Error(`ValueCheck.Ref: Cannot find schema with $id '${schema.$ref}'.`)
    return Visit(reference, references, value)
  }

  function Self(schema: Types.TSelf, references: Types.TSchema[], value: any): boolean {
    const reference = references.find((reference) => reference.$id === schema.$ref)
    if (reference === undefined) throw new Error(`ValueCheck.Self: Cannot find schema with $id '${schema.$ref}'.`)
    return Visit(reference, references, value)
  }

  function String(schema: Types.TString, references: Types.TSchema[], value: any): boolean {
    if (!(typeof value === 'string')) {
      return false
    }
    if (schema.minLength !== undefined) {
      if (!(value.length >= schema.minLength)) return false
    }
    if (schema.maxLength !== undefined) {
      if (!(value.length <= schema.maxLength)) return false
    }
    if (schema.pattern !== undefined) {
      const regex = new RegExp(schema.pattern)
      if (!regex.test(value)) return false
    }
    if (schema.format !== undefined) {
      if (!Format.Has(schema.format)) return false
      const func = Format.Get(schema.format)!
      return func(value)
    }
    return true
  }

  function Tuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: any): boolean {
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
      if (!Visit(schema.items[i], references, value[i])) return false
    }
    return true
  }

  function Undefined(schema: Types.TUndefined, references: Types.TSchema[], value: any): boolean {
    return value === undefined
  }

  function Union(schema: Types.TUnion<any[]>, references: Types.TSchema[], value: any): boolean {
    return schema.anyOf.some((inner) => Visit(inner, references, value))
  }

  function Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: any): boolean {
    if (!(value instanceof globalThis.Uint8Array)) {
      return false
    }
    if (schema.maxByteLength && !(value.length <= schema.maxByteLength)) {
      return false
    }
    if (schema.minByteLength && !(value.length >= schema.minByteLength)) {
      return false
    }
    return true
  }

  function Unknown(schema: Types.TUnknown, references: Types.TSchema[], value: any): boolean {
    return true
  }

  function Void(schema: Types.TVoid, references: Types.TSchema[], value: any): boolean {
    return value === null
  }

  function Visit<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: any): boolean {
    const anyReferences = schema.$id === undefined ? references : [schema, ...references]
    const anySchema = schema as any
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return Any(anySchema, anyReferences, value)
      case 'Array':
        return Array(anySchema, anyReferences, value)
      case 'Boolean':
        return Boolean(anySchema, anyReferences, value)
      case 'Constructor':
        return Constructor(anySchema, anyReferences, value)
      case 'Function':
        return Function(anySchema, anyReferences, value)
      case 'Integer':
        return Integer(anySchema, anyReferences, value)
      case 'Literal':
        return Literal(anySchema, anyReferences, value)
      case 'Never':
        return Never(anySchema, anyReferences, value)
      case 'Null':
        return Null(anySchema, anyReferences, value)
      case 'Number':
        return Number(anySchema, anyReferences, value)
      case 'Object':
        return Object(anySchema, anyReferences, value)
      case 'Promise':
        return Promise(anySchema, anyReferences, value)
      case 'Record':
        return Record(anySchema, anyReferences, value)
      case 'Ref':
        return Ref(anySchema, anyReferences, value)
      case 'Self':
        return Self(anySchema, anyReferences, value)
      case 'String':
        return String(anySchema, anyReferences, value)
      case 'Tuple':
        return Tuple(anySchema, anyReferences, value)
      case 'Undefined':
        return Undefined(anySchema, anyReferences, value)
      case 'Union':
        return Union(anySchema, anyReferences, value)
      case 'Uint8Array':
        return Uint8Array(anySchema, anyReferences, value)
      case 'Unknown':
        return Unknown(anySchema, anyReferences, value)
      case 'Void':
        return Void(anySchema, anyReferences, value)
      default:
        throw new ValueCheckUnknownTypeError(anySchema)
    }
  }

  // -------------------------------------------------------------------------
  // Check
  // -------------------------------------------------------------------------

  export function Check<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: any): boolean {
    return schema.$id === undefined ? Visit(schema, references, value) : Visit(schema, [schema, ...references], value)
  }
}
