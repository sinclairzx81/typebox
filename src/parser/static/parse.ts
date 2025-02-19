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

import * as Tokens from './token'
import * as Types from './types'

// ------------------------------------------------------------------
// Context
// ------------------------------------------------------------------
// prettier-ignore
type ContextParser<Left extends Types.IParser, Right extends Types.IParser, Code extends string, Context extends unknown> = (
  Parse<Left, Code, Context> extends [infer Context extends unknown, infer Rest extends string]
    ? Parse<Right, Rest, Context>
    : []
)

// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
type ArrayParser<Parser extends Types.IParser, Code extends string, Context extends unknown, Result extends unknown[] = []> = (
  Parse<Parser, Code, Context> extends [infer Value1 extends unknown, infer Rest extends string]
    ? ArrayParser<Parser, Rest, Context, [...Result, Value1]>
    : [Result, Code]
)

// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
// prettier-ignore
type ConstParser<Value extends string, Code extends string, _Context extends unknown> = (
  Tokens.Const<Value, Code> extends [infer Match extends Value, infer Rest extends string]
    ? [Match, Rest]
    : []
)

// ------------------------------------------------------------------
// Ident
// ------------------------------------------------------------------
// prettier-ignore
type IdentParser<Code extends string, _Context extends unknown> = (
  Tokens.Ident<Code> extends [infer Match extends string, infer Rest extends string]
    ? [Match, Rest]
    : []
)

// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
// prettier-ignore
type NumberParser<Code extends string, _Context extends unknown> = (
  Tokens.Number<Code> extends [infer Match extends string, infer Rest extends string]
    ? [Match, Rest]
    : []
)

// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
// prettier-ignore
type OptionalParser<Parser extends Types.IParser, Code extends string, Context extends unknown> = (
  Parse<Parser, Code, Context> extends [infer Value extends unknown, infer Rest extends string]
    ? [[Value], Rest]
    : [[], Code]
)

// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
// prettier-ignore
type StringParser<Options extends string[], Code extends string, _Context extends unknown> = (
  Tokens.String<Options, Code> extends [infer Match extends string, infer Rest extends string]
    ? [Match, Rest]
    : []
)

// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TupleParser<Parsers extends Types.IParser[], Code extends string, Context extends unknown, Result extends unknown[] = []> = (
  Parsers extends [infer Left extends Types.IParser, ...infer Right extends Types.IParser[]]
    ? Parse<Left, Code, Context> extends [infer Value extends unknown, infer Rest extends string]
      ? TupleParser<Right, Rest, Context, [...Result, Value]>
      : []
    : [Result, Code]
)

// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type UnionParser<Parsers extends Types.IParser[], Code extends string, Context extends unknown> = (
  Parsers extends [infer Left extends Types.IParser, ...infer Right extends Types.IParser[]]
    ? Parse<Left, Code, Context> extends [infer Value extends unknown, infer Rest extends string]
      ? [Value, Rest]
      : UnionParser<Right, Code, Context>
    : []
)

// ------------------------------------------------------------------
// Parse
// ------------------------------------------------------------------
// prettier-ignore
type ParseCode<Type extends Types.IParser, Code extends string, Context extends unknown = unknown> = (
  Type extends Types.Context<infer Left extends Types.IParser, infer Right extends Types.IParser> ? ContextParser<Left, Right, Code, Context> :
  Type extends Types.Array<infer Parser extends Types.IParser> ? ArrayParser<Parser, Code, Context> :
  Type extends Types.Const<infer Value extends string> ? ConstParser<Value, Code, Context> :
  Type extends Types.Ident ? IdentParser<Code, Context> :
  Type extends Types.Number ? NumberParser<Code, Context> :
  Type extends Types.Optional<infer Parser extends Types.IParser> ? OptionalParser<Parser, Code, Context> :
  Type extends Types.String<infer Options extends string[]> ? StringParser<Options, Code, Context> :
  Type extends Types.Tuple<infer Parsers extends Types.IParser[]> ? TupleParser<Parsers, Code, Context> :
  Type extends Types.Union<infer Parsers extends Types.IParser[]> ? UnionParser<Parsers, Code, Context> :
  []
)
// prettier-ignore
type ParseMapping<Parser extends Types.IParser, Result extends unknown, Context extends unknown = unknown> = (
  (Parser['mapping'] & { input: Result, context: Context })['output']
)

/** Parses code with the given parser */
// prettier-ignore
export type Parse<Type extends Types.IParser, Code extends string, Context extends unknown = unknown> = (
  ParseCode<Type, Code, Context> extends [infer L extends unknown, infer R extends string]
    ? [ParseMapping<Type, L, Context>, R]
    : []
)
