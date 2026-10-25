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

import { Unreachable } from '../../system/unreachable/index.ts'
import * as Type from '../../type/index.ts'
import { FromType } from './from_type.ts'

const backtick = '`'

// ------------------------------------------------------------------
// Interpolate
// ------------------------------------------------------------------
function Interpolate(inner: string): string {
  return '${' + inner + '}'
}
// ------------------------------------------------------------------
// EscapeTemplateText
// ------------------------------------------------------------------
function EscapeTemplateText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')    // backslash first, so later escapes aren't double escaped
    .replace(/`/g, '\\`')      // backtick would terminate the template
    .replace(/\$\{/g, '\\${')  // would open an interpolation
    .replace(/\r/g, '\\r')     // raw CR is normalized to LF inside template literals
    .replace(/\n/g, '\\n')
}
// ------------------------------------------------------------------
// FromTemplateType
// ------------------------------------------------------------------
function FromTemplateType(context: Type.TProperties, type: Type.TSchema): string {
  // deno-coverage-ignore-start - unreachable
  return (
    Type.IsLiteral(type) ? EscapeTemplateText(String(type.const)) :
    Type.IsString(type) ? Interpolate('string') :
    Type.IsNumber(type) ? Interpolate('number') :
    Type.IsUnion(type) ? Interpolate(FromType(context, type)) :
    Unreachable()
  )
  // deno-coverage-ignore-stop
}
// ------------------------------------------------------------------
// FromTemplateLiteral
// ------------------------------------------------------------------
export function FromTemplateLiteral(context: Type.TProperties, type: Type.TTemplateLiteral): string {
  const types = Type.ParsePatternIntoTypes(type.pattern) as Type.TSchema[]
  return `${backtick}${types.map(part => FromTemplateType(context, part)).join('')}${backtick}`
}
