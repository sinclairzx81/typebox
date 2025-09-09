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
import { type TSchema, IsSchema } from '../../types/schema.ts'
import { type TParameter } from '../../types/parameter.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TState, type TInstantiateType, InstantiateType } from '../instantiate.ts'

import { Extends, ExtendsResult } from '../../extends/index.ts'
import { IsInfer } from '../../types/infer.ts'
import { IsCall } from '../../types/call.ts'

// ------------------------------------------------------------------
// AssertArgument
// ------------------------------------------------------------------
function AssertArgumentExtends<Name extends string, Type extends TSchema, Extends extends TSchema>(name: Name, type: Type, extends_: Extends): void {
  if (IsInfer(type) || IsCall(type) || ExtendsResult.IsExtendsTrueLike(Extends({}, type, extends_))) return
  const cause = { parameter: name, extends: extends_, received: type }
  // @ts-ignore - no definition for { cause } options 
  throw new Error('Generic argument does not satify constraint', { cause })
}
// ------------------------------------------------------------------
// BindArgument
// ------------------------------------------------------------------
type TBindArgument<Context extends TProperties, State extends TState, Name extends string, Extends extends TSchema, Type extends TSchema,
  InstantiatedArgument extends TSchema = TInstantiateType<Context, State, Type>,
> = Memory.TAssign<Context, { [_ in Name]: InstantiatedArgument }>
function BindArgument<Context extends TProperties, State extends TState, Name extends string, Extends extends TSchema, Type extends TSchema>
  (context: Context, state: State, name: Name, extends_: Extends, type: Type):
  TBindArgument<Context, State, Name, Extends, Type> {
  const instantiatedArgument = InstantiateType(context, state, type)
  AssertArgumentExtends(name, instantiatedArgument, extends_)
  return Memory.Assign(context, { [name]: instantiatedArgument }) as never
}
// ------------------------------------------------------------------
// BindArguments
// ------------------------------------------------------------------
type TBindArguments<Context extends TProperties, State extends TState, ParameterLeft extends TParameter, ParameterRight extends TParameter[], Arguments extends TSchema[],
  InstantiatedExtends extends TSchema = TInstantiateType<Context, State, ParameterLeft['extends']>,
  InstantiatedEquals extends TSchema = TInstantiateType<Context, State, ParameterLeft['equals']>,
> = (
    Arguments extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TBindParameters<TBindArgument<Context, State, ParameterLeft['name'], InstantiatedExtends, Left>, State, ParameterRight, Right>
    : TBindParameters<TBindArgument<Context, State, ParameterLeft['name'], InstantiatedExtends, InstantiatedEquals>, State, ParameterRight, []>
  )
function BindArguments<Context extends TProperties, State extends TState, ParameterLeft extends TParameter, ParameterRight extends TParameter[], Arguments extends TSchema[]>
  (context: Context, state: State, parameterLeft: ParameterLeft, parameterRight: [...ParameterRight], arguments_: [...Arguments]):
    TBindArguments<Context, State, ParameterLeft, ParameterRight, Arguments> {
  const instantiatedExtends = InstantiateType(context, state, parameterLeft.extends)
  const instantiatedEquals = InstantiateType(context, state, parameterLeft.equals)
  const [left, ...right] = arguments_
  return (
    IsSchema(left)
      ? BindParameters(BindArgument(context, state, parameterLeft['name'], instantiatedExtends, left), state, parameterRight, right)
      : BindParameters(BindArgument(context, state, parameterLeft['name'], instantiatedExtends, instantiatedEquals), state, parameterRight, [])
  ) as never
}
// ------------------------------------------------------------------
// BindParameters
// ------------------------------------------------------------------
type TBindParameters<Context extends TProperties, State extends TState, Parameters extends TParameter[], Arguments extends TSchema[]> = (
  Parameters extends [infer Left extends TParameter, ...infer Right extends TParameter[]]
  ? TBindArguments<Context, State, Left, Right, Arguments>
  : Context
)
function BindParameters<Context extends TProperties, State extends TState, Parameters extends TParameter[], Arguments extends TSchema[]>
  (context: Context, state: State, parameters: [...Parameters], arguments_: [...Arguments]):
    TBindParameters<Context, State, Parameters, Arguments> {
  const [left, ...right] = parameters
  return (
    IsSchema(left)
      ? BindArguments(context, state, left, right, arguments_)
      : context
  ) as never
}
// ------------------------------------------------------------------
// ResolveArgumentsContext
// ------------------------------------------------------------------
export type TResolveArgumentsContext<Context extends TProperties, State extends TState, Parameters extends TParameter[], Arguments extends TSchema[],
  Result extends TProperties = TBindParameters<Context, State, Parameters, Arguments>
> = Result
export function ResolveArgumentsContext<Context extends TProperties, State extends TState, Parameters extends TParameter[], Arguments extends TSchema[]>
  (context: Context, state: State, parameters: [...Parameters], arguments_: [...Arguments]):
  TResolveArgumentsContext<Context, State, Parameters, Arguments> {
  return BindParameters(context, state, parameters, arguments_) as never
}