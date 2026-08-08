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
// Unicode General Category Helper (RFC 5892)
// ------------------------------------------------------------------
export function IsNonspacingMark(cp: number): boolean {
  return /\p{Mn}/u.test(String.fromCodePoint(cp))
}
export function IsSpacingCombiningMark(cp: number): boolean {
  return /\p{Mc}/u.test(String.fromCodePoint(cp))
}
export function IsEnclosingMark(cp: number): boolean {
  return /\p{Me}/u.test(String.fromCodePoint(cp))
}
export function IsCombiningMark(cp: number): boolean {
  return IsNonspacingMark(cp) || IsSpacingCombiningMark(cp) || IsEnclosingMark(cp)
}
// ------------------------------------------------------------------
// RFC 5892 §2.6 DISALLOWED exceptions
//
// https://tools.ietf.org/html/rfc5892#section-2.6
// ------------------------------------------------------------------
export const RFC5892_DISALLOWED = new Set([
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
// IsLetter
//
// Shared by IsPermittedCategory (RFC 5892 PVALID) and by bidi.ts's
// GetBidiClass (RFC 5893) - both need "is this a letter", so it's
// hoisted here rather than duplicated as an inline regex in each.
// ------------------------------------------------------------------
export function IsLetter(cp: number): boolean {
  return /\p{L}/u.test(String.fromCodePoint(cp))
}
// ------------------------------------------------------------------
// Guards for CONTEXTO rules (RFC 5892 Appendix A)
// ------------------------------------------------------------------
export function IsGreek(cp: number): boolean {
  return /\p{Script=Greek}/u.test(String.fromCodePoint(cp))
}
export function IsHebrew(cp: number): boolean {
  return /\p{Script=Hebrew}/u.test(String.fromCodePoint(cp))
}
export function IsHiragana(cp: number): boolean {
  return /\p{Script=Hiragana}/u.test(String.fromCodePoint(cp))
}
export function IsKatakana(cp: number): boolean {
  return /\p{Script=Katakana}/u.test(String.fromCodePoint(cp))
}
export function IsHan(cp: number): boolean {
  return /\p{Script=Han}/u.test(String.fromCodePoint(cp))
}
export function IsArabic(cp: number): boolean {
  return /\p{Script=Arabic}/u.test(String.fromCodePoint(cp))
}
export function IsSyriac(cp: number): boolean {
  return /\p{Script=Syriac}/u.test(String.fromCodePoint(cp))
}
export function IsThaana(cp: number): boolean {
  return /\p{Script=Thaana}/u.test(String.fromCodePoint(cp))
}
export function IsMandaic(cp: number): boolean {
  return /\p{Script=Mandaic}/u.test(String.fromCodePoint(cp))
}
export function IsArabicIndicDigit(cp: number): boolean {
  return cp >= 0x0660 && cp <= 0x0669
}
export function IsExtendedArabicIndicDigit(cp: number): boolean {
  return cp >= 0x06f0 && cp <= 0x06f9
}
export function IsVirama(cp: number): boolean {
  return VIRAMA_CPS.has(cp)
}
// ------------------------------------------------------------------
// General Category Enforcement (RFC 5892 §2 PVALID)
//
// A label may only contain letters, marks, decimal digits, the
// hyphen (LDH), and the small set of CONTEXTO exception characters
// that are separately validated by their neighbor rules (see
// unicode-label.ts). Any other general category (punctuation,
// symbols, etc.) is DISALLOWED.
// ------------------------------------------------------------------
export const CONTEXTO_EXCEPTIONS = new Set([0x00b7, 0x0375, 0x05f3, 0x05f4, 0x200c, 0x200d, 0x30fb])
// RFC 5892 §2.6 - PVALID exceptions: unconditionally permitted regardless of
// general category (some, like U+00DF and U+03C2, are already letters and
// listed here for documentation; others, like U+0F0B (Po), U+3007 (Nl), and
// U+06FD/U+06FE (So), are not covered by the letter/mark/digit categories
// below and would otherwise be rejected).
const PVALID_EXCEPTIONS = new Set([0x00df, 0x03c2, 0x06fd, 0x06fe, 0x0f0b, 0x3007])
export function IsPermittedCategory(cp: number): boolean {
  if (cp === 0x002d) return true // '-' LDH hyphen
  if (CONTEXTO_EXCEPTIONS.has(cp)) return true
  if (PVALID_EXCEPTIONS.has(cp)) return true
  const ch = String.fromCodePoint(cp)
  return IsLetter(cp) || /\p{Mn}/u.test(ch) || /\p{Mc}/u.test(ch) || /\p{Nd}/u.test(ch)
}
