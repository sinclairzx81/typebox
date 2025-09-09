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
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildPatternProperties(context: BuildContext, schema: S.XPatternProperties, value: string): string {
  return E.ReduceAnd(G.Entries(schema.patternProperties).map(([pattern, schema]) => {
    const regexp = V.CreateExternalVariable(new RegExp(pattern))
    const notKey = E.Not(E.Call(E.Member(regexp, 'test'), ['key']))
    const isSchema = BuildSchema(context, schema, 'value')
    const addKey = context.AddKey('key')
    const guarded = context.UseUnevaluated() ? E.Or(notKey, E.And(isSchema, addKey)) : E.Or(notKey, isSchema)
    return E.Call(E.Member(E.Entries(value), 'every'), [E.ArrowFunction(['[key, value]'], guarded)])
  }))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckPatternProperties(context: CheckContext, schema: S.XPatternProperties, value: Record<PropertyKey, unknown>): boolean {
  return G.Every(G.Entries(schema.patternProperties), ([pattern, schema]) => {
    const regexp = new RegExp(pattern)
    return G.Every(G.Entries(value), ([key, value]) => {
      return !regexp.test(key) || CheckSchema(context, schema, value) && context.AddKey(key)
    })
  })
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorPatternProperties(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XPatternProperties, value: Record<PropertyKey, unknown>): boolean {
  return G.EveryAll(G.Entries(schema.patternProperties), ([pattern, schema]) => {
    const nextSchemaPath = `${schemaPath}/patternProperties/${pattern}`
    const regexp = new RegExp(pattern)
    return G.EveryAll(G.Entries(value), ([key, value]) => {
      const nextInstancePath = `${instancePath}/${key}`
      const notKey = !regexp.test(key)
      return notKey || ErrorSchema(context, nextSchemaPath, nextInstancePath, schema, value) && context.AddKey(key)
    })
  })
}