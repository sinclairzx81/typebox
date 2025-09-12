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
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { BuildSchema, CheckSchema } from './schema.ts'
import { Reducer } from './_reducer.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
function BuildNotUnevaluated(context: BuildContext, schema: S.XNot, value: string): string {
  return Reducer(context, [schema.not], value, E.Not(E.IsEqual(E.Member('results', 'length'), E.Constant(1))))
}
function BuildNotFast(context: BuildContext, schema: S.XNot, value: string): string {
  return E.Not(BuildSchema(context, schema.not, value))
}
export function BuildNot(context: BuildContext, schema: S.XNot, value: string): string {
  return context.UseUnevaluated() ? BuildNotUnevaluated(context, schema, value) : BuildNotFast(context, schema, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckNot(context: CheckContext, schema: S.XNot, value: unknown): boolean {
  const condition = context.Clone()
  const isSchema = !CheckSchema(condition, schema.not, value)
  const isNot = isSchema && context.Merge([condition])
  return isNot
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorNot(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XNot, value: unknown): boolean {
  return CheckNot(context, schema, value) || context.AddError({
    keyword: 'not',
    schemaPath,
    instancePath,
    params: {},
  })
}
