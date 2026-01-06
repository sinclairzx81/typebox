/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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
import { Stack } from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildRefine(stack: Stack, context: BuildContext, schema: S.XRefine, value: string): string {
  const refinements = V.CreateVariable(schema['~refine'].map((refinement) => refinement))
  return E.Every(refinements, E.Constant(0), ['refinement', '_'], E.Call(E.Member('refinement', 'refine'), [value]))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckRefine(stack: Stack, context: CheckContext, schema: S.XRefine, value: unknown): boolean {
  return G.Every(schema['~refine'], 0, (refinement, _) => refinement.refine(value))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorRefine(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XRefine, value: unknown): boolean {
  return G.EveryAll(schema['~refine'], 0, (refinement, index) => {
    return refinement.refine(value) || context.AddError({
      keyword: '~refine',
      schemaPath,
      instancePath,
      params: { index, message: refinement.message },
    })
  })
}
