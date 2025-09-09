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
import { type TNull, Null } from '../../types/null.ts'
import { type TUndefined, Undefined } from '../../types/undefined.ts'
import { type TUnion, Union } from '../../types/union.ts'
import { type TExcludeInstantiate, ExcludeInstantiate } from '../exclude/instantiate.ts'
import { type TNonNullableDeferred, NonNullableDeferred } from '../../action/non-nullable.ts'

import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'

// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
type TNonNullableAction<Type extends TSchema,
  Excluded extends TSchema = TUnion<[TNull, TUndefined]>,
> = TExcludeInstantiate<{}, { callstack: [] }, Type, Excluded>

function NonNullableAction<Type extends TSchema>(type: Type): TNonNullableAction<Type> {
  const excluded = Union([Null(), Undefined()])
  return ExcludeInstantiate({}, { callstack: [] }, type, excluded, {}) as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TNonNullableImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>,
  Result extends TSchema = TNonNullableAction<InstantiatedType>
> = Result

function NonNullableImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TNonNullableImmediate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return Memory.Update(NonNullableAction(instantiatedType), {}, options) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TNonNullableInstantiate<Context extends TProperties, State extends TState, Type extends TSchema> 
  = TCanInstantiate<Context, [Type]> extends true 
    ? TNonNullableImmediate<Context, State, Type>
    : TNonNullableDeferred<Type>

export function NonNullableInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TNonNullableInstantiate<Context, State, Type> {
  return (
    CanInstantiate(context, [type])
      ? NonNullableImmediate(context, state, type, options)
      : NonNullableDeferred(type, options)
  ) as never
}