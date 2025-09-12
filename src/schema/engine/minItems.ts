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

import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import * as S from '../types/index.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildMinItems(context: BuildContext, schema: S.XMinItems, value: string): string {
  return E.IsGreaterEqualThan(E.Member(value, 'length'), E.Constant(schema.minItems))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckMinItems(context: CheckContext, schema: S.XMinItems, value: unknown[]): boolean {
  return G.IsGreaterEqualThan(value.length, schema.minItems)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorMinItems(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XMinItems, value: unknown[]): boolean {
  return CheckMinItems(context, schema, value) || context.AddError({
    keyword: 'minItems',
    schemaPath,
    instancePath,
    params: { limit: schema.minItems }
  })
}