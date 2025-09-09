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

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TParameter } from '../../types/parameter.ts'
import { type TCallConstruct, CallConstruct } from '../../types/call.ts'
import { type TRef, Ref } from '../../types/ref.ts'
import { type TGeneric, IsGeneric } from '../../types/generic.ts'
import { type TProperties } from '../../types/properties.ts'

import { type TState } from '../instantiate.ts'
import { type TInstantiateType, InstantiateType } from '../instantiate.ts'
import { type TInstantiateTypes, InstantiateTypes } from '../instantiate.ts'

// ----------------------------------------------------------------------------
// Call: Infrastructure
// ----------------------------------------------------------------------------
import { type TResolveTarget, ResolveTarget } from './resolve-target.ts'
import { type TResolveArgumentsContext, ResolveArgumentsContext } from './resolve-arguments.ts'

// ----------------------------------------------------------------------------
// Callstack: Peek<...>
// ----------------------------------------------------------------------------
type TPeek<CallStack extends string[], Result extends string = CallStack extends [infer Left extends string, ...infer _ extends string[]] ? Left : ''> = Result
function Peek<CallStack extends string[]>(callstack: [...CallStack]): TPeek<CallStack> {
  return (Guard.IsGreaterThan(callstack.length, 0) ? callstack[0] : '') as never
}
// ----------------------------------------------------------------------------
// DeferredCall
// ----------------------------------------------------------------------------
type TDeferredCall<Context extends TProperties, State extends TState, Target extends TSchema, Arguments extends TSchema[],
  InstantiatedArguments extends TSchema[] = TInstantiateTypes<Context, State, Arguments>,
  DeferredCall extends TSchema = TCallConstruct<Target, InstantiatedArguments>
> = DeferredCall

function DeferredCall<Context extends TProperties, State extends TState, Target extends TSchema, Arguments extends TSchema[]>
  (context: Context, state: State, target: Target, arguments_: [...Arguments]):
    TDeferredCall<Context, State, Target, Arguments> {
  const instantiatedArguments = InstantiateTypes(context, state, arguments_) as TSchema[]
  const deferredCall = CallConstruct(target, instantiatedArguments)
  return deferredCall as never
}
// ----------------------------------------------------------------------------
// TailCall
// ----------------------------------------------------------------------------
type TTailCall<Context extends TProperties, State extends TState, Name extends string, Arguments extends TSchema[],
  DeferredCall extends TSchema = TDeferredCall<Context, State, TRef<Name>, Arguments>
> = DeferredCall

function TailCall<Context extends TProperties, State extends TState, Name extends string, Arguments extends TSchema[]>
  (context: Context, state: State, name: Name, arguments_: [...Arguments]):
    TTailCall<Context, State, Name, Arguments> {
  const deferredCall = DeferredCall(context, state, Ref(name), arguments_) as never
  return deferredCall as never
}
// ----------------------------------------------------------------------------
// HeadCall
// ----------------------------------------------------------------------------
type THeadCall<Context extends TProperties, State extends TState, Name extends string, Parameters extends TParameter[], Expression extends TSchema, Arguments extends TSchema[],
  InstantiatedArguments extends TSchema[] = TInstantiateTypes<Context, State, Arguments>,
  ArgumentsContext extends TProperties = TResolveArgumentsContext<Context, State, Parameters, InstantiatedArguments>,
  ReturnType extends TSchema = TInstantiateType<ArgumentsContext, { callstack: [...State['callstack'], Name] }, Expression>,
> = TInstantiateType<Context, State, ReturnType>

function HeadCall<Context extends TProperties, State extends TState, Name extends string, Parameters extends TParameter[], Expression extends TSchema, Arguments extends TSchema[]>
  (context: Context, state: State, name: Name, parameters: [...Parameters], expression: Expression, arguments_: [...Arguments]):
    THeadCall<Context, State, Name, Parameters, Expression, Arguments> {
  const instantiatedArguments = InstantiateTypes(context, state, arguments_) as TSchema[]
  const argumentsContext = ResolveArgumentsContext(context, state, parameters, instantiatedArguments) as TProperties
  const returnType = InstantiateType(argumentsContext, { callstack: [...state.callstack, name] }, expression) as TSchema
  return InstantiateType(context, state, returnType) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TCallInstantiate<Context extends TProperties, State extends TState, Target extends TSchema, Arguments extends TSchema[],
  Resolved extends [string, TSchema] = TResolveTarget<Context, Target, Arguments>,
  Name extends string = Resolved[0],
  Type extends TSchema = Resolved[1],
  Result extends TSchema = (
    Type extends TGeneric<infer Parameters extends TParameter[], infer Expression extends TSchema>
    ? TPeek<State['callstack']> extends Name
      ? TTailCall<Context, State, Name, Arguments>
      : THeadCall<Context, State, Name, Parameters, Expression, Arguments>
    : TDeferredCall<Context, State, Target, Arguments>
  )> = Result

export function CallInstantiate<Context extends TProperties, State extends TState, Target extends TSchema, Arguments extends TSchema[]>
  (context: Context, state: State, target: Target, arguments_: [...Arguments]):
  TCallInstantiate<Context, State, Target, Arguments> {
  const [name, type] = ResolveTarget(context, target, arguments_) as [string, TSchema]
  return (
    IsGeneric(type)
      ? Guard.IsEqual(Peek(state.callstack), name)
        ? TailCall(context, state, name, arguments_)
        : HeadCall(context, state, name, type.parameters, type.expression, arguments_)
      : DeferredCall(context, state, target, arguments_)
  ) as never
}