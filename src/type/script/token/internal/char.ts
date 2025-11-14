/*--------------------------------------------------------------------------

ParseBox

The MIT License (MIT)

Copyright (c) 2024-2025 Haydn Paterson

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

// deno-coverage-ignore-start - parsebox tested
// deno-fmt-ignore-file

// ------------------------------------------------------------------
// Range
// ------------------------------------------------------------------
function Range(start: number, end: number): string[] {
  return Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i))
}
// ------------------------------------------------------------------
// Alphas
// ------------------------------------------------------------------
export type TAlpha = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
  'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
  'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
  'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
  'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
  'W', 'X', 'Y', 'Z',
]
export const Alpha = [
  ...Range(97, 122), // Lowercase
  ...Range(65, 90) // Uppercase
] as TAlpha 

// ------------------------------------------------------------------
// Digits
// ------------------------------------------------------------------
export type TZero = typeof Zero
export type TNonZero = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
export type TDigit = [TZero, ...TNonZero]

export const Zero = '0'
export const NonZero = Range(49, 57) as TNonZero // 1 - 9
export const Digit = [Zero, ...NonZero] as TDigit

// ------------------------------------------------------------------
// Characters
// ------------------------------------------------------------------
export const WhiteSpace = ' '
export const NewLine = '\n'
export const TabSpace = '\t'
export const UnderScore = '_'
export const Dot = '.'
export const DollarSign = '$'
export const Hyphen = '-'

export type TWhiteSpace = typeof WhiteSpace
export type TNewLine = typeof NewLine
export type TTabSpace = typeof TabSpace
export type TUnderScore = typeof UnderScore
export type TDot = typeof Dot
export type TDollarSign = typeof DollarSign
export type THyphen = typeof Hyphen

// deno-coverage-ignore-stop