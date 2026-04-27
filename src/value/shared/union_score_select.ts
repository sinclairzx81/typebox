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

import { type TProperties, type TSchema, type TUnion, IsLiteral, IsObject, IsRef } from '../../type/index.ts'
import { Guard } from '../../guard/index.ts'
import { Check } from '../check/index.ts'

// ------------------------------------------------------------------
// Deref
// ------------------------------------------------------------------
function Deref(context: TProperties, type: TSchema, value: unknown): TSchema {
  return IsRef(type)
    ? Guard.HasPropertyKey(context, type.$ref)
      ? Deref(context, context[type.$ref], value)
      : (() => { throw new Error('Unable to Deref target') })()
    : type
}
// ------------------------------------------------------------------
// The following will score a schema against a value. For objects,
// the score is the tally of points awarded for each property of
// the value. Property points are (1.0 / propertyCount) to prevent
// large property counts biasing results. Properties that match
// literal values are maximally awarded as literals are typically
// used as union discriminator fields.
// ------------------------------------------------------------------
function ScoreVariant(context: TProperties, type: TSchema, value: unknown): number {
  // scoring is only possible for object types.
  if(!(IsObject(type) && Guard.IsObject(value))) return 0
  
  const keys = Guard.Keys(value)
  const entries = Guard.Entries(type.properties)
  return entries.reduce((result, [key, schema]) => {
    const literal = IsLiteral(schema) && Guard.IsEqual(schema.const, value[key]) ? 100 : 0
    const checks = Check(context, schema, value[key]) ? 10 : 0
    const exists = keys.includes(key) ? 1 : 0
    return result + (literal + checks + exists)
  }, 0)
}
// ------------------------------------------------------------------
// UnionScoreSelect
// ------------------------------------------------------------------
/** Scores Union variants and returns the best match for the given value */
export function UnionScoreSelect(context: TProperties, type: TUnion, value: unknown): TSchema {
  const schemas = type.anyOf.map((schema) => Deref(context, schema, value))
  let [select, best] = [schemas[0], 0]
  for (const schema of schemas) {
    const score = ScoreVariant(context, schema, value)
    if (score > best) {
      select = schema
      best = score
    }
  }
  return select
}