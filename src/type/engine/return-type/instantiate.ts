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
import { type TFunction, IsFunction } from '../../types/function.ts'
import { type TNever, Never } from '../../types/never.ts'
import { type TReturnTypeDeferred, ReturnTypeDeferred } from '../../action/return-type.ts'

import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'

// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
type TReturnTypeAction<Type extends TSchema> = 
  Type extends TFunction<TSchema[], infer ReturnType extends TSchema> 
    ? ReturnType 
    : TNever
function ReturnTypeAction<Type extends TSchema>(type: Type): TReturnTypeAction<Type> {
  return (IsFunction(type) ? type.returnType : Never()) as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TReturnTypeImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>,
> = TReturnTypeAction<InstantiatedType>

function ReturnTypeImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TReturnTypeImmediate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(ReturnTypeAction(instantiatedType), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TReturnTypeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> 
  = TCanInstantiate<Context, [Type]> extends true
    ? TReturnTypeImmediate<Context, State, Type>
    : TReturnTypeDeferred<Type>

export function ReturnTypeInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TReturnTypeInstantiate<Context, State, Type> {
  return (
    CanInstantiate(context, [type])
      ? ReturnTypeImmediate(context, state, type, options)
      : ReturnTypeDeferred(type, options)
  ) as never
}
