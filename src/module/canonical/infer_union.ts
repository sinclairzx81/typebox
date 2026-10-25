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
// UnionLikeA
//
// { anyOf: [ { type: 'number' }, { type: 'string' } ] }
// ------------------------------------------------------------------
type XUnionLikeA = Schema.XAnyOf
function IsUnionLikeA(schema: Schema.XSchema): schema is XUnionLikeA {
  return Schema.IsSchemaObject(schema)
    && Schema.IsAnyOf(schema)
}
function InferUnionLikeA(stack: Schema.XStack, schema: XUnionLikeA): Type.TSchema {
  return Type.Union(schema.anyOf.map((schema) => InferType(stack, schema)))
}
// ------------------------------------------------------------------
// UnionLikeB
//
// { oneOf: [ { type: 'number' }, { type: 'string' } ] }
// ------------------------------------------------------------------
type XUnionLikeB = Schema.XOneOf
function IsUnionLikeB(schema: Schema.XSchema): schema is XUnionLikeB {
  return Schema.IsSchemaObject(schema)
    && Schema.IsOneOf(schema)
}
function InferUnionLikeB(stack: Schema.XStack, schema: XUnionLikeB): Type.TSchema {
  return Type.Union(schema.oneOf.map((schema) => InferType(stack, schema)))
}
// ------------------------------------------------------------------
// UnionLikeC
//
// { type: [ 'number', 'string' ] }
// ------------------------------------------------------------------
type XUnionLikeC = { type: string[] }
function IsUnionLikeC(schema: Schema.XSchema): schema is XUnionLikeC {
  return Schema.IsSchemaObject(schema)
    && Schema.IsType(schema)
    && Guard.IsArray(schema.type)
    && schema.type.every((typename) => Guard.IsString(typename))
}
function InferUnionLikeC(stack: Schema.XStack, schema: XUnionLikeC): Type.TSchema {
  return Type.Union(schema.type.map((type) => InferType(stack, { type })))
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export type XUnionLike = XUnionLikeA | XUnionLikeB | XUnionLikeC
export function IsUnionLike(schema: Schema.XSchema): schema is XUnionLike {
  return IsUnionLikeA(schema) || IsUnionLikeB(schema) || IsUnionLikeC(schema)
}
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferUnion(stack: Schema.XStack, schema: XUnionLike): Type.TSchema {
  return (
    IsUnionLikeA(schema) ? InferUnionLikeA(stack, schema) :
    IsUnionLikeB(schema) ? InferUnionLikeB(stack, schema) :
    InferUnionLikeC(stack, schema)
  )
}