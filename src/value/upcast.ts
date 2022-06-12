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
import { CreateValue } from './create'
import { CheckValue } from './check'

// --------------------------------------------------------------------------
// Specialized Union Patch. Because a value can be one of many different
// unions with properties potentially overlapping, we need a strategy
// in which to resolve the appropriate schema to patch from.
//
// The following will score each union type found within the types anyOf
// array. Typically this is executed for objects only, so the score is a
// essentially a tally of how many properties are valid. The reasoning
// here is the discriminator field would tip the scales in favor of that
// union if other properties overlap and match.
// --------------------------------------------------------------------------

namespace UpcastUnionValue {
  function Score<T extends Types.TSchema>(schema: T, value: any): number {
    let score = 0
    if (schema[Types.Kind] === 'Object' && typeof value === 'object' && value !== null) {
      const objectSchema: Types.TObject = schema as any
      const entries = globalThis.Object.entries(objectSchema.properties)
      score += entries.reduce((acc, [key, schema]) => acc + (CheckValue.Visit(schema, value[key]) ? 1 : 0), 0)
    }
    return score
  }
  function Select<T extends Types.TUnion<any[]>>(schema: T, value: any): Types.TSchema {
    let select = schema.anyOf[0]
    let best = 0
    for (const subschema of schema.anyOf) {
      const score = Score(subschema, value)
      if (score > best) {
        select = subschema
        best = score
      }
    }
    return select
  }
  export function Create<T extends Types.TUnion<any[]>>(schema: T, value: any) {
    return CheckValue.Visit(schema, value) ? value : UpcastValue.Create(Select(schema, value), value)
  }
}

export namespace UpcastValue {
  const ids = new Map<string, Types.TObject>()

  function Any(schema: Types.TAny, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Array(schema: Types.TArray, value: any): any {
    if (CheckValue.Visit(schema, value)) return value
    if (!globalThis.Array.isArray(value)) return CreateValue.Create(schema)
    return value.map((element: any) => Create(schema.items, element))
  }

  function Boolean(schema: Types.TBoolean, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Constructor(schema: Types.TConstructor, value: any): any {
    if (CheckValue.Visit(schema, value)) return CreateValue.Create(schema)
    const required = new Set(schema.returns.required || [])
    const result = function () {}
    for (const [key, property] of globalThis.Object.entries(schema.returns.properties)) {
      if (!required.has(key) && value.prototype[key] === undefined) continue
      result.prototype[key] = Create(property as Types.TSchema, value.prototype[key])
    }
    return result
  }

  function Enum(schema: Types.TEnum<any>, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Function(schema: Types.TFunction, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Integer(schema: Types.TInteger, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Intersect(schema: Types.TIntersect, value: any): any {
    return Object(schema, value)
  }

  function Literal(schema: Types.TLiteral, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Null(schema: Types.TNull, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Number(schema: Types.TNumber, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Object(schema: Types.TObject, value: any): any {
    if (CheckValue.Visit(schema, value)) return value
    if (value === null || typeof value !== 'object') return CreateValue.Create(schema)
    ids.set(schema.$id!, schema)
    const required = new Set(schema.required || [])
    const result = {} as Record<string, any>
    for (const [key, property] of globalThis.Object.entries(schema.properties)) {
      if (!required.has(key) && value[key] === undefined) continue
      result[key] = Create(property, value[key])
    }
    return result
  }

  function Promise(schema: Types.TSchema, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Record(schema: Types.TRecord<any, any>, value: any): any {
    if (CheckValue.Visit(schema, value)) return value
    if (value === null || typeof value !== 'object' || globalThis.Array.isArray(value)) return CreateValue.Create(schema)
    const subschemaKey = globalThis.Object.keys(schema.patternProperties)[0]
    const subschema = schema.patternProperties[subschemaKey]
    const result = {} as Record<string, any>
    for (const [key, property] of globalThis.Object.entries(value)) {
      result[key] = Create(subschema, property)
    }
    return result
  }

  function Recursive(schema: Types.TRecursive<any>, value: any): any {
    throw Error('Cannot patch recursive schemas')
  }

  function Ref(schema: Types.TRef<any>, value: any): any {
    throw Error('Cannot patch referenced schemas')
  }

  function Self(schema: Types.TSelf, value: any): any {
    if (!ids.has(schema.$ref)) throw new Error(`Upcast: Cannot locate schema with $id '${schema.$id}' for referenced type`)
    return Object(ids.get(schema.$ref)!, value)
  }

  function String(schema: Types.TString, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Tuple(schema: Types.TTuple<any[]>, value: any): any {
    if (CheckValue.Visit(schema, value)) return value
    if (!globalThis.Array.isArray(value)) return CreateValue.Create(schema)
    if (schema.items === undefined) return []
    return schema.items.map((schema, index) => Create(schema, value[index]))
  }

  function Undefined(schema: Types.TUndefined, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Union(schema: Types.TUnion<any[]>, value: any): any {
    return UpcastUnionValue.Create(schema, value)
  }

  function Uint8Array(schema: Types.TUint8Array, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Unknown(schema: Types.TUnknown, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  function Void(schema: Types.TVoid, value: any): any {
    return CheckValue.Visit(schema, value) ? value : CreateValue.Create(schema)
  }

  export function Create<T extends Types.TSchema>(schema: T, value: any): Types.Static<T> {
    const anySchema = schema as any
    switch (schema[Types.Kind]) {
      case 'Any':
        return Any(anySchema, value)
      case 'Array':
        return Array(anySchema, value)
      case 'Boolean':
        return Boolean(anySchema, value)
      case 'Constructor':
        return Constructor(anySchema, value)
      case 'Enum':
        return Enum(anySchema, value)
      case 'Function':
        return Function(anySchema, value)
      case 'Integer':
        return Integer(anySchema, value)
      case 'Intersect':
        return Intersect(anySchema, value)
      case 'Literal':
        return Literal(anySchema, value)
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
      case 'Rec':
        return Recursive(anySchema, value)
      case 'Ref':
        return Ref(anySchema, value)
      case 'Self':
        return Self(anySchema, value)
      case 'String':
        return String(anySchema, value)
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
        throw Error(`Unknown schema kind '${schema[Types.Kind]}'`)
    }
  }
}
