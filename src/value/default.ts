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

import { HasPropertyKey, IsString, IsObject, IsArray, IsUndefined } from './guard'
import { Deref } from './deref'
import { Clone } from './clone'
import * as Types from '../typebox'

// --------------------------------------------------------------------------
// ValueOrDefault
// --------------------------------------------------------------------------
export function ValueOrDefault(schema: Types.TSchema, value: unknown) {
  return !(value === undefined) || !('default' in schema) ? value : schema.default
}
// --------------------------------------------------------------------------
// HasDefault
// --------------------------------------------------------------------------
export function HasDefault(schema: Types.TSchema) {
  return 'default' in schema
}
// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
function TArray(schema: Types.TArray, references: Types.TSchema[], value: unknown): any {
  const elements = ValueOrDefault(schema, value)
  return IsArray(elements) ? elements.map((element) => Visit(schema.items, references, element)) : elements
}
function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: unknown): any {
  const result = ValueOrDefault(schema, value)
  return schema.allOf.reduce((acc, schema) => {
    const next = Visit(schema, references, result)
    return IsObject(next) ? { ...acc, ...next } : next
  }, {})
}
function TObject(schema: Types.TObject, references: Types.TSchema[], value: unknown): any {
  const object = ValueOrDefault(schema, value)
  if (!IsObject(object)) return object
  const knownPropertyKeys = Object.getOwnPropertyNames(schema.properties)
  // Reduce on object using known keys and only map for property types that have
  // default values specified. The returned object should be the complete object
  // with additional properties unmapped.
  const properties = knownPropertyKeys.reduce((acc, key) => {
    return HasDefault(schema.properties[key]) ? { ...acc, [key]: Visit(schema.properties[key], references, object[key]) } : acc
  }, object)
  // If additionalProperties not is schema-like with a default property, we exit with properties.
  const additionalPropertiesSchema = schema.additionalProperties as Types.TSchema
  if (!(IsObject(additionalPropertiesSchema) && HasDefault(additionalPropertiesSchema))) return properties
  // Reduce on properties using object key. Only map properties outside the known key set
  return Object.getOwnPropertyNames(object).reduce((acc, key) => {
    return !knownPropertyKeys.includes(key) ? { ...acc, [key]: Visit(additionalPropertiesSchema, references, object[key]) } : acc
  }, properties)
}
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: unknown): any {
  const object = ValueOrDefault(schema, value)
  if (!IsObject(object)) return object
  const [propertyKeyPattern, propertySchema] = Object.entries(schema.patternProperties)[0]
  const knownPropertyKey = new RegExp(propertyKeyPattern)
  // Reduce on object keys using object keys and only map for property types that have
  // default values specified. The returned object should be the complete object
  // with additional properties unmapped.
  const properties = Object.getOwnPropertyNames(object).reduce((acc, key) => {
    return knownPropertyKey.test(key) && HasDefault(propertySchema) ? { ...acc, [key]: Visit(propertySchema, references, object[key]) } : { ...acc, [key]: object[key] }
  }, object)
  // If additionalProperties not is schema-like with a default property, we exit with properties.
  const additionalPropertiesSchema = schema.additionalProperties as Types.TSchema
  if (!(IsObject(additionalPropertiesSchema) && HasDefault(additionalPropertiesSchema))) return properties
  // Reduce on properties using object key. Only map properties outside the known key set
  return Object.getOwnPropertyNames(object).reduce((acc, key) => {
    return !knownPropertyKey.test(key) ? { ...acc, [key]: Visit(additionalPropertiesSchema, references, object[key]) } : acc
  }, properties)
}
function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, ValueOrDefault(schema, value))
}
function TThis(schema: Types.TThis, references: Types.TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, value)
}
function TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: unknown): any {
  const elements = ValueOrDefault(schema, value)
  if (!IsArray(elements) || IsUndefined(schema.items)) return elements
  const [items, max] = [schema.items!, Math.max(schema.items!.length, elements.length)]
  for (let i = 0; i < max; i++) {
    if (i < items.length) elements[i] = Visit(items[i], references, elements[i])
  }
  return elements
}
function Visit(schema: Types.TSchema, references: Types.TSchema[], value: unknown): any {
  const references_ = IsString(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  switch (schema_[Types.Kind]) {
    // --------------------------------------------------------------
    // Structural
    // --------------------------------------------------------------
    case 'Array':
      return TArray(schema_, references_, value)
    case 'Intersect':
      return TIntersect(schema_, references_, value)
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
    // --------------------------------------------------------------
    // NonStructural
    // --------------------------------------------------------------
    default:
      return ValueOrDefault(schema_, value)
  }
}
// --------------------------------------------------------------------------
// Default
// --------------------------------------------------------------------------
/** Creates a new value by applying annotated defaults to any missing or undefined interior values within the provided value. This function returns unknown, so it is essential to check the return value before use. */
export function Default<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): unknown
/** Creates a new value by applying annotated defaults to any missing or undefined interior values within the provided value. This function returns unknown, so it is essential to check the return value before use. */
export function Default<T extends Types.TSchema>(schema: T, value: unknown): unknown
/** Creates a new value by applying annotated defaults to any missing or undefined interior values within the provided value. This function returns unknown, so it is essential to check the return value before use. */
export function Default(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], Clone(args[2])) : Visit(args[0], [], Clone(args[1]))
}
