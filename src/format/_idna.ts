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

import { Unreachable } from '../system/unreachable/index.ts'
import * as Puny from './_puny.ts'

// ------------------------------------------------------------------
// Unicode General Category Helper (RFC 5892)
// ------------------------------------------------------------------
function IsNonspacingMark(cp: number): boolean {
  return /\p{Mn}/u.test(String.fromCodePoint(cp))
}
function IsSpacingCombiningMark(cp: number): boolean {
  return /\p{Mc}/u.test(String.fromCodePoint(cp))
}
function IsEnclosingMark(cp: number): boolean {
  return /\p{Me}/u.test(String.fromCodePoint(cp))
}
function IsCombiningMark(cp: number): boolean {
  return IsNonspacingMark(cp) || IsSpacingCombiningMark(cp) || IsEnclosingMark(cp)
}
// ------------------------------------------------------------------
// RFC 5892 §2.6 DISALLOWED exceptions
//
// https://tools.ietf.org/html/rfc5892#section-2.6
// ------------------------------------------------------------------
const RFC5892_DISALLOWED = new Set([
  0x0640, // ARABIC TATWEEL
  0x07fa, // NKO LAJANYALAN
  0x302e, // HANGUL SINGLE DOT TONE MARK
  0x302f, // HANGUL DOUBLE DOT TONE MARK
  0x3031, // VERTICAL KANA REPEAT MARK
  0x3032, // VERTICAL KANA REPEAT WITH VOICED ITERATION MARK
  0x3033, // VERTICAL KANA REPEAT MARK UPPER HALF
  0x3034, // VERTICAL KANA REPEAT WITH VOICED ITERATION MARK UPPER HALF
  0x3035, // VERTICAL KANA REPEAT MARK LOWER HALF
  0x303b // VERTICAL IDEOGRAPHIC ITERATION MARK
])
// ------------------------------------------------------------------
// A set of Virama (halant) code points used to validate CONTEXTJ
// rules (RFC 5892 Appendix A.1). These characters allow a subsequent
// Zero Width Non-Joiner (U+200C) or Zero Width Joiner (U+200D) to
// be valid in a label.
// ------------------------------------------------------------------
const VIRAMA_CPS = new Set<number>([
  0x094d,
  0x09cd,
  0x0a4d,
  0x0acd,
  0x0b4d,
  0x0bcd,
  0x0c4d,
  0x0ccd,
  0x0d3b,
  0x0d3c,
  0x0d4d,
  0x0dca,
  0x1b44,
  0x1baa,
  0x1bab,
  0xa9c0,
  0x11046,
  0x1107f,
  0x110b9,
  0x11133,
  0x11134,
  0x111c0,
  0x11235,
  0x1134d,
  0x11442,
  0x114c2,
  0x115bf,
  0x1163f,
  0x116b6,
  0x11c3f,
  0x11d44,
  0x11d45
])
// ------------------------------------------------------------------
// Guards for CONTEXTO rules (RFC 5892 Appendix A)
// ------------------------------------------------------------------
function IsGreek(cp: number): boolean {
  return /\p{Script=Greek}/u.test(String.fromCodePoint(cp))
}
function IsHebrew(cp: number): boolean {
  return /\p{Script=Hebrew}/u.test(String.fromCodePoint(cp))
}
function IsHiragana(cp: number): boolean {
  return /\p{Script=Hiragana}/u.test(String.fromCodePoint(cp))
}
function IsKatakana(cp: number): boolean {
  return /\p{Script=Katakana}/u.test(String.fromCodePoint(cp))
}
function IsHan(cp: number): boolean {
  return /\p{Script=Han}/u.test(String.fromCodePoint(cp))
}
function IsArabicIndicDigit(cp: number): boolean {
  return cp >= 0x0660 && cp <= 0x0669
}
function IsExtendedArabicIndicDigit(cp: number): boolean {
  return cp >= 0x06f0 && cp <= 0x06f9
}
function IsVirama(cp: number): boolean {
  return VIRAMA_CPS.has(cp)
}
// ------------------------------------------------------------------
// General Category Enforcement (RFC 5892 §2 PVALID)
//
// A label may only contain letters, marks, decimal digits, the
// hyphen (LDH), and the small set of CONTEXTO exception characters
// that are separately validated by their neighbor rules above. Any
// other general category (punctuation, symbols, etc.) is DISALLOWED.
// ------------------------------------------------------------------
const CONTEXTO_EXCEPTIONS = new Set([0x00b7, 0x0375, 0x05f3, 0x05f4, 0x200c, 0x200d, 0x30fb])
// RFC 5892 §2.6 - PVALID exceptions: unconditionally permitted regardless of
// general category (some, like U+00DF and U+03C2, are already letters and
// listed here for documentation; others, like U+0F0B (Po), U+3007 (Nl), and
// U+06FD/U+06FE (So), are not covered by the letter/mark/digit categories
// below and would otherwise be rejected).
const PVALID_EXCEPTIONS = new Set([0x00df, 0x03c2, 0x06fd, 0x06fe, 0x0f0b, 0x3007])
function IsPermittedCategory(cp: number): boolean {
  if (cp === 0x002d) return true // '-' LDH hyphen
  if (CONTEXTO_EXCEPTIONS.has(cp)) return true
  if (PVALID_EXCEPTIONS.has(cp)) return true
  const ch = String.fromCodePoint(cp)
  return /\p{L}/u.test(ch) || /\p{Mn}/u.test(ch) || /\p{Mc}/u.test(ch) || /\p{Nd}/u.test(ch)
}
// ------------------------------------------------------------------
// Bidi Rule (RFC 5893 §2)
// ------------------------------------------------------------------
type BidiClass = 'L' | 'R' | 'AL' | 'EN' | 'AN' | 'ES' | 'ET' | 'CS' | 'NSM' | 'BN' | 'ON'
function GetBidiClass(cp: number): BidiClass {
  if (cp >= 0x0030 && cp <= 0x0039) return 'EN' // ASCII digits
  if (cp >= 0x0660 && cp <= 0x0669) return 'AN' // Arabic-Indic digits
  if (cp >= 0x06f0 && cp <= 0x06f9) return 'EN' // Extended Arabic-Indic digits (per UCD)
  if (cp === 0x002d || cp === 0x002b) return 'ES' // hyphen-minus, plus
  if (cp === 0x002e || cp === 0x002c || cp === 0x003a || cp === 0x002f) return 'CS' // . , : /
  const ch = String.fromCodePoint(cp)
  if (/\p{Mn}/u.test(ch) || /\p{Me}/u.test(ch)) return 'NSM'
  if (/\p{Script=Hebrew}/u.test(ch)) return 'R'
  if (
    /\p{Script=Arabic}/u.test(ch) ||
    /\p{Script=Syriac}/u.test(ch) ||
    /\p{Script=Thaana}/u.test(ch) ||
    /\p{Script=Mandaic}/u.test(ch)
  ) return 'AL'
  if (/\p{L}/u.test(ch)) return 'L'
  return 'ON'
}
// ------------------------------------------------------------------
// ContainsRtlCharacter
//
// Per RFC 5893 §1.4: "An RTL label is a label that contains at least
// one character of type R, AL, or AN." Used to determine whether a
// domain name is a "Bidi domain name" (RFC 5893 §1.4), in which case
// the Bidi Rule below applies to every label in the domain.
// ------------------------------------------------------------------
export function ContainsRtlCharacter(value: string): boolean {
  for (const ch of value) {
    const bidiClass = GetBidiClass(ch.codePointAt(0)!)
    if (bidiClass === 'R' || bidiClass === 'AL' || bidiClass === 'AN') return true
  }
  return false
}
// ------------------------------------------------------------------
// SatisfiesBidiRule
//
// @specification https://tools.ietf.org/html/rfc5893#section-2
// ------------------------------------------------------------------
function SatisfiesBidiRule(cps: readonly number[]): boolean {
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
    const allowed = new Set<BidiClass>(['R', 'AL', 'AN', 'EN', 'ES', 'CS', 'ET', 'ON', 'BN', 'NSM'])
    if (!classes.every((c) => allowed.has(c))) return false
    // 3. The end of the label must be R, AL, EN, or AN (ignoring trailing NSM).
    if (endClass !== 'R' && endClass !== 'AL' && endClass !== 'EN' && endClass !== 'AN') return false
    // 4. If an EN is present, no AN may be present, and vice versa.
    if (classes.includes('EN') && classes.includes('AN')) return false
  } else {
    // 5. In an LTR label, only L, EN, ES, CS, ET, ON, BN, or NSM are allowed.
    const allowed = new Set<BidiClass>(['L', 'EN', 'ES', 'CS', 'ET', 'ON', 'BN', 'NSM'])
    if (!classes.every((c) => allowed.has(c))) return false
    // 6. The end of the label must be L or EN (ignoring trailing NSM).
    if (endClass !== 'L' && endClass !== 'EN') return false
  }
  return true
}
// ------------------------------------------------------------------
// IsUnicodeLabel
// ------------------------------------------------------------------
function IsUnicodeLabel(value: string, isBidiDomain: boolean = false): boolean {
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
  if (IsCombiningMark(cps[0])) return false
  let hasJapanese = false
  let hasArabicIndic = false
  let hasExtendedArabicIndic = false
  for (let i = 0; i < len; i++) {
    const cp = cps[i]
    // 1. DISALLOWED exceptions
    if (RFC5892_DISALLOWED.has(cp)) return false
    // 1b. General category (PVALID) enforcement
    if (!IsPermittedCategory(cp)) return false
    // 2. Collect Flags
    if (IsHiragana(cp) || IsKatakana(cp) || IsHan(cp)) hasJapanese = true
    if (IsArabicIndicDigit(cp)) hasArabicIndic = true
    if (IsExtendedArabicIndicDigit(cp)) hasExtendedArabicIndic = true
    // 3. CONTEXTO / CONTEXTJ Neighbor Rules
    const prev = cps[i - 1], next = cps[i + 1]
    switch (cp) {
      case 0x00b7:
        if (prev !== 0x006c || next !== 0x006c) return false
        break // MIDDLE DOT (Catalan)
      case 0x0375:
        if (next === undefined || !IsGreek(next)) return false
        break // Greek KERAIA
      case 0x05f3:
      case 0x05f4:
        if (prev === undefined || !IsHebrew(prev)) return false
        break // Hebrew GERESH
      case 0x200c: // ZWNJ - RFC 5892 Appendix A.1
        // Note: Full validation requires a Unicode joining type table. We reject
        // only when preceded by ASCII (U+0000-U+007F), which can never satisfy
        // the Virama or cursive-joining rules.
        if (prev === undefined || (prev < 0x0080 && !IsVirama(prev))) return false
        break
      case 0x200d: // ZWJ  - RFC 5892 Appendix A.2
        if (prev === undefined || !IsVirama(prev)) return false
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
// ------------------------------------------------------------------
// IsAsciiLabel
// ------------------------------------------------------------------
function IsAsciiLabel(value: string): boolean {
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
// ------------------------------------------------------------------
// IsPunyLabel
// ------------------------------------------------------------------
function IsPuny(value: string): boolean {
  return value.toLowerCase().startsWith('xn--')
}
function IsPunyLabel(value: string, isBidiDomain: boolean = false): boolean {
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
// a "Bidi domain name" (RFC 5893 §1.4) before validating any label.
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
// ------------------------------------------------------------------
// IsIdnLabel
// ------------------------------------------------------------------
export function IsIdnLabel(value: string, isBidiDomain: boolean = false): boolean {
  if (value.length === 0 || value.length > 63) return false
  if (IsPuny(value)) return IsPunyLabel(value, isBidiDomain)
  if (!IsUnicodeLabel(value, isBidiDomain)) return false
  // RFC 5891 §4.2.4 - the 63-octet limit applies to the A-label (encoded)
  // form, not the raw code point count, for labels containing non-ASCII.
  if ([...value].some((c) => c.codePointAt(0)! >= 0x80)) {
    if (Puny.Encode(value).length + 4 > 63) return false
  }
  return true
}
// ------------------------------------------------------------------
// IsLabel
// ------------------------------------------------------------------
export function IsLabel(value: string): boolean {
  if (value.length === 0 || value.length > 63) return false
  return IsPuny(value) ? IsPunyLabel(value) : IsAsciiLabel(value)
}
