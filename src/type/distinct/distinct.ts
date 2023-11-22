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

import { ExtendsCheck, ExtendsResult } from '../extends/index'
import { TSchema } from '../schema/index'

// ------------------------------------------------------------------
// Includes
// ------------------------------------------------------------------
// prettier-ignore
type Includes<T extends TSchema[], C extends TSchema> =
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? C extends L
      ? true
      : Includes<R, C>
    : false
// prettier-ignore
function Includes(T: TSchema[], C: TSchema): boolean {
  const [L, ...R] = T
  return T.length > 0 
    ? ExtendsCheck(C, L) === ExtendsResult.True
      ? true
      : Includes(R, C)
    : false
}
// ------------------------------------------------------------------
// DistinctType
// ------------------------------------------------------------------
// prettier-ignore
export type DistinctType<T extends TSchema[], Acc extends TSchema[] = []> =
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? Includes<Acc, L> extends false
      ? DistinctType<R, [...Acc, L]>
      : DistinctType<R, [...Acc]>
    : Acc
// prettier-ignore
export function DistinctType(T: TSchema[], Acc: TSchema[] = []): TSchema[] {
  const [L, ...R] = T
  return T.length > 0
    ? Includes(Acc, L) === false
      ? DistinctType(R, [...Acc, L])
      : DistinctType(R, [...Acc])
    : Acc
}
