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

import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TDeferred, IsDeferred } from '../../types/deferred.ts'
import { type TRef, IsRef } from '../../types/ref.ts'
import { type TParameter } from '../../types/parameter.ts'

// ------------------------------------------------------------------
// CollectDistributionNames
//
// Extracts TRef names from distributive positions:
//
// 1. Conditional: The 'Left' operand (recursing into both branches).
// 2. Mapped: The 'Type' position, specifically when the type is a 
//    Deferred<'KeyOf', TRef<'...'>> expression.
//
// ------------------------------------------------------------------
type TCollectDistributionNames<Expression extends TSchema, Result extends string[] = []> = (
  // Conditional
  Expression extends TDeferred<'Conditional', [infer Left extends TSchema, infer _Right extends TSchema, infer True extends TSchema, infer False extends TSchema]>
    ? Left extends TRef
      ? TCollectDistributionNames<True, TCollectDistributionNames<False, [...Result, Left['$ref']]>>
      : TCollectDistributionNames<True, TCollectDistributionNames<False, Result>>
  // Mapped
  : Expression extends TDeferred<'Mapped', [infer _Identifier extends TSchema, infer Type extends TSchema, infer _As extends TSchema, infer _Property extends TSchema]>
    ? (
      Type extends TDeferred<'KeyOf', [infer Ref extends TRef]> ? [...Result, Ref['$ref']] :
      Result
    ) : Result
)
function CollectDistributionNames<Expression extends TSchema>(expression: Expression, result: string[] = []): TCollectDistributionNames<Expression> {
  return (
    // Conditional
    IsDeferred(expression) && Guard.IsEqual(expression.action, 'Conditional')
      ? IsRef(expression.parameters[0])
        ? CollectDistributionNames(expression.parameters[2], CollectDistributionNames(expression.parameters[3], [...result, expression.parameters[0]['$ref']]))
        : CollectDistributionNames(expression.parameters[2], CollectDistributionNames(expression.parameters[3], result))
    // Mapped
    : IsDeferred(expression) && Guard.IsEqual(expression.action, 'Mapped')
      ? (
        IsDeferred(expression.parameters[1]) && Guard.IsEqual(expression.parameters[1].action, 'KeyOf') && IsRef(expression.parameters[1].parameters[0]) ? [...result, expression.parameters[1].parameters[0]['$ref']] :
        result
      ) : result
  ) as never
}
// ------------------------------------------------------------------
// BuildDistributionArray
//
// Constructs a boolean[] with one entry per parameter, where each
// element is true if that parameter's name appears in Names (i.e.
// was collected as a distributive TRef), and false otherwise.
//
// ------------------------------------------------------------------
type TBuildDistributionArray<Parameters extends TParameter[], Names extends string[], Result extends boolean[] = []> = (
  Parameters extends [infer Left extends TParameter, ...infer Right extends TParameter[]]
  ? Left['name'] extends Names[number]
  ? TBuildDistributionArray<Right, Names, [...Result, true]>
  : TBuildDistributionArray<Right, Names, [...Result, false]>
  : Result
)
function BuildDistributionArray<Parameters extends TParameter[], Names extends string[]>
  (parameters: [...Parameters], names: [...Names]): TBuildDistributionArray<Parameters, Names> {
  return parameters.reduce((result, left) =>
    [...result, names.includes(left.name)]
    , [] as boolean[]) as never
}
// ------------------------------------------------------------------
// ZipDistributionArray
//
// Zips Arguments and DistributionArray into paired [boolean, TSchema]
// tuples, terminating if either array is exhausted. Length mismatches
// are handled downstream by ResolveArguments during the
// Parameter/Context binding phase.
//
// ------------------------------------------------------------------
type TZipDistributionArray<Arguments extends TSchema[], DistributionArray extends boolean[], Result extends [boolean, TSchema][] = []> = (
  Arguments extends [infer ArgumentLeft extends TSchema, ...infer ArgumentRight extends TSchema[]]
    ? DistributionArray extends [infer BooleanLeft extends boolean, ...infer BooleanRight extends boolean[]]
      ? TZipDistributionArray<ArgumentRight, BooleanRight, [...Result, [BooleanLeft, ArgumentLeft]]>
      : Result
    : Result
)
function ZipDistributionArray<Arguments extends TSchema[], DistributionArray extends boolean[]>
  (arguments_: [...Arguments], distributionArray: [...DistributionArray], result: [boolean, TSchema][] = []):
  TZipDistributionArray<Arguments, DistributionArray> {
  const [argumentLeft, ...argumentRight] = arguments_
  const [booleanLeft, ...booleanRight] = distributionArray
  return (
    Guard.IsGreaterThan(arguments_.length, 0)
      ? Guard.IsGreaterThan(distributionArray.length, 0)
        ? ZipDistributionArray(argumentRight as never, booleanRight as never, [...result, [booleanLeft, argumentLeft]])
        : result
      : result
  ) as never
}
// ------------------------------------------------------------------
// Expand
// ------------------------------------------------------------------
type TExpand<Type extends TSchema> = (
  Type extends TUnion<infer Types extends TSchema[]>
  ? [...Types]
  : [Type]
)
function Expand<Argument extends TSchema>(type: Argument): TExpand<Argument> {
  return (
    IsUnion(type)
      ? [...type.anyOf]
      : [type]
  ) as never
}
// ------------------------------------------------------------------
// Append
// ------------------------------------------------------------------
type TAppend<Current extends TSchema[][], Type extends TSchema, Result extends TSchema[][] = []> = (
  Current extends [infer Left extends TSchema[], ...infer Right extends TSchema[][]]
  ? TAppend<Right, Type, [...Result, [...Left, Type]]>
  : Result
)
function Append<Current extends TSchema[][], Type extends TSchema>(current: [...Current], type: Type): TAppend<Current, Type> {
  return current.reduce((result, left) =>
    [...result, [...left, type]]
    , [] as TSchema[][]) as never
}
// ------------------------------------------------------------------
// Cross
// ------------------------------------------------------------------
type TCross<Current extends TSchema[][], Variants extends TSchema[], Result extends TSchema[][] = []> = (
  Variants extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? TCross<Current, Right, [...Result, ...TAppend<Current, Left>]>
  : Result
)
function Cross<Current extends TSchema[][], Variants extends TSchema[]>
  (current: [...Current], variants: [...Variants]):
  TCross<Current, Variants> {
  return variants.reduce((result, left) => {
    return [...result, ...Append(current, left)]
  }, [] as TSchema[][]) as never
}
// -----------------------------------------------------------------------
// Distribute
// -----------------------------------------------------------------------
type TDistribute<ZippedArguments extends [boolean, TSchema][], Result extends TSchema[][] = [[]]> = (
  ZippedArguments extends [infer Left extends [boolean, TSchema], ...infer Right extends [boolean, TSchema][]]
  ? Left[0] extends true
  ? TDistribute<Right, TCross<Result, TExpand<Left[1]>>>
  : TDistribute<Right, TCross<Result, [Left[1]]>> // - no-expansion
  : Result
)
function Distribute<ZippedArguments extends [boolean, TSchema][]>
  (zipped: [...ZippedArguments]):
  TDistribute<ZippedArguments> {
  return zipped.reduce((result, left) => {
    return Guard.IsEqual(left[0], true)
      ? Cross(result, Expand(left[1]))
      : Cross(result, [left[1]]) // - no-expansion
  }, [[]] as TSchema[][]) as never
}
// -----------------------------------------------------------------------
// DistributeArguments
// -----------------------------------------------------------------------
export type TDistributeArguments<Parameters extends TParameter[], Arguments extends TSchema[], Expression extends TSchema,
  DistributionNames extends string[] = TCollectDistributionNames<Expression>,
  DistributionArray extends boolean[] = TBuildDistributionArray<Parameters, DistributionNames>,
  ZippedArguments extends [boolean, TSchema][] = TZipDistributionArray<Arguments, DistributionArray>,
  Result extends TSchema[][] = (
    Expression extends TDeferred<'Conditional', TSchema[]>
      ? TDistribute<ZippedArguments>
      : Expression extends TDeferred<'Mapped', TSchema[]>
        ? TDistribute<ZippedArguments>
        : [Arguments]
  )> = Result
export function DistributeArguments<Parameters extends TParameter[], Arguments extends TSchema[], Expression extends TSchema>
  (parameters: [...Parameters], arguments_: [...Arguments], expression: Expression):
  TDistributeArguments<Parameters, Arguments, Expression> {
  const distributionNames = CollectDistributionNames(expression) as string[]
  const distributionArray = BuildDistributionArray(parameters, distributionNames) as boolean[]
  const zippedArguments = ZipDistributionArray(arguments_, distributionArray)
  return (
    IsDeferred(expression) && Guard.IsEqual(expression.action, 'Conditional')
      ? Distribute(zippedArguments)
      : IsDeferred(expression) && Guard.IsEqual(expression.action, 'Mapped')
        ? Distribute(zippedArguments)
        : [arguments_]
  ) as never
}