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
import * as Stack from './_stack.ts'
import { Resolve } from '../resolve/index.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { EmitGuard as E } from '../../guard/index.ts'
import { CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// BuildRef
// ------------------------------------------------------------------
function BuildRefStandard(stack: Stack.XStack, context: BuildContext, target: Schema.XSchema, value: string): string {
  const interior = E.ArrowFunction(['context', 'value'], Functions.CreateFunction(stack, context, target, 'value'))
  const exterior = E.ArrowFunction(['context', 'value'], E.Statements([
    E.ConstDeclaration('nextContext', E.New('CheckContext', [])),
    E.ConstDeclaration('result', E.Call(interior, ['nextContext', 'value'])),
    E.If('result', context.Merge('[nextContext]')),
    E.Return('result')
  ]))
  return E.Call(exterior, ['context', value])
}
function BuildRefFast(stack: Stack.XStack, context: BuildContext, target: Schema.XSchema, value: string): string {
  return Functions.CreateFunction(stack, context, target, value)
}
export function BuildRef(stack: Stack.XStack, context: BuildContext, schema: Schema.XRef, value: string): string {
  const result = Resolve.Ref(stack, schema)
  const target = result.schema ?? false
  return context.UseUnevaluated()
    ? BuildRefStandard(result.stack, context, target, value)
    : BuildRefFast(result.stack, context, target, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckRef(stack: Stack.XStack, context: CheckContext, schema: Schema.XRef, value: unknown): boolean {
  const result = Resolve.Ref(stack, schema)
  const target = result.schema ?? false
  const nextContext = new CheckContext()
  const valid = (Schema.IsSchema(target) && CheckSchema(result.stack, nextContext, target, value))
  if (valid) context.Merge([nextContext])
  return valid
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorRef(stack: Stack.XStack, context: ErrorContext, _schemaPath: string, instancePath: string, schema: Schema.XRef, value: unknown): boolean {
  const result = Resolve.Ref(stack, schema)
  const target = result.schema ?? false
  const nextContext = new ErrorContext()
  const valid = (Schema.IsSchema(target) && ErrorSchema(result.stack, nextContext, '#', instancePath, target, value))
  if (valid) context.Merge([nextContext])
  if (!valid) context.AddErrors(nextContext.GetErrors())
  return valid
}