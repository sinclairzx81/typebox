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
// deno-lint-ignore-file

import { Guard } from '../../guard/index.ts'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
import { IsBase } from '../types/base.ts'
import { type TSchema, type TSchemaOptions } from '../types/schema.ts'
import { type TArray, _Array_, IsArray, ArrayOptions } from '../types/array.ts'
import { type TAsyncIterator, AsyncIterator, IsAsyncIterator, AsyncIteratorOptions } from '../types/async_iterator.ts'
import { type TConstructor, Constructor, IsConstructor, ConstructorOptions } from '../types/constructor.ts'
import { type TDeferred, Deferred, IsDeferred } from '../types/deferred.ts'
import { type TFunction, _Function_, IsFunction, FunctionOptions } from '../types/function.ts'
import { type TCall, IsCall } from '../types/call.ts'
import { type TIdentifier } from '../types/identifier.ts'
import { type TDependent, Dependent, IsDependent, DependentOptions } from '../types/dependent.ts'
import { type TIntersect, Intersect, IsIntersect, IntersectOptions } from '../types/intersect.ts'
import { type TIterator, Iterator, IsIterator, IteratorOptions } from '../types/iterator.ts'
import { type TObject, Object, IsObject, ObjectOptions } from '../types/object.ts'
import { type TPromise, _Promise_, IsPromise, PromiseOptions } from '../types/promise.ts'
import { type TProperties } from '../types/properties.ts'
import { type TRecord, RecordFromPattern, IsRecord, RecordPattern, RecordValue } from '../types/record.ts'
import { type TTuple, Tuple, IsTuple, TupleOptions } from '../types/tuple.ts'
import { type TUnion, Union, IsUnion, UnionOptions } from '../types/union.ts'
import { type TRef, IsRef } from '../types/ref.ts'
import { type TRest, Rest, IsRest } from '../types/rest.ts'

// ------------------------------------------------------------------
// Modifier Instantiate
// ------------------------------------------------------------------
import { type TAddImmutableInstantiate, AddImmutableInstantiate } from './immutable/instantiate_add.ts'
import { type TRemoveImmutableInstantiate, RemoveImmutableInstantiate } from './immutable/instantiate_remove.ts'
import { type TAddReadonlyInstantiate, AddReadonlyInstantiate } from './readonly/instantiate_add.ts'
import { type TRemoveReadonlyInstantiate, RemoveReadonlyInstantiate } from './readonly/instantiate_remove.ts'
import { type TAddOptionalInstantiate, AddOptionalInstantiate } from './optional/instantiate_add.ts'
import { type TRemoveOptionalInstantiate, RemoveOptionalInstantiate } from './optional/instantiate_remove.ts'
import { type TOptional, Optional, IsOptional } from '../types/_optional.ts'
import { type TImmutable, Immutable, IsImmutable } from '../types/_immutable.ts'
import { type TReadonly, Readonly, IsReadonly } from '../types/_readonly.ts'

// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
import { type TAwaitedInstantiate, AwaitedInstantiate } from './awaited/instantiate.ts'
import { type TCallInstantiate, CallInstantiate } from './call/instantiate.ts'
import { type TCapitalizeInstantiate, CapitalizeInstantiate } from './intrinsics/instantiate.ts'
import { type TConditionalInstantiate, ConditionalInstantiate } from './conditional/index.ts'
import { type TConstructorParametersInstantiate, ConstructorParametersInstantiate } from './constructor_parameters/instantiate.ts'
import { type TEvaluateInstantiate, EvaluateInstantiate } from './evaluate/instantiate.ts'
import { type TExcludeInstantiate, ExcludeInstantiate } from './exclude/instantiate.ts'
import { type TExtractInstantiate, ExtractInstantiate } from './extract/instantiate.ts'
import { type TIndexInstantiate, IndexInstantiate } from './indexed/instantiate.ts'
import { type TInstanceTypeInstantiate, InstanceTypeInstantiate } from './instance_type/instantiate.ts'
import { type TInterfaceInstantiate, InterfaceInstantiate } from './interface/instantiate.ts'
import { type TKeyOfInstantiate, KeyOfInstantiate } from './keyof/instantiate.ts'
import { type TLowercaseInstantiate, LowercaseInstantiate } from './intrinsics/instantiate.ts'
import { type TMappedInstantiate, MappedInstantiate } from './mapped/instantiate.ts'
import { type TModuleInstantiate, ModuleInstantiate } from './module/instantiate.ts'
import { type TNonNullableInstantiate, NonNullableInstantiate } from './non_nullable/instantiate.ts'
import { type TOmitInstantiate, OmitInstantiate } from './omit/instantiate.ts'
import { type TParametersInstantiate, ParametersInstantiate } from './parameters/instantiate.ts'
import { type TPartialInstantiate, PartialInstantiate } from './partial/instantiate.ts'
import { type TPickInstantiate, PickInstantiate } from './pick/instantiate.ts'
import { type TReadonlyObjectInstantiate, ReadonlyObjectInstantiate } from './readonly_object/instantiate.ts'
import { type TRecordInstantiate, RecordInstantiate } from './record/instantiate.ts'
import { type TRefInstantiate, RefInstantiate } from './ref/instantiate.ts'
import { type TRequiredInstantiate, RequiredInstantiate } from './required/instantiate.ts'
import { type TReturnTypeInstantiate, ReturnTypeInstantiate } from './return_type/instantiate.ts'
import { type TTemplateLiteralInstantiate, TemplateLiteralInstantiate } from './template_literal/instantiate.ts'
import { type TUncapitalizeInstantiate, UncapitalizeInstantiate } from './intrinsics/instantiate.ts'
import { type TUppercaseInstantiate, UppercaseInstantiate } from './intrinsics/instantiate.ts'
import { type TWithInstantiate, WithInstantiate } from './with/instantiate.ts'

