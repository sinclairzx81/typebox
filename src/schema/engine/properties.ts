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
import { InexactOptionalCheck, InexactOptionalBuild, IsExactOptional } from './_exact_optional.ts'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildProperties(context: BuildContext, schema: S.XProperties, value: string): string {
  const required = S.IsRequired(schema) ? schema.required : []
  const everyKey = G.Entries(schema.properties).map(([key, schema]) => {
    const notKey = E.Not(E.HasPropertyKey(value, E.Constant(key)))
    const isSchema = BuildSchema(context, schema, E.Member(value, key))
    const addKey = context.AddKey(E.Constant(key))
    const guarded = context.UseUnevaluated() ? E.And(isSchema, addKey) : isSchema
    
    // --------------------------------------------------------------
    // Optimization
    //
    // If a key is required, we can skip the `notKey` check since this
    // condition is already enforced by Required. This optimization is
    // only valid when Required is evaluated before Properties.
    //
    // --------------------------------------------------------------

    const isProperty = required.includes(key) ? guarded : E.Or(notKey, guarded)

    // --------------------------------------------------------------
    // ExactOptionalProperties
    //
    // By default, TypeScript allows optional properties to be assigned
    // undefined. This is a bit misleading, since 'optional' is usually
    // understood to mean 'the key may be absent', not 'the key may be
    // present with an undefined value'.
    //
    // The 'IsExactOptional' check returns false by default, matching
    // TypeScript's behavior. When exactOptionalPropertyTypes is enabled
    // in tsconfig.json, TypeBox can be configured to use the stricter 
    // semantics via System settings:
    //
    //   Settings.Set({ exactOptionalPropertyTypes: true })
    //
    // --------------------------------------------------------------
    return IsExactOptional(required, key)
      ? isProperty
      : E.Or(InexactOptionalBuild(value, key), isProperty)
  })
  return E.ReduceAnd(everyKey)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckProperties(context: CheckContext, schema: S.XProperties, value: Record<PropertyKey, unknown>): boolean {
  const required = S.IsRequired(schema) ? schema.required : []
  const isProperties = G.Every(G.Entries(schema.properties), 0, ([key, schema]) => {
    const isProperty = !G.HasPropertyKey(value, key) || (CheckSchema(context, schema, value[key]) && context.AddKey(key))
    return IsExactOptional(required, key)
      ? isProperty
      : InexactOptionalCheck(value, key) || isProperty
  })
  return isProperties
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorProperties(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XProperties, value: Record<PropertyKey, unknown>): boolean {
  const required = S.IsRequired(schema) ? schema.required : []
  const isProperties = G.EveryAll(G.Entries(schema.properties), 0, ([key, schema]) => {
    const nextSchemaPath = `${schemaPath}/properties/${key}`
    const nextInstancePath = `${instancePath}/${key}`
    // Defer error generation for IsExactOptional
    const isProperty = () => (
      !G.HasPropertyKey(value, key) || (ErrorSchema(context, nextSchemaPath, nextInstancePath, schema, value[key]) && context.AddKey(key))
    )
    return IsExactOptional(required, key)
      ? isProperty()
      : InexactOptionalCheck(value, key) || isProperty()
  })
  return isProperties
}