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

export namespace CreateValue {
  const referenceMap = new Map<string, Types.TSchema>()
  let recursionDepth = 0

  function Any(schema: Types.TAny, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return {}
    }
  }

  function Array(schema: Types.TArray, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minItems !== undefined) {
      return globalThis.Array.from({ length: schema.minItems }).map((item) => {
        return CreateValue.Create(schema.items, references)
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
      const value = CreateValue.Create(schema.returns, references) as any
      if (typeof value === 'object' && !globalThis.Array.isArray(value)) {
        return class {
          constructor() {
            for (const [key, val] of globalThis.Object.entries(value)) {
              const facade: any = this
              facade[key] = val
            }
          }
        }
      } else {
        return class { }
      }
    }
  }

  function Enum(schema: Types.TEnum<any>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.anyOf.length === 0) {
      throw new Error('Cannot create default enum value as this enum has no items')
    } else {
      return schema.anyOf[0].const
    }
  }

  function Function(schema: Types.TFunction, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return () => CreateValue.Create(schema.returns, references)
    }
  }

  function Integer(schema: Types.TNumber, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minimum !== undefined) {
      return schema.minimum
    } else {
      return 0
    }
  }

  function Intersect(schema: Types.TIntersect, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return (
        schema.default ||
        globalThis.Object.entries(schema.properties).reduce((acc, [key, schema]) => {
          return { ...acc, [key]: CreateValue.Create(schema as Types.TSchema, references) }
        }, {})
      )
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
      // StackOverflow Prevention
      if (schema['$dynamicAnchor'] !== undefined) {
        for (const [key, value] of globalThis.Object.entries(schema.properties)) {
          if (value['$dynamicRef'] !== undefined && schema.required && schema.required.includes(key)) {
            throw Error(`Cannot create recursive object with immediate recursive property`)
          }
        }
      }
      const required = new Set(schema.required)
      return (
        schema.default ||
        globalThis.Object.entries(schema.properties).reduce((acc, [key, schema]) => {
          return required.has(key) ? { ...acc, [key]: CreateValue.Create(schema, references) } : { ...acc }
        }, {})
      )
    }
  }

  function Promise(schema: Types.TPromise<any>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return globalThis.Promise.resolve(CreateValue.Create(schema.item, references))
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
      throw new Error('Rec types require a default value')
    }
  }

  function Ref(schema: Types.TRef<any>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      const reference = references.find(reference => reference.$id === schema.$ref)
      if (reference === undefined) throw new Error(`ValueCreate.Ref: Cannot find schema with $id '${schema.$ref}'.`)
      return Visit(reference, references)
    }
  }
  function Self(schema: Types.TRef<any>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      const reference = references.find(reference => reference.$id === schema.$ref)
      if (reference === undefined) throw new Error(`ValueCreate.Self: Cannot locate schema with $id '${schema.$ref}'`)
      return Visit(reference, references)
    }
  }
  function String(schema: Types.TString, references: Types.TSchema[]): any {
    if (schema.pattern !== undefined) {
      if (schema.default === undefined) {
        throw Error('String types with patterns must specify a default value')
      } else {
        return schema.default
      }
    } else {
      if (schema.default !== undefined) {
        return schema.default
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
      return globalThis.Array.from({ length: schema.minItems }).map(
        (_, index) => CreateValue.Create((schema.items as any[])[index], references)
      )
    }
  }

  function Undefined(schema: Types.TUndefined, references: Types.TSchema[]): any {
    return undefined
  }

  function Union(schema: Types.TUnion<any[]>, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.anyOf.length === 0) {
      throw Error('Cannot generate Union with empty set')
    } else {
      return CreateValue.Create(schema.anyOf[0], references)
    }
  }
  function Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[]): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minByteLength) {
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
    recursionDepth += 1
    if (recursionDepth >= 1000) throw new Error('Cannot create value as schema contains a infinite expansion')
    const anySchema = schema as any
    if (anySchema.$id !== undefined) referenceMap.set(anySchema.$id, anySchema)
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return Any(anySchema, references)
      case 'Array':
        return Array(anySchema, references)
      case 'Boolean':
        return Boolean(anySchema, references)
      case 'Constructor':
        return Constructor(anySchema, references)
      case 'Enum':
        return Enum(anySchema, references)
      case 'Function':
        return Function(anySchema, references)
      case 'Integer':
        return Integer(anySchema, references)
      case 'Intersect':
        return Intersect(anySchema, references)
      case 'Literal':
        return Literal(anySchema, references)
      case 'Null':
        return Null(anySchema, references)
      case 'Number':
        return Number(anySchema, references)
      case 'Object':
        return Object(anySchema, references)
      case 'Promise':
        return Promise(anySchema, references)
      case 'Record':
        return Record(anySchema, references)
      case 'Rec':
        return Recursive(anySchema, references)
      case 'Ref':
        return Ref(anySchema, references)
      case 'Self':
        return Self(anySchema, references)
      case 'String':
        return String(anySchema, references)
      case 'Tuple':
        return Tuple(anySchema, references)
      case 'Undefined':
        return Undefined(anySchema, references)
      case 'Union':
        return Union(anySchema, references)
      case 'Uint8Array':
        return Uint8Array(anySchema, references)
      case 'Unknown':
        return Unknown(anySchema, references)
      case 'Void':
        return Void(anySchema, references)

      default:
        throw Error(`Unknown schema kind '${schema[Types.Kind]}'`)
    }
  }

  /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
  export function Create<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R]): Types.Static<T> {
    recursionDepth = 0
    if (schema.$id !== undefined) {
      references.push(schema)
    }
    return Visit(schema, references)
  }
}
