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
import { type TSchema, IsSchema } from '../../types/schema.ts'
import { type TAny, IsAny } from '../../types/any.ts'
import { type TNever, Never } from '../../types/never.ts'
import { type TObject, IsObject } from '../../types/object.ts'
import { type TUnion, Union } from '../../types/union.ts'
import { type TCompare, type TCompareResult, Compare, ResultRightInside, ResultLeftInside, ResultEqual } from './compare.ts'
import { type TFlatten, Flatten } from './flatten.ts'

import { type TEvaluateType, EvaluateType } from './evaluate.ts'

// ------------------------------------------------------------------
// BroadFilter
//
// BroadFilter iterates through a list of types and removes any 
// that are less broad than a given reference type. It ensures that 
// only the most generalized types remain.
//
// ------------------------------------------------------------------
type TBroadFilter<Type extends TSchema, Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? TCompare<Type, Left> extends typeof ResultRightInside
    ? TBroadFilter<Type, Right, [...Result]>
      : TBroadFilter<Type, Right, [...Result, Left]>
      : Result
)
function BroadFilter(type: TSchema, types: TSchema[]): TSchema[] {
  return types.filter(left => {
    return (Compare(type, left) as TCompareResult) === ResultRightInside
      ? false 
      : true
  })
}
// ------------------------------------------------------------------
// GuardBroadestType
//
// Tests if the given Type is broader than those in Types.
// ------------------------------------------------------------------
type TIsBroadestType<Type extends TSchema, Types extends TSchema[]> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TCompare<Type, Left> extends typeof ResultLeftInside | typeof ResultEqual
      ? false
      : TIsBroadestType<Type, Right>
    : true
)
function IsBroadestType(type: TSchema, types: TSchema[]): boolean {
  const result = types.some(left => {
    const result = Compare(type, left)
    return Guard.IsEqual(result, ResultLeftInside) || Guard.IsEqual(result, ResultEqual)
  })
  return Guard.IsEqual(result, false)
}
// ------------------------------------------------------------------
// BroadenType
//
// This function attempts to push the given Type into the broadest
// set if the type is either disjoint, or more broad than an existing
// element in the set. This function is not called for TObject types,
// see special catch in TBroadenTypes.
//
// ------------------------------------------------------------------
type TBroadenType<Type extends TSchema, Types extends TSchema[],
  Evaluated extends TSchema = TEvaluateType<Type>,
  Result extends TSchema[] = (
    Evaluated extends TAny ? [Evaluated] :
    TIsBroadestType<Evaluated, Types> extends true
      ? [...TBroadFilter<Evaluated, Types>, Evaluated]
      : Types
  )
> = Result
function BroadenType<Type extends TSchema, Types extends TSchema[]>(type: Type, types: [...Types]): TBroadenType<Type, Types> {
  const evaluated = EvaluateType(type)
  return (
    IsAny(evaluated) ? [evaluated] :
    IsBroadestType(evaluated, types) 
      ? [...BroadFilter(evaluated, types), evaluated]
      : types
  ) as never
}
// ------------------------------------------------------------------
// BroadenTypes
//
// This function attempts to broaden an array of types. We only 
// broaden for logical and scalar types, but not Object types. 
// TypeScript doesn't appear to do this, so we don't either.
//
// ------------------------------------------------------------------
type TBroadenTypes<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? Left extends TObject
      ? TBroadenTypes<Right, [...Result, Left]> // special: push object types
      : TBroadenTypes<Right, TBroadenType<Left, Result>>
    : Result
)
function BroadenTypes<Types extends TSchema[]>(types: [...Types], result: TSchema[] = []): TBroadenTypes<Types> {
  const [left, ...right] = types
  return (
    IsSchema(left)
      ? IsObject(left)
        ? BroadenTypes(right, [...result, left]) // special: push object type
        : BroadenTypes(right, BroadenType(left, result))
      : result
    ) as never
}
// ------------------------------------------------------------------
// Broaden
// ------------------------------------------------------------------
export type TBroaden<Types extends TSchema[],
  Broadened extends TSchema[] = TBroadenTypes<Types>,
  Flattened extends TSchema[] = TFlatten<Broadened>,
  Result extends TSchema = ( 
    Flattened extends [] ? TNever :
    Flattened extends [infer Type extends TSchema] ? Type :
    TUnion<Flattened>
  )
> = Result
/** Broadens a set of types and returns either the most broad type, or union or disjoint types. */
export function Broaden<Types extends TSchema[]>(types: [...Types]): TBroaden<Types> {
  const broadened = BroadenTypes(types) as TSchema[]
  const flattened = Flatten(broadened) as TSchema[]
  const result = (
    flattened.length === 0 ? Never() :
    flattened.length === 1 ? flattened[0] :
    Union(flattened)
  )
  return result as never
}

