/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { CreateType } from '../create/type'
import type { TSchema } from '../schema/index'
import { Never, type TNever } from '../never/index'
import { TIntersect, IntersectOptions } from './intersect-type'
import { IntersectCreate } from './intersect-create'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsTransform } from '../guard/kind'
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
export type Intersect<Types extends TSchema[]> = (
  Types extends [TSchema] ? Types[0] :
  Types extends [] ? TNever :
  TIntersect<Types>
)
/** `[Json]` Creates an evaluated Intersect type */
export function Intersect<Types extends TSchema[]>(types: [...Types], options?: IntersectOptions): Intersect<Types> {
  if (types.length === 1) return CreateType(types[0], options) as never
  if (types.length === 0) return Never(options) as never
  if (types.some((schema) => IsTransform(schema))) throw new Error('Cannot intersect transform types')
  return IntersectCreate(types, options) as never
}
