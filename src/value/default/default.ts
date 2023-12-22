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

import { Check } from '../check/index'
import { Deref } from '../deref/index'
import { Kind } from '../../type/symbols/index'

import type { TSchema } from '../../type/schema/index'
import type { TArray } from '../../type/array/index'
import type { TIntersect } from '../../type/intersect/index'
import type { TObject } from '../../type/object/index'
import type { TRecord } from '../../type/record/index'
import type { TRef } from '../../type/ref/index'
import type { TThis } from '../../type/recursive/index'
import type { TTuple } from '../../type/tuple/index'
import type { TUnion } from '../../type/union/index'

// ------------------------------------------------------------------
// ValueGuard
// ------------------------------------------------------------------
import { IsString, IsObject, IsArray, IsUndefined } from '../guard/index'
// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsSchema } from '../../type/guard/type'
// ------------------------------------------------------------------
// ValueOrDefault
// ------------------------------------------------------------------
function ValueOrDefault(schema: TSchema, value: unknown) {
  return !(value === undefined) || !('default' in schema) ? value : schema.default
}
// ------------------------------------------------------------------
// IsCheckable
// ------------------------------------------------------------------
function IsCheckable(schema: unknown): boolean {
  return IsSchema(schema) && schema[Kind] !== 'Unsafe'
}
// ------------------------------------------------------------------
// IsDefaultSchema
// ------------------------------------------------------------------
function IsDefaultSchema(value: unknown): value is TSchema {
  return IsSchema(value) && 'default' in value
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
function FromArray(schema: TArray, references: TSchema[], value: unknown): any {
  const defaulted = ValueOrDefault(schema, value)
  if (!IsArray(defaulted)) return defaulted
  for (let i = 0; i < defaulted.length; i++) {
    defaulted[i] = Visit(schema.items, references, defaulted[i])
  }
  return defaulted
}
function FromIntersect(schema: TIntersect, references: TSchema[], value: unknown): any {
  const defaulted = ValueOrDefault(schema, value)
  return schema.allOf.reduce((acc, schema) => {
    const next = Visit(schema, references, defaulted)
    return IsObject(next) ? { ...acc, ...next } : next
  }, {})
}
function FromObject(schema: TObject, references: TSchema[], value: unknown): any {
  const defaulted = ValueOrDefault(schema, value)
  if (!IsObject(defaulted)) return defaulted
  const additionalPropertiesSchema = schema.additionalProperties as TSchema
  const knownPropertyKeys = Object.getOwnPropertyNames(schema.properties)
  // properties
  for (const key of knownPropertyKeys) {
    if (!IsDefaultSchema(schema.properties[key])) continue
    defaulted[key] = Visit(schema.properties[key], references, defaulted[key])
  }
  // return if not additional properties
  if (!IsDefaultSchema(additionalPropertiesSchema)) return defaulted
  // additional properties
  for (const key of Object.getOwnPropertyNames(defaulted)) {
    if (knownPropertyKeys.includes(key)) continue
    defaulted[key] = Visit(additionalPropertiesSchema, references, defaulted[key])
  }
  return defaulted
}
function FromRecord(schema: TRecord, references: TSchema[], value: unknown): any {
  const defaulted = ValueOrDefault(schema, value)
  if (!IsObject(defaulted)) return defaulted
  const additionalPropertiesSchema = schema.additionalProperties as TSchema
  const [propertyKeyPattern, propertySchema] = Object.entries(schema.patternProperties)[0]
  const knownPropertyKey = new RegExp(propertyKeyPattern)
  // properties
  for (const key of Object.getOwnPropertyNames(defaulted)) {
    if (!(knownPropertyKey.test(key) && IsDefaultSchema(propertySchema))) continue
    defaulted[key] = Visit(propertySchema, references, defaulted[key])
  }
  // return if not additional properties
  if (!IsDefaultSchema(additionalPropertiesSchema)) return defaulted
  // additional properties
  for (const key of Object.getOwnPropertyNames(defaulted)) {
    if (knownPropertyKey.test(key)) continue
    defaulted[key] = Visit(additionalPropertiesSchema, references, defaulted[key])
  }
  return defaulted
}
function FromRef(schema: TRef, references: TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, ValueOrDefault(schema, value))
}
function FromThis(schema: TThis, references: TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, value)
}
function FromTuple(schema: TTuple, references: TSchema[], value: unknown): any {
  const defaulted = ValueOrDefault(schema, value)
  if (!IsArray(defaulted) || IsUndefined(schema.items)) return defaulted
  const [items, max] = [schema.items!, Math.max(schema.items!.length, defaulted.length)]
  for (let i = 0; i < max; i++) {
    if (i < items.length) defaulted[i] = Visit(items[i], references, defaulted[i])
  }
  return defaulted
}
function FromUnion(schema: TUnion, references: TSchema[], value: unknown): any {
  const defaulted = ValueOrDefault(schema, value)
  for (const inner of schema.anyOf) {
    const result = Visit(inner, references, defaulted)
    if (IsCheckable(inner) && Check(inner, result)) {
      return result
    }
  }
  return defaulted
}
function Visit(schema: TSchema, references: TSchema[], value: unknown): any {
  const references_ = IsString(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema_[Kind]) {
    case 'Array':
      return FromArray(schema_, references_, value)
    case 'Intersect':
      return FromIntersect(schema_, references_, value)
    case 'Object':
      return FromObject(schema_, references_, value)
    case 'Record':
      return FromRecord(schema_, references_, value)
    case 'Ref':
      return FromRef(schema_, references_, value)
    case 'This':
      return FromThis(schema_, references_, value)
    case 'Tuple':
      return FromTuple(schema_, references_, value)
    case 'Union':
      return FromUnion(schema_, references_, value)
    default:
      return ValueOrDefault(schema_, value)
  }
}
// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
/** `[Mutable]` Generates missing properties on a value using default schema annotations if available. This function does not check the value and returns an unknown type. You should Check the result before use. Default is a mutable operation. To avoid mutation, Clone the value first. */
export function Default<T extends TSchema>(schema: T, references: TSchema[], value: unknown): unknown
/** `[Mutable]` Generates missing properties on a value using default schema annotations if available. This function does not check the value and returns an unknown type. You should Check the result before use. Default is a mutable operation. To avoid mutation, Clone the value first. */
export function Default<T extends TSchema>(schema: T, value: unknown): unknown
/** `[Mutable]` Generates missing properties on a value using default schema annotations if available. This function does not check the value and returns an unknown type. You should Check the result before use. Default is a mutable operation. To avoid mutation, Clone the value first. */
export function Default(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], args[2]) : Visit(args[0], [], args[1])
}
