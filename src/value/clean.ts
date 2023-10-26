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
import { Check } from './check'
import { Clone } from './clone'
import { Deref } from './deref'
import * as Types from '../typebox'

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
function Default(schema: Types.TSchema, references: Types.TSchema[], value: unknown) {
  console.log('hello', value)
  return value
}
// --------------------------------------------------------------------------
// Structural
// --------------------------------------------------------------------------
function TArray(schema: Types.TArray, references: Types.TSchema[], value: unknown): any {
  if (!IsArray(value)) return Default(schema, references, value)
  return value.map((value) => Visit(schema.items, references, value))
}
function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: unknown): any {
  const values: any[] = schema.allOf.map((schema) => Visit(schema, references, Clone(value)))
  return values.reduce((acc, value) => {
    return IsObject(value) ? { ...acc, ...value } : value
  }, {} as any)
}
function TObject(schema: Types.TObject, references: Types.TSchema[], value: unknown): any {
  if (!IsObject(value)) return Default(schema, references, value)
  return Object.keys(schema.properties).reduce((acc, key) => {
    return key in value ? { ...acc, [key]: Visit(schema.properties[key], references, value[key]) } : acc
  }, {})
}
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: unknown): any {
  if (!IsObject(value)) return Default(schema, references, value)
  const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0]
  const patternRegExp = new RegExp(patternKey)
  return Object.keys(value).reduce((acc, key) => {
    return patternRegExp.test(key) ? { ...acc, [key]: Visit(patternSchema, references, value[key]) } : acc
  }, {})
}
function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: unknown): any {
  const target = Deref(schema, references)
  return Visit(target, references, value)
}
function TThis(schema: Types.TThis, references: Types.TSchema[], value: unknown): any {
  const target = Deref(schema, references)
  return Visit(target, references, value)
}
function TTuple(schema: Types.TTuple, references: Types.TSchema[], value: unknown): any {
  if (!IsArray(value)) return Default(schema, references, value)
  if (IsUndefined(schema.items)) return []
  return schema.items!.map((schema, index) => Visit(schema, references, value[index]))
}
function TUnion(schema: Types.TUnion, references: Types.TSchema[], value: unknown): any {
  for (const inner of schema.anyOf) {
    if (!Check(inner, value)) continue
    return Visit(inner, references, value)
  }
  return Default(schema, references, value)
}
function Visit(schema: Types.TSchema, references: Types.TSchema[], value: unknown): unknown {
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
    case 'Union':
      return TUnion(schema_, references_, value)
    // --------------------------------------------------------------
    // NonStructural
    // --------------------------------------------------------------
    default:
      return Default(schema_, references_, value)
  }
}
// --------------------------------------------------------------------------
// Clean
// --------------------------------------------------------------------------
/** `[Immutable]` Removes unknown property or interior value from the given value. The return value may be invalid and should be checked before use. */
export function Clean<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): unknown
/** `[Immutable]` Removes unknown property or interior value from the given value. The return value may be invalid and should be checked before use. */
export function Clean<T extends Types.TSchema>(schema: T): unknown
/** `[Immutable]` Removes unknown property or interior value from the given value. The return value may be invalid and should be checked before use. */
export function Clean(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], Clone(args[2])) : Visit(args[0], [], Clone(args[1]))
}
