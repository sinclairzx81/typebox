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

import * as S from '../types/index.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildContext, CheckContext, ErrorContext, AccumulatedErrorContext } from './_context.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'
import { Reducer } from './_reducer.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
function BuildAnyOfStandard(context: BuildContext, schema: S.XAnyOf, value: string): string {
  return Reducer(context, schema.anyOf, value, E.IsGreaterThan(E.Member('results', 'length'), E.Constant(0)))
}
function BuildAnyOfFast(context: BuildContext, schema: S.XAnyOf, value: string): string {
  return E.ReduceOr(schema.anyOf.map((schema) => BuildSchema(context, schema, value)))
}
export function BuildAnyOf(context: BuildContext, schema: S.XAnyOf, value: string): string {
  return context.UseUnevaluated() 
    ? BuildAnyOfStandard(context, schema, value) 
    : BuildAnyOfFast(context, schema, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckAnyOf(context: CheckContext, schema: S.XAnyOf, value: unknown): boolean {
  const results = schema.anyOf.reduce<CheckContext[]>((result, schema, index) => {
    const nextContext = context.Clone()
    return CheckSchema(nextContext, schema, value) ? [...result, nextContext] : result
  }, [])
  return G.IsGreaterThan(results.length, 0) && context.Merge(results)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorAnyOf(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XAnyOf, value: unknown): boolean {
  const failedContexts: AccumulatedErrorContext[] = []
  const results = schema.anyOf.reduce<AccumulatedErrorContext[]>((result, schema, index) => {
    const nextContext = new AccumulatedErrorContext(context.GetContext(), context.GetSchema())
    const nextSchemaPath = `${schemaPath}/anyOf/${index}`
    const isSchema = ErrorSchema(nextContext, nextSchemaPath, instancePath, schema, value)
    if (!isSchema) failedContexts.push(nextContext)
    return isSchema ? [...result, nextContext] : result
  }, [])
  const isAnyOf = G.IsGreaterThan(results.length, 0) && context.Merge(results)
  if (!isAnyOf) failedContexts.forEach(failed => failed.GetErrors().forEach(error => context.AddError(error)))
  return isAnyOf || context.AddError({
    keyword: 'anyOf',
    schemaPath: `${schemaPath}/anyOf`,
    instancePath,
    params: {}
  })
}