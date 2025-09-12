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

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildUnevaluatedItems(context: BuildContext, schema: S.XUnevaluatedItems, value: string): string {
  const indices = E.Call(E.Member('context', 'GetIndices'), [])
  const hasIndex = E.Call(E.Member('indices', 'has'), ['index'])
  const isSchema = BuildSchema(context, schema.unevaluatedItems, 'value')
  const addIndex = E.Call(E.Member('context', 'AddIndex'), ['index'])
  const isEvery = E.Call(E.Member(value, 'every'), [E.ArrowFunction(['value', 'index'], E.And(E.Or(hasIndex, isSchema), addIndex))])

  return E.Call(E.ArrowFunction(['context'], E.Statements([
    E.ConstDeclaration('indices', indices),
    E.Return(isEvery)
  ])), ['context'])
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckUnevaluatedItems(context: CheckContext, schema: S.XUnevaluatedItems, value: unknown[]): boolean {
  const indices = context.GetIndices()
  return G.Every(value, (value, index) => {
    return (indices.has(index) || CheckSchema(context, schema.unevaluatedItems, value))
      && context.AddIndex(index)
  })
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorUnevaluatedItems(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XUnevaluatedItems, value: unknown[]): boolean {
  const indices = context.GetIndices()
  const unevaluatedItems: number[] = []
  const isUnevaluatedItems = G.EveryAll(value, (value, index) => {
    const nextContext = new AccumulatedErrorContext(context.GetContext(), context.GetSchema())
    const isEvaluatedItem = (indices.has(index) || ErrorSchema(nextContext, schemaPath, instancePath, schema.unevaluatedItems, value))
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