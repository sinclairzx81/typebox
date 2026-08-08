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

import * as Unicode from './unicode.ts'

// ------------------------------------------------------------------
// Bidi Rule (RFC 5893 §2)
// ------------------------------------------------------------------
export type BidiClass = 'L' | 'R' | 'AL' | 'EN' | 'AN' | 'ES' | 'ET' | 'CS' | 'NSM' | 'BN' | 'ON'
export function GetBidiClass(cp: number): BidiClass {
  if (cp >= 0x0030 && cp <= 0x0039) return 'EN' // ASCII digits
  if (cp >= 0x0660 && cp <= 0x0669) return 'AN' // Arabic-Indic digits
  if (cp >= 0x06f0 && cp <= 0x06f9) return 'EN' // Extended Arabic-Indic digits (per UCD)
  if (cp === 0x002d || cp === 0x002b) return 'ES' // hyphen-minus, plus
  if (cp === 0x002e || cp === 0x002c || cp === 0x003a || cp === 0x002f) return 'CS' // . , : /
  if (Unicode.IsNonspacingMark(cp) || Unicode.IsEnclosingMark(cp)) return 'NSM'
  if (Unicode.IsHebrew(cp)) return 'R'
  if (Unicode.IsArabic(cp) || Unicode.IsSyriac(cp) || Unicode.IsThaana(cp) || Unicode.IsMandaic(cp)) return 'AL'
  if (Unicode.IsLetter(cp)) return 'L'
  return 'ON'
}
// ------------------------------------------------------------------
// ContainsRtlCharacter
//
// Per RFC 5893 §1.4: "An RTL label is a label that contains at least
// one character of type R, AL, or AN." Used to determine whether a
// domain name is a "Bidi domain name" (RFC 5893 §1.4), in which case
// the Bidi Rule applies to every label in the domain.
// ------------------------------------------------------------------
export function ContainsRtlCharacter(value: string): boolean {
  for (const ch of value) {
    const bidiClass = GetBidiClass(ch.codePointAt(0)!)
    if (bidiClass === 'R' || bidiClass === 'AL' || bidiClass === 'AN') return true
  }
  return false
}
// ------------------------------------------------------------------
// Allowed Bidi classes per direction (RFC 5893 §2, rules 2 and 5)
//
// Hoisted to module scope: these sets are fixed by the spec, not
// derived from the input, so there's no reason to reallocate them
// on every SatisfiesBidiRule call.
// ------------------------------------------------------------------
const RTL_ALLOWED = new Set<BidiClass>(['R', 'AL', 'AN', 'EN', 'ES', 'CS', 'ET', 'ON', 'BN', 'NSM'])
const LTR_ALLOWED = new Set<BidiClass>(['L', 'EN', 'ES', 'CS', 'ET', 'ON', 'BN', 'NSM'])
// ------------------------------------------------------------------
// SatisfiesBidiRule
//
// @specification https://tools.ietf.org/html/rfc5893#section-2
// ------------------------------------------------------------------
export function SatisfiesBidiRule(cps: readonly number[]): boolean {
  if (cps.length === 0) return true
  const classes = cps.map(GetBidiClass)
  const first = classes[0]
  // 1. The first character must be a character with Bidi property L, R, or AL.
  if (first !== 'L' && first !== 'R' && first !== 'AL') return false
  const isRtl = first === 'R' || first === 'AL'
  let end = classes.length - 1
  while (end >= 0 && classes[end] === 'NSM') end--
  if (end < 0) return false
  const endClass = classes[end]
  if (isRtl) {
    // 2. In an RTL label, only R, AL, AN, EN, ES, CS, ET, ON, BN, or NSM are allowed.
    if (!classes.every((c) => RTL_ALLOWED.has(c))) return false
    // 3. The end of the label must be R, AL, EN, or AN (ignoring trailing NSM).
    if (endClass !== 'R' && endClass !== 'AL' && endClass !== 'EN' && endClass !== 'AN') return false
    // 4. If an EN is present, no AN may be present, and vice versa.
    if (classes.includes('EN') && classes.includes('AN')) return false
  } else {
    // 5. In an LTR label, only L, EN, ES, CS, ET, ON, BN, or NSM are allowed.
    if (!classes.every((c) => LTR_ALLOWED.has(c))) return false
    // 6. The end of the label must be L or EN (ignoring trailing NSM).
    if (endClass !== 'L' && endClass !== 'EN') return false
  }
  return true
}
