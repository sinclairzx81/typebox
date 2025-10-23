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

import * as F from './_functions.ts'
import * as S from '../types/index.ts'
import { Stack } from './_stack.ts'
import { BaseContext, BuildContext, CheckContext, ErrorContext, AccumulatedErrorContext } from './_context.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { CheckSchema, ErrorSchema } from './schema.ts'
import { Resolve } from '../resolve/index.ts'

// ------------------------------------------------------------------
// Resolve
// ------------------------------------------------------------------
function ResolveRef(stack: Stack, context: BaseContext, schema: S.XRef): S.XSchema {
  // ----------------------------------------------------------------
  // ContextSchema
  // ----------------------------------------------------------------
  const schemaContext = stack.GetContext()
  if (G.HasPropertyKey(schemaContext, schema.$ref)) {
    return schemaContext[schema.$ref]
  }
  // ----------------------------------------------------------------
  // Referential Schema
  // ----------------------------------------------------------------
  const schemaRoot = stack.GetSchema() as S.XSchemaObject
  const target = Resolve.Ref(schemaRoot, schema.$ref)
  return S.IsSchema(target) ? target : false
}
// ------------------------------------------------------------------
// BuildRefStandard
// ------------------------------------------------------------------
function BuildRefStandard(stack: Stack, context: BuildContext, target: S.XSchema, value: string): string {
  const interior = E.ArrowFunction(['context', 'value'], F.CreateFunction(stack, context, target, 'value'))
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
function BuildRefFast(stack: Stack, context: BuildContext, target: S.XSchema, value: string): string {
  return F.CreateFunction(stack, context, target, value)
}
// ------------------------------------------------------------------
// BuildRef
// ------------------------------------------------------------------
export function BuildRef(stack: Stack, context: BuildContext, schema: S.XRef, value: string): string {
  const target = ResolveRef(stack, context, schema)
  return context.UseUnevaluated()
    ? BuildRefStandard(stack, context, target, value)
    : BuildRefFast(stack, context, target, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckRef(stack: Stack, context: CheckContext, schema: S.XRef, value: unknown): boolean {
  const target = ResolveRef(stack, context, schema)
  const nextContext = new CheckContext()
  const result = (S.IsSchema(target) && CheckSchema(stack, nextContext, target, value))
  if(result) context.Merge([nextContext])
  return result
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorRef(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XRef, value: unknown): boolean {
  const target = ResolveRef(stack, context, schema)
  const nextContext = new AccumulatedErrorContext()
  const result = (S.IsSchema(target) && ErrorSchema(stack, nextContext, '#', instancePath, target, value))
  if(result) context.Merge([nextContext])
  if(!result) nextContext.GetErrors().forEach(error => context.AddError(error))
  return result
}