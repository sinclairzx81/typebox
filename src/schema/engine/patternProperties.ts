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
import * as Externals from './_externals.ts'
import { Stack } from './_stack.ts'
import { Unique } from './_unique.ts'

import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildPatternProperties(stack: Stack, context: BuildContext, schema: Schema.XPatternProperties, value: string): string {
  return E.ReduceAnd(G.Entries(schema.patternProperties).map(([pattern, schema]) => {
    const [key, prop] = [Unique(), Unique()]
    const regexp = Externals.CreateVariable(new RegExp(pattern))
    const notKey = E.Not(E.Call(E.Member(regexp, 'test'), [key]))
    const isSchema = BuildSchema(stack, context, schema, prop)
    const addKey = context.AddKey(key)
    const guarded = context.UseUnevaluated() ? E.Or(notKey, E.And(isSchema, addKey)) : E.Or(notKey, isSchema)
    return E.Every(E.Entries(value), E.Constant(0), [`[${key}, ${prop}]`, '_'], guarded)
  }))
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckPatternProperties(stack: Stack, context: CheckContext, schema: Schema.XPatternProperties, value: Record<PropertyKey, unknown>): boolean {
  return G.Every(G.Entries(schema.patternProperties), 0, ([pattern, schema]) => {
    const regexp = new RegExp(pattern)
    return G.Every(G.Entries(value), 0, ([key, prop]) => {
      return !regexp.test(key) || CheckSchema(stack, context, schema, prop) && context.AddKey(key)
    })
  })
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorPatternProperties(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XPatternProperties, value: Record<PropertyKey, unknown>): boolean {
  return G.EveryAll(G.Entries(schema.patternProperties), 0, ([pattern, schema]) => {
    const nextSchemaPath = `${schemaPath}/patternProperties/${pattern}`
    const regexp = new RegExp(pattern)
    return G.EveryAll(G.Entries(value), 0, ([key, value]) => {
      const nextInstancePath = `${instancePath}/${key}`
      const notKey = !regexp.test(key)
      return notKey || ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value) && context.AddKey(key)
    })
  })
}