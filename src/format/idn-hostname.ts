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

function IsValidAdjacentForKatakanaMiddleDot(cp: number): boolean {
  return (
    (cp >= 0x3040 && cp <= 0x309F) || // Hiragana
    (cp >= 0x30A0 && cp <= 0x30FF && cp !== 0x30FB) || // Katakana (excluding U+30FB)
    (cp >= 0x4E00 && cp <= 0x9FFF) // Han (CJK Unified Ideographs)
  )
}

/**
 * Returns true if the value is an IDN Hostname
 * @specification Json Schema 2020-12
 */
export function IsIdnHostname(value: string): boolean {
  if (value.length === 0 || value.includes(' ')) return false
  // Normalize (NFC) and replace allowed separators with a dot
  // Allowed label separators per RFC3490: U+002E, U+3002, U+FF0E, U+FF61
  const normalized = value.normalize('NFC').replace(/[\u002E\u3002\uFF0E\uFF61]/g, '.')
  if (normalized.length > 253) return false
  const labels = normalized.split('.')
  for (const label of labels) {
    if (label.length === 0 || label.length > 63) return false
    // Labels must not begin or end with a hyphen
    if (label.charCodeAt(0) === 45 || label.charCodeAt(label.length - 1) === 45) return false
    // A-label (punycode) checks
    if (
      (label.charCodeAt(0) === 120 || label.charCodeAt(0) === 88) && // 'x' or 'X'
      (label.charCodeAt(1) === 110 || label.charCodeAt(1) === 78) && // 'n' or 'N'
      label.charCodeAt(2) === 45 && // '-'
      label.charCodeAt(3) === 45 // '-'
    ) {
      const punycodePart = label.slice(4)
      if (punycodePart.length < 2 || punycodePart.includes('---')) return false
      continue
    }
    // U-label checks
    let hasArabicIndic = false
    let hasExtendedArabicIndic = false
    for (let i = 0; i < label.length; i++) {
      // deno-coverage-ignore
      const cp = label.codePointAt(i) ?? 0
      // Disallowed code points
      if (
        cp === 0x302E || cp === 0x302F ||
        cp === 0x3031 || cp === 0x3032 || cp === 0x3033 || cp === 0x3034 || cp === 0x3035 ||
        cp === 0x303B || cp === 0x0640 || cp === 0x07FA
      ) return false
      // Disallow labels starting with certain combining marks
      if (i === 0 && (cp === 0x0903 || cp === 0x0300 || cp === 0x0488)) return false
      // MIDDLE DOT (U+00B7) must be flanked by 'l' or 'L'
      if (cp === 0x00B7) {
        if (i === 0 || i === label.length - 1) return false
        // deno-coverage-ignore
        const prev = label.codePointAt(i - 1) ?? 0
        // deno-coverage-ignore
        const next = label.codePointAt(i + 1) ?? 0
        if ((prev !== 108 && prev !== 76) || (next !== 108 && next !== 76)) return false
      }
      // KATAKANA MIDDLE DOT (U+30FB) — U+30FB is below U+FFFF so stride is always 1
      if (cp === 0x30FB) {
        if (label.length === 1) return false
        if (i === 0) {
          // deno-coverage-ignore
          const next = label.codePointAt(i + 1) ?? 0
          if (!IsValidAdjacentForKatakanaMiddleDot(next)) return false
        } else {
          // deno-coverage-ignore
          const prev = label.codePointAt(i - 1) ?? 0
          // deno-coverage-ignore
          const next = label.codePointAt(i + 1) ?? 0
          if (!IsValidAdjacentForKatakanaMiddleDot(prev) || !IsValidAdjacentForKatakanaMiddleDot(next)) return false
        }
      }
      // Greek KERAIA (U+0375) — U+0375 is below U+FFFF so stride is always 1
      if (cp === 0x0375) {
        if (i === label.length - 1) return false
        // deno-coverage-ignore
        const next = label.codePointAt(i + 1) ?? 0
        if (next < 0x0370 || next > 0x03FF) return false
      }
      // Hebrew GERESH (U+05F3) and GERSHAYIM (U+05F4)
      if (cp === 0x05F3 || cp === 0x05F4) {
        if (i === 0) return false
        // deno-coverage-ignore
        const prev = label.codePointAt(i - 1) ?? 0
        if (prev < 0x05D0 || prev > 0x05EA) return false
      }
      // ZERO WIDTH JOINER (U+200D)
      if (cp === 0x200D) {
        if (i === 0) return false
        // deno-coverage-ignore
        const prev = label.codePointAt(i - 1) ?? 0
        if (prev !== 0x094D) return false
      }
      // Arabic-Indic digits
      if (cp >= 0x0660 && cp <= 0x0669) hasArabicIndic = true
      // Extended Arabic-Indic digits
      if (cp >= 0x06F0 && cp <= 0x06F9) hasExtendedArabicIndic = true
    }
    if (hasArabicIndic && hasExtendedArabicIndic) return false
  }
  return true
}
