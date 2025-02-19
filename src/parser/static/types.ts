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
// Mapping
// ------------------------------------------------------------------
/**
 * `[ACTION]` Inference mapping base type. Used to specify semantic actions for
 * Parser productions. This type is implemented as a higher-kinded type where
 * productions are received on the `input` property with mapping assigned
 * the `output` property. The parsing context is available on the `context`
 * property.
 */
export interface IMapping {
  context: unknown
  input: unknown
  output: unknown
}

/** `[ACTION]` Default inference mapping. */
export interface Identity extends IMapping {
  output: this['input']
}

/** `[ACTION]` Maps the given argument `T` as the mapping output */
export interface As<T> extends IMapping {
  output: T
}
// ------------------------------------------------------------------
// Parser
// ------------------------------------------------------------------
/** Base type Parser implemented by all other parsers */
export interface IParser<Mapping extends IMapping = Identity> {
  type: string
  mapping: Mapping
}

// ------------------------------------------------------------------
// Context
// ------------------------------------------------------------------
/** `[Context]` Creates a Context Parser */
export interface Context<Left extends IParser = IParser, Right extends IParser = IParser, Mapping extends IMapping = Identity> extends IParser<Mapping> {
  type: 'Context'
  left: Left
  right: Right
}

// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
/** `[EBNF]` Creates an Array Parser */
export interface Array<Parser extends IParser = IParser, Mapping extends IMapping = Identity> extends IParser<Mapping> {
  type: 'Array'
  parser: Parser
}

// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
/** `[TERM]` Creates a Const Parser */
export interface Const<Value extends string = string, Mapping extends IMapping = Identity> extends IParser<Mapping> {
  type: 'Const'
  value: Value
}

// ------------------------------------------------------------------
// Ident
// ------------------------------------------------------------------
/** `[TERM]` Creates an Ident Parser. */
// prettier-ignore
export interface Ident<Mapping extends IMapping = Identity> extends IParser<Mapping> {
  type: 'Ident'
}

// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
/** `[TERM]` Creates a Number Parser. */
// prettier-ignore
export interface Number<Mapping extends IMapping = Identity> extends IParser<Mapping> {
  type: 'Number'
}

// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
/** `[EBNF]` Creates a Optional Parser */
export interface Optional<Parser extends IParser = IParser, Mapping extends IMapping = Identity> extends IParser<Mapping> {
  type: 'Optional'
  parser: Parser
}

// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
/** `[TERM]` Creates a String Parser. Options are an array of permissable quote characters */
export interface String<Options extends string[], Mapping extends IMapping = Identity> extends IParser<Mapping> {
  type: 'String'
  quote: Options
}

// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
/** `[BNF]` Creates a Tuple Parser */
export interface Tuple<Parsers extends IParser[] = [], Mapping extends IMapping = Identity> extends IParser<Mapping> {
  type: 'Tuple'
  parsers: [...Parsers]
}

// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
/** `[BNF]` Creates a Union Parser */
export interface Union<Parsers extends IParser[] = [], Mapping extends IMapping = Identity> extends IParser<Mapping> {
  type: 'Union'
  parsers: [...Parsers]
}
