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
import { BuildContext, CheckContext, ErrorContext, AccumulatedErrorContext } from './_context.ts'
import { Reducer } from './_reducer.ts'
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
function BuildAllOfStandard(stack: Stack, context: BuildContext, schema: Schema.XAllOf, value: string): string {
  return Reducer(stack, context, schema.allOf, value, E.IsEqual(E.Member('results', 'length'), E.Constant(schema.allOf.length)))
}
function BuildAllOfFast(stack: Stack, context: BuildContext, schema: Schema.XAllOf, value: string): string {
  return E.ReduceAnd(schema.allOf.map((schema) => BuildSchema(stack, context, schema, value)))
}
export function BuildAllOf(stack: Stack, context: BuildContext, schema: Schema.XAllOf, value: string): string {
  return context.UseUnevaluated() 
    ? BuildAllOfStandard(stack, context, schema, value) 
    : BuildAllOfFast(stack, context, schema, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckAllOf(stack: Stack, context: CheckContext, schema: Schema.XAllOf, value: unknown): boolean {
  const results = schema.allOf.reduce<CheckContext[]>((result, schema) => {
    const nextContext = new CheckContext()
    return CheckSchema(stack, nextContext, schema, value) ? [...result, nextContext] : result
  }, [])
  return G.IsEqual(results.length, schema.allOf.length) && context.Merge(results)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorAllOf(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XAllOf, value: unknown): boolean {
  const failedContexts: AccumulatedErrorContext[] = []
  const results = schema.allOf.reduce<AccumulatedErrorContext[]>((result, schema, index) => {
    const nextSchemaPath = `${schemaPath}/allOf/${index}`
    const nextContext = new AccumulatedErrorContext()
    const isSchema = ErrorSchema(stack, nextContext, nextSchemaPath, instancePath, schema, value)
    if (!isSchema) failedContexts.push(nextContext)
    return isSchema ? [...result, nextContext] : result
  }, [])
  const isAllOf = G.IsEqual(results.length, schema.allOf.length) && context.Merge(results)
  if (!isAllOf) failedContexts.forEach(failed => failed.GetErrors().forEach(error => context.AddError(error)))
  return isAllOf
}
