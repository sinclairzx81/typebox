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

import * as Guard from './guard'
import * as Token from './token'
import * as Types from './types'

// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
function ParseTuple<Parsers extends Types.IParser[], Properties extends Types.IModuleProperties>(parsers: [...Parsers], properties: Properties, code: string, context: unknown): [] | [unknown[], string] {
  const buffer = [] as unknown[]
  let rest = code
  for(const parser of parsers) {
    const result = ParseParser(parser, properties, rest, context)
    if(result.length === 0) return []
    buffer.push(result[0])
    rest = result[1]
  }
  return [buffer, rest]
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
function ParseUnion<Parsers extends Types.IParser[], Properties extends Types.IModuleProperties>(parsers: [...Parsers], properties: Properties, code: string, context: unknown): [] | [unknown, string] {
  for(const parser of parsers) {
    const result = ParseParser(parser, properties, code, context)
    if(result.length === 0) continue 
    return result
  }
  return []
}
// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
// prettier-ignore
function ParseConst<Value extends string>(value: Value, code: string, context: unknown): [] | [Value, string] {
  return Token.Const(value, code) as never
}
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
// prettier-ignore
function ParseRef<Ref extends string, Properties extends Types.IModuleProperties>(ref: Ref, properties: Properties, code: string, context: unknown): [] | [string, string] {
  const parser = properties[ref]
  if(!Guard.IsParser(parser))  throw Error(`Cannot dereference parser '${ref}'`)
  return ParseParser(parser, properties, code, context) as never
}
// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
// prettier-ignore
function ParseString(options: string[], code: string, _context: unknown): [] | [string, string] {
  return Token.String(options, code)
}
// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
// prettier-ignore
function ParseNumber(code: string, _context: unknown): [] | [string, string] {
  return Token.Number(code)
}
// ------------------------------------------------------------------
// Ident
// ------------------------------------------------------------------
// prettier-ignore
function ParseIdent(code: string, _context: unknown): [] | [string, string] {
  return Token.Ident(code)
}
// ------------------------------------------------------------------
// Parser
// ------------------------------------------------------------------
// prettier-ignore
function ParseParser<Parser extends Types.IParser>(parser: Parser, properties: Types.IModuleProperties, code: string, context: unknown): [] | [Types.StaticParser<Parser>, string] {
  const result = (
    Guard.IsTuple(parser) ? ParseTuple(parser.parsers, properties, code, context) :
    Guard.IsUnion(parser) ? ParseUnion(parser.parsers, properties, code, context) :
    Guard.IsConst(parser) ? ParseConst(parser.value, code, context) :
    Guard.IsRef(parser) ? ParseRef(parser.ref, properties, code, context) :
    Guard.IsString(parser) ? ParseString(parser.options, code, context) :
    Guard.IsIdent(parser) ? ParseIdent(code, context) :
    Guard.IsNumber(parser) ? ParseNumber(code, context) :
    []
  )
  return (
    result.length === 2
    ? [parser.mapping(result[0], context), result[1]]
    : result
  ) as never
}
// ------------------------------------------------------------------
// Parse
// ------------------------------------------------------------------
/** Parses content using the given parser */
// prettier-ignore
export function Parse<Parser extends Types.IParser>(parser: Parser, properties: Types.IModuleProperties, code: string, context: unknown): [] | [Types.StaticParser<Parser>, string]
/** Parses content using the given parser */
// prettier-ignore
export function Parse<Parser extends Types.IParser>(parser: Parser, properties: Types.IModuleProperties, code: string): [] | [Types.StaticParser<Parser>, string]
/** Parses content using the given parser */
// prettier-ignore
export function Parse<Parser extends Types.IParser>(parser: Parser, code: string, context: unknown): [] | [Types.StaticParser<Parser>, string]
/** Parses content using the given parser */
// prettier-ignore
export function Parse<Parser extends Types.IParser>(parser: Parser, code: string): [] | [Types.StaticParser<Parser>, string]
/** Parses content using the given parser */
// prettier-ignore
export function Parse(...args: any[]): never {
  const withProperties = typeof args[1] === 'string' ? false : true
  const [parser, properties, code, context] = withProperties 
    ? [args[0], args[1], args[2], args[3]]
    : [args[0], {}, args[1], args[2]]
  return ParseParser(parser, properties, code, context) as never
}
