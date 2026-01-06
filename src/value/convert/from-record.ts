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

import type { TSchema, TRecord, TProperties } from '../../type/index.ts'
import { Guard } from '../../guard/index.ts'
import { FromType } from './from-type.ts'
import { FromAdditionalProperties } from './from-additional.ts'

function FromPatternProperties(context: TProperties, type: TRecord, value: Record<PropertyKey, unknown>): unknown {
  const entries = Guard.EntriesRegExp(type.patternProperties) as [RegExp, TSchema][]
  const keys = Guard.Keys(value)
  for(const [regexp, schema] of entries) {
    for(const key of keys) {
      if(regexp.test(key)) {
        value[key] = FromType(context, schema, value[key])
      }
    }
  }
  return (
    Guard.HasPropertyKey(type, 'additionalProperties') && Guard.IsObject(type.additionalProperties)
      ? FromAdditionalProperties(context, entries, type.additionalProperties, value)
      : value
  )
}
export function FromRecord(context: TProperties, type: TRecord, value: unknown): unknown {
  return Guard.IsObjectNotArray(value) 
    ? FromPatternProperties(context, type, value) 
    : value
}