/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import type { TSchema, SchemaOptions } from '../schema/index'
import { type TNever, Never } from '../never/index'
import type { TUnion } from './union-type'
import { CreateType } from '../create/type'
import { UnionCreate } from './union-create'

// prettier-ignore
export type Union<T extends TSchema[]> = (
  T extends [] ? TNever :
  T extends [TSchema] ? T[0] :
  TUnion<T>
)
/** `[Json]` Creates a Union type */
export function Union<Types extends TSchema[]>(types: [...Types], options?: SchemaOptions): Union<Types> {
  // prettier-ignore
  return (
    types.length === 0 ? Never(options) :
    types.length === 1 ? CreateType(types[0], options) :
    UnionCreate(types, options)
  ) as Union<Types>
}
