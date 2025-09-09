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
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'
import { BuildContext, CheckContext, ErrorContext, AccumulatedErrorContext } from './_context.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// Common: GetPropertiesPattern
//
// Constructs a regular expression that matches all property keys
// and pattern properties defined in a schema. This approach unifies
// handling of both property types, avoiding separate logic paths.
//
// If no keys or patterns are present, it returns a pattern that
// matches nothing: '(?!)'.
//
// ------------------------------------------------------------------
function GetPropertiesPattern(schema: S.XSchema): string {
  const patterns: string[] = []
  if (S.IsPatternProperties(schema)) patterns.push(...G.Keys(schema.patternProperties))
  if (S.IsProperties(schema)) patterns.push(...G.Keys(schema.properties))
  return G.IsEqual(patterns.length, 0) ? '(?!)' : `(${patterns.join('|')})`
}
// ------------------------------------------------------------------
// BuildAdditionalPropertiesFast
//
// Optimized logic for schemas with `additionalProperties: false`.
//
// This fast-path applies only when:
// - `additionalProperties` is explicitly set to false,
// - the schema uses only `properties` (no `patternProperties`),
// - and all defined properties are required (i.e., no optional keys).
//
// This constraint is common when enforcing strict object shapes
// with only known, fixed keys. When all these conditions are met,
// we can generate a simplified and efficient runtime check.
//
// ------------------------------------------------------------------
export function CanAdditionalPropertiesFast(context: BuildContext, schema: S.XAdditionalProperties, value: string): schema is S.XAdditionalProperties & S.XRequired {
  return S.IsRequired(schema)
    && S.IsProperties(schema)
    && !S.IsPatternProperties(schema)
    && G.IsEqual(schema.additionalProperties, false)
    && G.IsEqual(G.Keys(schema.properties).length, schema.required.length)
}
export function BuildAdditionalPropertiesFast(context: BuildContext, schema: S.XAdditionalProperties & S.XRequired, value: string): string {
  return E.IsEqual(E.Member(E.Call(E.Member('Object', 'getOwnPropertyNames'), [value]), 'length'), E.Constant(schema.required.length))
}
// ------------------------------------------------------------------
// BuildAdditionalPropertiesStandard
// ------------------------------------------------------------------
export function BuildAdditionalPropertiesStandard(context: BuildContext, schema: S.XAdditionalProperties, value: string): string {
  const regexp = V.CreateExternalVariable(new RegExp(GetPropertiesPattern(schema)))
  const isSchema = BuildSchema(context, schema.additionalProperties, `${value}[key]`)
  const isKey = E.Call(E.Member(regexp, 'test'), ['key'])
  const addKey = context.AddKey('key')
  const guarded = context.UseUnevaluated() ? E.Or(isKey, E.And(isSchema, addKey)) : E.Or(isKey, isSchema)
  return E.Call(E.Member(E.Keys(value), 'every'), [E.ArrowFunction(['key'], guarded)])
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
export function BuildAdditionalProperties(context: BuildContext, schema: S.XAdditionalProperties, value: string): string {
  return CanAdditionalPropertiesFast(context, schema, value)
    ? BuildAdditionalPropertiesFast(context, schema, value)
    : BuildAdditionalPropertiesStandard(context, schema, value)
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
export function CheckAdditionalProperties(context: CheckContext, schema: S.XAdditionalProperties, value: Record<PropertyKey, unknown>): boolean {
  const regexp = new RegExp(GetPropertiesPattern(schema))
  const isAdditionalProperties = G.Every(G.Keys(value), (key) => {
    return regexp.test(key) || 
      (CheckSchema(context, schema.additionalProperties, value[key]) && context.AddKey(key))
  })
  return isAdditionalProperties
}
// ------------------------------------------------------------------
// Error
// ------------------------------------------------------------------
export function ErrorAdditionalProperties(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XAdditionalProperties, value: Record<PropertyKey, unknown>): boolean {
  const regexp = new RegExp(GetPropertiesPattern(schema))
  const additionalProperties: string[] = []
  const isAdditionalProperties = G.EveryAll(G.Keys(value), (key) => {
    const nextSchemaPath = `${schemaPath}/additionalProperties`
    const nextInstancePath = `${instancePath}/${key}`
    const nextContext = new AccumulatedErrorContext(context.GetContext(), context.GetSchema())
    const isAdditionalProperty = regexp.test(key) || 
      (ErrorSchema(nextContext, nextSchemaPath, nextInstancePath, schema.additionalProperties, value[key]) && context.AddKey(key))    

    if (!isAdditionalProperty) additionalProperties.push(key)
    return isAdditionalProperty
  })
  return isAdditionalProperties || context.AddError({
    keyword: 'additionalProperties',
    schemaPath: `${schemaPath}/additionalProperties`,
    instancePath: instancePath,
    params: { additionalProperties },
  })
}
