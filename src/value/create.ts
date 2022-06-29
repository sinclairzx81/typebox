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

  function Any(schema: Types.TAny): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return {}
    }
  }

  function Array(schema: Types.TArray): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minItems !== undefined) {
      return globalThis.Array.from({ length: schema.minItems }).map((item) => {
        return CreateValue.Create(schema.items)
      })
    } else {
      return []
    }
  }

  function Boolean(schema: Types.TBoolean): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return false
    }
  }

  function Constructor(schema: Types.TConstructor): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      const value = CreateValue.Create(schema.returns) as any
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
        return class {}
      }
    }
  }

  function Enum(schema: Types.TEnum<any>): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.anyOf.length === 0) {
      throw new Error('Cannot create default enum value as this enum has no items')
    } else {
      return schema.anyOf[0].const
    }
  }

  function Function(schema: Types.TFunction): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return () => CreateValue.Create(schema.returns)
    }
  }

  function Integer(schema: Types.TNumber): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minimum !== undefined) {
      return schema.minimum
    } else {
      return 0
    }
  }

  function Intersect(schema: Types.TIntersect): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return (
        schema.default ||
        globalThis.Object.entries(schema.properties).reduce((acc, [key, schema]) => {
          return { ...acc, [key]: CreateValue.Create(schema as Types.TSchema) }
        }, {})
      )
    }
  }

  function Literal(schema: Types.TLiteral): any {
    return schema.const
  }

  function Null(schema: Types.TNull): any {
    return null
  }

  function Number(schema: Types.TNumber): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minimum !== undefined) {
      return schema.minimum
    } else {
      return 0
    }
  }

  function Object(schema: Types.TObject): any {
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
          return required.has(key) ? { ...acc, [key]: CreateValue.Create(schema) } : { ...acc }
        }, {})
      )
    }
  }

  function Promise(schema: Types.TPromise<any>): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return globalThis.Promise.resolve(CreateValue.Create(schema.item))
    }
  }

  function Record(schema: Types.TRecord<any, any>): any {
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    if (schema.default !== undefined) {
      return schema.default
    } else if (!(keyPattern === '^.*$' || keyPattern === '^(0|[1-9][0-9]*)$')) {
      const propertyKeys = keyPattern.slice(1, keyPattern.length - 1).split('|')
      return propertyKeys.reduce((acc, key) => {
        return { ...acc, [key]: Create(valueSchema) }
      }, {})
    } else {
      return {}
    }
  }

  function Recursive(schema: Types.TRecursive<any>): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      throw new Error('Rec types require a default value')
    }
  }

  function Ref(schema: Types.TRef<any>): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      throw new Error('Ref types require a default value')
    }
  }

  function String(schema: Types.TString): any {
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

  function Tuple(schema: Types.TTuple<any[]>): any {
    if (schema.default !== undefined) {
      return schema.default
    }
    if (schema.items === undefined) {
      return []
    } else {
      return globalThis.Array.from({ length: schema.minItems }).map((_, index) => CreateValue.Create((schema.items as any[])[index]))
    }
  }

  function Undefined(schema: Types.TUndefined): any {
    return undefined
  }

  function Union(schema: Types.TUnion<any[]>): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.anyOf.length === 0) {
      throw Error('Cannot generate Union with empty set')
    } else {
      return CreateValue.Create(schema.anyOf[0])
    }
  }
  function Uint8Array(schema: Types.TUint8Array): any {
    if (schema.default !== undefined) {
      return schema.default
    } else if (schema.minByteLength) {
      return new globalThis.Uint8Array(schema.minByteLength)
    } else {
      return new globalThis.Uint8Array(0)
    }
  }

  function Unknown(schema: Types.TUnknown): any {
    if (schema.default !== undefined) {
      return schema.default
    } else {
      return {}
    }
  }

  function Void(schema: Types.TVoid): any {
    return null
  }

  /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
  export function Visit<T extends Types.TSchema>(schema: T): Types.Static<T> {
    recursionDepth += 1
    if (recursionDepth >= 1000) throw new Error('Cannot create value as schema contains a infinite expansion')
    const anySchema = schema as any
    if (anySchema.$id !== undefined) referenceMap.set(anySchema.$id, anySchema)
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return Any(anySchema)
      case 'Array':
        return Array(anySchema)
      case 'Boolean':
        return Boolean(anySchema)
      case 'Constructor':
        return Constructor(anySchema)
      case 'Enum':
        return Enum(anySchema)
      case 'Function':
        return Function(anySchema)
      case 'Integer':
        return Integer(anySchema)
      case 'Intersect':
        return Intersect(anySchema)
      case 'Literal':
        return Literal(anySchema)
      case 'Null':
        return Null(anySchema)
      case 'Number':
        return Number(anySchema)
      case 'Object':
        return Object(anySchema)
      case 'Promise':
        return Promise(anySchema)
      case 'Record':
        return Record(anySchema)
      case 'Rec':
        return Recursive(anySchema)
      case 'Ref':
        return Ref(anySchema)
      case 'String':
        return String(anySchema)
      case 'Tuple':
        return Tuple(anySchema)
      case 'Undefined':
        return Undefined(anySchema)
      case 'Union':
        return Union(anySchema)
      case 'Uint8Array':
        return Uint8Array(anySchema)
      case 'Unknown':
        return Unknown(anySchema)
      case 'Void':
        return Void(anySchema)
      case 'Self':
        return Visit(referenceMap.get(anySchema.$ref)!)
      default:
        throw Error(`Unknown schema kind '${schema[Types.Kind]}'`)
    }
  }

  /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
  export function Create<T extends Types.TSchema>(schema: T): Types.Static<T> {
    recursionDepth = 0
    return Visit(schema)
  }
}
