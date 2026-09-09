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

import { Arguments } from '../../system/arguments/index.ts'
import { Hashing, Memory } from '../../system/index.ts'

import * as Schema from '../types/index.ts'
import * as Stack from '../engine/_stack.ts'
import { type XStatic } from '../static/index.ts'
import { Guard } from '../../guard/index.ts'
import { Resolve } from '../resolve/index.ts'

// ----------------------------------------------------------------
// (Internal) RefContext
// ----------------------------------------------------------------
interface XRefContext {
  stack: Stack.XStack
  resolving: Map<Schema.XSchema, { key: string; used: boolean }>
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
function HashKey(schema: Schema.XSchema): string {
  return `x-${Hashing.Hash(schema)}`
}
// ----------------------------------------------------------------
// AdditionalItems
// ----------------------------------------------------------------
function FromAdditionalItems(context: XRefContext, schema: Schema.XAdditionalItems): Schema.XSchema {
  return FromSchema(context, schema.additionalItems)
}
// ----------------------------------------------------------------
// AdditionalProperties
// ----------------------------------------------------------------
function FromAdditionalProperties(context: XRefContext, schema: Schema.XAdditionalProperties): Schema.XSchema {
  return FromSchema(context, schema.additionalProperties)
}
// ----------------------------------------------------------------
// AllOf
// ----------------------------------------------------------------
function FromAllOf(context: XRefContext, schema: Schema.XAllOf): Schema.XSchema[] {
  return schema.allOf.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// AnyOf
// ----------------------------------------------------------------
function FromAnyOf(context: XRefContext, schema: Schema.XAnyOf): Schema.XSchema[] {
  return schema.anyOf.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// Contains
// ----------------------------------------------------------------
function FromContains(context: XRefContext, schema: Schema.XContains): Schema.XSchema {
  return FromSchema(context, schema.contains)
}
// ----------------------------------------------------------------
// DependentSchemas
// ----------------------------------------------------------------
function FromDependentSchemas(context: XRefContext, schema: Schema.XDependentSchemas): Record<string, Schema.XSchema> {
  return Guard.Keys(schema.dependentSchemas).reduce((result, key) => ({ ...result, [key]: FromSchema(context, schema.dependentSchemas[key]) }), {})
}
// ----------------------------------------------------------------
// Else
// ----------------------------------------------------------------
function FromElse(context: XRefContext, schema: Schema.XElse): Schema.XSchema {
  return FromSchema(context, schema.else)
}
// ----------------------------------------------------------------
// If
// ----------------------------------------------------------------
function FromIf(context: XRefContext, schema: Schema.XIf): Schema.XSchema {
  return FromSchema(context, schema.if)
}
// ----------------------------------------------------------------
// Items
// ----------------------------------------------------------------
function FromItems(context: XRefContext, schema: Schema.XItems): Schema.XSchema | Schema.XSchema[] {
  return Schema.IsItemsSized(schema) ? FromItemsSized(context, schema) : FromItemsUnsized(context, schema)
}
// ----------------------------------------------------------------
// ItemsSized
// ----------------------------------------------------------------
function FromItemsSized(context: XRefContext, schema: Schema.XItemsSized): Schema.XSchema[] {
  return schema.items.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// ItemsUnsized
// ----------------------------------------------------------------
function FromItemsUnsized(context: XRefContext, schema: Schema.XItemsUnsized): Schema.XSchema {
  return FromSchema(context, schema.items)
}
// ----------------------------------------------------------------
// Not
// ----------------------------------------------------------------
function FromNot(context: XRefContext, schema: Schema.XNot): Schema.XSchema {
  return FromSchema(context, schema.not)
}
// ----------------------------------------------------------------
// OneOf
// ----------------------------------------------------------------
function FromOneOf(context: XRefContext, schema: Schema.XOneOf): Schema.XSchema[] {
  return schema.oneOf.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// PatternProperties
// ----------------------------------------------------------------
function FromPatternProperties(context: XRefContext, schema: Schema.XPatternProperties): Record<string, Schema.XSchema> {
  return Guard.Keys(schema.patternProperties).reduce((result, key) => ({ ...result, [key]: FromSchema(context, schema.patternProperties[key]) }), {})
}
// ----------------------------------------------------------------
// PrefixItems
// ----------------------------------------------------------------
function FromPrefixItems(context: XRefContext, schema: Schema.XPrefixItems): Schema.XSchema[] {
  return schema.prefixItems.map((inner) => FromSchema(context, inner))
}
// ----------------------------------------------------------------
// Properties
// ----------------------------------------------------------------
function FromProperties(context: XRefContext, schema: Schema.XProperties): Record<string, Schema.XSchema> {
  return Guard.Keys(schema.properties).reduce((result, key) => ({ ...result, [key]: FromSchema(context, schema.properties[key]) }), {})
}
// ----------------------------------------------------------------
// PropertyNames
// ----------------------------------------------------------------
function FromPropertyNames(context: XRefContext, schema: Schema.XPropertyNames): Schema.XSchema {
  return FromSchema(context, schema.propertyNames)
}
// ----------------------------------------------------------------
// Ref
// ----------------------------------------------------------------
function ResolveRef(stack: Stack.XStack, ref: string): { schema: Schema.XSchema; stack: Stack.XStack } {
  const result = Resolve.Ref(stack, { $ref: ref })
  return { schema: result.schema ?? UnresolvableRef(ref), stack: result.stack }
}
// ----------------------------------------------------------------
// DynamicRef
// ----------------------------------------------------------------
function ResolveDynamicRef(stack: Stack.XStack, schema: Schema.XDynamicRef): Schema.XSchema {
  return Resolve.DynamicRef(stack, schema) ?? UnresolvableRef(schema.$dynamicRef)
}
// ----------------------------------------------------------------
// RecursiveRef
// ----------------------------------------------------------------
function ResolveRecursiveRef(stack: Stack.XStack, schema: Schema.XRecursiveRef): Schema.XSchema {
  return Resolve.RecursiveRef(stack, schema) ?? UnresolvableRef(schema.$recursiveRef)
}
// ----------------------------------------------------------------
// FromResolvedRef (shared logic for Ref, DynamicRef, RecursiveRef)
// ----------------------------------------------------------------
function FromResolvedRef(context: XRefContext, target: Schema.XSchema, nextStack: Stack.XStack): Schema.XSchema {
  const nextContext = { ...context, stack: nextStack }
  const resolving = context.resolving.get(target)
  if (Guard.IsUndefined(resolving)) return FromSchema(nextContext, target)
  // Target is mid-intern, so this is a cycle (point at its reserved placeholder)
  resolving.used = true
  return { $ref: `#/$defs/${resolving.key}` }
}
// ----------------------------------------------------------------
// FromRef
// ----------------------------------------------------------------
function FromRef(context: XRefContext, schema: Schema.XRef): Schema.XSchema {
  // Resolve target off the current traversal stack, carrying forward any resource crossing
  const { schema: target, stack } = ResolveRef(context.stack, schema.$ref)
  return FromResolvedRef(context, target, stack)
}
// ----------------------------------------------------------------
// FromDynamicRef
// ----------------------------------------------------------------
function FromDynamicRef(context: XRefContext, schema: Schema.XDynamicRef): Schema.XSchema {
  // Resolve target off the current traversal stack (dynamic scope depends on anchors seen so far)
  const target = ResolveDynamicRef(context.stack, schema)
  return FromResolvedRef(context, target, { ...context.stack, pendingResource: true })
}
// ----------------------------------------------------------------
// FromRecursiveRef
// ----------------------------------------------------------------
function FromRecursiveRef(context: XRefContext, schema: Schema.XRecursiveRef): Schema.XSchema {
  // Resolve target off the current traversal stack (recursive scope depends on the path taken so far)
  const target = ResolveRecursiveRef(context.stack, schema)
  return FromResolvedRef(context, target, { ...context.stack, pendingResource: true })
}
// ----------------------------------------------------------------
// Then
// ----------------------------------------------------------------
function FromThen(context: XRefContext, schema: Schema.XThen): Schema.XSchema {
  return FromSchema(context, schema.then)
}
// ----------------------------------------------------------------
// UnevaluatedItems
// ----------------------------------------------------------------
function FromUnevaluatedItems(context: XRefContext, schema: Schema.XUnevaluatedItems): Schema.XSchema {
  return FromSchema(context, schema.unevaluatedItems)
}
// ----------------------------------------------------------------
// UnevaluatedProperties
// ----------------------------------------------------------------
function FromUnevaluatedProperties(context: XRefContext, schema: Schema.XUnevaluatedProperties): Schema.XSchema {
  return FromSchema(context, schema.unevaluatedProperties)
}
// ----------------------------------------------------------------
// SchemaObject
// ----------------------------------------------------------------
function FromSchemaObject(context: XRefContext, schema: Schema.XSchemaObject): Schema.XSchema {
  // Reference-style schemas resolve to another node and cannot contain other keywords
  if (Schema.IsRef(schema)) return FromRef(context, schema)
  if (Schema.IsDynamicRef(schema)) return FromDynamicRef(context, schema)
  if (Schema.IsRecursiveRef(schema)) return FromRecursiveRef(context, schema)
  // Check if the schema has already been resolved
  const existing = resolved.get(schema)
  if (!Guard.IsUndefined(existing)) return existing
  // Reserve a placeholder key in case a nested ref cycles back to this schema
  const reservation = { key: `x-ref-${context.resolving.size}`, used: false }
  context.resolving.set(schema, reservation)
  // Intern each subschema
  const remapped = {
    ...(Schema.IsRefine(schema) ? { ['~refine']: schema['~refine'] } : {}),
    ...(Schema.IsAdditionalItems(schema) ? { additionalItems: FromAdditionalItems(context, schema) } : {}),
    ...(Schema.IsAdditionalProperties(schema) ? { additionalProperties: FromAdditionalProperties(context, schema) } : {}),
    ...(Schema.IsAllOf(schema) ? { allOf: FromAllOf(context, schema) } : {}),
    ...(Schema.IsAnyOf(schema) ? { anyOf: FromAnyOf(context, schema) } : {}),
    ...(Schema.IsContains(schema) ? { contains: FromContains(context, schema) } : {}),
    ...(Schema.IsDependentSchemas(schema) ? { dependentSchemas: FromDependentSchemas(context, schema) } : {}),
    ...(Schema.IsElse(schema) ? { else: FromElse(context, schema) } : {}),
    ...(Schema.IsIf(schema) ? { if: FromIf(context, schema) } : {}),
    ...(Schema.IsItems(schema) ? { items: FromItems(context, schema) } : {}),
    ...(Schema.IsNot(schema) ? { not: FromNot(context, schema) } : {}),
    ...(Schema.IsOneOf(schema) ? { oneOf: FromOneOf(context, schema) } : {}),
    ...(Schema.IsPatternProperties(schema) ? { patternProperties: FromPatternProperties(context, schema) } : {}),
    ...(Schema.IsPrefixItems(schema) ? { prefixItems: FromPrefixItems(context, schema) } : {}),
    ...(Schema.IsProperties(schema) ? { properties: FromProperties(context, schema) } : {}),
    ...(Schema.IsPropertyNames(schema) ? { propertyNames: FromPropertyNames(context, schema) } : {}),
    ...(Schema.IsThen(schema) ? { then: FromThen(context, schema) } : {}),
    ...(Schema.IsUnevaluatedItems(schema) ? { unevaluatedItems: FromUnevaluatedItems(context, schema) } : {}),
    ...(Schema.IsUnevaluatedProperties(schema) ? { unevaluatedProperties: FromUnevaluatedProperties(context, schema) } : {})
  }
  context.resolving.delete(schema)
  // Discard resolution keywords and finalize the interned schema
  const interned = Memory.Discard(Memory.Assign(schema, remapped), ['$id', '$defs', '$anchor', '$dynamicAnchor', '$recursionAnchor'])
  const key = reservation.used ? reservation.key : HashKey(interned)
  registry.set(key, interned)
  // Result
  const result: Schema.XSchema = { $ref: `#/$defs/${key}` }
  resolved.set(schema, result)
  return result
}
// ----------------------------------------------------------------
// SchemaBoolean
// ----------------------------------------------------------------
function FromSchemaBoolean(_context: XRefContext, schema: Schema.XSchemaBoolean): Schema.XSchema {
  // Finalize and register the result
  const key = HashKey(schema)
  registry.set(key, schema)
  // Result
  const result: Schema.XSchema = { $ref: `#/$defs/${key}` }
  resolved.set(schema, result)
  return result
}
// ----------------------------------------------------------------
// Schema
// ----------------------------------------------------------------
function FromSchema(context: XRefContext, schema: Schema.XSchema): Schema.XSchema {
  const next = { ...context, stack: Stack.NextStack(context.stack, schema) }
  return Schema.IsSchemaBoolean(schema) ? FromSchemaBoolean(next, schema) : FromSchemaObject(next, schema)
}
// ----------------------------------------------------------------
// BooleanEntry
// ----------------------------------------------------------------
function BooleanEntry(schema: Schema.XSchemaBoolean): Schema.XSchemaObject {
  const key = HashKey(schema)
  return { $ref: `#/$defs/${key}`, $defs: { [key]: schema } }
}
// ----------------------------------------------------------------
// Module-level accumulator state
// ----------------------------------------------------------------
const registry = new Map<string, Schema.XSchema>()
const resolved = new Map<Schema.XSchema, Schema.XSchema>()
// ----------------------------------------------------------------
// XIntern
// ----------------------------------------------------------------
export interface XIntern<Type extends unknown = unknown> {
  '~unsafe': Type
  $ref: string
  $defs: Record<string, Schema.XSchemaObject>
}
// ------------------------------------------------------------------
// Intern
// ------------------------------------------------------------------
/** (Experimental) This function restructures the schema such that each distinct sub-schema is stored exactly once in a $defs object and keyed by content hash. */
export function Intern<const Schema extends Schema.XSchema>(schema: Schema): XIntern<XStatic<Schema>>
/** (Experimental) This function restructures the schema such that each distinct sub-schema is stored exactly once in a $defs object and keyed by content hash. */
export function Intern<const Schema extends Schema.XSchema>(context: Record<PropertyKey, Schema.XSchema>, schema: Schema): XIntern<XStatic<Schema>>
/** (Experimental) This function restructures the schema such that each distinct sub-schema is stored exactly once in a $defs object and keyed by content hash. */
export function Intern(...args: unknown[]): unknown {
  const [context, schema] = Arguments.Match<[Record<PropertyKey, Schema.XSchema>, Schema.XSchema]>(args, {
    2: (context, schema) => [context, schema],
    1: (schema) => [{}, schema]
  })
  registry.clear()
  resolved.clear()
  if (Schema.IsSchemaBoolean(schema)) return BooleanEntry(schema) as never
  const defs = Schema.IsDefs(schema) ? schema.$defs : {}
  const rootStack = Stack.Stack({ ...context, ...defs }, schema)
  const { schema: entry, stack } = Schema.IsRef(schema) ? ResolveRef(Stack.NextStack(rootStack, schema), schema.$ref) : { schema, stack: rootStack }
  if (Schema.IsSchemaBoolean(entry)) return BooleanEntry(entry) as never
  const ref_context: XRefContext = { stack, resolving: new Map() }
  const result = FromSchema(ref_context, entry) as { $ref: string }
  return { $ref: result.$ref, $defs: Object.fromEntries(registry) } as never
}
