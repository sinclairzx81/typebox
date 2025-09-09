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
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildDependencies(context: BuildContext, schema: S.XDependencies, value: string): string {
  const isLength = E.IsEqual(E.Member(E.Keys(value), 'length'), E.Constant(0))
  const isEveryDependency = E.ReduceAnd(
    G.Entries(schema.dependencies).map(([key, schema]) => {
      const notKey = E.Not(E.HasPropertyKey(value, E.Constant(key)))
      const isSchema = BuildSchema(context, schema, value)
      const isEveryKey = (schema: string[]) => E.ReduceAnd(schema.map((key) => E.HasPropertyKey(value, E.Constant(key))))
      return E.Or(notKey, G.IsArray(schema) ? isEveryKey(schema) : isSchema)
    }),
  )
  return E.Or(isLength, isEveryDependency)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckDependencies(context: CheckContext, schema: S.XDependencies, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEvery = G.Every(G.Entries(schema.dependencies), ([key, schema]) => {
    return !G.HasPropertyKey(value, key) || (
      G.IsArray(schema)
        ? schema.every((key) => G.HasPropertyKey(value, key))
        : CheckSchema(context, schema, value)
    )
  })
  return isLength || isEvery
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorDependencies(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XDependencies, value: Record<PropertyKey, unknown>): boolean {
  const isLength = G.IsEqual(G.Keys(value).length, 0)
  const isEvery = G.EveryAll(G.Entries(schema.dependencies), ([key, schema]) => {
    const nextSchemaPath = `${schemaPath}/dependencies/${key}`
    return !G.HasPropertyKey(value, key) || (
      G.IsArray(schema)
        ? schema.every((dependency) => G.HasPropertyKey(value, dependency) || context.AddError({
          keyword: 'dependencies',
          schemaPath: `${schemaPath}/dependencies`,
          instancePath,
          params: { property: key, dependencies: schema },
        })) : ErrorSchema(context, nextSchemaPath, instancePath, schema, value)
    )
  })
  return isLength || isEvery
}
