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

import { TypeRegistry, Kind, TSchema, SchemaOptions } from '@sinclair/typebox'

// -------------------------------------------------------------------------------------
// TUnionEnum
// -------------------------------------------------------------------------------------
export interface TUnionEnum<T extends (string | number)[]> extends TSchema {
  [Kind]: 'UnionEnum'
  static: T[number]
  enum: T
}
// -------------------------------------------------------------------------------------
// UnionEnum
// -------------------------------------------------------------------------------------
/** `[Experimental]` Creates a Union type with a `enum` schema representation  */
export function UnionEnum<T extends (string | number)[]>(values: [...T], options: SchemaOptions = {}) {
  function UnionEnumCheck(schema: TUnionEnum<(string | number)[]>, value: unknown) {
    return (typeof value === 'string' || typeof value === 'number') && schema.enum.includes(value)
  }
  if (!TypeRegistry.Has('UnionEnum')) TypeRegistry.Set('UnionEnum', UnionEnumCheck)
  return { ...options, [Kind]: 'UnionEnum', enum: values } as TUnionEnum<T>
}