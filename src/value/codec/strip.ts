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

import { Guard } from '../../guard/index.ts'
import { type TSchema, type TProperties } from '../../type/index.ts'
import { IsCodec } from '../../type/index.ts'
import { IsArray, Array as _Array_, ArrayOptions } from '../../type/index.ts'
import { IsObject, Object as _Object_ } from '../../type/index.ts'
import { IsRecord, Record, RecordKey, RecordValue } from '../../type/index.ts'
import { HasCodec } from './has.ts'

// ------------------------------------------------------------------
// Modifiers (Mutable)
//
// Carries `~modifier` / option keys (e.g. Optional, $id, additionalProperties)
// from the source node onto the rebuilt node — they would otherwise be lost by
// the constructor mapping. Mirrors the same helper in union_priority_sort.
// ------------------------------------------------------------------
function Modifiers(type: TSchema, next: TSchema): TSchema {
  for (const key of Guard.Keys(type as Record<PropertyKey, unknown>)) {
    if (Guard.HasPropertyKey(next, key)) continue
    next[key as keyof TSchema] = type[key as keyof TSchema]
  }
  return next
}
// ------------------------------------------------------------------
// Properties
//
// Keeps only codec-bearing properties; the codec walk never touches the rest,
// so dropping them prunes the walk to codec paths.
// ------------------------------------------------------------------
function FromProperties(context: TProperties, properties: TProperties): TProperties {
  const result = {} as TProperties
  for (const key of Guard.Keys(properties)) {
    if (HasCodec(context, properties[key])) result[key] = FromType(context, properties[key])
  }
  return result
}
// ------------------------------------------------------------------
// Type
//
// Object/Array/Record are pruned to codec-bearing children. Codec leaves and
// Union/Intersect/Tuple/Ref/Cyclic (and any other kind) are kept intact: the
// codec walk relies on Union/Intersect discrimination and Tuple positions, so
// they are only ever reached here when they contain a codec (a codec-free one
// is dropped by its parent's FromProperties) and must be preserved whole.
// ------------------------------------------------------------------
function FromType(context: TProperties, type: TSchema): TSchema {
  if (IsCodec(type)) return type
  const next = (
    IsArray(type) ? _Array_(FromType(context, type.items), ArrayOptions(type)) :
    IsObject(type) ? _Object_(FromProperties(context, type.properties)) :
    IsRecord(type) ? Record(RecordKey(type), FromType(context, RecordValue(type))) :
    type
  )
  return Modifiers(type, next)
}
// ------------------------------------------------------------------
// StripToCodec
// ------------------------------------------------------------------
/**
 * (Type-Preprocessor) Returns a schema reduced to its codec-bearing paths.
 * Object/Array/Record children with no codec are removed; the codec walk leaves
 * such subtrees unchanged anyway, so running it on the stripped schema produces
 * identical output while skipping the codec-free majority of the tree. Used
 * prior to the Decode/Encode codec walk (DecodeUnsafe / EncodeUnsafe).
 */
export function StripToCodec(context: TProperties, type: TSchema): TSchema {
  return FromType(context, type)
}
