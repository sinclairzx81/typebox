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

import { TypeGuard } from '../guard/index'
import * as Types from '../typebox'

export class ValueCheckInvalidTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCheck: Invalid type')
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
    return Visit(schema.returns, references, value)
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
    const refs = schema.$id === undefined ? references : [schema, ...references]
    if (TypeGuard.TAny(schema)) {
      return Any(schema, refs, value)
    } else if (TypeGuard.TArray(schema)) {
      return Array(schema, refs, value)
    } else if (TypeGuard.TBoolean(schema)) {
      return Boolean(schema, refs, value)
    } else if (TypeGuard.TConstructor(schema)) {
      return Constructor(schema, refs, value)
    } else if (TypeGuard.TFunction(schema)) {
      return Function(schema, refs, value)
    } else if (TypeGuard.TInteger(schema)) {
      return Integer(schema, refs, value)
    } else if (TypeGuard.TLiteral(schema)) {
      return Literal(schema, refs, value)
    } else if (TypeGuard.TNull(schema)) {
      return Null(schema, refs, value)
    } else if (TypeGuard.TNumber(schema)) {
      return Number(schema, refs, value)
    } else if (TypeGuard.TObject(schema)) {
      return Object(schema, refs, value)
    } else if (TypeGuard.TPromise(schema)) {
      return Promise(schema, refs, value)
    } else if (TypeGuard.TRecord(schema)) {
      return Record(schema, refs, value)
    } else if (TypeGuard.TRef(schema)) {
      return Ref(schema, refs, value)
    } else if (TypeGuard.TSelf(schema)) {
      return Self(schema, refs, value)
    } else if (TypeGuard.TString(schema)) {
      return String(schema, refs, value)
    } else if (TypeGuard.TTuple(schema)) {
      return Tuple(schema, refs, value)
    } else if (TypeGuard.TUndefined(schema)) {
      return Undefined(schema, refs, value)
    } else if (TypeGuard.TUnion(schema)) {
      return Union(schema, refs, value)
    } else if (TypeGuard.TUint8Array(schema)) {
      return Uint8Array(schema, refs, value)
    } else if (TypeGuard.TUnknown(schema)) {
      return Unknown(schema, refs, value)
    } else if (TypeGuard.TVoid(schema)) {
      return Void(schema, refs, value)
    } else {
      throw new ValueCheckInvalidTypeError(schema)
    }
  }

  // -------------------------------------------------------------------------
  // Check
  // -------------------------------------------------------------------------

  export function Check<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: any): boolean {
    return schema.$id === undefined ? Visit(schema, references, value) : Visit(schema, [schema, ...references], value)
  }
}