import { type TRestSpread, RestSpread } from './rest/index.ts'

// ------------------------------------------------------------------
// InstantiateState
// ------------------------------------------------------------------
export interface TState<CallStack extends string[] = string[], Visited extends string[] = string[]> {
  callstack: CallStack
  visited: Visited
}
export function State<CallStack extends string[], Visited extends string[]>(callstack: CallStack, visited: Visited): TState<CallStack, Visited> {
  return { callstack, visited }
}
// ------------------------------------------------------------------
// CanInstantiate
// ------------------------------------------------------------------
export type TCanInstantiate<Types extends TSchema[]> =
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? Left extends TRef
  ? false
  : TCanInstantiate<Right>
  : true
export function CanInstantiate<Types extends TSchema[]>(types: [...Types]): TCanInstantiate<Types> {
  return Guard.ShiftLeft(types, (left, right) =>
    IsRef(left)
      ? false
      : CanInstantiate(right),
    () => true
  ) as never
}
// ------------------------------------------------------------------
// InstantiateProperties
// ------------------------------------------------------------------
export type TInstantiateProperties<Context extends TProperties, State extends TState, Properties extends TProperties,
  Result extends TProperties = {
    [Key in keyof Properties]: TInstantiateType<Context, State, Properties[Key]>
  }
> = Result
export function InstantiateProperties<Context extends TProperties, State extends TState, Properties extends TProperties>
  (context: Context, state: State, properties: TProperties):
  TInstantiateProperties<Context, State, Properties> {
  return Guard.Keys(properties).reduce((result, key) => {
    return { ...result, [key]: InstantiateType(context, state, properties[key] as never) as never }
  }, {}) as never
}
// ------------------------------------------------------------------
// InstantiateElements
// ------------------------------------------------------------------
export type TInstantiateElements<Context extends TProperties, State extends TState, Types extends TSchema[],
  Elements extends TSchema[] = TInstantiateTypes<Context, State, Types>,
  Result extends TSchema[] = TRestSpread<Elements>,
