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

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TParameter } from '../../types/parameter.ts'
import { type TCallConstruct, CallConstruct } from '../../types/call.ts'
import { type TRef, Ref } from '../../types/ref.ts'
import { type TGeneric, IsGeneric } from '../../types/generic.ts'
import { type TProperties } from '../../types/properties.ts'

import { type TEvaluateUnion, EvaluateUnion } from '../evaluate/index.ts'
import { type TState } from '../instantiate.ts'
import { type TInstantiateType, InstantiateType } from '../instantiate.ts'
import { type TInstantiateTypes, InstantiateTypes } from '../instantiate.ts'

// ------------------------------------------------------------------
// Infrastructure
// ------------------------------------------------------------------
import { type TDistributeArguments, DistributedArguments } from './distribute-arguments.ts'
import { type TResolveTarget, ResolveTarget } from './resolve-target.ts'
import { type TResolveArgumentsContext, ResolveArgumentsContext } from './resolve-arguments.ts'

// ------------------------------------------------------------------
// Peek: Top Element in the Stack or Empty
// ------------------------------------------------------------------
type TPeek<State extends TState, 
  Result extends string = State['callstack'] extends [...infer _ extends string[], infer Top extends string] ? Top : ''
> = Result
function Peek<State extends TState>(state: State): TPeek<State> {
  const result = Guard.IsGreaterThan(state.callstack.length, 0) ? state.callstack[state.callstack.length - 1] : ''
  return result as never
}
// ------------------------------------------------------------------
// IsTailCall
//
// Inspects if the target Name matches the top element in the 
// CallStack. If so, this indicates that the generic type is 
// tail-self recursive. In these cases, the CallInstantiate 
// function will bounce back a CallDeferred with 
// InstantiatedArguments only which are trampolined back to
// the CallDispatch for subsequent instantiation.
//
// ------------------------------------------------------------------
type TIsTailCall<State extends TState, Name extends string,
  Result extends boolean = TPeek<State> extends Name ? true : false
> = Result
function IsTailCall<State extends TState, Name extends string>(state: State, name: Name): TIsTailCall<State, Name> {
  const result = Guard.IsEqual(Peek(state), name)
  return result as never
}
// -------------------------------------------------------------------
// Dispatch
//
// The Dispatch performs Argument to Parameter bind and stores 
// parameter names in the ArgumentsContext. We expect parameter
// names to shadow exterior names Context via the following
// assignment expression.
// 
//   Omit<Left, keyof Right> & Right
// 
// We expect the ReturnType to either be the Result of the 
// instantiated Generic expression, or a CallDeferred if 
// bounced via IsTailCall, noting that the TailCall will
// have its ArgumentsInstantiated prior to bounce.
//
// -------------------------------------------------------------------
type TCallDispatch<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, Arguments extends TSchema[],
  ArgumentsContext extends TProperties = TResolveArgumentsContext<Context, State, Parameters, Arguments>,
  ReturnType extends TSchema = TInstantiateType<ArgumentsContext, { callstack: [...State['callstack'], Target['$ref']] }, Expression>,
