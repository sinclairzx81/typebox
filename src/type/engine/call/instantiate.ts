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

import { Guard, RecursionGuard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TParameter } from '../../types/parameter.ts'
import { type TCallConstruct, CallConstruct, type TCall, IsCall } from '../../types/call.ts'
import { type TRef, Ref, IsRef } from '../../types/ref.ts'
import { type TGeneric, IsGeneric } from '../../types/generic.ts'
import { type TProperties } from '../../types/properties.ts'

import { type TEvaluateUnion, EvaluateUnion } from '../evaluate/index.ts'
import { type TInstantiateType, InstantiateType } from '../instantiate.ts'
import { type TInstantiateTypes, InstantiateTypes } from '../instantiate.ts'
import { type TState, State } from '../instantiate.ts'

// ------------------------------------------------------------------
// Infrastructure
// ------------------------------------------------------------------
import { type TDistributeArguments, DistributeArguments } from './distribute_arguments.ts'
import { type TResolveTarget, ResolveTarget } from './resolve_target.ts'
import { type TResolveArgumentsContext, ResolveArgumentsContext } from './resolve_arguments.ts'

// ------------------------------------------------------------------
// Peek
// ------------------------------------------------------------------
type TPeek<State extends TState, 
  Result extends string = State['callstack'] extends [...infer _ extends string[], infer Top extends string] ? Top : ''
> = Result
function Peek<State extends TState>(state: State): TPeek<State> {
  const result = Guard.IsGreaterThan(state.callstack.length, 0) ? state.callstack[state.callstack.length - 1] : ''
  return result as never
}
// ------------------------------------------------------------------
// IsTailReturn
//
// True when Name is already on top of the CallStack, meaning we're
// re-entering a generic from within its own expansion. CallInstantiate
// uses this to defer via CallConstruct instead of instantiating again.
// ------------------------------------------------------------------
type TIsTailReturn<State extends TState, Name extends string,
  Result extends boolean = TPeek<State> extends Name ? true : false
> = Result
function IsTailReturn<State extends TState, Name extends string>(state: State, name: Name): TIsTailReturn<State, Name> {
  const result = Guard.IsEqual(Peek(state), name)
  return result as never
}
// ------------------------------------------------------------------
// IsTailCall
//
// True when ReturnType is a deferred Call back to Name itself, the
// signal CallDispatch uses to loop via TailCall rather than treat
// ReturnType as final.
// ------------------------------------------------------------------
type TIsTailCall<ReturnType extends TSchema, Name extends string,
  Result extends boolean = ReturnType extends TCall<TRef>
    ? Name extends ReturnType['target']['$ref'] ? true : false
    : false
> = Result
function IsTailCall<ReturnType extends TSchema, Name extends string>
  (returnType: ReturnType, name: Name): TIsTailCall<ReturnType, Name> {
  const result = IsCall(returnType) && IsRef(returnType.target) && Guard.IsEqual(name, returnType['target']['$ref'])
  return result as never
}
// ------------------------------------------------------------------
// CallDispatch
//
// Binds Arguments to Parameters via ResolveArgumentsContext, then
// instantiates the Expression under that context with the target
// pushed onto the CallStack. The resulting ReturnType is either a
// fully instantiated type or a CallDeferred if IsTailReturn fired,
// which is then re-instantiated under the original Context to
// resolve any exterior bindings.
//
// ------------------------------------------------------------------
type TCallDispatch<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, Arguments extends TSchema[],
  ArgumentsContext extends TProperties = TResolveArgumentsContext<Context, State, Parameters, Arguments>,
  ReturnType extends TSchema = TInstantiateType<ArgumentsContext, TState<[...State['callstack'], Target['$ref']], State['visited']>, Expression>,
  TailArguments extends TSchema[] = ReturnType extends TCall<TSchema, infer Arguments extends TSchema[]> ? Arguments : []
> = TIsTailCall<ReturnType, Target['$ref']> extends true
  ? TCallDispatch<Context, State, Target, Parameters, Expression, TailArguments>
  : TInstantiateType<ArgumentsContext, TState<[], []>, ReturnType>
