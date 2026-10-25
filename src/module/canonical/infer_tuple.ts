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
// TupleLikeA
//
// {
//   type: 'array',
//   additionalItems: false,
//   items: [ { type: 'string' }, { type: 'number' } ],
//   minItems: 2
// }
// ------------------------------------------------------------------
type XTupleLikeA = Schema.XItemsSized & Schema.XMinItems & { additionalItems: false }
function IsTupleLikeA(schema: Schema.XSchema): schema is XTupleLikeA {
  return Schema.IsSchemaObject(schema)
    && Schema.IsType(schema)
    && Schema.IsAdditionalItems(schema)
    && Schema.IsItemsSized(schema)
    && Schema.IsMinItems(schema)
    && Guard.IsEqual(schema.type, 'array')
    && Guard.IsEqual(schema.additionalItems, false)
    && Guard.IsEqual(schema.minItems, schema.items.length)
}
function InferTupleLikeA(stack: Schema.XStack, schema: XTupleLikeA): Type.TSchema {
  return Type.Tuple(schema.items.map((schema) => InferType(stack, schema)))
}
// ------------------------------------------------------------------
// TupleLikeB
//
// {
//   type: 'array',
//   items: [ { type: 'string' }, { type: 'number' } ],
//   minItems: 2,
//   maxItems: 2
// }
// ------------------------------------------------------------------
type XTupleLikeB = Schema.XItemsSized & Schema.XMinItems & Schema.XMaxItems
function IsTupleLikeB(schema: Schema.XSchema): schema is XTupleLikeB {
  return Schema.IsSchemaObject(schema)
    && Schema.IsType(schema)
    && Schema.IsItemsSized(schema)
    && Schema.IsMinItems(schema)
    && Schema.IsMaxItems(schema)
    && Guard.IsEqual(schema.type, 'array')
    && Guard.IsEqual(schema.minItems, schema.items.length)
    && Guard.IsEqual(schema.maxItems, schema.items.length)
}
function InferTupleLikeB(stack: Schema.XStack, schema: XTupleLikeB): Type.TSchema {
  return Type.Tuple(schema.items.map((schema) => InferType(stack, schema)))
}
// ------------------------------------------------------------------
// TupleLikeC
//
// {
//   type: 'array',
//   prefixItems: [ { type: 'string' }, { type: 'number' } ],
//   minItems: 2,
//   maxItems: 2
// }
// ------------------------------------------------------------------
type XTupleLikeC = Schema.XPrefixItems & Schema.XMinItems & Schema.XMaxItems
function IsTupleLikeC(schema: Schema.XSchema): schema is XTupleLikeC {
  return Schema.IsSchemaObject(schema)
    && Schema.IsType(schema)
    && Schema.IsPrefixItems(schema)
    && Schema.IsMinItems(schema)
    && Schema.IsMaxItems(schema)
    && Guard.IsEqual(schema.type, 'array')
    && Guard.IsEqual(schema.minItems, schema.prefixItems.length)
    && Guard.IsEqual(schema.maxItems, schema.prefixItems.length)
}
function InferTupleLikeC(stack: Schema.XStack, schema: XTupleLikeC): Type.TSchema {
  return Type.Tuple(schema.prefixItems.map((schema) => InferType(stack, schema)))
}
// ------------------------------------------------------------------
// TupleLikeD
//
// {
//   type: 'array',
//   prefixItems: [ { type: 'string' }, { type: 'number' } ],
//   items: false,
//   minItems: 2
// }
// ------------------------------------------------------------------
type XTupleLikeD = Schema.XPrefixItems & Schema.XMinItems & { items: false }
function IsTupleLikeD(schema: Schema.XSchema): schema is XTupleLikeD {
  return Schema.IsSchemaObject(schema)
    && Schema.IsType(schema)
    && Schema.IsPrefixItems(schema)
    && Schema.IsItems(schema)
    && Schema.IsMinItems(schema)
    && Guard.IsEqual(schema.type, 'array')
    && Guard.IsEqual(schema.items, false)
    && Guard.IsEqual(schema.minItems, schema.prefixItems.length)
}
function InferTupleLikeD(stack: Schema.XStack, schema: XTupleLikeD): Type.TSchema {
  return Type.Tuple(schema.prefixItems.map((schema) => InferType(stack, schema)))
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export type XTupleLike = XTupleLikeA | XTupleLikeB | XTupleLikeC | XTupleLikeD
export function IsTupleLike(schema: Schema.XSchema): schema is XTupleLike {
  return IsTupleLikeA(schema) || IsTupleLikeB(schema) || IsTupleLikeC(schema) || IsTupleLikeD(schema)
}
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferTuple(stack: Schema.XStack, schema: XTupleLike): Type.TSchema {
  return (
    IsTupleLikeA(schema) ? InferTupleLikeA(stack, schema) :
    IsTupleLikeB(schema) ? InferTupleLikeB(stack, schema) :
    IsTupleLikeC(schema) ? InferTupleLikeC(stack, schema) :
    InferTupleLikeD(stack, schema)
  )
}