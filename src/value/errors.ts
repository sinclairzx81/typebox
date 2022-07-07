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

export interface ValueError {
  schema: Types.TSchema
  path: string
  value: unknown
  message: string
}

export namespace ValueErrors {
  function* Any(schema: Types.TAny, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {}

  function* Array(schema: Types.TArray, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!globalThis.Array.isArray(value)) {
      return yield { schema, path, value, message: `Expected array` }
    }
    if (schema.minItems !== undefined && !(value.length >= schema.minItems)) {
      yield { schema, path, value, message: `Expected array length to be greater or equal to ${schema.minItems}` }
    }
    if (schema.maxItems !== undefined && !(value.length <= schema.maxItems)) {
      yield { schema, path, value, message: `Expected array length to be less or equal to ${schema.maxItems}` }
    }
    if (schema.uniqueItems === true && !(new Set(value).size === value.length)) {
      yield { schema, path, value, message: `Expected array elements to be unique` }
    }
    for (let i = 0; i < value.length; i++) {
      yield* Visit(schema.items, references, `${path}/${i}`, value[i])
    }
  }

  function* Boolean(schema: Types.TBoolean, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'boolean')) {
      return yield { schema, path, value, message: `Expected boolean` }
    }
  }

  function* Constructor(schema: Types.TConstructor, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    yield* Visit(schema.returns, references, path, value)
  }

  function* Function(schema: Types.TFunction, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'function')) {
      return yield { schema, path, value, message: `Expected function` }
    }
  }

  function* Integer(schema: Types.TNumeric, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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

  function* Literal(schema: Types.TLiteral, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(value === schema.const)) {
      const error = typeof schema.const === 'string' ? `'${schema.const}'` : schema.const
      return yield { schema, path, value, message: `Expected ${error}` }
    }
  }

  function* Null(schema: Types.TNull, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(value === null)) {
      return yield { schema, path, value, message: `Expected null` }
    }
  }

  function* Number(schema: Types.TNumeric, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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

  function* Object(schema: Types.TObject, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
      for (const propKey of globalThis.Object.keys(value)) {
        if (!propertyKeys.includes(propKey)) {
          yield { schema, path: `${path}/${propKey}`, value: value[propKey], message: 'Unexpected property' }
        }
      }
    }
    for (const propertyKey of propertyKeys) {
      const propertySchema = schema.properties[propertyKey]
      if (schema.required && schema.required.includes(propertyKey)) {
        yield* Visit(propertySchema, references, `${path}/${propertyKey}`, value[propertyKey])
      } else {
        if (value[propertyKey] !== undefined) {
          yield* Visit(propertySchema, references, `${path}/${propertyKey}`, value[propertyKey])
        }
      }
    }
  }

  function* Promise(schema: Types.TPromise, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'object' && typeof value.then === 'function')) {
      yield { schema, path, value, message: `Expected Promise` }
    }
  }

  function* Record(schema: Types.TRecord, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'object' && value !== null && !globalThis.Array.isArray(value))) {
      return yield { schema, path, value, message: `Expected object` }
    }
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    const regex = new RegExp(keyPattern)
    if (!globalThis.Object.keys(value).every((key) => regex.test(key))) {
      const message = keyPattern === '^(0|[1-9][0-9]*)$' ? 'Expected all object property keys to be numeric' : 'Expected all object property keys to be strings'
      return yield { schema, path, value, message }
    }
    for (const [propKey, propValue] of globalThis.Object.entries(value)) {
      yield* Visit(valueSchema, references, `${path}/${propKey}`, propValue)
    }
  }

  function* Ref(schema: Types.TRef<any>, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    const reference = references.find((reference) => reference.$id === schema.$ref)
    if (reference === undefined) throw new Error(`ValueErrors.Ref: Cannot find schema with $id '${schema.$ref}'.`)
    yield* Visit(reference, references, path, value)
  }

  function* Self(schema: Types.TSelf, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    const reference = references.find((reference) => reference.$id === schema.$ref)
    if (reference === undefined) throw new Error(`ValueErrors.Self: Cannot find schema with $id '${schema.$ref}'.`)
    yield* Visit(reference, references, path, value)
  }

  function* String(schema: Types.TString, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(typeof value === 'string')) {
      return yield { schema, path, value, message: 'Expected string' }
    }
    if (schema.minLength !== undefined && !(value.length >= schema.minLength)) {
      yield { schema, path, value, message: `Expected string length greater or equal to ${schema.minLength}` }
    }
    if (schema.maxLength !== undefined && !(value.length <= schema.maxLength)) {
      yield { schema, path, value, message: `Expected string length less or equal to ${schema.maxLength}` }
    }
    if (schema.pattern !== undefined) {
      const regex = new RegExp(schema.pattern)
      if (!regex.test(value)) {
        yield { schema, path, value, message: `Expected string to match pattern ${schema.pattern}` }
      }
    }
  }

  function* Tuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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
      yield* Visit(schema.items[i], references, `${path}/${i}`, value[i])
    }
  }

  function* Undefined(schema: Types.TUndefined, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(value === undefined)) {
      yield { schema, path, value, message: `Expected undefined` }
    }
  }

  function* Union(schema: Types.TUnion, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    const errors: ValueError[] = []
    for (const inner of schema.anyOf) {
      const variantErrors = [...Visit(inner, references, path, value)]
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

  function* Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
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

  function* Unknown(schema: Types.TUnknown, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {}

  function* Void(schema: Types.TVoid, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    if (!(value === null)) {
      return yield { schema, path, value, message: `Expected null` }
    }
  }

  function* Visit<T extends Types.TSchema>(schema: T, references: Types.TSchema[], path: string, value: any): IterableIterator<ValueError> {
    const anyReferences = schema.$id === undefined ? references : [schema, ...references]
    const anySchema = schema as any

    switch (anySchema[Types.Kind]) {
      case 'Any':
        return yield* Any(anySchema, anyReferences, path, value)
      case 'Array':
        return yield* Array(anySchema, anyReferences, path, value)
      case 'Boolean':
        return yield* Boolean(anySchema, anyReferences, path, value)
      case 'Constructor':
        return yield* Constructor(anySchema, anyReferences, path, value)
      case 'Function':
        return yield* Function(anySchema, anyReferences, path, value)
      case 'Integer':
        return yield* Integer(anySchema, anyReferences, path, value)
      case 'Literal':
        return yield* Literal(anySchema, anyReferences, path, value)
      case 'Null':
        return yield* Null(anySchema, anyReferences, path, value)
      case 'Number':
        return yield* Number(anySchema, anyReferences, path, value)
      case 'Object':
        return yield* Object(anySchema, anyReferences, path, value)
      case 'Promise':
        return yield* Promise(anySchema, anyReferences, path, value)
      case 'Record':
        return yield* Record(anySchema, anyReferences, path, value)
      case 'Ref':
        return yield* Ref(anySchema, anyReferences, path, value)
      case 'Self':
        return yield* Self(anySchema, anyReferences, path, value)
      case 'String':
        return yield* String(anySchema, anyReferences, path, value)
      case 'Tuple':
        return yield* Tuple(anySchema, anyReferences, path, value)
      case 'Undefined':
        return yield* Undefined(anySchema, anyReferences, path, value)
      case 'Union':
        return yield* Union(anySchema, anyReferences, path, value)
      case 'Uint8Array':
        return yield* Uint8Array(anySchema, anyReferences, path, value)
      case 'Unknown':
        return yield* Unknown(anySchema, anyReferences, path, value)
      case 'Void':
        return yield* Void(anySchema, anyReferences, path, value)
      default:
        throw new Error(`ValueErrors: Unknown schema kind '${schema[Types.Kind]}'`)
    }
  }

  export function* Errors<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: any): IterableIterator<ValueError> {
    yield* Visit(schema, references, '', value)
  }
}
