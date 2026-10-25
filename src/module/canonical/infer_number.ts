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

// ------------------------------------------------------------------
// IsImplicit
// ------------------------------------------------------------------
function HasValidConstraints(schema: Schema.XSchemaObject): boolean {
  return (!Schema.IsMinimum(schema) || Guard.IsNumber(schema.minimum))
    && (!Schema.IsMaximum(schema) || Guard.IsNumber(schema.maximum))
    && (!Schema.IsExclusiveMinimum(schema) || Guard.IsNumber(schema.exclusiveMinimum))
    && (!Schema.IsExclusiveMaximum(schema) || Guard.IsNumber(schema.exclusiveMaximum))
    && (!Schema.IsMultipleOf(schema) || Guard.IsNumber(schema.multipleOf))
}
function HasAtLeastOneConstraint(schema: Schema.XSchemaObject): boolean {
  return Schema.IsMinimum(schema)
    || Schema.IsMaximum(schema)
    || Schema.IsExclusiveMinimum(schema)
    || Schema.IsExclusiveMaximum(schema)
    || Schema.IsMultipleOf(schema)
}
function IsImplicit(schema: Schema.XSchemaObject): boolean {
  return !Schema.IsType(schema)
    && HasAtLeastOneConstraint(schema)
    && HasValidConstraints(schema)
}
// ------------------------------------------------------------------
// IsExplicit
// ------------------------------------------------------------------
function IsExplicit(schema: Schema.XSchemaObject): boolean {
  return Schema.IsType(schema) && Guard.IsEqual(schema.type, 'number')
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export type XNumberLike = { type?: 'number' }
export function IsNumberLike(schema: Schema.XSchema): schema is XNumberLike {
  return Schema.IsSchemaObject(schema)
    && !Schema.IsConst(schema) // Not-Literal
    && (IsExplicit(schema) || IsImplicit(schema))
}
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
export function InferNumber(_stack: Schema.XStack, _schema: XNumberLike): Type.TSchema {
  return Type.Number()
}