> = Result
export function InstantiateElements<Context extends TProperties, State extends TState, Types extends TSchema[]>
  (context: Context, state: State, types: [...Types]): TInstantiateElements<Context, State, Types> {
  const elements = InstantiateTypes(context, state, types) as TSchema[]
  const result = RestSpread(elements)
  return result as never
}
// ------------------------------------------------------------------
// InstantiateTypes
// ------------------------------------------------------------------
export type TInstantiateTypes<Context extends TProperties, State extends TState, Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? TInstantiateTypes<Context, State, Right, [...Result, TInstantiateType<Context, State, Left>]>
  : Result
)
export function InstantiateTypes<Context extends TProperties, State extends TState, Types extends TSchema[]>
  (context: Context, state: State, types: [...Types]):
  TInstantiateTypes<Context, State, Types> {
  return types.map(type => InstantiateType(context, state, type) as never) as never
}
// ------------------------------------------------------------------
// InstantiateDeferred
// ------------------------------------------------------------------
type TInstantiateDeferred<Context extends TProperties, State extends TState, Action extends string, Parameters extends TSchema[]> = (
  // Modifier Actions
  [Action, Parameters] extends ['AddImmutable', [infer Type extends TSchema]] ? TAddImmutableInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['RemoveImmutable', [infer Type extends TSchema]] ? TRemoveImmutableInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['AddReadonly', [infer Type extends TSchema]] ? TAddReadonlyInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['RemoveReadonly', [infer Type extends TSchema]] ? TRemoveReadonlyInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['AddOptional', [infer Type extends TSchema]] ? TAddOptionalInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['RemoveOptional', [infer Type extends TSchema]] ? TRemoveOptionalInstantiate<Context, State, Type> :
  // Actions
  [Action, Parameters] extends ['Awaited', [infer Type extends TSchema]] ? TAwaitedInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Capitalize', [infer Type extends TSchema]] ? TCapitalizeInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Conditional', [infer Left extends TSchema, infer Right extends TSchema, infer True extends TSchema, infer False extends TSchema]] ? TConditionalInstantiate<Context, State, Left, Right, True, False> :
  [Action, Parameters] extends ['ConstructorParameters', [infer Type extends TSchema]] ? TConstructorParametersInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Evaluate', [infer Type extends TSchema]] ? TEvaluateInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Exclude', [infer Left extends TSchema, infer Right extends TSchema]] ? TExcludeInstantiate<Context, State, Left, Right> :
  [Action, Parameters] extends ['Extract', [infer Left extends TSchema, infer Right extends TSchema]] ? TExtractInstantiate<Context, State, Left, Right> :
  [Action, Parameters] extends ['Index', [infer Type extends TSchema, infer Indexer extends TSchema]] ? TIndexInstantiate<Context, State, Type, Indexer> :
  [Action, Parameters] extends ['InstanceType', [infer Type extends TSchema]] ? TInstanceTypeInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Interface', [infer Heritage extends TSchema[], infer Properties extends TProperties]] ? TInterfaceInstantiate<Context, State, Heritage, Properties> :
  [Action, Parameters] extends ['KeyOf', [infer Type extends TSchema]] ? TKeyOfInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Lowercase', [infer Type extends TSchema]] ? TLowercaseInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Mapped', [infer Name extends TIdentifier, infer Key extends TSchema, infer As extends TSchema, infer Property extends TSchema]] ? TMappedInstantiate<Context, State, Name, Key, As, Property> :
  [Action, Parameters] extends ['Module', [infer Declarations extends TProperties]] ? TModuleInstantiate<Context, State, Declarations> :
  [Action, Parameters] extends ['NonNullable', [infer Type extends TSchema]] ? TNonNullableInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Pick', [infer Type extends TSchema, infer Indexer extends TSchema]] ? TPickInstantiate<Context, State, Type, Indexer> :
  [Action, Parameters] extends ['Parameters', [infer Type extends TSchema]] ? TParametersInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Partial', [infer Type extends TSchema]] ? TPartialInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Omit', [infer Type extends TSchema, infer Indexer extends TSchema]] ? TOmitInstantiate<Context, State, Type, Indexer> :
  [Action, Parameters] extends ['ReadonlyObject', [infer Type extends TSchema]] ? TReadonlyObjectInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Record', [infer Key extends TSchema, infer Value extends TSchema]] ? TRecordInstantiate<Context, State, Key, Value> :
  [Action, Parameters] extends ['Required', [infer Type extends TSchema]] ? TRequiredInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['ReturnType', [infer Type extends TSchema]] ? TReturnTypeInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['TemplateLiteral', [infer Types extends TSchema[]]] ? TTemplateLiteralInstantiate<Context, State, Types> :
  [Action, Parameters] extends ['Uncapitalize', [infer Type extends TSchema]] ? TUncapitalizeInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['Uppercase', [infer Type extends TSchema]] ? TUppercaseInstantiate<Context, State, Type> :
  [Action, Parameters] extends ['With', [infer Type extends TSchema, infer Options extends TSchema]] ? TWithInstantiate<Context, State, Type, Options> :
  TDeferred<Action, Parameters>
)
function InstantiateDeferred<Context extends TProperties, State extends TState, Action extends string, Parameters extends TSchema[]>
  (context: Context, state: State, action: Action, parameters: [...Parameters], options: TSchemaOptions):
  TInstantiateDeferred<Context, State, Action, Parameters> {
  return (
    // Modifier Actions
    Guard.IsEqual(action, 'AddImmutable') ? AddImmutableInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'RemoveImmutable') ? RemoveImmutableInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'AddReadonly') ? AddReadonlyInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'RemoveReadonly') ? RemoveReadonlyInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'AddOptional') ? AddOptionalInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'RemoveOptional') ? RemoveOptionalInstantiate(context, state, parameters[0], options) :
    // Actions
    Guard.IsEqual(action, 'Awaited') ? AwaitedInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Capitalize') ? CapitalizeInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Conditional') ? ConditionalInstantiate(context, state, parameters[0], parameters[1], parameters[2], parameters[3], options) :
    Guard.IsEqual(action, 'ConstructorParameters') ? ConstructorParametersInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Evaluate') ? EvaluateInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Exclude') ? ExcludeInstantiate(context, state, parameters[0], parameters[1], options) :
    Guard.IsEqual(action, 'Extract') ? ExtractInstantiate(context, state, parameters[0], parameters[1], options) :
    Guard.IsEqual(action, 'Index') ? IndexInstantiate(context, state, parameters[0], parameters[1], options) :
    Guard.IsEqual(action, 'InstanceType') ? InstanceTypeInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Interface') ? InterfaceInstantiate(context, state, parameters[0] as TSchema[], parameters[1] as TProperties, options) :
    Guard.IsEqual(action, 'KeyOf') ? KeyOfInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Lowercase') ? LowercaseInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Mapped') ? MappedInstantiate(context, state, parameters[0] as TIdentifier, parameters[1], parameters[2], parameters[3], options) :
    Guard.IsEqual(action, 'Module') ? ModuleInstantiate(context, state, parameters[0] as TProperties, options) :
    Guard.IsEqual(action, 'NonNullable') ? NonNullableInstantiate(context, state, parameters[0], options) as never :
    Guard.IsEqual(action, 'Pick') ? PickInstantiate(context, state, parameters[0], parameters[1], options) :
    Guard.IsEqual(action, 'Parameters') ? ParametersInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Partial') ? PartialInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Omit') ? OmitInstantiate(context, state, parameters[0], parameters[1], options) :
    Guard.IsEqual(action, 'ReadonlyObject') ? ReadonlyObjectInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Record') ? RecordInstantiate(context, state, parameters[0], parameters[1], options) :
    Guard.IsEqual(action, 'Required') ? RequiredInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'ReturnType') ? ReturnTypeInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'TemplateLiteral') ? TemplateLiteralInstantiate(context, state, parameters[0] as TSchema[], options) :
    Guard.IsEqual(action, 'Uncapitalize') ? UncapitalizeInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'Uppercase') ? UppercaseInstantiate(context, state, parameters[0], options) :
    Guard.IsEqual(action, 'With') ? WithInstantiate(context, state, parameters[0], parameters[1]) as never :
    Deferred(action, parameters, options)
  ) as never
}
// ------------------------------------------------------------------
// InstantiateImmediate
// ------------------------------------------------------------------
export type TInstantiateImmediate<Context extends TProperties, State extends TState, Type extends TSchema,
  Result extends TSchema = (
    Type extends TRef<infer Ref extends string> ? TRefInstantiate<Context, State, Type, Ref> :
    Type extends TArray<infer Type extends TSchema> ? TArray<TInstantiateType<Context, State, Type>> :
    Type extends TAsyncIterator<infer Type extends TSchema> ? TAsyncIterator<TInstantiateType<Context, State, Type>> :
    Type extends TCall<infer Target extends TSchema, infer Parameters extends TSchema[]> ? TCallInstantiate<Context, State, Target, Parameters> :
    Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TConstructor<TInstantiateTypes<Context, State, Parameters>, TInstantiateType<Context, State, InstanceType>> :
    Type extends TDeferred<infer Action extends string, infer Types extends TSchema[]> ? TInstantiateDeferred<Context, State, Action, Types> :
    Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFunction<TInstantiateTypes<Context, State, Parameters>, TInstantiateType<Context, State, ReturnType>> :
    Type extends TDependent<infer If extends TSchema, infer Then extends TSchema, infer Else extends TSchema> ? TDependent<TInstantiateType<Context, State, If>, TInstantiateType<Context, State, Then>, TInstantiateType<Context, State, Else>> :
    Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TInstantiateTypes<Context, State, Types>> :
    Type extends TIterator<infer Type extends TSchema> ? TIterator<TInstantiateType<Context, State, Type>> :
    Type extends TObject<infer Properties extends TProperties> ? TObject<TInstantiateProperties<Context, State, Properties>> :
    Type extends TPromise<infer Type extends TSchema> ? TPromise<TInstantiateType<Context, State, Type>> :
    Type extends TRecord<infer Key extends string, infer Type extends TSchema> ? TRecord<Key, TInstantiateType<Context, State, Type>> :
    Type extends TRest<infer Type extends TSchema> ? TRest<TInstantiateType<Context, State, Type>> :
    Type extends TTuple<infer Types extends TSchema[]> ? TTuple<TInstantiateElements<Context, State, Types>> :
    Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TInstantiateTypes<Context, State, Types>> :
    Type
  )
