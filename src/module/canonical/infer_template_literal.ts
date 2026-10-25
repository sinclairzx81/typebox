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
import * as Schema from '../../schema/index.ts'
import * as Type from '../../type/index.ts'

// ------------------------------------------------------------------
// IsRegExpPattern
// ------------------------------------------------------------------
const RegExpCharacters = /[\\^$.*+?()[\]{}|]/

function IsRegExpValid(pattern: string): boolean {
  try { new RegExp(pattern); return true } catch { return false }
}
function IsRegExpPattern(pattern: string): boolean {
  return RegExpCharacters.test(pattern) && IsRegExpValid(pattern)
}
// ------------------------------------------------------------------
// IsTemplateLiteralPattern
// ------------------------------------------------------------------
function IsTemplateLiteralPattern(pattern: string) {
  return !Guard.IsEqual(Type.ParsePatternIntoTypes(pattern).length, 0)
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export type XTemplateLiteralLike = { pattern: string }
export function IsTemplateLiteralLike(schema: Schema.XSchema): schema is XTemplateLiteralLike {
  return Guard.IsObject(schema) 
    && Schema.IsPattern(schema)
    && Guard.IsString(schema.pattern)
}
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferTemplateLiteral(_stack: Schema.XStack, schema: XTemplateLiteralLike): Type.TSchema {
  return (
    IsTemplateLiteralPattern(schema.pattern) ? Type.TemplateLiteralCreate(schema.pattern) :
    IsRegExpPattern(schema.pattern) ? Type.String() :
    Type.Literal(schema.pattern)
  )
}