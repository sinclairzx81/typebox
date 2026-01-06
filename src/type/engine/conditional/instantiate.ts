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
import { type TUnion, Union } from '../../types/union.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TExtends, Extends, ExtendsResult } from '../../extends/index.ts'
import { type TState, type TInstantiateType, InstantiateType, type TCanInstantiate, CanInstantiate } from '../instantiate.ts'
import { type TConditionalDeferred, ConditionalDeferred } from '../../action/conditional.ts'

// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TConditionalImmediate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema, True extends TSchema, False extends TSchema,
  InstaniatedLeft extends TSchema = TInstantiateType<Context, State, Left>,
  InstaniatedRight extends TSchema = TInstantiateType<Context, State, Right>,
  ExtendsResult extends ExtendsResult.TResult = TExtends<Context, InstaniatedLeft, InstaniatedRight>,
> = (
  ExtendsResult extends ExtendsResult.TExtendsUnion<infer InferredContext extends TProperties> ? TUnion<[TInstantiateType<InferredContext, State, True>, TInstantiateType<Context, State,False>]> :
  ExtendsResult extends ExtendsResult.TExtendsTrue<infer InferredContext extends TProperties> ? TInstantiateType<InferredContext, State, True> :
  TInstantiateType<Context, State, False>
)
function ConditionalImmediate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema, True extends TSchema, False extends TSchema>
  (context: Context, state: State, left: Left, right: Right, true_: True, false_: False, options: TSchemaOptions): 
    TConditionalImmediate<Context, State,Left, Right, True, False> {
  const instantiatedLeft = InstantiateType(context, state, left)
  const instantiatedRight = InstantiateType(context, state, right)
  const extendsResult = Extends(context, instantiatedLeft, instantiatedRight)
  return Memory.Update((
    ExtendsResult.IsExtendsUnion(extendsResult) ? Union([InstantiateType(extendsResult.inferred, state, true_), InstantiateType(context, state, false_)]) :
    ExtendsResult.IsExtendsTrue(extendsResult) ? InstantiateType(extendsResult.inferred, state, true_) :
    InstantiateType(context, state, false_)
  ), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TConditionalInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema, True extends TSchema, False extends TSchema,
> = TCanInstantiate<Context, [Left, Right]> extends true
  ? TConditionalImmediate<Context, State, Left, Right, True, False>
  : TConditionalDeferred<Left, Right, True, False>

export function ConditionalInstantiate<Context extends TProperties, State extends TState, Left extends TSchema, Right extends TSchema, True extends TSchema, False extends TSchema>
  (context: Context, state: State, left: Left, right: Right, true_: True, false_: False, options: TSchemaOptions): 
    TConditionalInstantiate<Context, State,Left, Right, True, False> {
  return (
    CanInstantiate(context, [left, right])
    ? ConditionalImmediate(context, state, left, right, true_, false_, options)
    : ConditionalDeferred(left, right, true_, false_, options)
  ) as never
}