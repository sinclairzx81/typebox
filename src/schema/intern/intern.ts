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

import { Hashing, Memory } from '../../system/index.ts'
import { Guard } from '../../guard/index.ts'
import { Resolve } from '../resolve/index.ts'
import { type XStatic } from '../static/index.ts'
import * as S from '../types/index.ts'

// ----------------------------------------------------------------
// UnsupportedKeyword
// ----------------------------------------------------------------
function UnsupportedKeyword(keyword: string): never {
  throw Error(`UnsupportedKeyword '${keyword}'`)
}
// ----------------------------------------------------------------
// UnresolvableRef
// ----------------------------------------------------------------
function UnresolvableRef(ref: string): never {
  throw Error(`UnresolvableRef '${ref}'`)
}
// ----------------------------------------------------------------
// HashKey
// ----------------------------------------------------------------
function HashKey(schema: S.XSchema): string {
  return `x-${Hashing.Hash(schema)}`
}
// ----------------------------------------------------------------
// RefContext
// ----------------------------------------------------------------
interface RefContext {
  context: Record<string, S.XSchema>
  schema: S.XSchemaObject
  resolving: Map<S.XSchema, { key: string; used: boolean }>
}
// ----------------------------------------------------------------
// AdditionalItems
// ----------------------------------------------------------------
function FromAdditionalItems(context: RefContext, schema: S.XAdditionalItems): S.XSchema {
  return FromSchema(context, schema.additionalItems)
}
// ----------------------------------------------------------------
// AdditionalProperties
// ----------------------------------------------------------------
function FromAdditionalProperties(context: RefContext, schema: S.XAdditionalProperties): S.XSchema {
  return FromSchema(context, schema.additionalProperties)
}
// ----------------------------------------------------------------
// AllOf
// ----------------------------------------------------------------
function FromAllOf(context: RefContext, schema: S.XAllOf): S.XSchema[] {
  return schema.allOf.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// AnyOf
// ----------------------------------------------------------------
function FromAnyOf(context: RefContext, schema: S.XAnyOf): S.XSchema[] {
  return schema.anyOf.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// Contains
// ----------------------------------------------------------------
function FromContains(context: RefContext, schema: S.XContains): S.XSchema {
  return FromSchema(context, schema.contains)
}
// ----------------------------------------------------------------
// DependentSchemas
// ----------------------------------------------------------------
function FromDependentSchemas(context: RefContext, schema: S.XDependentSchemas): Record<string, S.XSchema> {
  return Guard.Keys(schema.dependentSchemas).reduce((result, key) => ({ ...result, [key]: FromSchema(context, schema.dependentSchemas[key]) }), {})
}
// ----------------------------------------------------------------
// Else
// ----------------------------------------------------------------
function FromElse(context: RefContext, schema: S.XElse): S.XSchema {
  return FromSchema(context, schema.else)
}
// ----------------------------------------------------------------
// If
// ----------------------------------------------------------------
function FromIf(context: RefContext, schema: S.XIf): S.XSchema {
  return FromSchema(context, schema.if)
}
// ----------------------------------------------------------------
// Items
// ----------------------------------------------------------------
function FromItems(context: RefContext, schema: S.XItems): S.XSchema | S.XSchema[] {
  return S.IsItemsSized(schema) ? FromItemsSized(context, schema) : FromItemsUnsized(context, schema)
}
// ----------------------------------------------------------------
// ItemsSized
// ----------------------------------------------------------------
function FromItemsSized(context: RefContext, schema: S.XItemsSized): S.XSchema[] {
  return schema.items.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// ItemsUnsized
// ----------------------------------------------------------------
function FromItemsUnsized(context: RefContext, schema: S.XItemsUnsized): S.XSchema {
  return FromSchema(context, schema.items)
}
// ----------------------------------------------------------------
// Not
// ----------------------------------------------------------------
function FromNot(context: RefContext, schema: S.XNot): S.XSchema {
  return FromSchema(context, schema.not)
}
// ----------------------------------------------------------------
// OneOf
// ----------------------------------------------------------------
function FromOneOf(context: RefContext, schema: S.XOneOf): S.XSchema[] {
  return schema.oneOf.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// PatternProperties
// ----------------------------------------------------------------
function FromPatternProperties(context: RefContext, schema: S.XPatternProperties): Record<string, S.XSchema> {
  return Guard.Keys(schema.patternProperties).reduce((result, key) => ({ ...result, [key]: FromSchema(context, schema.patternProperties[key]) }), {})
}
// ----------------------------------------------------------------
// PrefixItems
// ----------------------------------------------------------------
function FromPrefixItems(context: RefContext, schema: S.XPrefixItems): S.XSchema[] {
  return schema.prefixItems.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// Properties
// ----------------------------------------------------------------
function FromProperties(context: RefContext, schema: S.XProperties): Record<string, S.XSchema> {
  return Guard.Keys(schema.properties).reduce((result, key) => ({ ...result, [key]: FromSchema(context, schema.properties[key]) }), {})
}
// ----------------------------------------------------------------
// PropertyNames
// ----------------------------------------------------------------
function FromPropertyNames(context: RefContext, schema: S.XPropertyNames): S.XSchema {
  return FromSchema(context, schema.propertyNames)
}
// ----------------------------------------------------------------
// Ref
// ----------------------------------------------------------------
function ResolveRef(context: Record<string, S.XSchema>, schema: S.XSchemaObject, ref: string): S.XSchema {
  return Resolve.Ref(context, schema, ref) ?? UnresolvableRef(ref)
}
function FromRef(context: RefContext, schema: S.XRef): S.XSchema {
  // resolve target, boolean schemas return as is.
  const target = ResolveRef(context.context, context.schema, schema.$ref)
  if (S.IsSchemaBoolean(target)) return target
  // check if target is resolving, if not, resolve
  const pending = context.resolving.get(target)
  if (Guard.IsUndefined(pending)) return FromSchema(context, target)
  // target is mid-conversion, so this is a cycle (point at its reserved placeholder)
  pending.used = true
  return { $ref: `#/$defs/${pending.key}` }
}
// ----------------------------------------------------------------
// Then
// ----------------------------------------------------------------
function FromThen(context: RefContext, schema: S.XThen): S.XSchema {
  return FromSchema(context, schema.then)
}
// ----------------------------------------------------------------
// UnevaluatedItems
// ----------------------------------------------------------------
function FromUnevaluatedItems(context: RefContext, schema: S.XUnevaluatedItems): S.XSchema {
  return FromSchema(context, schema.unevaluatedItems)
}
// ----------------------------------------------------------------
// UnevaluatedProperties
// ----------------------------------------------------------------
function FromUnevaluatedProperties(context: RefContext, schema: S.XUnevaluatedProperties): S.XSchema {
  return FromSchema(context, schema.unevaluatedProperties)
}
// ----------------------------------------------------------------
// SchemaObject
// ----------------------------------------------------------------
function FromSchemaObject(context: RefContext, schema: S.XSchemaObject): S.XSchema {
  // Reference schemas cannot contain other keywords
  if (S.IsRef(schema)) return FromRef(context, schema)

  // Check if the schema has already been resolved
  const existing = resolved.get(schema)
  if (!Guard.IsUndefined(existing)) return existing

  // These keywords are unsupported
  if (S.IsDynamicRef(schema)) UnsupportedKeyword('$dynamicRef')
  if (S.IsRecursiveRef(schema)) UnsupportedKeyword('$recursiveRef')

  // Reserve a placeholder key in case a nested ref cycles back to this schema
  const reservation = { key: `x-ref-${context.resolving.size}`, used: false }
  context.resolving.set(schema, reservation)

  // Intern each subschema
  const remapped = {
    ...(S.IsRefine(schema) ? { ['~refine']: schema['~refine'] } : {}),
    ...(S.IsAdditionalItems(schema) ? { additionalItems: FromAdditionalItems(context, schema) } : {}),
    ...(S.IsAdditionalProperties(schema) ? { additionalProperties: FromAdditionalProperties(context, schema) } : {}),
    ...(S.IsAllOf(schema) ? { allOf: FromAllOf(context, schema) } : {}),
    ...(S.IsAnyOf(schema) ? { anyOf: FromAnyOf(context, schema) } : {}),
    ...(S.IsContains(schema) ? { contains: FromContains(context, schema) } : {}),
    ...(S.IsDependentSchemas(schema) ? { dependentSchemas: FromDependentSchemas(context, schema) } : {}),
    ...(S.IsElse(schema) ? { else: FromElse(context, schema) } : {}),
    ...(S.IsIf(schema) ? { if: FromIf(context, schema) } : {}),
    ...(S.IsItems(schema) ? { items: FromItems(context, schema) } : {}),
    ...(S.IsNot(schema) ? { not: FromNot(context, schema) } : {}),
    ...(S.IsOneOf(schema) ? { oneOf: FromOneOf(context, schema) } : {}),
    ...(S.IsPatternProperties(schema) ? { patternProperties: FromPatternProperties(context, schema) } : {}),
    ...(S.IsPrefixItems(schema) ? { prefixItems: FromPrefixItems(context, schema) } : {}),
    ...(S.IsProperties(schema) ? { properties: FromProperties(context, schema) } : {}),
    ...(S.IsPropertyNames(schema) ? { propertyNames: FromPropertyNames(context, schema) } : {}),
    ...(S.IsThen(schema) ? { then: FromThen(context, schema) } : {}),
    ...(S.IsUnevaluatedItems(schema) ? { unevaluatedItems: FromUnevaluatedItems(context, schema) } : {}),
    ...(S.IsUnevaluatedProperties(schema) ? { unevaluatedProperties: FromUnevaluatedProperties(context, schema) } : {})
  }

  context.resolving.delete(schema)

  // Finalize and register the result
  const interned = Memory.Discard(Memory.Assign(schema, remapped), ['$id'])
  const key = reservation.used ? reservation.key : HashKey(interned)
  registry.set(key, interned)

  const result: S.XSchema = { $ref: `#/$defs/${key}` }
  resolved.set(schema, result)
  return result
}
// ----------------------------------------------------------------
// Schema
// ----------------------------------------------------------------
function FromSchema(context: RefContext, schema: S.XSchema): S.XSchema {
  return S.IsSchemaBoolean(schema) ? schema : FromSchemaObject(context, schema)
}

// ----------------------------------------------------------------
// Module-level accumulator state
// ----------------------------------------------------------------
const registry = new Map<string, S.XSchemaObject>()
const resolved = new Map<S.XSchema, S.XSchema>()
// ----------------------------------------------------------------
// XIntern
// ----------------------------------------------------------------
export interface XIntern<Type extends unknown = unknown> {
  '~unsafe': Type
  $ref: string
  $defs: Record<string, S.XSchemaObject>
}
// ----------------------------------------------------------------
// BooleanIntern
// ----------------------------------------------------------------
function BooleanIntern(schema: S.XSchemaBoolean): S.XSchemaObject {
  return { $ref: `#/$defs/${HashKey(schema)}`, $defs: { [HashKey(schema)]: schema } }
}
/**
 * (Experimental) Performs a Common Subexpression Elimination-like transform on the given schema. It restructures the schema such that each distinct sub-schema is stored exactly once in a
 * `$defs` object, keyed by its content hash. This function can be used to compress and optimize schematics prior to compilation.
 */
export function Intern<const Schema extends S.XSchema>(schema: Schema): XIntern<XStatic<Schema>> {
  registry.clear()
  resolved.clear()
  if (S.IsSchemaBoolean(schema)) return BooleanIntern(schema) as never
  const context = S.IsDefs(schema) ? schema.$defs : {}
  const entry = S.IsRef(schema) ? ResolveRef(context, schema, schema.$ref) : schema
  if (S.IsSchemaBoolean(entry)) return BooleanIntern(entry) as never
  const ref_context: RefContext = { schema, context, resolving: new Map() }
  const result = FromSchema(ref_context, entry) as { $ref: string }
  return { $ref: result.$ref, $defs: Object.fromEntries(registry) } as never
}
