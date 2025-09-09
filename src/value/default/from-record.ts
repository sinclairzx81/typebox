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
// deno-lint-ignore-file

import { type TProperties, type TRecord, RecordPattern, RecordValue } from '../../type/index.ts'
import { IsAdditionalProperties, IsDefault } from '../../schema/types/index.ts'

import { Guard } from '../../guard/index.ts'
import { FromDefault } from './from-default.ts'
import { FromType } from './from-type.ts'

export function FromRecord(context: TProperties, type: TRecord, value: unknown): unknown {
  if (!Guard.IsObject(value)) return value
  // PatternProperties
  const [recordKey, recordValue] = [new RegExp(RecordPattern(type)), RecordValue(type)]
  for (const key of Guard.Keys(value)) {
    if (!(recordKey.test(key) && IsDefault(recordValue))) continue
    value[key] = FromType(context, recordValue, value[key])
  }
  // AdditionalProperties
  if (!IsAdditionalProperties(type)) return value
  for (const key of Guard.Keys(value)) {
    if (recordKey.test(key)) continue
    value[key] = FromType(context, type.additionalProperties, value[key])
  }
  return value
}