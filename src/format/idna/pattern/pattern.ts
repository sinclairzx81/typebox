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

// -------------------------------------------------------------------
// Validation Rules
// -------------------------------------------------------------------
export const RE_RULE_NOT_RESERVED_ACE = /^(?!..--)/

// -------------------------------------------------------------------
// ASCII & Encoding
// -------------------------------------------------------------------
export const RE_ASCII = /^\p{ASCII}*$/u
export const RE_NON_ASCII = /[^\p{ASCII}]/u

// -------------------------------------------------------------------
// Structural & Unicode Controls
// -------------------------------------------------------------------
export const RE_HIGH_SURROGATE = /[\u{d800}-\u{dbff}]/u
export const RE_REGIONAL_INDICATOR = /[\u{1f1e6}-\u{1f1ff}]/u
export const RE_VARIATION_SELECTOR = /[\u{fe00}-\u{fe0f}]/u
export const RE_ZERO_WIDTH_JOINER = /\u{200d}/u

// -------------------------------------------------------------------
// Numbers & Digits
// -------------------------------------------------------------------
export const RE_ARABIC_INDIC_DIGIT = /[\u{0660}-\u{0669}]/u

// -------------------------------------------------------------------
// General Categories
// -------------------------------------------------------------------
export const RE_MARK_NONSPACING = /\p{Mn}/u
export const RE_MARK_ENCLOSING = /\p{Me}/u
export const RE_COMBINING_MARK = /[\p{Mn}\p{Mc}\p{Me}]/u
export const RE_LETTER = /\p{L}/u

// -------------------------------------------------------------------
// Scripts
// -------------------------------------------------------------------
export const RE_SCRIPT_GREEK = /\p{Script=Greek}/u
export const RE_SCRIPT_HEBREW = /\p{Script=Hebrew}/u
export const RE_SCRIPT_JAPANESE = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u
export const RE_SCRIPT_ARABIC_LETTER = /[\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Mandaic}]/u

// -------------------------------------------------------------------
// RFC Specifications
// -------------------------------------------------------------------
export const RE_VIRAMA = /[\u{094d}\u{09cd}\u{0a4d}\u{0acd}\u{0b4d}\u{0bcd}\u{0c4d}\u{0ccd}\u{0d3b}\u{0d3c}\u{0d4d}\u{0dca}\u{1b44}\u{1baa}\u{1bab}\u{a9c0}\u{11046}\u{1107f}\u{110b9}\u{11133}\u{11134}\u{111c0}\u{11235}\u{1134d}\u{11442}\u{114c2}\u{115bf}\u{1163f}\u{116b6}\u{11c3f}\u{11d44}\u{11d45}]/u
export const RE_RFC5892_DISALLOWED = /[\u{0640}\u{07fa}\u{302e}\u{302f}\u{3031}\u{3032}\u{3033}\u{3034}\u{3035}\u{303b}]/u

// -------------------------------------------------------------------
// Composite Patterns
// -------------------------------------------------------------------
export const RE_EUROPEAN_NUMBER = /[0-9\u{06f0}-\u{06f9}]/u
export const RE_PERMITTED_CATEGORY = /[\p{L}\p{Nd}\p{Mn}\p{Mc}\u002e\u002c\u003a\u002f\u002b\u002d\u00b7\u0375\u05f3\u05f4\u200c\u200d\u30fb\u00df\u03c2\u06fd\u06fe\u0f0b\u3007]/u