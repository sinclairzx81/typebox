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
import { Clone } from './clone'
import * as Types from '../typebox'

// --------------------------------------------------------------------------
// ValueOrDefault
// --------------------------------------------------------------------------
export function ValueOrDefault(schema: Types.TSchema, value: unknown) {
  return !(value === undefined) || !('default' in schema) ? value : schema.default
}
// --------------------------------------------------------------------------
// Default
// --------------------------------------------------------------------------
export function Default(schema: Types.TArray, references: Types.TSchema[], value: unknown) {
  return ValueOrDefault(schema, value)
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
  return Object.getOwnPropertyNames(schema.properties).reduce((acc, key) => {
    const property = Visit(schema.properties[key], references, object[key])
    return { ...acc, [key]: property }
  }, {})
}
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: unknown): any {
  const object = ValueOrDefault(schema, value)
  if (!IsObject(object)) return object
  const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0]
  const patternRegexp = new RegExp(patternKey)
  return Object.getOwnPropertyNames(value).reduce((acc, key) => {
    if (patternRegexp.test(key)) {
      const property = Visit(patternSchema, references, object[key])
      return { ...acc, [key]: property }
    } else {
      return acc
    }
  }, {})
}
function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, value)
}
function TThis(schema: Types.TThis, references: Types.TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, value)
}
function TTuple(schema: Types.TTuple<any[]>, references: Types.TSchema[], value: unknown): any {
  const elements = ValueOrDefault(schema, value)
  return !IsArray(elements) || IsUndefined(schema.items) ? elements : schema.items!.map((schema, index) => Visit(schema, references, elements[index]))
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
      return Default(schema_, references_, value)
  }
}
// --------------------------------------------------------------------------
// Default
// --------------------------------------------------------------------------
/** Creates default values for any missing internal properties, elements or values using `default` annotations. The return value should be checked before use. */
export function Defaults<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): unknown
/** Creates default values for any missing internal properties, elements or values using `default` annotations. The return value should be checked before use. */
export function Defaults<T extends Types.TSchema>(schema: T, value: unknown): unknown
/** Creates default values for any missing internal properties, elements or values using `default` annotations. The return value should be checked before use. */
export function Defaults(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], Clone(args[2])) : Visit(args[0], [], Clone(args[1]))
}
