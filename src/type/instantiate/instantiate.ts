/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { CloneType } from '../clone/type'
import { type TSchema } from '../schema/index'
import { type TArgument } from '../argument/index'
import { type TNever, Never } from '../never/index'
import { type TReadonlyOptional, ReadonlyOptional } from '../readonly-optional/index'
import { type TReadonly, Readonly } from '../readonly/index'
import { type TOptional, Optional } from '../optional/index'
import { type TConstructor } from '../constructor/index'
import { type TFunction } from '../function/index'
import { type TIntersect } from '../intersect/index'
import { type TUnion } from '../union/index'
import { type TTuple } from '../tuple/index'
import { type TArray } from '../array/index'
import { type TAsyncIterator } from '../async-iterator/index'
import { type TIterator } from '../iterator/index'
import { type TPromise } from '../promise/index'
import { type TObject, type TProperties } from '../object/index'
import { type TRecordOrObject, type TRecord, Record, RecordKey, RecordValue } from '../record/index'

import * as ValueGuard from '../guard/value'
import * as KindGuard from '../guard/kind'

// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
type TFromConstructor<Args extends TSchema[], Parameters extends TSchema[], InstanceType extends TSchema,
  Result extends TConstructor = TConstructor<TFromTypes<Args, Parameters>, TFromType<Args, InstanceType>>
> = Result
// prettier-ignore
function FromConstructor(args: TSchema[], type: TConstructor): TConstructor {
  type.parameters = FromTypes(args, type.parameters)
  type.returns = FromType(args, type.returns)
  return type
}
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
type TFromFunction<Args extends TSchema[], Parameters extends TSchema[], ReturnType extends TSchema,
  Result extends TFunction = TFunction<TFromTypes<Args, Parameters>, TFromType<Args, ReturnType>>
> = Result
// prettier-ignore
function FromFunction(args: TSchema[], type: TFunction): TFunction {
  type.parameters = FromTypes(args, type.parameters)
  type.returns = FromType(args, type.returns)
  return type
}
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Args extends TSchema[], Types extends TSchema[],
  Result extends TIntersect = TIntersect<TFromTypes<Args, Types>>
> = Result
// prettier-ignore
function FromIntersect(args: TSchema[], type: TIntersect): TIntersect {
  type.allOf = FromTypes(args, type.allOf)
  return type
}
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Args extends TSchema[], Types extends TSchema[],
  Result extends TUnion = TUnion<TFromTypes<Args, Types>>
