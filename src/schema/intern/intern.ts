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

import { Arguments } from '../../system/arguments/index.ts'
import { Hashing } from '../../system/index.ts'
import * as Schema from '../types/index.ts'
import * as Stack from '../engine/_stack.ts'
import { type XStatic } from '../static/index.ts'
import { Guard } from '../../guard/index.ts'
import { Resolve } from '../resolve/index.ts'


type XSchemaRecord = Record<string, unknown>

// ------------------------------------------------------------------
// ResolutionKeywords
//
// Keywords that only matter for resolving refs against this schema
// (base URI, dynamic/recursive scope anchors) and carry no validation
// meaning once resolution has happened. FromSchemaObjectIntern strips
// all of these from every interned entry. IsReferential must agree
// with this exact list: a schema differing from a bare ref only by
// these keywords resolves to the same interned target either way, so
// treating it as "has siblings" would fabricate a wrapper entry whose
// siblings vanish on the very next intern pass -- see IsReferential.
// ------------------------------------------------------------------
const ResolutionKeywords = ['$schema', '$id', '$anchor', '$dynamicAnchor', '$recursionAnchor'] as const

// ------------------------------------------------------------------
// (Internal) XInternContext
// ------------------------------------------------------------------
interface XInternContext {
  stack: Stack.XStack
  registry: Map<string, Schema.XSchema>
  resolved: Map<Schema.XSchema, Schema.XSchema>
  remotes: Record<PropertyKey, Schema.XSchema>
  // Schemas currently being interned (mid-FromSchemaObjectIntern),
  // keyed by their reserved $defs key. Lets PostResolvedRef detect
  // and break cycles. See PostResolvedRef and FromSchemaObjectIntern.
  resolving: Map<Schema.XSchema, { key: string; cyclic: boolean }>
}
function InternContext(remotes: Record<PropertyKey, Schema.XSchema>, schema: Schema.XSchemaObject): XInternContext {
  const defs = Schema.IsDefs(schema) ? schema.$defs : {}
  const stack = Stack.Stack({ ...remotes, ...defs }, schema)
  return { stack, registry: new Map(), resolved: new Map(), remotes, resolving: new Map() }
}

