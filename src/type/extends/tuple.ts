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

import { Guard } from '../../guard/index.ts'
import { type TSchema, IsSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TArray, IsArray } from '../types/array.ts'
import { type TTuple, IsTuple, Tuple } from '../types/tuple.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'
import { type TExtendsRight, ExtendsRight } from './extends-right.ts'
import * as Result from './result.ts'

import { type TInstantiateElements, InstantiateElements } from '../engine/instantiate.ts'

// ----------------------------------------------------------------------------
// Inference
// ----------------------------------------------------------------------------
import {
  type TTryRestInferable, TryRestInferable,
  type TTryInferable, TryInferable,
  type TInferable, IsInferable,
  type TInferTupleResult, InferTupleResult,
  type TInferUnionResult, InferUnionResult
} from './inference.ts'

// ----------------------------------------------------------------------------
// TReverse
//
// Reverses a tuple sequence.
//
// This type recursively reverses a tuple, allowing support for right-to-left
// destructuring when handling Rest inference during tuple matching.
//
// ----------------------------------------------------------------------------
type TReverse<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TReverse<Right, [Left, ...Result]>
    : Result
)
function Reverse<Types extends TSchema[]>(types: [...Types]): TReverse<Types> {
  return [...types].reverse() as never
}
// ----------------------------------------------------------------------------
// ApplyReverse
//
// Conditionally applies tuple reversal.
//
// Applies TReverse to a tuple only if the `Reversed` flag is true.
//
// ----------------------------------------------------------------------------
type TApplyReverse<Types extends TSchema[], Reversed extends boolean> 
  = Reversed extends true ? TReverse<Types> : Types

function ApplyReverse<Types extends TSchema[], Reversed extends boolean>(types: [...Types], reversed: Reversed): TApplyReverse<Types, Reversed> {
  return (reversed ? Reverse(types): types) as never
}
// ----------------------------------------------------------------------------
// Reversed
//
// Detects whether reversal is required based on the first element.
//
// If the first tuple element contains an inferrable Rest, reversal is needed 
// to correctly perform right-to-left tuple matching.
//
// ----------------------------------------------------------------------------
type TReversed<Types extends TSchema[],
  First extends TSchema | undefined = Types extends [infer Left extends TSchema, ...infer _ extends TSchema[]] ? Left : undefined,
  Inferable extends TSchema | undefined = First extends TSchema ? TTryRestInferable<First> : undefined,
  Result extends boolean = Inferable extends TSchema ? true : false
> =  Result

function Reversed<Types extends TSchema[]>(types: [...Types]): TReversed<Types> {
  const first = types.length > 0 ? types[0] : undefined
  const inferrable = IsSchema(first) ? TryRestInferable(first) : undefined
  return IsSchema(inferrable) as never
}
// ------------------------------------------------------------------
// ElementsCompare
//
// Compares elements and Terminates if not match. Otherwise return
// to TElements with the Left and Right Rest elements.
//
// ------------------------------------------------------------------
type TElementsCompare<Inferred extends TProperties, Reversed extends boolean, Left extends TSchema, LeftRest extends TSchema[], Right extends TSchema, RightRest extends TSchema[]> = (
  TExtendsLeft<Inferred, Left, Right> extends Result.TExtendsTrueLike<infer CheckInferred extends TProperties>
    ? TElements<CheckInferred, Reversed, LeftRest, RightRest>
    : Result.TExtendsFalse // 'left-and-right-not-compared'
)
function ElementsCompare<Inferred extends TProperties, Reversed extends boolean, Left extends TSchema, LeftRest extends TSchema[], Right extends TSchema, RightRest extends TSchema[]>
  (inferred: Inferred, reversed: Reversed, left: Left, leftRest: [...LeftRest], right: Right, rightRest: [...RightRest]): 
    TElementsCompare<Inferred, Reversed, Left, LeftRest, Right, RightRest> {
  const check = ExtendsLeft(inferred, left, right) as unknown
  return (
    Result.IsExtendsTrueLike(check)
      ? Elements(check.inferred, reversed, leftRest, rightRest)
      : Result.ExtendsFalse() // 'left-and-right-not-compared'
  ) as never
}
// ------------------------------------------------------------------
// ElementsLeft
//
// Processes the remaining elements on the Left-hand side.
// 
// Begins with the assumption that the Left sequence has zero or more elements.
// First, it checks if the current Right element is Inferrable. If so, the function 
// delegates to TInferTupleResult to infer and spread the remaining Left elements.
// Otherwise, it attempts to destructure the Left sequence. If Left is empty, 
// the matching fails and the sequence terminates.
// 
// ------------------------------------------------------------------
type TElementsLeft<Inferred extends TProperties, Reversed extends boolean, LeftRest extends TSchema[], Right extends TSchema, RightRest extends TSchema[],
  Inferable extends TInferable | undefined = TTryRestInferable<Right>
