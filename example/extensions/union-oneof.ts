/*--------------------------------------------------------------------------

@sinclair/typebox/extensions

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Kind, TSchema, SchemaOptions, Static } from '@sinclair/typebox'
import { Custom } from '@sinclair/typebox/custom'
import { Value } from '@sinclair/typebox/value'

function UnionOneOfCheck(schema: UnionOneOf<TSchema[]>, value: unknown) {
  return 1 === schema.oneOf.reduce((acc: number, schema: any) => (Value.Check(schema, value) ? acc + 1 : acc), 0)
}

export interface UnionOneOf<T extends TSchema[]> extends TSchema {
  [Kind]: 'UnionOneOf'
  static: { [K in keyof T]: Static<T[K]> }[number]
  oneOf: T
}

/** Creates a Union type with a `oneOf` schema representation */
export function UnionOneOf<T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) {
  if (!Custom.Has('UnionOneOf')) Custom.Set('UnionOneOf', UnionOneOfCheck)
  return { ...options, [Kind]: 'UnionOneOf', oneOf } as UnionOneOf<T>
}
