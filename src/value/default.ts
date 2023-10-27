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

import { IsString, IsObject, IsArray, IsUndefined } from './guard'
import { Deref } from './deref'
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
  if (!IsArray(elements)) return elements
  for (let i = 0; i < elements.length; i++) {
    elements[i] = Visit(schema.items, references, elements[i])
  }
  return elements
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
  // properties
  for (const key of knownPropertyKeys) {
    if (!HasDefault(schema.properties[key])) continue
    object[key] = Visit(schema.properties[key], references, object[key])
  }
  // additional property check
  const additionalPropertiesSchema = schema.additionalProperties as Types.TSchema
  if (!(IsObject(additionalPropertiesSchema) && HasDefault(additionalPropertiesSchema))) return object
  // additional properties
  for (const key of Object.getOwnPropertyNames(object)) {
    if (knownPropertyKeys.includes(key)) continue
    object[key] = Visit(additionalPropertiesSchema, references, object[key])
  }
  return object
}
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: unknown): any {
  const object = ValueOrDefault(schema, value)
  if (!IsObject(object)) return object
  const [propertyKeyPattern, propertySchema] = Object.entries(schema.patternProperties)[0]
  const knownPropertyKey = new RegExp(propertyKeyPattern)
  // properties
  for (const key of Object.getOwnPropertyNames(object)) {
    if (!(knownPropertyKey.test(key) && HasDefault(propertySchema))) continue
    object[key] = Visit(propertySchema, references, object[key])
  }
  // additional property check
  const additionalPropertiesSchema = schema.additionalProperties as Types.TSchema
  if (!(IsObject(additionalPropertiesSchema) && HasDefault(additionalPropertiesSchema))) return object
  // additional properties
  for (const key of Object.getOwnPropertyNames(object)) {
    if (knownPropertyKey.test(key)) continue
    object[key] = Visit(additionalPropertiesSchema, references, object[key])
  }
  return object
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
    default:
      return ValueOrDefault(schema_, value)
  }
}
// --------------------------------------------------------------------------
// Default
// --------------------------------------------------------------------------
/** `[Mutable]` Patches a given value with defaults derived from default schema annotations. This function is mutable and will modify the input value. To avoid mutation, clone the input value prior to calling this function. This function may return an incomplete or invalid result and should be checked before use. */
export function Default<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): unknown
/** `[Mutable]` Patches a given value with defaults derived from default schema annotations. This function is mutable and will modify the input value. To avoid mutation, clone the input value prior to calling this function. This function may return an incomplete or invalid result and should be checked before use. */
export function Default<T extends Types.TSchema>(schema: T, value: unknown): unknown
/** `[Mutable]` Patches a given value with defaults derived from default schema annotations. This function is mutable and will modify the input value. To avoid mutation, clone the input value prior to calling this function. This function may return an incomplete or invalid result and should be checked before use. */
export function Default(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], args[2]) : Visit(args[0], [], args[1])
}
