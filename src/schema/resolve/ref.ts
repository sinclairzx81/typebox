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

// ------------------------------------------------------------------
// Match: Id
// ------------------------------------------------------------------
function MatchId(schema: Schema.XId, base: URL, ref: URL): Schema.XSchema | undefined {
  if (schema.$id === ref.hash) return schema
  const absoluteId = new URL(schema.$id, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  if (Guard.IsEqual(absoluteId.pathname, absoluteRef.pathname)) {
    return ref.hash.startsWith('#') ? MatchHash(schema, base, ref) : schema
  }
  return undefined
}
// ------------------------------------------------------------------
// Match: Anchor
// ------------------------------------------------------------------
function MatchAnchor(schema: Schema.XAnchor, base: URL, ref: URL): Schema.XSchema | undefined {
  const absoluteAnchor = new URL(`#${schema.$anchor}`, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  return Guard.IsEqual(absoluteAnchor.href, absoluteRef.href) ? schema : undefined
}
// ------------------------------------------------------------------
// Match: DynamicAnchor
// ------------------------------------------------------------------
function MatchDynamicAnchor(schema: Schema.XDynamicAnchor, base: URL, ref: URL): Schema.XSchema | undefined {
  const absoluteAnchor = new URL(`#${schema.$dynamicAnchor}`, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  return Guard.IsEqual(absoluteAnchor.href, absoluteRef.href) ? schema : undefined
}
// ------------------------------------------------------------------
// Match: Hash
//
// Resolves JSON Pointer fragments only. Plain anchor-style fragments
// (no leading '/') are handled exclusively by MatchAnchor and
// MatchDynamicAnchor to prevent accidentally resolving an anchor name
// as a pointer into the schema tree.
//
// ------------------------------------------------------------------
function MatchHash(schema: Schema.XSchemaObject, _base: URL, ref: URL): Schema.XSchema | undefined {
  if (ref.href.endsWith('#')) return schema
  if (!ref.hash.startsWith('#')) return undefined
  const fragment = decodeURIComponent(ref.hash.slice(1))
  if (!fragment.startsWith('/')) return undefined
  return Pointer.Get(schema, fragment) as Schema.XSchema | undefined
}
// ------------------------------------------------------------------
// Match
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
  return MatchHash(schema, base, ref)
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
function FromObject(schema: Record<PropertyKey, unknown>, base: URL, ref: URL): Schema.XSchema | undefined {
  return Guard.Keys(schema).reduce<Schema.XSchema | undefined>((result, key) => {
    const match = FromValue(schema[key], base, ref)
    return !Guard.IsUndefined(match) ? match : result
  }, undefined)
}
// ------------------------------------------------------------------
// FromValue
// ------------------------------------------------------------------
function FromValue(schema: unknown, base: URL, ref: URL): Schema.XSchema | undefined {
  const nextBase = Schema.IsSchemaObject(schema) && Schema.IsId(schema)
    ? new URL(schema.$id, base.href)
    : base
  if (Schema.IsSchemaObject(schema)) {
    const result = Match(schema, nextBase, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  if (Guard.IsArray(schema)) return FromArray(schema, nextBase, ref)
  if (Guard.IsObject(schema)) return FromObject(schema, nextBase, ref)
  return undefined
}
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
export function Ref(schema: Schema.XSchemaObject, ref: string): Schema.XSchema | undefined {
  const defaultBase = new URL('http://unknown/')
  const initialBase = Schema.IsId(schema) ? new URL(schema.$id, defaultBase.href) : defaultBase
  const initialRef = new URL(ref, initialBase.href)
  return FromValue(schema, initialBase, initialRef)
}
// ------------------------------------------------------------------
// DynamicRef
// ------------------------------------------------------------------
export function DynamicRef(root: Schema.XSchemaObject, base: Schema.XSchemaObject, dynamicRef: Schema.XDynamicRef, dynamicAnchors: Schema.XDynamicAnchor[]): Schema.XSchema | undefined {
  // Resolve the static target using either the local base (for fragment‑only references)
  // or the document root (for absolute URI references).
  const fragmentTarget = dynamicRef.$dynamicRef.startsWith('#') 
    ? Ref(base, dynamicRef.$dynamicRef) 
    : Ref(root, dynamicRef.$dynamicRef)
  if (Guard.IsUndefined(fragmentTarget)) return undefined

  // Dynamic override only applies if the resolved target itself declares a $dynamicAnchor.
  // If it does not, return the static target unchanged.
  if (!Schema.IsSchemaObject(fragmentTarget) || !Schema.IsDynamicAnchor(fragmentTarget)) return fragmentTarget
  
  // Extract the fragment portion of the reference. According to the test suite,
  // only plain fragment names (e.g., "#foo") trigger the dynamic scope; JSON 
  // Pointer fragments (e.g., "#/definitions/foo") bypass dynamic resolution.
  const fragment = new URL(dynamicRef.$dynamicRef, 'http://unknown/').hash
  if (fragment.startsWith('#/')) return fragmentTarget

  // Search the live dynamic anchor stack for a schema whose $dynamicAnchor matches the
  // target's $dynamicAnchor. The stack reflects the current evaluation path, and
  // find() returns the outermost (first encountered) match, which is the correct
  // lexical scope per the specification.
  const anchorTarget = dynamicAnchors.find(anchor => anchor.$dynamicAnchor === fragmentTarget.$dynamicAnchor)
  return anchorTarget ?? fragmentTarget
}