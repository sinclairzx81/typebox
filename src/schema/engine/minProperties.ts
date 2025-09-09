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
export function BuildMinProperties(context: BuildContext, schema: S.XMinProperties, value: string): string {
  return E.IsGreaterEqualThan(E.Member(E.Keys(value), 'length'), E.Constant(schema.minProperties))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckMinProperties(context: CheckContext, schema: S.XMinProperties, value: Record<PropertyKey, unknown>): boolean {
  return G.IsGreaterEqualThan(G.Keys(value).length, schema.minProperties)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorMinProperties(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XMinProperties, value: Record<PropertyKey, unknown>): boolean {
  return CheckMinProperties(context, schema, value) || context.AddError({
    keyword: 'minProperties',
    schemaPath: `${schemaPath}/minProperties`,
    instancePath,
    params: { limit: schema.minProperties },
  })
}
