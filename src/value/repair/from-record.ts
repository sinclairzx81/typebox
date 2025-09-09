/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

import { IsAdditionalProperties } from '../../schema/types/index.ts'

import { type TProperties, type TRecord, RecordValue, RecordPattern } from '../../type/index.ts'
import { Guard } from '../../guard/index.ts'
import { Create } from '../create/index.ts'
import { Check } from '../check/index.ts'
import { FromType } from './from-type.ts'

export function FromRecord(context: TProperties, type: TRecord, value: unknown): unknown {
  if (Check(context, type, value)) return value
  if (Guard.IsNull(value) || !Guard.IsObject(value) || Guard.IsArray(value)) return Create(context, type)
  const recordKey = new RegExp(RecordPattern(type))
  const recordValue = RecordValue(type)
  const evaluatedKeys = new Set<string>()
  // PatternProperties
  const result = {} as Record<string, any>
  for (const [key, value_] of Guard.Entries(value)) {
    if(!recordKey.test(key)) continue
    result[key] = FromType(context, recordValue, value_)
    evaluatedKeys.add(key)
  }
  // AdditionalProperties
  if (IsAdditionalProperties(type)) {
    for (const key of Guard.Keys(value)) {
      if (evaluatedKeys.has(key)) continue
      result[key] = FromType(context, type.additionalProperties, value[key])
    }
  }
  return result
}