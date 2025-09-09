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
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildDependentRequired(context: BuildContext, schema: S.XDependentRequired, value: string): string {
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
export function CheckDependentRequired(context: CheckContext, schema: S.XDependentRequired, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEvery = G.Every(G.Entries(schema.dependentRequired), ([key, keys]) => {
    return !G.HasPropertyKey(value, key) ||
      keys.every((key) => G.HasPropertyKey(value, key))
  })
  return isLength || isEvery
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorDependentRequired(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XDependentRequired, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEveryEntry = G.EveryAll(G.Entries(schema.dependentRequired), ([key, keys]) => {
    return !G.HasPropertyKey(value, key) || G.EveryAll(keys, (dependency) => G.HasPropertyKey(value, dependency) || context.AddError({
      keyword: 'dependentRequired',
      schemaPath: `${schemaPath}/dependentRequired`,
      instancePath,
      params: { property: key, dependencies: keys },
    }))
  })
  return isLength || isEveryEntry
}
