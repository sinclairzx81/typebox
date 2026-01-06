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

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TEnum, type TEnumValue, IsEnum } from '../../types/enum.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TExtends, Extends, ExtendsResult } from '../../extends/index.ts'
import { type TEnumValuesToVariants, EnumValuesToVariants } from '../enum/index.ts'
import { type TEvaluateUnion, type TFlatten, EvaluateUnion, Flatten } from '../evaluate/index.ts'
import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'
import { type TExcludeDeferred, ExcludeDeferred } from '../../action/exclude.ts'

// ------------------------------------------------------------------
// ExcludeUnion
// ------------------------------------------------------------------
type TExcludeUnion<Types extends TSchema[], Right extends TSchema, Result extends TSchema[] = []> = (
  Types extends [infer Head extends TSchema, ...infer Tail extends TSchema[]]
    ? TExcludeUnion<Tail, Right, [...Result, ...TExcludeType<Head, Right>]>
    : Result
)
function ExcludeUnion<Types extends TSchema[], Right extends TSchema>(types: [...Types], right: Right): TExcludeUnion<Types, Right> {
  return types.reduce((result, head) => {
    return [...result, ...ExcludeType(head, right)]
  }, [] as TSchema[]) as never
}
// ------------------------------------------------------------------
// ExcludeType
// ------------------------------------------------------------------
type TExcludeType<Left extends TSchema, Right extends TSchema,
  Check extends ExtendsResult.TResult = TExtends<{}, Left, Right>,
  Result extends TSchema[] = Check extends ExtendsResult.TExtendsTrueLike<infer _> ? [] : [Left]
> = Result
function ExcludeType<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExcludeType<Left, Right> {
  const check = Extends({}, left, right)
  const result = ExtendsResult.IsExtendsTrueLike(check) ? [] : [left]
  return result as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
type TExcludeAction<Left extends TSchema, Right extends TSchema,
  Remaining extends TSchema[] = (
    Left extends TEnum<infer Values extends TEnumValue[]> ? TExcludeUnion<TEnumValuesToVariants<Values>, Right> : 
    Left extends TUnion<infer Types extends TSchema[]> ? TExcludeUnion<TFlatten<Types>, Right> : 
    TExcludeType<Left, Right>
  ),
  Result extends TSchema = TEvaluateUnion<Remaining>
> = Result
function ExcludeAction<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TExcludeAction<Left, Right> {
  const remaining = (
    IsEnum(left) ? ExcludeUnion(EnumValuesToVariants(left.enum), right) :
    IsUnion(left) ? ExcludeUnion(Flatten(left.anyOf), right) :
    ExcludeType(left, right)
  ) as TSchema[]
  const result = EvaluateUnion(remaining)
  return result as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TExcludeImmediate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema,
  InstantiatedLeft extends TSchema = TInstantiateType<Context, State, Left>,
  InstantiatedRight extends TSchema = TInstantiateType<Context, State, Right>,
> = TExcludeAction<InstantiatedLeft, InstantiatedRight>

function ExcludeImmediate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema>
  (context: Context, state: State, left: Left, right: Right, options: TSchemaOptions): 
    TExcludeImmediate<Context, State, Left, Right> {
  const instantiatedLeft = InstantiateType(context, state, left)
  const instantiatedRight = InstantiateType(context, state, right)
  return Memory.Update(ExcludeAction(instantiatedLeft, instantiatedRight), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TExcludeInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema> 
  = TCanInstantiate<Context, [Left, Right]> extends true 
    ? TExcludeImmediate<Context, State, Left, Right>
    : TExcludeDeferred<Left, Right>

export function ExcludeInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema>
  (context: Context, state: State, left: Left, right: Right, options: TSchemaOptions): 
    TExcludeInstantiate<Context, State,Left, Right> {
  return (
    CanInstantiate(context, [left, right])
    ? ExcludeImmediate(context, state, left, right, options)
    : ExcludeDeferred(left, right, options)
  ) as never
}