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

import { TTransform as IsTransformType, TSchema as IsSchemaType } from '../../type/guard/type'
import { Kind, TransformKind } from '../../type/symbols/index'
import { IsPlainObject, IsArray, IsValueType } from '../guard/index'
import { ValueError } from '../../errors/index'
import { KeyOfPropertyKeys } from '../../type/keyof/index'
import { Index } from '../../type/indexed/index'
import { Deref } from '../deref/index'
import { Check } from '../check/index'

import type { TSchema } from '../../type/schema/index'
import type { TArray } from '../../type/array/index'
import type { TIntersect } from '../../type/intersect/index'
import type { TNot } from '../../type/not/index'
import type { TObject } from '../../type/object/index'
import type { TRecord } from '../../type/record/index'
import type { TRef } from '../../type/ref/index'
import type { TThis } from '../../type/recursive/index'
import type { TTuple } from '../../type/tuple/index'
import type { TUnion } from '../../type/union/index'

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
// thrown externally
export class TransformDecodeCheckError extends Error {
  constructor(public readonly schema: TSchema, public readonly value: unknown, public readonly error: ValueError) {
    super(`Unable to decode due to invalid value`)
  }
}
export class TransformDecodeError extends Error {
  constructor(public readonly schema: TSchema, public readonly value: unknown, error: any) {
    super(`${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
// ------------------------------------------------------------------
// Decode
// ------------------------------------------------------------------
// prettier-ignore
function Default(schema: TSchema, value: any) {
  try {
    return IsTransformType(schema) ? schema[TransformKind].Decode(value) : value
  } catch (error) {
    throw new TransformDecodeError(schema, value, error)
  }
}
// prettier-ignore
function TArray(schema: TArray, references: TSchema[], value: any): any {
  return (IsArray(value))
    ? Default(schema, value.map((value: any) => Visit(schema.items, references, value)))
    : Default(schema, value)
}
// prettier-ignore
function TIntersect(schema: TIntersect, references: TSchema[], value: any) {
  if (!IsPlainObject(value) || IsValueType(value)) return Default(schema, value)
  const knownKeys = KeyOfPropertyKeys(schema) as string[]
  const knownProperties = knownKeys.reduce((value, key) => {
    return (key in value)
      ? { ...value, [key]: Visit(Index(schema, [key]), references, value[key]) }
      : value
  }, value)
  if (!IsTransformType(schema.unevaluatedProperties)) {
    return Default(schema, knownProperties)
  }
  const unknownKeys = Object.getOwnPropertyNames(knownProperties)
  const unevaluatedProperties = schema.unevaluatedProperties as TSchema
  const unknownProperties = unknownKeys.reduce((value, key) => {
    return !knownKeys.includes(key)
      ? { ...value, [key]: Default(unevaluatedProperties, value[key]) }
      : value
  }, knownProperties)
  return Default(schema, unknownProperties)
}
function TNot(schema: TNot, references: TSchema[], value: any) {
  return Default(schema, Visit(schema.not, references, value))
}
// prettier-ignore
function TObject(schema: TObject, references: TSchema[], value: any) {
  if (!IsPlainObject(value)) return Default(schema, value)
  const knownKeys = KeyOfPropertyKeys(schema)
  const knownProperties = knownKeys.reduce((value, key) => {
    return (key in value) 
      ? { ...value, [key]: Visit(schema.properties[key], references, value[key]) }  
      : value
  }, value)
  if (!IsSchemaType(schema.additionalProperties)) {
    return Default(schema, knownProperties)
  }
  const unknownKeys = Object.getOwnPropertyNames(knownProperties)
  const additionalProperties = schema.additionalProperties as TSchema
  const unknownProperties = unknownKeys.reduce((value, key) => {
    return !knownKeys.includes(key)
    ? { ...value, [key]: Default(additionalProperties, value[key]) }
    : value
  }, knownProperties)
  return Default(schema, unknownProperties)
}
// prettier-ignore
function TRecord(schema: TRecord<any, any>, references: TSchema[], value: any) {
  if (!IsPlainObject(value)) return Default(schema, value)
  const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
  const knownKeys = new RegExp(pattern)
  const knownProperties = Object.getOwnPropertyNames(value).reduce((value, key) => {
    return knownKeys.test(key) 
      ? { ...value, [key]: Visit(schema.patternProperties[pattern], references, value[key]) }
      : value
  }, value)
  if (!IsSchemaType(schema.additionalProperties)) {
    return Default(schema, knownProperties)
  }
  const unknownKeys = Object.getOwnPropertyNames(knownProperties)
  const additionalProperties = schema.additionalProperties as TSchema
  const unknownProperties = unknownKeys.reduce((value, key) => {
    return !knownKeys.test(key)
    ? { ...value, [key]: Default(additionalProperties, value[key]) }
    : value
  }, knownProperties)
  return Default(schema, unknownProperties)
}
// prettier-ignore
function TRef(schema: TRef<any>, references: TSchema[], value: any) {
  const target = Deref(schema, references)
  return Default(schema, Visit(target, references, value))
}
// prettier-ignore
function TThis(schema: TThis, references: TSchema[], value: any) {
  const target = Deref(schema, references)
  return Default(schema, Visit(target, references, value))
}
// prettier-ignore
function TTuple(schema: TTuple, references: TSchema[], value: any) {
  return (IsArray(value) && IsArray(schema.items))
    ? Default(schema, schema.items.map((schema, index) => Visit(schema, references, value[index])))
    : Default(schema, value)
}
// prettier-ignore
function TUnion(schema: TUnion, references: TSchema[], value: any) {
  for (const subschema of schema.anyOf) {
    if (!Check(subschema, references, value)) continue
    // note: ensure interior is decoded first
    const decoded = Visit(subschema, references, value)
    return Default(schema, decoded)
  }
  return Default(schema, value)
}
// prettier-ignore
function Visit(schema: TSchema, references: TSchema[], value: any): any {
  const references_ = typeof schema.$id === 'string' ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema[Kind]) {
    case 'Array':
      return TArray(schema_, references_, value)
    case 'Intersect':
      return TIntersect(schema_, references_, value)
    case 'Not':
      return TNot(schema_, references_, value)
    case 'Object':
      return TObject(schema_, references_, value)
    case 'Record':
      return TRecord(schema_, references_, value)
    case 'Ref':
      return TRef(schema_, references_, value)
    case 'Symbol':
      return Default(schema_, value)
    case 'This':
      return TThis(schema_, references_, value)
    case 'Tuple':
      return TTuple(schema_, references_, value)
    case 'Union':
      return TUnion(schema_, references_, value)
    default:
      return Default(schema_, value)
  }
}
/**
 * `[Internal]` Decodes the value and returns the result. This function requires that
 * the caller `Check` the value before use. Passing unchecked values may result in
 * undefined behavior. Refer to the `Value.Decode()` for implementation details.
 */
export function TransformDecode(schema: TSchema, references: TSchema[], value: unknown): unknown {
  return Visit(schema, references, value)
}
