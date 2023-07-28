/*--------------------------------------------------------------------------

@sinclair/typebox/transform

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

import * as Types from '@sinclair/typebox'
import * as ValueGuard from '@sinclair/typebox/value/guard'
import * as ValueCheck from '@sinclair/typebox/value/check'

// --------------------------------------------------------------------------
// Symbols
// --------------------------------------------------------------------------
export const TransformSymbol = Symbol.for('TypeBox.Transform')

// ----------------------------------------------------------------------------------------------
// Errors
// ----------------------------------------------------------------------------------------------
export class TransformDecodeError extends Error {
  constructor(public readonly schema: Types.TSchema, public readonly value: unknown) {
    super('ValueTransform: Unable to decode value as it does not match schema')
  }
}
export class TransformEncodeError extends Error {
  constructor(public readonly schema: Types.TSchema, public readonly value: unknown) {
    super('ValueTransform: The encode resulted in an invalid value')
  }
}
export class ValueTransformUnknownTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('Unknown type')
  }
}
export class ValueTransformDereferenceError extends Error {
  constructor(public readonly schema: Types.TRef | Types.TThis) {
    super(`Unable to dereference schema with $id '${schema.$ref}'`)
  }
}
export class ValueTransformFallthroughError extends Error {
  constructor(public readonly schema: Types.TSchema, public readonly value: unknown, public mode: ValueTransformMode) {
    super('Unexpected transform error')
  }
}
export class ValueTransformCodecError extends Error {
  constructor(public readonly schema: Types.TSchema, public readonly value: unknown, public mode: ValueTransformMode, error: any) {
    super(`${error instanceof Error ? error.message : 'Unknown'}`)
  }
}
export type ValueTransformMode = 'encode' | 'decode'

// ----------------------------------------------------------------------------------------------
// Apply
// ----------------------------------------------------------------------------------------------
function Apply(schema: Types.TSchema, value: any, mode: ValueTransformMode) {
  try {
    if (!HasTransform(schema)) return value
    const transform = schema[TransformSymbol] as unknown as TransformCodec
    if (mode === 'decode' && typeof transform.decode === 'function') return transform.decode(value)
    if (mode === 'encode' && typeof transform.encode === 'function') return transform.encode(value)
    return value
  } catch (error) {
    throw new ValueTransformCodecError(schema, value, mode, error)
  }
}
// --------------------------------------------------------------------------
// Guards
// --------------------------------------------------------------------------
function HasTransform(schema: Types.TSchema): schema is Types.TSchema & { [TransformSymbol]: TransformCodec } {
  return ValueGuard.HasPropertyKey(schema, TransformSymbol)
}
// ----------------------------------------------------------------------------------------------
// Transform
// ----------------------------------------------------------------------------------------------
function TAny(schema: Types.TAny, references: Types.TSchema[], value: any, mode: ValueTransformMode): any {
  return Apply(schema, value, mode)
}
function TArray(schema: Types.TArray, references: Types.TSchema[], value: any, mode: ValueTransformMode): any {
  if (ValueGuard.IsArray(value)) {
    const inner = value.map((value) => Visit(schema.items, references, value, mode))
    return Apply(schema, inner, mode)
  }
  throw new ValueTransformFallthroughError(schema, value, mode)
}
function TBigInt(schema: Types.TBigInt, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TBoolean(schema: Types.TBoolean, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TConstructor(schema: Types.TConstructor, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TDate(schema: Types.TDate, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TFunction(schema: Types.TFunction, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TInteger(schema: Types.TInteger, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TLiteral(schema: Types.TLiteral, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TNever(schema: Types.TNever, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TNull(schema: Types.TNull, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TNumber(schema: Types.TNumber, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TObject(schema: Types.TObject, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Object.keys(schema.properties).reduce((acc, key) => {
    return value[key] !== undefined ? { ...acc, [key]: Visit(schema.properties[key], references, value[key], mode) } : { ...acc }
  }, value)
}
function TPromise(schema: Types.TSchema, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  const propertyKey = Object.getOwnPropertyNames(schema.patternProperties)[0]
  const property = schema.patternProperties[propertyKey]
  const result = {} as Record<string, unknown>
  for (const [propKey, propValue] of Object.entries(value)) {
    result[propKey] = Visit(property, references, propValue, mode)
  }
  return Apply(schema, result, mode)
}
function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueTransformDereferenceError(schema)
  const target = references[index]
  const resolved = Visit(target, references, value, mode)
  return Apply(schema, resolved, mode)
}
function TString(schema: Types.TString, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TSymbol(schema: Types.TSymbol, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TTemplateLiteral(schema: Types.TTemplateLiteral, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TThis(schema: Types.TThis, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  const index = references.findIndex((foreign) => foreign.$id === schema.$ref)
  if (index === -1) throw new ValueTransformDereferenceError(schema)
  const target = references[index]
  const resolved = Visit(target, references, value, mode)
  return Apply(schema, resolved, mode)
}
function TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  if (!ValueGuard.IsArray(value)) return value
  if (!ValueGuard.IsUndefined(schema.items)) return value
  // prettier-ignore
  return Apply(schema, value.map((value: any, index: any) => {
    return index < schema.items!.length ? Visit(schema.items![index], references, value, mode) : value
  }), mode)
}
function TUndefined(schema: Types.TUndefined, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TUnion(schema: Types.TUnion, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  for (const subschema of schema.anyOf) {
    const inner = Visit(subschema, references, value, mode)
    if (ValueCheck.Check(subschema, references, inner)) {
      return Apply(schema, inner, mode)
    }
  }
  throw new ValueTransformFallthroughError(schema, value, mode)
}
function TUint8Array(schema: Types.TUint8Array, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TUnknown(schema: Types.TUnknown, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TVoid(schema: Types.TVoid, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
function TKind(schema: Types.TSchema, references: Types.TSchema[], value: any, mode: ValueTransformMode) {
  return Apply(schema, value, mode)
}
export function Visit(schema: Types.TSchema, references: Types.TSchema[], value: any, mode: ValueTransformMode): any {
  const references_ = ValueGuard.IsString(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema[Types.Kind]) {
    case 'Any':
      return TAny(schema_, references_, value, mode)
    case 'Array':
      return TArray(schema_, references_, value, mode)
    case 'BigInt':
      return TBigInt(schema_, references_, value, mode)
    case 'Boolean':
      return TBoolean(schema_, references_, value, mode)
    case 'Constructor':
      return TConstructor(schema_, references_, value, mode)
    case 'Date':
      return TDate(schema_, references_, value, mode)
    case 'Function':
      return TFunction(schema_, references_, value, mode)
    case 'Integer':
      return TInteger(schema_, references_, value, mode)
    case 'Intersect':
      return TIntersect(schema_, references_, value, mode)
    case 'Literal':
      return TLiteral(schema_, references_, value, mode)
    case 'Never':
      return TNever(schema_, references_, value, mode)
    case 'Null':
      return TNull(schema_, references_, value, mode)
    case 'Number':
      return TNumber(schema_, references_, value, mode)
    case 'Object':
      return TObject(schema_, references_, value, mode)
    case 'Promise':
      return TPromise(schema_, references_, value, mode)
    case 'Record':
      return TRecord(schema_, references_, value, mode)
    case 'Ref':
      return TRef(schema_, references_, value, mode)
    case 'String':
      return TString(schema_, references_, value, mode)
    case 'Symbol':
      return TSymbol(schema_, references_, value, mode)
    case 'TemplateLiteral':
      return TTemplateLiteral(schema_, references_, value, mode)
    case 'This':
      return TThis(schema_, references_, value, mode)
    case 'Tuple':
      return TTuple(schema_, references_, value, mode)
    case 'Undefined':
      return TUndefined(schema_, references_, value, mode)
    case 'Union':
      return TUnion(schema_, references_, value, mode)
    case 'Uint8Array':
      return TUint8Array(schema_, references_, value, mode)
    case 'Unknown':
      return TUnknown(schema_, references_, value, mode)
    case 'Void':
      return TVoid(schema_, references_, value, mode)
    default:
      if (!Types.TypeRegistry.Has(schema_[Types.Kind])) throw new ValueTransformUnknownTypeError(schema_)
      return TKind(schema_, references_, value, mode)
  }
}
// --------------------------------------------------------------------------
// Transform Unwrap
// --------------------------------------------------------------------------
// prettier-ignore
export type TransformUnwrapProperties<T extends Types.TProperties> = {
  [K in keyof T]: TransformUnwrap<T[K]>
}
// prettier-ignore
export type TransformUnwrapRest<T extends Types.TSchema[]> = T extends [infer L, ...infer R]
  ? [TransformUnwrap<Types.AssertType<L>>, ...TransformUnwrapRest<Types.AssertRest<R>>]
  : []
// prettier-ignore
export type TransformUnwrap<T extends Types.TSchema> =
  T extends TTransform<infer _, infer R> ? Types.TUnsafe<R> : 
  T extends Types.TConstructor<infer P, infer R> ? Types.TConstructor<Types.AssertRest<TransformUnwrapRest<P>>, TransformUnwrap<R>> :
  T extends Types.TFunction<infer P, infer R> ? Types.TFunction<Types.AssertRest<TransformUnwrapRest<P>>, TransformUnwrap<R>> :
  T extends Types.TIntersect<infer S> ? Types.TIntersect<Types.AssertRest<TransformUnwrapRest<S>>> :
  T extends Types.TUnion<infer S> ? Types.TUnion<Types.AssertRest<TransformUnwrapRest<S>>> :
  T extends Types.TNot<infer S> ? Types.TNot<TransformUnwrap<S>> :
  T extends Types.TTuple<infer S> ? Types.TTuple<Types.AssertRest<TransformUnwrapRest<S>>> :
  T extends Types.TAsyncIterator<infer S> ? Types.TAsyncIterator<TransformUnwrap<S>> :
  T extends Types.TIterator<infer S> ? Types.TIterator<TransformUnwrap<S>> :
  T extends Types.TObject<infer S> ? Types.TObject<Types.Evaluate<TransformUnwrapProperties<S>>> :
  T extends Types.TRecord<infer K, infer S> ? Types.TRecord<K, TransformUnwrap<S>> :
  T extends Types.TArray<infer S> ? Types.TArray<TransformUnwrap<S>> :
  T extends Types.TPromise<infer S> ? Types.TPromise<TransformUnwrap<S>> :
  T
// --------------------------------------------------------------------------
// Transform Types
// --------------------------------------------------------------------------
export type TransformFunction<T = any, U = any> = (value: T) => U

export interface TransformCodec<Input extends Types.TSchema = Types.TSchema, Output extends unknown = unknown> {
  decode: TransformFunction<Types.Static<Input>, Output>
  encode: TransformFunction<Output, Types.Static<Input>>
}
export interface TTransform<Input extends Types.TSchema = Types.TSchema, Output extends unknown = unknown> extends Types.TSchema {
  static: Types.Static<Input>
  [TransformSymbol]: TransformCodec<Input, Output>
  [key: string]: any
}
// --------------------------------------------------------------------------
// Transform Functions
// --------------------------------------------------------------------------
/** Creates a transform type by applying transform codec */
export function Transform<Input extends Types.TSchema, Output extends unknown>(schema: Input, codec: TransformCodec<Input, Output>): TTransform<Input, Output> {
  if (!HasTransform(schema)) return { ...schema, [TransformSymbol]: codec } as TTransform<Input, Output>
  const mapped_encode = (value: unknown) => codec.encode(schema[TransformSymbol].encode(value) as any)
  const mapped_decode = (value: unknown) => codec.decode(schema[TransformSymbol].decode(value))
  const mapped_codec = { encode: mapped_encode, decode: mapped_decode }
  return { ...schema, [TransformSymbol]: mapped_codec } as TTransform<Input, Output>
}
/** Decodes a value using the given type. Will apply an transform codecs found for any sub type */
export function Decode<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: Types.Static<T>): Types.Static<TransformUnwrap<T>>
/** Decodes a value using the given type. Will apply an transform codecs found for any sub type */
export function Decode<T extends Types.TSchema>(schema: T, value: Types.Static<T>): Types.Static<TransformUnwrap<T>>
/** Decodes a value using the given type. Will apply an transform codecs found for any sub type */
export function Decode(...args: any[]) {
  const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
  const check = ValueCheck.Check(schema, references, value)
  if (!check) throw new TransformDecodeError(schema, value)
  const decoded = Visit(schema, references, value, 'decode')
  return decoded
}
/** Encodes a value using the given type. Will apply an transforms found for any sub type */
export function Encode<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: Types.Static<TransformUnwrap<T>>): Types.Static<T>
/** Encodes a value using the given type. Will apply an transforms found for any sub type */
export function Encode<T extends Types.TSchema>(schema: T, value: Types.Static<TransformUnwrap<T>>): Types.Static<T>
/** Encodes a value using the given type. Will apply an transforms found for any sub type */
export function Encode(...args: any[]) {
  const [schema, references, value] = args.length === 3 ? [args[0], args[1], args[2]] : [args[0], [], args[1]]
  const encoded = Visit(schema, references, value, 'encode')
  const check = ValueCheck.Check(schema, references, encoded)
  if (!check) throw new TransformEncodeError(schema, value)
  return encoded
}
