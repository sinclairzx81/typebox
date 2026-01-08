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
import { type TPattern, Pattern } from '../../script/parser.ts'

/** Parses a Pattern into a sequence of TemplateLiteral types */
export type TParsePatternIntoTypes<Pattern extends string,
  Parsed extends [TSchema[], string] | [] = TPattern<Pattern>,
  Result extends TSchema[] = Parsed extends [infer Types extends TSchema[], string] 
    ? Types 
    : [] // not a valid patterh
> = Result
/** Parses a Pattern into a sequence of TemplateLiteral types */
export function ParsePatternIntoTypes<Pattern extends string>(pattern: Pattern): TParsePatternIntoTypes<Pattern> {
  const parsed = Pattern(pattern)
  const result = Guard.IsEqual(parsed.length, 2) 
    ? parsed[0] 
    : [] // not a valid patterh
  return result as never
}

