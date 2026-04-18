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

// deno-lint-ignore-file ban-types
// deno-fmt-ignore-file

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TConstructor, IsConstructor } from '../../types/constructor.ts'
import { type TTuple, Tuple } from '../../types/tuple.ts'
import { type TConstructorParametersDeferred, ConstructorParametersDeferred } from '../../action/constructor-parameters.ts'
import { type TState, type TInstantiateType, InstantiateType, type TCanInstantiate, CanInstantiate } from '../instantiate.ts'

import { type TInstantiateElements, InstantiateElements } from '../instantiate.ts'

// ------------------------------------------------------------------
// Operation
//
// We need to push Parameters through an Instantiate call to ensure
// Rest elements are spread on the resulting Tuple. This is likely
// best handled another way, but will keep until additional work
// is done to handle unsized Tuple.
//
// ------------------------------------------------------------------
type TConstructorParametersOperation<Type extends TSchema,
  Parameters extends TSchema[] = Type extends TConstructor ? Type['parameters'] : [],
  InstantiatedParameters extends TSchema[] = TInstantiateElements<{}, { callstack: [] }, Parameters>,
  Result extends TSchema = TTuple<InstantiatedParameters>
> = Result
function ConstructorParametersOperation<Type extends TSchema>(type: Type): TConstructorParametersOperation<Type> {
  const parameters = IsConstructor(type) ? type['parameters'] : []
  const instantiatedParameters = InstantiateElements({}, { callstack: [] }, parameters)
  const result = Tuple(instantiatedParameters)
  return result as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
export type TConstructorParametersAction<Type extends TSchema,
  Result extends TSchema = TCanInstantiate<[Type]> extends true
    ? TConstructorParametersOperation<Type>
    : TConstructorParametersDeferred<Type>
> = Result
export function ConstructorParametersAction<Type extends TSchema>
  (type: Type, options: TSchemaOptions): 
    TConstructorParametersAction<Type> {
  const result = CanInstantiate([type])
      ? Memory.Update(ConstructorParametersOperation(type), {}, options)
      : ConstructorParametersDeferred(type, options)
  return result as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TConstructorParametersInstantiate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TConstructorParametersAction<InstantiatedType>
export function ConstructorParametersInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TConstructorParametersInstantiate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return ConstructorParametersAction(instantiatedType, options)
}