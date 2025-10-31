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

import * as Schema from '../types/index.ts'
import { Hashing } from '../../system/hashing/index.ts'
import { Stack } from './_stack.ts'
import { BuildContext } from './_context.ts'
import { EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema } from './schema.ts'

const functions: Map<string, string> = new Map()

// ------------------------------------------------------------------
// CreateCallExpression
// ------------------------------------------------------------------
function CreateCallExpression(context: BuildContext, schema: Schema.XSchema, hash: string, value: string): string {
  return context.UseUnevaluated()
    ? E.Call(`check_${hash}`, ['context', value])
    : E.Call(`check_${hash}`, [value])
}
// ------------------------------------------------------------------
// CreateFunctionExpression
// ------------------------------------------------------------------
function CreateFunctionExpression(stack: Stack, context: BuildContext, schema: Schema.XSchema, hash: string): string {
  const expression = BuildSchema(stack, context, schema, 'value')
  return context.UseUnevaluated()
    ? E.ConstDeclaration(`check_${hash}`, E.ArrowFunction(['context', 'value'], expression))
    : E.ConstDeclaration(`check_${hash}`, E.ArrowFunction(['value'], expression))
}
// ------------------------------------------------------------------
// ResetFunctions
// ------------------------------------------------------------------
export function ResetFunctions(): void {
  functions.clear()
}
// ------------------------------------------------------------------
// GetFunctions
// ------------------------------------------------------------------
export function GetFunctions(): string[] {
  return [...functions.values()]
}
// ------------------------------------------------------------------
// CreateFunction
// ------------------------------------------------------------------
export function CreateFunction(stack: Stack, context: BuildContext, schema: Schema.XSchema, value: string): string {
  const hash = Schema.IsSchemaObject(schema) ? Hashing.Hash({ __baseURL: stack.Current().href, ...schema }) : Hashing.Hash(schema)
  const call = CreateCallExpression(context, schema, hash, value)
  if (functions.has(hash)) return call
  functions.set(hash, '')
  functions.set(hash, CreateFunctionExpression(stack, context, schema, hash))
  return call
}
