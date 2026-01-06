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

function IsValidAdjacentForKatakanaMiddleDot(char: string): boolean {
  const codePoint = char.codePointAt(0)
  // deno-coverage-ignore - internal condition never reached
  if (codePoint === undefined) return false
  return (
    (codePoint >= 0x3040 && codePoint <= 0x309F) || // Hiragana
    (codePoint >= 0x30A0 && codePoint <= 0x30FF && codePoint !== 0x30FB) || // Katakana (excluding U+30FB)
    (codePoint >= 0x4E00 && codePoint <= 0x9FFF) // Han (CJK Unified Ideographs)
  )
}
/**
 * Returns true if the value is a Hostname
 * @specification
 */
export function IsIdnHostname(value: string): boolean {
  if (value.length === 0) return false
  if (value.includes(' ')) return false
  // Allowed label separators per RFC3490: U+002E, U+3002, U+FF0E, U+FF61.
  const separators = /[\u002E\u3002\uFF0E\uFF61]/g
  // Normalize (NFC) and replace allowed separators with a dot.
  const normalized = value.normalize('NFC').replace(separators, '.')
  if (normalized.length > 253) return false
  // Split into labels; disallow empty labels.
  const labels = normalized.split('.')
  if (labels.some((label) => label.length === 0)) return false

  for (const label of labels) {
    // Each label must be ≤ 63 characters.
    if (label.length > 63) return false
    // Labels must not begin or end with a hyphen.
    if (label.startsWith('-') || label.endsWith('-')) return false

    // A-label (punycode) checks.
    if (/^xn--/i.test(label)) {
      const punycodePart = label.slice(4)
      if (punycodePart.length < 2) return false
      if (punycodePart.includes('---')) return false
      continue
    }
    // U-label: Reject if any disallowed code points occur.
    // Disallowed: U+302E, U+302F, U+3031, U+3032, U+3033, U+3034, U+3035, U+303B, U+0640, U+07FA.
    if (/[\u302E\u302F\u3031\u3032\u3033\u3034\u3035\u303B\u0640\u07FA]/.test(label)) {
      return false
    }
    // Disallow labels starting with certain combining marks.
    const firstChar = label.charAt(0)
    if (/[\u0903\u0300\u0488]/.test(firstChar)) return false

    // Check each character within the label.
    for (let i = 0; i < label.length; i++) {
      const char = label.charAt(i)
      // --- MIDDLE DOT (U+00B7) ---
      // Must be flanked on both sides by "l" or "L".
      if (char === '\u00B7') {
        if (i === 0 || i === label.length - 1) return false
        const prev = label.charAt(i - 1)
        const next = label.charAt(i + 1)
        if (!/^[lL]$/.test(prev) || !/^[lL]$/.test(next)) return false
      }
      // --- KATAKANA MIDDLE DOT (U+30FB) ---
      if (char === '\u30FB') {
        // If label is a single character, it's invalid.
        if (label.length === 1) return false
        if (i === 0) {
          // At beginning: check following character.
          const next = label.charAt(i + 1)
          if (!IsValidAdjacentForKatakanaMiddleDot(next)) return false
        } else {
          // In the middle: check both adjacent characters.
          const prev = label.charAt(i - 1)
          const next = label.charAt(i + 1)
          if (!IsValidAdjacentForKatakanaMiddleDot(prev) || !IsValidAdjacentForKatakanaMiddleDot(next)) {
            return false
          }
        }
      }
      // --- Greek Keraia (U+0375) ---
      if (char === '\u0375') {
        if (i === label.length - 1) return false
        const next = label.charAt(i + 1)
        if (!/[\u0370-\u03FF]/.test(next)) return false
      }

      // --- Hebrew GERESH (U+05F3) and GERSHAYIM (U+05F4) ---
      if (char === '\u05F3' || char === '\u05F4') {
        if (i === 0) return false
        const prev = label.charAt(i - 1)
        if (!/[\u05D0-\u05EA]/.test(prev)) return false
      }
      // --- ZERO WIDTH JOINER (U+200D) ---
      if (char === '\u200D') {
        if (i === 0) return false
        const prev = label.charAt(i - 1)
        if (prev !== '\u094D') return false
      }
      // ZERO WIDTH NON-JOINER (U+200C) is allowed.
    }
    // --- Arabic-Indic digits vs. Extended Arabic-Indic digits ---
    let hasArabicIndic = false
    let hasExtendedArabicIndic = false
    for (let i = 0; i < label.length; i++) {
      const char = label.charAt(i)
      if (/[\u0660-\u0669]/.test(char)) hasArabicIndic = true
      if (/[\u06F0-\u06F9]/.test(char)) hasExtendedArabicIndic = true
    }
    if (hasArabicIndic && hasExtendedArabicIndic) return false
  }
  return true
}
