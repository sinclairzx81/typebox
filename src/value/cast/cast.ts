/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { IsObject, IsArray, IsString, IsNumber, IsNull } from '../guard/index'
import { TypeBoxError } from '../../type/error/index'
import { Kind } from '../../type/symbols/index'
import { Create } from '../create/index'
import { Check } from '../check/index'
import { Clone } from '../clone/index'
import { Deref, Pushref } from '../deref/index'

import type { TSchema } from '../../type/schema/index'
import type { Static } from '../../type/static/index'
import type { TArray } from '../../type/array/index'
import type { TConstructor } from '../../type/constructor/index'
import type { TImport } from '../../type/module/index'
import type { TIntersect } from '../../type/intersect/index'
import type { TObject } from '../../type/object/index'
import type { TRecord } from '../../type/record/index'
import type { TRef } from '../../type/ref/index'
import type { TThis } from '../../type/recursive/index'
import type { TTuple } from '../../type/tuple/index'
import type { TUnion } from '../../type/union/index'
import type { TNever } from '../../type/never/index'

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
export class ValueCastError extends TypeBoxError {
  constructor(public readonly schema: TSchema, message: string) {
    super(message)
  }
}
// ------------------------------------------------------------------
// The following logic assigns a score to a schema based on how well
// it matches a given value. For object types, the score is calculated
// by evaluating each property of the value against the schema's
// properties. To avoid bias towards objects with many properties,
// each property contributes equally to the total score. Properties
// that exactly match literal values receive the highest possible
// score, as literals are often used as discriminators in union types.
// ------------------------------------------------------------------
function ScoreUnion(schema: TSchema, references: TSchema[], value: any): number {
  if (schema[Kind] === 'Object' && typeof value === 'object' && !IsNull(value)) {
    const object = schema as TObject
    const keys = Object.getOwnPropertyNames(value)
    const entries = Object.entries(object.properties)
    return entries.reduce((acc, [key, schema]) => {
      const literal = schema[Kind] === 'Literal' && schema.const === value[key] ? 100 : 0
      const checks = Check(schema, references, value[key]) ? 10 : 0
      const exists = keys.includes(key) ? 1 : 0
      return acc + (literal + checks + exists)
    }, 0)
  } else if (schema[Kind] === 'Union') {
    const schemas = schema.anyOf.map((schema: TSchema) => Deref(schema, references))
    const scores = schemas.map((schema: TSchema) => ScoreUnion(schema, references, value))
    return Math.max(...scores)
  } else {
    return Check(schema, references, value) ? 1 : 0
  }
}
function SelectUnion(union: TUnion, references: TSchema[], value: any): TSchema {
  const schemas = union.anyOf.map((schema) => Deref(schema, references))
  let [select, best] = [schemas[0], 0]
  for (const schema of schemas) {
    const score = ScoreUnion(schema, references, value)
    if (score > best) {
      select = schema
      best = score
    }
  }
  return select
}
function CastUnion(union: TUnion, references: TSchema[], value: any, cache: WeakMap<object, unknown>) {
  if ('default' in union) {
    return typeof value === 'function' ? union.default : Clone(union.default)
  } else {
    const schema = SelectUnion(union, references, value)
    return Cast(schema, references, value, cache)
  }
}

// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
function DefaultClone(schema: TSchema, references: TSchema[], value: any): any {
  return Check(schema, references, value) ? Clone(value) : Create(schema, references)
}
function Default(schema: TSchema, references: TSchema[], value: any): any {
  return Check(schema, references, value) ? value : Create(schema, references)
}
// ------------------------------------------------------------------
// Cast
// ------------------------------------------------------------------
function FromArray(schema: TArray, references: TSchema[], value: any, cache: WeakMap<object, unknown>): any {
  if (Check(schema, references, value)) return Clone(value)
  const created = IsArray(value) ? value : Create(schema, references)
  const minimum = IsNumber(schema.minItems) && created.length < schema.minItems ? [...created, ...Array.from({ length: schema.minItems - created.length }, () => null)] : created
  const maximum = IsNumber(schema.maxItems) && minimum.length > schema.maxItems ? minimum.slice(0, schema.maxItems) : minimum
  const casted = maximum.map((value: unknown) => Visit(schema.items, references, value, cache))
  if (schema.uniqueItems !== true) return casted
  const unique = [...new Set(casted)]
  if (!Check(schema, references, unique)) throw new ValueCastError(schema, 'Array cast produced invalid data due to uniqueItems constraint')
  return unique
}
function FromConstructor(schema: TConstructor, references: TSchema[], value: any, cache: WeakMap<object, unknown>): any {
  if (Check(schema, references, value)) return Create(schema, references)
  const required = new Set(schema.returns.required || [])
  const result = function () {}
  for (const [key, property] of Object.entries(schema.returns.properties)) {
    if (!required.has(key) && value.prototype[key] === undefined) continue
    result.prototype[key] = Visit(property as TSchema, references, value.prototype[key], cache)
  }
  return result
}
function FromImport(schema: TImport, references: TSchema[], value: unknown, cache: WeakMap<object, unknown>): boolean {
  const definitions = globalThis.Object.values(schema.$defs) as TSchema[]
  const target = schema.$defs[schema.$ref] as TSchema
  return Visit(target, [...references, ...definitions], value, cache)
}

// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
function IntersectAssign(correct: unknown, value: unknown): unknown {
  // trust correct on mismatch | value on non-object
  if ((IsObject(correct) && !IsObject(value)) || (!IsObject(correct) && IsObject(value))) return correct
  if (!IsObject(correct) || !IsObject(value)) return value
  return globalThis.Object.getOwnPropertyNames(correct).reduce((result, key) => {
    const property = key in value ? IntersectAssign(correct[key], value[key]) : correct[key]
    return { ...result, [key]: property }
  }, {})
}
function FromIntersect(schema: TIntersect, references: TSchema[], value: any): any {
  if (Check(schema, references, value)) return value
  const correct = Create(schema, references)
  const assigned = IntersectAssign(correct, value)
  return Check(schema, references, assigned) ? assigned : correct
}
function FromNever(schema: TNever, references: TSchema[], value: any): any {
  throw new ValueCastError(schema, 'Never types cannot be cast')
}
function FromObject(schema: TObject, references: TSchema[], value: any, cache: WeakMap<object, unknown>): any {
  if (cache.has(value)) return cache.get(value)
  if (Check(schema, references, value)) return value
  if (value === null || typeof value !== 'object') return Create(schema, references)
  const required = new Set(schema.required || [])
  const result = {} as Record<string, any>
  cache.set(value, result)
  for (const [key, property] of Object.entries(schema.properties)) {
    if (!required.has(key) && value[key] === undefined) continue
    result[key] = Visit(property, references, value[key], cache)
  }
  // additional schema properties
  if (typeof schema.additionalProperties === 'object') {
    const propertyNames = Object.getOwnPropertyNames(schema.properties)
    for (const propertyName of Object.getOwnPropertyNames(value)) {
      if (propertyNames.includes(propertyName)) continue
      result[propertyName] = Visit(schema.additionalProperties, references, value[propertyName], cache)
    }
  }
  return result
}
function FromRecord(schema: TRecord, references: TSchema[], value: any, cache: WeakMap<object, unknown>): any {
  if (Check(schema, references, value)) return Clone(value)
  if (value === null || typeof value !== 'object' || Array.isArray(value) || value instanceof Date) return Create(schema, references)
  const subschemaPropertyName = Object.getOwnPropertyNames(schema.patternProperties)[0]
  const subschema = schema.patternProperties[subschemaPropertyName]
  const result = {} as Record<string, any>
  for (const [propKey, propValue] of Object.entries(value)) {
    result[propKey] = Visit(subschema, references, propValue, cache)
  }
  return result
}
function FromRef(schema: TRef, references: TSchema[], value: any, cache: WeakMap<object, unknown>): any {
  return Visit(Deref(schema, references), references, value, cache)
}
function FromThis(schema: TThis, references: TSchema[], value: any, cache: WeakMap<object, unknown>): any {
  return Visit(Deref(schema, references), references, value, cache)
}
function FromTuple(schema: TTuple, references: TSchema[], value: any, cache: WeakMap<object, unknown>): any {
  if (Check(schema, references, value)) return Clone(value)
  if (!IsArray(value)) return Create(schema, references)
  if (schema.items === undefined) return []
  return schema.items.map((schema, index) => Visit(schema, references, value[index], cache))
}
function FromUnion(schema: TUnion, references: TSchema[], value: any, cache: WeakMap<object, unknown>): any {
  return Check(schema, references, value) ? Clone(value) : CastUnion(schema, references, value, cache)
}
function Visit(schema: TSchema, references: TSchema[], value: any, cache: WeakMap<object, unknown>): any {
  const references_ = IsString(schema.$id) ? Pushref(schema, references) : references
  const schema_ = schema as any
  switch (schema[Kind]) {
    // --------------------------------------------------------------
    // Structural
    // --------------------------------------------------------------
    case 'Array':
      return FromArray(schema_, references_, value, cache)
    case 'Constructor':
      return FromConstructor(schema_, references_, value, cache)
    case 'Import':
      return FromImport(schema_, references_, value, cache)
    case 'Intersect':
      return FromIntersect(schema_, references_, value)
    case 'Never':
      return FromNever(schema_, references_, value)
    case 'Object':
      return FromObject(schema_, references_, value, cache)
    case 'Record':
      return FromRecord(schema_, references_, value, cache)
    case 'Ref':
      return FromRef(schema_, references_, value, cache)
    case 'This':
      return FromThis(schema_, references_, value, cache)
    case 'Tuple':
      return FromTuple(schema_, references_, value, cache)
    case 'Union':
      return FromUnion(schema_, references_, value, cache)
    // --------------------------------------------------------------
    // DefaultClone
    // --------------------------------------------------------------
    case 'Date':
    case 'Symbol':
    case 'Uint8Array':
      return DefaultClone(schema, references, value)
    // --------------------------------------------------------------
    // Default
    // --------------------------------------------------------------
    default:
      return Default(schema_, references_, value)
  }
}
// ------------------------------------------------------------------
// Cast
// ------------------------------------------------------------------
/** Casts a value into a given type and references. The return value will retain as much information of the original value as possible. */
export function Cast<T extends TSchema>(schema: T, references: TSchema[], value: unknown, cache?: WeakMap<object, unknown>): Static<T>
/** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
export function Cast<T extends TSchema>(schema: T, value: unknown, cache?: WeakMap<object, unknown>): Static<T>
/** Casts a value into a given type. The return value will retain as much information of the original value as possible. */
export function Cast(...args: any[]) {
  if (args.length === 2 || (args.length === 3 && args[2] instanceof WeakMap)) {
    return Visit(args[0], [], args[1], args[2] ?? new WeakMap())
  }
  return Visit(args[0], args[1], args[2], args[3] ?? new WeakMap())
}
