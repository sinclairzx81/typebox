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
function IsValid(schema: Schema.XMinContains): schema is Schema.XMinContains & Schema.XContains {
  return Schema.IsContains(schema)
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildMinContains(stack: Stack, context: BuildContext, schema: Schema.XMinContains, value: string): string {
  if (!IsValid(schema)) return E.Constant(true)
  const [result, item] = [Unique(), Unique()]
  const count = E.Call(E.Member(value, 'reduce'), [E.ArrowFunction([result, item], E.Ternary(BuildSchema(stack, context, schema.contains, item), E.PrefixIncrement(result), result)), E.Constant(0)])
  return E.IsGreaterEqualThan(count, E.Constant(schema.minContains))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckMinContains(stack: Stack, context: CheckContext, schema: Schema.XMinContains, value: unknown[]): boolean {
  if (!IsValid(schema)) return true

  const count = value.reduce<number>((result, item) => CheckSchema(stack, context, schema.contains, item) ? ++result : result, 0)
  return G.IsGreaterEqualThan(count, schema.minContains)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorMinContains(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XMinContains, value: unknown[]): boolean {
  return CheckMinContains(stack, context, schema, value) || context.AddError({
    keyword: 'contains',
    schemaPath,
    instancePath,
    params: { minContains: schema.minContains }
  })
}


