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
import * as Pointer from '../pointer/index.ts'
import * as Stack from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
// Each dependent schema is evaluated in its own context and its annotations are merged
// into the parent only when it passes. This keeps keys evaluated by the enclosing schema
// out of any unevaluated keywords nested inside the dependent schema.
function BuildDependentSchema(stack: Stack.XStack, context: BuildContext, schema: Schema.XSchema, value: string): string {
  if (!context.UseUnevaluated()) return BuildSchema(stack, context, schema, value)
  const contextDependent = E.ConstDeclaration('context_dependent', E.New('CheckContext', []))
  const isSchema = E.Call(E.ArrowFunction(['context'], BuildSchema(stack, context, schema, value)), ['context_dependent'])
  const returns = E.Return(E.And(isSchema, context.Merge(E.ArrayLiteral(['context_dependent']))))
  return E.Call(E.ArrowFunction([], E.Statements([contextDependent, returns])), [])
}
export function BuildDependentSchemas(stack: Stack.XStack, context: BuildContext, schema: Schema.XDependentSchemas, value: string): string {
  const isLength = E.IsEqual(E.Member(E.Keys(value), 'length'), E.Constant(0))
  const isEvery = E.ReduceAnd(G.Entries(schema.dependentSchemas).map(([key, schema]) => {
    const notKey = E.Not(E.HasPropertyKey(value, E.Constant(key)))
    const isSchema = BuildDependentSchema(stack, context, schema, value)
    return E.Or(notKey, isSchema)
  }))
  return E.Or(isLength, isEvery)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckDependentSchemas(stack: Stack.XStack, context: CheckContext, schema: Schema.XDependentSchemas, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEvery = G.Every(G.Entries(schema.dependentSchemas), 0, ([key, schema]) => {
    const nextContext = new CheckContext()
    return !G.HasPropertyKey(value, key) ||
      (CheckSchema(stack, nextContext, schema, value) && context.Merge([nextContext]))
  })
  return isLength || isEvery
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorDependentSchemas(stack: Stack.XStack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XDependentSchemas, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEvery = G.EveryAll(G.Entries(schema.dependentSchemas), 0, ([key, schema]) => {
    const nextSchemaPath = `${schemaPath}/dependentSchemas/${Pointer.EncodeFragment(key)}`
    const nextContext = new ErrorContext()
    if (!G.HasPropertyKey(value, key)) return true
    const isSchema = ErrorSchema(stack, nextContext, nextSchemaPath, instancePath, schema, value)
    return isSchema ? context.Merge([nextContext]) : context.AddErrors(nextContext.GetErrors())
  })
  return isLength || isEvery
}
