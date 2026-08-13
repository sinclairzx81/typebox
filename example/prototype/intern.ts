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

import { Hashing } from 'typebox/system'
import { Guard } from 'typebox/guard'
import * as S from 'typebox/schema'

// ----------------------------------------------------------------
// AdditionalItems
// ----------------------------------------------------------------
function FromAdditionalItems(schema: S.XAdditionalItems): S.XSchema {
  return FromSchema(schema.additionalItems)
}
// ----------------------------------------------------------------
// AdditionalProperties
// ----------------------------------------------------------------
function FromAdditionalProperties(schema: S.XAdditionalProperties): S.XSchema {
  return FromSchema(schema.additionalProperties)
}
// ----------------------------------------------------------------
// AllOf
// ----------------------------------------------------------------
function FromAllOf(schema: S.XAllOf): S.XSchema[] {
  return schema.allOf.map(FromSchema)
}
// ----------------------------------------------------------------
// AnyOf
// ----------------------------------------------------------------
function FromAnyOf(schema: S.XAnyOf): S.XSchema[] {
  return schema.anyOf.map(FromSchema)
}
// ----------------------------------------------------------------
// Contains
// ----------------------------------------------------------------
function FromContains(schema: S.XContains): S.XSchema {
  return FromSchema(schema.contains)
}
// ----------------------------------------------------------------
// DependentSchemas
// ----------------------------------------------------------------
function FromDependentSchemas(schema: S.XDependentSchemas): Record<string, S.XSchema> {
  return Guard.Keys(schema.dependentSchemas).reduce((result, key) => ({ ...result, [key]: FromSchema(schema.dependentSchemas[key]) }), {})
}
// ----------------------------------------------------------------
// Else
// ----------------------------------------------------------------
function FromElse(schema: S.XElse): S.XSchema {
  return FromSchema(schema.else)
}
// ----------------------------------------------------------------
// If
// ----------------------------------------------------------------
function FromIf(schema: S.XIf): S.XSchema {
  return FromSchema(schema.if)
}
// ----------------------------------------------------------------
// Items
// ----------------------------------------------------------------
function FromItems(schema: S.XItems): S.XSchema | S.XSchema[] {
  return S.IsItemsSized(schema) ? FromItemsSized(schema) : FromItemsUnsized(schema)
}
// ----------------------------------------------------------------
// ItemsSized
// ----------------------------------------------------------------
function FromItemsSized(schema: S.XItemsSized): S.XSchema[] {
  return schema.items.map(FromSchema)
}
// ----------------------------------------------------------------
// ItemsUnsized
// ----------------------------------------------------------------
function FromItemsUnsized(schema: S.XItemsUnsized): S.XSchema {
  return FromSchema(schema.items)
}
// ----------------------------------------------------------------
// Not
// ----------------------------------------------------------------
function FromNot(schema: S.XNot): S.XSchema {
  return FromSchema(schema.not)
}
// ----------------------------------------------------------------
// OneOf
// ----------------------------------------------------------------
function FromOneOf(schema: S.XOneOf): S.XSchema[] {
  return schema.oneOf.map(FromSchema)
}
// ----------------------------------------------------------------
// PatternProperties
// ----------------------------------------------------------------
function FromPatternProperties(schema: S.XPatternProperties): Record<string, S.XSchema> {
  return Guard.Keys(schema.patternProperties).reduce((result, key) => ({ ...result, [key]: FromSchema(schema.patternProperties[key]) }), {})
}
// ----------------------------------------------------------------
// PrefixItems
// ----------------------------------------------------------------
function FromPrefixItems(schema: S.XPrefixItems): S.XSchema[] {
  return schema.prefixItems.map(FromSchema)
}
// ----------------------------------------------------------------
// Properties
// ----------------------------------------------------------------
function FromProperties(schema: S.XProperties): Record<string, S.XSchema> {
  return Guard.Keys(schema.properties).reduce((result, key) => ({ ...result, [key]: FromSchema(schema.properties[key]) }), {})
}
// ----------------------------------------------------------------
// PropertyNames
// ----------------------------------------------------------------
function FromPropertyNames(schema: S.XPropertyNames): S.XSchema {
  return FromSchema(schema.propertyNames)
}
// ----------------------------------------------------------------
// Then
// ----------------------------------------------------------------
function FromThen(schema: S.XThen): S.XSchema {
  return FromSchema(schema.then)
}
// ----------------------------------------------------------------
// UnevaluatedItems
// ----------------------------------------------------------------
function FromUnevaluatedItems(schema: S.XUnevaluatedItems): S.XSchema {
  return FromSchema(schema.unevaluatedItems)
}
// ----------------------------------------------------------------
// UnevaluatedProperties
// ----------------------------------------------------------------
function FromUnevaluatedProperties(schema: S.XUnevaluatedProperties): S.XSchema {
  return FromSchema(schema.unevaluatedProperties)
}
// ----------------------------------------------------------------
// SchemaObject
// ----------------------------------------------------------------
function FromSchemaObject(schema: S.XSchemaObject): S.XSchema {
  const mapped = {
    ...(S.IsProperties(schema) ? { properties: FromProperties(schema) } : {}),
    ...(S.IsPatternProperties(schema) ? { patternProperties: FromPatternProperties(schema) } : {}),
    ...(S.IsDependentSchemas(schema) ? { dependentSchemas: FromDependentSchemas(schema) } : {}),
    ...(S.IsAdditionalProperties(schema) ? { additionalProperties: FromAdditionalProperties(schema) } : {}),
    ...(S.IsUnevaluatedProperties(schema) ? { unevaluatedProperties: FromUnevaluatedProperties(schema) } : {}),
    ...(S.IsPropertyNames(schema) ? { propertyNames: FromPropertyNames(schema) } : {}),
    ...(S.IsItems(schema) ? { items: FromItems(schema) } : {}),
    ...(S.IsAdditionalItems(schema) ? { additionalItems: FromAdditionalItems(schema) } : {}),
    ...(S.IsUnevaluatedItems(schema) ? { unevaluatedItems: FromUnevaluatedItems(schema) } : {}),
    ...(S.IsPrefixItems(schema) ? { prefixItems: FromPrefixItems(schema) } : {}),
    ...(S.IsContains(schema) ? { contains: FromContains(schema) } : {}),
    ...(S.IsAllOf(schema) ? { allOf: FromAllOf(schema) } : {}),
    ...(S.IsAnyOf(schema) ? { anyOf: FromAnyOf(schema) } : {}),
    ...(S.IsOneOf(schema) ? { oneOf: FromOneOf(schema) } : {}),
    ...(S.IsNot(schema) ? { not: FromNot(schema) } : {}),
    ...(S.IsIf(schema) ? { if: FromIf(schema) } : {}),
    ...(S.IsThen(schema) ? { then: FromThen(schema) } : {}),
    ...(S.IsElse(schema) ? { else: FromElse(schema) } : {})
  }
  const processed = { ...schema, ...mapped }
  const hash = `x-${Hashing.Hash(processed)}`
  if (!registry.has(hash)) registry.set(hash, processed)
  return { $ref: `#/$defs/${hash}` }
}
// ----------------------------------------------------------------
// SchemaBoolean
// ----------------------------------------------------------------
function FromSchemaBoolean(schema: S.XSchemaBoolean): S.XSchema {
  return schema
}
// ----------------------------------------------------------------
// Schema
// ----------------------------------------------------------------
function FromSchema(schema: S.XSchema): S.XSchema {
  return S.IsSchemaBoolean(schema) ? FromSchemaBoolean(schema) : FromSchemaObject(schema)
}
// ----------------------------------------------------------------
// Registry
// ----------------------------------------------------------------
const registry = new Map<string, S.XSchemaObject>()

// ----------------------------------------------------------------
// TIntern
// ----------------------------------------------------------------
export interface TIntern<Value extends unknown = unknown> {
  '~unsafe': Value
  $ref: string
  $defs: Record<string, S.XSchemaObject>
}
/** Converts a JSON Schema into an interned (hash-consed) schema. Every distinct subschema is content-hashed and stored once in $defs, so structurally identical subschemas collapse into a single shared definition referenced by `$ref`. */
export function Intern<const Schema extends S.XSchema>(schema: Schema): TIntern<S.XStatic<Schema>> {
  registry.clear()
  const rootRef = FromSchema(schema) as { $ref: string }
  return { $ref: rootRef.$ref, $defs: Object.fromEntries(registry) } as never
}
