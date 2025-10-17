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

import { Guard } from '../../guard/index.ts'
import { IsJsonPointer, IsUri } from '../../format/index.ts'
import { Pointer } from '../../value/pointer/index.ts'
import * as S from '../types/index.ts'

// ------------------------------------------------------------------
// Rebase
// ------------------------------------------------------------------
export function Rebase(baseUri: string, schema: S.XSchemaObject): string {
  if (!S.IsId(schema)) return baseUri
  if (IsUri(schema.$id)) return schema.$id
  if (!IsUri(schema.$id) && IsUri(baseUri)) {
    return new URL(schema.$id, baseUri).href
  }
  return baseUri
}
// ------------------------------------------------------------------
// Select
// ------------------------------------------------------------------
function IsHashPointer(value: string): boolean {
  return IsHash(value) && IsJsonPointer(value.slice(1))
}
function IsHash(value: string): boolean {
  return value.length > 0 && value[0] === '#'
}
function Select(schema: S.XSchemaObject, baseUri: string, $ref: string): S.XSchema | undefined {
  if (IsUri(baseUri)) {
    const [base, ref] = [new URL(baseUri), new URL($ref, baseUri)]
    const matched = base.pathname === ref.pathname
    const withHash = IsHash(ref.hash)
    if (matched && !withHash) {
      return schema
    }
  }
  if (IsHashPointer($ref)) {
    const target = Pointer.Get(schema, $ref.slice(1))
    if (S.IsSchema(target)) return target
  }
  return undefined
}
// ------------------------------------------------------------------
// Traversal
// ------------------------------------------------------------------
function FromObject(schema: S.XSchemaObject, baseUrl: string, ref: S.XRef): S.XSchema | undefined {
  // ----------------------------------------------------------------
  // TypeBox: Fast TCyclic Deref
  // ----------------------------------------------------------------
  if (S.IsDefs(schema) && Guard.HasPropertyKey(schema.$defs, ref.$ref)) {
    return schema.$defs[ref.$ref]
  }
  // ----------------------------------------------------------------
  // Json Schema
  // ----------------------------------------------------------------
  const rebase = Rebase(baseUrl, schema)
  const target = Select(schema, rebase, ref.$ref)
  if (S.IsSchema(target)) return target

  // Keep searching ...
  return Object.values(schema).reduce<S.XSchema | undefined>(
    (result, subschema) => result || FromValue(subschema, rebase, ref),
    undefined
  )
}
function FromArray(schema: unknown[], baseUri: string, ref: S.XRef): S.XSchema | undefined {
  return schema.reduce((result, value) => result || FromValue(value, baseUri, ref), undefined) as S.XSchemaObject | undefined
}
function FromValue(schema: unknown, base: string, ref: S.XRef): S.XSchema | undefined {
  return (
    (Guard.IsObject(schema) && FromObject(schema, base, ref)) ||
    (Guard.IsArray(schema) && FromArray(schema, base, ref)) ||
    undefined
  )
}
// ------------------------------------------------------------------
// Deref
// ------------------------------------------------------------------
/** Deferences a schema with the given Ref */
export function Deref(schema: object, ref: S.XRef): unknown | undefined {
  return FromValue(schema, '', ref)
}
