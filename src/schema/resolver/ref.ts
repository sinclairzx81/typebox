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
import * as S from '../types/index.ts'

// ------------------------------------------------------------------
// MatchId
// ------------------------------------------------------------------
function MatchId(value: S.XId, base: URL, ref: URL): unknown | undefined {
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
function MatchAnchor(value: S.XAnchor, base: URL, ref: URL): unknown | undefined {
  const absoluteAnchor = new URL(`#${value.$anchor}`, base.href)
  const absoluteRef = new URL(ref.href, base.href)
  if (Guard.IsEqual(absoluteAnchor.href, absoluteRef.href)) return value
  return undefined
}
// ------------------------------------------------------------------
// MatchHash
// ------------------------------------------------------------------
function MatchHash(value: S.XSchemaObject, base: URL, ref: URL): unknown | undefined {
  if(ref.href.endsWith('#')) return value
  return ref.hash.startsWith('#')
    ? Pointer.Get(value, decodeURIComponent(ref.hash.slice(1)))
    : undefined
}
// ------------------------------------------------------------------
// Match
// ------------------------------------------------------------------
function Match(value: S.XSchemaObject, base: URL, ref: URL): unknown | undefined {
  if (S.IsId(value)) {
    const result = MatchId(value, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  if (S.IsAnchor(value)) {
    const result = MatchAnchor(value, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  return MatchHash(value, base, ref)
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
function FromArray(value: unknown[], base: URL, ref: URL): unknown {
  for (const item of value) {
    const result = FromValue(item, base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  return undefined
}
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
function FromObject(value: Record<PropertyKey, unknown>, base: URL, ref: URL): unknown {
  for (const key of Guard.Keys(value)) {
    const result = FromValue(value[key], base, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  return undefined
}
// ------------------------------------------------------------------
// FromValue
// ------------------------------------------------------------------
function FromValue(value: unknown, base: URL, ref: URL): unknown {
  const newbase = S.IsSchemaObject(value) && S.IsId(value) ? new URL(value.$id, ref.href) : base
  if (S.IsSchemaObject(value)) {
    const result = Match(value, newbase, ref)
    if (!Guard.IsUndefined(result)) return result
  }
  if (Guard.IsArray(value)) return FromArray(value, newbase, ref)
  if (Guard.IsObject(value)) return FromObject(value, newbase, ref)
  return undefined
}
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
export function Ref(schema: unknown, ref: string): unknown {
  const base = new URL('', 'http://domain.com')
  return FromValue(schema, base, new URL(ref, 'http://domain.com'))
}
