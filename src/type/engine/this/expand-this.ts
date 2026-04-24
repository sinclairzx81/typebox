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

import { type TArray, IsArray, _Array_ } from '../../types/array.ts'
import { type TAsyncIterator, IsAsyncIterator, AsyncIterator } from '../../types/async-iterator.ts'
import { type TConstructor, IsConstructor, Constructor } from '../../types/constructor.ts'
import { type TFunction, IsFunction, _Function_ } from '../../types/function.ts'
import { type TIterator, IsIterator, Iterator } from '../../types/iterator.ts'
import { type TIntersect, IsIntersect, Intersect } from '../../types/intersect.ts'
import { type TObject, _Object_ } from '../../types/object.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TPromise, IsPromise, Promise } from '../../types/promise.ts'
import { type TTuple, IsTuple, Tuple } from '../../types/tuple.ts'
import { type TThis, IsThis } from '../../types/this.ts'
import { type TUnion, IsUnion, Union } from '../../types/union.ts'

// ------------------------------------------------------------------
// FromTypes
// ------------------------------------------------------------------
type TFromTypes<Properties extends TProperties, Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromTypes<Properties, Right, [...Result, TFromType<Properties, Left>]>
    : Result
)
function FromTypes<Properties extends TProperties, Types extends TSchema[]>(properties: Properties, types: [...Types]): TFromTypes<Properties, Types> {
  return types.map(type => FromType(properties, type)) as never
}
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
export type TFromType<Properties extends TProperties, Type extends TSchema> = (
  Type extends TArray<infer Type extends TSchema> ? TArray<TFromType<Properties, Type>> :
  Type extends TAsyncIterator<infer Type extends TSchema> ? TAsyncIterator<TFromType<Properties, Type>> :
  Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TConstructor<TFromTypes<Properties, Parameters>, TFromType<Properties, InstanceType>> :
  Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFunction<TFromTypes<Properties, Parameters>, TFromType<Properties, ReturnType>> :
  Type extends TIterator<infer Type extends TSchema> ? TIterator<TFromType<Properties, Type>> :
  Type extends TPromise<infer Type extends TSchema> ? TPromise<TFromType<Properties, Type>> :
  Type extends TTuple<infer Types extends TSchema[]> ? TTuple<TFromTypes<Properties, Types>> :
  Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TFromTypes<Properties, Types>> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TFromTypes<Properties, Types>> :
  Type extends TThis ? TObject<Properties> :
  Type
)
export function FromType<Properties extends TProperties, Type extends TSchema>(properties: Properties, type: Type): TFromType<Properties, Type> {
  return (
    IsArray(type) ? _Array_(FromType(properties, type.items)) :
    IsAsyncIterator(type) ? AsyncIterator(FromType(properties, type.iteratorItems)) :
    IsConstructor(type) ? Constructor(FromTypes(properties, type.parameters), FromType(properties, type.instanceType)) :
    IsFunction(type) ? _Function_(FromTypes(properties, type.parameters), FromType(properties, type.returnType)) :
    IsIterator(type) ? Iterator(FromType(properties, type.iteratorItems)) :
    IsPromise(type) ? Promise(FromType(properties, type.item)) :
    IsTuple(type) ? Tuple(FromTypes(properties, type.items)) :
    IsUnion(type) ? Union(FromTypes(properties, type.anyOf)) :
    IsIntersect(type) ? Intersect(FromTypes(properties, type.allOf)) :
    IsThis(type) ? _Object_(properties) :
    type
  ) as never
}
// ------------------------------------------------------------------
// ExpandThis
//
// Performs a single-step unroll of a recursive type by substituting
// TThis references with the TObject they resolve to. The substitution
// is shallow, terminating at the first TThis encountered rather than
// recursing into the expanded object. This mirrors how TypeScript
// expands circular references when resolving indexed access types.
//
// ------------------------------------------------------------------
export type TExpandThis<Properties extends TProperties, Type extends TSchema,
  Result extends TSchema = TFromType<Properties, Type>
> = Result
export function ExpandThis<Properties extends TProperties, Type extends TSchema>(properties: TProperties, type: Type): TExpandThis<Properties, Type> {
  const result = FromType(properties, type)
  return result as never
}
