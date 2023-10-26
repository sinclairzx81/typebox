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

import { IsString, IsPlainObject, IsArray, IsValueType } from './guard'
import { ValueError } from '../errors/errors'
import { Deref } from './deref'
import { Clone } from './clone'
import * as Types from '../typebox'

// -------------------------------------------------------------------------
// CheckFunction
// -------------------------------------------------------------------------
export type CheckFunction = (schema: Types.TSchema, references: Types.TSchema[], value: unknown) => boolean

// -------------------------------------------------------------------------
// Errors
// -------------------------------------------------------------------------
export class TransformUnknownTypeError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TRef | Types.TThis) {
    super(`Unknown type`)
  }
}
export class TransformDecodeCheckError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema, public readonly value: unknown, public readonly error: ValueError) {
    super(`Unable to decode due to invalid value`)
  }
}
export class TransformEncodeCheckError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema, public readonly value: unknown, public readonly error: ValueError) {
    super(`Unable to encode due to invalid value`)
  }
}
export class TransformDecodeError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema, public readonly value: unknown, error: any) {
    super(`${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
export class TransformEncodeError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema, public readonly value: unknown, error: any) {
    super(`${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
// -------------------------------------------------------------------------
// HasTransform
// -------------------------------------------------------------------------
/** Recursively checks a schema for transform codecs */
export namespace HasTransform {
  function TArray(schema: Types.TArray, references: Types.TSchema[]): boolean {
    return Types.TypeGuard.TTransform(schema) || Visit(schema.items, references)
  }
  function TAsyncIterator(schema: Types.TAsyncIterator, references: Types.TSchema[]): boolean {
    return Types.TypeGuard.TTransform(schema) || Visit(schema.items, references)
  }
  function TConstructor(schema: Types.TConstructor, references: Types.TSchema[]) {
    return Types.TypeGuard.TTransform(schema) || Visit(schema.returns, references) || schema.parameters.some((schema) => Visit(schema, references))
  }
  function TFunction(schema: Types.TFunction, references: Types.TSchema[]) {
    return Types.TypeGuard.TTransform(schema) || Visit(schema.returns, references) || schema.parameters.some((schema) => Visit(schema, references))
  }
  function TIntersect(schema: Types.TIntersect, references: Types.TSchema[]) {
    return Types.TypeGuard.TTransform(schema) || Types.TypeGuard.TTransform(schema.unevaluatedProperties) || schema.allOf.some((schema) => Visit(schema, references))
  }
  function TIterator(schema: Types.TIterator, references: Types.TSchema[]) {
    return Types.TypeGuard.TTransform(schema) || Visit(schema.items, references)
  }
  function TNot(schema: Types.TNot, references: Types.TSchema[]) {
    return Types.TypeGuard.TTransform(schema) || Visit(schema.not, references)
  }
  function TObject(schema: Types.TObject, references: Types.TSchema[]) {
    // prettier-ignore
    return (Types.TypeGuard.TTransform(schema) || Object.values(schema.properties).some((schema) => Visit(schema, references)) || Types.TypeGuard.TSchema(schema.additionalProperties) && Visit(schema.additionalProperties, references)
    )
  }
  function TPromise(schema: Types.TPromise, references: Types.TSchema[]) {
    return Types.TypeGuard.TTransform(schema) || Visit(schema.item, references)
  }
  function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[]) {
    const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
    const property = schema.patternProperties[pattern]
    return Types.TypeGuard.TTransform(schema) || Visit(property, references) || (Types.TypeGuard.TSchema(schema.additionalProperties) && Types.TypeGuard.TTransform(schema.additionalProperties))
  }
  function TRef(schema: Types.TRef<any>, references: Types.TSchema[]) {
    if (Types.TypeGuard.TTransform(schema)) return true
    return Visit(Deref(schema, references), references)
  }
  function TThis(schema: Types.TThis, references: Types.TSchema[]) {
    if (Types.TypeGuard.TTransform(schema)) return true
    return Visit(Deref(schema, references), references)
  }
  function TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[]) {
    return Types.TypeGuard.TTransform(schema) || (Types.TypeGuard.TSchema(schema.items) && schema.items.some((schema) => Visit(schema, references)))
  }
  function TUnion(schema: Types.TUnion, references: Types.TSchema[]) {
    return Types.TypeGuard.TTransform(schema) || schema.anyOf.some((schema) => Visit(schema, references))
  }
  function Visit(schema: Types.TSchema, references: Types.TSchema[]): boolean {
    const references_ = IsString(schema.$id) ? [...references, schema] : references
    const schema_ = schema as any
    if (schema.$id && visited.has(schema.$id)) return false
    if (schema.$id) visited.add(schema.$id)
    switch (schema[Types.Kind]) {
      // ------------------------------------------------------------
      // Structural
      // ------------------------------------------------------------
      case 'Array':
        return TArray(schema_, references_)
      case 'AsyncIterator':
        return TAsyncIterator(schema_, references_)
      case 'Constructor':
        return TConstructor(schema_, references_)
      case 'Function':
        return TFunction(schema_, references_)
      case 'Intersect':
        return TIntersect(schema_, references_)
      case 'Iterator':
        return TIterator(schema_, references_)
      case 'Not':
        return TNot(schema_, references_)
      case 'Object':
        return TObject(schema_, references_)
      case 'Promise':
        return TPromise(schema_, references_)
      case 'Record':
        return TRecord(schema_, references_)
      case 'Ref':
        return TRef(schema_, references_)
      case 'This':
        return TThis(schema_, references_)
      case 'Tuple':
        return TTuple(schema_, references_)
      case 'Union':
        return TUnion(schema_, references_)
      // ------------------------------------------------------------
      // NonStructural
      // ------------------------------------------------------------
      default:
        return Types.TypeGuard.TTransform(schema)
    }
  }
  const visited = new Set<string>()
  /** Returns true if this schema contains a transform codec */
  export function Has(schema: Types.TSchema, references: Types.TSchema[]): boolean {
    visited.clear()
    return Visit(schema, references)
  }
}
// -------------------------------------------------------------------------
// DecodeTransform
// -------------------------------------------------------------------------
/** Decodes a value using transform decoders if available. Does not ensure correct results. */
export namespace DecodeTransform {
  function Default(schema: Types.TSchema, value: any) {
    try {
      return Types.TypeGuard.TTransform(schema) ? schema[Types.Transform].Decode(value) : value
    } catch (error) {
      throw new TransformDecodeError(schema, value, error)
    }
  }
  function TArray(schema: Types.TArray, references: Types.TSchema[], value: any): any {
    const elements1 = value.map((value: any) => Visit(schema.items, references, value)) as unknown[]
    return Default(schema, elements1)
  }
  function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: any) {
    if (!IsPlainObject(value) || IsValueType(value)) return Default(schema, value)
    const keys = Types.KeyResolver.ResolveKeys(schema, { includePatterns: false })
    const properties1 = Object.entries(value).reduce((acc, [key, value]) => {
      return !keys.includes(key) ? { ...acc, [key]: value } : { ...acc, [key]: Default(Types.IndexedAccessor.Resolve(schema, [key]), value) }
    }, {} as Record<any, any>)
    if (!Types.TypeGuard.TTransform(schema.unevaluatedProperties)) return Default(schema, properties1)
    const properties2 = Object.entries(properties1).reduce((acc, [key, value]) => {
      return keys.includes(key) ? { ...acc, [key]: value } : { ...acc, [key]: Default(schema.unevaluatedProperties as Types.TSchema, value) }
    }, {} as Record<any, any>)
    return Default(schema, properties2)
  }
  function TNot(schema: Types.TNot, references: Types.TSchema[], value: any) {
    const value1 = Visit(schema.not, references, value)
    return Default(schema, value1)
  }
  function TObject(schema: Types.TObject, references: Types.TSchema[], value: any) {
    if (!IsPlainObject(value)) return Default(schema, value)
    const properties1 = Object.entries(value).reduce((acc, [key, value]) => {
      return !(key in schema.properties) ? { ...acc, [key]: value } : { ...acc, [key]: Visit(schema.properties[key], references, value) }
    }, {} as Record<any, any>)
    if (!Types.TypeGuard.TSchema(schema.additionalProperties)) return Default(schema, properties1)
    const additionalProperties = schema.additionalProperties as Types.TSchema
    const properties2 = Object.entries(properties1).reduce((acc, [key, value]) => {
      return key in schema.properties ? { ...acc, [key]: value } : { ...acc, [key]: Visit(additionalProperties, references, value) }
    }, {} as Record<any, any>)
    return Default(schema, properties2)
  }
  function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any) {
    if (!IsPlainObject(value)) return Default(schema, value)
    const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
    const property = schema.patternProperties[pattern]
    const regex = new RegExp(pattern)
    const properties1 = Object.entries(value).reduce((acc, [key, value]) => {
      return !regex.test(key) ? { ...acc, [key]: value } : { ...acc, [key]: Visit(property, references, value) }
    }, {} as Record<any, any>)
    if (!Types.TypeGuard.TSchema(schema.additionalProperties)) return Default(schema, properties1)
    const additionalProperties = schema.additionalProperties as Types.TSchema
    const properties2 = Object.entries(properties1).reduce((acc, [key, value]) => {
      return regex.test(key) ? { ...acc, [key]: value } : { ...acc, [key]: Visit(additionalProperties, references, value) }
    }, {} as Record<any, any>)
    return Default(schema, properties2)
  }
  function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: any) {
    const target = Deref(schema, references)
    const resolved = Visit(target, references, value)
    return Default(schema, resolved)
  }
  function TThis(schema: Types.TThis, references: Types.TSchema[], value: any) {
    const target = Deref(schema, references)
    const resolved = Visit(target, references, value)
    return Default(schema, resolved)
  }
  function TTuple(schema: Types.TTuple, references: Types.TSchema[], value: any) {
    const value1 = IsArray(schema.items) ? schema.items.map((schema, index) => Visit(schema, references, value[index])) : []
    return Default(schema, value1)
  }
  function TUnion(schema: Types.TUnion, references: Types.TSchema[], value: any) {
    const value1 = Default(schema, value)
    for (const subschema of schema.anyOf) {
      if (!checkFunction(subschema, references, value1)) continue
      return Visit(subschema, references, value1)
    }
    return value1
  }
  function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
    const references_ = typeof schema.$id === 'string' ? [...references, schema] : references
    const schema_ = schema as any
    switch (schema[Types.Kind]) {
      // ------------------------------------------------------------
      // Structural
      // ------------------------------------------------------------
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
      // ------------------------------------------------------------
      // NonStructural
      // ------------------------------------------------------------
      default:
        return Default(schema_, value)
    }
  }
  let checkFunction: CheckFunction = () => false
  export function Decode(schema: Types.TSchema, references: Types.TSchema[], value: unknown, check: CheckFunction): unknown {
    checkFunction = check
    return Visit(schema, references, value)
  }
}
// -------------------------------------------------------------------------
// DecodeTransform
// -------------------------------------------------------------------------
/** Encodes a value using transform encoders if available. Does not ensure correct results. */
export namespace EncodeTransform {
  function Default(schema: Types.TSchema, value: any) {
    try {
      return Types.TypeGuard.TTransform(schema) ? schema[Types.Transform].Encode(value) : value
    } catch (error) {
      throw new TransformEncodeError(schema, value, error)
    }
  }
  function TArray(schema: Types.TArray, references: Types.TSchema[], value: any): any {
    const elements1 = Default(schema, value)
    return elements1.map((value: any) => Visit(schema.items, references, value)) as unknown[]
  }
  function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: any) {
    const properties1 = Default(schema, value)
    if (!IsPlainObject(value) || IsValueType(value)) return properties1
    const keys = Types.KeyResolver.ResolveKeys(schema, { includePatterns: false })
    const properties2 = Object.entries(properties1).reduce((acc, [key, value]) => {
      return !keys.includes(key) ? { ...acc, [key]: value } : { ...acc, [key]: Default(Types.IndexedAccessor.Resolve(schema, [key]), value) }
    }, {} as Record<any, any>)
    if (!Types.TypeGuard.TTransform(schema.unevaluatedProperties)) return Default(schema, properties2)
    return Object.entries(properties2).reduce((acc, [key, value]) => {
      return keys.includes(key) ? { ...acc, [key]: value } : { ...acc, [key]: Default(schema.unevaluatedProperties as Types.TSchema, value) }
    }, {} as Record<any, any>)
  }
  function TNot(schema: Types.TNot, references: Types.TSchema[], value: any) {
    const value1 = Default(schema, value)
    return Default(schema.not, value1)
  }
  function TObject(schema: Types.TObject, references: Types.TSchema[], value: any) {
    const properties1 = Default(schema, value) as Record<any, any>
    if (!IsPlainObject(value)) return properties1
    const properties2 = Object.entries(properties1).reduce((acc, [key, value]) => {
      return !(key in schema.properties) ? { ...acc, [key]: value } : { ...acc, [key]: Visit(schema.properties[key], references, value) }
    }, {} as Record<any, any>)
    if (!Types.TypeGuard.TSchema(schema.additionalProperties)) return properties2
    const additionalProperties = schema.additionalProperties as Types.TSchema
    return Object.entries(properties2).reduce((acc, [key, value]) => {
      return key in schema.properties ? { ...acc, [key]: value } : { ...acc, [key]: Visit(additionalProperties, references, value) }
    }, {} as Record<any, any>)
  }
  function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any) {
    const properties1 = Default(schema, value) as Record<any, any>
    if (!IsPlainObject(value)) return properties1
    const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
    const property = schema.patternProperties[pattern]
    const regex = new RegExp(pattern)
    const properties2 = Object.entries(properties1).reduce((acc, [key, value]) => {
      return !regex.test(key) ? { ...acc, [key]: value } : { ...acc, [key]: Visit(property, references, value) }
    }, {} as Record<any, any>)
    if (!Types.TypeGuard.TSchema(schema.additionalProperties)) return Default(schema, properties2)
    const additionalProperties = schema.additionalProperties as Types.TSchema
    return Object.entries(properties2).reduce((acc, [key, value]) => {
      return regex.test(key) ? { ...acc, [key]: value } : { ...acc, [key]: Visit(additionalProperties, references, value) }
    }, {} as Record<any, any>)
  }
  function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: any) {
    const target = Deref(schema, references)
    const resolved = Visit(target, references, value)
    return Default(schema, resolved)
  }
  function TThis(schema: Types.TThis, references: Types.TSchema[], value: any) {
    const target = Deref(schema, references)
    const resolved = Visit(target, references, value)
    return Default(schema, resolved)
  }
  function TTuple(schema: Types.TTuple, references: Types.TSchema[], value: any) {
    const value1 = Default(schema, value)
    return IsArray(schema.items) ? schema.items.map((schema, index) => Visit(schema, references, value1[index])) : []
  }
  function TUnion(schema: Types.TUnion, references: Types.TSchema[], value: any) {
    // test value against union variants
    for (const subschema of schema.anyOf) {
      if (!checkFunction(subschema, references, value)) continue
      const value1 = Visit(subschema, references, value)
      return Default(schema, value1)
    }
    // test transformed value against union variants
    for (const subschema of schema.anyOf) {
      const value1 = Visit(subschema, references, value)
      if (!checkFunction(schema, references, value1)) continue
      return Default(schema, value1)
    }
    return Default(schema, value)
  }
  function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
    const references_ = typeof schema.$id === 'string' ? [...references, schema] : references
    const schema_ = schema as any
    switch (schema[Types.Kind]) {
      // ------------------------------------------------------------
      // Structural
      // ------------------------------------------------------------
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
      case 'This':
        return TThis(schema_, references_, value)
      case 'Tuple':
        return TTuple(schema_, references_, value)
      case 'Union':
        return TUnion(schema_, references_, value)
      // ------------------------------------------------------------
      // NonStructural
      // ------------------------------------------------------------
      default:
        return Default(schema_, value)
    }
  }
  let checkFunction: CheckFunction = () => false
  export function Encode(schema: Types.TSchema, references: Types.TSchema[], value: unknown, check: CheckFunction): unknown {
    checkFunction = check
    return Visit(schema, references, value)
  }
}
