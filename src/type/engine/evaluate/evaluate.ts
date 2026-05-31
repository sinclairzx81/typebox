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

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TIfThenElse, IsIfThenElse } from '../../types/if_then_else.ts'
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TUnion, Union, IsUnion } from '../../types/union.ts'
import { type TNever, Never } from '../../types/never.ts'

import { type TDistribute, Distribute } from './distribute.ts'
import { type TBroaden, Broaden } from './broaden.ts'
import { type TExcludeAction, ExcludeAction } from '../exclude/index.ts'

// ------------------------------------------------------------------
// EvaluateIfThenElse
// ------------------------------------------------------------------
export type TEvaluateIfThenElse<If extends TSchema, Then extends TSchema, Else extends TSchema,
  Left extends TSchema = TEvaluateIntersect<[If, Then]>,
  Right extends TSchema = TEvaluateType<TExcludeAction<Else, Left>>,
  Result extends TSchema = TEvaluateUnion<[Left, Right]>
> = Result
export function EvaluateIfThenElse<If extends TSchema, Then extends TSchema, Else extends TSchema>
  (if_: If, then_: Then, else_: Else): TEvaluateIfThenElse<If, Then, Else> {
  const left = EvaluateIntersect([if_, then_])
  const right = EvaluateType(ExcludeAction(else_, left, {}))
  const result = EvaluateUnion([left, right])
  return result as never
}
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
    Type extends TIfThenElse<infer If extends TSchema, infer Then extends TSchema, infer Else extends TSchema> ? TEvaluateIfThenElse<If, Then, Else> :
    Type extends TIntersect<infer Types extends TSchema[]> ? TEvaluateIntersect<Types> :
    Type extends TUnion<infer Types extends TSchema[]> ? TEvaluateUnion<Types> :
    Type
  )
> = Result
export function EvaluateType<Type extends TSchema>(type: Type): TEvaluateType<Type> {
  return (
    IsIfThenElse(type) ? EvaluateIfThenElse(type.if, type.then, type.else) :
    IsIntersect(type) ? EvaluateIntersect(type.allOf) :
    IsUnion(type) ? EvaluateUnion(type.anyOf) :
    type
  ) as never
}
// ------------------------------------------------------------------
// EvaluateUnionFast
//
// Evaluates a union using a fast path. This evaluation assumes
// all constituent types are already distinct and therefore skips
// any broadening or deduplication steps. This assumption holds
// for property keys in TProperties and tuple indices of TTuple.
//
// ------------------------------------------------------------------
export type TEvaluateUnionFast<Types extends TSchema[],
  Result extends TSchema = (
    Types extends [infer Type extends TSchema] ? Type :
    Types extends [] ? TNever :
    TUnion<Types>
  )
> = Result
export function EvaluateUnionFast<Types extends TSchema[]>(types: [...Types]): TEvaluateUnionFast<Types> {
  const result = (
    Guard.IsEqual(types.length, 1) ? types[0] :
    Guard.IsEqual(types.length, 0) ? Never() :
    Union(types)
  )
  return result as never
}