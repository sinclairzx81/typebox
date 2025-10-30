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
import * as Schema from '../types/index.ts'

// ------------------------------------------------------------------
// LexicalSchema
// ------------------------------------------------------------------
export interface LexicalSchema {
  url: URL
  schema: Schema.XSchema
}
// ------------------------------------------------------------------
// FromSchemaArray
// ------------------------------------------------------------------
function* FromSchemaArray(schema: Schema.XSchema[], base: URL, path: string): IterableIterator<LexicalSchema> {
  for (let index = 0; index < schema.length; index++) {
    yield* FromSchema(schema[index], base, `${path}/${index}`)
  }
}
// ------------------------------------------------------------------
// FromSchemaObject
// ------------------------------------------------------------------
function* FromSchemaObject(schema: Schema.XSchemaObject, base: URL, path: string): IterableIterator<LexicalSchema> {
  if (!Schema.IsSchemaObject(schema)) return
  for (const [key, value] of Guard.Entries(schema as any)) {
    if (!Schema.IsSchema(value)) continue
    yield* FromSchema(value, base, `${path}/${key}`)
  }
}
// ------------------------------------------------------------------
// FromSchema
// ------------------------------------------------------------------
function* FromSchema(schema: Schema.XSchema, base: URL, path: string): IterableIterator<LexicalSchema> {
  if (Schema.IsId(schema) && Guard.IsEqual(isRoot, false)) return
  isRoot = false
  const url = Guard.IsEqual(path, '') ? base : new URL(`#${path}`, base)
  yield { url, schema }
  if (Schema.IsSchemaArray(schema)) yield* FromSchemaArray(schema, base, path)
  if (Schema.IsSchemaObject(schema)) yield* FromSchemaObject(schema, base, path)
}
// ------------------------------------------------------------------
// Enumerate
// ------------------------------------------------------------------
let isRoot = true
export function* EnumerateLexical(schema: Schema.XSchema, base: URL = new URL('memory://root')): IterableIterator<LexicalSchema> {
  isRoot = true
  base = Schema.IsId(schema) ? new URL(schema.$id, base) : base
  yield* FromSchema(schema, base, '')
}
