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
function BuildOneOfUnevaluated(stack: Stack, context: BuildContext, schema: Schema.XOneOf, value: string): string {
  return Reducer(stack, context, schema.oneOf, value, E.IsEqual(E.Member('results', 'length'), E.Constant(1)))
}
function BuildOneOfFast(stack: Stack, context: BuildContext, schema: Schema.XOneOf, value: string): string {
  const results = E.ArrayLiteral(schema.oneOf.map((schema) => BuildSchema(stack, context, schema, value)))
  const count = E.Call(E.Member(results, 'reduce'), [
    E.ArrowFunction(['count', 'result'], E.Ternary(E.IsEqual('result', E.Constant(true)), E.PrefixIncrement('count'), 'count')),
    E.Constant(0),
  ])
  return E.IsEqual(count, E.Constant(1))
}
export function BuildOneOf(stack: Stack, context: BuildContext, schema: Schema.XOneOf, value: string): string {
  return context.UseUnevaluated() ? BuildOneOfUnevaluated(stack, context, schema, value) : BuildOneOfFast(stack, context, schema, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckOneOf(stack: Stack, context: CheckContext, schema: Schema.XOneOf, value: unknown): boolean {
  const passedContexts = schema.oneOf.reduce<CheckContext[]>((result, schema) => {
    const nextContext = new CheckContext()
    return CheckSchema(stack, nextContext, schema, value) ? [...result, nextContext] : result
  }, [])
  return G.IsEqual(passedContexts.length, 1) && context.Merge(passedContexts)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorOneOf(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XOneOf, value: unknown): boolean {
  const failedContexts: AccumulatedErrorContext[] = []
  const passingSchemas: number[] = []

  const passedContexts = schema.oneOf.reduce<AccumulatedErrorContext[]>((result, schema, index) => {
    const nextContext = new AccumulatedErrorContext()
    const nextSchemaPath = `${schemaPath}/oneOf/${index}`
    const isSchema = ErrorSchema(stack, nextContext, nextSchemaPath, instancePath, schema, value)
    if (isSchema) passingSchemas.push(index)
    if (!isSchema) failedContexts.push(nextContext)
    return isSchema ? [...result, nextContext] : result
  }, [])

  const isOneOf = G.IsEqual(passedContexts.length, 1) && context.Merge(passedContexts)
  if (!isOneOf && G.IsEqual(passingSchemas.length, 0)) failedContexts.forEach(failed => failed.GetErrors().forEach(error => context.AddError(error)))
  return isOneOf || context.AddError({
    keyword: 'oneOf',
    schemaPath,
    instancePath,
    params: { passingSchemas },
  })
}
