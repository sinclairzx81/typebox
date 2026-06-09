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
import { type TImmutable } from '../../types/_immutable.ts'
import { type TState, type TInstantiateType, InstantiateType } from '../instantiate.ts'

// ------------------------------------------------------------------
// Operation
// ------------------------------------------------------------------
type TAddImmutableOperation<Type extends TSchema,
  Result extends TSchema = '~immutable' extends keyof Type ? Type : TImmutable<Type>
> = Result
function AddImmutableOperation<Type extends TSchema>(type: Type): TAddImmutableOperation<Type> {
  return Memory.Update(type, { '~immutable': true }, { }) as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
export type TAddImmutableAction<Type extends TSchema,
  Result extends TSchema = TAddImmutableOperation<Type>
> = Result
export function AddImmutableAction<Type extends TSchema>(type: Type, options: TSchemaOptions): TAddImmutableAction<Type> {
  const result = Memory.Update(AddImmutableOperation(type), {}, options)
  return result as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TAddImmutableInstantiate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiateType extends TSchema = TInstantiateType<Context, State, Type>
> = TAddImmutableAction<InstantiateType>

export function AddImmutableInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TAddImmutableInstantiate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return AddImmutableAction(instantiatedType, options) as never
}