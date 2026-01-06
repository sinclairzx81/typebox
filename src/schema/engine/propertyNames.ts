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
import { BuildContext, CheckContext, ErrorContext, AccumulatedErrorContext } from './_context.ts'
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildPropertyNames(stack: Stack, context: BuildContext, schema: Schema.XPropertyNames, value: string): string {
  const [key, _index] = [Unique(), Unique()]
  return E.Every(E.Keys(value), E.Constant(0), [key, _index],  BuildSchema(stack, context, schema.propertyNames, key))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckPropertyNames(stack: Stack, context: CheckContext, schema: Schema.XPropertyNames, value: Record<PropertyKey, unknown>): boolean {
  return G.Every(G.Keys(value), 0, (key, _index) => CheckSchema(stack, context, schema.propertyNames, key))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorPropertyNames(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XPropertyNames, value: Record<PropertyKey, unknown>): boolean {
  const propertyNames: string[] = []
  const isPropertyNames = G.EveryAll(G.Keys(value), 0, (key, _index) => {
    const nextInstancePath = `${instancePath}/${key}`
    const nextSchemaPath = `${schemaPath}/propertyNames`
    const nextContext = new AccumulatedErrorContext()
    const isPropertyName = ErrorSchema(stack, nextContext, nextSchemaPath, nextInstancePath, schema.propertyNames, key)
    if (!isPropertyName) propertyNames.push(key)
    return isPropertyName
  })
  return isPropertyNames || context.AddError({
    keyword: 'propertyNames',
    schemaPath,
    instancePath,
    params: { propertyNames }
  })
}
