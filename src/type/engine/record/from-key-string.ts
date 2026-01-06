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

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TRecord, StringKey } from '../../types/record.ts'
import { type TString } from '../../types/string.ts'
import { CreateRecord } from './record-create.ts'

export type TFromStringKey<_Key extends TSchema, Value extends TSchema,
  Result extends TSchema = TRecord<typeof StringKey, Value>
> = Result
export function FromStringKey<Key extends TString, Value extends TSchema>(key: Key, value: Value): TFromStringKey<Key, Value> {
  // special case: override for string with raw pattern. We do not observe inference for the
  // raw string patterns, but as a pattern (assuming non-never) is in the set of string, we
  // allow overriding. Callers will need to narrow to the pattern manually. TB legacy.
  return (
    Guard.HasPropertyKey(key, 'pattern') && (Guard.IsString(key.pattern) || key.pattern instanceof RegExp)
      ? CreateRecord(key.pattern.toString(), value)
      : CreateRecord(StringKey, value) as never
  ) as never
}