// ------------------------------------------------------------------
// HashKey
// ------------------------------------------------------------------
function HashKey(schema: Schema.XSchema): string {
  return `x-${Hashing.Hash(schema)}`
}
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
function ResolveRef(stack: Stack.XStack, ref: string): { schema: Schema.XSchema; stack: Stack.XStack } {
  const result = Resolve.Ref(stack, { $ref: ref })
  return { schema: result.schema ?? false, stack: result.stack }
}
// ------------------------------------------------------------------
// PostResolvedRef
//
// Common tail for every ref-like keyword ($ref, $dynamicRef,
// $recursiveRef) once its target is found. If the target isn't
// already being interned, intern it normally. If it's mid-intern
// further up the stack, that's a cycle: point at the placeholder key
// FromSchemaObjectIntern reserved for it. This is what stops a
// self-referencing schema (e.g. a linked-list node whose `next` is
// `$ref`'d back to itself) from recursing forever.
// ------------------------------------------------------------------
function PostResolvedRef(context: XInternContext, target: Schema.XSchema, nextStack: Stack.XStack): Schema.XSchema {
  const nextContext = { ...context, stack: nextStack }
  const resolving = context.resolving.get(target)
  if (Guard.IsUndefined(resolving)) return FromSchema(nextContext, target)
  // Target is mid-intern, so this is a cycle (point at its reserved placeholder)
  resolving.cyclic = true
  return { $ref: `#/$defs/${resolving.key}` }
}
// ------------------------------------------------------------------
// IsReferential
//
// True when a schema is just refKey (plus $defs and/or resolution
// keywords), with no real validation siblings. $defs doesn't count
// as a sibling: it's a definitions container, not a constraint.
// Resolution keywords (see ResolutionKeywords) don't count either:
// FromSchemaObjectIntern strips them unconditionally, so a schema
// differing from a bare ref only by these keys interns to the exact
// same target as the bare ref -- treating it as "has siblings" would
// fabricate a wrapper entry whose siblings vanish on the next pass,
// breaking idempotence. Contrast MergeWithSiblings, which handles a
// real sibling keyword alongside a ref-like keyword.
// ------------------------------------------------------------------
function IsReferential(schema: Schema.XSchemaObject, refKey: string): boolean {
  return Guard.Keys(schema as Record<PropertyKey, unknown>).every((key) =>
    Guard.IsEqual(key, refKey) || Guard.IsEqual(key, '$defs') || (ResolutionKeywords as readonly string[]).includes(key)
  )
}
// ------------------------------------------------------------------
// AdditionalItems
// ------------------------------------------------------------------
function FromAdditionalItems(context: XInternContext, schema: Schema.XAdditionalItems): Schema.XSchema {
  return FromSchema(context, schema.additionalItems)
}
// ------------------------------------------------------------------
// AdditionalProperties
// ------------------------------------------------------------------
function FromAdditionalProperties(context: XInternContext, schema: Schema.XAdditionalProperties): Schema.XSchema {
  return FromSchema(context, schema.additionalProperties)
}
// ------------------------------------------------------------------
// AllOf
// ------------------------------------------------------------------
function FromAllOf(context: XInternContext, schema: Schema.XAllOf): Schema.XSchema[] {
  return schema.allOf.map((inner) => FromSchema(context, inner))
}
// ------------------------------------------------------------------
// AnyOf
// ------------------------------------------------------------------
function FromAnyOf(context: XInternContext, schema: Schema.XAnyOf): Schema.XSchema[] {
  return schema.anyOf.map((inner) => FromSchema(context, inner))
}
// ------------------------------------------------------------------
// Contains
// ------------------------------------------------------------------
function FromContains(context: XInternContext, schema: Schema.XContains): Schema.XSchema {
  return FromSchema(context, schema.contains)
}
// ------------------------------------------------------------------
// DependentSchemas
// ------------------------------------------------------------------
function FromDependentSchemas(context: XInternContext, schema: Schema.XDependentSchemas): Record<string, Schema.XSchema> {
  return Guard.Keys(schema.dependentSchemas).reduce((result, key) => {
    return result[key] = FromSchema(context, schema.dependentSchemas[key]), result
  }, Object.create(null))
}
// ------------------------------------------------------------------
// DynamicRef
// ------------------------------------------------------------------
function FromDynamicRef(context: XInternContext, schema: Schema.XDynamicRef): Schema.XSchema {
  const target = Resolve.DynamicRef(context.stack, schema) ?? false
  const reference = PostResolvedRef(context, target, { ...context.stack, pendingResource: true }) as Schema.XRef
  return IsReferential(schema, '$dynamicRef') ? reference : MergeWithSiblings(context, schema, '$dynamicRef', reference.$ref)
}
// ------------------------------------------------------------------
// Else
// ------------------------------------------------------------------
function FromElse(context: XInternContext, schema: Schema.XElse): Schema.XSchema {
  return FromSchema(context, schema.else)
}
// ------------------------------------------------------------------
// If
// ------------------------------------------------------------------
function FromIf(context: XInternContext, schema: Schema.XIf): Schema.XSchema {
  return FromSchema(context, schema.if)
}
// ------------------------------------------------------------------
// Items
// ------------------------------------------------------------------
function FromItems(context: XInternContext, schema: Schema.XItems): Schema.XSchema | Schema.XSchema[] {
  return Schema.IsItemsSized(schema) ? FromItemsSized(context, schema) : FromItemsUnsized(context, schema)
}
// ------------------------------------------------------------------
// ItemsSized
// ------------------------------------------------------------------
function FromItemsSized(context: XInternContext, schema: Schema.XItemsSized): Schema.XSchema[] {
  return schema.items.map((inner) => FromSchema(context, inner))
}
// ------------------------------------------------------------------
// ItemsUnsized
// ------------------------------------------------------------------
function FromItemsUnsized(context: XInternContext, schema: Schema.XItemsUnsized): Schema.XSchema {
  return FromSchema(context, schema.items)
}
// ------------------------------------------------------------------
// Not
// ------------------------------------------------------------------
function FromNot(context: XInternContext, schema: Schema.XNot): Schema.XSchema {
  return FromSchema(context, schema.not)
}
// ------------------------------------------------------------------
// OneOf
// ------------------------------------------------------------------
function FromOneOf(context: XInternContext, schema: Schema.XOneOf): Schema.XSchema[] {
  return schema.oneOf.map((inner) => FromSchema(context, inner))
}
// ------------------------------------------------------------------
// PatternProperties
// ------------------------------------------------------------------
function FromPatternProperties(context: XInternContext, schema: Schema.XPatternProperties): Record<string, Schema.XSchema> {
  return Guard.Keys(schema.patternProperties).reduce((result, key) => {
    return result[key] = FromSchema(context, schema.patternProperties[key]), result
  }, Object.create(null))
}
// ------------------------------------------------------------------
// PrefixItems
// ------------------------------------------------------------------
function FromPrefixItems(context: XInternContext, schema: Schema.XPrefixItems): Schema.XSchema[] {
  return schema.prefixItems.map((inner) => FromSchema(context, inner))
}
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
function FromProperties(context: XInternContext, schema: Schema.XProperties): Record<string, Schema.XSchema> {
  return Guard.Keys(schema.properties).reduce((result, key) => {
    return result[key] = FromSchema(context, schema.properties[key]), result
  }, Object.create(null))
}
// ------------------------------------------------------------------
// PropertyNames
// ------------------------------------------------------------------
function FromPropertyNames(context: XInternContext, schema: Schema.XPropertyNames): Schema.XSchema {
  return FromSchema(context, schema.propertyNames)
}
// ------------------------------------------------------------------
// MergeWithSiblings
//
// 2020-12 allows $ref (and, per this same fix, $dynamicRef and
// $recursiveRef) alongside other keywords. Rather than special-case
// that in every handler, rebuild the schema as `{ $ref: <resolved>,
// ...siblings }` (dropping the original ref-like key, which
// `resolvedRef` already supersedes) and feed it back through
// FromSchemaObjectIntern, so the siblings intern like any other
// schema object. Shared by FromRef, FromDynamicRef and
// FromRecursiveRef -- previously only $ref had this counterpart,
// which silently dropped sibling keywords next to $dynamicRef /
// $recursiveRef.
// ------------------------------------------------------------------
function MergeWithSiblings(context: XInternContext, schema: Schema.XSchemaObject, refKey: string, resolvedRef: string): Schema.XSchema {
  const merged = Guard.Keys(schema as Record<PropertyKey, unknown>).reduce((result, key) => {
    return Guard.IsEqual(key, refKey) ? result : (result[key] = (schema as Record<string, unknown>)[key], result)
  }, { $ref: resolvedRef } as Record<PropertyKey, unknown>)
  return FromSchemaObjectIntern(context, merged)
}
// ------------------------------------------------------------------
// FromRef
// ------------------------------------------------------------------
function FromRef(context: XInternContext, schema: Schema.XRef): Schema.XSchema {
  // Resolve target off the current traversal stack, carrying forward any resource crossing
  const result = ResolveRef(context.stack, schema.$ref)
  const reference = PostResolvedRef(context, result.schema, result.stack) as Schema.XRef
  return IsReferential(schema, '$ref') ? reference : MergeWithSiblings(context, schema, '$ref', reference.$ref)
}
// ------------------------------------------------------------------
// FromRecursiveRef
// ------------------------------------------------------------------
function FromRecursiveRef(context: XInternContext, schema: Schema.XRecursiveRef): Schema.XSchema {
  const target = Resolve.RecursiveRef(context.stack, schema) ?? false
  const reference = PostResolvedRef(context, target, { ...context.stack, pendingResource: true }) as Schema.XRef
  return IsReferential(schema, '$recursiveRef') ? reference : MergeWithSiblings(context, schema, '$recursiveRef', reference.$ref)
}
// ------------------------------------------------------------------
// Then
// ------------------------------------------------------------------
function FromThen(context: XInternContext, schema: Schema.XThen): Schema.XSchema {
  return FromSchema(context, schema.then)
}
// ------------------------------------------------------------------
// UnevaluatedItems
// ------------------------------------------------------------------
function FromUnevaluatedItems(context: XInternContext, schema: Schema.XUnevaluatedItems): Schema.XSchema {
  return FromSchema(context, schema.unevaluatedItems)
}
// ------------------------------------------------------------------
// UnevaluatedProperties
// ------------------------------------------------------------------
function FromUnevaluatedProperties(context: XInternContext, schema: Schema.XUnevaluatedProperties): Schema.XSchema {
  return FromSchema(context, schema.unevaluatedProperties)
}
// ------------------------------------------------------------------
// FromSchemaObjectIntern
//
// Interns one schema object's keywords, stores the result in
// `context.registry` under one key, and returns a $ref to it. Every
// path through FromSchemaObject other than a ref shortcut ends up
// here.
// ------------------------------------------------------------------
function FromSchemaObjectIntern(context: XInternContext, schema: Schema.XSchemaObject): Schema.XSchema {
  // Check if the schema has already been resolved
  const existing = context.resolved.get(schema)
  if (!Guard.IsUndefined(existing)) return existing
  // Reserve a placeholder key in case a nested ref cycles back here
  // (see PostResolvedRef). `cyclic` flips true only if one does.
  const reservation = { key: `x-ref-${context.resolving.size}`, cyclic: false }
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
  const properties = { ...schema, ...remapped } as XSchemaRecord
  const refine = properties['~refine']
  for (const key of ['~refine', '$defs', ...ResolutionKeywords]) delete properties[key]
  const interned = structuredClone(properties)
  if (!Guard.IsUndefined(refine)) interned['~refine'] = refine
  // A cyclic schema keeps the placeholder key a descendant already
  // used; everything else is keyed by content hash, so identical
  // schemas dedupe into one $defs entry.
  const key = reservation.cyclic ? reservation.key : HashKey(interned)
  context.registry.set(key, interned)
  // Result
  const result: Schema.XSchema = { $ref: `#/$defs/${key}` }
  context.resolved.set(schema, result)
  return result
}
// ------------------------------------------------------------------
// FromSchemaObject
//
// Dispatches to whichever ref-like keyword the schema uses ($ref,
// $dynamicRef, $recursiveRef), falling through to
// FromSchemaObjectIntern otherwise. A schema can't combine $ref with
// $dynamicRef or $recursiveRef, so checking each is mutually
// exclusive. Each handler decides for itself, via IsReferential,
// whether it's a bare pointer or has real siblings to merge in --
// so all three ref-like keywords get the same sibling-preserving
// treatment, not just $ref.
// ------------------------------------------------------------------
function FromSchemaObject(context: XInternContext, schema: Schema.XSchemaObject): Schema.XSchema {
  return (
    Schema.IsRef(schema) ? FromRef(context, schema) :
    Schema.IsDynamicRef(schema) ? FromDynamicRef(context, schema) :
    Schema.IsRecursiveRef(schema) ? FromRecursiveRef(context, schema) :
    FromSchemaObjectIntern(context, schema)
  )
}
// ------------------------------------------------------------------
// SchemaBoolean
// ------------------------------------------------------------------
function FromSchemaBoolean(context: XInternContext, schema: Schema.XSchemaBoolean): Schema.XSchema {
  // Finalize and register the result
  const key = HashKey(schema)
  context.registry.set(key, schema)
  // Result
  const result: Schema.XSchema = { $ref: `#/$defs/${key}` }
  context.resolved.set(schema, result)
  return result
}
// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
function FromSchema(context: XInternContext, schema: Schema.XSchema): Schema.XSchema {
  const next = { ...context, stack: Stack.NextStack(context.stack, schema) }
  return Schema.IsSchemaBoolean(schema) ? FromSchemaBoolean(next, schema) : FromSchemaObject(next, schema)
}
// -----------------------------------------------------------------------------------------------------------------
// Intern Dispatch
// -----------------------------------------------------------------------------------------------------------------
//
// Intern(...)
// -> InternBoolean                 (schema is a boolean)
// -> InternSchemaObject            (schema is a schema object)
//    -> IsDynamicResource? yes     -> InternDynamicResource (hashed whole, never recursed)
//    -> IsDynamicResource? no      -> FromSchema (the same recursive loop every nested subschema goes through --
//                                     ref-following, ref+siblings merging, and everything else happen HERE,
//                                     uniformly, not as a separate root-level step)
//
// -----------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------
// InternBoolean
//
// Returns the interned entry for a boolean schema at the root
// (FromSchemaBoolean handles booleans found elsewhere in the tree).
// Boolean roots need no context: nothing to recurse into, nothing to
// dedupe. The only Intern path with no context argument.
// ------------------------------------------------------------------
function InternBoolean(schema: Schema.XSchemaBoolean): unknown {
  const key = HashKey(schema)
  return { $ref: `#/$defs/${key}`, $defs: { [key]: schema } }
}
// ------------------------------------------------------------------
// InternDynamicResource
//
// $dynamicRef and $recursiveRef resolve against the lexical stack of
// scopes at validation time, not against schema content. Decomposing
// such a schema into content-hashed $defs (the normal FromSchema
// behaviour) could change which scope a dynamic ref resolves to. So
// this path treats the whole schema as one opaque resource: hash it,
// store it as a single $defs entry, and fold remotes into its own
// $defs so the dynamic ref still has what it needs wherever the
// resource ends up.
// ------------------------------------------------------------------
function HasDynamicResource(stack: Stack.XStack, schema: unknown): boolean {
  if (Guard.IsArray(schema)) return schema.some((inner) => HasDynamicResource(stack, inner))
  if (!Schema.IsSchemaObject(schema)) return false
  if (Schema.IsDynamicRef(schema)) {
    const target = Resolve.DynamicRef(stack, schema)
    if (Schema.IsSchemaObject(target) && Schema.IsDynamicAnchor(target)) return true
  }
  if (Schema.IsRecursiveRef(schema)) {
    const target = Resolve.RecursiveRef(stack, schema)
    if (Schema.IsSchemaObject(target) && Schema.IsRecursiveAnchorTrue(target)) return true
  }
  const nextStack = Stack.NextStack(stack, schema)
  return Guard.Keys(schema as never).some((key) => HasDynamicResource(nextStack, schema[key as never]))
}
function IsDynamicResource(context: XInternContext, schema: Schema.XSchemaObject): boolean {
  return Guard.Keys(context.remotes).length > 0 && HasDynamicResource(context.stack, schema)
}
function InternDynamicResource(context: XInternContext, schema: Schema.XSchemaObject): unknown {
  const defs = Schema.IsDefs(schema) ? schema.$defs : {}
  const resource = { ...schema, $defs: { ...context.remotes, ...defs } }
  const key = HashKey(resource)
  context.registry.set(key, resource)
  return { $ref: `#/$defs/${key}`, $defs: Object.fromEntries(context.registry) } as never
}
// ------------------------------------------------------------------
// InternSchemaObject
//
// Root entry point for a non-boolean schema. Exactly one condition
// decides whether the schema can go through the normal recursive
// loop at all: IsDynamicResource. If it crosses a dynamic/recursive
// resource boundary, it's hashed whole and left unrecursed
// (InternDynamicResource) -- decomposing it could change which
// lexical scope a $dynamicRef/$recursiveRef resolves to. Otherwise
// it goes straight into FromSchema, the same recursive entry point
// used for every nested subschema. FromSchemaObject's own dispatch
// already handles a pure $ref root (FromRef) and $ref-with-siblings
// (FromRefWithDirectSiblings) uniformly at any depth, root included,
// so no separate root-ref-following step is needed here: a pure
// $ref root just forwards to its target's own result (see FromRef /
// PostResolvedRef), and $ref-with-siblings is folded into its own
// correctly-scoped $defs entry (see MergeRefWithSiblings) -- either
// way `result.$ref` already points at the right place.
// ------------------------------------------------------------------
function InternSchemaObject(context: XInternContext, schema: Schema.XSchemaObject): unknown {
  if (IsDynamicResource(context, schema)) return InternDynamicResource(context, schema)
  const result = FromSchema(context, schema) as { $ref: string }
  return { $ref: result.$ref, $defs: Object.fromEntries(context.registry) } as never
}
// ------------------------------------------------------------------
// XIntern
// ------------------------------------------------------------------
export interface XIntern<Type extends unknown = unknown> {
  '~unsafe': Type
  $ref: string
  $defs: Record<string, Schema.XSchemaObject>
}
// --------------------------------------------------------------------
// Intern
// --------------------------------------------------------------------
/** This function restructures the schema such that each distinct sub-schema is stored exactly once in a $defs object and keyed by content hash. */
export function Intern<const Schema extends Schema.XSchema>(schema: Schema): XIntern<XStatic<Schema>>
/** This function restructures the schema such that each distinct sub-schema is stored exactly once in a $defs object and keyed by content hash. */
export function Intern<const Schema extends Schema.XSchema>(remotes: Record<PropertyKey, Schema.XSchema>, schema: Schema): XIntern<XStatic<Schema>>
/** This function restructures the schema such that each distinct sub-schema is stored exactly once in a $defs object and keyed by content hash. */
export function Intern(...args: unknown[]): unknown {
  const [remotes, schema] = Arguments.Match<[Record<PropertyKey, Schema.XSchema>, Schema.XSchema]>(args, {
    2: (remotes, schema) => [remotes, schema],
    1: (schema) => [{}, schema]
  })
  // Boolean roots skip InternContext (see InternBoolean); every other path shares one for the whole call
  if (Schema.IsSchemaBoolean(schema)) return InternBoolean(schema)
  return InternSchemaObject(InternContext(remotes, schema), schema)
}