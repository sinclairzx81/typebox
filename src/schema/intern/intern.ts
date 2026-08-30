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
  entry: S.XSchemaObject
  cyclic: boolean
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
  const target = ResolveRef(context.context, context.schema, schema.$ref)
  if (Guard.IsEqual(target, context.entry) && context.cyclic) return { $ref: '#' }
  const existing = resolved.get(target)
  if (!Guard.IsUndefined(existing)) return existing
  const isRoot = Guard.IsEqual(target, context.entry)
  if (isRoot) context.cyclic = true
  const reserved: S.XSchema = isRoot ? { $ref: '#' } : { $ref: `#/$defs/x-ref-${counter++}` }
  resolved.set(target, reserved)
  const converted = FromSchema(context, target)
  if (!isRoot) registry.set((reserved as { $ref: string }).$ref.slice('#/$defs/'.length), converted as S.XSchemaObject)
  return isRoot ? converted : reserved
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
  // unsupported
  if (S.IsDynamicRef(schema)) UnsupportedKeyword('$dynamicRef')
  if (S.IsRecursiveRef(schema)) UnsupportedKeyword('$recursiveRef')
  // reference
  if (S.IsRef(schema)) return FromRef(context, schema)
  // remapped
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
  const interned = Memory.Discard(Memory.Assign(schema, remapped), ['$id'])
  const hashkey = HashKey(interned)
  registry.set(hashkey, interned)
  return { $ref: `#/$defs/${hashkey}` }
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
function FromSchema(context: RefContext, schema: S.XSchema): S.XSchema {
  return (
    S.IsSchemaBoolean(schema) ? FromSchemaBoolean(schema) : FromSchemaObject(context, schema)
  )
}
// ----------------------------------------------------------------
// Module-level accumulator state
// ----------------------------------------------------------------
const registry = new Map<string, S.XSchemaObject>()
const resolved = new Map<S.XSchema, S.XSchema>()
let counter = 0
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
 * (Experimental) Performs a [Common Subexpression Elimination](https://en.wikipedia.org/wiki/Common_subexpression_elimination)-like
 * transform on the given schema. It restructures the schema such that each distinct sub-schema is stored exactly once in a
 * `$defs` object, keyed by its content hash. This function can be used to compress and optimize schematics prior to compilation.
 */
export function Intern<const Schema extends S.XSchema>(schema: Schema): XIntern<XStatic<Schema>> {
  registry.clear()
  resolved.clear()
  counter = 0
  if (S.IsSchemaBoolean(schema)) return BooleanIntern(schema) as never
  const context = S.IsDefs(schema) ? schema.$defs : {}
  const entry = S.IsRef(schema) ? ResolveRef(context, schema, schema.$ref) : schema
  if (S.IsSchemaBoolean(entry)) return BooleanIntern(entry) as never
  const ref_context: RefContext = { schema, context, entry, cyclic: false }
  const result = FromSchema(ref_context, schema) as { $ref: string }
  return { $ref: result.$ref, $defs: Object.fromEntries(registry) } as never
}
