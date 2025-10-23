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
import { BaseContext, BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { CheckSchema, ErrorSchema } from './schema.ts'
import { Resolve } from '../resolve/index.ts'

// ------------------------------------------------------------------
// Resolve
// ------------------------------------------------------------------
function ResolveRecursiveRef(stack: Stack, context: BaseContext, schema: S.XRecursiveRef): S.XSchema {
  const schemaRoot = stack.GetSchema()
  const schemaBase = stack.Ids.Last() ?? stack.GetSchema()
  // ----------------------------------------------------------------
  // RecursiveTarget
  // ----------------------------------------------------------------
  const recursiveTarget = Resolve.Ref(schemaBase, schema.$recursiveRef)
  if (S.IsSchemaObject(recursiveTarget)) {
    if (S.IsRecursiveAnchorTrue(recursiveTarget) && stack.RecursiveAnchors.Count() > 0) {
      const firstRecursiveAnchor = stack.RecursiveAnchors.First()!
      const refTarget = Resolve.Ref(firstRecursiveAnchor, schema.$recursiveRef)
      if (S.IsSchema(refTarget)) return refTarget
    }
    return recursiveTarget 
  }
  // ----------------------------------------------------------------
  // RootTarget
  // ----------------------------------------------------------------
  const rootTarget = Resolve.Ref(schemaRoot, schema.$recursiveRef)
  if (S.IsSchemaObject(rootTarget)) return rootTarget
  return false
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildRecursiveRef(stack: Stack, context: BuildContext, schema: S.XRecursiveRef, value: string): string {
  const target = ResolveRecursiveRef(stack, context, schema)
  return F.CreateFunction(stack, context, target, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckRecursiveRef(stack: Stack, context: CheckContext, schema: S.XRecursiveRef, value: unknown): boolean {
  const target = ResolveRecursiveRef(stack, context, schema)
  return (S.IsSchema(target) && CheckSchema(stack, context, target, value))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorRecursiveRef(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XRecursiveRef, value: unknown): boolean {
  const target = ResolveRecursiveRef(stack, context, schema)
  return (S.IsSchema(target) && ErrorSchema(stack, context, '#', instancePath, target, value))
}