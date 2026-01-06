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
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'


// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildUnevaluatedProperties(stack: Stack, context: BuildContext, schema: Schema.XUnevaluatedProperties, value: string): string {
  const [key, prop] = [Unique(), Unique()]
  const keys = E.Call(E.Member('context', 'GetKeys'), [])
  const hasKey = E.Call(E.Member('keys', 'has'), [key])
  const addKey = E.Call(E.Member('context', 'AddKey'), [key])
  const isSchema = BuildSchema(stack, context, schema.unevaluatedProperties, prop)
  const isEvery = E.Every(E.Entries(value), E.Constant(0), [`[${key}, ${prop}]`, '_'], E.Or(hasKey, E.And(isSchema, addKey)))
  return E.Call(E.ArrowFunction(['context'], E.Statements([
    E.ConstDeclaration('keys', keys),
    E.Return(isEvery)
  ])), ['context'])
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckUnevaluatedProperties(stack: Stack, context: CheckContext, schema: Schema.XUnevaluatedProperties, value: Record<PropertyKey, unknown>) {
  const keys = context.GetKeys()
  return G.Every(G.Entries(value), 0, ([key, prop]) => {
    return keys.has(key)
      || (CheckSchema(stack, context, schema.unevaluatedProperties, prop) && context.AddKey(key))
  })
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorUnevaluatedProperties(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XUnevaluatedProperties, value: Record<PropertyKey, unknown>) {
  const keys = context.GetKeys()
  const unevaluatedProperties: PropertyKey[] = []
  const isUnevaluatedProperties = G.EveryAll(G.Entries(value), 0, ([key, prop]) => {
    const nextContext = new AccumulatedErrorContext()
    const isEvaluatedProperty = keys.has(key)
      || (ErrorSchema(stack, nextContext, schemaPath, instancePath, schema.unevaluatedProperties, prop) && context.AddKey(key))
    if (!isEvaluatedProperty) unevaluatedProperties.push(key)
    return isEvaluatedProperty
  })
  return isUnevaluatedProperties || context.AddError({
    keyword: 'unevaluatedProperties',
    schemaPath,
    instancePath,
    params: { unevaluatedProperties }
  })
}