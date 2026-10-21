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

import * as Syntax from '../../syntax/index.ts'
import * as Pattern from '../pattern/pattern.ts'

// ------------------------------------------------------------------
// IsAsciiLdhLabel
//
// RFC 1123 §2.1: hostname labels contain letters, digits, and interior
// hyphens, and must begin and end with a letter or digit.
// ------------------------------------------------------------------
export function IsAsciiLdhLabel(value: string): boolean {
  return value.length > 0 && value.length <= 63 && Syntax.FORMAT_HOST_ASCII_LDH_LABEL.test(value)
}
// -------------------------------------------------------------------
// Validates an ASCII LDH label per RFC 5891 §4.2.3.1
// -------------------------------------------------------------------
export function IsAsciiLabel(value: string): boolean {
  return Pattern.RE_RULE_NOT_RESERVED_ACE.test(value) && IsAsciiLdhLabel(value)
}
