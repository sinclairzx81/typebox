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
import * as Schema from '../types/index.ts'
import * as Key from './_key.ts'

type XKeys = Record<string, string>
type XDefs = Record<string, Schema.XSchema>

// ------------------------------------------------------------------
// IsPlainObject
// ------------------------------------------------------------------
function IsPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  return Guard.IsObject(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value))
}
// ------------------------------------------------------------------
// Rewrite
// ------------------------------------------------------------------
function RewriteRef(keys: XKeys, ref: string): string {
  if (!Key.IsDefsRef(ref)) return ref
  const key = Key.DefsKey(ref)
  return Guard.HasPropertyKey(keys, key) ? Key.DefsRef(keys[key]) : Key.IsPlaceholderKey(key) ? `#${key}` : ref
}
function RewriteFromArray(keys: XKeys, value: unknown[]): unknown[] {
  return value.map((inner) => Rewrite(keys, inner))
}
function RewriteFromObject(keys: XKeys, value: Record<PropertyKey, unknown>): Record<PropertyKey, unknown> {
  const result = Guard.Keys(value).reduce((result, key) => (result[key] = Rewrite(keys, value[key]), result), {} as Record<PropertyKey, unknown>)
  return Schema.IsRef(value) ? { ...result, $ref: RewriteRef(keys, value.$ref) } : result
}
function Rewrite(keys: XKeys, value: unknown): unknown {
  return (
    Guard.IsArray(value) ? RewriteFromArray(keys, value) :
    IsPlainObject(value) ? RewriteFromObject(keys, value) :
    value
  )
}
// ------------------------------------------------------------------
// Finalize
// ------------------------------------------------------------------
function FinalizeEntry(keys: XKeys, defs: XDefs, key: string, schema: Schema.XSchema): [XKeys, XDefs] {
  const rewritten = Rewrite(keys, schema) as Schema.XSchema
  const identity = Key.IsPlaceholderKey(key) ? { ...rewritten as object, $anchor: key } : rewritten
  const final = Key.HashKey(identity as Schema.XSchema)
  return [(keys[key] = final, keys), (defs[final] = identity as Schema.XSchema, defs)]
}
function FinalizeEntries(registry: Map<string, Schema.XSchema>): [XKeys, XDefs] {
  const [keys, defs] = [...registry].reduce(([keys, defs], [key, schema]) => FinalizeEntry(keys, defs, key, schema), [{}, {}] as [XKeys, XDefs])
  return [keys, defs]
}
function HasPlaceholders(registry: Map<string, Schema.XSchema>): boolean {
  return [...registry.keys()].some(Key.IsPlaceholderKey)
}
export function Finalize(registry: Map<string, Schema.XSchema>, reference: string): unknown {
  const [keys, defs] = HasPlaceholders(registry) ? FinalizeEntries(registry) : [{}, Object.fromEntries(registry)]
  return { $ref: RewriteRef(keys, reference), $defs: defs }
}
