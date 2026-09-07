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
import * as Resolve from '../resolve/index.ts'
import * as Functions from './_functions.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildDynamicRef(stack: Stack.XStack, context: BuildContext, schema: Schema.XDynamicRef, value: string): string {
  const target = Resolve.DynamicRef(stack, schema) ?? false
  const nextStack = target ? { ...stack, pendingResource: true } : stack
  return Functions.CreateFunction(nextStack, context, target, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckDynamicRef(stack: Stack.XStack, context: CheckContext, schema: Schema.XDynamicRef, value: unknown): boolean {
  const target = Resolve.DynamicRef(stack, schema) ?? false
  const nextStack = target ? { ...stack, pendingResource: true } : stack
  return (Schema.IsSchema(target) && CheckSchema(nextStack, context, target, value))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorDynamicRef(stack: Stack.XStack, context: ErrorContext, _schemaPath: string, instancePath: string, schema: Schema.XDynamicRef, value: unknown): boolean {
  const target = Resolve.DynamicRef(stack, schema) ?? false
  const nextStack = target ? { ...stack, pendingResource: true } : stack
  return (Schema.IsSchema(target) && ErrorSchema(nextStack, context, '#', instancePath, target, value))
}