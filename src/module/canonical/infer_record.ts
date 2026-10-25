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
// RecordLikeA
//
// TRecord: {
//   type: 'object',
//   patternProperties: { '^[a-z]+$': { type: 'number' } }
// }
//
// Evaluated: {
//   type: 'object',
//   patternProperties: { A: { const: 1 }, B: { const: 3 } }
// }
// ------------------------------------------------------------------
type XRecordLikeA = { type: 'object' } & Schema.XPatternProperties
function IsRecordLikeA(schema: Schema.XSchema): schema is XRecordLikeA {
  return Schema.IsSchemaObject(schema)
    && Schema.IsType(schema)
    && Guard.IsEqual(schema.type, 'object')
    && Schema.IsPatternProperties(schema)
    && Guard.Keys(schema.patternProperties).length > 0
    && !Schema.IsPropertyNames(schema)
}
function InferRecordLikeA(stack: Schema.XStack, schema: XRecordLikeA): Type.TSchema {
  const keys = Guard.Keys(schema.patternProperties)
  const inferredKeys = keys.map(pattern => InferType(stack, { pattern }))
  const inferredValues = keys.map(pattern => InferType(stack, schema.patternProperties[pattern]))
  const evaluatedKey = Guard.IsEqual(keys.length, 1) ? inferredKeys[0] : Type.Evaluate(Type.Union(inferredKeys))
  const evaluatedValue = Guard.IsEqual(keys.length, 1) ? inferredValues[0] : Type.Evaluate(Type.Union(inferredValues))
  const evaluatedRecord = Type.Record(evaluatedKey, evaluatedValue)
  return Guard.IsEqual(keys.length, 1) ? evaluatedRecord : Type.Partial(evaluatedRecord)
}
// ------------------------------------------------------------------
// RecordLikeB
//
// {
//   type: 'object',
//   propertyNames: { type: 'string' }
// }
// ------------------------------------------------------------------
type XRecordLikeB = { type: 'object' } & Schema.XPropertyNames
function IsRecordLikeB(schema: Schema.XSchema): schema is XRecordLikeB {
  return Schema.IsSchemaObject(schema)
    && Schema.IsType(schema)
    && Guard.IsEqual(schema.type, 'object')
    && Schema.IsPropertyNames(schema)
    && Schema.IsSchemaObject(schema.propertyNames)
    && !Schema.IsPatternProperties(schema)
}
function InferRecordLikeB(stack: Schema.XStack, schema: XRecordLikeB): Type.TSchema {
  const inferredKey = InferType(stack, schema.propertyNames)
  return Type.Record(inferredKey, Type.Unknown())
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export type XRecordLike = XRecordLikeA | XRecordLikeB
export function IsRecordLike(schema: Schema.XSchema): schema is XRecordLike {
  return IsRecordLikeA(schema) || IsRecordLikeB(schema)
}
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferRecord(stack: Schema.XStack, schema: XRecordLike): Type.TSchema {
  return (
    IsRecordLikeA(schema) ? InferRecordLikeA(stack, schema) :
    InferRecordLikeB(stack, schema)
  )
}