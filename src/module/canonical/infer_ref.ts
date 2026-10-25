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
import * as Schema from '../../schema/index.ts'
import * as Type from '../../type/index.ts'
import { InferType } from './infer_type.ts'

// ------------------------------------------------------------------
// RecursionGuard
// ------------------------------------------------------------------
type XModuleLike = Schema.XDefs & Schema.XRef
function IsModuleLike(schema: Schema.XSchema): schema is XModuleLike {
  return Schema.IsSchemaObject(schema) &&
    Schema.IsDefs(schema) &&
    Schema.IsRef(schema) &&
    !Type.IsCyclic(schema)
}
function IsRecursive(stack: Schema.XStack, schema: XRefLikeA): boolean {
  return IsModuleLike(stack.schema) &&
    !Guard.IsEqual(stack.schema, schema) &&
    Guard.IsEqual(stack.schema.$ref, schema.$ref)
}
// ------------------------------------------------------------------
// RefLikeA
// ------------------------------------------------------------------
function CanonicalRef($ref: string): Type.TSchema {
  const canonical = $ref.includes('/') ? $ref.slice($ref.lastIndexOf('/') + 1) : $ref
  return Type.Ref(canonical)
}
type XRefLikeA = Schema.XRef
function IsRefLikeA(schema: Schema.XSchema): schema is XRefLikeA {
  return Schema.IsSchemaObject(schema) 
    && Schema.IsRef(schema) 
    && !Guard.IsEqual(schema.$ref, '#')
}
function InferRefLikeA(stack: Schema.XStack, schema: XRefLikeA): Type.TSchema {
  if (IsRecursive(stack, schema)) return CanonicalRef(schema.$ref)
  const result = Schema.Resolve.Ref(stack, schema)
  return Guard.IsUndefined(result.schema) 
    ? CanonicalRef(schema.$ref) 
    : Continue(result.stack, result.schema)
}
// ------------------------------------------------------------------
// RefLikeB
// ------------------------------------------------------------------
type XRefLikeB = Schema.XRecursiveRef
function IsRefLikeB(schema: Schema.XSchema): schema is XRefLikeB {
  return Schema.IsSchemaObject(schema) 
    && Schema.IsRecursiveRef(schema)
}
function InferRefLikeB(stack: Schema.XStack, schema: XRefLikeB): Type.TSchema {
  const target = Schema.Resolve.RecursiveRef(stack, schema)
  return Guard.IsUndefined(target) 
    ? Type.Unknown() 
    : Continue(stack, target)
}
// ------------------------------------------------------------------
// RefLikeC
// ------------------------------------------------------------------
type XRefLikeC = Schema.XDynamicRef
function IsRefLikeC(schema: Schema.XSchema): schema is XRefLikeC {
  return Schema.IsSchemaObject(schema) 
    && Schema.IsDynamicRef(schema)
}
function InferRefLikeC(stack: Schema.XStack, schema: XRefLikeC): Type.TSchema {
  const target = Schema.Resolve.DynamicRef(stack, schema)
  return Guard.IsUndefined(target) 
    ? Type.Unknown() 
    : Continue(stack, target)
}
// ------------------------------------------------------------------
// Continue
// ------------------------------------------------------------------
const maxDepth = 2, depths = new WeakMap<object, number>()
function Continue(stack: Schema.XStack, schema: Schema.XSchema): Type.TSchema {
  if (!Schema.IsSchemaObject(schema)) return InferType(stack, schema) // boolean schemas can't key a WeakMap
  const depth = depths.get(schema) ?? 0
  if (depth >= maxDepth) return Type.Any()
  depths.set(schema, depth + 1)
  try {
    return InferType(stack, schema)
  } finally {
    depths.set(schema, depth)
  }
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export type XRefLike = XRefLikeA | XRefLikeB | XRefLikeC
export function IsRefLike(schema: Schema.XSchema): schema is XRefLike {
  return IsRefLikeA(schema) || IsRefLikeB(schema) || IsRefLikeC(schema)
}
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferRef(stack: Schema.XStack, schema: XRefLike): Type.TSchema {
  return (
    IsRefLikeA(schema) ? InferRefLikeA(stack, schema) : 
    IsRefLikeB(schema) ? InferRefLikeB(stack, schema) : 
    InferRefLikeC(stack, schema)
  )
}
