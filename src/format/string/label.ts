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

import * as Puny from './puny.ts'
import { IsPuny, IsPunyLabel } from './label-puny.ts'
import { IsUnicodeLabel } from './label-unicode.ts'

// ------------------------------------------------------------------
// ContainsNonAscii
//
// Code-unit level check (not codepoint-level): tests UTF-16 units
// above \u007F. Supplementary-plane characters still match because
// both halves of a surrogate pair fall in this range individually -
// no need to decode codepoints just to answer a yes/no question.
// ------------------------------------------------------------------
function ContainsNonAscii(value: string): boolean {
  return /[\u0080-\uffff]/.test(value)
}
// ------------------------------------------------------------------
// IsValidLabelLength
// ------------------------------------------------------------------
function IsValidLabelLength(value: string): boolean {
  return value.length > 0 && value.length <= 63
}
// ------------------------------------------------------------------
// IsValidPunyForm
//
// The label is already an A-label (xn--...) - delegate entirely to
// IsPunyLabel, which decodes and validates it.
// ------------------------------------------------------------------
function IsValidPunyForm(value: string, isBidiDomain: boolean): boolean {
  return IsPuny(value) && IsPunyLabel(value, isBidiDomain)
}
// ------------------------------------------------------------------
// IsValidUnicodeForm
//
// The label is a raw Unicode string. RFC 5891 §4.2.4 - the 63-octet
// limit applies to the A-label (encoded) form, not the raw code point
// count, so non-ASCII labels get a second length check against what
// they would encode to.
// ------------------------------------------------------------------
function IsValidUnicodeForm(value: string, isBidiDomain: boolean): boolean {
  if (!IsUnicodeLabel(value, isBidiDomain)) return false
  if (ContainsNonAscii(value) && Puny.Encode(value).length + 4 > 63) return false
  return true
}
// ------------------------------------------------------------------
// IsIdnLabel
// ------------------------------------------------------------------
export function IsIdnLabel(value: string, isBidiDomain: boolean = false): boolean {
  return IsValidLabelLength(value) && (
    IsValidPunyForm(value, isBidiDomain) ||
    IsValidUnicodeForm(value, isBidiDomain)
  )
}
