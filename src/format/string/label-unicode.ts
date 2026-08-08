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

import { Unreachable } from '../../system/unreachable/index.ts'
import { SatisfiesBidiRule } from './bidi.ts'
import * as Unicode from './unicode.ts'

// ------------------------------------------------------------------
// IsUnicodeLabel
//
// The isBidiDomain flag is threaded through from the caller: RFC 5893
// only requires the Bidi Rule once *any* label in the domain is RTL,
// which is why this stays a parameter rather than something computed
// locally per-label (see bidi-label.ts / puny-label.ts for how the
// caller determines it).
// ------------------------------------------------------------------
export function IsUnicodeLabel(value: string, isBidiDomain: boolean = false): boolean {
  // deno-coverage-ignore-start - unable to reach via format guards
  if (value.length === 0) return Unreachable() // false
  // deno-coverage-ignore-stop

  // Use spread to handle surrogate pairs and provide O(1) neighbor access
  const cps = [...value].map((c) => c.codePointAt(0)!)
  const len = cps.length
  // RFC 5891 §4.2.3.2: Hyphen rules
  if (cps[0] === 0x2d || cps[len - 1] === 0x2d) return false
  if (len >= 4 && cps[2] === 0x2d && cps[3] === 0x2d) return false
  // RFC 5891 §4.2.3.2 - Must not begin with a combining mark
  if (Unicode.IsCombiningMark(cps[0])) return false
  let hasJapanese = false
  let hasArabicIndic = false
  let hasExtendedArabicIndic = false
  for (let i = 0; i < len; i++) {
    const cp = cps[i]
    // 1. DISALLOWED exceptions
    if (Unicode.RFC5892_DISALLOWED.has(cp)) return false
    // 1b. General category (PVALID) enforcement
    if (!Unicode.IsPermittedCategory(cp)) return false
    // 2. Collect Flags
    if (Unicode.IsHiragana(cp) || Unicode.IsKatakana(cp) || Unicode.IsHan(cp)) hasJapanese = true
    if (Unicode.IsArabicIndicDigit(cp)) hasArabicIndic = true
    if (Unicode.IsExtendedArabicIndicDigit(cp)) hasExtendedArabicIndic = true
    // 3. CONTEXTO / CONTEXTJ Neighbor Rules
    const prev = cps[i - 1], next = cps[i + 1]
    switch (cp) {
      case 0x00b7:
        if (prev !== 0x006c || next !== 0x006c) return false
        break // MIDDLE DOT (Catalan)
      case 0x0375:
        if (next === undefined || !Unicode.IsGreek(next)) return false
        break // Greek KERAIA
      case 0x05f3:
      case 0x05f4:
        if (prev === undefined || !Unicode.IsHebrew(prev)) return false
        break // Hebrew GERESH
      case 0x200c: // ZWNJ - RFC 5892 Appendix A.1
        // Note: Full validation requires a Unicode joining type table. We reject
        // only when preceded by ASCII (U+0000-U+007F), which can never satisfy
        // the Virama or cursive-joining rules.
        if (prev === undefined || (prev < 0x0080 && !Unicode.IsVirama(prev))) return false
        break
      case 0x200d: // ZWJ  - RFC 5892 Appendix A.2
        if (prev === undefined || !Unicode.IsVirama(prev)) return false
        break
      case 0x30fb: /* Checked at end via hasJapanese */
        break // KATAKANA MIDDLE DOT
    }
  }
  // 4. Global Context Validations (Post-loop)
  // RFC 5892 Appendix A.7 - Katakana Middle Dot requirement
  if (value.includes('\u30fb') && !hasJapanese) return false
  // RFC 5892 Appendix A.8/A.9 - Mixing Arabic Digits
  if (hasArabicIndic && hasExtendedArabicIndic) return false
  // RFC 5893 - Bidi Rule (applies to every label once the domain is Bidi)
  if (isBidiDomain && !SatisfiesBidiRule(cps)) return false
  return true
}
