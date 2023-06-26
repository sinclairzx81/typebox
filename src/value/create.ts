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
    super('ValueCreate: Intersect produced invalid value. Consider using a default value.')
  }
}
export class ValueCreateTempateLiteralTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCreate: Can only create template literal values from patterns that produce finite sequences. Consider using a default value.')
  }
}
export class ValueCreateDereferenceError extends Error {
  constructor(public readonly schema: Types.TRef | Types.TThis) {
    super(`ValueCreate: Unable to dereference schema with $id '${schema.$ref}'`)
  }
}
export class ValueCreateRecursiveInstantiationError extends Error {
  constructor(public readonly schema: Types.TSchema, public readonly recursiveMaxDepth: number) {
    super('ValueCreate: Value cannot be created as recursive type may produce value of infinite size. Consider using a default.')
  }
}
// --------------------------------------------------------------------------
// ValueCreate
// --------------------------------------------------------------------------
export namespace ValueCreate {
  // --------------------------------------------------------
  // Guards
  // --------------------------------------------------------
  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }
  // --------------------------------------------------------
  // Types
  // --------------------------------------------------------
  function Any(schema: Types.TAny, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return {}
    }
  }
  function Array(schema: Types.TArray, references: Types.TSchema[]): any {
    if (schema.uniqueItems === true && schema.default === undefined) {
      throw new Error('ValueCreate.Array: Arrays with uniqueItems require a default value')
    } else if ('default' in schema) {
      return schema.default
    } else if (schema.minItems !== undefined) {
      return globalThis.Array.from({ length: schema.minItems }).map((item) => {
        return Visit(schema.items, references)
      })
    } else {
      return []
    }
  }
  function BigInt(schema: Types.TBigInt, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return globalThis.BigInt(0)
    }
  }
  function Boolean(schema: Types.TBoolean, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return false
    }
  }
  function Constructor(schema: Types.TConstructor, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      const value = Visit(schema.returns, references) as any
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
  function Date(schema: Types.TDate, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.minimumTimestamp !== undefined) {
      return new globalThis.Date(schema.minimumTimestamp)
    } else {
      return new globalThis.Date(0)
    }
  }
  function Function(schema: Types.TFunction, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return () => Visit(schema.returns, references)
    }
  }
  function Integer(schema: Types.TInteger, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.minimum !== undefined) {
      return schema.minimum
    } else {
      return 0
    }
  }
  function Intersect(schema: Types.TIntersect, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      // Note: The best we can do here is attempt to instance each sub type and apply through object assign. For non-object
      // sub types, we just escape the assignment and just return the value. In the latter case, this is typically going to
      // be a consequence of an illogical intersection.
      const value = schema.allOf.reduce((acc, schema) => {
        const next = Visit(schema, references) as any
        return typeof next === 'object' ? { ...acc, ...next } : next
      }, {})
      if (!ValueCheck.Check(schema, references, value)) throw new ValueCreateIntersectTypeError(schema)
      return value
    }
  }
  function Literal(schema: Types.TLiteral, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return schema.const
    }
  }
  function Never(schema: Types.TNever, references: Types.TSchema[]): any {
    throw new ValueCreateNeverTypeError(schema)
  }
  function Not(schema: Types.TNot, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return Visit(schema.allOf[1], references)
    }
  }
  function Null(schema: Types.TNull, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return null
    }
  }
  function Number(schema: Types.TNumber, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.minimum !== undefined) {
      return schema.minimum
    } else {
      return 0
    }
  }
  function Object(schema: Types.TObject, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      const required = new Set(schema.required)
      return (
        schema.default ||
        globalThis.Object.entries(schema.properties).reduce((acc, [key, schema]) => {
          return required.has(key) ? { ...acc, [key]: Visit(schema, references) } : { ...acc }
        }, {})
      )
    }
  }
  function Promise(schema: Types.TPromise<any>, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return globalThis.Promise.resolve(Visit(schema.item, references))
    }
  }
  function Record(schema: Types.TRecord<any, any>, references: Types.TSchema[]): any {
    const [keyPattern, valueSchema] = globalThis.Object.entries(schema.patternProperties)[0]
    if ('default' in schema) {
      return schema.default
    } else if (!(keyPattern === Types.PatternStringExact || keyPattern === Types.PatternNumberExact)) {
      const propertyKeys = keyPattern.slice(1, keyPattern.length - 1).split('|')
      return propertyKeys.reduce((acc, key) => {
        return { ...acc, [key]: Visit(valueSchema, references) }
      }, {})
    } else {
      return {}
    }
  }
  function Ref(schema: Types.TRef<any>, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
      if (index === -1) throw new ValueCreateDereferenceError(schema)
      const target = references[index]
      return Visit(target, references)
    }
  }
  function String(schema: Types.TString, references: Types.TSchema[]): any {
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
  function Symbol(schema: Types.TString, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else if ('value' in schema) {
      return globalThis.Symbol.for(schema.value)
    } else {
      return globalThis.Symbol()
    }
  }
  function TemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[]) {
    if ('default' in schema) {
      return schema.default
    }
    const expression = Types.TemplateLiteralParser.ParseExact(schema.pattern)
    if (!Types.TemplateLiteralFinite.Check(expression)) throw new ValueCreateTempateLiteralTypeError(schema)
    const sequence = Types.TemplateLiteralGenerator.Generate(expression)
    return sequence.next().value
  }
  function This(schema: Types.TThis, references: Types.TSchema[]): any {
    if (recursiveDepth++ > recursiveMaxDepth) throw new ValueCreateRecursiveInstantiationError(schema, recursiveMaxDepth)
    if ('default' in schema) {
      return schema.default
    } else {
      const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
      if (index === -1) throw new ValueCreateDereferenceError(schema)
      const target = references[index]
      return Visit(target, references)
    }
  }
  function Tuple(schema: Types.TTuple<any[]>, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    }
    if (schema.items === undefined) {
      return []
    } else {
      return globalThis.Array.from({ length: schema.minItems }).map((_, index) => Visit((schema.items as any[])[index], references))
    }
  }
  function Undefined(schema: Types.TUndefined, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return undefined
    }
  }
  function Union(schema: Types.TUnion<any[]>, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.anyOf.length === 0) {
      throw new Error('ValueCreate.Union: Cannot create Union with zero variants')
    } else {
      return Visit(schema.anyOf[0], references)
    }
  }
  function Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else if (schema.minByteLength !== undefined) {
      return new globalThis.Uint8Array(schema.minByteLength)
    } else {
      return new globalThis.Uint8Array(0)
    }
  }
  function Unknown(schema: Types.TUnknown, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return {}
    }
  }
  function Void(schema: Types.TVoid, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      return void 0
    }
  }
  function UserDefined(schema: Types.TSchema, references: Types.TSchema[]): any {
    if ('default' in schema) {
      return schema.default
    } else {
      throw new Error('ValueCreate.UserDefined: User defined types must specify a default value')
    }
  }
  /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
  export function Visit(schema: Types.TSchema, references: Types.TSchema[]): unknown {
    const references_ = IsString(schema.$id) ? [...references, schema] : references
    const schema_ = schema as any
    switch (schema_[Types.Kind]) {
      case 'Any':
        return Any(schema_, references_)
      case 'Array':
        return Array(schema_, references_)
      case 'BigInt':
        return BigInt(schema_, references_)
      case 'Boolean':
        return Boolean(schema_, references_)
      case 'Constructor':
        return Constructor(schema_, references_)
      case 'Date':
        return Date(schema_, references_)
      case 'Function':
        return Function(schema_, references_)
      case 'Integer':
        return Integer(schema_, references_)
      case 'Intersect':
        return Intersect(schema_, references_)
      case 'Literal':
        return Literal(schema_, references_)
      case 'Never':
        return Never(schema_, references_)
      case 'Not':
        return Not(schema_, references_)
      case 'Null':
        return Null(schema_, references_)
      case 'Number':
        return Number(schema_, references_)
      case 'Object':
        return Object(schema_, references_)
      case 'Promise':
        return Promise(schema_, references_)
      case 'Record':
        return Record(schema_, references_)
      case 'Ref':
        return Ref(schema_, references_)
      case 'String':
        return String(schema_, references_)
      case 'Symbol':
        return Symbol(schema_, references_)
      case 'TemplateLiteral':
        return TemplateLiteral(schema_, references_)
      case 'This':
        return This(schema_, references_)
      case 'Tuple':
        return Tuple(schema_, references_)
      case 'Undefined':
        return Undefined(schema_, references_)
      case 'Union':
        return Union(schema_, references_)
      case 'Uint8Array':
        return Uint8Array(schema_, references_)
      case 'Unknown':
        return Unknown(schema_, references_)
      case 'Void':
        return Void(schema_, references_)
      default:
        if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueCreateUnknownTypeError(schema_)
        return UserDefined(schema_, references_)
    }
  }
  // --------------------------------------------------------
  // State
  // --------------------------------------------------------
  const recursiveMaxDepth = 512
  let recursiveDepth = 0

  /** Creates a value from the given schema and references */
  export function Create<T extends Types.TSchema>(schema: T, references: Types.TSchema[]): Types.Static<T> {
    recursiveDepth = 0
    return Visit(schema, references)
  }
}
