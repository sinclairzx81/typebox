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
export function BuildRefine(context: BuildContext, schema: S.XRefine, value: string): string {
  const refinements = V.CreateExternalVariable(schema['~refine'].map((refinement) => refinement))
  return E.Call(E.Member(refinements, 'every'), [E.ArrowFunction(['refinement'], E.Call(E.Member('refinement', 'callback'), [value]))])
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckRefine(context: CheckContext, schema: S.XRefine, value: unknown): boolean {
  return G.Every(schema['~refine'], (refinement) => refinement.callback(value))
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorRefine(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XRefine, value: unknown): boolean {
  return G.EveryAll(schema['~refine'], (refinement, index) => {
    return refinement.callback(value) || context.AddError({
      keyword: '~refine',
      schemaPath: `${schemaPath}/~refine`,
      instancePath,
      params: { index, message: refinement.message },
    })
  })
}
