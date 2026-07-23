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
  if (!context.UseUnevaluated()) {
    const isSome = E.Call(E.Member(value, 'some'), [E.ArrowFunction([item], BuildSchema(stack, context, schema.contains, item))])
    return E.And(isLength, isSome)
  }
  // When unevaluated tracking is active, record the index of every matching
  // item so unevaluatedItems treats them as evaluated. reduce (not some) is
  // used so the scan does not short-circuit before all indices are recorded.
  const index = Unique()
  const accumulator = Unique()
  const isSome = E.Call(E.Member(value, 'reduce'), [
    E.ArrowFunction([accumulator, item, index], E.Ternary(BuildSchema(stack, context, schema.contains, item), context.AddIndex(index), accumulator)),
    E.Constant(false),
  ])
  return E.And(isLength, isSome)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckContains(stack: Stack, context: CheckContext, schema: Schema.XContains, value: unknown[]): boolean {
  // Record the index of every matching item (not just whether one exists) so
  // that unevaluatedItems treats contains-matched items as evaluated.
  let contains = false
  for (let index = 0; index < value.length; index++) {
    if (CheckSchema(stack, context, schema.contains, value[index])) {
      context.AddIndex(index)
      contains = true
    }
  }
  return contains || !IsValid(schema)
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