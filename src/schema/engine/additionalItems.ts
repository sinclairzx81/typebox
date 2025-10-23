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
import { Unique } from './_unique.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Valid
// ------------------------------------------------------------------
function IsValid(schema: Schema.XSchemaObject): schema is Schema.XItems & { items: Schema.XSchema[] } {
  return Schema.IsItems(schema) && G.IsArray(schema.items)
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildAdditionalItems(stack: Stack, context: BuildContext, schema: Schema.XAdditionalItems, value: string): string {
  if (!IsValid(schema)) return E.Constant(true)
  const [item, index] = [Unique(), Unique()]
  const isSchema = BuildSchema(stack, context, schema.additionalItems, item)
  const isLength = E.IsLessThan(index, E.Constant(schema.items.length))
  const addIndex = context.AddIndex(index)
  const guarded = context.UseUnevaluated() ? E.Or(isLength, E.And(isSchema, addIndex)) : E.Or(isLength, isSchema)
  return E.Call(E.Member(value, 'every'), [E.ArrowFunction([item, index], guarded)])
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckAdditionalItems(stack: Stack, context: CheckContext, schema: Schema.XAdditionalItems, value: unknown[]): boolean {
  if (!IsValid(schema)) return true
  const isAdditionalItems = value.every((item, index) => {
    return G.IsLessThan(index, schema.items.length) 
      || (CheckSchema(stack, context, schema.additionalItems, item) && context.AddIndex(index))
  })
  return isAdditionalItems
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorAdditionalItems(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XAdditionalItems, value: unknown[]): boolean {
  if (!IsValid(schema)) return true
  const isAdditionalItems = value.every((item, index) => {
    const nextSchemaPath = `${schemaPath}/additionalItems`
    const nextInstancePath = `${instancePath}/${index}`
    return G.IsLessThan(index, schema.items.length) || 
      (ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema.additionalItems, item) && context.AddIndex(index))
  })
  return isAdditionalItems
}