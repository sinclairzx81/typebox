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
import { type TInfer, IsInfer } from '../../types/infer.ts'
import { type TNever, Never } from '../../types/never.ts'
import { type TRest, IsRest } from '../../types/rest.ts'
import { type TRef, IsRef } from '../../types/ref.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'

// ------------------------------------------------------------------
// SpreadElement
//
// Handles the spread behavior for a Tuple with embedded Rest.
//
// TRest<TTuple<[...]>>    We spread this immediately 
// 
// TRest<TInfer<...>>      This does not spread, rather it is procesed
//                         via the Extends inference system.
//
// TRest<TRef<'A'>>        Cannot perform an operation if the target
//                         type is unknown. We re-encode and trust the
//                         TInstantiate will instance the type when the
//                         target becomes available on a Context.
//
//
// ------------------------------------------------------------------
type TSpreadElement<Type extends TSchema,
  Result extends TSchema[] = (
    Type extends TRest<infer Rest extends TSchema> ? (
      Rest extends TTuple<infer Elements extends TSchema[]> ? TRestSpread<Elements> : 
      Rest extends TInfer<string, TSchema> ? [Type] :
      Rest extends TRef<string> ? [Type] :
      [TNever]
    ) : [Type]
  )
> = Result
function SpreadElement<Type extends TSchema>(type: Type): TSpreadElement<Type> {
  const result = (
    IsRest(type) ? (
      IsTuple(type.items) ? RestSpread(type.items.items) :
      IsInfer(type.items) ? [type] :
      IsRef(type.items) ? [type] :
      [Never()]
    ) : [type]
  )
  return result as never
}
// ------------------------------------------------------------------
// RestSpread
// ------------------------------------------------------------------
export type TRestSpread<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TRestSpread<Right, [...Result, ...TSpreadElement<Left>]>
    : Result
)
export function RestSpread<Types extends TSchema[]>(types: [...Types]): TRestSpread<Types> {
  const result = types.reduce((result, left) => {
    return [...result, ...SpreadElement(left)]
  }, [] as TSchema[]) as never
  return result as never
}