> = TInstantiateType<Context, State, ReturnType>
function CallDispatch<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, Arguments extends TSchema[]>
  (context: Context, state: State, target: Target, parameters: [...Parameters], expression: Expression, arguments_: [...Arguments]):
    TCallDispatch<Context, State, Target, Parameters, Expression, Arguments> {
  const argumentsContext = ResolveArgumentsContext(context, state, parameters, arguments_) as TProperties
  const returnType = InstantiateType(argumentsContext, { callstack: [...state.callstack, target.$ref] }, expression) as TSchema
  return InstantiateType(context, state, returnType) as never
}
// ------------------------------------------------------------------
// Distributed
//
// Distributed will call the Generic type for as many variants 
// set derived from the TDistributeArguments call. The logic here
// is a bit sketchy, as we're up against stack comparison limits.
//
// There isn't much else going on here other than the eager 
// evaluation on the Dispatch to hoist the ReturnType before 
// making the next call, but we should be mindful that we are
// stretching stack limits here (review)
//
// ------------------------------------------------------------------
type TCallDistributed<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, DistributedArguments extends TSchema[][], Result extends TSchema[] = []> = (
  DistributedArguments extends [infer Arguments extends TSchema[], ...infer DistributedArguments extends TSchema[][]]
    ? TCallDispatch<Context, State, Target, Parameters, Expression, Arguments> extends infer ReturnType extends TSchema // excessive-stack-depth-prevention
      ? TCallDistributed<Context, State, Target, Parameters, Expression, DistributedArguments, [...Result, ReturnType]>
      : never // unreachable - excessive-stack-depth-prevention
    : Result
)
function CallDistributed<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, DistributedArguments extends TSchema[][]>
  (context: Context, state: State, target: Target, parameters: [...Parameters], expression: Expression, distributedArguments: [...DistributedArguments]):
    TCallDistributed<Context, State, Target, Parameters, Expression, DistributedArguments> {
  return distributedArguments.reduce((result, arguments_) =>
    [...result, CallDispatch(context, state, target, parameters, expression, arguments_) as never]
  , []) as never
}
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TCallImmediate<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, InstantiatedArguments extends TSchema[],
  DistributedArguments extends TSchema[][] = TDistributeArguments<InstantiatedArguments, Expression>,
  ReturnTypes extends TSchema[] = TCallDistributed<Context, State, Target, Parameters, Expression, DistributedArguments>,
  Result extends TSchema = ReturnTypes['length'] extends 1 ? ReturnTypes[0] : TEvaluateUnion<ReturnTypes>
> = Result
function CallImmediate<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, InstantiatedArguments extends TSchema[]>
  (context: Context, state: State, target: Target, parameters: [...Parameters], expression: Expression, arguments_: [...InstantiatedArguments]):
    TCallImmediate<Context, State, Target, Parameters, Expression, InstantiatedArguments> {
  const distributedArguments = DistributedArguments(arguments_, expression) as TSchema[][]
  const returnTypes = CallDistributed(context, state, target, parameters, expression, distributedArguments) as TSchema[]
  const result = returnTypes.length === 1 ? returnTypes[0] : EvaluateUnion(returnTypes)
  return result as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
export type TCallInstantiate<Context extends TProperties, State extends TState, Target extends TSchema, Arguments extends TSchema[],
  InstantiatedArguments extends TSchema[] = TInstantiateTypes<Context, State, Arguments>,
  Resolved extends [string, TSchema] = TResolveTarget<Context, Target, Arguments>,
  Name extends string = Resolved[0], 
  Type extends TSchema = Resolved[1],
  Result extends TSchema = (
    Type extends TGeneric<infer Parameters extends TParameter[], infer Expression extends TSchema>
    ? TIsTailCall<State, Name> extends true
      ? TCallConstruct<TRef<Name>, InstantiatedArguments>
      : TCallImmediate<Context, State, TRef<Name>, Parameters, Expression, InstantiatedArguments>
    : TCallConstruct<Target, InstantiatedArguments>
  )> = Result
export function CallInstantiate<Context extends TProperties, State extends TState, Target extends TSchema, Arguments extends TSchema[]>
  (context: Context, state: State, target: Target, arguments_: [...Arguments]):
  TCallInstantiate<Context, State, Target, Arguments> {
  const instantiatedArguments = InstantiateTypes(context, state, arguments_) as TSchema[]
  const resolved = ResolveTarget(context, target, arguments_) as [string, TSchema]
  const name = resolved[0]
  const type = resolved[1]
  const result = (
    IsGeneric(type)
      ? IsTailCall(state, name)
        ? CallConstruct(Ref(name), instantiatedArguments)
        : CallImmediate(context, state, Ref(name), type.parameters, type.expression, instantiatedArguments)
      : CallConstruct(target, instantiatedArguments)
  )
  return result as never
}