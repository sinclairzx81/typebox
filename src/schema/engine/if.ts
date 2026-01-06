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

import * as Schema from '../types/index.ts'
import { Stack } from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext, AccumulatedErrorContext } from './_context.ts'
import { EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildIf(stack: Stack, context: BuildContext, schema: Schema.XIf, value: string): string {
  const thenSchema = Schema.IsThen(schema) ? schema.then : true
  const elseSchema = Schema.IsElse(schema) ? schema.else : true
  return E.Ternary(BuildSchema(stack, context, schema.if, value), 
    BuildSchema(stack, context, thenSchema, value), 
    BuildSchema(stack, context, elseSchema, value))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckIf(stack: Stack, context: CheckContext, schema: Schema.XIf, value: unknown): boolean {
  const thenSchema = Schema.IsThen(schema) ? schema.then : true
  const elseSchema = Schema.IsElse(schema) ? schema.else : true
  return CheckSchema(stack, context, schema.if, value) 
    ? CheckSchema(stack, context, thenSchema, value) 
    : CheckSchema(stack, context, elseSchema, value)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorIf(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XIf, value: unknown): boolean {
  const thenSchema = Schema.IsThen(schema) ? schema.then : true
  const elseSchema = Schema.IsElse(schema) ? schema.else : true
  const trueContext = new AccumulatedErrorContext()
  const isIf = ErrorSchema(stack, trueContext, `${schemaPath}/if`, instancePath, schema.if, value)
    ? ErrorSchema(stack, trueContext, `${schemaPath}/then`, instancePath, thenSchema, value) || context.AddError({
      keyword: 'if',
      schemaPath,
      instancePath,
      params: { failingKeyword: 'then' },
    })
    : ErrorSchema(stack, context, `${schemaPath}/else`, instancePath, elseSchema, value) || context.AddError({
      keyword: 'if',
      schemaPath,
      instancePath,
      params: { failingKeyword: 'else' },
    })
  if (isIf) context.Merge([trueContext])
  return isIf
}
