/*--------------------------------------------------------------------------

@sinclair/parsebox

The MIT License (MIT)

Copyright (c) 2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
// Chars
// ------------------------------------------------------------------
// prettier-ignore
namespace Chars {
  /** Returns true if the char code is a whitespace */
  export function IsWhitespace(value: number): boolean {
    return value === 32
  }
  /** Returns true if the char code is a newline */
  export function IsNewline(value: number): boolean {
    return value === 10
  }
  /** Returns true if the char code is a alpha  */
  export function IsAlpha(value: number): boolean {
    return (
      (value >= 65 && value <= 90) || // A-Z 
      (value >= 97 && value <= 122)   // a-z
    )
  }
  /** Returns true if the char code is zero */
  export function IsZero(value: number): boolean {
    return value === 48
  }
  /** Returns true if the char code is non-zero */
  export function IsNonZero(value: number): boolean {
    return value >= 49 && value <= 57
  }
  /** Returns true if the char code is a digit */
  export function IsDigit(value: number): boolean {
    return (
      IsNonZero(value) ||
      IsZero(value)
    )
  }
  /** Returns true if the char code is a dot */
  export function IsDot(value: number): boolean {
    return value === 46
  }
  /** Returns true if this char code is a underscore */
  export function IsUnderscore(value: unknown): boolean {
    return value === 95
  }
  /** Returns true if this char code is a dollar sign */
  export function IsDollarSign(value: unknown): boolean {
    return value === 36
  }
}

// ------------------------------------------------------------------
// Trim
// ------------------------------------------------------------------
// prettier-ignore
namespace Trim {
  /** Trims Whitespace and retains Newline, Tabspaces, etc. */
  export function TrimWhitespaceOnly(code: string): string {
    for (let i = 0; i < code.length; i++) {
      if (Chars.IsWhitespace(code.charCodeAt(i))) continue
      return code.slice(i)
    }
    return code
  }
  /** Trims Whitespace including Newline, Tabspaces, etc. */
  export function TrimAll(code: string): string {
    return code.trimStart()
  }
}
// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
/** Checks the value matches the next string  */
// prettier-ignore
function NextTokenCheck(value: string, code: string): boolean {
  if (value.length > code.length) return false
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) !== code.charCodeAt(i)) return false
  }
  return true
}
/** Gets the next constant string value or empty if no match */
// prettier-ignore
function NextConst(value: string, code: string, ): [] | [string, string] {
  return NextTokenCheck(value, code)
    ? [code.slice(0, value.length), code.slice(value.length)]
    : []
}
/** Takes the next constant string value skipping any whitespace */
// prettier-ignore
export function Const(value: string, code: string): [] | [string, string] {
  if(value.length === 0) return ['', code]
  const char_0 = value.charCodeAt(0)
  return (
    Chars.IsNewline(char_0) ? NextConst(value, Trim.TrimWhitespaceOnly(code)) :
    Chars.IsWhitespace(char_0) ? NextConst(value, code) :
    NextConst(value, Trim.TrimAll(code))
  )
}
// ------------------------------------------------------------------
// Ident
// ------------------------------------------------------------------
// prettier-ignore
function IdentIsFirst(char: number) {
  return (
    Chars.IsAlpha(char) ||
    Chars.IsDollarSign(char) ||
    Chars.IsUnderscore(char)
  )
}
// prettier-ignore
function IdentIsRest(char: number) {
  return (
    Chars.IsAlpha(char) ||
    Chars.IsDigit(char) ||
    Chars.IsDollarSign(char) ||
    Chars.IsUnderscore(char)
  )
}
// prettier-ignore
function NextIdent(code: string): [] | [string, string] {
  if (!IdentIsFirst(code.charCodeAt(0))) return []
  for (let i = 1; i < code.length; i++) {
    const char = code.charCodeAt(i)
    if (IdentIsRest(char)) continue
    const slice = code.slice(0, i)
    const rest = code.slice(i)
    return [slice, rest]
  }
  return [code, '']
}
/** Scans for the next Ident token */
// prettier-ignore
export function Ident(code: string): [] | [string, string] {
  return NextIdent(Trim.TrimAll(code))
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
/** Checks that the next number is not a leading zero */
// prettier-ignore
function NumberLeadingZeroCheck(code: string, index: number) {
  const char_0 = code.charCodeAt(index + 0)
  const char_1 = code.charCodeAt(index + 1)
  return (
    ( 
      // 1-9
      Chars.IsNonZero(char_0)
    ) || ( 
      // 0
      Chars.IsZero(char_0) &&
      !Chars.IsDigit(char_1)
    )  || ( 
      // 0.
      Chars.IsZero(char_0) &&
      Chars.IsDot(char_1)
    ) || ( 
      // .0
      Chars.IsDot(char_0) &&
      Chars.IsDigit(char_1)
    )
  )
}
/** Gets the next number token */
// prettier-ignore
function NextNumber(code: string): [] | [string, string] {
  const negated = code.charAt(0) === '-'
  const index = negated ? 1 : 0
  if (!NumberLeadingZeroCheck(code, index)) {
    return []
  }
  const dash = negated ? '-' : ''
  let hasDot = false
  for (let i = index; i < code.length; i++) {
    const char_i = code.charCodeAt(i)
    if (Chars.IsDigit(char_i)) {
      continue
    }
    if (Chars.IsDot(char_i)) {
      if (hasDot) {
        const slice = code.slice(index, i)
        const rest = code.slice(i)
        return [`${dash}${slice}`, rest]
      }
      hasDot = true
      continue
    }
    const slice = code.slice(index, i)
    const rest = code.slice(i)
    return [`${dash}${slice}`, rest]
  }
  return [code, '']
}
/** Scans for the next number token */
// prettier-ignore
export function Number(code: string) {
  return NextNumber(Trim.TrimAll(code))
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
// prettier-ignore
function NextString(options: string[], code: string): [] | [string, string] {
  const first = code.charAt(0)
  if(!options.includes(first)) return []
  const quote = first
  for(let i = 1; i < code.length; i++) {
    const char = code.charAt(i)
    if(char === quote) {
      const slice = code.slice(1, i)
      const rest = code.slice(i + 1)
      return [slice, rest]
    }
  }
  return []
}
/** Scans the next Literal String value */
// prettier-ignore
export function String(options: string[], code: string) {
  return NextString(options, Trim.TrimAll(code))
}
