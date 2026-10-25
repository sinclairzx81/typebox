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

// deno-lint-ignore-file ban-types
// deno-fmt-ignore-file

import { Guard } from '../../guard/index.ts'
import * as Schema from '../../schema/index.ts'
import * as Type from '../../type/index.ts'

// ------------------------------------------------------------------
// NeverLikeA
//
// { not: {} }
// ------------------------------------------------------------------
type XNeverLikeA = { not: {} }
function IsNeverLikeA(schema: Schema.XSchema): schema is XNeverLikeA {
  return Schema.IsSchemaObject(schema)
    && Schema.IsNot(schema)
    && Guard.IsObject(schema.not)
    && Guard.IsEqual(Guard.Keys(schema.not).length, 0)
}
function InferNeverLikeA(_stack: Schema.XStack, _schema: XNeverLikeA): Type.TSchema {
  return Type.Never()
}
// ------------------------------------------------------------------
// NeverLikeB
//
// false
// ------------------------------------------------------------------
type XNeverLikeB = false
function IsNeverLikeB(schema: Schema.XSchema): schema is XNeverLikeB {
  return Schema.IsSchemaBoolean(schema)
    && Guard.IsEqual(schema, false)
}
function InferNeverLikeB(_stack: Schema.XStack, _schema: XNeverLikeB): Type.TSchema {
  return Type.Never()
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export type XNeverLike = XNeverLikeA | XNeverLikeB
export function IsNeverLike(schema: Schema.XSchema): schema is XNeverLike {
  return IsNeverLikeA(schema) || IsNeverLikeB(schema)
}
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferNever(stack: Schema.XStack, schema: XNeverLike): Type.TSchema {
  return (
    IsNeverLikeA(schema) ? InferNeverLikeA(stack, schema) :
    InferNeverLikeB(stack, schema)
  )
}