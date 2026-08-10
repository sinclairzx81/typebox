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

import * as FormatBidi from './format/bidi.ts'
import * as LabelUnicode from './label/unicode.ts'
import * as LabelPuny from './label/puny.ts'

function IsValidLabelLength(value: string): boolean {
  return value.length > 0 && value.length <= 63
}
function IsLabel(value: string): boolean {
  return IsValidLabelLength(value) && (
    LabelPuny.IsPunyLabel(value) ||
    LabelUnicode.IsUnicodeLabel(value)
  )
}
function NormalizeHostname(value: string): string {
  return value.normalize('NFC').replace(/[\u002E\u3002\uFF0E\uFF61]/g, '.')
}
export function IsIdnHostname(value: string): boolean {
  if (value.length === 0 || value.includes(' ')) return false
  const normalized = NormalizeHostname(value)
  if (normalized.length > 253) return false
  const labels = normalized.split('.')
  const hasBidiChars = labels.some((label) => FormatBidi.HasBidiChars(label))
  return labels.every((label) => IsLabel(label) && (!hasBidiChars || FormatBidi.SatisfiesBidiRule(label)))
}
