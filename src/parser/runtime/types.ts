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

export type IModuleProperties = Record<PropertyKey, IParser>

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------

/** Infers the Output Parameter for a Parser */
export type StaticParser<Parser extends IParser> = Parser extends IParser<infer Output extends unknown> ? Output : unknown

// ------------------------------------------------------------------
// Mapping
// ------------------------------------------------------------------
export type IMapping<Input extends unknown = any, Output extends unknown = unknown> = (input: Input, context: any) => Output

/** Maps input to output. This is the default Mapping */
export const Identity = (value: unknown) => value

/** Maps the output as the given parameter T */
export const As =
  <T>(mapping: T): ((value: unknown) => T) =>
  (_: unknown) =>
    mapping

// ------------------------------------------------------------------
// Parser
// ------------------------------------------------------------------
export interface IParser<Output extends unknown = unknown> {
  type: string
  mapping: IMapping<any, Output>
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
export type TupleParameter<Parsers extends IParser[], Result extends unknown[] = []> = Parsers extends [infer L extends IParser, ...infer R extends IParser[]] ? TupleParameter<R, [...Result, StaticParser<L>]> : Result
export interface ITuple<Output extends unknown = unknown> extends IParser<Output> {
  type: 'Tuple'
  parsers: IParser[]
}
/** Creates a Tuple parser */
export function Tuple<Parsers extends IParser[], Mapping extends IMapping = IMapping<TupleParameter<Parsers>>>(parsers: [...Parsers], mapping: Mapping): ITuple<ReturnType<Mapping>>
/** Creates a Tuple parser */
export function Tuple<Parsers extends IParser[]>(parsers: [...Parsers]): ITuple<TupleParameter<Parsers>>
export function Tuple(...args: unknown[]): never {
  const [parsers, mapping] = args.length === 2 ? [args[0], args[1]] : [args[0], Identity]
  return { type: 'Tuple', parsers, mapping } as never
}

// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
export type UnionParameter<Parsers extends IParser[], Result extends unknown = never> = Parsers extends [infer L extends IParser, ...infer R extends IParser[]] ? UnionParameter<R, Result | StaticParser<L>> : Result
export interface IUnion<Output extends unknown = unknown> extends IParser<Output> {
  type: 'Union'
  parsers: IParser[]
}
/** Creates a Union parser */
export function Union<Parsers extends IParser[], Mapping extends IMapping = IMapping<UnionParameter<Parsers>>>(parsers: [...Parsers], mapping: Mapping): IUnion<ReturnType<Mapping>>
/** Creates a Union parser */
export function Union<Parsers extends IParser[]>(parsers: [...Parsers]): IUnion<UnionParameter<Parsers>>
export function Union(...args: unknown[]): never {
  const [parsers, mapping] = args.length === 2 ? [args[0], args[1]] : [args[0], Identity]
  return { type: 'Union', parsers, mapping } as never
}

// ------------------------------------------------------------------
// Token
// ------------------------------------------------------------------
export interface IConst<Output extends unknown = unknown> extends IParser<Output> {
  type: 'Const'
  value: string
}
/** Creates a Const parser */
export function Const<Value extends string, Mapping extends IMapping<Value>>(value: Value, mapping: Mapping): IConst<ReturnType<Mapping>>
/** Creates a Const parser */
export function Const<Value extends string>(value: Value): IConst<Value>
export function Const(...args: unknown[]): never {
  const [value, mapping] = args.length === 2 ? [args[0], args[1]] : [args[0], Identity]
  return { type: 'Const', value, mapping } as never
}

// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
export interface IRef<Output extends unknown = unknown> extends IParser<Output> {
  type: 'Ref'
  ref: string
}
/** Creates a Ref parser */
export function Ref<Type extends unknown, Mapping extends IMapping<Type>>(ref: string, mapping: Mapping): IRef<ReturnType<Mapping>>
/** Creates a Ref parser */
export function Ref<Type extends unknown>(ref: string): IRef<Type>
export function Ref(...args: unknown[]): never {
  const [ref, mapping] = args.length === 2 ? [args[0], args[1]] : [args[0], Identity]
  return { type: 'Ref', ref, mapping } as never
}

// ------------------------------------------------------------------
// String
// ------------------------------------------------------------------
export interface IString<Output extends unknown = unknown> extends IParser<Output> {
  type: 'String'
  options: string[]
}
/** Creates a String Parser. Options are an array of permissable quote characters */
export function String<Mapping extends IMapping<string>>(options: string[], mapping: Mapping): IString<ReturnType<Mapping>>
/** Creates a String Parser. Options are an array of permissable quote characters */
export function String(options: string[]): IString<string>
export function String(...params: unknown[]): never {
  const [options, mapping] = params.length === 2 ? [params[0], params[1]] : [params[0], Identity]
  return { type: 'String', options, mapping } as never
}

// ------------------------------------------------------------------
// Ident
// ------------------------------------------------------------------
export interface IIdent<Output extends unknown = unknown> extends IParser<Output> {
  type: 'Ident'
}
/** Creates an Ident parser */
export function Ident<Mapping extends IMapping<string>>(mapping: Mapping): IIdent<ReturnType<Mapping>>
/** Creates an Ident parser */
export function Ident(): IIdent<string>
export function Ident(...params: unknown[]): never {
  const mapping = params.length === 1 ? params[0] : Identity
  return { type: 'Ident', mapping } as never
}

// ------------------------------------------------------------------
// Number
// ------------------------------------------------------------------
export interface INumber<Output extends unknown = unknown> extends IParser<Output> {
  type: 'Number'
}
/** Creates a Number parser */
export function Number<Mapping extends IMapping<string>>(mapping: Mapping): INumber<ReturnType<Mapping>>
/** Creates a Number parser */
export function Number(): INumber<string>
export function Number(...params: unknown[]): never {
  const mapping = params.length === 1 ? params[0] : Identity
  return { type: 'Number', mapping } as never
}
