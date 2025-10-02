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
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'
import { BuildContext, CheckContext, ErrorContext, AccumulatedErrorContext } from './_context.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildPropertyNames(context: BuildContext, schema: S.XPropertyNames, value: string): string {
  return E.Call(E.Member(E.Keys(value), 'every'), [E.ArrowFunction(['key'], BuildSchema(context, schema.propertyNames, 'key'))])
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckPropertyNames(context: CheckContext, schema: S.XPropertyNames, value: Record<PropertyKey, unknown>): boolean {
  return G.Every(G.Keys(value), 0, (key) => CheckSchema(context, schema.propertyNames, key))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorPropertyNames(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XPropertyNames, value: Record<PropertyKey, unknown>): boolean {
  const propertyNames: string[] = []
  const isPropertyNames = G.EveryAll(G.Keys(value), 0, (key) => {
    const nextInstancePath = `${instancePath}/${key}`
    const nextSchemaPath = `${schemaPath}/propertyNames`
    const nextContext = new AccumulatedErrorContext(context.GetContext(), context.GetSchema())
    const isPropertyName = ErrorSchema(nextContext, nextSchemaPath, nextInstancePath, schema.propertyNames, key)
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
