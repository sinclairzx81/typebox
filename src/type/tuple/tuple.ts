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
import type { Static } from '../static/index'
import { CloneRest } from '../clone/type'
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
export function Tuple<T extends TSchema[]>(items: [...T], options: SchemaOptions = {}): TTuple<T> {
  // return TupleResolver.Resolve(T)
  const [additionalItems, minItems, maxItems] = [false, items.length, items.length]
  // prettier-ignore
  return (
    items.length > 0 ?
      { ...options, [Kind]: 'Tuple', type: 'array', items: CloneRest(items), additionalItems, minItems, maxItems } :
      { ...options, [Kind]: 'Tuple', type: 'array', minItems, maxItems }
  ) as never
}
