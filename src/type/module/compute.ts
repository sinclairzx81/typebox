/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { CreateType } from '../create/index'
import { Discard } from '../discard/index'
import { Ensure, Evaluate } from '../helpers/index'
import { type TSchema } from '../schema/index'
import { Array, type TArray } from '../array/index'
import { Awaited, type TAwaited } from '../awaited/index'
import { AsyncIterator, type TAsyncIterator } from '../async-iterator/index'
import { TComputed } from '../computed/index'
import { Constructor, type TConstructor } from '../constructor/index'
import { Index, type TIndex, type TIndexPropertyKeys } from '../indexed/index'
import { TEnum, type TEnumRecord } from '../enum/index'
import { Function as FunctionType, type TFunction } from '../function/index'
import { Intersect, type TIntersect, type TIntersectEvaluated } from '../intersect/index'
import { Iterator, type TIterator } from '../iterator/index'
import { KeyOf, type TKeyOf } from '../keyof/index'
import { Object, type TObject, type TProperties } from '../object/index'
import { Omit, type TOmit } from '../omit/index'
import { type TOptional } from '../optional/index'
import { Pick, type TPick } from '../pick/index'
import { Never, type TNever } from '../never/index'
import { Partial, TPartial } from '../partial/index'
import { type TReadonly } from '../readonly/index'
import { Record, type TRecordOrObject } from '../record/index'
import { type TRef } from '../ref/index'
import { Required, TRequired } from '../required/index'
import { Tuple, type TTuple } from '../tuple/index'
import { Union, type TUnion, type TUnionEvaluated } from '../union/index'

import { OptionalKind, ReadonlyKind } from '../symbols/index'
// ------------------------------------------------------------------
// KindGuard
// ------------------------------------------------------------------
import * as KindGuard from '../guard/kind'

