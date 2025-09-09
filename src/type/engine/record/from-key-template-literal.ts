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

import { type TSchema } from '../../types/schema.ts'
import { type TRecord } from '../../types/record.ts'
import { type TFromKey, FromKey } from './from-key.ts'

import { type TParsePatternIntoTypes, ParsePatternIntoTypes } from '../patterns/pattern.ts'
import { type TTemplateLiteralFinite, TemplateLiteralFinite } from '../template-literal/finite.ts'
import { type TTemplateLiteralDecode, TemplateLiteralDecode } from '../template-literal/decode.ts'
import { CreateRecord } from './record-create.ts'

export type TFromTemplateKey<Pattern extends string, Value extends TSchema,
  Types extends TSchema[] = TParsePatternIntoTypes<Pattern>,
  Finite extends boolean = TTemplateLiteralFinite<Types>,
  Result extends TSchema = Finite extends true ? TFromKey<TTemplateLiteralDecode<Pattern>, Value> : TRecord<Pattern, Value>
> = Result
export function FromTemplateKey<Pattern extends string, Value extends TSchema>(pattern: Pattern, value: Value): TFromTemplateKey<Pattern, Value> {
  const types = ParsePatternIntoTypes(pattern)
  const finite = TemplateLiteralFinite(types)
  const result = finite ? FromKey(TemplateLiteralDecode(pattern), value) : CreateRecord(pattern, value)
  return result as never
}