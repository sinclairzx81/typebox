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
import { type TState, type TInstantiateType, InstantiateType } from '../instantiate.ts'
import { type TEvaluateType, EvaluateType } from './evaluate.ts'

// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TEvaluateImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TEvaluateType<InstantiatedType>

function EvaluateImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TEvaluateImmediate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(EvaluateType(instantiatedType), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TEvaluateInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> = 
  // [instantiation-rule]
  //
  // Evaluate instantiation should never defer on instantiate as the caller is specifically 
  // requesting that the type be evaluated in whatever context is available. However, actions 
  // embedded in the Evaluate call may defer local to themselves.
  TEvaluateImmediate<Context, State, Type>

export function EvaluateInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TEvaluateInstantiate<Context, State, Type> {
  return (
    // [instantiation-rule]
    //
    // Evaluate instantiation should never defer on instantiate as the caller is specifically 
    // requesting that the type be evaluated in whatever context is available. However, actions 
    // embedded in the Evaluate call may defer local to themselves.
    EvaluateImmediate(context, state, type, options)
  ) as never
}