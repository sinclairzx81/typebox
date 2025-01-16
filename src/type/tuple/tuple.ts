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
import type { TSchema, SchemaOptions } from '../schema/index'
import type { Static } from '../static/index'
import { Kind } from '../symbols/index'

// ------------------------------------------------------------------
// TupleStatic
// ------------------------------------------------------------------
// prettier-ignore
type TupleStatic<T extends TSchema[], P extends unknown[], Acc extends unknown[] = []> = 
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? TupleStatic<R, P, [...Acc, Static<L, P>]>
    : Acc
// ------------------------------------------------------------------
// TTuple
// ------------------------------------------------------------------
export interface TTuple<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Tuple'
  static: TupleStatic<T, this['params']>
  type: 'array'
  items?: T
  additionalItems?: false
  minItems: number
  maxItems: number
}
/** `[Json]` Creates a Tuple type */
export function Tuple<Types extends TSchema[]>(types: [...Types], options?: SchemaOptions): TTuple<Types> {
  // prettier-ignore
  return CreateType(
    types.length > 0 ?
      { [Kind]: 'Tuple', type: 'array', items: types, additionalItems: false, minItems: types.length, maxItems: types.length } :
      { [Kind]: 'Tuple', type: 'array', minItems: types.length, maxItems: types.length },
  options) as never
}
