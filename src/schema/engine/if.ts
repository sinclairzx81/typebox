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
import * as Stack from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'
import { EmitGuard as E } from '../../guard/index.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
//
// When unevaluated keywords are in use, `if`, `then` and `else` are
// each evaluated in their own context. Annotations from `if` are only
// kept when `if` passes and `then` passes, and annotations from the
// branch are only kept when the branch passes. This prevents keys or
// indices evaluated by the enclosing schema leaking into the branches,
// and prevents annotations from a failed `if` leaking into the parent.
//
// (() => {
//   const context_if = new CheckContext()
//   const context_branch = new CheckContext()
//   return ((context) => <if>)(context_if)
//     ? (((context) => <then>)(context_branch) && context.Merge([context_if, context_branch]))
//     : (((context) => <else>)(context_branch) && context.Merge([context_branch]))
// })()
//
// ------------------------------------------------------------------
function BuildIfStandard(stack: Stack.XStack, context: BuildContext, schema: Schema.XIf, thenSchema: Schema.XSchema, elseSchema: Schema.XSchema, value: string): string {
  const contextIf = E.ConstDeclaration('context_if', E.New('CheckContext', []))
  const contextBranch = E.ConstDeclaration('context_branch', E.New('CheckContext', []))
  const isIf = E.Call(E.ArrowFunction(['context'], BuildSchema(stack, context, schema.if, value)), ['context_if'])
  const isThen = E.Call(E.ArrowFunction(['context'], BuildSchema(stack, context, thenSchema, value)), ['context_branch'])
  const isElse = E.Call(E.ArrowFunction(['context'], BuildSchema(stack, context, elseSchema, value)), ['context_branch'])
  const returns = E.Return(E.Ternary(isIf,
    E.And(isThen, context.Merge(E.ArrayLiteral(['context_if', 'context_branch']))),
    E.And(isElse, context.Merge(E.ArrayLiteral(['context_branch'])))))
  return E.Call(E.ArrowFunction([], E.Statements([contextIf, contextBranch, returns])), [])
}
function BuildIfFast(stack: Stack.XStack, context: BuildContext, schema: Schema.XIf, thenSchema: Schema.XSchema, elseSchema: Schema.XSchema, value: string): string {
  return E.Ternary(BuildSchema(stack, context, schema.if, value),
    BuildSchema(stack, context, thenSchema, value),
    BuildSchema(stack, context, elseSchema, value))
}
export function BuildIf(stack: Stack.XStack, context: BuildContext, schema: Schema.XIf, value: string): string {
  const thenSchema = Schema.IsThen(schema) ? schema.then : true
  const elseSchema = Schema.IsElse(schema) ? schema.else : true
  return context.UseUnevaluated()
    ? BuildIfStandard(stack, context, schema, thenSchema, elseSchema, value)
    : BuildIfFast(stack, context, schema, thenSchema, elseSchema, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckIf(stack: Stack.XStack, context: CheckContext, schema: Schema.XIf, value: unknown): boolean {
  const thenSchema = Schema.IsThen(schema) ? schema.then : true
  const elseSchema = Schema.IsElse(schema) ? schema.else : true
  const ifContext = new CheckContext()
  const branchContext = new CheckContext()
  return CheckSchema(stack, ifContext, schema.if, value)
    ? CheckSchema(stack, branchContext, thenSchema, value) && context.Merge([ifContext, branchContext])
    : CheckSchema(stack, branchContext, elseSchema, value) && context.Merge([branchContext])
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorIf(stack: Stack.XStack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XIf, value: unknown): boolean {
  const thenSchema = Schema.IsThen(schema) ? schema.then : true
  const elseSchema = Schema.IsElse(schema) ? schema.else : true
  const ifContext = new ErrorContext()
  const branchContext = new ErrorContext()
  const isIf = ErrorSchema(stack, ifContext, `${schemaPath}/if`, instancePath, schema.if, value)
  const isBranch = isIf
    ? ErrorSchema(stack, branchContext, `${schemaPath}/then`, instancePath, thenSchema, value)
    : ErrorSchema(stack, branchContext, `${schemaPath}/else`, instancePath, elseSchema, value)
  if (isBranch) return context.Merge(isIf ? [ifContext, branchContext] : [branchContext])
  if (!isIf) context.AddErrors(branchContext.GetErrors())
  return context.AddError('if', schemaPath, instancePath, { failingKeyword: isIf ? 'then' : 'else' })
}
