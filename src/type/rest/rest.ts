/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import type { TSchema } from '../schema/index'
import type { TIntersect } from '../intersect/index'
import type { TUnion } from '../union/index'
import type { TTuple } from '../tuple/index'
import { CloneRest } from '../clone/type'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsIntersect, IsUnion, IsTuple } from '../guard/type'
// ------------------------------------------------------------------
// RestResolve
// ------------------------------------------------------------------
// prettier-ignore
type TRestResolve<T extends TSchema> = 
  T extends TIntersect<infer S> ? [...S] : 
  T extends TUnion<infer S> ? [...S] : 
  T extends TTuple<infer S> ? [...S] : 
  []
// prettier-ignore
function RestResolve<T extends TSchema>(T: T) {
  return (
    IsIntersect(T) ? [...T.allOf] : 
    IsUnion(T) ? [...T.anyOf] : 
    IsTuple(T) ? [...(T.items ?? [])] : 
    []
  ) as TRestResolve<T>
}
// ------------------------------------------------------------------
// TRest
// ------------------------------------------------------------------
export type TRest<T extends TSchema> = TRestResolve<T>

/** `[Json]` Extracts interior Rest elements from Tuple, Intersect and Union types */
export function Rest<T extends TSchema>(T: T): TRest<T> {
  return CloneRest(RestResolve(T))
}
