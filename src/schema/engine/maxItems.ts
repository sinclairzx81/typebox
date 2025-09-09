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

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildMaxItems(context: BuildContext, schema: S.XMaxItems, value: string): string {
  return E.IsLessEqualThan(E.Member(value, 'length'), E.Constant(schema.maxItems))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckMaxItems(context: CheckContext, schema: S.XMaxItems, value: unknown[]): boolean {
  return G.IsLessEqualThan(value.length, schema.maxItems)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorMaxItems(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XMaxItems, value: unknown[]): boolean {
  return CheckMaxItems(context, schema, value) || context.AddError({
    keyword: 'maxItems',
    schemaPath: `${schemaPath}/maxItems`,
    instancePath,
    params: { limit: schema.maxItems }
  })
}
