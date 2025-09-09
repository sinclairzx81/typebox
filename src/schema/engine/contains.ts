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
import { BuildSchema, CheckSchema } from './schema.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'

// ------------------------------------------------------------------
// Invalid
// ------------------------------------------------------------------
function IsValid(schema: S.XContains): boolean {
  return !(S.IsMinContains(schema) && G.IsEqual(schema.minContains, 0))
}

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildContains(context: BuildContext, schema: S.XContains, value: string): string {
  if (!IsValid(schema)) return E.Constant(true)

  const isLength = E.Not(E.IsEqual(E.Member(value, 'length'), E.Constant(0)))
  const isSome = E.Call(E.Member(value, 'some'), [E.ArrowFunction(['value'], BuildSchema(context, schema.contains, 'value'))])
  return E.And(isLength, isSome)
}

// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckContains(context: CheckContext, schema: S.XContains, value: unknown[]): boolean {
  if (!IsValid(schema)) return true
  return !G.IsEqual(value.length, 0) && 
    value.some((value) => CheckSchema(context, schema.contains, value))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorContains(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XContains, value: unknown[]): boolean {
  return CheckContains(context, schema, value) || context.AddError({
    keyword: 'contains',
    schemaPath: `${schemaPath}/contains`,
    instancePath,
    params: { minContains: 1 },
  })
}