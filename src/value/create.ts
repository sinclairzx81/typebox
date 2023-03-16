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
import { ValueCheck } from './check'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
export class ValueCreateUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCreate: Unknown type')
  }
}
export class ValueCreateNeverTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCreate: Never types cannot be created')
  }
}
export class ValueCreateIntersectTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCreate: Can only create values for intersected objects and non-varying primitive types. Consider using a default value.')
  }
}
// --------------------------------------------------------------------------
// ValueCreate
// --------------------------------------------------------------------------
export namespace ValueCreate {
  function Any(schema: Types.TAny): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return {}
    }
  }
  function Array(schema: Types.TArray): any {
    if (schema.uniqueItems === true && schema.default === undefined) {
      throw new Error('ValueCreate.Array: Arrays with uniqueItems require a default value')
    } else if ('default' in schema) {
      return schema.default
    } else if (schema.minItems !== undefined) {
      return globalThis.Array.from({ length: schema.minItems }).map((item) => {
        return ValueCreate.Create(schema.items)
      })
    } else {
      return []
    }
  }
  function BigInt(schema: Types.TBigInt): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return globalThis.BigInt(0)
    }
  }
  function Boolean(schema: Types.TBoolean): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return false
    }
  }
  function Constructor(schema: Types.TConstructor): any {
    if ('default' in schema) {
      return schema.default
    } else {
      const value = ValueCreate.Create(schema.returns) as any
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
  function Date(schema: Types.TDate): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.minimumTimestamp !== undefined) {
      return new globalThis.Date(schema.minimumTimestamp)
    } else {
      return new globalThis.Date(0)
    }
  }
  function Function(schema: Types.TFunction): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return () => ValueCreate.Create(schema.returns)
    }
  }
  function Integer(schema: Types.TInteger): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.minimum !== undefined) {
      return schema.minimum
    } else {
      return 0
    }
  }
  function Intersect(schema: Types.TIntersect): any {
    if ('default' in schema) {
      return schema.default
    } else {
      const value = schema.type === 'object' ? schema.allOf.reduce((acc, schema) => ({ ...acc, ...(Visit(schema) as any) }), {}) : schema.allOf.reduce((_, schema) => Visit(schema), undefined as any)
      if (!ValueCheck.Check(schema, value)) throw new ValueCreateIntersectTypeError(schema)
      return value
    }
  }
  function Literal(schema: Types.TLiteral): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return schema.const
    }
  }
  function Never(schema: Types.TNever): any {
    throw new ValueCreateNeverTypeError(schema)
  }
  function Not(schema: Types.TNot): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return Visit(schema.allOf[1])
    }
  }
  function Null(schema: Types.TNull): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return null
    }
  }
  function Number(schema: Types.TNumber): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.minimum !== undefined) {
      return schema.minimum
    } else {
      return 0
    }
  }
  function Object(schema: Types.TObject): any {
    if ('default' in schema) {
      return schema.default
    } else {
      const required = new Set(schema.required)
      return (
        schema.default ||
        globalThis.Object.entries(schema.properties).reduce((acc, [key, schema]) => {
          return required.has(key) ? { ...acc, [key]: ValueCreate.Create(schema) } : { ...acc }
        }, {})
      )
    }
  }
  function Promise(schema: Types.TPromise<any>): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return globalThis.Promise.resolve(ValueCreate.Create(schema.item))
    }
  }
  function Record(schema: Types.TRecord<any, any>): any {
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    if ('default' in schema) {
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
  function Ref(schema: Types.TRef<any>): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return Visit(Types.ReferenceRegistry.DerefOne(schema))
    }
  }
  function Self(schema: Types.TSelf): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return Visit(Types.ReferenceRegistry.DerefOne(schema))
    }
  }
  function String(schema: Types.TString): any {
    if (schema.pattern !== undefined) {
      if (!('default' in schema)) {
        throw new Error('ValueCreate.String: String types with patterns must specify a default value')
      } else {
        return schema.default
      }
    } else if (schema.format !== undefined) {
      if (!('default' in schema)) {
        throw new Error('ValueCreate.String: String types with formats must specify a default value')
      } else {
        return schema.default
      }
    } else {
      if ('default' in schema) {
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
  function Symbol(schema: Types.TString): any {
    if ('default' in schema) {
      return schema.default
    } else if ('value' in schema) {
      return globalThis.Symbol.for(schema.value)
    } else {
      return globalThis.Symbol()
    }
  }
  function Tuple(schema: Types.TTuple<any[]>): any {
    if ('default' in schema) {
      return schema.default
    }
    if (schema.items === undefined) {
      return []
    } else {
      return globalThis.Array.from({ length: schema.minItems }).map((_, index) => ValueCreate.Create((schema.items as any[])[index]))
    }
  }
  function Undefined(schema: Types.TUndefined): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return undefined
    }
  }
  function Union(schema: Types.TUnion<any[]>): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.anyOf.length === 0) {
      throw new Error('ValueCreate.Union: Cannot create Union with zero variants')
    } else {
      return ValueCreate.Create(schema.anyOf[0])
    }
  }
  function Uint8Array(schema: Types.TUint8Array): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.minByteLength !== undefined) {
      return new globalThis.Uint8Array(schema.minByteLength)
    } else {
      return new globalThis.Uint8Array(0)
    }
  }
  function Unknown(schema: Types.TUnknown): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return {}
    }
  }
  function Void(schema: Types.TVoid): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return void 0
    }
  }
  function UserDefined(schema: Types.TSchema): any {
    if ('default' in schema) {
      return schema.default
    } else {
      throw new Error('ValueCreate.UserDefined: User defined types must specify a default value')
    }
  }
  /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
  export function Visit<T extends Types.TSchema>(schema: T): Types.Static<T> {
    const anySchema = schema as any
    switch (anySchema[Types.Kind]) {
      case 'Any':
        return Any(anySchema)
      case 'Array':
        return Array(anySchema)
      case 'BigInt':
        return BigInt(anySchema)
      case 'Boolean':
        return Boolean(anySchema)
      case 'Constructor':
        return Constructor(anySchema)
      case 'Date':
        return Date(anySchema)
      case 'Function':
        return Function(anySchema)
      case 'Integer':
        return Integer(anySchema)
      case 'Intersect':
        return Intersect(anySchema)
      case 'Literal':
        return Literal(anySchema)
      case 'Never':
        return Never(anySchema)
      case 'Not':
        return Not(anySchema)
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
      case 'Ref':
        return Ref(anySchema)
      case 'Self':
        return Self(anySchema)
      case 'String':
        return String(anySchema)
      case 'Symbol':
        return Symbol(anySchema)
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
      default:
        if (!Types.TypeRegistry.Has(anySchema[Types.Kind])) throw new ValueCreateUnknownTypeError(anySchema)
        return UserDefined(anySchema)
    }
  }
  export function Create<T extends Types.TSchema>(schema: T): Types.Static<T> {
    return Visit(schema)
  }
}
