/*--------------------------------------------------------------------------

@sinclair/typebox/extensions

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Kind, TSchema, SchemaOptions, IntersectReduce, IntersectEvaluate } from '@sinclair/typebox'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Custom } from '@sinclair/typebox/custom'
import { Value } from '@sinclair/typebox/value'

function IntersectAllOfCheck(schema: IntersectAllOf<TSchema[]>, value: unknown) {
  if (!schema.allOf.every((schema) => Value.Check(schema, value))) return false
  if (schema.unevaluatedProperties === undefined || schema.unevaluatedProperties === true) return true
  const valueKeys = typeof value === 'object' && value !== null ? globalThis.Object.keys(value) : []
  const knownKeys = schema.allOf.reduce((set, schema) => {
    if (!TypeGuard.TObject(schema)) return set
    Object.keys(schema.properties).forEach((key) => set.add(key))
    return set
  }, new Set<string>())
  return valueKeys.every((key) => knownKeys.has(key))
}

export interface IntersectAllOfOptions extends SchemaOptions {
  unevaluatedProperties?: boolean
}

export interface IntersectAllOf<T extends TSchema[]> extends TSchema, IntersectAllOfOptions {
  [Kind]: 'IntersectAllOf'
  static: IntersectReduce<unknown, IntersectEvaluate<T, []>>
  allOf: T
}

/** Creates a Intersect type with a `allOf` schema representation */
export function IntersectAllOf<T extends TSchema[]>(allOf: [...T], options: IntersectAllOfOptions = {}) {
  if (!Custom.Has('IntersectAllOf')) Custom.Set('IntersectAllOf', IntersectAllOfCheck)
  return { ...options, [Kind]: 'IntersectAllOf', allOf } as IntersectAllOf<T>
}
