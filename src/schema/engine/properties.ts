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

import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import * as S from '../types/index.ts'

import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildProperties(context: BuildContext, schema: S.XProperties, value: string): string {
  const required = S.IsRequired(schema) ? schema.required : []
  const everyKey = G.Entries(schema.properties).map(([key, schema]) => {
    const notKey = E.Not(E.HasPropertyKey(value, E.Constant(key)))
    const isSchema = BuildSchema(context, schema, E.Member(value, key))
    const addKey = context.AddKey(E.Constant(key))
    // optimization: E.Or(notKey, E.And(isSchema, addKey))
    const guarded = context.UseUnevaluated() ? E.And(isSchema, addKey) : isSchema
    return !required.includes(key) ? E.Or(notKey, guarded) : guarded
  })
  return E.ReduceAnd(everyKey)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckProperties(context: CheckContext, schema: S.XProperties, value: Record<PropertyKey, unknown>): boolean {
  const isProperties = G.Every(G.Entries(schema.properties), ([key, schema]) => {
    return !G.HasPropertyKey(value, key) 
      || (CheckSchema(context, schema, value[key]) && context.AddKey(key))
  })
  return isProperties
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorProperties(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XProperties, value: Record<PropertyKey, unknown>): boolean {
  const isProperties = G.EveryAll(G.Entries(schema.properties), ([key, schema]) => {
    const nextSchemaPath = `${schemaPath}/properties/${key}`
    const nextInstancePath = `${instancePath}/${key}`
    return !G.HasPropertyKey(value, key) 
      || (ErrorSchema(context, nextSchemaPath, nextInstancePath, schema, value[key]) && context.AddKey(key))
  })
  return isProperties
}