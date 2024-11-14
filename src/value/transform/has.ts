/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Deref, Pushref } from '../deref/index'
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

// ------------------------------------------------------------------
// KindGuard
// ------------------------------------------------------------------
import { IsTransform, IsSchema } from '../../type/guard/kind'
// ------------------------------------------------------------------
// ValueGuard
// ------------------------------------------------------------------
import { IsUndefined } from '../guard/index'

// prettier-ignore
function FromArray(schema: TArray, references: TSchema[]): boolean {
  return IsTransform(schema) || Visit(schema.items, references)
}
// prettier-ignore
function FromAsyncIterator(schema: TAsyncIterator, references: TSchema[]): boolean {
  return IsTransform(schema) || Visit(schema.items, references)
}
// prettier-ignore
function FromConstructor(schema: TConstructor, references: TSchema[]) {
  return IsTransform(schema) || Visit(schema.returns, references) || schema.parameters.some((schema) => Visit(schema, references))
}
// prettier-ignore
function FromFunction(schema: TFunction, references: TSchema[]) {
  return IsTransform(schema) || Visit(schema.returns, references) || schema.parameters.some((schema) => Visit(schema, references))
}
// prettier-ignore
function FromIntersect(schema: TIntersect, references: TSchema[]) {
  return IsTransform(schema) || IsTransform(schema.unevaluatedProperties) || schema.allOf.some((schema) => Visit(schema, references))
}
// prettier-ignore
function FromIterator(schema: TIterator, references: TSchema[]) {
  return IsTransform(schema) || Visit(schema.items, references)
}
// prettier-ignore
function FromNot(schema: TNot, references: TSchema[]) {
  return IsTransform(schema) || Visit(schema.not, references)
}
// prettier-ignore
function FromObject(schema: TObject, references: TSchema[]) {
  return (
    IsTransform(schema) || 
    Object.values(schema.properties).some((schema) => Visit(schema, references)) || 
    (
      IsSchema(schema.additionalProperties) && Visit(schema.additionalProperties, references)
    )
  )
}
// prettier-ignore
function FromPromise(schema: TPromise, references: TSchema[]) {
  return IsTransform(schema) || Visit(schema.item, references)
}
// prettier-ignore
function FromRecord(schema: TRecord, references: TSchema[]) {
  const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
  const property = schema.patternProperties[pattern]
  return IsTransform(schema) || Visit(property, references) || (IsSchema(schema.additionalProperties) && IsTransform(schema.additionalProperties))
}
// prettier-ignore
function FromRef(schema: TRef, references: TSchema[]) {
  if (IsTransform(schema)) return true
  return Visit(Deref(schema, references), references)
}
// prettier-ignore
function FromThis(schema: TThis, references: TSchema[]) {
  if (IsTransform(schema)) return true
  return Visit(Deref(schema, references), references)
}
// prettier-ignore
function FromTuple(schema: TTuple, references: TSchema[]) {
  return IsTransform(schema) || (!IsUndefined(schema.items) && schema.items.some((schema) => Visit(schema, references)))
}
// prettier-ignore
function FromUnion(schema: TUnion, references: TSchema[]) {
  return IsTransform(schema) || schema.anyOf.some((schema) => Visit(schema, references))
}
// prettier-ignore
function Visit(schema: TSchema, references: TSchema[]): boolean {
  const references_ = Pushref(schema, references)
  const schema_ = schema as any
  if (schema.$id && visited.has(schema.$id)) return false
  if (schema.$id) visited.add(schema.$id)
  switch (schema[Kind]) {
    case 'Array':
      return FromArray(schema_, references_)
    case 'AsyncIterator':
      return FromAsyncIterator(schema_, references_)
    case 'Constructor':
      return FromConstructor(schema_, references_)
    case 'Function':
      return FromFunction(schema_, references_)
    case 'Intersect':
      return FromIntersect(schema_, references_)
    case 'Iterator':
      return FromIterator(schema_, references_)
    case 'Not':
      return FromNot(schema_, references_)
    case 'Object':
      return FromObject(schema_, references_)
    case 'Promise':
      return FromPromise(schema_, references_)
    case 'Record':
      return FromRecord(schema_, references_)
    case 'Ref':
      return FromRef(schema_, references_)
    case 'This':
      return FromThis(schema_, references_)
    case 'Tuple':
      return FromTuple(schema_, references_)
    case 'Union':
      return FromUnion(schema_, references_)
    default:
      return IsTransform(schema)
  }
}
const visited = new Set<string>()
/** Returns true if this schema contains a transform codec */
export function HasTransform(schema: TSchema, references: TSchema[]): boolean {
  visited.clear()
  return Visit(schema, references)
}
