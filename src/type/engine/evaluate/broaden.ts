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
import { type TAny, IsAny } from '../../types/any.ts'
import { type TNever, IsNever } from '../../types/never.ts'
import { type TObject, IsObject } from '../../types/object.ts'
import { type TUnknown, IsUnknown } from '../../types/unknown.ts'

import { type TCompare, Compare, CompareResultLeftInside, CompareResultEqual, CompareResultDisjoint } from './compare.ts'
import { type TFlatten, Flatten } from './flatten.ts'
import { type TEvaluateType, EvaluateType } from './evaluate.ts'

// ------------------------------------------------------------------
// BroadenFilter
//
// Compares Type against each element of Types. If an existing element
// already subsumes Type, Type is discarded and the original list is
// returned untouched. Otherwise, any existing element that Type
// subsumes is dropped, and Type is appended to what remains.
//
// ------------------------------------------------------------------
type TBroadenFilter<Type extends TSchema, Types extends TSchema[], Result extends TSchema[] = [], All extends TSchema[] = Types> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TCompare<Type, Left> extends typeof CompareResultLeftInside | typeof CompareResultEqual
      ? All // Left in set. Return original All set.
      : TCompare<Type, Left> extends typeof CompareResultDisjoint
        ? TBroadenFilter<Type, Right, [...Result, Left], All> // Left is disjoint, keep it
        : TBroadenFilter<Type, Right, Result, All> // Left in Type, drop it
    : [...Result, Type] // Type broadest in set
)
function BroadenFilter<Type extends TSchema, Types extends TSchema[]>
  (type: Type, types: [...Types], result: TSchema[] = [], all: TSchema[] = types): TBroadenFilter<Type, Types> {
  return Guard.ShiftLeft(types, (left, right) => {
    const compare = Compare(type, left)
    return (
      (Guard.IsEqual(compare, CompareResultLeftInside) || Guard.IsEqual(compare, CompareResultEqual))
        ? all // Left in set. Return original All set.
        : Guard.IsEqual(compare, CompareResultDisjoint)
          ? BroadenFilter(type, right, [...result, left], all) // Left is disjoint, keep it
          : BroadenFilter(type, right, result, all) // Left in Type, drop it
    )
  }, () => [...result, type]) as never // Type broadest in set
}
// ------------------------------------------------------------------
// BroadenType
//
// Evaluates a single Type and folds it into the accumulated Result,
// then continues on to the remaining Types. Any and Unknown terminate
// immediately: both are top types that dominate every other type
// unconditionally, so the remaining Types and Result are discarded
// outright rather than compared.
//
// TObject is pushed into Result without comparison, since comparing
// objects is currently too expensive.
//
// (revise-candidate-fast-path-property-sets)
//
// ------------------------------------------------------------------
type TBroadenType<Type extends TSchema, Types extends TSchema[], Result extends TSchema[],
  Evaluated extends TSchema = TEvaluateType<Type>
> = (
  Evaluated extends TAny ? [Evaluated] : // terminate (always the most broad)
  Evaluated extends TUnknown ? [Evaluated] : // terminate (always the most broad)
  Evaluated extends TNever ? TBroadenTypes<Types, Result> : // ignored: never is dropped
  Evaluated extends TObject ? TBroadenTypes<Types, [...Result, Evaluated]> : // objects are always considered (too expensive to compare)
  TBroadenTypes<Types, TBroadenFilter<Evaluated, Result>>
)
function BroadenType<Type extends TSchema, Types extends TSchema[], Result extends TSchema[]>
  (type: Type, types: [...Types], result: [...Result]): TBroadenType<Type, Types, Result> {
  const evaluated = EvaluateType(type)
  return (
    IsAny(evaluated) ? [evaluated] : // terminate (always the most broad)
    IsUnknown(evaluated) ? [evaluated] : // terminate (always the most broad)
    IsNever(evaluated) ? BroadenTypes(types, result) :  // ignored: never is dropped
    IsObject(evaluated) ? BroadenTypes(types, [...result, evaluated]) : // objects are always considered (too expensive to compare)
    BroadenTypes(types, BroadenFilter(evaluated, result))
  ) as never
}
// ------------------------------------------------------------------
// BroadenTypes
//
// Folds a list of Types into their broadest set. Each element is
// handed to BroadenType along with the remaining list and the
// accumulator, so BroadenType decides how iteration continues.
//
// ------------------------------------------------------------------
type TBroadenTypes<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TBroadenType<Left, Right, Result>
    : Result
)
function BroadenTypes<Types extends TSchema[]>(types: [...Types], result: TSchema[] = []): TBroadenTypes<Types> {
  return Guard.ShiftLeft(types, (left, right) => (
    BroadenType(left, right, result)
  ), () => result) as never
}
// ------------------------------------------------------------------
// Broaden
// ------------------------------------------------------------------
export type TBroaden<Types extends TSchema[],
  Broadened extends TSchema[] = TBroadenTypes<Types>,
  Flattened extends TSchema[] = TFlatten<Broadened>,
> = Flattened
/** Broadens a set of types and returns either the most broad type, or union or disjoint types. */
export function Broaden<Types extends TSchema[]>(types: [...Types]): TBroaden<Types> {
  const broadened = BroadenTypes(types) as TSchema[]
  const flattened = Flatten(broadened) as TSchema[]
  return flattened as never
}