> = (
  // Rest Inferrable Right Means we delegate to TInferTupleResult to Generate a Result
  Inferable extends TInferable<infer Name extends string, infer Type extends TSchema> 
    ? TInferTupleResult<Inferred, Name, TApplyReverse<LeftRest, Reversed>, Type> 
    : LeftRest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
      ? TElementsCompare<Inferred, Reversed, Head, Tail, Right, RightRest>
      : Result.TExtendsFalse // 'left-was-empty'
)
function ElementsLeft<Inferred extends TProperties, Reversed extends boolean, LeftRest extends TSchema[], Right extends TSchema, RightRest extends TSchema[]>
  (inferred: Inferred, reversed: Reversed, leftRest: [...LeftRest], right: Right, rightRest: [...RightRest]): 
    TElementsLeft<Inferred, Reversed, LeftRest, Right, RightRest> {
  const inferable = TryRestInferable(right) as unknown
  return (
    IsInferable(inferable)
      ? InferTupleResult(inferred, inferable.name, ApplyReverse(leftRest, reversed), inferable.type)
      : (() => {
        const [head, ...tail] = leftRest
        return IsSchema(head)
          ? ElementsCompare(inferred, reversed, head, tail, right, rightRest)
          : Result.ExtendsFalse()
      })()
  ) as never
}
// ------------------------------------------------------------------
// ElementsRight
//
// Processes the elements on the Right-hand side.
//
// Destructures the Right sequence and dispatches to ElementsLeft.
//
// - If a Right element exists, ElementsLeft is called to continue matching.
// - If the Right sequence is empty:
//    - If Left is also empty, the match is successful.
//    - If Left still has remaining elements, the match fails.
//
// This ensures that all Left and Right elements must be fully consumed 
// for a match to succeed.
//
// ------------------------------------------------------------------
type TElementsRight<Inferred extends TProperties, Reversed extends boolean, LeftRest extends TSchema[], RightRest extends TSchema[]> = (
  RightRest extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TElementsLeft<Inferred, Reversed, LeftRest, Head, Tail>
    : LeftRest['length'] extends 0 
      ? Result.TExtendsTrue<Inferred> // 'Ok: right-empty-and-left-empty'
      : Result.TExtendsFalse          // 'Fail: right-empty-and-left-not-empty'
)
function ElementsRight<Inferred extends TProperties, Reversed extends boolean, LeftRest extends TSchema[], RightRest extends TSchema[]>
  (inferred: Inferred, reversed: Reversed, leftRest: [...LeftRest], rightRest: [...RightRest]):
    TElementsRight<Inferred, Reversed, LeftRest, RightRest> {
  const [head, ...tail] = rightRest
  return (
    IsSchema(head)
      ? ElementsLeft(inferred, reversed, leftRest, head, tail)
      : Guard.IsEqual(leftRest.length, 0)
        ? Result.ExtendsTrue(inferred) // 'Ok: right-empty-and-left-empty'
        : Result.ExtendsFalse()        // 'Fail: right-empty-and-left-not-empty'
  ) as never
}
// ------------------------------------------------------------------
// Elements
// ------------------------------------------------------------------
type TElements<Inferred extends TProperties, Reversed extends boolean, LeftRest extends TSchema[], RightRest extends TSchema[]> = 
  TElementsRight<Inferred, Reversed, LeftRest, RightRest>
