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

import * as Schema from '../types/index.ts'
import { Stack } from './_stack.ts'
import { Unique } from './_unique.ts'

import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'
import { BuildSchema, CheckSchema } from './schema.ts'

// ------------------------------------------------------------------
// Invalid
// ------------------------------------------------------------------
function IsValid(schema: Schema.XContains): boolean {
  return !(Schema.IsMinContains(schema) && G.IsEqual(schema.minContains, 0))
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildContains(stack: Stack, context: BuildContext, schema: Schema.XContains, value: string): string {
  if (!IsValid(schema)) return E.Constant(true)
  const item = Unique()
  const isLength = E.Not(E.IsEqual(E.Member(value, 'length'), E.Constant(0)))
  const isSome = E.Call(E.Member(value, 'some'), [E.ArrowFunction([item], BuildSchema(stack, context, schema.contains, item))])
  return E.And(isLength, isSome)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckContains(stack: Stack, context: CheckContext, schema: Schema.XContains, value: unknown[]): boolean {
  if (!IsValid(schema)) return true
  return !G.IsEqual(value.length, 0) && 
    value.some((item) => CheckSchema(stack, context, schema.contains, item))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorContains(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XContains, value: unknown[]): boolean {
  return CheckContains(stack, context, schema, value) || context.AddError({
    keyword: 'contains',
    schemaPath,
    instancePath,
    params: { minContains: 1 },
  })
}