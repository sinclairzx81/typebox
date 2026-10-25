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

// deno-fmt-ignore-file

import * as BuildInfo from '../buildinfo/index.ts'
import { Banner } from './banner.ts'

/** Creates the Idna format module. This is required for hostname and idn-hostname formats. */
export const IdnaModule = (info: BuildInfo.BuildInfo) => String.raw`${Banner('Idna')}
const ${info.NameOfIdna} = (() => {
  // ----------------------------------------------------------------
  // Pattern
  // ----------------------------------------------------------------
  const Pattern = (() => {
    const RE_RULE_HYPHEN_PLACEMENT = /^(?!-).*(?<!-)$/
    const RE_RULE_NOT_RESERVED_ACE = /^(?!..--)/
    const RE_ASCII_LDH = /^[a-zA-Z0-9-]*$/
    const RE_ASCII = /^\p{ASCII}*$/u
    const RE_NON_ASCII = /[^\p{ASCII}]/u
    const RE_HIGH_SURROGATE = /[\u{d800}-\u{dbff}]/u
    const RE_REGIONAL_INDICATOR = /[\u{1f1e6}-\u{1f1ff}]/u
    const RE_VARIATION_SELECTOR = /[\u{fe00}-\u{fe0f}]/u
    const RE_ZERO_WIDTH_JOINER = /\u{200d}/u
    const RE_ASCII_DIGIT = /[0-9]/
    const RE_ARABIC_INDIC_DIGIT = /[\u{0660}-\u{0669}]/u
    const RE_EXT_ARABIC_INDIC_DIGIT = /[\u{06f0}-\u{06f9}]/u
    const RE_COMMON_SEPARATOR = /[\u{002e}\u{002c}\u{003a}\u{002f}]/u
    const RE_EUROPEAN_SEPARATOR = /[\u{002d}\u{002b}]/u
    const RE_MARK_NONSPACING = /\p{Mn}/u
    const RE_MARK_SPACING_COMBINING = /\p{Mc}/u
    const RE_MARK_ENCLOSING = /\p{Me}/u
    const RE_COMBINING_MARK = /[\p{Mn}\p{Mc}\p{Me}]/u
    const RE_LETTER = /\p{L}/u
    const RE_NUMBER_DECIMAL = /\p{Nd}/u
    const RE_SCRIPT_GREEK = /\p{Script=Greek}/u
    const RE_SCRIPT_HEBREW = /\p{Script=Hebrew}/u
    const RE_SCRIPT_JAPANESE = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u
    const RE_SCRIPT_ARABIC_LETTER = /[\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Mandaic}]/u
    const RE_VIRAMA = /[\u{094d}\u{09cd}\u{0a4d}\u{0acd}\u{0b4d}\u{0bcd}\u{0c4d}\u{0ccd}\u{0d3b}\u{0d3c}\u{0d4d}\u{0dca}\u{1b44}\u{1baa}\u{1bab}\u{a9c0}\u{11046}\u{1107f}\u{110b9}\u{11133}\u{11134}\u{111c0}\u{11235}\u{1134d}\u{11442}\u{114c2}\u{115bf}\u{1163f}\u{116b6}\u{11c3f}\u{11d44}\u{11d45}]/u
    const RE_RFC5892_DISALLOWED = /[\u{0640}\u{07fa}\u{302e}\u{302f}\u{3031}\u{3032}\u{3033}\u{3034}\u{3035}\u{303b}]/u
    const RE_CONTEXTO_EXCEPTIONS = /[\u{00b7}\u{0375}\u{05f3}\u{05f4}\u{200c}\u{200d}\u{30fb}]/u
    const RE_PVALID_EXCEPTIONS = /[\u{00df}\u{03c2}\u{06fd}\u{06fe}\u{0f0b}\u{3007}]/u
    const RE_EUROPEAN_NUMBER = new RegExp([
      RE_ASCII_DIGIT,
      RE_EXT_ARABIC_INDIC_DIGIT
    ].map((regexp) => regexp.source).join('|'), 'u')
    const RE_PERMITTED_CATEGORY = new RegExp([
      RE_LETTER,
      RE_EUROPEAN_SEPARATOR,
      RE_COMMON_SEPARATOR,
      RE_NUMBER_DECIMAL,
      RE_MARK_NONSPACING,
      RE_MARK_SPACING_COMBINING,
      RE_CONTEXTO_EXCEPTIONS,
      RE_PVALID_EXCEPTIONS
    ].map((regexp) => regexp.source).join('|'), 'u')
    return {
      RE_RULE_HYPHEN_PLACEMENT,
      RE_RULE_NOT_RESERVED_ACE,
      RE_ASCII_LDH,
      RE_ASCII,
      RE_NON_ASCII,
      RE_HIGH_SURROGATE,
      RE_REGIONAL_INDICATOR,
      RE_VARIATION_SELECTOR,
      RE_ZERO_WIDTH_JOINER,
      RE_ASCII_DIGIT,
      RE_ARABIC_INDIC_DIGIT,
      RE_EXT_ARABIC_INDIC_DIGIT,
      RE_COMMON_SEPARATOR,
      RE_EUROPEAN_SEPARATOR,
      RE_MARK_NONSPACING,
      RE_MARK_SPACING_COMBINING,
      RE_MARK_ENCLOSING,
      RE_COMBINING_MARK,
      RE_LETTER,
      RE_NUMBER_DECIMAL,
      RE_SCRIPT_GREEK,
      RE_SCRIPT_HEBREW,
      RE_SCRIPT_JAPANESE,
      RE_SCRIPT_ARABIC_LETTER,
      RE_VIRAMA,
      RE_RFC5892_DISALLOWED,
      RE_CONTEXTO_EXCEPTIONS,
      RE_PVALID_EXCEPTIONS,
      RE_EUROPEAN_NUMBER,
      RE_PERMITTED_CATEGORY
    }
  })()
  // ------------------------------------------------------------------
  // FormatPuny
  // ------------------------------------------------------------------
  const FormatPuny = (() => {
    const RE_REPLACE_NON_ASCII = new RegExp(Pattern.RE_NON_ASCII.source, 'gu')
    // ------------------------------------------------------------------
    // PunyCode (RFC 3492)
    // ------------------------------------------------------------------
    const PUNYCODE_BASE = 36
    const PUNYCODE_TMIN = 1
    const PUNYCODE_TMAX = 26
    const PUNYCODE_SKEW = 38
    const PUNYCODE_DAMP = 700
    const PUNYCODE_INITIAL_BIAS = 72
    const PUNYCODE_INITIAL_N = 128
    // ------------------------------------------------------------------
    // ThrowDontCare
    // ------------------------------------------------------------------
    function ThrowDontCare(): never {
      throw null
    }
    // ------------------------------------------------------------------
    // IsAcePrefixed
    // ------------------------------------------------------------------
    function IsAcePrefixed(value: string): boolean {
      return value.toLowerCase().startsWith('xn--')
    }
    // ------------------------------------------------------------------
    // Adapt
    // ------------------------------------------------------------------
    function Adapt(delta: number, numPoints: number, firstTime: boolean): number {
      delta = firstTime ? Math.floor(delta / PUNYCODE_DAMP) : delta >> 1
      delta += Math.floor(delta / numPoints)
      let k = 0
      while (delta > (((PUNYCODE_BASE - PUNYCODE_TMIN) * PUNYCODE_TMAX) >> 1)) {
        delta = Math.floor(delta / (PUNYCODE_BASE - PUNYCODE_TMIN))
        k += PUNYCODE_BASE
      }
      return k + Math.floor(((PUNYCODE_BASE - PUNYCODE_TMIN + 1) * delta) / (delta + PUNYCODE_SKEW))
    }
    // ------------------------------------------------------------------
    // Decode
    // ------------------------------------------------------------------
    function Decode(value: string): string {
      const output: number[] = []
      let n = PUNYCODE_INITIAL_N
      let i = 0
      let bias = PUNYCODE_INITIAL_BIAS
      const delimIdx = value.lastIndexOf('-')
      if (delimIdx > 0) {
        for (let j = 0; j < delimIdx; j++) {
          const cp = value.charCodeAt(j)
          if (cp >= 128) ThrowDontCare() // throw new Error('Invalid punycode: non-basic before delimiter')
          output.push(cp)
        }
      }
      let inIdx = delimIdx < 0 ? 0 : delimIdx + 1
      while (inIdx < value.length) {
        const oldi = i
        let w = 1
        let k = PUNYCODE_BASE
        while (true) {
          if (inIdx >= value.length) ThrowDontCare() // throw new Error('Invalid punycode: unexpected end of input')
          const ch = value.charCodeAt(inIdx++)
          let digit: number
          if (ch >= 0x61 && ch <= 0x7a) digit = ch - 0x61 // a-z => 0-25
          else if (ch >= 0x30 && ch <= 0x39) digit = ch - 0x30 + 26 // 0-9 => 26-35
          // else if (ch >= 0x41 && ch <= 0x5a) digit = ch - 0x41 // A-Z => 0-25 // (no-spec-coverage)
          else ThrowDontCare() // throw new Error('Invalid punycode: bad digit character')
          i += digit * w
          const t = k <= bias ? PUNYCODE_TMIN : k >= bias + PUNYCODE_TMAX ? PUNYCODE_TMAX : k - bias
          if (digit < t) break
          w *= PUNYCODE_BASE - t
          k += PUNYCODE_BASE
        }
        const outLen = output.length + 1
        bias = Adapt(i - oldi, outLen, oldi === 0)
        n += Math.floor(i / outLen)
        i %= outLen
        output.splice(i, 0, n)
        i++
      }
      return String.fromCodePoint(...output)
    }
    function DigitToChar(digit: number): string {
      return digit < 26 ? String.fromCharCode(digit + 0x61) : String.fromCharCode(digit - 26 + 0x30)
    }
    function Encode(input: string): string {
      // Extract basic ASCII characters and set initial output array state
      const basic = input.replace(RE_REPLACE_NON_ASCII, '')
      const basicLength = basic.length
      const result = basicLength > 0 ? [basic, '-'] : []
      // Extract unicode codepoints
      const codePoints = Array.from(input, (char) => char.codePointAt(0)!)
      let n = PUNYCODE_INITIAL_N
      let delta = 0
      let bias = PUNYCODE_INITIAL_BIAS
      let handledCPCount = basicLength
      while (handledCPCount < codePoints.length) {
        let m = Infinity
        for (const cp of codePoints) {
          if (cp >= n && cp < m) m = cp
        }
        delta += (m - n) * (handledCPCount + 1)
        n = m
        for (const cp of codePoints) {
          if (cp < n) delta++
          if (cp === n) {
            let q = delta
            for (let k = PUNYCODE_BASE; ; k += PUNYCODE_BASE) {
              const t = k <= bias ? PUNYCODE_TMIN : k >= bias + PUNYCODE_TMAX ? PUNYCODE_TMAX : k - bias
              if (q < t) break
              const digit = t + ((q - t) % (PUNYCODE_BASE - t))
              result.push(DigitToChar(digit))
              q = Math.floor((q - t) / (PUNYCODE_BASE - t))
            }
            result.push(DigitToChar(q))
            bias = Adapt(delta, handledCPCount + 1, handledCPCount === basicLength)
            delta = 0
            handledCPCount++
          }
        }
        delta++
        n++
      }
      return result.join('')
    }
    return { Adapt, Decode, Encode, IsAcePrefixed }
  })()
  const FormatBidi = (() => {
    // ------------------------------------------------------------------
    // LOCAL REGEX: Allowed Bidi classes per direction (RFC 5893)
    // ------------------------------------------------------------------
    const RE_RTL_ALLOWED = /^(?:R|AL|AN|EN|ES|CS|ET|ON|BN|NSM)$/
    const RE_LTR_ALLOWED = /^(?:L|EN|ES|CS|ET|ON|BN|NSM)$/
    const RE_RTL_CLASSES = /^(?:R|AL|AN)$/

    // ------------------------------------------------------------------
    // HasBidiChars
    //
    // Decodes a punycode label to its Unicode form (if it is one) and
    // checks whether the result is an RTL label per RFC 5893 §1.4.
    // ------------------------------------------------------------------
    function HasBidiChars(value: string): boolean {
      if (FormatPuny.IsAcePrefixed(value)) {
        try {
          return HasRightToLeftCharacters(FormatPuny.Decode(value.slice(4).toLowerCase()))
        } catch {
          return false
        }
      }
      return HasRightToLeftCharacters(value)
    }
    // ------------------------------------------------------------------
    // GetBidiClass
    // ------------------------------------------------------------------
    function GetBidiClass(codePoint: number): string {
      const char = String.fromCodePoint(codePoint)
      return (
        Pattern.RE_EUROPEAN_NUMBER.test(char) ? 'EN' :
        Pattern.RE_ARABIC_INDIC_DIGIT.test(char) ? 'AN' :
        // Pattern.RE_EUROPEAN_SEPARATOR.test(char) ? 'ES' : // (no-spec-coverage)
        // Pattern.RE_COMMON_SEPARATOR.test(char) ? 'CS' : // (no-spec-coverage)
        Pattern.RE_MARK_NONSPACING.test(char) ? 'NSM' :
        Pattern.RE_SCRIPT_HEBREW.test(char) ? 'R' :
        Pattern.RE_SCRIPT_ARABIC_LETTER.test(char) ? 'AL' :
        Pattern.RE_LETTER.test(char) ? 'L' :
        'ON'
      )
    }
    // ------------------------------------------------------------------
    // HasRightToLeftCharacters
    //
    // Per RFC 5893 §1.4: "An RTL label is a label that contains at least
    // one character of type R, AL, or AN." Used to determine whether a
    // domain name is a "Bidi domain name" (RFC 5893 §1.4), in which case
    // the Bidi Rule applies to every label in the domain.
    // ------------------------------------------------------------------
    function HasRightToLeftCharacters(value: string): boolean {
      for (const ch of value) if (RE_RTL_CLASSES.test(GetBidiClass(ch.codePointAt(0)!))) return true
      return false
    }
    // ------------------------------------------------------------------
    // SatisfiesBidiRule
    // ------------------------------------------------------------------
    function SatisfiesBidiRule(value: string): boolean {
      let isRtl = false
      let allowed = RE_LTR_ALLOWED
      let sawEN = false
      let sawAN = false
      let isFirst = true
      // let lastClass: string | null = null // (no-spec-coverage)
      for (const ch of value) {
        const bidiClass = GetBidiClass(ch.codePointAt(0)!)
        if (isFirst) {
          // 1. The first character must be a character with Bidi property L, R, or AL.
          if (bidiClass !== 'L' && bidiClass !== 'R' && bidiClass !== 'AL') return false
          isRtl = bidiClass === 'R' || bidiClass === 'AL'
          allowed = isRtl ? RE_RTL_ALLOWED : RE_LTR_ALLOWED
          isFirst = false
        }
        // 2 / 5. Only characters in the allowed set for this direction may appear.
        if (!allowed.test(bidiClass)) return false
        if (bidiClass === 'EN') sawEN = true
        else if (bidiClass === 'AN') sawAN = true
        // if (bidiClass !== 'NSM') lastClass = bidiClass // (no-spec-coverage)
      }
      if (isRtl && sawEN && sawAN) return false // spec coverage path
      // (no-spec-coverage)
      // if (isRtl) {
      //   // 3. The end of the label must be R, AL, EN, or AN (ignoring trailing NSM).
      //   // if (lastClass !== 'R' && lastClass !== 'AL' && lastClass !== 'EN' && lastClass !== 'AN') return false
      //   // 4. If an EN is present, no AN may be present, and vice versa.
      //   if (sawEN && sawAN) return false
      // } else {
      //   // 6. The end of the label must be L or EN (ignoring trailing NSM).
      //   // if (lastClass !== 'L' && lastClass !== 'EN') return false
      // }
      return true
    }
    return { HasRightToLeftCharacters, SatisfiesBidiRule, HasBidiChars }
  })()
  // -------------------------------------------------------------------
  // LabelUnicode
  // -------------------------------------------------------------------
  const LabelUnicode = (() => {
    // ------------------------------------------------------------------
    // ExceedsMaxALabelLength
    //
    // RFC 5890 §2.3.2.1: an A-label (the ACE-encoded form of a label,
    // "xn--" + punycode) must not exceed 63 octets. Only labels
    // containing non-ASCII characters need checking - a pure-ASCII label
    // has no "xn--" prefix and is used as-is, so its punycode-encoded
    // length is irrelevant. The ASCII check is a cheap short-circuit that
    // avoids running the punycode encoder on labels that don't need it.
    // ------------------------------------------------------------------
    function ExceedsMaxALabelLength(value: string): boolean {
      return Pattern.RE_NON_ASCII.test(value) && FormatPuny.Encode(value).length + 4 > 63
    }
    // ------------------------------------------------------------------
    // HasInvalidHyphens
    //
    // RFC 5891 §4.2.3.2: label must not start or end with a hyphen, and
    // must not have hyphens in the 3rd and 4th codepoint positions (the
    // ACE prefix reservation, e.g. "xn--"). Operates on chars (the
    // per-codepoint string array) rather than raw string indices so
    // supplementary-plane characters earlier in the label don't throw
    // off the codepoint-position count.
    // ------------------------------------------------------------------
    function HasInvalidHyphens(chars: string[]): boolean {
      if (chars[0] === '-' || chars[chars.length - 1] === '-') return true
      return chars.slice(2).join('').startsWith('--')
    }
    // ------------------------------------------------------------------
    // IsUnicodeLabel
    // ------------------------------------------------------------------
    function IsUnicodeLabel(value: string): boolean {
      // RFC 5890 §2.3.2.1: Ensure Max Length
      if (ExceedsMaxALabelLength(value)) return false
      // RFC 5893 - Bidi Rule (applies whenever this label itself is RTL)
      if (FormatBidi.HasRightToLeftCharacters(value) && !FormatBidi.SatisfiesBidiRule(value)) return false
      const chars = [...value]
      const codePoints = chars.map((c) => c.codePointAt(0)!)
      const length = codePoints.length
      // RFC 5891 §4.2.3.2: Hyphen rules
      if (HasInvalidHyphens(chars)) return false
      // RFC 5891 §4.2.3.2 - Must not begin with a combining mark
      if (Pattern.RE_COMBINING_MARK.test(chars[0])) return false
      let hasJapanese = false
      // let hasArabicIndic = false // (no-spec-coverage)
      // let hasExtendedArabicIndic = false // (no-spec-coverage)
      for (let i = 0; i < length; i++) {
        const codePoint = codePoints[i]
        const char = chars[i]
        // 1. DISALLOWED exceptions
        if (Pattern.RE_RFC5892_DISALLOWED.test(char)) return false
        // 1b. General category (PVALID) enforcement
        if (!Pattern.RE_PERMITTED_CATEGORY.test(char)) return false
        // 2. Collect Flags
        if (Pattern.RE_SCRIPT_JAPANESE.test(char)) hasJapanese = true
        // if (Pattern.RE_ARABIC_INDIC_DIGIT.test(char)) hasArabicIndic = true  // (no-spec-coverage)
        // if (Pattern.RE_EXT_ARABIC_INDIC_DIGIT.test(char)) hasExtendedArabicIndic = true  // (no-spec-coverage)
        // 3. CONTEXTO / CONTEXTJ Neighbor Rules
        const prev = codePoints[i - 1], next = codePoints[i + 1]
        switch (codePoint) {
          case 0x00b7:
            if (prev !== 0x006c || next !== 0x006c) return false
            break // MIDDLE DOT (Catalan)
          case 0x0375:
            if (!next || !Pattern.RE_SCRIPT_GREEK.test(chars[i + 1])) return false
            break // Greek KERAIA
          case 0x05f3:
          case 0x05f4:
            if (!prev || !Pattern.RE_SCRIPT_HEBREW.test(chars[i - 1])) return false
            break // Hebrew GERESH
          case 0x200c: // ZWNJ - RFC 5892 Appendix A.1
            // Note: Full validation requires a Unicode joining type table. We reject
            // only when preceded by ASCII (U+0000-U+007F), which can never satisfy
            // the Virama or cursive-joining rules.
            if (!prev || (prev < 0x0080 && !Pattern.RE_VIRAMA.test(chars[i - 1]))) return false
            break
          case 0x200d: // ZWJ: RFC 5892 Appendix A.2
            if (!prev || !Pattern.RE_VIRAMA.test(chars[i - 1])) return false
            break
          case 0x30fb: // Checked at end via hasJapanese
            break // KATAKANA MIDDLE DOT
        }
      }
      // 4. Global Context Validations (Post-loop)
      // RFC 5892 Appendix A.7 - Katakana Middle Dot requirement
      if (value.includes('\u30fb') && !hasJapanese) return false
      // RFC 5892 Appendix A.8/A.9 - Mixing Arabic Digits
      // if (hasArabicIndic && hasExtendedArabicIndic) return false // (no-spec-coverage)
      return true
    }
    return { IsUnicodeLabel }
  })()
  // -------------------------------------------------------------------
  // LabelAscii
  // -------------------------------------------------------------------
  const LabelAscii = (() => {
    function IsAsciiLabel(value: string): boolean {
      return (
        Pattern.RE_RULE_HYPHEN_PLACEMENT.test(value) &&
        Pattern.RE_RULE_NOT_RESERVED_ACE.test(value) &&
        Pattern.RE_ASCII_LDH.test(value)
      )
    }
    return { IsAsciiLabel }
  })()
  // -------------------------------------------------------------------
  // LabelPuny
  // -------------------------------------------------------------------
  const LabelPuny = (() => {
    function IsPunyLabel(value: string): boolean {
      if (!FormatPuny.IsAcePrefixed(value)) return false
      try {
        const body = value.slice(4).toLowerCase()
        // A payload consisting of only a hyphen, or starting with the delimiter
        // (like "-9uc"), has 0 basic ASCII characters preceding it and is malformed.
        if (body.lastIndexOf('-') === 0) return false
        const decoded = FormatPuny.Decode(body)
        // RFC 5890 §2.3.2.1 - a U-label must contain at least one non-ASCII
        // character. Code-unit level check: any non-ASCII codepoint has at least
        // one UTF-16 unit >= 0x80 (surrogate halves included), so no need to
        // decode codepoints or allocate a character array to answer this.
        if (!Pattern.RE_NON_ASCII.test(decoded)) return false
        return LabelUnicode.IsUnicodeLabel(decoded)
      } catch {
        return false
      }
    }
    return { IsPunyLabel }
  })()
  // -------------------------------------------------------------------
  // IsIdnHostname
  // -------------------------------------------------------------------
  const IsIdnHostname = (() => {
    // ------------------------------------------------------------------
    // IsLabel
    // ------------------------------------------------------------------
    function IsValidLabelLength(value: string): boolean {
      return value.length > 0 && value.length <= 63
    }
    function IsLabel(value: string): boolean {
      return IsValidLabelLength(value) && (
        LabelPuny.IsPunyLabel(value) ||
        LabelUnicode.IsUnicodeLabel(value)
      )
    }
    // ------------------------------------------------------------------
    // NormalizeHostname
    //
    // Normalizes a hostname for label validation. Maps fullwidth
    // codepoints to their ASCII equivalent (e.g. 'ａ' U+FF41 maps to
    // 'a'), then normalizes for NFC such that equivalent codepoint
    // sequences can be uniformly compared. It also removes codepoints
    // that IDNA mapping ignores, and converts full stop variants to
    // ASCII '.' so the hostname can be split into labels.
    // ------------------------------------------------------------------
    function NormalizeHostname(value: string): string {
      return value
        .replace(/[\uff01-\uff5e]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0)) // RE_FULLWIDTH_MAPPING
        .normalize('NFC')
        .replace(/[\u00ad\u034f\u180b-\u180d\u200b\ufe00-\ufe0f\u{e0100}-\u{e01ef}]/gu, '') // RE_IGNORED_MAPPING
        .replace(/[\u002E\u3002\uFF0E\uFF61]/g, '.') // RE_FULL_STOP_MAPPING
    }
    // ------------------------------------------------------------------
    // IsIdnHostname
    // ------------------------------------------------------------------
    return (value: string): boolean => {
      if (value.length === 0 || value.includes(' ')) return false
      const normalized = NormalizeHostname(value)
      if (normalized.length > 253) return false
      const labels = normalized.split('.')
      const hasBidiChars = labels.some((label) => FormatBidi.HasBidiChars(label))
      return labels.every((label) => IsLabel(label) && (!hasBidiChars || FormatBidi.SatisfiesBidiRule(label)))
    }
  })()
  const IsHostname = (() => {
    function IsValidLabelLength(value: string): boolean {
      return value.length > 0 && value.length <= 63
    }
    function IsLabel(value: string): boolean {
      return IsValidLabelLength(value) && (
        LabelPuny.IsPunyLabel(value) ||
        LabelAscii.IsAsciiLabel(value)
      )
    }
    return (value: string): boolean => {
      if (value.length === 0 || value.length > 253) return false
      if (value.charCodeAt(value.length - 1) === 46) return false
      return value.split('.').every((label) => IsLabel(label))
    }
  })()
  return { IsIdnHostname, IsHostname }
})()`