function Elements<Inferred extends TProperties, Reversed extends boolean, LeftRest extends TSchema[], RightRest extends TSchema[]>
  (inferred: Inferred, reversed: Reversed, leftRest: [...LeftRest], rightRest: [...RightRest]): 
    TElements<Inferred, Reversed, LeftRest, RightRest> {
  return ElementsRight(inferred, reversed, leftRest, rightRest) as never
}
// ----------------------------------------------------------------------------
// ExtendsTupleToTuple
// ----------------------------------------------------------------------------
type TExtendsTupleToTuple<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[],
  InstantiatedRight extends TSchema[] = TInstantiateElements<Inferred, { callstack: [] }, Right>,
  Reversed extends boolean = TReversed<InstantiatedRight>,
> =  TElements<Inferred, Reversed, TApplyReverse<Left, Reversed>, TApplyReverse<InstantiatedRight, Reversed>>

function ExtendsTupleToTuple<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema[]>
  (inferred: Inferred, left: [...Left], right: [...Right]): 
    TExtendsTupleToTuple<Inferred, Left, Right> {
  const instantiatedRight = InstantiateElements(inferred, { callstack: [] }, right) as TSchema[]
  const reversed = Reversed(instantiatedRight)
  return Elements(inferred, reversed, ApplyReverse(left, reversed), ApplyReverse(instantiatedRight, reversed)) as never
}
// ----------------------------------------------------------------------------
// ExtendsTupleToArray
// ----------------------------------------------------------------------------
type TExtendsTupleToArray<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema,
  Inferrable extends TInferable | undefined = TTryInferable<Right>
> = (
  Inferrable extends TInferable<infer Name extends string, infer Type extends TSchema>
    ? TInferUnionResult<Inferred, Name, Left, Type>
  : Left extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TExtendsLeft<Inferred, Head, Right> extends Result.TExtendsTrueLike<infer Inferred extends TProperties>
      ? TExtendsTupleToArray<Inferred, Tail, Right>
      : Result.TExtendsFalse
    : Result.TExtendsTrue<Inferred>
)
function ExtendsTupleToArray<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema>
  (inferred: Inferred, left: [...Left], right: Right): 
    TExtendsTupleToArray<Inferred, Left, Right> {
  const inferrable = TryInferable(right) as unknown
  return (
    IsInferable(inferrable)
      // @ts-ignore 4.9.5 fails to see `type` property on inferrable
      ? InferUnionResult(inferred, inferrable.name, left, inferrable.type)
      : (() => {
        const [head, ...tail] = left
        return IsSchema(head)
          ? (() => {
            const check = ExtendsLeft(inferred, head, right)
            return Result.IsExtendsTrueLike(check)
              ? ExtendsTupleToArray(check.inferred, tail, right)
              : Result.ExtendsFalse()
          })()
          : Result.ExtendsTrue(inferred)
      })()
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsTuple
// ----------------------------------------------------------------------------
export type TExtendsTuple<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema,
  InstantiatedLeft extends TSchema[] = TInstantiateElements<Inferred, { callstack: [] }, Left>
> = (
  Right extends TTuple<infer Types extends TSchema[]> ? TExtendsTupleToTuple<Inferred, InstantiatedLeft, Types> :
  Right extends TArray<infer Type extends TSchema> ? TExtendsTupleToArray<Inferred, InstantiatedLeft, Type> :
  TExtendsRight<Inferred, TTuple<InstantiatedLeft>, Right>
)
export function ExtendsTuple<Inferred extends TProperties, Left extends TSchema[], Right extends TSchema>(inferred: Inferred, left: Left, right: Right): TExtendsTuple<Inferred, Left, Right> {
  const instantiatedLeft = InstantiateElements(inferred, { callstack: [] }, left)
  return (
    IsTuple(right) ? ExtendsTupleToTuple(inferred, instantiatedLeft, right.items) :
    IsArray(right) ? ExtendsTupleToArray(inferred, instantiatedLeft, right.items) :
    ExtendsRight(inferred, Tuple(instantiatedLeft), right)    
  ) as never
}
