/*--------------------------------------------------------------------------

@sinclair/typebox/prototypes

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { TypeRegistry, Kind, Static, TSchema, SchemaOptions } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

// -------------------------------------------------------------------------------------
// TUnionOneOf
// -------------------------------------------------------------------------------------
export interface TUnionOneOf<T extends TSchema[]> extends TSchema {
  [Kind]: 'UnionOneOf'
  static: { [K in keyof T]: Static<T[K]> }[number]
  oneOf: T
}
// -------------------------------------------------------------------------------------
// UnionOneOf
// -------------------------------------------------------------------------------------
/** `[Experimental]` Creates a Union type with a `oneOf` schema representation */
export function UnionOneOf<T extends TSchema[]>(oneOf: [...T], options: SchemaOptions = {}) {
  function UnionOneOfCheck(schema: TUnionOneOf<TSchema[]>, value: unknown) {
    return 1 === schema.oneOf.reduce((acc: number, schema: any) => (Value.Check(schema, value) ? acc + 1 : acc), 0)
  }
  if (!TypeRegistry.Has('UnionOneOf')) TypeRegistry.Set('UnionOneOf', UnionOneOfCheck)
  return { ...options, [Kind]: 'UnionOneOf', oneOf } as TUnionOneOf<T>
}