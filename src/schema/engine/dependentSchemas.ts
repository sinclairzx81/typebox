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
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildDependentSchemas(stack: Stack, context: BuildContext, schema: Schema.XDependentSchemas, value: string): string {
  const isLength = E.IsEqual(E.Member(E.Keys(value), 'length'), E.Constant(0))
  const isEvery = E.ReduceAnd(G.Entries(schema.dependentSchemas).map(([key, schema]) => {
    const notKey = E.Not(E.HasPropertyKey(value, E.Constant(key)))
    const isSchema = BuildSchema(stack, context, schema, value)
    return E.Or(notKey, isSchema)
  }))
  return E.Or(isLength, isEvery)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckDependentSchemas(stack: Stack, context: CheckContext, schema: Schema.XDependentSchemas, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEvery = G.Every(G.Entries(schema.dependentSchemas), 0, ([key, schema]) => {
    return !G.HasPropertyKey(value, key) || 
      CheckSchema(stack, context, schema, value)
  })
  return isLength || isEvery
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorDependentSchemas(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XDependentSchemas, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEvery = G.EveryAll(G.Entries(schema.dependentSchemas), 0, ([key, schema]) => {
    const nextSchemaPath = `${schemaPath}/dependentSchemas/${key}`
    return !G.HasPropertyKey(value, key) || 
      ErrorSchema(stack, context, nextSchemaPath, instancePath, schema, value)
  })
  return isLength || isEvery
}
