/*--------------------------------------------------------------------------

@sinclair/typebox/syntax

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Static } from './parsebox/index'
import { CreateType } from '../type/create/type'
import { TSchema, SchemaOptions } from '../type/schema/index'
import { StaticDecode } from '../type/static/index'
import { Module } from './runtime'
import { Type } from './static'

/** `[Experimental]` Infers a TypeBox type from TypeScript syntax. */
export type StaticParseAsSchema<Context extends Record<PropertyKey, TSchema>, Code extends string> = Static.Parse<Type, Code, Context>[0]

/** `[Experimental]` Infers a TypeScript type from TypeScript syntax. */
export type StaticParseAsType<Context extends Record<PropertyKey, TSchema>, Code extends string> = StaticParseAsSchema<Context, Code> extends infer Type extends TSchema ? StaticDecode<Type> : undefined

/** `[Experimental]` Parses a TypeBox type from TypeScript syntax. */
export function Parse<Context extends Record<PropertyKey, TSchema>, Code extends string>(context: Context, code: Code, options?: SchemaOptions): StaticParseAsSchema<Context, Code>
/** `[Experimental]` Parses a TypeBox type from TypeScript syntax. */
export function Parse<Code extends string>(code: Code, options?: SchemaOptions): StaticParseAsSchema<{}, Code>
/** `[Experimental]` Parses a TypeBox type from TypeScript syntax. */
export function Parse(...args: any[]): never {
  return ParseOnly.apply(null, args as never) as never
}

/** `[Experimental]` Parses a TypeBox TSchema from TypeScript syntax. This function does not infer the type. */
export function ParseOnly<Context extends Record<PropertyKey, TSchema>, Code extends string>(context: Context, code: Code, options?: SchemaOptions): TSchema | undefined
/** `[Experimental]` Parses a TypeBox TSchema from TypeScript syntax */
export function ParseOnly<Code extends string>(code: Code, options?: SchemaOptions): TSchema | undefined
/** `[Experimental]` Parses a TypeBox TSchema from TypeScript syntax. This function does not infer the type. */
export function ParseOnly(...args: any[]): TSchema | undefined {
  const withContext = typeof args[0] === 'string' ? false : true
  const [context, code, options] = withContext ? [args[0], args[1], args[2] || {}] : [{}, args[0], args[1] || {}]
  const type = Module.Parse('Type', code, context)[0] as TSchema | undefined
  return (type !== undefined ? CreateType(type, options) : undefined) as never
}