> = Result
export function InstantiateImmediate<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: Context, state: State, type: Type):
    TInstantiateImmediate<Context, State, Type> {
  type = (IsBase(type) ? type.Clone() : type) as Type
  const result = (
    IsRef(type) ? RefInstantiate(context, state, type, type.$ref) :
    IsArray(type) ? _Array_(InstantiateType(context, state, type.items), ArrayOptions(type)) :
    IsAsyncIterator(type) ? AsyncIterator(InstantiateType(context, state, type.iteratorItems), AsyncIteratorOptions(type)) :
    IsCall(type) ? CallInstantiate(context, state, type.target, type.arguments) :
    IsConstructor(type) ? Constructor(InstantiateTypes(context, state, type.parameters), InstantiateType(context, state, type.instanceType) as never, ConstructorOptions(type)) :
    IsDeferred(type) ? InstantiateDeferred(context, state, type.action, type.parameters, type.options) :
    IsFunction(type) ? _Function_(InstantiateTypes(context, state, type.parameters), InstantiateType(context, state, type.returnType) as never, FunctionOptions(type)) :
    IsDependent(type) ? Dependent(InstantiateType(context, state, type.if), InstantiateType(context, state, type.then), InstantiateType(context, state, type.else), DependentOptions(type)) :
    IsIntersect(type) ? Intersect(InstantiateTypes(context, state, type.allOf), IntersectOptions(type)) :
    IsIterator(type) ? Iterator(InstantiateType(context, state, type.iteratorItems), IteratorOptions(type)) :
    IsObject(type) ? Object(InstantiateProperties(context, state, type.properties), ObjectOptions(type)) :
    IsPromise(type) ? _Promise_(InstantiateType(context, state, type.item), PromiseOptions(type)) :
    IsRecord(type) ? RecordFromPattern(RecordPattern(type), InstantiateType(context, state, RecordValue(type))) :
    IsRest(type) ? Rest(InstantiateType(context, state, type.items)) :
    IsTuple(type) ? Tuple(InstantiateElements(context, state, type.items), TupleOptions(type)) :
    IsUnion(type) ? Union(InstantiateTypes(context, state, type.anyOf), UnionOptions(type)) :
    type
  )
  return result as never
}
// ------------------------------------------------------------------
// WithModifiers
// ------------------------------------------------------------------
type TWithModifiers<Type extends TSchema, InstantiatedType extends TSchema,
  WithImmutable extends TSchema = Type extends TImmutable ? TImmutable<InstantiatedType> : InstantiatedType,
  WithReadonly extends TSchema = Type extends TReadonly ? TReadonly<WithImmutable> : WithImmutable,
  WithOptional extends TSchema = Type extends TOptional ? TOptional<WithReadonly> : WithReadonly
