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

import { IsEqual } from './guard.ts'
import * as Char from './char.ts'

// ------------------------------------------------------------------
// Comments
// ------------------------------------------------------------------
type LineComment = typeof LineComment
type OpenComment = typeof OpenComment
type CloseComment = typeof CloseComment

const LineComment = '//'
const OpenComment = '/*'
const CloseComment = '*/'

// ------------------------------------------------------------------
// DiscardMultiLineComment
// ------------------------------------------------------------------
type TDiscardMultiLineComment<Input extends string> = (
  Input extends `${string}${CloseComment}${infer Rest extends string}` ? Rest :
  ''
)
function DiscardMultilineComment<Input extends string>(input: Input): TDiscardMultiLineComment<Input> {
  const index = input.indexOf(CloseComment)
  const result = IsEqual(index, -1) ? '' : input.slice(index + 2)
  return result as never
}
// ------------------------------------------------------------------
// DiscardLineComment
// ------------------------------------------------------------------
type TDiscardLineComment<Input extends string> = (
  Input extends `${string}${Char.TNewLine}${infer Rest extends string}` 
    ? TTrimWhitespace<`${Char.TNewLine}${Rest}`> 
    : ''
)
function DiscardLineComment<Input extends string>(input: Input): TDiscardLineComment<Input> {
  const index = input.indexOf(Char.NewLine)
  const result = IsEqual(index, -1) ? '' : input.slice(index)
  return result as never
}
// ------------------------------------------------------------------
// Whitespace Filters
// ------------------------------------------------------------------
type W4 = `${W3}${W3}` // 16
type W3 = `${W2}${W2}` // 8
type W2 = `${W1}${W1}` // 4
type W1 = `${W0}${W0}` // 2
type W0 = ` `          // 1
// ------------------------------------------------------------------
// TrimWhitespace
// ------------------------------------------------------------------
export type TTrimWhitespace<Input extends string> = (
  Input extends `${OpenComment}${infer Rest extends string}` ? TTrimWhitespace<TDiscardMultiLineComment<Rest>> :
  Input extends `${LineComment}${infer Rest extends string}` ? TTrimWhitespace<TDiscardLineComment<Rest>> :
  Input extends `${W4}${infer Rest extends string}` ? TTrimWhitespace<Rest> :
  Input extends `${W3}${infer Rest extends string}` ? TTrimWhitespace<Rest> :
  Input extends `${W1}${infer Rest extends string}` ? TTrimWhitespace<Rest> :
  Input extends `${W0}${infer Rest extends string}` ? TTrimWhitespace<Rest> :
  Input
)
// ...
function TrimStartUntilNewline(input: string): string {
  return input.replace(/^[ \t\r\f\v]+/, '')
}
export function TrimWhitespace<Input extends string>(input: Input): TTrimWhitespace<Input> {
  const trimmed = TrimStartUntilNewline(input)
  return (
    trimmed.startsWith(OpenComment) ? TrimWhitespace(DiscardMultilineComment(trimmed.slice(2))) :
    trimmed.startsWith(LineComment) ? TrimWhitespace(DiscardLineComment(trimmed.slice(2))) :
    trimmed
  ) as never
}
// ------------------------------------------------------------------
// Trim
// ------------------------------------------------------------------
export type TTrim<Input extends string> = (
  Input extends `${OpenComment}${infer Rest extends string}` ? TTrim<TDiscardMultiLineComment<Rest>> :
  Input extends `${LineComment}${infer Rest extends string}` ? TTrim<TDiscardLineComment<Rest>> :
  Input extends `${Char.TNewLine}${infer Rest extends string}` ? TTrim<Rest> :
  Input extends `${Char.TTabSpace}${infer Rest extends string}` ? TTrim<Rest> :
  Input extends `${W4}${infer Rest extends string}` ? TTrim<Rest> :
  Input extends `${W3}${infer Rest extends string}` ? TTrim<Rest> :
  Input extends `${W1}${infer Rest extends string}` ? TTrim<Rest> :
  Input extends `${W0}${infer Rest extends string}` ? TTrim<Rest> :
  Input
)
export function Trim<Input extends string>(input: Input): TTrim<Input> {
  const trimmed = input.trimStart()
  return (
    trimmed.startsWith(OpenComment) ? Trim(DiscardMultilineComment(trimmed.slice(2))) :
    trimmed.startsWith(LineComment) ? Trim(DiscardLineComment(trimmed.slice(2))) :
    trimmed
  ) as never
}
// deno-coverage-ignore-stop
