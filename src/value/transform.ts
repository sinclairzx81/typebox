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

import { IsString, IsPlainObject, IsArray, IsValueType, IsUndefined } from './guard'
import { ValueError } from '../errors/errors'
import { Deref } from './deref'
import { Check } from './check'
import * as Types from '../typebox'

// -------------------------------------------------------------------------
// Errors
// -------------------------------------------------------------------------
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
// ------------------------------------------------------------------
// HasTransform
// ------------------------------------------------------------------
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
    return Types.TypeGuard.TTransform(schema) || (!IsUndefined(schema.items) && schema.items.some((schema) => Visit(schema, references)))
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
// ------------------------------------------------------------------
// DecodeTransform
// ------------------------------------------------------------------
/** Decodes a value using transform decoders if available. Does not ensure correct results. */
export namespace DecodeTransform {
  function Default(schema: Types.TSchema, value: any) {
    try {
      return Types.TypeGuard.TTransform(schema) ? schema[Types.Transform].Decode(value) : value
    } catch (error) {
      throw new TransformDecodeError(schema, value, error)
    }
  }
  // prettier-ignore
  function TArray(schema: Types.TArray, references: Types.TSchema[], value: any): any {
    return (IsArray(value))
      ? Default(schema, value.map((value: any) => Visit(schema.items, references, value)))
      : Default(schema, value)
  }
  // prettier-ignore
  function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: any) {
    if (!IsPlainObject(value) || IsValueType(value)) return Default(schema, value)
    const knownKeys = Types.KeyResolver.ResolveKeys(schema, { includePatterns: false })
    const knownProperties = knownKeys.reduce((value, key) => {
      return (key in value)
        ? { ...value, [key]: Visit(Types.IndexedAccessor.Resolve(schema, [key]), references, value[key]) }
        : value
    }, value)
    if (!Types.TypeGuard.TTransform(schema.unevaluatedProperties)) {
      return Default(schema, knownProperties)
    }
    const unknownKeys = Object.getOwnPropertyNames(knownProperties)
    const unevaluatedProperties = schema.unevaluatedProperties as Types.TSchema
    const unknownProperties = unknownKeys.reduce((value, key) => {
      return !knownKeys.includes(key)
        ? { ...value, [key]: Default(unevaluatedProperties, value[key]) }
        : value
    }, knownProperties)
    return Default(schema, unknownProperties)
  }
  function TNot(schema: Types.TNot, references: Types.TSchema[], value: any) {
    return Default(schema, Visit(schema.not, references, value))
  }
  // prettier-ignore
  function TObject(schema: Types.TObject, references: Types.TSchema[], value: any) {
    if (!IsPlainObject(value)) return Default(schema, value)
    const knownKeys = Types.KeyResolver.ResolveKeys(schema, { includePatterns: false })
    const knownProperties = knownKeys.reduce((value, key) => {
      return (key in value) 
        ? { ...value, [key]: Visit(schema.properties[key], references, value[key]) }  
        : value
    }, value)
    if (!Types.TypeGuard.TSchema(schema.additionalProperties)) {
      return Default(schema, knownProperties)
    }
    const unknownKeys = Object.getOwnPropertyNames(knownProperties)
    const additionalProperties = schema.additionalProperties as Types.TSchema
    const unknownProperties = unknownKeys.reduce((value, key) => {
      return !knownKeys.includes(key)
      ? { ...value, [key]: Default(additionalProperties, value[key]) }
      : value
    }, knownProperties)
    return Default(schema, unknownProperties)
  }
  // prettier-ignore
  function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any) {
    if (!IsPlainObject(value)) return Default(schema, value)
    const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
    const knownKeys = new RegExp(pattern)
    const knownProperties = Object.getOwnPropertyNames(value).reduce((value, key) => {
      return knownKeys.test(key) 
        ? { ...value, [key]: Visit(schema.patternProperties[pattern], references, value[key]) }
        : value
    }, value)
    if (!Types.TypeGuard.TSchema(schema.additionalProperties)) {
      return Default(schema, knownProperties)
    }
    const unknownKeys = Object.getOwnPropertyNames(knownProperties)
    const additionalProperties = schema.additionalProperties as Types.TSchema
    const unknownProperties = unknownKeys.reduce((value, key) => {
      return !knownKeys.test(key)
      ? { ...value, [key]: Default(additionalProperties, value[key]) }
      : value
    }, knownProperties)
    return Default(schema, unknownProperties)
  }
  function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: any) {
    const target = Deref(schema, references)
    return Default(schema, Visit(target, references, value))
  }
  function TThis(schema: Types.TThis, references: Types.TSchema[], value: any) {
    const target = Deref(schema, references)
    return Default(schema, Visit(target, references, value))
  }
  // prettier-ignore
  function TTuple(schema: Types.TTuple, references: Types.TSchema[], value: any) {
    return (IsArray(value) && IsArray(schema.items))
      ? Default(schema, schema.items.map((schema, index) => Visit(schema, references, value[index])))
      : Default(schema, value)
  }
  function TUnion(schema: Types.TUnion, references: Types.TSchema[], value: any) {
    const defaulted = Default(schema, value)
    for (const subschema of schema.anyOf) {
      if (!Check(subschema, references, defaulted)) continue
      return Visit(subschema, references, defaulted)
    }
    return defaulted
  }
  function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
    const references_ = typeof schema.$id === 'string' ? [...references, schema] : references
    const schema_ = schema as any
    switch (schema[Types.Kind]) {
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
  export function Decode(schema: Types.TSchema, references: Types.TSchema[], value: unknown): unknown {
    return Visit(schema, references, value)
  }
}
// ------------------------------------------------------------------
// DecodeTransform
// ------------------------------------------------------------------
/** Encodes a value using transform encoders if available. Does not ensure correct results. */
export namespace EncodeTransform {
  function Default(schema: Types.TSchema, value: any) {
    try {
      return Types.TypeGuard.TTransform(schema) ? schema[Types.Transform].Encode(value) : value
    } catch (error) {
      throw new TransformEncodeError(schema, value, error)
    }
  }
  // prettier-ignore
  function TArray(schema: Types.TArray, references: Types.TSchema[], value: any): any {
    const defaulted = Default(schema, value)
    return IsArray(defaulted)
      ? defaulted.map((value: any) => Visit(schema.items, references, value))
      : defaulted
  }
  // prettier-ignore
  function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: any) {
    const defaulted = Default(schema, value)
    if (!IsPlainObject(value) || IsValueType(value)) return defaulted
    const knownKeys = Types.KeyResolver.ResolveKeys(schema, { includePatterns: false })
    const knownProperties = knownKeys.reduce((value, key) => {
      return key in defaulted 
        ? { ...value, [key]: Visit(Types.IndexedAccessor.Resolve(schema, [key]), references, value[key]) } 
        : value
    }, defaulted)
    if (!Types.TypeGuard.TTransform(schema.unevaluatedProperties)) {
      return Default(schema, knownProperties)
    }
    const unknownKeys = Object.getOwnPropertyNames(knownProperties)
    const unevaluatedProperties = schema.unevaluatedProperties as Types.TSchema
    return unknownKeys.reduce((value, key) => {
      return !knownKeys.includes(key) 
        ? { ...value, [key]: Default(unevaluatedProperties, value[key]) }  
        : value
    }, knownProperties)
  }
  function TNot(schema: Types.TNot, references: Types.TSchema[], value: any) {
    return Default(schema.not, Default(schema, value))
  }
  // prettier-ignore
  function TObject(schema: Types.TObject, references: Types.TSchema[], value: any) {
    const defaulted = Default(schema, value)
    if (!IsPlainObject(value)) return defaulted
    const knownKeys = Types.KeyResolver.ResolveKeys(schema, { includePatterns: false })
    const knownProperties = knownKeys.reduce((value, key) => {
      return key in value 
        ? { ...value, [key]: Visit(schema.properties[key], references, value[key]) } 
        : value
    }, defaulted)
    if (!Types.TypeGuard.TSchema(schema.additionalProperties)) {
      return knownProperties
    }
    const unknownKeys = Object.getOwnPropertyNames(knownProperties)
    const additionalProperties = schema.additionalProperties as Types.TSchema
    return unknownKeys.reduce((value, key) => {
      return !knownKeys.includes(key) 
        ? { ...value, [key]: Default(additionalProperties, value[key]) }  
        : value
    }, knownProperties)
  }
  // prettier-ignore
  function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any) {
    const defaulted = Default(schema, value) as Record<any, any>
    if (!IsPlainObject(value)) return defaulted
    const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
    const knownKeys = new RegExp(pattern)
    const knownProperties = Object.getOwnPropertyNames(value).reduce((value, key) => {
      return knownKeys.test(key) 
        ? { ...value, [key]: Visit(schema.patternProperties[pattern], references, value[key]) }
        : value
    }, defaulted)
    if (!Types.TypeGuard.TSchema(schema.additionalProperties)) {
      return Default(schema, knownProperties)
    }
    const unknownKeys = Object.getOwnPropertyNames(knownProperties)
    const additionalProperties = schema.additionalProperties as Types.TSchema
    return unknownKeys.reduce((value, key) => {
      return !knownKeys.test(key) 
        ? { ...value, [key]: Default(additionalProperties, value[key]) }  
        : value
    }, knownProperties)
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
      if (!Check(subschema, references, value)) continue
      const value1 = Visit(subschema, references, value)
      return Default(schema, value1)
    }
    // test transformed value against union variants
    for (const subschema of schema.anyOf) {
      const value1 = Visit(subschema, references, value)
      if (!Check(schema, references, value1)) continue
      return Default(schema, value1)
    }
    return Default(schema, value)
  }
  function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any): any {
    const references_ = typeof schema.$id === 'string' ? [...references, schema] : references
    const schema_ = schema as any
    switch (schema[Types.Kind]) {
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
      default:
        return Default(schema_, value)
    }
  }
  export function Encode(schema: Types.TSchema, references: Types.TSchema[], value: unknown): unknown {
    return Visit(schema, references, value)
  }
}
