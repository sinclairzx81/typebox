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
// MatchId
// ------------------------------------------------------------------
function MatchId(value: Schema.XId, base: URL, ref: URL): Schema.XSchema | undefined {
  if(value.$id === ref.hash) return value
  const absoluteId = new URL(value.$id, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  if (Guard.IsEqual(absoluteId.pathname, absoluteRef.pathname)) {
    return ref.hash.startsWith('#') ? MatchHash(value, base, ref) : value
  }
  return undefined
}
// ------------------------------------------------------------------
// MatchAnchor
// ------------------------------------------------------------------
function MatchAnchor(value: Schema.XAnchor, base: URL, ref: URL): Schema.XSchema | undefined {
  const absoluteAnchor = new URL(`#${value.$anchor}`, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  if (Guard.IsEqual(absoluteAnchor.href, absoluteRef.href)) return value
  return undefined
}
// ------------------------------------------------------------------
// MatchHash
// ------------------------------------------------------------------
function MatchHash(value: Schema.XSchemaObject, base: URL, ref: URL): Schema.XSchema | undefined {
  if(ref.href.endsWith('#')) return value
  return ref.hash.startsWith('#')
    ? Pointer.Get(value, decodeURIComponent(ref.hash.slice(1))) as Schema.XSchema | undefined
    : undefined
}
// ------------------------------------------------------------------
// Match
// ------------------------------------------------------------------
function Match(value: Schema.XSchemaObject, base: URL, ref: URL): Schema.XSchema | undefined {
  if (Schema.IsId(value)) {
    const result = MatchId(value, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  if (Schema.IsAnchor(value)) {
    const result = MatchAnchor(value, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  return MatchHash(value, base, ref)
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
function FromArray(value: unknown[], base: URL, ref: URL): Schema.XSchema | undefined {
  return value.reduce<Schema.XSchema | undefined>((result, item) => {
    const match = FromValue(item, base, ref)
    return !Guard.IsUndefined(match) ? match : result
  }, undefined)
}
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
function FromObject(value: Record<PropertyKey, unknown>, base: URL, ref: URL): Schema.XSchema | undefined {
  return Guard.Keys(value).reduce<Schema.XSchema | undefined>((result, key) => {
    const match = FromValue(value[key], base, ref)
    return !Guard.IsUndefined(match) ? match : result
  }, undefined)
}
// ------------------------------------------------------------------
// FromValue
// ------------------------------------------------------------------
function FromValue(value: unknown, base: URL, ref: URL): Schema.XSchema | undefined {
  base = Schema.IsSchemaObject(value) && Schema.IsId(value) ? new URL(value.$id, base.href) : base
  if (Schema.IsSchemaObject(value)) {
    const result = Match(value, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  if (Guard.IsArray(value)) return FromArray(value, base, ref)
  if (Guard.IsObject(value)) return FromObject(value, base, ref)
  return undefined
}
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
export function Ref(root: Schema.XSchemaObject, ref: string): Schema.XSchema | undefined {
  const defaultBase = new URL('', 'http://domain.com')
  const initialBase = Schema.IsId(root) ? new URL(root.$id, defaultBase.href) : defaultBase
  const initialRef = new URL(ref, initialBase.href)
  return FromValue(root, initialBase, initialRef)
}