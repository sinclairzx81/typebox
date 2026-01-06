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
import { type TReadonlyObjectDeferred, ReadonlyObjectDeferred } from '../../action/readonly-type.ts'
import { type TFromType, FromType } from './from-type.ts'
import { type TState, type TInstantiateType, InstantiateType, type TCanInstantiate, CanInstantiate } from '../instantiate.ts'

// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TReadonlyObjectImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TFromType<InstantiatedType>

function ReadonlyObjectImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TReadonlyObjectImmediate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(FromType(instantiatedType), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TReadonlyObjectInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> 
  = TCanInstantiate<Context, [Type]> extends true
    ? TReadonlyObjectImmediate<Context, State, Type>
    : TReadonlyObjectDeferred<Type>

export function ReadonlyObjectInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TReadonlyObjectInstantiate<Context, State, Type> {
  return (
    CanInstantiate(context, [type])
      ? ReadonlyObjectImmediate(context, state, type, options)
      : ReadonlyObjectDeferred(type, options)
  ) as never
}
