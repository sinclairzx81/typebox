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
// deno-lint-ignore-file ban-types

import { Memory } from '../../../system/memory/index.ts'
import { type TSchema, type TSchemaOptions } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TKeyOfDeferred, KeyOfDeferred } from '../../action/keyof.ts'
import { type TState, type TInstantiateType, type TCanInstantiate, InstantiateType, CanInstantiate } from '../instantiate.ts'

import { type TKeys, Keys } from '../key_value/keys.ts'
import { type TEvaluateUnionFast, EvaluateUnionFast } from '../evaluate/evaluate.ts'


// ------------------------------------------------------------------
// Operation
// 
// KeyOf<T> is typically applied to types with structurally known
// keys, so the resulting key set is already presumed distinct. We
// use EvaluateUnionFast to skip type de-duplication.
//
// ------------------------------------------------------------------
type TKeyOfOperation<Type extends TSchema,
  Keys extends TSchema[] = TKeys<{}, Type>,
  Result extends TSchema = TEvaluateUnionFast<Keys>
> = Result
function KeyOfOperation<Type extends TSchema>(type: Type): TKeyOfOperation<Type> {
  const keys = Keys({}, type) as TSchema[]
  const result = EvaluateUnionFast(keys)
  return result as never
}
// ------------------------------------------------------------------
// Action
// ------------------------------------------------------------------
export type TKeyOfAction<Type extends TSchema, 
  Result extends TSchema = TCanInstantiate<[Type]> extends true
    ? TKeyOfOperation<Type>
    : TKeyOfDeferred<Type>
> = Result
export function KeyOfAction<Type extends TSchema>(type: Type, options: TSchemaOptions): TKeyOfAction<Type> {
  return (
    CanInstantiate([type])
    ? Memory.Update(KeyOfOperation(type), {}, options)
    : KeyOfDeferred(type, options)
  ) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TKeyOfInstantiate<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateType<Context, State, Type>
> = TKeyOfAction<InstantiatedType>
export function KeyOfInstantiate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type, options: TSchemaOptions): 
    TKeyOfInstantiate<Context, State, Type> {
  const instantiatedType = InstantiateType(context, state, type)
  return KeyOfAction(instantiatedType, options) as never
}