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
  constructor(public readonly schema: Types.TRef | Types.TThis) {
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
export class ValueCastDereferenceError extends Error {
  constructor(public readonly schema: Types.TRef | Types.TThis) {
    super(`ValueCast: Unable to dereference schema with $id '${schema.$ref}'`)
  }
}
// ----------------------------------------------------------------------------------------------
// The following will score a schema against a value. For objects, the score is the tally of
// points awarded for each property of the value. Property points are (1.0 / propertyCount)
// to prevent large property counts biasing results. Properties that match literal values are
// maximally awarded as literals are typically used as union discriminator fields.
// ----------------------------------------------------------------------------------------------
namespace UnionCastCreate {
  function Score(schema: Types.TSchema, references: Types.TSchema[], value: any): number {
    if (schema[Types.Kind] === 'Object' && typeof value === 'object' && value !== null) {
      const object = schema as Types.TObject
      const keys = Object.keys(value)
      const entries = globalThis.Object.entries(object.properties)
      const [point, max] = [1 / entries.length, entries.length]
      return entries.reduce((acc, [key, schema]) => {
        const literal = schema[Types.Kind] === 'Literal' && schema.const === value[key] ? max : 0
        const checks = ValueCheck.Check(schema, references, value[key]) ? point : 0
        const exists = keys.includes(key) ? point : 0
        return acc + (literal + checks + exists)
      }, 0)
    } else {
      return ValueCheck.Check(schema, references, value) ? 1 : 0
    }
  }
  function Select(union: Types.TUnion, references: Types.TSchema[], value: any): Types.TSchema {
    let [select, best] = [union.anyOf[0], 0]
    for (const schema of union.anyOf) {
      const score = Score(schema, references, value)
      if (score > best) {
        select = schema
        best = score
      }
    }
    return select
  }
  export function Create(union: Types.TUnion, references: Types.TSchema[], value: any) {
    if (union.default !== undefined) {
      return union.default
    } else {
      const schema = Select(union, references, value)
      return ValueCast.Cast(schema, references, value)
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
  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }
  // ----------------------------------------------------------------------------------------------
  // Cast
  // ----------------------------------------------------------------------------------------------
  function Any(schema: Types.TAny, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  }
  function Array(schema: Types.TArray, references: Types.TSchema[], value: any): any {
    if (ValueCheck.Check(schema, references, value)) return ValueClone.Clone(value)
    const created = IsArray(value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
    const minimum = IsNumber(schema.minItems) && created.length < schema.minItems ? [...created, ...globalThis.Array.from({ length: schema.minItems - created.length }, () => null)] : created
    const maximum = IsNumber(schema.maxItems) && minimum.length > schema.maxItems ? minimum.slice(0, schema.maxItems) : minimum
    const casted = maximum.map((value: unknown) => Visit(schema.items, references, value))
    if (schema.uniqueItems !== true) return casted
    const unique = [...new Set(casted)]
    if (!ValueCheck.Check(schema, references, unique)) throw new ValueCastArrayUniqueItemsTypeError(schema, unique)
    return unique
  }
  function BigInt(schema: Types.TBigInt, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
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
  function Date(schema: Types.TDate, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  }
  function Function(schema: Types.TFunction, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }
  function Integer(schema: Types.TInteger, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }
  function Intersect(schema: Types.TIntersect, references: Types.TSchema[], value: any): any {
    const created = ValueCreate.Create(schema, references)
    const mapped = IsObject(created) && IsObject(value) ? { ...(created as any), ...value } : value
    return ValueCheck.Check(schema, references, mapped) ? mapped : ValueCreate.Create(schema, references)
  }
  function Literal(schema: Types.TLiteral, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }
  function Never(schema: Types.TNever, references: Types.TSchema[], value: any): any {
    throw new ValueCastNeverTypeError(schema)
  }
  function Not(schema: Types.TNot, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema.allOf[1], references)
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
    // additional schema properties
    if (typeof schema.additionalProperties === 'object') {
      const propertyNames = globalThis.Object.getOwnPropertyNames(schema.properties)
      for (const propertyName of globalThis.Object.getOwnPropertyNames(value)) {
        if (propertyNames.includes(propertyName)) continue
        result[propertyName] = Visit(schema.additionalProperties, references, value[propertyName])
      }
    }
    return result
  }
  function Promise(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }
  function Record(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any): any {
    if (ValueCheck.Check(schema, references, value)) return ValueClone.Clone(value)
    if (value === null || typeof value !== 'object' || globalThis.Array.isArray(value) || value instanceof globalThis.Date) return ValueCreate.Create(schema, references)
    const subschemaPropertyName = globalThis.Object.getOwnPropertyNames(schema.patternProperties)[0]
    const subschema = schema.patternProperties[subschemaPropertyName]
    const result = {} as Record<string, any>
    for (const [propKey, propValue] of globalThis.Object.entries(value)) {
      result[propKey] = Visit(subschema, references, propValue)
    }
    return result
  }
  function Ref(schema: Types.TRef<any>, references: Types.TSchema[], value: any): any {
    const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
    if (index === -1) throw new ValueCastDereferenceError(schema)
    const target = references[index]
    return Visit(target, references, value)
  }
  function String(schema: Types.TString, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
  }
  function Symbol(schema: Types.TSymbol, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  }
  function TemplateLiteral(schema: Types.TSymbol, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  }
  function This(schema: Types.TThis, references: Types.TSchema[], value: any): any {
    const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
    if (index === -1) throw new ValueCastDereferenceError(schema)
    const target = references[index]
    return Visit(target, references, value)
  }
  function Tuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: any): any {
    if (ValueCheck.Check(schema, references, value)) return ValueClone.Clone(value)
    if (!globalThis.Array.isArray(value)) return ValueCreate.Create(schema, references)
    if (schema.items === undefined) return []
    return schema.items.map((schema, index) => Visit(schema, references, value[index]))
  }
  function Undefined(schema: Types.TUndefined, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  }
  function Union(schema: Types.TUnion, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : UnionCastCreate.Create(schema, references, value)
  }
  function Uint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  }
  function Unknown(schema: Types.TUnknown, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  }
  function Void(schema: Types.TVoid, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  }
  function UserDefined(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
    return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  }
  export function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
    const references_ = IsString(schema.$id) ? [...references, schema] : references
    const schema_ = schema as any
    switch (schema[Types.Kind]) {
      case 'Any':
        return Any(schema_, references_, value)
      case 'Array':
        return Array(schema_, references_, value)
      case 'BigInt':
        return BigInt(schema_, references_, value)
      case 'Boolean':
        return Boolean(schema_, references_, value)
      case 'Constructor':
        return Constructor(schema_, references_, value)
      case 'Date':
        return Date(schema_, references_, value)
      case 'Function':
        return Function(schema_, references_, value)
      case 'Integer':
        return Integer(schema_, references_, value)
      case 'Intersect':
        return Intersect(schema_, references_, value)
      case 'Literal':
        return Literal(schema_, references_, value)
      case 'Never':
        return Never(schema_, references_, value)
      case 'Not':
        return Not(schema_, references_, value)
      case 'Null':
        return Null(schema_, references_, value)
      case 'Number':
        return Number(schema_, references_, value)
      case 'Object':
        return Object(schema_, references_, value)
      case 'Promise':
        return Promise(schema_, references_, value)
      case 'Record':
        return Record(schema_, references_, value)
      case 'Ref':
        return Ref(schema_, references_, value)
      case 'String':
        return String(schema_, references_, value)
      case 'Symbol':
        return Symbol(schema_, references_, value)
      case 'TemplateLiteral':
        return TemplateLiteral(schema_, references_, value)
      case 'This':
        return This(schema_, references_, value)
      case 'Tuple':
        return Tuple(schema_, references_, value)
      case 'Undefined':
        return Undefined(schema_, references_, value)
      case 'Union':
        return Union(schema_, references_, value)
      case 'Uint8Array':
        return Uint8Array(schema_, references_, value)
      case 'Unknown':
        return Unknown(schema_, references_, value)
      case 'Void':
        return Void(schema_, references_, value)
      default:
        if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueCastUnknownTypeError(schema_)
        return UserDefined(schema_, references_, value)
    }
  }
  export function Cast<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: any): Types.Static<T> {
    return Visit(schema, references, ValueClone.Clone(value))
  }
}