> = WithOptional
function WithModifiers<Type extends TSchema, InstantiatedType extends TSchema>(type: Type, instantiatedType: InstantiatedType) {
  const withImmutable = IsImmutable(type) ? Immutable(instantiatedType) : instantiatedType
  const withReadonly = IsReadonly(type) ? Readonly(withImmutable) : withImmutable
  const withOptional = IsOptional(type) ? Optional(withReadonly) : withReadonly
  return withOptional as never
}
// ------------------------------------------------------------------
// InstantiateType
// ------------------------------------------------------------------
export type TInstantiateType<Context extends TProperties, State extends TState, Type extends TSchema,
  InstantiatedType extends TSchema = TInstantiateImmediate<Context, State, Type>,
  WithModifiers extends TSchema = Type extends TDeferred ? InstantiatedType : TWithModifiers<Type, InstantiatedType>
> = WithModifiers
export function InstantiateType<Context extends TProperties, State extends TState, Type extends TSchema>
  (context: TProperties, state: TState, type: Type): TInstantiateType<Context, State, Type> {
  const instantiatedType = InstantiateImmediate(context, state, type)
  const withModifiers = IsDeferred(type) ? instantiatedType : WithModifiers(type, instantiatedType)
  return withModifiers as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
/** Instantiates computed schematics using the given context and type. */
export type TInstantiate<Context extends TProperties, Type extends TSchema> = (
  TInstantiateType<Context, TState<[], []>, Type>
)
/** Instantiates computed schematics using the given context and type. */
export function Instantiate<Context extends TProperties, Type extends TSchema>
  (context: Context, type: Type):
  TInstantiate<Context, Type> {
  return InstantiateType(context, State([], []), type) as never
}