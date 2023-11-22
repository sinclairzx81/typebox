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
import { IsString, IsUndefined } from '../guard/index'
import { Deref } from '../deref/index'
import { Kind } from '../../type/symbols/index'

import type { TSchema } from '../../type/schema/index'
import type { TArray } from '../../type/array/index'
import type { TAsyncIterator } from '../../type/async-iterator/index'
import type { TConstructor } from '../../type/constructor/index'
import type { TFunction } from '../../type/function/index'
import type { TIntersect } from '../../type/intersect/index'
import type { TIterator } from '../../type/iterator/index'
import type { TNot } from '../../type/not/index'
import type { TObject } from '../../type/object/index'
import type { TPromise } from '../../type/promise/index'
import type { TRecord } from '../../type/record/index'
import type { TRef } from '../../type/ref/index'
import type { TThis } from '../../type/recursive/index'
import type { TTuple } from '../../type/tuple/index'
import type { TUnion } from '../../type/union/index'

// prettier-ignore
function TArray(schema: TArray, references: TSchema[]): boolean {
  return IsTransformType(schema) || Visit(schema.items, references)
}
// prettier-ignore
function TAsyncIterator(schema: TAsyncIterator, references: TSchema[]): boolean {
  return IsTransformType(schema) || Visit(schema.items, references)
}
// prettier-ignore
function TConstructor(schema: TConstructor, references: TSchema[]) {
  return IsTransformType(schema) || Visit(schema.returns, references) || schema.parameters.some((schema) => Visit(schema, references))
}
// prettier-ignore
function TFunction(schema: TFunction, references: TSchema[]) {
  return IsTransformType(schema) || Visit(schema.returns, references) || schema.parameters.some((schema) => Visit(schema, references))
}
// prettier-ignore
function TIntersect(schema: TIntersect, references: TSchema[]) {
  return IsTransformType(schema) || IsTransformType(schema.unevaluatedProperties) || schema.allOf.some((schema) => Visit(schema, references))
}
// prettier-ignore
function TIterator(schema: TIterator, references: TSchema[]) {
  return IsTransformType(schema) || Visit(schema.items, references)
}
// prettier-ignore
function TNot(schema: TNot, references: TSchema[]) {
  return IsTransformType(schema) || Visit(schema.not, references)
}
// prettier-ignore
function TObject(schema: TObject, references: TSchema[]) {
  return (
    IsTransformType(schema) || 
    Object.values(schema.properties).some((schema) => Visit(schema, references)) || 
    (
      IsSchemaType(schema.additionalProperties) && Visit(schema.additionalProperties, references)
    )
  )
}
// prettier-ignore
function TPromise(schema: TPromise, references: TSchema[]) {
  return IsTransformType(schema) || Visit(schema.item, references)
}
// prettier-ignore
function TRecord(schema: TRecord, references: TSchema[]) {
  const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
  const property = schema.patternProperties[pattern]
  return IsTransformType(schema) || Visit(property, references) || (IsSchemaType(schema.additionalProperties) && IsTransformType(schema.additionalProperties))
}
// prettier-ignore
function TRef(schema: TRef, references: TSchema[]) {
  if (IsTransformType(schema)) return true
  return Visit(Deref(schema, references), references)
}
// prettier-ignore
function TThis(schema: TThis, references: TSchema[]) {
  if (IsTransformType(schema)) return true
  return Visit(Deref(schema, references), references)
}
// prettier-ignore
function TTuple(schema: TTuple, references: TSchema[]) {
  return IsTransformType(schema) || (!IsUndefined(schema.items) && schema.items.some((schema) => Visit(schema, references)))
}
// prettier-ignore
function TUnion(schema: TUnion, references: TSchema[]) {
  return IsTransformType(schema) || schema.anyOf.some((schema) => Visit(schema, references))
}
// prettier-ignore
function Visit(schema: TSchema, references: TSchema[]): boolean {
  const references_ = IsString(schema.$id) ? [...references, schema] : references
  const schema_ = schema as any
  if (schema.$id && visited.has(schema.$id)) return false
  if (schema.$id) visited.add(schema.$id)
  switch (schema[Kind]) {
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
      return IsTransformType(schema)
  }
}
const visited = new Set<string>()
/** Returns true if this schema contains a transform codec */
export function HasTransform(schema: TSchema, references: TSchema[]): boolean {
  visited.clear()
  return Visit(schema, references)
}
