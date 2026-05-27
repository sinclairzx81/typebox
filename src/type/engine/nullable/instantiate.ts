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
import { type TNull, Null } from '../../types/null.ts'
import { type TUnion, Union } from '../../types/union.ts'
import { type TNullableDeferred, NullableDeferred } from '../../action/nullable.ts'
import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'

type TNullableOperation<Type extends TSchema> = TUnion<[Type, TNull]>
function NullableOperation<Type extends TSchema>(type: Type): TNullableOperation<Type> {
  return Union([type, Null()]) as never
}

export type TNullableAction<Type extends TSchema,
  Result extends TSchema = TCanInstantiate<[Type]> extends true
    ? TNullableOperation<Type>
    : TNullableDeferred<Type>
> = Result

export function NullableAction<Type extends TSchema>(type: Type, options: TSchemaOptions): TNullableAction<Type> {
  const result = CanInstantiate([type])
    ? Memory.Update(NullableOperation(type), {}, options)
    : NullableDeferred(type, options)
  return result as never
}

export type TNullableInstantiate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>,
> = TNullableAction<InstantiatedType>

export function NullableInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): TNullableInstantiate<Context, State, Type> {
  return NullableAction(InstantiateType(context, state, type), options)
}
