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
  export type Empty = ''
  export type Space = ' '
  export type Newline = '\n'
  export type Dot = '.'
  export type Hyphen = '-'
  export type Digit = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ]
  export type Alpha = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 
    'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 
    'Y', 'Z'
  ]
}

// ------------------------------------------------------------------
// Trim
// ------------------------------------------------------------------
// prettier-ignore
namespace Trim {
  // ------------------------------------------------------------------
  // Whitespace Filters
  // ------------------------------------------------------------------
  type W9 = `${W8}${W8}` // 512
  type W8 = `${W7}${W7}` // 256
  type W7 = `${W6}${W6}` // 128
  type W6 = `${W5}${W5}` // 64
  type W5 = `${W4}${W4}` // 32
  type W4 = `${W3}${W3}` // 16
  type W3 = `${W2}${W2}` // 8
  type W2 = `${W1}${W1}` // 4
  type W1 = `${W0}${W0}` // 2
  type W0 = ` `          // 1
  // ------------------------------------------------------------------
  // TrimWhitespace
  // ------------------------------------------------------------------
  /** Trims whitespace only */
  export type TrimWhitespace<Code extends string> = (
    Code extends `${W4}${infer Rest extends string}` ? TrimWhitespace<Rest> :
    Code extends `${W3}${infer Rest extends string}` ? TrimWhitespace<Rest> :
    Code extends `${W1}${infer Rest extends string}` ? TrimWhitespace<Rest> :
    Code extends `${W0}${infer Rest extends string}` ? TrimWhitespace<Rest> :
    Code
  )
  // ------------------------------------------------------------------
  // Trim
  // ------------------------------------------------------------------
  /** Trims Whitespace and Newline */
  export type TrimAll<Code extends string> = (
    Code extends `${W4}${infer Rest extends string}` ? TrimAll<Rest> :
    Code extends `${W3}${infer Rest extends string}` ? TrimAll<Rest> :
    Code extends `${W1}${infer Rest extends string}` ? TrimAll<Rest> :
    Code extends `${W0}${infer Rest extends string}` ? TrimAll<Rest> :
    Code extends `${Chars.Newline}${infer Rest extends string}` ? TrimAll<Rest> :
    Code
  )
}

// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
/** Scans for the next match union */
// prettier-ignore
type NextUnion<Variants extends string[], Code extends string> = (
  Variants extends [infer Variant extends string, ...infer Rest1 extends string[]]
    ? NextConst<Variant, Code> extends [infer Match extends string, infer Rest2 extends string]
      ? [Match, Rest2]
      : NextUnion<Rest1, Code>
    : []
)

// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
// prettier-ignore
type NextConst<Value extends string, Code extends string> = (
  Code extends `${Value}${infer Rest extends string}` 
    ? [Value, Rest] 
    : []
)
/** Scans for the next constant value */
// prettier-ignore
export type Const<Value extends string, Code extends string> = (
  Value extends '' ? ['', Code] :
  Value extends `${infer First extends string}${string}`
    ? (
      First extends Chars.Newline ? NextConst<Value, Trim.TrimWhitespace<Code>> :
      First extends Chars.Space ? NextConst<Value, Code> :
      NextConst<Value, Trim.TrimAll<Code>>
    ) : never
)
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
// prettier-ignore
type NextNumberNegate<Code extends string> = (
  Code extends `${Chars.Hyphen}${infer Rest extends string}` 
    ? [Chars.Hyphen, Rest]
    : [Chars.Empty, Code]
)
// prettier-ignore
type NextNumberZeroCheck<Code extends string> = (
  Code extends `0${infer Rest}`
    ? NextUnion<Chars.Digit, Rest> extends [string, string] ? false : true
    : true
)
// prettier-ignore
type NextNumberScan<Code extends string, HasDecimal extends boolean = false, Result extends string = Chars.Empty> = (
  NextUnion<[...Chars.Digit, Chars.Dot], Code> extends [infer Char extends string, infer Rest extends string]
    ? Char extends Chars.Dot
      ? HasDecimal extends false
        ? NextNumberScan<Rest, true, `${Result}${Char}`>
        : [Result, `.${Rest}`]
      : NextNumberScan<Rest, HasDecimal, `${Result}${Char}`>
    : [Result, Code]
)
// prettier-ignore
export type NextNumber<Code extends string> = (
  NextNumberNegate<Code> extends [infer Negate extends string, infer Rest extends string]
    ? NextNumberZeroCheck<Rest> extends true 
      ? NextNumberScan<Rest> extends [infer Number extends string, infer Rest2 extends string]
        ? Number extends Chars.Empty 
          ? [] 
          : [`${Negate}${Number}`, Rest2]
        : []
      : []
    : []
)
/** Scans for the next literal number */
export type Number<Code extends string> = NextNumber<Trim.TrimAll<Code>>

// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
type NextStringQuote<Options extends string[], Code extends string> = NextUnion<Options, Code>
// prettier-ignore
type NextStringBody<Code extends string, Quote extends string, Result extends string = Chars.Empty> = (
  Code extends `${infer Char extends string}${infer Rest extends string}`
    ? Char extends Quote
      ? [Result, Rest]
      : NextStringBody<Rest, Quote, `${Result}${Char}`>
    : []
)
// prettier-ignore
type NextString<Options extends string[], Code extends string> = (
  NextStringQuote<Options, Code> extends [infer Quote extends string, infer Rest extends string]
    ? NextStringBody<Rest, Quote> extends [infer String extends string, infer Rest extends string]
      ? [String, Rest]
      : []
    : []
)
/** Scans for the next literal string */
export type String<Options extends string[], Code extends string> = NextString<Options, Trim.TrimAll<Code>>

// ------------------------------------------------------------------
// Ident
// ------------------------------------------------------------------
type IdentLeft = [...Chars.Alpha, '_', '$'] // permissable first characters
type IdentRight = [...Chars.Digit, ...IdentLeft] // permissible subsequent characters

// prettier-ignore
type NextIdentScan<Code extends string, Result extends string = Chars.Empty> = (
  NextUnion<IdentRight, Code> extends [infer Char extends string, infer Rest extends string]
    ? NextIdentScan<Rest, `${Result}${Char}`>
    : [Result, Code]
)
// prettier-ignore
type NextIdent<Code extends string> = (
  NextUnion<IdentLeft, Code> extends [infer Left extends string, infer Rest1 extends string]
    ? NextIdentScan<Rest1> extends [infer Right extends string, infer Rest2 extends string]
      ? [`${Left}${Right}`, Rest2]
      : []
    : []
)

/** Scans for the next Ident */
export type Ident<Code extends string> = NextIdent<Trim.TrimAll<Code>>
