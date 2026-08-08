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

// ------------------------------------------------------------------
// IsAsciiLabel
//
// No dependency on general-category or bidi logic - a plain ASCII
// LDH (Letter-Digit-Hyphen) label check per RFC 5891 §4.2.3.1.
// ------------------------------------------------------------------
export function IsAsciiLabel(value: string): boolean {
  // Must not start or end with a hyphen
  if (value.charCodeAt(0) === 45 || value.charCodeAt(value.length - 1) === 45) return false
  // RFC 5891 §4.2.3.1 : "--" at positions 3-4 is reserved for A-labels only
  if (value.length >= 4 && value.charCodeAt(2) === 45 && value.charCodeAt(3) === 45) return false
  // All characters must be alphanumeric or hyphen
  for (let i = 0; i < value.length; i++) {
    const ch = value.charCodeAt(i)
    if (
      !(
        (ch >= 97 && ch <= 122) || // a-z
        (ch >= 65 && ch <= 90) || // A-Z
        (ch >= 48 && ch <= 57) || // 0-9
        ch === 45 // '-'
      )
    ) return false
  }

  return true
}
