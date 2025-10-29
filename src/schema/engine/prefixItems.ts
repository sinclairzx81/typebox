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
export function BuildPrefixItems(stack: Stack, context: BuildContext, schema: Schema.XPrefixItems, value: string): string {
  return E.ReduceAnd(schema.prefixItems.map((schema, index) => {
    const isLength = E.IsLessEqualThan(E.Member(value, 'length'), E.Constant(index))
    const isSchema = BuildSchema(stack, context, schema, `${value}[${index}]`)
    const addIndex = context.AddIndex(E.Constant(index))
    const guarded = context.UseUnevaluated() ? E.And(isSchema, addIndex) : isSchema
    return E.Or(isLength, guarded)
  }))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckPrefixItems(stack: Stack, context: CheckContext, schema: Schema.XPrefixItems, value: unknown[]): boolean {
  return G.IsEqual(value.length, 0) || G.Every(schema.prefixItems, 0, (schema, index) => {
    return G.IsLessEqualThan(value.length, index) 
      || (CheckSchema(stack, context, schema, value[index]) && context.AddIndex(index))
  })
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorPrefixItems(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XPrefixItems, value: unknown[]): boolean {
  return G.IsEqual(value.length, 0) || G.EveryAll(schema.prefixItems, 0, (schema, index) => {
    const nextSchemaPath = `${schemaPath}/prefixItems/${index}`
    const nextInstancePath = `${instancePath}/${index}`
    return G.IsLessEqualThan(value.length, index) 
      || (ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index))
  })
}
