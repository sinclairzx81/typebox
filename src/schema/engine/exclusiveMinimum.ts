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

// deno-fmt-ignore-file

import * as Schema from '../types/index.ts'
import { Stack } from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildExclusiveMinimum(stack: Stack, context: BuildContext, schema: Schema.XExclusiveMinimum, value: string): string {
  return E.IsGreaterThan(value, E.Constant(schema.exclusiveMinimum))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckExclusiveMinimum(stack: Stack, context: CheckContext, schema: Schema.XExclusiveMinimum, value: number | bigint): boolean {
  return G.IsGreaterThan(value, schema.exclusiveMinimum)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorExclusiveMinimum(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XExclusiveMinimum, value: number | bigint): boolean {
  return CheckExclusiveMinimum(stack, context, schema, value) || context.AddError({
    keyword: 'exclusiveMinimum',
    schemaPath,
    instancePath,
    params: { comparison: '>', limit: schema.exclusiveMinimum }
  })
}