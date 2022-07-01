/*--------------------------------------------------------------------------

@sinclair/typebox/compiler

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

export interface TypeError {
  schema: Types.TSchema
  path: string
  value: unknown
  message: string
}

export namespace TypeErrors {
  function* Any(schema: Types.TAny, path: string, value: any): Generator<TypeError> {}

  function* Array(schema: Types.TArray, path: string, value: any): Generator<TypeError> {
    if (!globalThis.Array.isArray(value)) {
      return yield { schema, path, value, message: `Expected array` }
    }
    for (let i = 0; i < value.length; i++) {
      yield* Visit(schema.items, `${path}/${i}`, value[i])
    }
  }

  function* Boolean(schema: Types.TBoolean, path: string, value: any): Generator<TypeError> {
    if (!(typeof value === 'boolean')) {
      return yield { schema, path, value, message: `Expected boolean` }
    }
  }

  function* Constructor(schema: Types.TConstructor, path: string, value: any): Generator<TypeError> {
    yield* Visit(schema.yields, path, value)
  }

  function* Function(schema: Types.TFunction, path: string, value: any): Generator<TypeError> {
    if (!(typeof value === 'function')) {
      return yield { schema, path, value, message: `Expected function` }
    }
  }

  function* Integer(schema: Types.TNumeric, path: string, value: any): Generator<TypeError> {
    if (!(typeof value === 'number')) {
      return yield { schema, path, value, message: `Expected number` }
    }
    if (!globalThis.Number.isInteger(value)) {
      yield { schema, path, value, message: `Expected integer` }
    }
    if (schema.multipleOf && !(value % schema.multipleOf === 0)) {
      yield { schema, path, value, message: `Expected number to be a multiple of ${schema.multipleOf}` }
    }
    if (schema.exclusiveMinimum && !(value > schema.exclusiveMinimum)) {
      yield { schema, path, value, message: `Expected number to be greater than ${schema.exclusiveMinimum}` }
    }
    if (schema.exclusiveMaximum && !(value < schema.exclusiveMaximum)) {
      yield { schema, path, value, message: `Expected number to be less than ${schema.exclusiveMaximum}` }
    }
    if (schema.minimum && !(value >= schema.minimum)) {
      yield { schema, path, value, message: `Expected number to be greater or equal to ${schema.minimum}` }
    }
    if (schema.maximum && !(value <= schema.maximum)) {
      yield { schema, path, value, message: `Expected number to be less or equal to ${schema.maximum}` }
    }
  }

  function* Literal(schema: Types.TLiteral, path: string, value: any): Generator<TypeError> {
    if (!(value === schema.const)) {
      const error = typeof schema.const === 'string' ? `'${schema.const}'` : schema.const
      return yield { schema, path, value, message: `Expected ${error}` }
    }
  }

  function* Null(schema: Types.TNull, path: string, value: any): Generator<TypeError> {
    if (!(value === null)) {
      return yield { schema, path, value, message: `Expected null` }
    }
  }

  function* Number(schema: Types.TNumeric, path: string, value: any): Generator<TypeError> {
    if (!(typeof value === 'number')) {
      return yield { schema, path, value, message: `Expected number` }
    }
    if (schema.multipleOf && !(value % schema.multipleOf === 0)) {
      yield { schema, path, value, message: `Expected number to be a multiple of ${schema.multipleOf}` }
    }
    if (schema.exclusiveMinimum && !(value > schema.exclusiveMinimum)) {
      yield { schema, path, value, message: `Expected number to be greater than ${schema.exclusiveMinimum}` }
    }
    if (schema.exclusiveMaximum && !(value < schema.exclusiveMaximum)) {
      yield { schema, path, value, message: `Expected number to be less than ${schema.exclusiveMaximum}` }
    }
    if (schema.minimum && !(value >= schema.minimum)) {
      yield { schema, path, value, message: `Expected number to be greater or equal to ${schema.minimum}` }
    }
    if (schema.maximum && !(value <= schema.maximum)) {
      yield { schema, path, value, message: `Expected number to be less or equal to ${schema.maximum}` }
    }
  }

  function* Object(schema: Types.TObject, path: string, value: any): Generator<TypeError> {
    if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
      return yield { schema, path, value, message: `Expected object` }
    }
    if (schema.minProperties !== undefined && !(globalThis.Object.keys(value).length >= schema.minProperties)) {
      yield { schema, path, value, message: `Expected object to have at least ${schema.minProperties} properties` }
    }
    if (schema.maxProperties !== undefined && !(globalThis.Object.keys(value).length <= schema.maxProperties)) {
      yield { schema, path, value, message: `Expected object to have less than ${schema.minProperties} properties` }
    }
    const propertyKeys = globalThis.Object.keys(schema.properties)
    if (schema.additionalProperties === false) {
      if (schema.required && schema.required.length === propertyKeys.length && !(globalThis.Object.keys(value).length === propertyKeys.length)) {
        yield { schema, path, value, message: 'Expected object is missing required properties' }
      } else {
        if (!globalThis.Object.keys(value).every((key) => propertyKeys.includes(key))) {
          yield { schema, path, value, message: 'Expected object ambigious' }
        }
      }
    }
    for (const propertyKey of propertyKeys) {
      const propertySchema = schema.properties[propertyKey]
      if (schema.required && schema.required.includes(propertyKey)) {
        yield* Visit(propertySchema, `${path}/${propertyKey}`, value[propertyKey])
      } else {
        if (value[propertyKey] !== undefined) {
          yield* Visit(propertySchema, `${path}/${propertyKey}`, value[propertyKey])
        }
      }
    }
  }

  function* Promise(schema: Types.TPromise<any>, path: string, value: any): Generator<TypeError> {
    if (!(typeof value === 'object' && typeof value.then === 'function')) {
      yield { schema, path, value, message: `Expected Promise` }
    }
  }

  function* Record(schema: Types.TRecord<any, any>, path: string, value: any): Generator<TypeError> {
    if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
      return yield { schema, path, value, message: `Expected object` }
    }
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const regex = new RegExp(keyPattern)
    if (!globalThis.Object.keys(value).every((key) => regex.test(key))) {
      return yield { schema, path, value, message: `Expected property keys to match '${keyPattern}'` }
    }
    for (const [propKey, propValue] of globalThis.Object.entries(value)) {
      yield* Visit(valueSchema, `${path}/${propKey}`, propValue)
    }
  }

  function* Ref(schema: Types.TRef<any>, path: string, value: any): Generator<TypeError> {
    if (!referenceMap.has(schema.$ref)) {
      throw Error(`TypeErrors: Cannot locate referenced schema for $id '${schema.$id}'`)
    }
    const referencedSchema = referenceMap.get(schema.$ref)!
    yield* Visit(referencedSchema, path, value)
  }

  function* Self(schema: Types.TSelf, path: string, value: any): Generator<TypeError> {
    if (!referenceMap.has(schema.$ref)) {
      throw Error(`TypeErrors: Cannot locate referenced schema for $id '${schema.$id}'`)
    }
    const referencedSchema = referenceMap.get(schema.$ref)!
    yield* Visit(referencedSchema, path, value)
  }

  function* String(schema: Types.TString, path: string, value: any): Generator<TypeError> {
    if (!(typeof value === 'string')) {
      return yield { schema, path, value, message: 'Expected string' }
    }
    if (schema.pattern !== undefined) {
      const regex = new RegExp(schema.pattern)
      if (!regex.test(value)) {
        yield { schema, path, value, message: `Expected string to match pattern ${schema.pattern}` }
      }
    }
  }

  function* Tuple(schema: Types.TTuple<any[]>, path: string, value: any): Generator<TypeError> {
    if (!global.Array.isArray(value)) {
      return yield { schema, path, value, message: 'Expected Array' }
    }
    if (schema.items === undefined && !(value.length === 0)) {
      return yield { schema, path, value, message: 'Expected tuple to have 0 elements' }
    }
    if (!(value.length === schema.maxItems)) {
      yield { schema, path, value, message: `Expected tuple to have ${schema.maxItems} elements` }
    }
    if (!schema.items) {
      return
    }
    for (let i = 0; i < schema.items.length; i++) {
      yield* Visit(schema.items[i], `${path}/${i}`, value[i])
    }
  }

  function* Undefined(schema: Types.TUndefined, path: string, value: any): Generator<TypeError> {
    if (!value === undefined) {
      yield { schema, path, value, message: `Expected undefined` }
    }
  }

  function* Union(schema: Types.TUnion<any[]>, path: string, value: any): Generator<TypeError> {
    const errors: TypeError[] = []
    for (const inner of schema.anyOf) {
      const variantErrors = [...Visit(inner, path, value)]
      if (variantErrors.length === 0) return
      errors.push(...variantErrors)
    }
    for (const error of errors) {
      yield error
    }
    if (errors.length > 0) {
      yield { schema, path, value, message: 'Expected value of union' }
    }
  }

  function* Uint8Array(schema: Types.TUint8Array, path: string, value: any): Generator<TypeError> {
    if (!(value instanceof globalThis.Uint8Array)) {
      return yield { schema, path, value, message: `Expected Uint8Array` }
    }

    if (schema.maxByteLength && !(value.length <= schema.maxByteLength)) {
      yield { schema, path, value, message: `Expected Uint8Array to have a byte length less or equal to ${schema.maxByteLength}` }
    }
    if (schema.minByteLength && !(value.length >= schema.minByteLength)) {
      yield { schema, path, value, message: `Expected Uint8Array to have a byte length greater or equal to ${schema.maxByteLength}` }
    }
  }

  function* Unknown(schema: Types.TUnknown, path: string, value: any): Generator<TypeError> {}

  function* Void(schema: Types.TVoid, path: string, value: any): Generator<TypeError> {
    if (!(value === null)) {
      return yield { schema, path, value, message: `Expected null` }
    }
  }

  function* Visit<T extends Types.TSchema>(schema: T, path: string, value: any): Generator<TypeError> {
    if (schema.$id !== undefined) {
      referenceMap.set(schema.$id, schema)
    }
    const anySchema = schema as any
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return yield* Any(anySchema, path, value)
      case 'Array':
        return yield* Array(anySchema, path, value)
      case 'Boolean':
        return yield* Boolean(anySchema, path, value)
      case 'Constructor':
        return yield* Constructor(anySchema, path, value)
      case 'Function':
        return yield* Function(anySchema, path, value)
      case 'Integer':
        return yield* Integer(anySchema, path, value)
      case 'Literal':
        return yield* Literal(anySchema, path, value)
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
        throw Error(`Unknown schema kind '${schema[Types.Kind]}'`)
    }
  }

  const referenceMap = new Map<string, Types.TSchema>()

  function SetAdditional(additional: Types.TSchema[] = []) {
    referenceMap.clear()
    for (const schema of additional) {
      if (!schema.$id) throw Error('TypeErrors: Referenced additional schemas must have an $id')
      referenceMap.set(schema.$id, schema)
    }
  }

  export function* Errors<T extends Types.TSchema>(schema: T, additional: Types.TSchema[], value: any): Generator<TypeError> {
    SetAdditional(additional)
    yield* Visit(schema, '', value)
  }
}
