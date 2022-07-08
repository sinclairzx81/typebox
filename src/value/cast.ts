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
import { ValueCreate } from './create'
import { ValueCheck } from './check'

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

namespace UnionValueCast {
  function Score(schema: Types.TSchema, references: Types.TSchema[], value: any): number {
    let score = 0
    if (schema[Types.Kind] === 'Object' && typeof value === 'object' && value !== null) {
      const objectSchema: Types.TObject = schema as any
      const entries = globalThis.Object.entries(objectSchema.properties)
      score += entries.reduce((acc, [key, schema]) => acc + (ValueCheck.Check(schema, references, value[key]) ? 1 : 0), 0)
    }
    return score
  }
  function Select(schema: Types.TUnion, references: Types.TSchema[], value: any): Types.TSchema {
    let select = schema.anyOf[0]
    let best = 0
    for (const subschema of schema.anyOf) {
      const score = Score(subschema, references, value)
      if (score > best) {
        select = subschema
        best = score
      }
    }
    return select
  }
  export function Create(schema: Types.TUnion, references: Types.TSchema[], value: any) {
    return ValueCheck.Check(schema, references, value) ? value : ValueCast.Cast(Select(schema, references, value), references, value)
  }
}

export namespace ValueCast {
  function Any(schema: Types.TAny, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Array(schema: Types.TArray, references: Types.TSchema[], value: any): any {
    if (ValueCheck.Check(schema, references, value)) return value
    if (!globalThis.Array.isArray(value)) return ValueCreate.Create(schema, references)
    return value.map((val: any) => Visit(schema.items, references, val))
  }

  function Boolean(schema: Types.TBoolean, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Constructor(schema: Types.TConstructor, references: Types.TSchema[], value: any): any {
    if (ValueCheck.Check(schema, references, value)) return ValueCreate.Create(schema, references)
    const required = new Set(schema.returns.required || [])
    const result = function () {}
    for (const [key, property] of globalThis.Object.entries(schema.returns.properties)) {
      if (!required.has(key) && value.prototype[key] === undefined) continue
      result.prototype[key] = Visit(property as Types.TSchema, references, value.prototype[key])
    }
    return result
  }

  function Enum(schema: Types.TEnum<any>, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Function(schema: Types.TFunction, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Integer(schema: Types.TInteger, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Literal(schema: Types.TLiteral, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Null(schema: Types.TNull, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Number(schema: Types.TNumber, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Object(schema: Types.TObject, references: Types.TSchema[], value: any): any {
    if (ValueCheck.Check(schema, references, value)) return value
    if (value === null || typeof value !== 'object') return ValueCreate.Create(schema, references)
    const required = new Set(schema.required || [])
    const result = {} as Record<string, any>
    for (const [key, property] of globalThis.Object.entries(schema.properties)) {
      if (!required.has(key) && value[key] === undefined) continue
      result[key] = Visit(property, references, value[key])
    }
    return result
  }

  function Promise(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Record(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any): any {
    if (ValueCheck.Check(schema, references, value)) return value
    if (value === null || typeof value !== 'object' || globalThis.Array.isArray(value)) return ValueCreate.Create(schema, references)
    const subschemaKey = globalThis.Object.keys(schema.patternProperties)[0]
    const subschema = schema.patternProperties[subschemaKey]
    const result = {} as Record<string, any>
    for (const [propKey, propValue] of globalThis.Object.entries(value)) {
      result[propKey] = Visit(subschema, references, propValue)
    }
    return result
  }

  function Recursive(schema: Types.TRecursive<any>, references: Types.TSchema[], value: any): any {
    throw new Error('ValueCast.Recursive: Cannot cast recursive schemas')
  }

  function Ref(schema: Types.TRef<any>, references: Types.TSchema[], value: any): any {
    const reference = references.find((reference) => reference.$id === schema.$ref)
    if (reference === undefined) throw new Error(`ValueCast.Ref: Cannot find schema with $id '${schema.$ref}'.`)
    return Visit(reference, references, value)
  }

  function Self(schema: Types.TSelf, references: Types.TSchema[], value: any): any {
    const reference = references.find((reference) => reference.$id === schema.$ref)
    if (reference === undefined) throw new Error(`ValueCast.Self: Cannot find schema with $id '${schema.$ref}'.`)
    return Visit(reference, references, value)
  }

  function String(schema: Types.TString, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Tuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: any): any {
    if (ValueCheck.Check(schema, references, value)) return value
    if (!globalThis.Array.isArray(value)) return ValueCreate.Create(schema, references)
    if (schema.items === undefined) return []
    return schema.items.map((schema, index) => Visit(schema, references, value[index]))
  }

  function Undefined(schema: Types.TUndefined, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Union(schema: Types.TUnion, references: Types.TSchema[], value: any): any {
    return UnionValueCast.Create(schema, references, value)
  }

  function Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Unknown(schema: Types.TUnknown, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  function Void(schema: Types.TVoid, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }

  export function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
    const anyReferences = schema.$id === undefined ? references : [schema, ...references]
    const anySchema = schema as any

    switch (schema[Types.Kind]) {
      case 'Any':
        return Any(anySchema, anyReferences, value)
      case 'Array':
        return Array(anySchema, anyReferences, value)
      case 'Boolean':
        return Boolean(anySchema, anyReferences, value)
      case 'Constructor':
        return Constructor(anySchema, anyReferences, value)
      case 'Enum':
        return Enum(anySchema, anyReferences, value)
      case 'Function':
        return Function(anySchema, anyReferences, value)
      case 'Integer':
        return Integer(anySchema, anyReferences, value)
      case 'Literal':
        return Literal(anySchema, anyReferences, value)
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
      case 'Rec':
        return Recursive(anySchema, anyReferences, value)
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
        throw Error(`ValueCast.Visit: Unknown schema kind '${schema[Types.Kind]}'`)
    }
  }

  export function Cast<T extends Types.TSchema, R extends Types.TSchema[]>(schema: T, references: [...R], value: any): Types.Static<T> {
    return schema.$id === undefined ? Visit(schema, references, value) : Visit(schema, [schema, ...references], value)
  }
}