// ------------------------------------------------------------------
// DerefParameters
//
// Dereferences TComputed parameters. It is important to note that
// dereferencing anything other than these parameters may result
// inference and evaluation problems, potentially resulting in a
// stack overflow. All open TRef types must be preserved !!!
//
// ------------------------------------------------------------------
// prettier-ignore
type TDerefParameters<ModuleProperties extends TProperties, Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? Left extends TRef<infer Key extends string>
      ? TDerefParameters<ModuleProperties, Right, [...Result, TDeref<ModuleProperties, Key>]>
      : TDerefParameters<ModuleProperties, Right, [...Result, TFromType<ModuleProperties, Left>]>
    : Result
)
// prettier-ignore
function DerefParameters<ModuleProperties extends TProperties, Types extends TSchema[]>(moduleProperties: ModuleProperties, types: [...Types]): TFromRest<ModuleProperties, Types> {
  return types.map((type) => {
    return KindGuard.IsRef(type)
      ? Deref(moduleProperties, type.$ref)
      : FromType(moduleProperties, type)
  }) as never
}
// prettier-ignore
type TDeref<ModuleProperties extends TProperties, Ref extends string, Result extends TSchema = (
  Ref extends keyof ModuleProperties
    ? ModuleProperties[Ref] extends TRef<infer Ref2 extends string> 
      ? TDeref<ModuleProperties, Ref2>
      : TFromType<ModuleProperties, ModuleProperties[Ref]>
    : TNever
)> = Result
// prettier-ignore
function Deref<ModuleProperties extends TProperties, Ref extends string>(moduleProperties: ModuleProperties, ref: Ref): TDeref<ModuleProperties, Ref> {
  return (
    ref in moduleProperties 
      ? KindGuard.IsRef(moduleProperties[ref])
        ? Deref(moduleProperties, moduleProperties[ref].$ref)
        : FromType(moduleProperties, moduleProperties[ref])
      : Never()
  ) as never
}
// ------------------------------------------------------------------
// Awaited
// ------------------------------------------------------------------
// prettier-ignore
type TFromAwaited<Parameters extends TSchema[]> = (
  Parameters extends [infer T0 extends TSchema] ? TAwaited<T0> : never
)
// prettier-ignore
function FromAwaited<Parameters extends TSchema[]>(parameters: Parameters): TFromAwaited<Parameters> {
  return Awaited(parameters[0]) as never
}
// ------------------------------------------------------------------
// Index
// ------------------------------------------------------------------
// prettier-ignore
type TFromIndex<Parameters extends TSchema[]> = (
  Parameters extends [infer T0 extends TSchema, infer T1 extends TSchema] 
    // Note: This inferred result check is required to mitgate a "as never" 
    // assertion on FromComputed resolution. This should be removed when
    // reimplementing TIndex to use TSchema as the primary key indexer.
    ? TIndex<T0, TIndexPropertyKeys<T1>> extends infer Result extends TSchema 
      ? Result
      : never
    : never
)
// prettier-ignore
function FromIndex<Parameters extends TSchema[]>(parameters: Parameters): TFromIndex<Parameters> {
  return Index(parameters[0], parameters[1]) as never
}
// ------------------------------------------------------------------
// KeyOf
// ------------------------------------------------------------------
// prettier-ignore
type TFromKeyOf<Parameters extends TSchema[]> = (
  Parameters extends [infer T0 extends TSchema] ? TKeyOf<T0> : never
)
// prettier-ignore
function FromKeyOf<Parameters extends TSchema[]>(parameters: Parameters): TFromAwaited<Parameters> {
  return KeyOf(parameters[0]) as never
}
// ------------------------------------------------------------------
// Partial
// ------------------------------------------------------------------
// prettier-ignore
type TFromPartial<Parameters extends TSchema[]> = (
  Parameters extends [infer T0 extends TSchema] ? TPartial<T0> : never
)
// prettier-ignore
function FromPartial<Parameters extends TSchema[]>(parameters: Parameters): TFromPartial<Parameters> {
  return Partial(parameters[0]) as never
}
// ------------------------------------------------------------------
// Omit
// ------------------------------------------------------------------
// prettier-ignore
type TFromOmit<Parameters extends TSchema[]> = (
  Parameters extends [infer T0 extends TSchema, infer T1 extends TSchema] ? TOmit<T0, T1> : never
)
// prettier-ignore
function FromOmit<Parameters extends TSchema[]>(parameters: Parameters): TFromPick<Parameters> {
  return Omit(parameters[0], parameters[1]) as never
}
// ------------------------------------------------------------------
// Pick
// ------------------------------------------------------------------
// prettier-ignore
type TFromPick<Parameters extends TSchema[]> = (
  Parameters extends [infer T0 extends TSchema, infer T1 extends TSchema] ? TPick<T0, T1> : never
)
// prettier-ignore
function FromPick<Parameters extends TSchema[]>(parameters: Parameters): TFromPick<Parameters> {
  return Pick(parameters[0], parameters[1]) as never
}
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
// prettier-ignore
type TFromRecord<Parameters extends TSchema[]> = (
  Parameters extends [infer T0 extends TSchema, infer T1 extends TSchema] ? TRecordOrObject<T0, T1> : never
)
// prettier-ignore
function FromRecord<Parameters extends TSchema[]>(parameters: Parameters): TFromPick<Parameters> {
  return Record(parameters[0], parameters[1]) as never
}
// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
// prettier-ignore
type TFromRequired<Parameters extends TSchema[]> = (
  Parameters extends [infer T0 extends TSchema] ? TRequired<T0> : never
)
// prettier-ignore
function FromRequired<Parameters extends TSchema[]>(parameters: Parameters): TFromPick<Parameters> {
  return Required(parameters[0]) as never
}
// ------------------------------------------------------------------
// Computed
// ------------------------------------------------------------------
// prettier-ignore
type TFromComputed<ModuleProperties extends TProperties, Target extends string, Parameters extends TSchema[],
  Dereferenced extends TSchema[] = TDerefParameters<ModuleProperties, Parameters>
