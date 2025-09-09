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
import { Guard as G } from '../../guard/index.ts'
import { BaseContext, BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { CheckSchema, ErrorSchema } from './schema.ts'
import { Deref } from '../deref/index.ts'

// ------------------------------------------------------------------
// Resolve
// ------------------------------------------------------------------
function Resolve(context: BaseContext, schema: S.XRef): S.XSchemaLike {
  // note: it is safe to coerce to XSchema here as it wouldn't be possible
  // to enter a ref resolution if the root schema was boolean.
  const schemaRoot = context.GetSchema() as S.XSchema
  // contextual schema
  const schemaContext = context.GetContext()
  if (G.HasPropertyKey(schemaContext, schema.$ref)) {
    return schemaContext[schema.$ref]
  }
  // inline referential schema
  const dereferenced = Deref(schemaRoot, { $ref: schema.$ref })
  return S.IsSchemaLike(dereferenced) ? dereferenced : false
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildRef(context: BuildContext, schema: S.XRef, value: string): string {
  const target = Resolve(context, schema)
  return F.CreateFunction(context, target, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckRef(context: CheckContext, schema: S.XRef, value: unknown): boolean {
  const target = Resolve(context, schema)
  return (S.IsSchemaLike(target) && CheckSchema(context, target, value))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorRef(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XRef, value: unknown): boolean {
  const target = Resolve(context, schema)
  return (S.IsSchemaLike(target) && ErrorSchema(context, '#', instancePath, target, value))
}