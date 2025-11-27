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

import { Guard } from '../../guard/index.ts'
import { Pointer } from '../pointer/index.ts'
import * as Schema from '../types/index.ts'

// ------------------------------------------------------------------
// Match: Id
// ------------------------------------------------------------------
function MatchId(schema: Schema.XId, base: URL, ref: URL): Schema.XSchema | undefined {
  if(schema.$id === ref.hash) return schema
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
  if (Guard.IsEqual(absoluteAnchor.href, absoluteRef.href)) return schema
  return undefined
}
// ------------------------------------------------------------------
// Match: Hash
// ------------------------------------------------------------------
function MatchHash(schema: Schema.XSchemaObject, base: URL, ref: URL): Schema.XSchema | undefined {
  if(ref.href.endsWith('#')) return schema
  return ref.hash.startsWith('#')
    ? Pointer.Get(schema, decodeURIComponent(ref.hash.slice(1))) as Schema.XSchema | undefined
    : undefined
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
  base = Schema.IsSchemaObject(schema) && Schema.IsId(schema) ? new URL(schema.$id, base.href) : base
  if (Schema.IsSchemaObject(schema)) {
    const result = Match(schema, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  if (Guard.IsArray(schema)) return FromArray(schema, base, ref)
  if (Guard.IsObject(schema)) return FromObject(schema, base, ref)
  return undefined
}
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
export function Ref(schema: Schema.XSchemaObject, ref: string): Schema.XSchema | undefined {
  const defaultBase = new URL('http://unknown')
  const initialBase = Schema.IsId(schema) ? new URL(schema.$id, defaultBase.href) : defaultBase
  const initialRef = new URL(ref, initialBase.href)
  return FromValue(schema, initialBase, initialRef)
}