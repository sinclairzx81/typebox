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

export class ValueCreateInvalidTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCreate: Invalid type')
  }
}

export namespace ValueCreate {
  function Any(schema: Types.TAny, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return {}
    }
  }

  function Array(schema: Types.TArray, references: Types.TSchema[]): any {
    if (schema.uniqueItems === true && schema.default === undefined) {
      throw new Error('ValueCreate.Array: Arrays with uniqueItems require a default value')
    } else if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minItems !== undefined) {
      return globalThis.Array.from({ length: schema.minItems }).map((item) => {
        return ValueCreate.Create(schema.items, references)
      })
    } else {
      return []
    }
  }

  function Boolean(schema: Types.TBoolean, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return false
    }
  }

  function Constructor(schema: Types.TConstructor, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      const value = ValueCreate.Create(schema.returns, references) as any
      if (typeof value === 'object' && !globalThis.Array.isArray(value)) {
        return class {
          constructor() {
            for (const [key, val] of globalThis.Object.entries(value)) {
              const self = this as any
              self[key] = val
            }
          }
        }
      } else {
        return class {}
      }
    }
  }

  function Enum(schema: Types.TEnum<any>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.anyOf.length === 0) {
      throw new Error('ValueCreate.Enum: Cannot create default enum value as this enum has no items')
    } else {
      return schema.anyOf[0].const
    }
  }

  function Function(schema: Types.TFunction, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return () => ValueCreate.Create(schema.returns, references)
    }
  }

  function Integer(schema: Types.TInteger, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minimum !== undefined) {
      return schema.minimum
    } else {
      return 0
    }
  }

  function Literal(schema: Types.TLiteral, references: Types.TSchema[]): any {
    return schema.const
  }

  function Null(schema: Types.TNull, references: Types.TSchema[]): any {
    return null
  }

  function Number(schema: Types.TNumber, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minimum !== undefined) {
      return schema.minimum
    } else {
      return 0
    }
  }

  function Object(schema: Types.TObject, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      const required = new Set(schema.required)
      return (
        schema.default ||
        globalThis.Object.entries(schema.properties).reduce((acc, [key, schema]) => {
          return required.has(key) ? { ...acc, [key]: ValueCreate.Create(schema, references) } : { ...acc }
        }, {})
      )
    }
  }

  function Promise(schema: Types.TPromise<any>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return globalThis.Promise.resolve(ValueCreate.Create(schema.item, references))
    }
  }

  function Record(schema: Types.TRecord<any, any>, references: Types.TSchema[]): any {
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    if (schema.default !== undefined) {
      return schema.default
    } else if (!(keyPattern === '^.*$' || keyPattern === '^(0|[1-9][0-9]*)$')) {
      const propertyKeys = keyPattern.slice(1, keyPattern.length - 1).split('|')
      return propertyKeys.reduce((acc, key) => {
        return { ...acc, [key]: Create(valueSchema, references) }
      }, {})
    } else {
      return {}
    }
  }

  function Recursive(schema: Types.TRecursive<any>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      throw new Error('ValueCreate.Recursive: Recursive types require a default value')
    }
  }

  function Ref(schema: Types.TRef<any>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      const reference = references.find((reference) => reference.$id === schema.$ref)
      if (reference === undefined) throw new Error(`ValueCreate.Ref: Cannot find schema with $id '${schema.$ref}'.`)
      return Visit(reference, references)
    }
  }
  function Self(schema: Types.TSelf, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      const reference = references.find((reference) => reference.$id === schema.$ref)
      if (reference === undefined) throw new Error(`ValueCreate.Self: Cannot locate schema with $id '${schema.$ref}'`)
      return Visit(reference, references)
    }
  }
  function String(schema: Types.TString, references: Types.TSchema[]): any {
    if (schema.pattern !== undefined) {
      if (schema.default === undefined) {
        throw new Error('ValueCreate.String: String types with patterns must specify a default value')
      } else {
        return schema.default
      }
    } else {
      if (schema.default !== undefined) {
        return schema.default
      } else if (schema.minLength !== undefined) {
        return globalThis.Array.from({ length: schema.minLength })
          .map(() => '.')
          .join('')
      } else {
        return ''
      }
    }
  }

  function Tuple(schema: Types.TTuple<any[]>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    }
    if (schema.items === undefined) {
      return []
    } else {
      return globalThis.Array.from({ length: schema.minItems }).map((_, index) => ValueCreate.Create((schema.items as any[])[index], references))
    }
  }

  function Undefined(schema: Types.TUndefined, references: Types.TSchema[]): any {
    return undefined
  }

  function Union(schema: Types.TUnion<any[]>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.anyOf.length === 0) {
      throw new Error('ValueCreate.Union: Cannot create Union with zero variants')
    } else {
      return ValueCreate.Create(schema.anyOf[0], references)
    }
  }
  function Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minByteLength !== undefined) {
      return new globalThis.Uint8Array(schema.minByteLength)
    } else {
      return new globalThis.Uint8Array(0)
    }
  }

  function Unknown(schema: Types.TUnknown, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return {}
    }
  }

  function Void(schema: Types.TVoid, references: Types.TSchema[]): any {
    return null
  }

  /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
  export function Visit<T extends Types.TSchema>(schema: T, references: Types.TSchema[]): Types.Static<T> {
    const refs = schema.$id === undefined ? references : [schema, ...references]
    if (TypeGuard.TAny(schema)) {
      return Any(schema, refs)
    } else if (TypeGuard.TArray(schema)) {
      return Array(schema, refs)
    } else if (TypeGuard.TBoolean(schema)) {
      return Boolean(schema, refs)
    } else if (TypeGuard.TConstructor(schema)) {
      return Constructor(schema, refs)
    } else if (TypeGuard.TFunction(schema)) {
      return Function(schema, refs)
    } else if (TypeGuard.TInteger(schema)) {
      return Integer(schema, refs)
    } else if (TypeGuard.TLiteral(schema)) {
      return Literal(schema, refs)
    } else if (TypeGuard.TNull(schema)) {
      return Null(schema, refs)
    } else if (TypeGuard.TNumber(schema)) {
      return Number(schema, refs)
    } else if (TypeGuard.TObject(schema)) {
      return Object(schema, refs)
    } else if (TypeGuard.TPromise(schema)) {
      return Promise(schema, refs)
    } else if (TypeGuard.TRecord(schema)) {
      return Record(schema, refs)
    } else if (TypeGuard.TRef(schema)) {
      return Ref(schema, refs)
    } else if (TypeGuard.TSelf(schema)) {
      return Self(schema, refs)
    } else if (TypeGuard.TString(schema)) {
      return String(schema, refs)
    } else if (TypeGuard.TTuple(schema)) {
      return Tuple(schema, refs)
    } else if (TypeGuard.TUndefined(schema)) {
      return Undefined(schema, refs)
    } else if (TypeGuard.TUnion(schema)) {
      return Union(schema, refs)
    } else if (TypeGuard.TUint8Array(schema)) {
      return Uint8Array(schema, refs)
    } else if (TypeGuard.TUnknown(schema)) {
      return Unknown(schema, refs)
    } else if (TypeGuard.TVoid(schema)) {
      return Void(schema, refs)
    } else {
      throw new ValueCreateInvalidTypeError(schema)
    }
  }

  export function Create<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R]): Types.Static<T> {
    return Visit(schema, references)
  }
}
