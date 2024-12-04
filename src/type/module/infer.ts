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

import { Ensure, Evaluate } from '../helpers/index'
import { TSchema } from '../schema/index'
import { TArray } from '../array/index'
import { TAsyncIterator } from '../async-iterator/index'
import { TConstructor } from '../constructor/index'
import { TEnum, TEnumRecord } from '../enum/index'
import { TFunction } from '../function/index'
import { TIntersect } from '../intersect/index'
import { TIterator } from '../iterator/index'
import { TObject, TProperties } from '../object/index'
import { TOptional } from '../optional/index'
import { TRecord } from '../record/index'
import { TReadonly } from '../readonly/index'
import { TRef } from '../ref/index'
import { TTuple } from '../tuple/index'
import { TUnion } from '../union/index'
import { Static } from '../static/index'

// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
type TInferArray<ModuleProperties extends TProperties, Type extends TSchema> = (
  Ensure<Array<TInfer<ModuleProperties, Type>>>
)
// ------------------------------------------------------------------
// AsyncIterator
// ------------------------------------------------------------------
// prettier-ignore
type TInferAsyncIterator<ModuleProperties extends TProperties, Type extends TSchema> = (
  Ensure<AsyncIterableIterator<TInfer<ModuleProperties, Type>>>
)
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
type TInferConstructor<ModuleProperties extends TProperties, Parameters extends TSchema[], InstanceType extends TSchema,> = Ensure<
  new (...args: TInferTuple<ModuleProperties, Parameters>) => TInfer<ModuleProperties, InstanceType>
>
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
type TInferFunction<ModuleProperties extends TProperties, Parameters extends TSchema[], ReturnType extends TSchema> = Ensure<
  (...args: TInferTuple<ModuleProperties, Parameters>) => TInfer<ModuleProperties, ReturnType>
>
// ------------------------------------------------------------------
// Iterator
// ------------------------------------------------------------------
// prettier-ignore
type TInferIterator<ModuleProperties extends TProperties, Type extends TSchema> = (
  Ensure<IterableIterator<TInfer<ModuleProperties, Type>>>
)
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
// prettier-ignore
type TInferIntersect<ModuleProperties extends TProperties, Types extends TSchema[], Result extends unknown = unknown> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TInferIntersect<ModuleProperties, Right, Result & TInfer<ModuleProperties, Left>>
    : Result
)
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
type ReadonlyOptionalPropertyKeys<Properties extends TProperties> = { [Key in keyof Properties]: Properties[Key] extends TReadonly<TSchema> ? (Properties[Key] extends TOptional<Properties[Key]> ? Key : never) : never }[keyof Properties]
type ReadonlyPropertyKeys<Source extends TProperties> = { [Key in keyof Source]: Source[Key] extends TReadonly<TSchema> ? (Source[Key] extends TOptional<Source[Key]> ? never : Key) : never }[keyof Source]
type OptionalPropertyKeys<Source extends TProperties> = { [Key in keyof Source]: Source[Key] extends TOptional<TSchema> ? (Source[Key] extends TReadonly<Source[Key]> ? never : Key) : never }[keyof Source]
type RequiredPropertyKeys<Source extends TProperties> = keyof Omit<Source, ReadonlyOptionalPropertyKeys<Source> | ReadonlyPropertyKeys<Source> | OptionalPropertyKeys<Source>>
// prettier-ignore
type InferPropertiesWithModifiers<Properties extends TProperties, Source extends Record<keyof any, unknown>> = Evaluate<(
  Readonly<Partial<Pick<Source, ReadonlyOptionalPropertyKeys<Properties>>>> &
  Readonly<Pick<Source, ReadonlyPropertyKeys<Properties>>> &
  Partial<Pick<Source, OptionalPropertyKeys<Properties>>> &
  Required<Pick<Source, RequiredPropertyKeys<Properties>>>
)>
// prettier-ignore
type InferProperties<ModuleProperties extends TProperties, Properties extends TProperties> = InferPropertiesWithModifiers<Properties, {
  [K in keyof Properties]: TInfer<ModuleProperties, Properties[K]>
}>
// prettier-ignore
type TInferObject<ModuleProperties extends TProperties, Properties extends TProperties> = (
  InferProperties<ModuleProperties, Properties>
)
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TInferTuple<ModuleProperties extends TProperties, Types extends TSchema[] , Result extends unknown[] = []> = (
  Types extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TInferTuple<ModuleProperties, R, [...Result, TInfer<ModuleProperties, L>]>
    : Result
)
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
// prettier-ignore
type TInferRecord<ModuleProperties extends TProperties, Key extends TSchema, Type extends TSchema,
  InferredKey extends PropertyKey = TInfer<ModuleProperties, Key> extends infer Key extends PropertyKey ? Key : never,
  InferedType extends unknown = TInfer<ModuleProperties, Type>,
> = Ensure<{ [_ in InferredKey]: InferedType }>
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
// prettier-ignore
type TInferRef<ModuleProperties extends TProperties, Ref extends string> = (
  Ref extends keyof ModuleProperties ? TInfer<ModuleProperties, ModuleProperties[Ref]> : unknown
)
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
// prettier-ignore
type TInferUnion<ModuleProperties extends TProperties, Types extends TSchema[], Result extends unknown = never> = (
  Types extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TInferUnion<ModuleProperties, R, Result | TInfer<ModuleProperties, L>>
    : Result
)
// ------------------------------------------------------------------
// Infer
// ------------------------------------------------------------------
// prettier-ignore
type TInfer<ModuleProperties extends TProperties, Type extends TSchema> = (
  Type extends TArray<infer Type extends TSchema> ? TInferArray<ModuleProperties, Type> :
  Type extends TAsyncIterator<infer Type extends TSchema> ? TInferAsyncIterator<ModuleProperties, Type> :
  Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TInferConstructor<ModuleProperties, Parameters, InstanceType> :
  Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TInferFunction<ModuleProperties, Parameters, ReturnType> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TInferIntersect<ModuleProperties, Types> :
  Type extends TIterator<infer Type extends TSchema> ? TInferIterator<ModuleProperties, Type> :
  Type extends TObject<infer Properties extends TProperties> ? TInferObject<ModuleProperties, Properties> :
  Type extends TRecord<infer Key extends TSchema, infer Type extends TSchema> ? TInferRecord<ModuleProperties, Key, Type> :
  Type extends TRef<infer Ref extends string> ? TInferRef<ModuleProperties, Ref> :
  Type extends TTuple<infer Types extends TSchema[]> ? TInferTuple<ModuleProperties, Types> :
  Type extends TEnum<infer _ extends TEnumRecord> ? Static<Type> : // intercept enum before union
  Type extends TUnion<infer Types extends TSchema[]> ? TInferUnion<ModuleProperties, Types> :
  Static<Type>
)
// ------------------------------------------------------------------
// InferFromModuleKey
// ------------------------------------------------------------------
/** Inference Path for Imports. This type is used to compute TImport `static` */
// prettier-ignore
export type TInferFromModuleKey<ModuleProperties extends TProperties, Key extends PropertyKey> = (
  Key extends keyof ModuleProperties
    ? TInfer<ModuleProperties, ModuleProperties[Key]>
    : never
)
