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

import * as t from '@sinclair/typebox'
import { Type, TType } from './parser'

// ------------------------------------------------------------------
// NoInfer
// ------------------------------------------------------------------
/** `[Experimental]` Parses a TypeScript annotation into a TypeBox type but does not infer schematics */
export function NoInfer<Context extends Record<PropertyKey, t.TSchema>, Code extends string>(context: Context, code: Code, options?: t.SchemaOptions): t.TSchema
/** `[Experimental]` Parses a TypeScript annotation into a TypeBox type but does not infer schematics */
export function NoInfer<Code extends string>(code: Code, options?: t.SchemaOptions): t.TSchema
/** `[Experimental]` Parses a TypeScript annotation into a TypeBox type but does not infer schematics */
// prettier-ignore
export function NoInfer(...args: any[]): t.TSchema {
  const withContext = typeof args[0] === 'string' ? false : true
  const [context, code, options] = withContext ? [args[0], args[1], args[2] || {}] : [{}, args[0], args[1] || {}]
  const result = Type(code, context)[0]
  return t.KindGuard.IsSchema(result) 
    ? t.CloneType(result, options) 
    : t.Never(options)
}

/** `[Experimental]` Parses a TypeScript annotation into a TypeBox type */
// prettier-ignore
export type TSyntax<Context extends Record<PropertyKey, t.TSchema>, Code extends string> = (
  TType<Code, Context> extends [infer Type extends t.TSchema, string] ? Type : t.TNever
)
/** `[Experimental]` Parses a TypeScript annotation into a TypeBox type */
export function Syntax<Context extends Record<PropertyKey, t.TSchema>, Annotation extends string>(context: Context, annotation: Annotation, options?: t.SchemaOptions): TSyntax<Context, Annotation>
/** `[Experimental]` Parses a TypeScript annotation into a TypeBox type */
export function Syntax<Annotation extends string>(annotation: Annotation, options?: t.SchemaOptions): TSyntax<{}, Annotation>
/** `[Experimental]` Parses a TypeScript annotation into a TypeBox type */
export function Syntax(...args: any[]): never {
  return NoInfer.apply(null, args as never) as never
}
