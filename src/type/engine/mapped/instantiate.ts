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
import { type TIdentifier } from '../../types/identifier.ts'
import { type TMappedDeferred, MappedDeferred } from '../../action/mapped.ts'
import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'
import { type TMappedOperation, MappedOperation } from './mapped-operation.ts'

// ------------------------------------------------------------------
// MappedAction
// ------------------------------------------------------------------
export type TMappedAction<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema,
  Result extends TSchema = TCanInstantiate<[Type]> extends true
    ? TMappedOperation<Context, State, Identifier, Type, As, Property>
    : TMappedDeferred<Identifier, Type, As, Property>
> = Result
export function MappedAction<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, type: Type, as: As, property: Property, options: TSchemaOptions): 
    TMappedAction<Context, State, Identifier, Type, As, Property> {
  const result = CanInstantiate([type])
    ? Memory.Update(MappedOperation(context, state, identifier, type, as, property), {}, options)
    : MappedDeferred(identifier, type, as, property, options)
  return result as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TMappedInstantiate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema,
  InstaniatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TMappedAction<Context, State, Identifier, InstaniatedType, As, Property>
export function MappedInstantiate<Context extends TProperties, State extends TState, Identifier extends TIdentifier, Type extends TSchema, As extends TSchema, Property extends TSchema>
  (context: Context, state: State, identifier: Identifier, type: Type, as: As, property: Property, options: TSchemaOptions): 
    TMappedInstantiate<Context, State,Identifier, Type, As, Property> {
  const instantiatedType = InstantiateType(context, state, type)
  return MappedAction(context, state, identifier, instantiatedType, as, property, options)
}