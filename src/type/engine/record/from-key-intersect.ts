/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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

// deno-fmt-ignore-file

import { type TSchema } from '../../types/schema.ts'
import { type TEvaluateIntersect, EvaluateIntersect } from '../evaluate/evaluate.ts'
import { type TFromKey, FromKey } from './from-key.ts'

// ------------------------------------------------------------------
//
// FromIntersect
//
// The FromIntersect function evaluates the provided types and then 
// returns to RecordOrObject to compute the result. Since evaluating 
// intersections for record keys is resource-intensive, this function 
// handles this case specifically for intersections only and is 
// considered to be an optimization versus naively evaluating at the 
// RecordOrObject level.
//
// ------------------------------------------------------------------
export type TFromIntersectKey<Types extends TSchema[], Value extends TSchema,
  EvaluatedKey extends TSchema = TEvaluateIntersect<Types>,
  Result extends TSchema = TFromKey<EvaluatedKey, Value>
> = Result
export function FromIntersectKey<Types extends TSchema[], Value extends TSchema>
  (types: [...Types], value: Value):
    TFromIntersectKey<Types, Value> {
  const evaluatedKey = EvaluateIntersect(types)
  const result = FromKey(evaluatedKey, value)
  return result as never
}
