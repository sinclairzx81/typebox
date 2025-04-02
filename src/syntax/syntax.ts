/*--------------------------------------------------------------------------

@sinclair/typebox/syntax

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import * as t from '../type/index'
import { Type, TType } from './parser'

// ------------------------------------------------------------------
// NoInfer
// ------------------------------------------------------------------
/** `[Experimental]` Parses type expressions into TypeBox types but does not infer */
export function NoInfer<Context extends Record<PropertyKey, t.TSchema>, Input extends string>(context: Context, input: Input, options?: t.SchemaOptions): t.TSchema
/** `[Experimental]` Parses type expressions into TypeBox types but does not infer */
export function NoInfer<Input extends string>(input: Input, options?: t.SchemaOptions): t.TSchema
/** `[Experimental]` Parses type expressions into TypeBox types but does not infer */
// prettier-ignore
export function NoInfer(...args: any[]): t.TSchema {
  const withContext = typeof args[0] === 'string' ? false : true
  const [context, code, options] = withContext ? [args[0], args[1], args[2] || {}] : [{}, args[0], args[1] || {}]
  const result = Type(code, context)[0]
  return t.KindGuard.IsSchema(result) 
    ? t.CloneType(result, options) 
    : t.Never(options)
}

/** `[Experimental]` Parses type expressions into TypeBox types */
// prettier-ignore
export type TSyntax<Context extends Record<PropertyKey, t.TSchema>, Code extends string> = (
  TType<Code, Context> extends [infer Type extends t.TSchema, string] ? Type : t.TNever
)
/** `[Experimental]` Parses type expressions into TypeBox types */
export function Syntax<Context extends Record<PropertyKey, t.TSchema>, Input extends string>(context: Context, input: Input, options?: t.SchemaOptions): TSyntax<Context, Input>
/** `[Experimental]` Parses type expressions into TypeBox types */
export function Syntax<Input extends string>(annotation: Input, options?: t.SchemaOptions): TSyntax<{}, Input>
/** `[Experimental]` Parses type expressions into TypeBox types */
export function Syntax(...args: any[]): never {
  return NoInfer.apply(null, args as never) as never
}
