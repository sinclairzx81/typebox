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

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../../types/enum.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'

import { type TExtends, Extends, ExtendsResult } from '../../extends/index.ts'
import { type TEnumValuesToVariants, EnumValuesToVariants } from '../enum/index.ts'
import { type TEvaluateUnion, type TFlatten, EvaluateUnion, Flatten } from '../evaluate/index.ts'
import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'
import { type TExtractDeferred, ExtractDeferred } from '../../action/extract.ts'

// ------------------------------------------------------------------
// ExtractUnion
// ------------------------------------------------------------------
type TExtractUnion<Types extends TSchema[], Right extends TSchema, Result extends TSchema[] = []> = (
  Types extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TExtractUnion<Tail, Right, [...Result, ...TExtractType<Head, Right>]>
    : Result
)
function ExtractUnion<Types extends TSchema[], Right extends TSchema>(types: [...Types], right: Right): TExtractUnion<Types, Right> {
  return types.reduce((result, head) => {
    return [...result, ...ExtractType(head, right)]
  }, [] as TSchema[]) as never
}
// ------------------------------------------------------------------
// ExtractType
// ------------------------------------------------------------------
type TExtractType<Left extends TSchema, Right extends TSchema,
  Check extends ExtendsResult.TResult = TExtends<{}, Left, Right>,
  Result extends TSchema[] = Check extends ExtendsResult.TExtendsTrueLike<infer _> ? [Left] : []
> = Result
function ExtractType<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExtractType<Left, Right> {
  const check = Extends({}, left, right)
  const result = ExtendsResult.IsExtendsTrueLike(check) ? [left] : []
  return result as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
type TExtractAction<Left extends TSchema, Right extends TSchema,
  Remaining extends TSchema[] = (
    Left extends TEnum<infer Values extends TEnumValue[]> ? TExtractUnion<TEnumValuesToVariants<Values>, Right> : 
    Left extends TUnion<infer Types extends TSchema[]> ? TExtractUnion<TFlatten<Types>, Right> : 
    TExtractType<Left, Right>
  ),
  Result extends TSchema = TEvaluateUnion<Remaining>
> = Result
function ExtractAction<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExtractAction<Left, Right> {
  const remaining = (
    IsEnum(left) ? ExtractUnion(EnumValuesToVariants(left.enum), right) :
    IsUnion(left) ? ExtractUnion(Flatten(left.anyOf), right) :
    ExtractType(left, right)
  ) as TSchema[]
  const result = EvaluateUnion(remaining)
  return result as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TExtractImmediate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema,
  InstantiatedLeft extends TSchema = TInstantiateType<Context, State, Left>,
  InstantiatedRight extends TSchema = TInstantiateType<Context, State, Right>
> = TExtractAction<InstantiatedLeft, InstantiatedRight>

function ExtractImmediate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema>
  (context: Context, state: State, left: Left, right: Right, options: TSchemaOptions): 
    TExtractImmediate<Context, State, Left, Right> {
  const instantiatedLeft = InstantiateType(context, state, left)
  const instantiatedRight = InstantiateType(context, state, right)
  return Memory.Update(ExtractAction(instantiatedLeft, instantiatedRight), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TExtractInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema> 
  = TCanInstantiate<Context, [Left, Right]> extends true 
    ? TExtractImmediate<Context, State, Left, Right>
    : TExtractDeferred<Left, Right>

export function ExtractInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema>
  (context: Context, state: State, left: Left, right: Right, options: TSchemaOptions): 
    TExtractInstantiate<Context, State,Left, Right> {
  return (
    CanInstantiate(context, [left, right])
    ? ExtractImmediate(context, state, left, right, options)
    : ExtractDeferred(left, right, options)
  ) as never
}