/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

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

// deno-fmt-ignore-file

import Guard from '../../guard/index.ts'
import { type TSchema } from '../../type/index.ts'
import { type TProperties } from '../../type/index.ts'
import { IsArray, Array as _Array_, ArrayOptions } from '../../type/index.ts'
import { IsUnion, Union } from '../../type/index.ts'
import { IsObject, Object as _Object_ } from '../../type/index.ts'
import { IsRecord, Record, RecordKey, RecordValue } from '../../type/index.ts'
import { IsTuple, Tuple } from '../../type/index.ts'
import { IsIntersect, Intersect } from '../../type/index.ts'
import { Priority } from '../../type/index.ts'

// ------------------------------------------------------------------
// Modifiers (Mutable)
//
// Prioritized types lose `~modifier` properties and additional constraints
// (e.g. additionalProperties) during the mapping phase and need to be
// reassigned afterward. This is a fast mutable assignment to handle that,
// but we should consider a more general solution. (review)
//
// ------------------------------------------------------------------
function Modifiers(type: TSchema, next: TSchema): TSchema {
  for(const key of Guard.Keys(type as Record<PropertyKey, unknown>)) {
    if(Guard.HasPropertyKey(next, key)) continue
    next[key as keyof TSchema] = type[key as keyof TSchema]
  }
  return next
}
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
function FromProperties(properties: TProperties): TProperties {
  const result = {} as TProperties
  for(const key of Guard.Keys(properties)) result[key] = FromType(properties[key])
  return result
}
// ------------------------------------------------------------------
// PriorityTypes
// ------------------------------------------------------------------
function FromPriorityTypes(types: TSchema[]): TSchema[] {
  return FromTypes(Priority(types))
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
function FromTypes(types: TSchema[]): TSchema[] {
  return types.map(type => FromType(type))
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
function FromType(type: TSchema): TSchema {
  const next = (
    IsArray(type) ? _Array_(FromType(type.items), ArrayOptions(type)) :
    IsIntersect(type) ? Intersect(FromTypes(type.allOf)) :
    IsUnion(type) ? Union(FromPriorityTypes(type.anyOf)) :
    IsObject(type) ? _Object_(FromProperties(type.properties)) :
    IsRecord(type) ? Record(RecordKey(type), FromType(RecordValue(type))) :
    IsTuple(type) ? Tuple(FromTypes(type.items)) :
    type
  )
  return Modifiers(type, next)
}
// ------------------------------------------------------------------
// UnionPrioritySort
// ------------------------------------------------------------------
/**
 * (Type-Preprocessor) Recursively reorders Union variants from narrowest to broadest, ensuring
 * more specific types (e.g. Literal) are evaluated before broader types (e.g. String). Used
 * prior to Clean, Decode, and Encode operations.
 */
export function UnionPrioritySort(type: TSchema): TSchema {
  const result = FromType(type)
  return result as never
}