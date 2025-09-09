/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TDistribute, Distribute } from './distribute.ts'
import { type TBroaden, Broaden } from './broaden.ts'

// ------------------------------------------------------------------
// EvaluateIntersect
// ------------------------------------------------------------------
export type TEvaluateIntersect<Types extends TSchema[],
  Distribution extends TSchema[] = TDistribute<Types>,
  Result extends TSchema = TBroaden<Distribution>
> = Result
export function EvaluateIntersect<Types extends TSchema[]>(types: [...Types]): TEvaluateIntersect<Types> {
  const distribution = Distribute(types) as TSchema[]
  const result = Broaden(distribution)
  return result as never
}
// ------------------------------------------------------------------
// EvaluateUnion
// ------------------------------------------------------------------
export type TEvaluateUnion<Types extends TSchema[],
  Result extends TSchema = TBroaden<Types>
> = Result
export function EvaluateUnion<Types extends TSchema[]>(types: [...Types]): TEvaluateUnion<Types> {
  const result = Broaden(types)
  return result
}
// ------------------------------------------------------------------
// EvaluateType
// ------------------------------------------------------------------
export type TEvaluateType<Type extends TSchema,
  Result extends TSchema = (
    Type extends TIntersect<infer Types extends TSchema[]> ? TEvaluateIntersect<Types> :
    Type extends TUnion<infer Types extends TSchema[]> ? TEvaluateUnion<Types> :
    Type
  )
> = Result
export function EvaluateType<Type extends TSchema>(type: Type): TEvaluateType<Type> {
  return (
    IsIntersect(type) ? EvaluateIntersect(type.allOf) :
    IsUnion(type) ? EvaluateUnion(type.anyOf) :
    type
  ) as never
}
