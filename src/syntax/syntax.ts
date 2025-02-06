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

import * as Types from '../type/index'
import { Static } from '../parser/index'
import { Module } from './runtime'
import { Type } from './static'

/** Infers a TSchema type from TypeScript syntax. */
// prettier-ignore
export type TSyntax<Context extends Record<PropertyKey, Types.TSchema>, Code extends string> = (
  Static.Parse<Type, Code, Context> extends [infer Type extends Types.TSchema, string] 
    ? Type
    : Types.TNever
)
/** Parses a TSchema type from TypeScript syntax */
export function Syntax<Context extends Record<PropertyKey, Types.TSchema>, Code extends string>(context: Context, code: Code, options?: Types.SchemaOptions): TSyntax<Context, Code>
/** Parses a TSchema type from TypeScript syntax */
export function Syntax<Code extends string>(code: Code, options?: Types.SchemaOptions): TSyntax<{}, Code>
/** Parses a TSchema type from TypeScript syntax */
export function Syntax(...args: any[]): never {
  return NoInfer.apply(null, args as never) as never
}
/** Parses a TSchema type from TypeScript syntax but does not infer schematics */
export function NoInfer<Context extends Record<PropertyKey, Types.TSchema>, Code extends string>(context: Context, code: Code, options?: Types.SchemaOptions): Types.TSchema | undefined
/** Parses a TSchema type from TypeScript syntax but does not infer schematics */
export function NoInfer<Code extends string>(code: Code, options?: Types.SchemaOptions): Types.TSchema | undefined
/** Parses a TSchema type from TypeScript syntax but does not infer schematics */
// prettier-ignore
export function NoInfer(...args: any[]): Types.TSchema | undefined {
  const withContext = typeof args[0] === 'string' ? false : true
  const [context, code, options] = withContext ? [args[0], args[1], args[2] || {}] : [{}, args[0], args[1] || {}]
  const type = Module.Parse('Type', code, context)[0]
  return Types.KindGuard.IsSchema(type) 
    ? Types.CloneType(type, options) 
    : Types.Never(options)
}

// ------------------------------------------------------------------
// Deprecated
// ------------------------------------------------------------------
/**
 * Parses a TSchema type from Syntax.
 * @deprecated Use Syntax() function
 */
export function Parse<Context extends Record<PropertyKey, Types.TSchema>, Code extends string>(context: Context, code: Code, options?: Types.SchemaOptions): TSyntax<Context, Code>
/**
 * Parses a TSchema type from Syntax.
 * @deprecated Use Syntax() function
 */
export function Parse<Code extends string>(code: Code, options?: Types.SchemaOptions): TSyntax<{}, Code>
/**
 * Parses a TSchema type from Syntax.
 * @deprecated Use Syntax() function
 */
export function Parse(...args: any[]): never {
  return NoInfer.apply(null, args as never) as never
}

/**
 * Parses a TSchema from TypeScript Syntax
 * @deprecated Use NoInfer() function
 */
export function ParseOnly<Context extends Record<PropertyKey, Types.TSchema>, Code extends string>(context: Context, code: Code, options?: Types.SchemaOptions): Types.TSchema | undefined
/**
 * Parses a TSchema from TypeScript Syntax
 * @deprecated Use NoInfer() function
 */
export function ParseOnly<Code extends string>(code: Code, options?: Types.SchemaOptions): Types.TSchema | undefined
/**
 * Parses a TSchema from TypeScript Syntax
 * @deprecated Use NoInfer() function
 */
export function ParseOnly(...args: any[]): Types.TSchema | undefined {
  return NoInfer.apply(null, args as never) as never
}
