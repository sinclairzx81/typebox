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
import { Unique } from './_unique.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema, CheckSchema } from './schema.ts'

// ------------------------------------------------------------------
// Valid
// ------------------------------------------------------------------
function IsValid(schema: Schema.XMaxContains): schema is Schema.XMaxContains & Schema.XContains {
  return Schema.IsContains(schema)
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildMaxContains(stack: Stack, context: BuildContext, schema: Schema.XMaxContains, value: string): string {
  if (!IsValid(schema)) return E.Constant(true)
  const [result, item] = [Unique(), Unique()]
  const count = E.Call(E.Member(value, 'reduce'), [E.ArrowFunction([result, item], E.Ternary(BuildSchema(stack, context, schema.contains, item), E.PrefixIncrement(result), result)), E.Constant(0)])
  return E.IsLessEqualThan(count, E.Constant(schema.maxContains))
}

// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckMaxContains(stack: Stack, context: CheckContext, schema: Schema.XMaxContains, value: unknown[]): boolean {
  if (!IsValid(schema)) return true

  const count = value.reduce<number>((result, item) => CheckSchema(stack, context, schema.contains, item) ? ++result : result, 0)
  return G.IsLessEqualThan(count, schema.maxContains)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorMaxContains(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XMaxContains, value: unknown[]): boolean {
  const minContains = Schema.IsMinContains(schema) ? schema.minContains : 1
  return CheckMaxContains(stack, context, schema, value) || context.AddError({
    keyword: 'contains',
    schemaPath,
    instancePath,
    params: { minContains, maxContains: schema.maxContains },
  })
}