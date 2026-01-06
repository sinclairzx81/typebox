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
import { Hashing } from '../../system/hashing/index.ts'
import { Stack } from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'

// ------------------------------------------------------------------
// Valid
// ------------------------------------------------------------------
function IsValid(schema: Schema.XUniqueItems): schema is Schema.XUniqueItems & { uniqueItems: Schema.XSchema | true } {
  return !G.IsEqual(schema.uniqueItems, false)
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildUniqueItems(stack: Stack, context: BuildContext, schema: Schema.XUniqueItems, value: string): string {
  if (!IsValid(schema)) return E.Constant(true)

  const set = E.Member(E.New('Set', [E.Call(E.Member(value, 'map'), [E.Member('Hashing', 'Hash')])]), 'size')
  const isLength = E.Member(value, 'length')
  return E.IsEqual(set, isLength)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckUniqueItems(stack: Stack, context: CheckContext, schema: Schema.XUniqueItems, value: unknown[]): boolean {
  if (!IsValid(schema)) return true
  const set = new Set(value.map(Hashing.Hash)).size
  const isLength = value.length
  return G.IsEqual(set, isLength)
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorUniqueItems(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XUniqueItems, value: unknown[]): boolean {
  if (!IsValid(schema)) return true
  const set = new Set<string>()
  const duplicateItems = value.reduce<number[]>((result, value, index) => {
    const hash = Hashing.Hash(value)
    if (set.has(hash)) return [...result, index]
    set.add(hash)
    return result
  }, [] as number[])
  const isUniqueItems = G.IsEqual(duplicateItems.length, 0)
  return isUniqueItems || context.AddError({
    keyword: 'uniqueItems',
    schemaPath,
    instancePath,
    params: { duplicateItems },
  })
}
