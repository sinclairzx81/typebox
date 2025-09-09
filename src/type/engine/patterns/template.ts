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

import { type TUnreachable, Unreachable } from '../../../system/unreachable/index.ts'

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TTemplateLiteralTypes, TemplateLiteralTypes } from '../../script/parser.ts'

/** Parses a Template into TemplateLiteral types */
export type TParseTemplateIntoTypes<Template extends string,
  Parsed extends [TSchema[], string] | [] = TTemplateLiteralTypes<`\`${Template}\``>,
  Result extends TSchema = Parsed extends [infer Types extends TSchema[], string] 
    ? Types 
    : TUnreachable // []
> = Result
// ------------------------------------------------------------------
// deno-coverage-ignore-start - symmetric unreachable
//
// Parser is parsing regular expression for strings and will return 
// at least 1 TLiteral at a minumum.
//
// ------------------------------------------------------------------
/** Parses a Template into a TemplateLiteral types */
export function ParseTemplateIntoTypes<Template extends string>(template: Template): TParseTemplateIntoTypes<Template> {
  const parsed = TemplateLiteralTypes(`\`${template}\``)
  const result = Guard.IsEqual(parsed.length, 2) 
    ? parsed[0] 
    : Unreachable() // []
  return result as never
}
// deno-coverage-ignore-stop