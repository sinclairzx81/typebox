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

import { TSchema } from '../../types/schema.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

// ------------------------------------------------------------------
// FlattenType
// ------------------------------------------------------------------
type TFlattenType<Type extends TSchema,
  Result extends TSchema[] = Type extends TUnion<infer Types extends TSchema[]> ? TFlatten<Types> : [Type]
> = Result
function FlattenType<Type extends TSchema>(type: Type): TFlattenType<Type> {
  const result = IsUnion(type) ? Flatten(type.anyOf) : [type]
  return result as never
}
// ------------------------------------------------------------------
//
// Flatten
//
// This function flattens union types from the provided types array. 
// It is primarily used by TBroaden, but also by various remote system 
// types that need to process union-like structures without evaluation. 
// Both TEvaluate and TFlatten flatten unions, but TEvaluate can be 
// significantly more expensive to execute. For example, it's often too 
// costly when deriving keys for TRecordOrObject.
//
// ------------------------------------------------------------------
export type TFlatten<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFlatten<Right, [...Result, ...TFlattenType<Left>]>
    : Result
)
export function Flatten<Types extends TSchema[]>(types: [...Types]): TFlatten<Types> {
  return types.reduce((result: TSchema[], type) => {
    return [...result, ...FlattenType(type)]
  }, [] as TSchema[]) as never
}
