/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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

// deno-fmt-ignore-file
// deno-lint-ignore-file

import { Arguments } from '../system/arguments/index.ts'
import * as Engine from './engine/index.ts'
import * as Schema from './types/index.ts'
import * as Static from './static/index.ts'

// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
/** Checks a value against the provided schema */
export function Check<const Schema extends Schema.XSchema>(schema: Schema, value: unknown): value is Static.XStatic<Schema>
/** Checks a value against the provided schema */
export function Check<const Schema extends Schema.XSchema>(context: Record<PropertyKey, Schema.XSchema>, schema: Schema, value: unknown):  value is Static.XStatic<Schema>
/** Checks a value against the provided schema */
export function Check(...args: unknown[]): boolean {
  const [context, schema, value] = Arguments.Match<[Record<PropertyKey, Schema.XSchema>, Schema.XSchema, unknown]>(args, {
    3: (context, schema, value) => [context, schema, value],
    2: (schema, value) => [{}, schema, value]
  })
  const stack = new Engine.Stack(context, schema)
  const checkContext = new Engine.CheckContext()
  return Engine.CheckSchema(stack, checkContext, schema, value)
}