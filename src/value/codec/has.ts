/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Arguments } from '../../system/arguments/index.ts'
import { Guard } from '../../guard/index.ts'
import { IsCodec } from '../../type/index.ts'

import { type TSchema, type TProperties } from '../../type/index.ts'
import { type TArray, IsArray } from '../../type/index.ts'
import { type TCyclic, IsCyclic } from '../../type/index.ts'
import { type TIntersect, IsIntersect } from '../../type/index.ts'
import { type TObject, IsObject } from '../../type/index.ts' 
import { type TRecord, IsRecord, RecordValue } from '../../type/index.ts' 
import { type TRef, IsRef, Ref } from '../../type/index.ts' 
import { type TTuple, IsTuple } from '../../type/index.ts' 
import { type TUnion, IsUnion } from '../../type/index.ts'

// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
function FromArray(context: TProperties, type: TArray): boolean {
  return IsCodec(type) || FromType(context, type.items)
}
// ------------------------------------------------------------------
// Cyclic
// ------------------------------------------------------------------
function FromCyclic(context: TProperties, type: TCyclic): boolean {
  return IsCodec(type) || FromRef({ ...context, ...type.$defs }, Ref(type.$ref))
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
function FromIntersect(context: TProperties, type: TIntersect): boolean {
  return IsCodec(type) || type.allOf.some((type) => FromType(context, type))
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
function FromObject(context: TProperties, type: TObject): boolean {
  return IsCodec(type) || Guard.Keys(type.properties).some(key => {
    return FromType(context, type.properties[key])
  })
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
function FromRecord(context: TProperties, type: TRecord): boolean {
  return IsCodec(type) || FromType(context, RecordValue(type))
}
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
function FromRef(context: TProperties, type: TRef): boolean {
  if(visited.has(type.$ref)) return false
  visited.add(type.$ref)
  return IsCodec(type) || (Guard.HasPropertyKey(context, type.$ref) 
    && FromType(context, context[type.$ref]))
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
function FromTuple(context: TProperties, type: TTuple): boolean {
  return IsCodec(type) || type.items.some(type => FromType(context, type))
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
function FromUnion(context: TProperties, type: TUnion): boolean {
  return IsCodec(type) || type.anyOf.some(type => FromType(context, type))
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
function FromType(context: TProperties, type: TSchema): boolean {
  return (
    IsArray(type) ? FromArray(context, type) :
    IsCyclic(type) ? FromCyclic(context, type) :
    IsIntersect(type) ? FromIntersect(context, type) :
    IsObject(type) ? FromObject(context, type) :
    IsRecord(type) ? FromRecord(context, type) :
    IsRef(type) ? FromRef(context, type) :
    IsTuple(type) ? FromTuple(context, type) :
    IsUnion(type) ? FromUnion(context, type) :
    IsCodec(type)
  )
}
// ------------------------------------------------------------------
// Visited
// ------------------------------------------------------------------
const visited = new Set<string>()

// ------------------------------------------------------------------
// HasCodec
// ------------------------------------------------------------------
/** Returns true if this type contains a Codec */
export function HasCodec(context: TProperties, type: TSchema): boolean
/** Returns true if this type contains a Codec */
export function HasCodec(type: TSchema): boolean
/** Returns true if this type contains a Codec */
export function HasCodec(...args: unknown[]): boolean {
  const [context, type] = Arguments.Match<[TProperties, TSchema]>(args, {
    2: (context, type) => [context, type],
    1: (type) => [{}, type]
  })
  visited.clear()
  return FromType(context, type)
}