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
import { BaseContext, BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { CheckSchema, ErrorSchema } from './schema.ts'
import { DynamicDeref } from '../deref/index.ts'

// ------------------------------------------------------------------
// Resolve
// ------------------------------------------------------------------
function Resolve(context: BaseContext, schema: S.XDynamicRef): S.XSchemaLike {
  // note: it is safe to coerce to XSchema here as it wouldn't be possible
  // to enter a ref resolution if the root schema was boolean.
  const schemaRoot = context.GetSchema() as S.XSchema

  const dereferenced = DynamicDeref(schemaRoot, { $dynamicRef: schema.$dynamicRef })
  return S.IsSchemaLike(dereferenced) ? dereferenced : false
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildDynamicRef(context: BuildContext, schema: S.XDynamicRef, value: string): string {
  const target = Resolve(context, schema)
  return F.CreateFunction(context, target, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckDynamicRef(context: CheckContext, schema: S.XDynamicRef, value: unknown): boolean {
  const target = Resolve(context, schema)
  return (S.IsSchemaLike(target) && CheckSchema(context, target, value))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorDynamicRef(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XDynamicRef, value: unknown): boolean {
  const target = Resolve(context, schema)
  return (S.IsSchemaLike(target) && ErrorSchema(context, '#', instancePath, target, value))
}