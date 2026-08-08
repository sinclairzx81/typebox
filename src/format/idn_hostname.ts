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

import { ContainsRtlCharacter, GetIdnLabelUnicodeForm, IsIdnLabel } from './_idna.ts'

/**
 * Returns true if the value is a valid internationalized (IDN) hostname.
 * @specification https://tools.ietf.org/html/rfc3490
 * @specification https://tools.ietf.org/html/rfc5891
 * @specification https://tools.ietf.org/html/rfc5892
 * @specification https://tools.ietf.org/html/rfc5893
 */
export function IsIdnHostname(value: string): boolean {
  if (value.length === 0 || value.includes(' ')) return false
  const canonical = value.normalize('NFC').replace(/[\u002E\u3002\uFF0E\uFF61]/g, '.')
  if (canonical.length > 253) return false
  const labels = canonical.split('.')
  // RFC 5893 §1.4: a "Bidi domain name" is a domain name that contains at
  // least one RTL label. Once that's true, the Bidi Rule (§2) must be
  // satisfied by every label in the domain, not only the RTL ones.
  const isBidiDomain = labels.some((label) => {
    const unicodeForm = GetIdnLabelUnicodeForm(label)
    return unicodeForm !== null && ContainsRtlCharacter(unicodeForm)
  })
  for (const label of labels) {
    if (!IsIdnLabel(label, isBidiDomain)) return false
  }
  return true
}
