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
import * as ValueCreate from './create'
import * as ValueCheck from './check'
import * as ValueClone from './clone'
import * as ValueGuard from './guard'

// --------------------------------------------------------------------------
// Errors
// --------------------------------------------------------------------------
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
    super(`ValueCast: Unable to dereference type with $id '${schema.$ref}'`)
  }
}
// --------------------------------------------------------------------------
// The following will score a schema against a value. For objects, the score
// is the tally of points awarded for each property of the value. Property
// points are (1.0 / propertyCount) to prevent large property counts biasing
// results. Properties that match literal values are maximally awarded as
// literals are typically used as union discriminator fields.
// --------------------------------------------------------------------------
namespace UnionCastCreate {
  function Score(schema: Types.TSchema, references: Types.TSchema[], value: any): number {
    if (schema[Types.Kind] === 'Object' && typeof value === 'object' && !ValueGuard.IsNull(value)) {
      const object = schema as Types.TObject
      const keys = Object.getOwnPropertyNames(value)
      const entries = Object.entries(object.properties)
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
    if ('default' in union) {
      return union.default
    } else {
      const schema = Select(union, references, value)
      return Cast(schema, references, value)
    }
  }
}
// --------------------------------------------------------------------------
// Cast
// --------------------------------------------------------------------------
function TAny(schema: Types.TAny, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
}
function TArray(schema: Types.TArray, references: Types.TSchema[], value: any): any {
  if (ValueCheck.Check(schema, references, value)) return ValueClone.Clone(value)
  const created = ValueGuard.IsArray(value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
  const minimum = ValueGuard.IsNumber(schema.minItems) && created.length < schema.minItems ? [...created, ...Array.from({ length: schema.minItems - created.length }, () => null)] : created
  const maximum = ValueGuard.IsNumber(schema.maxItems) && minimum.length > schema.maxItems ? minimum.slice(0, schema.maxItems) : minimum
  const casted = maximum.map((value: unknown) => Visit(schema.items, references, value))
  if (schema.uniqueItems !== true) return casted
  const unique = [...new Set(casted)]
  if (!ValueCheck.Check(schema, references, unique)) throw new ValueCastArrayUniqueItemsTypeError(schema, unique)
  return unique
}
function TAsyncIterator(schema: Types.TAsyncIterator, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TBigInt(schema: Types.TBigInt, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TBoolean(schema: Types.TBoolean, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TConstructor(schema: Types.TConstructor, references: Types.TSchema[], value: any): any {
  if (ValueCheck.Check(schema, references, value)) return ValueCreate.Create(schema, references)
  const required = new Set(schema.returns.required || [])
  const result = function () {}
  for (const [key, property] of Object.entries(schema.returns.properties)) {
    if (!required.has(key) && value.prototype[key] === undefined) continue
    result.prototype[key] = Visit(property as Types.TSchema, references, value.prototype[key])
  }
  return result
}
function TDate(schema: Types.TDate, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
}
function TFunction(schema: Types.TFunction, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TInteger(schema: Types.TInteger, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: any): any {
  const created = ValueCreate.Create(schema, references)
  const mapped = ValueGuard.IsPlainObject(created) && ValueGuard.IsPlainObject(value) ? { ...(created as any), ...value } : value
  return ValueCheck.Check(schema, references, mapped) ? mapped : ValueCreate.Create(schema, references)
}
function TIterator(schema: Types.TIterator, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TLiteral(schema: Types.TLiteral, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TNever(schema: Types.TNever, references: Types.TSchema[], value: any): any {
  throw new ValueCastNeverTypeError(schema)
}
function TNot(schema: Types.TNot, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TNull(schema: Types.TNull, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TNumber(schema: Types.TNumber, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TObject(schema: Types.TObject, references: Types.TSchema[], value: any): any {
  if (ValueCheck.Check(schema, references, value)) return value
  if (value === null || typeof value !== 'object') return ValueCreate.Create(schema, references)
  const required = new Set(schema.required || [])
  const result = {} as Record<string, any>
  for (const [key, property] of Object.entries(schema.properties)) {
    if (!required.has(key) && value[key] === undefined) continue
    result[key] = Visit(property, references, value[key])
  }
  // additional schema properties
  if (typeof schema.additionalProperties === 'object') {
    const propertyNames = Object.getOwnPropertyNames(schema.properties)
    for (const propertyName of Object.getOwnPropertyNames(value)) {
      if (propertyNames.includes(propertyName)) continue
      result[propertyName] = Visit(schema.additionalProperties, references, value[propertyName])
    }
  }
  return result
}
function TPromise(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any): any {
  if (ValueCheck.Check(schema, references, value)) return ValueClone.Clone(value)
  if (value === null || typeof value !== 'object' || Array.isArray(value) || value instanceof Date) return ValueCreate.Create(schema, references)
  const subschemaPropertyName = Object.getOwnPropertyNames(schema.patternProperties)[0]
  const subschema = schema.patternProperties[subschemaPropertyName]
  const result = {} as Record<string, any>
  for (const [propKey, propValue] of Object.entries(value)) {
    result[propKey] = Visit(subschema, references, propValue)
  }
  return result
}
function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: any): any {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueCastDereferenceError(schema)
  const target = references[index]
  return Visit(target, references, value)
}
function TString(schema: Types.TString, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? value : ValueCreate.Create(schema, references)
}
function TSymbol(schema: Types.TSymbol, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
}
function TTemplateLiteral(schema: Types.TSymbol, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
}
function TThis(schema: Types.TThis, references: Types.TSchema[], value: any): any {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueCastDereferenceError(schema)
  const target = references[index]
  return Visit(target, references, value)
}
function TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: any): any {
  if (ValueCheck.Check(schema, references, value)) return ValueClone.Clone(value)
  if (!ValueGuard.IsArray(value)) return ValueCreate.Create(schema, references)
  if (schema.items === undefined) return []
  return schema.items.map((schema, index) => Visit(schema, references, value[index]))
}
function TUndefined(schema: Types.TUndefined, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
}
function TUnion(schema: Types.TUnion, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : UnionCastCreate.Create(schema, references, value)
}
function TUint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
}
function TUnknown(schema: Types.TUnknown, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
}
function TVoid(schema: Types.TVoid, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
}
function TKind(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
  return ValueCheck.Check(schema, references, value) ? ValueClone.Clone(value) : ValueCreate.Create(schema, references)
}
function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
  const references_ = ValueGuard.IsString(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema[Types.Kind]) {
    case 'Any':
      return TAny(schema_, references_, value)
    case 'Array':
      return TArray(schema_, references_, value)
    case 'AsyncIterator':
      return TAsyncIterator(schema_, references_, value)
    case 'BigInt':
      return TBigInt(schema_, references_, value)
    case 'Boolean':
      return TBoolean(schema_, references_, value)
    case 'Constructor':
      return TConstructor(schema_, references_, value)
    case 'Date':
      return TDate(schema_, references_, value)
    case 'Function':
      return TFunction(schema_, references_, value)
    case 'Integer':
      return TInteger(schema_, references_, value)
    case 'Intersect':
      return TIntersect(schema_, references_, value)
    case 'Iterator':
      return TIterator(schema_, references_, value)
    case 'Literal':
      return TLiteral(schema_, references_, value)
    case 'Never':
      return TNever(schema_, references_, value)
    case 'Not':
      return TNot(schema_, references_, value)
    case 'Null':
      return TNull(schema_, references_, value)
    case 'Number':
      return TNumber(schema_, references_, value)
    case 'Object':
      return TObject(schema_, references_, value)
    case 'Promise':
      return TPromise(schema_, references_, value)
    case 'Record':
      return TRecord(schema_, references_, value)
    case 'Ref':
      return TRef(schema_, references_, value)
    case 'String':
      return TString(schema_, references_, value)
    case 'Symbol':
      return TSymbol(schema_, references_, value)
    case 'TemplateLiteral':
      return TTemplateLiteral(schema_, references_, value)
    case 'This':
      return TThis(schema_, references_, value)
    case 'Tuple':
      return TTuple(schema_, references_, value)
    case 'Undefined':
      return TUndefined(schema_, references_, value)
    case 'Union':
      return TUnion(schema_, references_, value)
    case 'Uint8Array':
      return TUint8Array(schema_, references_, value)
    case 'Unknown':
      return TUnknown(schema_, references_, value)
    case 'Void':
      return TVoid(schema_, references_, value)
    default:
      if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueCastUnknownTypeError(schema_)
      return TKind(schema_, references_, value)
  }
}
// --------------------------------------------------------------------------
// Cast
// --------------------------------------------------------------------------
/** Casts a value into a given type and references. The return value will retain as much information of the original value as possible. */
export function Cast<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): Types.Static<T>
/** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
export function Cast<T extends Types.TSchema>(schema: T, value: unknown): Types.Static<T>
/** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
export function Cast(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], args[2]) : Visit(args[0], [], args[1])
}
