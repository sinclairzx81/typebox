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

import { Guard } from '../../guard/index.ts'
import { Pointer } from '../pointer/index.ts'
import * as Schema from '../types/index.ts'
import * as Stack from '../engine/_stack.ts'

// ------------------------------------------------------------------
// XRefResult
//
// Return shape for every top level resolution function: the
// resolved schema (or undefined) plus the stack state after
// following the reference, since crossing or deferring a resource
// can change base URI and lexical scope for later steps.
// ------------------------------------------------------------------
export interface XRefResult {
  schema: Schema.XSchema | undefined
  stack: Stack.XStack
}
// ------------------------------------------------------------------
// (Internal) XDeferredResource | XResolvedResource
//
// A deferred resource is a boundary detected but not yet entered,
// typically a draft-4 style in-place base change. A resolved
// resource is one the ref has definitely crossed into, identified
// by $id, so the stack can advance into it right away.
// ------------------------------------------------------------------
interface XDeferredResource {
  target: Schema.XSchemaObject
  root: Schema.XSchemaObject
  base: string
}
interface XResolvedResource {
  resource: Schema.XId
}
// ------------------------------------------------------------------
// Helpers
//
// Utilities to compute schema base URIs, normalize absolute URLs,
// strip URL fragments for canonical hrefs, find target base URIs,
// resolve $ref root schemas, and identify JSON pointers vs anchors.
// ------------------------------------------------------------------
function RelativeBase(schema: unknown, base: URL): URL {
  return Schema.IsSchemaObject(schema) && Schema.IsId(schema) ? Stack.NextUri(schema.$id, base.href) : base
}
function AbsoluteBase(base: string): URL {
  return Stack.NextUri(base, Stack.DefaultUri)
}
function CanonicalHref(url: URL): string {
  return url.href.split('#')[0]
}
function Base(schema: Schema.XSchema, base: string, target: Schema.XSchema): string | undefined {
  return SearchBase(schema, AbsoluteBase(base), target)
}
function RefRoot(stack: Stack.XStack, ref: Schema.XRef): Schema.XSchema {
  return (ref.$ref.startsWith('#') || stack.enteredResource) ? stack.lexicalSchema : stack.schema
}
function IsPointerFragment(fragment: string): boolean {
  return fragment.startsWith('#/')
}
// ------------------------------------------------------------------
// Search
//
// Recursive tree walks that locate things by identity, not URL.
// SearchDynamicAnchor finds a node with a matching $dynamicAnchor.
// SearchBase finds a specific target schema (by reference) and
// returns its base URI, tracking $id rebasing as it descends.
// ------------------------------------------------------------------
function SearchDynamicAnchor(schema: unknown, name: string): Schema.XDynamicAnchor | undefined {
  if (Guard.IsObject(schema) && Schema.IsDynamicAnchor(schema) && Guard.IsEqual(schema.$dynamicAnchor, name)) {
    return schema
  }
  if (Guard.IsObject(schema)) {
    for (const key of Guard.Keys(schema)) {
      const result = SearchDynamicAnchor(schema[key], name)
      if (result) return result
    }
  }
  return undefined
}
function SearchBase(schema: unknown, base: URL, target: Schema.XSchema): string | undefined {
  if (Guard.IsEqual(schema, target)) return base.href
  const nextBase = RelativeBase(schema, base)
  if (Guard.IsArray(schema)) {
    for (const item of schema) {
      const result = SearchBase(item, nextBase, target)
      if (!Guard.IsUndefined(result)) return result
    }
  } else if (Guard.IsObject(schema)) {
    for (const key of Guard.Keys(schema)) {
      const result = SearchBase(schema[key], nextBase, target)
      if (!Guard.IsUndefined(result)) return result
    }
  }
  return undefined
}
// ------------------------------------------------------------------
// Match
//
// Tests whether a schema node is what a reference URL points to.
// MatchSchemaObject checks a single node in order: $id, $anchor,
// $dynamicAnchor, then JSON pointer/hash. MatchFromArray,
// MatchFromObject, and Match recurse through the tree to try every
// node, skipping const and enum since their values are user data,
// not schema.
// ------------------------------------------------------------------
function MatchWithHash(schema: Schema.XSchemaObject, ref: URL): Schema.XSchema | undefined {
  if (ref.href.endsWith('#')) return schema
  if (!ref.hash.startsWith('#')) return undefined
  const fragment = decodeURIComponent(ref.hash.slice(1))
  if (!fragment.startsWith('/')) return undefined
  return Pointer.Get(schema, fragment) as Schema.XSchema | undefined
}
function MatchWithId(schema: Schema.XSchemaObject, base: URL, ref: URL): Schema.XSchema | undefined {
  if (!Schema.IsId(schema)) return undefined
  if (Guard.IsEqual(schema.$id, ref.hash)) return schema
  const absoluteRef = new URL(ref.href, base.href)
  if (Guard.IsEqual(base.pathname, absoluteRef.pathname)) return ref.hash.startsWith('#') ? MatchWithHash(schema, ref) : schema
  return undefined
}
function MatchWithAnchor(schema: Schema.XSchemaObject, base: URL, ref: URL): Schema.XSchema | undefined {
  if (!Schema.IsAnchor(schema)) return undefined
  const absoluteAnchor = new URL(`#${schema.$anchor}`, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  return Guard.IsEqual(absoluteAnchor.href, absoluteRef.href) ? schema : undefined
}
function MatchWithDynamicAnchor(schema: Schema.XSchemaObject, base: URL, ref: URL): Schema.XSchema | undefined {
  if (!Schema.IsDynamicAnchor(schema)) return undefined
  const absoluteAnchor = new URL(`#${schema.$dynamicAnchor}`, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  const isMatch = Guard.IsEqual(absoluteAnchor.href, absoluteRef.href)
  return isMatch ? schema : undefined
}
function MatchSchemaObject(schema: unknown, base: URL, ref: URL): Schema.XSchema | undefined {
  if (!Schema.IsSchemaObject(schema)) return undefined
  return MatchWithId(schema, base, ref) ??
    MatchWithAnchor(schema, base, ref) ??
    MatchWithDynamicAnchor(schema, base, ref) ??
    MatchWithHash(schema, ref)
}
function MatchFromArray(schema: unknown, base: URL, ref: URL): Schema.XSchema | undefined {
  if (!Guard.IsArray(schema)) return undefined
  return schema.reduce<Schema.XSchema | undefined>((result, item) => {
    const match = Match(item, base, ref)
    return !Guard.IsUndefined(match) ? match : result
  }, undefined)
}
function MatchFromObject(schema: unknown, base: URL, ref: URL): Schema.XSchema | undefined {
  if (!Guard.IsObject(schema)) return undefined
  return Guard.Keys(schema).reduce<Schema.XSchema | undefined>((result, key) => {
    if (Guard.IsEqual(key, 'const') || Guard.IsEqual(key, 'enum')) return result
    const match = Match(schema[key], base, ref)
    return !Guard.IsUndefined(match) ? match : result
  }, undefined)
}
function Match(schema: unknown, base: URL, ref: URL): Schema.XSchema | undefined {
  const relativeBase = RelativeBase(schema, base)
  return MatchSchemaObject(schema, relativeBase, ref) ??
    MatchFromArray(schema, relativeBase, ref) ??
    MatchFromObject(schema, relativeBase, ref)
}
// ------------------------------------------------------------------
// Resource
//
// Wraps RefInternal to check whether the resolved schema is itself
// a resource root (carries its own $id). Used by FindResolvedResource
// to tell a boundary hit from a landing inside a resource.
// ------------------------------------------------------------------
function Resource(context: Record<string, Schema.XSchema>, schema: Schema.XSchemaObject, base: string, ref: string): Schema.XId | undefined {
  const result = RefInternal(context, schema, base, ref)
  return Schema.IsSchemaObject(result) && Schema.IsId(result) ? result : undefined
}
// ------------------------------------------------------------------
// FindDeferredResource
//
// Legacy Draft-4 schemas (no $schema keyword) treat a nested $id as
// an in-place base change, not a new resource. A local ('#...') ref
// landing at a different base than the current one needs a stack
// entry so later lookups use the right base.
// ------------------------------------------------------------------
function FindDeferredResourceLegacy(stack: Stack.XStack, ref: Schema.XRef, schema: Schema.XSchemaObject): XDeferredResource | undefined {
  if (!ref.$ref.startsWith('#')) return undefined
  if (!Schema.IsSchemaObject(stack.schema) || Guard.HasPropertyKey(stack.schema, '$schema')) return undefined
  const targetBase = Base(stack.lexicalSchema, stack.referenceBase, schema)
  if (Guard.IsUndefined(targetBase) || Guard.IsEqual(targetBase, stack.referenceBase)) return undefined
  return { target: schema, base: targetBase, root: /* safe-object-root */ stack.lexicalSchema as Schema.XSchemaObject }
}
function FindDeferredResourceModern(stack: Stack.XStack, canonical: string, schema: Schema.XSchemaObject): XDeferredResource | undefined {
  const remoteRoot = stack.context[canonical]
  if (!Schema.IsSchemaObject(remoteRoot)) return undefined
  return { target: schema, base: canonical, root: remoteRoot }
}
function FindDeferredResource(stack: Stack.XStack, ref: Schema.XRef, schema: Schema.XSchemaObject, canonical: string, isRemote: boolean): XDeferredResource | undefined {
  const remote = isRemote ? FindDeferredResourceModern(stack, canonical, schema) : undefined
  return Guard.IsUndefined(remote) ? FindDeferredResourceLegacy(stack, ref, schema) : remote
}
// ------------------------------------------------------------------
// FindResolvedResource
//
// Handles a ref that crossed into a different resource but landed
// on a schema without that resource's $id (e.g. a pointer into the
// middle of a remote document). Enters the enclosing resource so
// lexical/base lookups behave as if traversal walked in from its top.
// ------------------------------------------------------------------
function FindResolvedResource(stack: Stack.XStack, canonical: string, schema: Schema.XSchemaObject): XResolvedResource | undefined {
  if (Schema.IsId(schema)) return undefined
  const resource = Resource(stack.context, /* safe-object-root */ stack.schema as Schema.XSchemaObject, stack.referenceBase, canonical)
  if (!resource || stack.ids.includes(resource)) return undefined
  return { resource }
}
// ------------------------------------------------------------------
// RefInternal
//
// Shared lookup used by Ref, RecursiveRef, and DynamicRef. Tries,
// in order: exact match in the pre-registered context, then a local
// search within the given schema, then a search in a remote
// document. Returns just the schema; caller-specific bookkeeping
// (deferred/resolved resources) happens one level up.
// ------------------------------------------------------------------
function RefInternalWithContext(context: Record<string, Schema.XSchema>, ref: string): Schema.XSchema | undefined {
  return Guard.HasPropertyKey(context, ref) ? context[ref] : undefined
}
function RefInternalWithLocal(schema: Schema.XSchema, base: URL, ref: URL): Schema.XSchema | undefined {
  return Match(schema, base, ref)
}
function RefInternalWithRemote(context: Record<string, Schema.XSchema>, base: URL, ref: URL): Schema.XSchema | undefined {
  const canonicalHref = CanonicalHref(ref)
  if (!Guard.HasPropertyKey(context, canonicalHref) || Guard.IsEqual(canonicalHref, CanonicalHref(base))) return undefined
  const remoteSchema = context[canonicalHref]
  const remoteBase = RelativeBase(remoteSchema, new URL(canonicalHref))
  return Guard.IsEqual(ref.hash, '') ? remoteSchema : Match(remoteSchema, remoteBase, ref)
}
function RefInternal(context: Record<string, Schema.XSchema>, schema: Schema.XSchema, base: string, ref: string): Schema.XSchema | undefined {
  const absoluteBase = AbsoluteBase(base)
  const target = Stack.NextUri(ref, absoluteBase.href)
  return RefInternalWithContext(context, ref) ??
    RefInternalWithLocal(schema, absoluteBase, target) ??
    RefInternalWithRemote(context, absoluteBase, target)
}
// ------------------------------------------------------------------
// RefNextStack
//
// Computes the next stack state from any deferred or resolved
// resource found while following a $ref, carrying existing stack
// state forward rather than rebuilding it.
// ------------------------------------------------------------------
function RefNextStackDeferred(stack: Stack.XStack, deferredResource?: XDeferredResource): Stack.XStack {
  if (!deferredResource) return stack
  const resourceEntries = new Map(stack.resourceEntries)
  resourceEntries.set(deferredResource.target, { base: deferredResource.base, root: deferredResource.root })
  return { ...stack, resourceEntries }
}
function RefNextStackResolved(stack: Stack.XStack, resolvedResource?: XResolvedResource): Stack.XStack {
  return resolvedResource ? Stack.NextStack(stack, resolvedResource.resource) : stack
}
function RefNextStack(stack: Stack.XStack, pendingResource: boolean, deferredResource?: XDeferredResource, resolvedResource?: XResolvedResource): Stack.XStack {
  const withDeferred = RefNextStackDeferred({ ...stack, pendingResource }, deferredResource)
  const withResolved = RefNextStackResolved(withDeferred, resolvedResource)
  return withResolved
}
// ------------------------------------------------------------------
// RefResult
//
// Builds the final XRefResult. RefResultFound gets the canonical
// URL, checks if it's remote from the current resource, and looks
// for a deferred or resolved resource crossing accordingly.
// RefResultNotFound just advances pendingResource if a schema was
// found without crossing into a resource.
// ------------------------------------------------------------------
function RefResultFound(stack: Stack.XStack, ref: Schema.XRef, schema: Schema.XSchemaObject): XRefResult {
  const canonical = CanonicalHref(Stack.NextUri(ref.$ref, stack.referenceBase))
  const isRemote = !Guard.IsEqual(canonical, stack.resourceBase)
  const deferredResource = FindDeferredResource(stack, ref, schema, canonical, isRemote)
  const resolvedResource = isRemote ? FindResolvedResource(stack, canonical, schema) : undefined
  return { schema, stack: RefNextStack(stack, true, deferredResource, resolvedResource) }
}
function RefResultNotFound(stack: Stack.XStack, schema: Schema.XSchema | undefined): XRefResult {
  return { schema, stack: RefNextStack(stack, !Guard.IsUndefined(schema)) }
}
// ------------------------------------------------------------------
// Ref
//
// Picks the root to resolve against, and returns a XRefResult
// containing the resolved schema and the next stack state for
// subsequent evaluation.
// ------------------------------------------------------------------
export function Ref(stack: Stack.XStack, ref: Schema.XRef): XRefResult {
  const schema = RefInternal(stack.context, RefRoot(stack, ref), stack.referenceBase, ref.$ref)
  return Schema.IsSchemaObject(schema) ? RefResultFound(stack, ref, schema) : RefResultNotFound(stack, schema)
}
// ------------------------------------------------------------------
// RecursiveRef: Draft 2019-09
//
// If a $recursiveAnchor is active in scope, it's used as the root
// instead of the lexical schema, letting the ref bind to the
// outermost applicable schema rather than the innermost.
// ------------------------------------------------------------------
function IsRecursiveAnchorInScope(stack: Stack.XStack): boolean {
  return Schema.IsSchemaObject(stack.lexicalSchema) && Schema.IsRecursiveAnchorTrue(stack.lexicalSchema)
}
export function RecursiveRef(stack: Stack.XStack, recursiveRef: Schema.XRecursiveRef): Schema.XSchema | undefined {
  const schema = IsRecursiveAnchorInScope(stack) ? stack.recursiveAnchor : stack.lexicalSchema
  return RefInternal(stack.context, schema as never, stack.lexicalBase, recursiveRef.$recursiveRef)
}
// ------------------------------------------------------------------
// DynamicRef: Draft 2020-12
//
// FindScopedDynamicAnchor checks anchors tracked on the stack first,
// then falls back to a full tree search. If RefInternal finds a target
// directly, DynamicRefWhenFound only continues the scoped search when
// that target itself has a $dynamicAnchor. If RefInternal finds nothing,
// DynamicRefWhenNotFound goes straight to a scoped anchor search
// by name.
// ------------------------------------------------------------------
function DynamicRefFragment(stack: Stack.XStack, dynamicRef: Schema.XDynamicRef): string {
  return Stack.NextUri(dynamicRef.$dynamicRef, AbsoluteBase(stack.lexicalBase).href).hash
}
function FindScopedDynamicAnchor(stack: Stack.XStack, name: string): Schema.XDynamicAnchor | undefined {
  return stack.dynamicAnchors.find((anchor) => Guard.IsEqual(anchor.$dynamicAnchor, name)) ?? SearchDynamicAnchor(stack.schema, name)
}
function DynamicRefWhenFound(stack: Stack.XStack, dynamicRef: Schema.XDynamicRef, fragmentTarget: Schema.XSchema): Schema.XSchema | undefined {
  if (!Schema.IsSchemaObject(fragmentTarget) || !Schema.IsDynamicAnchor(fragmentTarget)) return fragmentTarget
  const fragment = DynamicRefFragment(stack, dynamicRef)
  return IsPointerFragment(fragment) ? fragmentTarget : FindScopedDynamicAnchor(stack, fragmentTarget.$dynamicAnchor)
}
function DynamicRefWhenNotFound(stack: Stack.XStack, dynamicRef: Schema.XDynamicRef): Schema.XSchema | undefined {
  const fragment = DynamicRefFragment(stack, dynamicRef)
  // (review): We never observe this condition, but should be able to reach here in coverage.
  // if (IsPointerFragment(fragment) || !fragment.startsWith('#')) return undefined
  return FindScopedDynamicAnchor(stack, decodeURIComponent(fragment.slice(1)))
}
export function DynamicRef(stack: Stack.XStack, dynamicRef: Schema.XDynamicRef): Schema.XSchema | undefined {
  const fragmentRoot = dynamicRef.$dynamicRef.startsWith('#') ? stack.lexicalSchema : stack.schema
  const fragmentTarget = RefInternal(stack.context, fragmentRoot, stack.lexicalBase, dynamicRef.$dynamicRef)
  return Guard.IsUndefined(fragmentTarget) ? DynamicRefWhenNotFound(stack, dynamicRef) : DynamicRefWhenFound(stack, dynamicRef, fragmentTarget)
}
