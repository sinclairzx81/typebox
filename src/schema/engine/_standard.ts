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
import * as V from './_externals.ts'
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildStandardSchemaV1(context: BuildContext, schema: S.XStandardSchemaV1, value: string): string {
  return E.Not(E.HasPropertyKey(E.Call(E.Member(E.Member(V.CreateExternalVariable(schema), '~standard'), 'validate'), [value]), E.Constant('issues')))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckStandardSchemaV1(context: CheckContext, schema: S.XStandardSchemaV1, value: unknown): boolean {
  return !G.HasPropertyKey(schema['~standard'].validate(value), 'issues')
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorStandardSchemaV1(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XStandardSchemaV1, value: unknown): boolean {
  const result = schema['~standard'].validate(value)
  return !G.HasPropertyKey(result, 'issues') || context.AddError({
    keyword: '~standard',
    schemaPath: `${schemaPath}/~standard`,
    instancePath,
    params: { vendor: schema[`~standard`].vendor, issues: result.issues as object[] },
  })
}
