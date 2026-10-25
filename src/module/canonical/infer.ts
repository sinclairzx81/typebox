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

import { Arguments } from '../../system/index.ts'
import * as Schema from '../../schema/index.ts'
import * as Type from '../../type/index.ts'
import { InferType } from './infer_type.ts'

// ------------------------------------------------------------------
// Canonical.Infer
// ------------------------------------------------------------------
/**
 * Infers a canonical TypeBox representation from JSON Schema. This function is lossy and
 * will only infer representations that contribute to inference. Any non-contributing data
 * constraints or metadata embedded in the input schema will be discarded from the output.
 * This function is used internally by Module.Static(...) to canonicalize schematics before
 * annotation emit.
 */
export function Infer(schema: Schema.XSchema): Type.TSchema
/**
 * Infers a canonical TypeBox representation from JSON Schema. This function is lossy and
 * will only infer representations that contribute to inference. Any non-contributing data
 * constraints or metadata embedded in the input schema will be discarded from the output.
 * This function is used internally by Module.Static(...) to canonicalize schematics before
 * annotation emit.
 */
export function Infer(context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XSchema): Type.TSchema
/**
 * Infers a canonical TypeBox representation from JSON Schema. This function is lossy and
 * will only infer representations that contribute to inference. Any non-contributing data
 * constraints or metadata embedded in the input schema will be discarded from the output.
 * This function is used internally by Module.Static(...) to canonicalize schematics before
 * annotation emit.
 */
export function Infer(...args: unknown[]): Type.TSchema {
  const [context, schema] = Arguments.Match<[Record<PropertyKey, Schema.XSchema>, Schema.XSchema]>(args, {
    2: (context, schema) => [context, schema],
    1: (schema) => [{}, schema]
  })
  return InferType(Schema.Stack(context, schema), schema)
}