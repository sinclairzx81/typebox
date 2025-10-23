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
import { Unique } from './_unique.ts'
import { BuildContext, CheckContext, ErrorContext, AccumulatedErrorContext } from './_context.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildUnevaluatedItems(stack: Stack, context: BuildContext, schema: Schema.XUnevaluatedItems, value: string): string {
  const [index, item] = [Unique(), Unique()]
  const indices = E.Call(E.Member('context', 'GetIndices'), [])
  const hasIndex = E.Call(E.Member('indices', 'has'), [index])
  const isSchema = BuildSchema(stack, context, schema.unevaluatedItems, item)
  const addIndex = E.Call(E.Member('context', 'AddIndex'), [index])
  const isEvery = E.Every(value, E.Constant(0), [item, index], E.And(E.Or(hasIndex, isSchema), addIndex))
  return E.Call(E.ArrowFunction(['context'], E.Statements([
    E.ConstDeclaration('indices', indices),
    E.Return(isEvery)
  ])), ['context'])
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckUnevaluatedItems(stack: Stack, context: CheckContext, schema: Schema.XUnevaluatedItems, value: unknown[]): boolean {
  const indices = context.GetIndices()
  return G.Every(value, 0, (item, index) => {
    return (indices.has(index) || CheckSchema(stack, context, schema.unevaluatedItems, item))
      && context.AddIndex(index)
  })
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorUnevaluatedItems(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XUnevaluatedItems, value: unknown[]): boolean {
  const indices = context.GetIndices()
  const unevaluatedItems: number[] = []
  const isUnevaluatedItems = G.EveryAll(value, 0, (item, index) => {
    const nextContext = new AccumulatedErrorContext()
    const isEvaluatedItem = (indices.has(index) || ErrorSchema(stack, nextContext, schemaPath, instancePath, schema.unevaluatedItems, item))
      && context.AddIndex(index)
    if (!isEvaluatedItem) unevaluatedItems.push(index)
    return isEvaluatedItem
  })
  return isUnevaluatedItems || context.AddError({
    keyword: 'unevaluatedItems',
    schemaPath,
    instancePath,
    params: { unevaluatedItems }
  })
}