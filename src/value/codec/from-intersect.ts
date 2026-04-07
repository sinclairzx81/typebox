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
import { type TIntersect, type TProperties } from '../../type/index.ts'
import { FromType } from './from-type.ts'
import { Callback } from './callback.ts'
import { Clone } from '../clone/index.ts'
import { Clean } from '../clean/index.ts'

// ------------------------------------------------------------------
// MergeInteriors
//
// Merges all interior operand results into a single object. Each
// subsequent operand's properties override those of prior operands.
//
// ------------------------------------------------------------------
function MergeInteriors(interiors: Record<PropertyKey, unknown>[]): unknown {
  return interiors.reduce((results, interior) => ({ ...results, ...interior }), {})
}
// ------------------------------------------------------------------
// NonMatchingInterior
//
// Used when Intersect operands do not all produce Objects. Returns
// the first interior result that differs from the original value,
// indicating a Codec has transformed the data. If no operand
// produced a change, defaults to the first interior result.
//
// ------------------------------------------------------------------
function NonMatchingInterior(value: unknown, interiors: unknown[]) {
  for (const interior of interiors) if (!Guard.IsDeepEqual(value, interior)) return interior
  return value // value-unchanged
}
// ------------------------------------------------------------------
// Decode
// ------------------------------------------------------------------
function Decode(direction: string, context: TProperties, type: TIntersect, value: unknown): unknown {
  if (Guard.IsEqual(type.allOf.length, 0)) return Callback(direction, context, type, value)
  const interiors = type.allOf.map((schema) => FromType(direction, context, schema, Clean(schema, Clone(value))))
  const structural = interiors.every((result) => Guard.IsObject(result))
  const exterior = structural ? MergeInteriors(interiors) : NonMatchingInterior(value, interiors)
  return Callback(direction, context, type, exterior)
}
// ------------------------------------------------------------------
// Encode
// ------------------------------------------------------------------
function Encode(direction: string, context: TProperties, type: TIntersect, value: unknown): unknown {
  if (Guard.IsEqual(type.allOf.length, 0)) return Callback(direction, context, type, value)
  const exterior = Callback(direction, context, type, value)
  const interiors = type.allOf.map((schema) => FromType(direction, context, schema, Clean(schema, Clone(exterior))))
  const structural = interiors.every((result) => Guard.IsObject(result))
  if (structural) return MergeInteriors(interiors)
  return NonMatchingInterior(exterior, interiors)
}
export function FromIntersect(direction: string, context: TProperties, type: TIntersect, value: unknown): unknown {
  return Guard.IsEqual(direction, 'Decode') ? Decode(direction, context, type, value) : Encode(direction, context, type, value)
}
