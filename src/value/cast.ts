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
import { ValueCreate } from './create'
import { ValueCheck } from './check'
import { ValueClone } from './clone'

// ----------------------------------------------------------------------------------------------
// Errors
// ----------------------------------------------------------------------------------------------
export class ValueCastReferenceTypeError extends Error {
  constructor(public readonly schema: Types.TRef | Types.TSelf) {
    super(`ValueCast: Cannot locate referenced schema with $id '${schema.$ref}'`)
  }
}
export class ValueCastArrayUniqueItemsTypeError extends Error {
  constructor(public readonly schema: Types.TSchema, public readonly value: unknown) {
    super('ValueCast: Array cast produced invalid data due to uniqueItems constraint')
  }
}
export class ValueCastNeverTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCast: Never types cannot be cast')
  }
}
export class ValueCastRecursiveTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCast.Recursive: Cannot cast recursive schemas')
  }
}
export class ValueCastUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCast: Unknown type')
  }
}

// ----------------------------------------------------------------------------------------------
// The following will score a schema against a value. For objects, the score is the tally of
// points awarded for each property of the value. Property points are (1.0 / propertyCount)
// to prevent large property counts biasing results. Properties that match literal values are
// maximally awarded as literals are typically used as union discriminator fields.
// ----------------------------------------------------------------------------------------------
namespace UnionCastCreate {
  function Score(schema: Types.TSchema, value: any): number {
    if (schema[Types.Kind] === 'Object' && typeof value === 'object' && value !== null) {
      const object = schema as Types.TObject
      const keys = Object.keys(value)
      const entries = globalThis.Object.entries(object.properties)
      const [point, max] = [1 / entries.length, entries.length]
      return entries.reduce((acc, [key, schema]) => {
        const literal = schema[Types.Kind] === 'Literal' && schema.const === value[key] ? max : 0
        const checks = ValueCheck.Check(schema, value[key]) ? point : 0
        const exists = keys.includes(key) ? point : 0
        return acc + (literal + checks + exists)
      }, 0)
    } else {
      return ValueCheck.Check(schema, value) ? 1 : 0
    }
  }
  function Select(union: Types.TUnion, value: any): Types.TSchema {
    let [select, best] = [union.anyOf[0], 0]
    for (const schema of union.anyOf) {
      const score = Score(schema, value)
      if (score > best) {
        select = schema
        best = score
      }
    }
    return select
  }
  export function Create(union: Types.TUnion, value: any) {
    if (union.default !== undefined) {
      return union.default
    } else {
      const schema = Select(union, value)
      return ValueCast.Cast(schema, value)
    }
  }
}

