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
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildEnum(context: BuildContext, schema: S.XEnum, value: string): string {
  return E.ReduceOr(schema.enum.map(option => {
    if (G.IsValueLike(option)) return E.IsEqual(value, E.Constant(option))
    const variable = V.CreateExternalVariable(option)
    return E.IsDeepEqual(value, variable)
  }))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckEnum(context: CheckContext, schema: S.XEnum, value: unknown): boolean {
  return schema.enum.some(option => G.IsValueLike(option) 
    ? G.IsEqual(value, option) 
    : G.IsDeepEqual(value, option))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorEnum(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XEnum, value: unknown): boolean {
  return CheckEnum(context, schema, value) || context.AddError({
    keyword: 'enum',
    schemaPath: `${schemaPath}/enum`,
    instancePath,
    params: { allowedValues: schema.enum }
  })
}