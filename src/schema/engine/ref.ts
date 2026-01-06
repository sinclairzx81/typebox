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

import * as Functions from './_functions.ts'
import * as Schema from '../types/index.ts'
import { Stack } from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext, AccumulatedErrorContext } from './_context.ts'
import { EmitGuard as E } from '../../guard/index.ts'
import { CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// BuildRefStandard
// ------------------------------------------------------------------
function BuildRefStandard(stack: Stack, context: BuildContext, target: Schema.XSchema, value: string): string {
  const interior = E.ArrowFunction(['context', 'value'], Functions.CreateFunction(stack, context, target, 'value'))
  const exterior = E.ArrowFunction(['context', 'value'], E.Statements([
    E.ConstDeclaration('nextContext', E.New('CheckContext', [])),
    E.ConstDeclaration('result', E.Call(interior, ['nextContext', 'value'])),
    E.If('result', context.Merge('[nextContext]')),
    E.Return('result')
  ]))
  return E.Call(exterior, ['context', value])
}
// ------------------------------------------------------------------
// BuildRefStandard
// ------------------------------------------------------------------
function BuildRefFast(stack: Stack, context: BuildContext, target: Schema.XSchema, value: string): string {
  return Functions.CreateFunction(stack, context, target, value)
}
// ------------------------------------------------------------------
// BuildRef
// ------------------------------------------------------------------
export function BuildRef(stack: Stack, context: BuildContext, schema: Schema.XRef, value: string): string {
  const target = stack.Ref(schema.$ref) ?? false
  return context.UseUnevaluated()
    ? BuildRefStandard(stack, context, target, value)
    : BuildRefFast(stack, context, target, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckRef(stack: Stack, context: CheckContext, schema: Schema.XRef, value: unknown): boolean {
  const target = stack.Ref(schema.$ref) ?? false
  const nextContext = new CheckContext()
  const result = (Schema.IsSchema(target) && CheckSchema(stack, nextContext, target, value))
  if(result) context.Merge([nextContext])
  return result
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorRef(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XRef, value: unknown): boolean {
  const target = stack.Ref(schema.$ref) ?? false
  const nextContext = new AccumulatedErrorContext()
  const result = (Schema.IsSchema(target) && ErrorSchema(stack, nextContext, '#', instancePath, target, value))
  if(result) context.Merge([nextContext])
  if(!result) nextContext.GetErrors().forEach(error => context.AddError(error))
  return result
}