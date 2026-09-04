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

import { Guard } from '../../guard/index.ts'
import { Pointer } from '../pointer/index.ts'
import * as Schema from '../types/index.ts'

export const DefaultBase = 'https://json-schema.org'

// ------------------------------------------------------------------
// StackFrame
//
// A read-only snapshot of everything Stack has accumulated during
// traversal that resolution needs in order to make a decision. This
// is the sole channel through which Stack state reaches this module:
// nothing below ever mutates it or reaches back into Stack.
// ------------------------------------------------------------------
export interface StackFrame {
  context: Record<string, Schema.XSchema>
  root: Schema.XSchemaObject
  lexicalSchema: Schema.XSchemaObject
  lexicalBase: string
  referenceBase: string
  resourceBase: string
  ids: Schema.XId[]
  recursiveAnchors: Schema.XRecursiveAnchor[]
  dynamicAnchors: Schema.XDynamicAnchor[]
  inRetrievedFrame: boolean
}
// ------------------------------------------------------------------
// RefResult
//
// The outcome of resolving a $ref. `schema` is the resolved target.
// `retrievedResource` and `resolvedResource` are *instructions*: they
// tell the caller (Stack) what bookkeeping, if any, it should apply
// to its own state as a result of this resolution. This module never
// applies them itself.
// ------------------------------------------------------------------
export interface RetrievedResource {
  target: Schema.XSchemaObject
  base: string
  root: Schema.XSchemaObject
}
export interface ResolvedResource {
  target: Schema.XSchemaObject
  resource: Schema.XId
}
export interface RefResult {
  schema: Schema.XSchema | undefined
  retrievedResource?: RetrievedResource
  resolvedResource?: ResolvedResource
}
// ------------------------------------------------------------------
// Find: FindDynamicAnchor
// ------------------------------------------------------------------
function FindDynamicAnchor(schema: unknown, name: string): Schema.XDynamicAnchor | undefined {
  if (Guard.IsObject(schema) && Schema.IsDynamicAnchor(schema) && Guard.IsEqual(schema.$dynamicAnchor, name)) {
    return schema
  }
  if (Guard.IsObject(schema)) {
    for (const key of Guard.Keys(schema)) {
      const result = FindDynamicAnchor(schema[key], name)
      if (result) return result
    }
  }
  // (no-coverage) - is it even possible to search for an anchor
  // with embedded logical schema like allOf, anyOf, etc?
  // if (Guard.IsArray(schema)) { // (no-coverage)
  //   for (const item of schema) {
  //     const result = FindDynamicAnchor(item, name)
  //     if (result) return result
  //   }
  // }
  return undefined
}
// ------------------------------------------------------------------
// Find: FindBase
// ------------------------------------------------------------------
function FindBase(schema: unknown, base: URL, target: Schema.XSchema): string | undefined {
  if (Guard.IsEqual(schema, target)) return base.href
  const nextBase = Schema.IsSchemaObject(schema) && Schema.IsId(schema) ? new URL(schema.$id, base.href) : base
  if (Guard.IsArray(schema)) {
    for (const item of schema) {
      const result = FindBase(item, nextBase, target)
      if (!Guard.IsUndefined(result)) return result
    }
  } else if (Guard.IsObject(schema)) {
    for (const key of Guard.Keys(schema)) {
      const result = FindBase(schema[key], nextBase, target)
      if (!Guard.IsUndefined(result)) return result
    }
  }
  return undefined
}
// ------------------------------------------------------------------
// Match: MatchId
// ------------------------------------------------------------------
function MatchId(schema: Schema.XId, base: URL, ref: URL): Schema.XSchema | undefined {
  // ref is a bare fragment naming this schema's $id directly
  if (Guard.IsEqual(schema.$id, ref.hash)) return schema
  const absoluteRef = new URL(ref.href, base.href)
  // ref shares this $id's document, so resolve the fragment within it
  if (Guard.IsEqual(base.pathname, absoluteRef.pathname)) return ref.hash.startsWith('#') ? MatchHash(schema, ref) : schema
  return undefined
}
// ------------------------------------------------------------------
// Match: MatchAnchor
// ------------------------------------------------------------------
function MatchAnchor(schema: Schema.XAnchor, base: URL, ref: URL): Schema.XSchema | undefined {
  const absoluteAnchor = new URL(`#${schema.$anchor}`, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  return Guard.IsEqual(absoluteAnchor.href, absoluteRef.href) ? schema : undefined
}
// ------------------------------------------------------------------
// Match: MatchDynamicAnchor
// ------------------------------------------------------------------
function MatchDynamicAnchor(schema: Schema.XDynamicAnchor, base: URL, ref: URL): Schema.XSchema | undefined {
  const absoluteAnchor = new URL(`#${schema.$dynamicAnchor}`, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  const isMatch = Guard.IsEqual(absoluteAnchor.href, absoluteRef.href)
  return isMatch ? schema : undefined
}
// ------------------------------------------------------------------
// Match: MatchHash
// ------------------------------------------------------------------
function MatchHash(schema: Schema.XSchemaObject, ref: URL): Schema.XSchema | undefined {
  if (ref.href.endsWith('#')) return schema
  if (!ref.hash.startsWith('#')) return undefined
  const fragment = decodeURIComponent(ref.hash.slice(1))
  if (!fragment.startsWith('/')) return undefined
  const result = Pointer.Get(schema, fragment) as Schema.XSchema | undefined
  return result
}
// ------------------------------------------------------------------
// Match: Match
// ------------------------------------------------------------------
function Match(schema: Schema.XSchemaObject, base: URL, ref: URL): Schema.XSchema | undefined {
  if (Schema.IsId(schema)) {
    const result = MatchId(schema, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  if (Schema.IsAnchor(schema)) {
    const result = MatchAnchor(schema, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  if (Schema.IsDynamicAnchor(schema)) {
    const result = MatchDynamicAnchor(schema, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  return MatchHash(schema, ref)
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
function FromArray(schema: unknown[], base: URL, ref: URL): Schema.XSchema | undefined {
  return schema.reduce<Schema.XSchema | undefined>((result, item) => {
    const match = FromValue(item, base, ref)
    return !Guard.IsUndefined(match) ? match : result
  }, undefined)
}
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
function SkipProperty(key: PropertyKey): boolean {
  return Guard.IsEqual(key, 'const') || Guard.IsEqual(key, 'enum')
}
function FromObject(schema: Record<PropertyKey, unknown>, base: URL, ref: URL): Schema.XSchema | undefined {
  return Guard.Keys(schema).reduce<Schema.XSchema | undefined>((result, key) => {
    if (SkipProperty(key)) return result
    const match = FromValue(schema[key], base, ref)
    return !Guard.IsUndefined(match) ? match : result
  }, undefined)
}
// ------------------------------------------------------------------
// FromValue
// ------------------------------------------------------------------
function FromValue(schema: unknown, base: URL, ref: URL): Schema.XSchema | undefined {
  const nextBase = Schema.IsSchemaObject(schema) && Schema.IsId(schema) ? new URL(schema.$id, base.href) : base
  if (Schema.IsSchemaObject(schema)) {
    const result = Match(schema, nextBase, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  if (Guard.IsArray(schema)) return FromArray(schema, nextBase, ref)
  if (Guard.IsObject(schema)) return FromObject(schema, nextBase, ref)
  return undefined
}
// ------------------------------------------------------------------
// Base
// ------------------------------------------------------------------
export function Base(schema: Schema.XSchemaObject, base: string, target: Schema.XSchema): string | undefined {
  return FindBase(schema, new URL(base || '.', DefaultBase), target)
}
// ------------------------------------------------------------------
// Resource
// ------------------------------------------------------------------
export function Resource(context: Record<string, Schema.XSchema>, schema: Schema.XSchemaObject, base: string, ref: string): Schema.XId | undefined {
  const result = Ref(context, schema, base, ref, false)
  return Schema.IsSchemaObject(result) && Schema.IsId(result) ? result : undefined
}
// ------------------------------------------------------------------
// CanonicalHref
// ------------------------------------------------------------------
function CanonicalHref(url: URL): string {
  return url.href.split('#')[0]
}
// ------------------------------------------------------------------
// Ref: RefRemote (Phase 1)
// ------------------------------------------------------------------
function RefContext(context: Record<string, Schema.XSchema>, ref: string): Schema.XSchema | undefined {
  return Guard.HasPropertyKey(context, ref) ? context[ref] : undefined
}
// ------------------------------------------------------------------
// Ref: RefRemote (Phase 2)
// ------------------------------------------------------------------
function RefLocal(schema: Schema.XSchemaObject, base: URL, ref: URL): Schema.XSchema | undefined {
  return FromValue(schema, base, ref)
}
// ------------------------------------------------------------------
// Ref: RefRemote (Phase 3)
// ------------------------------------------------------------------
function RefRemote(context: Record<string, Schema.XSchema>, base: URL, ref: URL): Schema.XSchema | undefined {
  const canonicalHref = CanonicalHref(ref)
  if (Guard.IsEqual(canonicalHref, CanonicalHref(base))) return undefined
  if (!Guard.HasPropertyKey(context, canonicalHref)) return undefined
  const remoteSchema = context[canonicalHref]
  const remoteBase = (Schema.IsSchemaObject(remoteSchema) && Schema.IsId(remoteSchema)) ? new URL(remoteSchema.$id, canonicalHref) : new URL(canonicalHref)
  const result = Guard.IsEqual(ref.hash, '') ? remoteSchema : FromValue(remoteSchema, remoteBase, ref)
  return result
}
// ------------------------------------------------------------------
// RetrievedResource: LegacyRetrievedResource
//
// Draft-4 style schemas (no $schema keyword) treat a nested $id as an
// in-place base URI change rather than a new resource boundary. A
// local ('#...') ref that lands somewhere with a different base than
// the current reference base needs a frame so later anchor/pointer
// resolution is computed against the right base.
// ------------------------------------------------------------------
function LegacyRetrievedResource(root: Schema.XSchemaObject, lexicalSchema: Schema.XSchemaObject, referenceBase: string, ref: Schema.XRef, schema: Schema.XSchemaObject): RetrievedResource | undefined {
  if (!ref.$ref.startsWith('#')) return undefined
  if (Guard.HasPropertyKey(root, '$schema')) return undefined
  const targetBase = Base(lexicalSchema, referenceBase, schema)
  if (Guard.IsUndefined(targetBase) || Guard.IsEqual(targetBase, referenceBase)) return undefined
  return { target: schema, base: targetBase, root: lexicalSchema }
}
// ------------------------------------------------------------------
// RetrievedResource: RemoteRetrievedResource
//
// The ref's canonical URL names a document already loaded into
// context. That document becomes the frame's root going forward.
// ------------------------------------------------------------------
function RemoteRetrievedResource(context: Record<string, Schema.XSchema>, canonical: string, schema: Schema.XSchemaObject): RetrievedResource | undefined {
  const remoteRoot = context[canonical]
  if (!Schema.IsSchemaObject(remoteRoot)) return undefined
  return { target: schema, base: canonical, root: remoteRoot }
}
// ------------------------------------------------------------------
// RetrievedResource
//
// A genuinely remote document frame always wins over a same-document
// legacy one: only one frame is ever entered per ref.
// ------------------------------------------------------------------
function FindRetrievedResource(stackframe: StackFrame, ref: Schema.XRef, schema: Schema.XSchemaObject, canonical: string, isRemote: boolean): RetrievedResource | undefined {
  const remote = isRemote ? RemoteRetrievedResource(stackframe.context, canonical, schema) : undefined
  if (!Guard.IsUndefined(remote)) return remote
  return LegacyRetrievedResource(stackframe.root, stackframe.lexicalSchema, stackframe.referenceBase, ref, schema)
}
// ------------------------------------------------------------------
// ResolvedResource: FindResolvedResource
//
// The ref crossed into a different resource but landed on a schema
// that doesn't itself carry that resource's $id (e.g. a pointer into
// the middle of a remote document). The enclosing resource still
// needs to be entered so lexical/base lookups behave as if traversal
// had walked in from its top.
// ------------------------------------------------------------------
function FindResolvedResource(context: Record<string, Schema.XSchema>, root: Schema.XSchemaObject, referenceBase: string, canonical: string, schema: Schema.XSchemaObject, ids: Schema.XId[]): ResolvedResource | undefined {
  if (Schema.IsId(schema)) return undefined
  const resource = Resource(context, root, referenceBase, canonical)
  if (!resource || ids.includes(resource)) return undefined
  return { target: schema, resource }
}
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
export function Ref(remotes: Record<string, Schema.XSchema>, schema: Schema.XSchemaObject, base: string, ref: string, applySchemaId: boolean = true): Schema.XSchema | undefined {
  const initialBase = new URL(base || '.', DefaultBase)
  const resolvedBase = applySchemaId && Schema.IsId(schema) ? new URL(schema.$id, initialBase) : initialBase
  const initialRef = new URL(ref, resolvedBase.href)
  return RefContext(remotes, ref) ?? RefLocal(schema, resolvedBase, initialRef) ?? RefRemote(remotes, resolvedBase, initialRef)
}
// ------------------------------------------------------------------
// DynamicRef
// ------------------------------------------------------------------
export function DynamicRef(context: Record<string, Schema.XSchema>, root: Schema.XSchemaObject, base: string, schema: Schema.XSchemaObject, dynamicRef: Schema.XDynamicRef, dynamicAnchors: Schema.XDynamicAnchor[]): Schema.XSchema | undefined {
  const initialBase = new URL(base || '.', DefaultBase)
  const fragmentRoot = dynamicRef.$dynamicRef.startsWith('#') ? schema : root
  const fragmentTarget = Ref(context, fragmentRoot, base, dynamicRef.$dynamicRef, false)
  if (Guard.IsUndefined(fragmentTarget)) {
    const fragment = new URL(dynamicRef.$dynamicRef, initialBase).hash
    if (!fragment.startsWith('#/') && fragment.startsWith('#')) {
      const name = decodeURIComponent(fragment.slice(1))
      const anchorTarget = dynamicAnchors.find((anchor) => Guard.IsEqual(anchor.$dynamicAnchor, name)) ?? FindDynamicAnchor(root, name)
      return anchorTarget
    }
    return undefined
  }
  if (!Schema.IsSchemaObject(fragmentTarget) || !Schema.IsDynamicAnchor(fragmentTarget)) return fragmentTarget
  const fragment = new URL(dynamicRef.$dynamicRef, initialBase).hash
  if (fragment.startsWith('#/')) return fragmentTarget
  const anchorTarget = dynamicAnchors.find((anchor) => Guard.IsEqual(anchor.$dynamicAnchor, fragmentTarget.$dynamicAnchor))
  return anchorTarget ?? fragmentTarget
}
// ------------------------------------------------------------------
// ResolveRef
//
// Resolves the schema a $ref points to, and describes whether that
// crossing implies a "retrieved resource" frame or entering a
// resource the target doesn't itself carry the $id for. The caller
// decides whether and how to record these.
// ------------------------------------------------------------------
export function ResolveRef(stackframe: StackFrame, ref: Schema.XRef): RefResult {
  const source = stackframe.inRetrievedFrame ? stackframe.lexicalSchema : stackframe.root
  const refRoot = ref.$ref.startsWith('#') ? stackframe.lexicalSchema : source
  const schema = Ref(stackframe.context, refRoot, stackframe.referenceBase, ref.$ref, false)
  if (!schema || !Schema.IsSchemaObject(schema)) return { schema }
  const canonical = new URL(ref.$ref, stackframe.referenceBase).href.split('#')[0]
  const isRemote = !Guard.IsEqual(canonical, stackframe.resourceBase)
  const retrievedResource = FindRetrievedResource(stackframe, ref, schema, canonical, isRemote)
  const resolvedResource = isRemote ? FindResolvedResource(stackframe.context, stackframe.root, stackframe.referenceBase, canonical, schema, stackframe.ids) : undefined
  return { schema, retrievedResource, resolvedResource }
}
// ------------------------------------------------------------------
// ResolveRecursiveRef
// ------------------------------------------------------------------
export function ResolveRecursiveRef(stackframe: StackFrame, recursiveRef: Schema.XRecursiveRef): Schema.XSchema | undefined {
  const refRoot = Schema.IsRecursiveAnchorTrue(stackframe.lexicalSchema) ? stackframe.recursiveAnchors[0] : stackframe.lexicalSchema
  return Ref(stackframe.context, refRoot, stackframe.lexicalBase, recursiveRef.$recursiveRef, false)
}
// ------------------------------------------------------------------
// ResolveDynamicRef
// ------------------------------------------------------------------
export function ResolveDynamicRef(stackframe: StackFrame, dynamicRef: Schema.XDynamicRef): Schema.XSchema | undefined {
  return DynamicRef(stackframe.context, stackframe.root, stackframe.lexicalBase, stackframe.lexicalSchema, dynamicRef, stackframe.dynamicAnchors)
}
