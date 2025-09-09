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
import { EmitGuard as E } from '../../guard/index.ts'
import { Format } from '../../format/index.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildFormat(context: BuildContext, schema: S.XFormat, value: string): string {
  return E.Call(E.Member('Format', 'Test'), [E.Constant(schema.format), value])
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckFormat(context: CheckContext, schema: S.XFormat, value: string): boolean {
  return Format.Test(schema.format, value)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorFormat(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XFormat, value: string): boolean {
  return CheckFormat(context, schema, value) || context.AddError({
    keyword: 'format',
    schemaPath: `${schemaPath}/format`,
    instancePath,
    params: { format: schema.format },
  })
}
