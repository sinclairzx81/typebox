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
// QualifiedSchema
// ------------------------------------------------------------------
export interface QualifiedSchema {
  url: URL
  schema: Schema.XSchema
}
// ------------------------------------------------------------------
// FromSchemaArray
// ------------------------------------------------------------------
function* FromSchemaArray(schema: unknown[], base: URL, path: string): IterableIterator<QualifiedSchema> {
  for (let i = 0; i < schema.length; i++) {
    yield* FromSchema(schema[i], base, `${path}${path[i]}`)
  }
}
// ------------------------------------------------------------------
// FromSchemaObject
// ------------------------------------------------------------------
function* FromSchemaObject(schema: {}, base: URL, path: string): IterableIterator<QualifiedSchema> {
  for (const [key, value] of Guard.Entries(schema as any)) {
    yield* FromSchema(value, base, `${path}/${key}`)
  }
}
// ------------------------------------------------------------------
// FromSchema
// ------------------------------------------------------------------
function* FromSchema(schema: unknown, base: URL, path: string): IterableIterator<QualifiedSchema> {
  // rebase if schema has an $id
  const isId = Schema.IsSchemaObject(schema) && Schema.IsId(schema)
  base = isId ? new URL(schema.$id, base) : base
  path = isId ? '' : path

  // the schema is a valid XSchema, then yield
  if (Schema.IsSchema(schema)) {
    const url = Guard.IsEqual(path, '') ? base : new URL(`#${path}`, base)
    yield { url, schema }
  }
  // traveral
  if (Schema.IsSchemaArray(schema)) yield* FromSchemaArray(schema, base, path)
  if (Schema.IsSchemaObject(schema)) yield* FromSchemaObject(schema, base, path)
}
// ------------------------------------------------------------------
// Enumerate
// ------------------------------------------------------------------
export function* Enumerate(schema: Schema.XSchema, base: URL = new URL('memory://root')): IterableIterator<QualifiedSchema> {
  yield* FromSchema(schema, base, '')
}