export namespace ValueCast {
  // ----------------------------------------------------------------------------------------------
  // Guards
  // ----------------------------------------------------------------------------------------------
  function IsObject(value: unknown): value is Record<keyof any, unknown> {
    return typeof value === 'object' && value !== null && !globalThis.Array.isArray(value)
  }
  function IsArray(value: unknown): value is unknown[] {
    return typeof value === 'object' && globalThis.Array.isArray(value)
  }
  function IsNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value)
  }
  // ----------------------------------------------------------------------------------------------
  // Cast
  // ----------------------------------------------------------------------------------------------
  function Any(schema: Types.TAny, value: any): any {
    return ValueCheck.Check(schema, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema)
  }
  function Array(schema: Types.TArray, value: any): any {
    if (ValueCheck.Check(schema, value)) return ValueClone.Clone(value)
    const created = IsArray(value) ? ValueClone.Clone(value) : ValueCreate.Create(schema)
    const minimum = IsNumber(schema.minItems) && created.length < schema.minItems ? [...created, ...globalThis.Array.from({ length: schema.minItems - created.length }, () => null)] : created
    const maximum = IsNumber(schema.maxItems) && minimum.length > schema.maxItems ? minimum.slice(0, schema.maxItems) : minimum
    const casted = maximum.map((value: unknown) => Visit(schema.items, value))
    if (schema.uniqueItems !== true) return casted
    const unique = [...new Set(casted)]
    if (!ValueCheck.Check(schema, unique)) throw new ValueCastArrayUniqueItemsTypeError(schema, unique)
    return unique
  }
  function BigInt(schema: Types.TBigInt, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema)
  }
  function Boolean(schema: Types.TBoolean, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema)
  }
  function Constructor(schema: Types.TConstructor, value: any): any {
    if (ValueCheck.Check(schema, value)) return ValueCreate.Create(schema)
    const required = new Set(schema.returns.required || [])
    const result = function () {}
    for (const [key, property] of globalThis.Object.entries(schema.returns.properties)) {
      if (!required.has(key) && value.prototype[key] === undefined) continue
      result.prototype[key] = Visit(property as Types.TSchema, value.prototype[key])
    }
    return result
  }
  function Date(schema: Types.TDate, value: any): any {
    return ValueCheck.Check(schema, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema)
  }
  function Function(schema: Types.TFunction, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema)
  }
  function Integer(schema: Types.TInteger, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema)
  }
  function Intersect(schema: Types.TIntersect, value: any): any {
    const created = ValueCreate.Create(schema)
    const mapped = IsObject(created) && IsObject(value) ? { ...(created as any), ...value } : value
    return ValueCheck.Check(schema, mapped) ? mapped : ValueCreate.Create(schema)
  }
  function Literal(schema: Types.TLiteral, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema)
  }
  function Never(schema: Types.TNever, value: any): any {
    throw new ValueCastNeverTypeError(schema)
  }
  function Not(schema: Types.TNot, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema.allOf[1])
  }
  function Null(schema: Types.TNull, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema)
  }
  function Number(schema: Types.TNumber, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema)
  }
  function Object(schema: Types.TObject, value: any): any {
    if (ValueCheck.Check(schema, value)) return value
    if (value === null || typeof value !== 'object') return ValueCreate.Create(schema)
    const required = new Set(schema.required || [])
    const result = {} as Record<string, any>
    for (const [key, property] of globalThis.Object.entries(schema.properties)) {
      if (!required.has(key) && value[key] === undefined) continue
      result[key] = Visit(property, value[key])
    }
    // additional schema properties
    if (typeof schema.additionalProperties === 'object') {
      const propertyNames = globalThis.Object.getOwnPropertyNames(schema.properties)
      for (const propertyName of globalThis.Object.getOwnPropertyNames(value)) {
        if (propertyNames.includes(propertyName)) continue
        result[propertyName] = Visit(schema.additionalProperties, value[propertyName])
      }
    }
    return result
  }
  function Promise(schema: Types.TSchema, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema)
  }
  function Record(schema: Types.TRecord<any, any>, value: any): any {
    if (ValueCheck.Check(schema, value)) return ValueClone.Clone(value)
    if (value === null || typeof value !== 'object' || globalThis.Array.isArray(value) || value instanceof globalThis.Date) return ValueCreate.Create(schema)
    const subschemaPropertyName = globalThis.Object.getOwnPropertyNames(schema.patternProperties)[0]
    const subschema = schema.patternProperties[subschemaPropertyName]
    const result = {} as Record<string, any>
    for (const [propKey, propValue] of globalThis.Object.entries(value)) {
      result[propKey] = Visit(subschema, propValue)
    }
    return result
  }
  function Ref(schema: Types.TRef<any>, value: any): any {
    return Visit(Types.ReferenceRegistry.DerefOne(schema), value)
  }
  function Self(schema: Types.TSelf, value: any): any {
    return Visit(Types.ReferenceRegistry.DerefOne(schema), value)
  }
  function String(schema: Types.TString, value: any): any {
    return ValueCheck.Check(schema, value) ? value : ValueCreate.Create(schema)
  }
  function Symbol(schema: Types.TSymbol, value: any): any {
    return ValueCheck.Check(schema, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema)
  }
  function Tuple(schema: Types.TTuple<any[]>, value: any): any {
    if (ValueCheck.Check(schema, value)) return ValueClone.Clone(value)
    if (!globalThis.Array.isArray(value)) return ValueCreate.Create(schema)
    if (schema.items === undefined) return []
    return schema.items.map((schema, index) => Visit(schema, value[index]))
  }
  function Undefined(schema: Types.TUndefined, value: any): any {
    return ValueCheck.Check(schema, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema)
  }
  function Union(schema: Types.TUnion, value: any): any {
    return ValueCheck.Check(schema, value) ? ValueClone.Clone(value) : UnionCastCreate.Create(schema, value)
  }
  function Uint8Array(schema: Types.TUint8Array, value: any): any {
    return ValueCheck.Check(schema, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema)
  }
  function Unknown(schema: Types.TUnknown, value: any): any {
    return ValueCheck.Check(schema, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema)
  }
  function Void(schema: Types.TVoid, value: any): any {
    return ValueCheck.Check(schema, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema)
  }
  function UserDefined(schema: Types.TSchema, value: any): any {
    return ValueCheck.Check(schema, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema)
  }
  export function Visit(schema: Types.TSchema, value: any): any {
    const anySchema = schema as any
    switch (schema[Types.Kind]) {
      case 'Any':
        return Any(anySchema, value)
      case 'Array':
        return Array(anySchema, value)
      case 'BigInt':
        return BigInt(anySchema, value)
      case 'Boolean':
        return Boolean(anySchema, value)
      case 'Constructor':
        return Constructor(anySchema, value)
      case 'Date':
        return Date(anySchema, value)
      case 'Function':
        return Function(anySchema, value)
      case 'Integer':
        return Integer(anySchema, value)
      case 'Intersect':
        return Intersect(anySchema, value)
      case 'Literal':
        return Literal(anySchema, value)
      case 'Never':
        return Never(anySchema, value)
      case 'Not':
        return Not(anySchema, value)
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
      case 'Ref':
        return Ref(anySchema, value)
      case 'Self':
        return Self(anySchema, value)
      case 'String':
        return String(anySchema, value)
      case 'Symbol':
        return Symbol(anySchema, value)
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
        if (!Types.TypeRegistry.Has(anySchema[Types.Kind])) throw new ValueCastUnknownTypeError(anySchema)
        return UserDefined(anySchema, value)
    }
  }
  export function Cast<T extends Types.TSchema>(schema: T, value: any): Types.Static<T> {
    return Visit(schema, ValueClone.Clone(value))
  }
}
