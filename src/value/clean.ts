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

import { IsString, IsObject, IsArray, IsUndefined, IsValueType } from './guard'
import { Check } from './check'
import { Deref } from './deref'
import { Clone } from './clone'
import * as Types from '../typebox'

// --------------------------------------------------------------------------
// IsSchema
// --------------------------------------------------------------------------
function IsSchema(schema: unknown): schema is Types.TSchema {
  return Types.TypeGuard.TSchema(schema)
}
// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
function TArray(schema: Types.TArray, references: Types.TSchema[], value: unknown): any {
  if (!IsArray(value)) return value
  return value.map((value) => Visit(schema.items, references, value))
}
function TIntersect(schema: Types.TIntersect, references: Types.TSchema[], value: unknown): any {
  const unevaluatedProperties = schema.unevaluatedProperties as Types.TSchema
  const intersections = schema.allOf.map((schema) => Visit(schema, references, Clone(value)))
  const composite = intersections.reduce((acc: any, value: any) => (IsObject(value) ? { ...acc, ...value } : value), {})
  if (!IsObject(value) || !IsObject(composite) || !IsSchema(unevaluatedProperties)) return composite
  const knownkeys = Types.KeyResolver.ResolveKeys(schema, { includePatterns: false })
  for (const key of Object.getOwnPropertyNames(value)) {
    if (knownkeys.includes(key)) continue
    if (Check(unevaluatedProperties, references, value[key])) {
      composite[key] = Visit(unevaluatedProperties, references, value[key])
    }
  }
  return composite
}
function TObject(schema: Types.TObject, references: Types.TSchema[], value: unknown): any {
  if (!IsObject(value)) return value
  const additionalProperties = schema.additionalProperties as Types.TSchema
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
function TRecord(schema: Types.TRecord<any, any>, references: Types.TSchema[], value: unknown): any {
  if (!IsObject(value)) return value
  const additionalProperties = schema.additionalProperties as Types.TSchema
  const propertyKeys = Object.keys(value)
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
function TRef(schema: Types.TRef<any>, references: Types.TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, value)
}
function TThis(schema: Types.TThis, references: Types.TSchema[], value: unknown): any {
  return Visit(Deref(schema, references), references, value)
}
function TTuple(schema: Types.TTuple, references: Types.TSchema[], value: unknown): any {
  if (!IsArray(value)) return value
  if (IsUndefined(schema.items)) return []
  const length = schema.items.length
  for (let i = 0; i < length; i++) {
    value[i] = Visit(schema.items[i], references, value[i])
  }
  return value.length > length ? value.splice(length) : value
}
function TUnion(schema: Types.TUnion, references: Types.TSchema[], value: unknown): any {
  for (const inner of schema.anyOf) {
    if (!Check(inner, value)) continue
    return Visit(inner, references, value)
  }
  return value
}
function Visit(schema: Types.TSchema, references: Types.TSchema[], value: unknown): unknown {
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
    case 'Union':
      return TUnion(schema_, references_, value)
    default:
      return value
  }
}
// --------------------------------------------------------------------------
// Clean
// --------------------------------------------------------------------------
/** `[Mutable]` Removes excess properties from the input value and returns the result. This function is mutable and will modify the input value. To avoid mutation, clone the input value before passing to this function. In addition, this function does not type check the input value and will return invalid results for invalid inputs. You should type check the result before use. */
export function Clean<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: unknown): unknown
/** `[Mutable]` Removes excess properties from the input value and returns the result. This function is mutable and will modify the input value. To avoid mutation, clone the input value before passing to this function. In addition, this function does not type check the input value and will return invalid results for invalid inputs. You should type check the result before use. */
export function Clean<T extends Types.TSchema>(schema: T): unknown
/** `[Mutable]` Removes excess properties from the input value and returns the result. This function is mutable and will modify the input value. To avoid mutation, clone the input value before passing to this function. In addition, this function does not type check the input value and will return invalid results for invalid inputs. You should type check the result before use. */
export function Clean(...args: any[]) {
  return args.length === 3 ? Visit(args[0], args[1], args[2]) : Visit(args[0], [], args[1])
}