const CallDispatch = /*#__PURE__*/ RecursionGuard.Recursive(<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, Arguments extends TSchema[]>
  (context: Context, state: State, target: Target, parameters: [...Parameters], expression: Expression, arguments_: [...Arguments]):
    TCallDispatch<Context, State, Target, Parameters, Expression, Arguments> => {
  const argumentsContext = ResolveArgumentsContext(context, state, parameters, arguments_) as TProperties
  const returnType = InstantiateType(argumentsContext, State([...state['callstack'], target['$ref']], state['visited']), expression) as TSchema
  const tailArguments = IsCall(returnType) ? returnType.arguments : []
  return (IsTailCall(returnType, target['$ref'])
    ? RecursionGuard.TailCall(CallDispatch, argumentsContext, state, target, parameters, expression , tailArguments) as never
    : InstantiateType(argumentsContext, State([], []), returnType)) as never
})
// ------------------------------------------------------------------
// CallDistributed
//
// Calls CallDispatch once per variant derived from DistributeArguments,
// accumulating results into a TSchema[]. The logic here is a bit
// sketchy as we're up against TypeScript's stack depth limits, so we
// eagerly hoist the ReturnType via `extends infer` before each
// recursive call. We are stretching stack limits here (review).
//
// ------------------------------------------------------------------
type TCallDistributed<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, DistributedArguments extends TSchema[][], Result extends TSchema[] = []> = (
  DistributedArguments extends [infer Arguments extends TSchema[], ...infer DistributedArguments extends TSchema[][]]
    ? TCallDispatch<Context, State, Target, Parameters, Expression, Arguments> extends infer ReturnType extends TSchema // excessive-stack-depth-prevention
      ? TCallDistributed<Context, State, Target, Parameters, Expression, DistributedArguments, [...Result, ReturnType]>
      : never // unreachable - excessive-stack-depth-prevention
    : Result
)
const CallDistributed = /*#__PURE__*/ RecursionGuard.Recursive(<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, DistributedArguments extends TSchema[][]>
  (context: Context, state: State, target: Target, parameters: [...Parameters], expression: Expression, distributedArguments: [...DistributedArguments], result: TSchema[] = []):
    TCallDistributed<Context, State, Target, Parameters, Expression, DistributedArguments> => {
  return RecursionGuard.ShiftLeft(distributedArguments, (_arguments, distributedArguments) => {
    const returnType = CallDispatch(context, state, target, parameters, expression, _arguments) as TSchema
    return RecursionGuard.TailCall(CallDistributed, context, state, target, parameters, expression, distributedArguments, RecursionGuard.Push(result, returnType))
  }, () => result) as never
})
// ------------------------------------------------------------------
// Immediate
// ------------------------------------------------------------------
type TCallImmediate<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, InstantiatedArguments extends TSchema[],
  DistributedArguments extends TSchema[][] = TDistributeArguments<Parameters, InstantiatedArguments, Expression>,
  ReturnTypes extends TSchema[] = TCallDistributed<Context, State, Target, Parameters, Expression, DistributedArguments>,
  Result extends TSchema = ReturnTypes['length'] extends 1 ? ReturnTypes[0] : TEvaluateUnion<ReturnTypes>
> = Result
function CallImmediate<Context extends TProperties, State extends TState, Target extends TRef, Parameters extends TParameter[], Expression extends TSchema, InstantiatedArguments extends TSchema[]>
  (context: Context, state: State, target: Target, parameters: [...Parameters], expression: Expression, arguments_: [...InstantiatedArguments]):
    TCallImmediate<Context, State, Target, Parameters, Expression, InstantiatedArguments> {
  const distributedArguments = DistributeArguments(parameters, arguments_, expression) as TSchema[][]
  const returnTypes = CallDistributed(context, state, target, parameters, expression, distributedArguments) as TSchema[]
  const result = Guard.IsEqual(returnTypes.length, 1) ? returnTypes[0] : EvaluateUnion(returnTypes)
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
    ? TIsTailReturn<State, Name> extends true
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
      ? IsTailReturn(state, name)
        ? CallConstruct(Ref(name), instantiatedArguments)
        : CallImmediate(context, state, Ref(name), type.parameters, type.expression, instantiatedArguments)
      : CallConstruct(target, instantiatedArguments)
  )
  return result as never
}