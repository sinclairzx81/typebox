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

import { IsDynamicAnchor, type XSchema, type XSchemaLike } from '../types/index.ts'
import { XDynamicRef } from '../schema.ts'

// ------------------------------------------------------------------
// Traversal
// ------------------------------------------------------------------
function FromObject(schema: XSchema, ref: XDynamicRef): XSchemaLike | undefined {
  if (IsDynamicAnchor(schema) && Guard.IsEqual(schema.$dynamicAnchor, ref.$dynamicRef)) {
    return schema
  }
  return Object.values(schema).reduce<XSchemaLike | undefined>(
    (result, subschema) => result || FromValue(subschema, ref),
    undefined
  )
}
function FromArray(schema: unknown[], ref: XDynamicRef): XSchemaLike | undefined {
  return schema.reduce((result, value) => result || FromValue(value, ref), undefined) as XSchema | undefined
}
function FromValue(schema: unknown, ref: XDynamicRef): XSchemaLike | undefined {
  return (
    (Guard.IsObject(schema) && FromObject(schema, ref)) ||
    (Guard.IsArray(schema) && FromArray(schema, ref)) ||
    undefined
  )
}
// ------------------------------------------------------------------
// Deref
// ------------------------------------------------------------------
/** Deferences a schema with the given XDynamicRef */
export function DynamicDeref(schema: object, ref: XDynamicRef): unknown | undefined {
  const $dynamicRef = ref.$dynamicRef.startsWith('#') ? ref.$dynamicRef.slice(1) : ref.$dynamicRef
  return FromValue(schema, { $dynamicRef })
}
