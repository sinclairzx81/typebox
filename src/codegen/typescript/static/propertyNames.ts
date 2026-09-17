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

import * as Schema from '../../../schema/index.ts'
import { StaticSchema } from './schema.ts'

// ------------------------------------------------------------------
// REVIEW: SHOULD USE TYPE.* NUMERIC and STRING PATTERNS
// ------------------------------------------------------------------
const StringLiteralPattern = /^".*"$/
const NumericLiteralPattern = /^-?\d+(\.\d+)?$/
function IsStringLiteral(value: string): boolean {
  return StringLiteralPattern.test(value)
}
function IsNumericLiteral(value: string): boolean {
  return NumericLiteralPattern.test(value)
}
// ------------------------------------------------------------------
// Utility: PropertyKey-compatibility check
// ------------------------------------------------------------------
function IsPropertyKeyMember(member: string): boolean {
  const trimmed = member.trim()
  return (
    trimmed === 'string' ||
    trimmed === 'number' ||
    trimmed === 'symbol' ||
    IsStringLiteral(trimmed) ||
    IsNumericLiteral(trimmed)
  )
}
function IsPropertyKeyLike(staticKey: string): boolean {
  return staticKey.split('|').every((member) => IsPropertyKeyMember(member))
}
// ------------------------------------------------------------------
// XStaticPropertyNames
// ------------------------------------------------------------------
export function StaticPropertyNames(stack: string[], root: Schema.XSchema, schema: Schema.XSchema): string {
  const staticKey = StaticSchema([...stack], root, schema)
  return IsPropertyKeyLike(staticKey) ? `{ [Key in ${staticKey}]?: unknown }` : '{}'
}
