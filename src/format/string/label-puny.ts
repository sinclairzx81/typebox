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
import { IsUnicodeLabel } from './label-unicode.ts'

// ------------------------------------------------------------------
// IsPuny
// ------------------------------------------------------------------
export function IsPuny(value: string): boolean {
  return value.toLowerCase().startsWith('xn--')
}
// ------------------------------------------------------------------
// IsPunyLabel
// ------------------------------------------------------------------
export function IsPunyLabel(value: string, isBidiDomain: boolean = false): boolean {
  try {
    const payload = value.slice(4).toLowerCase()
    // 1. Structural Validation (RFC 3492 syntax)
    //
    // If the payload contains a hyphen, it MUST be a delimiter separating basic
    // ASCII characters from the variable-length integers. A payload consisting
    // of ONLY a hyphen or starting with multiple hyphens without basic ASCII
    // characters (like "-9uc") is fundamentally malformed.
    //
    const lastHyphen = payload.lastIndexOf('-')
    if (lastHyphen === 0) {
      // Catches "-9uc" right here because the delimiter is at index 0, meaning 0
      // basic ASCII characters preceded it, which is non-canonical.
      return false
    }
    // 2. Decode the payload
    const decoded = Puny.Decode(payload)
    if (!decoded) return false
    // 2b. RFC 5890 §2.3.2.1 - a U-label (and therefore a valid A-label) must
    // contain at least one non-ASCII character. An A-label that decodes to
    // pure ASCII was never a legitimate A-label to begin with.
    if ([...decoded].every((c) => c.codePointAt(0)! < 0x80)) return false
    // 3. Validate the output rules against RFC 5892 / RFC 5893
    return IsUnicodeLabel(decoded, isBidiDomain)
  } catch {
    return false
  }
}
// ------------------------------------------------------------------
// GetIdnLabelUnicodeForm
//
// Returns the Unicode form of a label: the label itself if it's
// already Unicode, or its decoded form if it's an A-label (xn--...).
// Returns null if the label is a malformed A-label that can't be
// decoded. Used to pre-scan a domain name to determine whether it is
// a "Bidi domain name" (RFC 5893 §1.4) before validating any label
// (see bidi-label.ts).
// ------------------------------------------------------------------
export function GetIdnLabelUnicodeForm(value: string): string | null {
  if (!IsPuny(value)) return value
  try {
    const payload = value.slice(4).toLowerCase()
    if (payload.lastIndexOf('-') === 0) return null
    const decoded = Puny.Decode(payload)
    return decoded || null
  } catch {
    return null
  }
}
