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
import { type TPartialDeferred, PartialDeferred } from '../../action/partial.ts'
import { type TFromType, FromType } from './from-type.ts'

import { type TState, type TInstantiateType, InstantiateType, type TCanInstantiate, CanInstantiate } from '../instantiate.ts'

// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TPartialImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TFromType<InstantiatedType>

function PartialImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TPartialImmediate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(FromType(instantiatedType), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TPartialInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> 
  = TCanInstantiate<Context, [Type]> extends true
    ? TPartialImmediate<Context, State, Type>
    : TPartialDeferred<Type>

export function PartialInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TPartialInstantiate<Context, State, Type> {
  return (
    CanInstantiate(context, [type])
      ? PartialImmediate(context, state, type, options)
      : PartialDeferred(type, options)
  ) as never
}
