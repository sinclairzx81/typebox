/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { KeyOfPropertyKeys } from '../../type/keyof/index'
import { Check } from '../check/index'
import { Clone } from '../clone/index'
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
// prettier-ignore
import { 
  IsString, 
  IsObject, 
  IsArray, 
  IsUndefined 
} from '../guard/index'
// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
// prettier-ignore
import { 
  IsSchema
} from '../../type/guard/type'
// ------------------------------------------------------------------
// IsCheckable
// ------------------------------------------------------------------
function IsCheckable(schema: unknown): boolean {
  return IsSchema(schema) && schema[Kind] !== 'Unsafe'
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
function FromArray(schema: TArray, references: TSchema[], value: unknown): any {
  if (!IsArray(value)) return value
  return value.map((value) => Visit(schema.items, references, value))
}
function FromIntersect(schema: TIntersect, references: TSchema[], value: unknown): any {
  const unevaluatedProperties = schema.unevaluatedProperties as TSchema
  const intersections = schema.allOf.map((schema) => Visit(schema, references, Clone(value)))
  const composite = intersections.reduce((acc: any, value: any) => (IsObject(value) ? { ...acc, ...value } : value), {})
  if (!IsObject(value) || !IsObject(composite) || !IsSchema(unevaluatedProperties)) return composite
  const knownkeys = KeyOfPropertyKeys(schema) as string[]
  for (const key of Object.getOwnPropertyNames(value)) {
    if (knownkeys.includes(key)) continue
    if (Check(unevaluatedProperties, references, value[key])) {
      composite[key] = Visit(unevaluatedProperties, references, value[key])
    }
  }
  return composite
}
function FromObject(schema: TObject, references: TSchema[], value: unknown): any {
  if (!IsObject(value) || IsArray(value)) return value // Check IsArray for AllowArrayObject configuration
  const additionalProperties = schema.additionalProperties as TSchema
  for (const key of Object.getOwnPropertyNames(value)) {
    if (key in schema.properties) {
      value[key] = Visit(schema.properties[key], references, value[key])
      continue
    }
    if (IsSchema(additionalProperties) && Check(additionalProperties, references, value[key])) {
      value[key] = Visit(additionalProperties, references, value[key])
      continue
    }
    delete value[key]
  }
  return value
}
function FromRecord(schema: TRecord, references: TSchema[], value: unknown): any {
  if (!IsObject(value)) return value
  const additionalProperties = schema.additionalProperties as TSchema
  const propertyKeys = Object.getOwnPropertyNames(value)
  const [propertyKey, propertySchema] = Object.entries(schema.patternProperties)[0]
  const propertyKeyTest = new RegExp(propertyKey)
  for (const key of propertyKeys) {
    if (propertyKeyTest.test(key)) {
      value[key] = Visit(propertySchema, references, value[key])
      continue
    }
    if (IsSchema(additionalProperties) && Check(additionalProperties, references, value[key])) {
      value[key] = Visit(additionalProperties, references, value[key])
      continue
    }
    delete value[key]
  }
  return value
}
function FromRef(schema: TRef, references: TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, value)
}
function FromThis(schema: TThis, references: TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, value)
}
function FromTuple(schema: TTuple, references: TSchema[], value: unknown): any {
  if (!IsArray(value)) return value
  if (IsUndefined(schema.items)) return []
  const length = Math.min(value.length, schema.items.length)
  for (let i = 0; i < length; i++) {
    value[i] = Visit(schema.items[i], references, value[i])
  }
  // prettier-ignore
  return value.length > length 
    ? value.slice(0, length) 
    : value
}
function FromUnion(schema: TUnion, references: TSchema[], value: unknown): any {
  for (const inner of schema.anyOf) {
    if (IsCheckable(inner) && Check(inner, references, value)) {
      return Visit(inner, references, value)
    }
  }
  return value
}
function Visit(schema: TSchema, references: TSchema[], value: unknown): unknown {
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
      return value
  }
}
// ------------------------------------------------------------------
// Clean
// ------------------------------------------------------------------
/** `[Mutable]` Removes excess properties from a value and returns the result. This function does not check the value and returns an unknown type. You should Check the result before use. Clean is a mutable operation. To avoid mutation, Clone the value first. */
export function Clean(schema: TSchema, references: TSchema[], value: unknown): unknown
/** `[Mutable]` Removes excess properties from a value and returns the result. This function does not check the value and returns an unknown type. You should Check the result before use. Clean is a mutable operation. To avoid mutation, Clone the value first. */
export function Clean(schema: TSchema, value: unknown): unknown
/** `[Mutable]` Removes excess properties from a value and returns the result. This function does not check the value and returns an unknown type. You should Check the result before use. Clean is a mutable operation. To avoid mutation, Clone the value first. */
export function Clean(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], args[2]) : Visit(args[0], [], args[1])
}
