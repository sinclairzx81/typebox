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
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { BuildSchema, CheckSchema } from './schema.ts'

// ------------------------------------------------------------------
// Valid
// ------------------------------------------------------------------
function IsValid(schema: S.XMaxContains): schema is S.XMaxContains & S.XContains {
  return S.IsContains(schema)
}

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildMaxContains(context: BuildContext, schema: S.XMaxContains, value: string): string {
  if (!IsValid(schema)) return E.Constant(true)

  const count = E.Call(E.Member(value, 'reduce'), [E.ArrowFunction(['result', 'value'], E.Ternary(BuildSchema(context, schema.contains, 'value'), E.PrefixIncrement('result'), 'result')), E.Constant(0)])
  return E.IsLessEqualThan(count, E.Constant(schema.maxContains))
}

// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckMaxContains(context: CheckContext, schema: S.XMaxContains, value: unknown[]): boolean {
  if (!IsValid(schema)) return true

  const count = value.reduce<number>((result, value) => CheckSchema(context, schema.contains, value) ? ++result : result, 0)
  return G.IsLessEqualThan(count, schema.maxContains)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorMaxContains(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XMaxContains, value: unknown[]): boolean {
  const minContains = S.IsMinContains(schema) ? schema.minContains : 1
  return CheckMaxContains(context, schema, value) || context.AddError({
    keyword: 'contains',
    schemaPath: `${schemaPath}/contains`,
    instancePath,
    params: { minContains, maxContains: schema.maxContains },
  })
}