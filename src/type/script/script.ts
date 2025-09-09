/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

// deno-lint-ignore-file
// deno-fmt-ignore-file

import { Arguments } from '../../system/arguments/index.ts'
import { Memory } from '../../system/memory/index.ts'
import { Guard } from '../../guard/index.ts'
import type { TArrayOptions, TIntersectOptions, TNumberOptions, TObjectOptions, TStringOptions, TTupleOptions } from '../../type/index.ts'
import { type TInstantiateType, InstantiateType } from '../engine/instantiate.ts'
import { type TNever, type TSchema, type TProperties, Never } from '../types/index.ts'

import * as Parser from './parser.ts'

// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
export type TScriptOptions = TArrayOptions | TIntersectOptions | TNumberOptions | TObjectOptions | TStringOptions | TTupleOptions

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Parses a string-based TypeScript type expression into a TypeBox type. */
export type TScript<Context extends TProperties, Input extends string> = (
  Parser.TScript<Input> extends [infer Type extends TSchema, string]
  ? TInstantiateType<Context, { callstack: [] }, Type>
  : TNever
)
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Parses a type from a TypeScript type expression */
export function Script<Script extends string>(input: Script): TScript<{}, Script>
/** Parses a type from a TypeScript type expression */
export function Script<Context extends TProperties, Script extends string>(context: Context, input: Script): TScript<Context, Script>
/** Parses a type from a TypeScript type expression */
export function Script<Script extends string>(input: Script, options: TScriptOptions): TScript<{}, Script>
/** Parses a type from a TypeScript type expression */
export function Script<Context extends TProperties, Script extends string>(context: Context, input: Script, options: TScriptOptions): TScript<Context, Script>
/** Parses a type from a TypeScript type expression */
export function Script(...args: unknown[]): never {
  const [context, input, options] = Arguments.Match<[TProperties, string, TScriptOptions]>(args, {
    2: (script, options) => Guard.IsString(script) ? [{}, script, options] : [script, options, {}],
    3: (context, script, options) => [context, script, options],
    1: (script) => [{}, script, {}],
  })
  const result = Parser.Script(input)
  const parsed = Guard.IsArray(result) && Guard.IsEqual(result.length, 2)
    ? InstantiateType(context, { callstack: [] }, result[0] as never)
    : Never()
  return Memory.Update(parsed, {}, options) as never
}