> = (
  Target extends 'Awaited' ? TFromAwaited<Dereferenced> :
  Target extends 'Index' ? TFromIndex<Dereferenced> :
  Target extends 'KeyOf' ? TFromKeyOf<Dereferenced> :
  Target extends 'Partial' ? TFromPartial<Dereferenced> :
  Target extends 'Omit' ? TFromOmit<Dereferenced> :
  Target extends 'Pick' ? TFromPick<Dereferenced> :
  Target extends 'Record' ? TFromRecord<Dereferenced> :
  Target extends 'Required' ? TFromRequired<Dereferenced> :
  TNever
)
// prettier-ignore
function FromComputed<ModuleProperties extends TProperties, Target extends string, Parameters extends TSchema[]>(moduleProperties: ModuleProperties, target: Target, parameters: Parameters): TFromComputed<ModuleProperties, Target, Parameters> {
  const dereferenced = DerefParameters(moduleProperties, parameters)
  return (
    target === 'Awaited' ? FromAwaited(dereferenced) :
    target === 'Index' ? FromIndex(dereferenced) :
    target === 'KeyOf' ? FromKeyOf(dereferenced) :
    target === 'Partial' ? FromPartial(dereferenced) :
    target === 'Omit' ? FromOmit(dereferenced) :
    target === 'Pick' ? FromPick(dereferenced) :
    target === 'Record' ? FromRecord(dereferenced) :
    target === 'Required' ? FromRequired(dereferenced) :
    Never()
  ) as never
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
type TFromObject<ModuleProperties extends TProperties, Properties extends TProperties> = Ensure<TObject<Evaluate<{ 
  [Key in keyof Properties]: TFromType<ModuleProperties, Properties[Key]>
}>>>
function FromObject<ModuleProperties extends TProperties, Properties extends TProperties>(moduleProperties: ModuleProperties, properties: Properties): TFromObject<ModuleProperties, Properties> {
  return Object(
    globalThis.Object.keys(properties).reduce((result, key) => {
      return { ...result, [key]: FromType(moduleProperties, properties[key]) as never }
    }, {} as TProperties),
  ) as never
}
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
type TFromConstructor<ModuleProperties extends TProperties, Parameters extends TSchema[], InstanceType extends TSchema> = (
  TConstructor<TFromRest<ModuleProperties, Parameters>, TFromType<ModuleProperties, InstanceType>>
)
// prettier-ignore
function FromConstructor<ModuleProperties extends TProperties, Parameters extends TSchema[], InstanceType extends TSchema>(
  moduleProperties: ModuleProperties,
  parameters: [...Parameters],
  instanceType: InstanceType,
): TFromConstructor<ModuleProperties, Parameters, InstanceType> {
  return Constructor(FromRest(moduleProperties, parameters as never), FromType(moduleProperties, instanceType) as never) as never
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
type TFromFunction<ModuleProperties extends TProperties, Parameters extends TSchema[], ReturnType extends TSchema> = Ensure<
  Ensure<TFunction<TFromRest<ModuleProperties, Parameters>, TFromType<ModuleProperties, ReturnType>>>
>
// prettier-ignore
function FromFunction<ModuleProperties extends TProperties, Parameters extends TSchema[], ReturnType extends TSchema>(
  moduleProperties: ModuleProperties,
  parameters: [...Parameters],
  returnType: ReturnType,
): TFromFunction<ModuleProperties, Parameters, ReturnType> {
  return FunctionType(FromRest(moduleProperties, parameters as never), FromType(moduleProperties, returnType) as never) as never
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<ModuleProperties extends TProperties, Types extends TSchema[]> = (
  Ensure<TTuple<TFromRest<ModuleProperties, Types>>>
)
function FromTuple<ModuleProperties extends TProperties, Types extends TSchema[]>(moduleProperties: ModuleProperties, types: [...Types]): TFromTuple<ModuleProperties, Types> {
  return Tuple(FromRest(moduleProperties, types as never)) as never
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<ModuleProperties extends TProperties, Types extends TSchema[]> = (
  Ensure<TIntersectEvaluated<TFromRest<ModuleProperties, Types>>>
)
function FromIntersect<ModuleProperties extends TProperties, Types extends TSchema[]>(moduleProperties: ModuleProperties, types: [...Types]): TFromIntersect<ModuleProperties, Types> {
  return Intersect(FromRest(moduleProperties, types as never)) as never
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<ModuleProperties extends TProperties, Types extends TSchema[]> = (
  Ensure<TUnionEvaluated<TFromRest<ModuleProperties, Types>>>
)
function FromUnion<ModuleProperties extends TProperties, Types extends TSchema[]>(moduleProperties: ModuleProperties, types: [...Types]): TFromUnion<ModuleProperties, Types> {
  return Union(FromRest(moduleProperties, types as never)) as never
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
type TFromArray<ModuleProperties extends TProperties, Type extends TSchema> = (
  Ensure<TArray<TFromType<ModuleProperties, Type>>>
)
function FromArray<ModuleProperties extends TProperties, Type extends TSchema>(moduleProperties: ModuleProperties, type: Type): TFromArray<ModuleProperties, Type> {
  return Array(FromType(moduleProperties, type))
}
// ------------------------------------------------------------------
// AsyncIterator
// ------------------------------------------------------------------
// prettier-ignore
type TFromAsyncIterator<ModuleProperties extends TProperties, Type extends TSchema> = (
  TAsyncIterator<TFromType<ModuleProperties, Type>>
)
function FromAsyncIterator<ModuleProperties extends TProperties, Type extends TSchema>(moduleProperties: ModuleProperties, type: Type): TFromAsyncIterator<ModuleProperties, Type> {
  return AsyncIterator(FromType(moduleProperties, type))
}
// ------------------------------------------------------------------
// Iterator
// ------------------------------------------------------------------
// prettier-ignore
type TFromIterator<ModuleProperties extends TProperties, Type extends TSchema> = (
  TIterator<TFromType<ModuleProperties, Type>>
)
function FromIterator<ModuleProperties extends TProperties, Type extends TSchema>(moduleProperties: ModuleProperties, type: Type): TFromIterator<ModuleProperties, Type> {
  return Iterator(FromType(moduleProperties, type))
}
// ------------------------------------------------------------------
// Rest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<ModuleProperties extends TProperties, Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromRest<ModuleProperties, Right, [...Result, TFromType<ModuleProperties, Left>]>
    : Result
)
function FromRest<ModuleProperties extends TProperties, Types extends TSchema[]>(moduleProperties: ModuleProperties, types: [...Types]): TFromRest<ModuleProperties, Types> {
  return types.map((type) => FromType(moduleProperties, type)) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
export type TFromType<ModuleProperties extends TProperties, Type extends TSchema> = (
  // Modifier Unwrap
  Type extends TOptional<infer Type extends TSchema> ? TOptional<TFromType<ModuleProperties, Type>> :
  Type extends TReadonly<infer Type extends TSchema> ? TReadonly<TFromType<ModuleProperties, Type>> :
  // Traveral
  Type extends TArray<infer Type extends TSchema> ? TFromArray<ModuleProperties, Type> :
  Type extends TAsyncIterator<infer Type extends TSchema> ? TFromAsyncIterator<ModuleProperties, Type> :
  Type extends TComputed<infer Target extends string, infer Parameters extends TSchema[]> ? TFromComputed<ModuleProperties, Target, Parameters> :
  Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TFromConstructor<ModuleProperties, Parameters, InstanceType> :
  Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFromFunction<ModuleProperties, Parameters, ReturnType> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect<ModuleProperties, Types> :
  Type extends TIterator<infer Type extends TSchema> ? TFromIterator<ModuleProperties, Type> :
  Type extends TObject<infer Properties extends TProperties> ? TFromObject<ModuleProperties, Properties> :
  Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple<ModuleProperties, Types> :
  Type extends TEnum<infer _ extends TEnumRecord> ? Type : // intercept enum before union
  Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<ModuleProperties, Types> :
  Type
)
// prettier-ignore
export function FromType<ModuleProperties extends TProperties, Type extends TSchema>(moduleProperties: ModuleProperties, type: Type): TFromType<ModuleProperties, Type> {
  return (
    // Modifier Unwrap - Reapplied via CreateType Options
    KindGuard.IsOptional(type) ? CreateType(FromType(moduleProperties, Discard(type, [OptionalKind]) as TSchema) as never, type) :
    KindGuard.IsReadonly(type) ? CreateType(FromType(moduleProperties, Discard(type, [ReadonlyKind]) as TSchema) as never, type) :
    // Traveral
    KindGuard.IsArray(type) ? CreateType(FromArray(moduleProperties, type.items), type) :
    KindGuard.IsAsyncIterator(type) ? CreateType(FromAsyncIterator(moduleProperties, type.items), type) :
    KindGuard.IsComputed(type) ? CreateType(FromComputed(moduleProperties, type.target, type.parameters)) :
    KindGuard.IsConstructor(type) ? CreateType(FromConstructor(moduleProperties, type.parameters, type.returns), type) :
    KindGuard.IsFunction(type) ? CreateType(FromFunction(moduleProperties, type.parameters, type.returns), type) :
    KindGuard.IsIntersect(type) ? CreateType(FromIntersect(moduleProperties, type.allOf), type) :
    KindGuard.IsIterator(type) ? CreateType(FromIterator(moduleProperties, type.items), type) :
    KindGuard.IsObject(type) ? CreateType(FromObject(moduleProperties, type.properties), type) :
    KindGuard.IsTuple(type)? CreateType(FromTuple(moduleProperties, type.items || []), type) :
    KindGuard.IsUnion(type) ? CreateType(FromUnion(moduleProperties, type.anyOf), type) :
    type
  ) as never
}
// ------------------------------------------------------------------
// ComputeType
// ------------------------------------------------------------------
// prettier-ignore
export type TComputeType<ModuleProperties extends TProperties, Key extends PropertyKey> = (
  Key extends keyof ModuleProperties 
    ? TFromType<ModuleProperties, ModuleProperties[Key]> 
    : TNever
)
// prettier-ignore
export function ComputeType<ModuleProperties extends TProperties, Key extends PropertyKey>(moduleProperties: ModuleProperties, key: Key): TComputeType<ModuleProperties, Key> {
  return (
    key in moduleProperties 
      ? FromType(moduleProperties, moduleProperties[key as keyof ModuleProperties])
      : Never()
  ) as never
}
// ------------------------------------------------------------------
// ComputeModuleProperties
// ------------------------------------------------------------------
// prettier-ignore
export type TComputeModuleProperties<ModuleProperties extends TProperties> = Evaluate<{
  [Key in keyof ModuleProperties]: TComputeType<ModuleProperties, Key>
}>
// prettier-ignore
export function ComputeModuleProperties<ModuleProperties extends TProperties>(moduleProperties: ModuleProperties): TComputeModuleProperties<ModuleProperties> {
  return globalThis.Object.getOwnPropertyNames(moduleProperties).reduce((result, key) => {
    return {...result, [key]: ComputeType(moduleProperties, key) }
  }, {} as TProperties) as never
}