> = Result
// prettier-ignore
function FromUnion(args: TSchema[], type: TUnion): TUnion {
  type.anyOf = FromTypes(args, type.anyOf)
  return type
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<Args extends TSchema[], Types extends TSchema[],
  Result extends TTuple = TTuple<TFromTypes<Args, Types>>
> = Result
// prettier-ignore
function FromTuple(args: TSchema[], type: TTuple): TTuple {
  if(ValueGuard.IsUndefined(type.items)) return type
  type.items = FromTypes(args, type.items!)
  return type
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
type TFromArray<Args extends TSchema[], Type extends TSchema,
  Result extends TArray = TArray<TFromType<Args, Type>>
> = Result
// prettier-ignore
function FromArray(args: TSchema[], type: TArray): TArray {
  type.items = FromType(args, type.items)
  return type
}
// ------------------------------------------------------------------
// AsyncIterator
// ------------------------------------------------------------------
// prettier-ignore
type TFromAsyncIterator<Args extends TSchema[], Type extends TSchema,
  Result extends TAsyncIterator = TAsyncIterator<TFromType<Args, Type>>
> = Result
// prettier-ignore
function FromAsyncIterator(args: TSchema[], type: TAsyncIterator): TAsyncIterator {
  type.items = FromType(args, type.items)
  return type
}
// ------------------------------------------------------------------
// Iterator
// ------------------------------------------------------------------
// prettier-ignore
type TFromIterator<Args extends TSchema[], Type extends TSchema,
  Result extends TIterator = TIterator<TFromType<Args, Type>>
> = Result
// prettier-ignore
function FromIterator(args: TSchema[], type: TIterator): TIterator {
  type.items = FromType(args, type.items)
  return type
}
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
// prettier-ignore
type TFromPromise<Args extends TSchema[], Type extends TSchema,
  Result extends TPromise = TPromise<TFromType<Args, Type>>
> = Result
// prettier-ignore
function FromPromise(args: TSchema[], type: TPromise): TPromise {
  type.item = FromType(args, type.item)
  return type
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
type TFromObject<Args extends TSchema[], Properties extends TProperties,
  Result extends TObject = TObject<TFromProperties<Args, Properties>>
> = Result
// prettier-ignore
function FromObject(args: TSchema[], type: TObject): TObject {
  type.properties = FromProperties(args, type.properties)
  return type
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
type TFromRecord<Args extends TSchema[], Key extends TSchema, Value extends TSchema,
  MappedKey extends TSchema = TFromType<Args, Key>,
  MappedValue extends TSchema = TFromType<Args, Value>,
  Result extends TSchema = TRecordOrObject<MappedKey, MappedValue>
> = Result
// prettier-ignore
function FromRecord(args: TSchema[], type: TRecord): TRecord {
  const mappedKey = FromType(args, RecordKey(type))
  const mappedValue = FromType(args, RecordValue(type))
  const result = Record(mappedKey, mappedValue)
  return { ...type, ... result } as never // retain options
}
// ------------------------------------------------------------------
// Argument
// ------------------------------------------------------------------
// prettier-ignore
type TFromArgument<Args extends TSchema[], Index extends number> = (
  Index extends keyof Args ? Args[Index] : TNever
)
// prettier-ignore
function FromArgument(args: TSchema[], argument: TArgument): TSchema {
  return argument.index in args ? args[argument.index] : Never()
}
// ------------------------------------------------------------------
// Property
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperty<Args extends TSchema[], Type extends TSchema,
  IsReadonly extends boolean = Type extends TReadonly<Type> ? true : false,   
  IsOptional extends boolean = Type extends TOptional<Type> ? true : false,
  Mapped extends TSchema = TFromType<Args, Type>,
  Result extends TSchema = (
    [IsReadonly, IsOptional] extends [true, true] ? TReadonlyOptional<Mapped> :
    [IsReadonly, IsOptional] extends [true, false] ? TReadonly<Mapped> :
    [IsReadonly, IsOptional] extends [false, true] ? TOptional<Mapped> :
    Mapped
  )
> = Result
// prettier-ignore
function FromProperty<Args extends TSchema[], Type extends TSchema>(args: [...Args], type: Type): TFromProperty<Args, Type> {
  const isReadonly = KindGuard.IsReadonly(type)
  const isOptional = KindGuard.IsOptional(type)
  const mapped = FromType(args, type)
  return (
    isReadonly && isOptional ? ReadonlyOptional(mapped) :
    isReadonly && !isOptional ? Readonly(mapped) :
    !isReadonly && isOptional ? Optional(mapped) :
    mapped
  ) as never
}
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<Args extends TSchema[], Properties extends TProperties, 
  Result extends TProperties = {
    [Key in keyof Properties]: TFromProperty<Args, Properties[Key]>
  }
> = Result
// prettier-ignore
function FromProperties<Args extends TSchema[], Properties extends TProperties>(args: TSchema[], properties: TProperties): TFromProperties<Args, Properties> {
  return globalThis.Object.getOwnPropertyNames(properties).reduce((result, key) => {
    return { ...result, [key]: FromProperty(args, properties[key]) }
  }, {}) as never
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
// prettier-ignore
export type TFromTypes<Args extends TSchema[], Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromTypes<Args, Right, [...Result, TFromType<Args, Left>]>
    : Result
)
// prettier-ignore
export function FromTypes<Args extends TSchema[], Types extends TSchema[]>(args: [...Args], types: [...Types]): TFromTypes<Args, Types> {
  return types.map(type => FromType(args, type)) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
export type TFromType<Args extends TSchema[], Type extends TSchema> = (
  Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TFromConstructor<Args, Parameters, InstanceType> :
  Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFromFunction<Args, Parameters, ReturnType> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect<Args, Types> :
  Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Args, Types> :
  Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple<Args, Types> :
  Type extends TArray<infer Type extends TSchema> ? TFromArray<Args, Type>:
  Type extends TAsyncIterator<infer Type extends TSchema> ? TFromAsyncIterator<Args, Type> :
  Type extends TIterator<infer Type extends TSchema> ? TFromIterator<Args, Type> :
  Type extends TPromise<infer Type extends TSchema> ? TFromPromise<Args, Type> :
  Type extends TObject<infer Properties extends TProperties> ? TFromObject<Args, Properties> :
  Type extends TRecord<infer Key extends TSchema, infer Value extends TSchema> ? TFromRecord<Args, Key, Value> :
  Type extends TArgument<infer Index extends number> ? TFromArgument<Args, Index> :
  Type
)
// prettier-ignore
function FromType<Args extends TSchema[], Type extends TSchema>(args: [...Args], type: TSchema): TFromType<Args, Type> {
  return (
    KindGuard.IsConstructor(type) ? FromConstructor(args, type) :
    KindGuard.IsFunction(type) ? FromFunction(args, type) :
    KindGuard.IsIntersect(type) ? FromIntersect(args, type) :
    KindGuard.IsUnion(type) ? FromUnion(args, type) :
    KindGuard.IsTuple(type) ? FromTuple(args, type) :
    KindGuard.IsArray(type) ? FromArray(args, type) :
    KindGuard.IsAsyncIterator(type) ? FromAsyncIterator(args, type) :
    KindGuard.IsIterator(type) ? FromIterator(args, type) :
    KindGuard.IsPromise(type) ? FromPromise(args, type) :
    KindGuard.IsObject(type) ? FromObject(args, type):
    KindGuard.IsRecord(type) ? FromRecord(args, type) :
    KindGuard.IsArgument(type) ? FromArgument(args, type) :
    type
  ) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
/** `[JavaScript]` Instantiates a type with the given parameters */
// prettier-ignore
export type TInstantiate<Type extends TSchema, Args extends TSchema[],
  Result extends TSchema = TFromType<Args, Type>
> = Result

/** `[JavaScript]` Instantiates a type with the given parameters */
// prettier-ignore
export function Instantiate<Type extends TSchema, Args extends TSchema[]>(type: Type, args: [...Args]): TInstantiate<Type, Args> {
  return FromType(args, CloneType(type))
}
