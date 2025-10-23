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
import { Stack } from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildDependentRequired(stack: Stack, context: BuildContext, schema: Schema.XDependentRequired, value: string): string {
  const isLength = E.IsEqual(E.Member(E.Keys(value), 'length'), E.Constant(0))
  const isEvery = E.ReduceAnd(
    G.Entries(schema.dependentRequired).map(([key, keys]) => {
      const notKey = E.Not(E.HasPropertyKey(value, E.Constant(key)))
      const everyKey = E.ReduceAnd(keys.map((key) => E.HasPropertyKey(value, E.Constant(key))))
      return E.Or(notKey, everyKey)
    }),
  )
  return E.Or(isLength, isEvery)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckDependentRequired(stack: Stack, context: CheckContext, schema: Schema.XDependentRequired, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEvery = G.Every(G.Entries(schema.dependentRequired), 0, ([key, keys]) => {
    return !G.HasPropertyKey(value, key) ||
      keys.every((key) => G.HasPropertyKey(value, key))
  })
  return isLength || isEvery
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorDependentRequired(stack:  Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XDependentRequired, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEveryEntry = G.EveryAll(G.Entries(schema.dependentRequired), 0, ([key, keys]) => {
    return !G.HasPropertyKey(value, key) || G.EveryAll(keys, 0, (dependency) => G.HasPropertyKey(value, dependency) || context.AddError({
      keyword: 'dependentRequired',
      schemaPath,
      instancePath,
      params: { property: key, dependencies: keys },
    }))
  })
  return isLength || isEveryEntry
}
