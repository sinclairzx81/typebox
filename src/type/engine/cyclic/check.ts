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

import { type TSchema, IsSchema } from '../../types/schema.ts'
import { type TArray, IsArray } from '../../types/array.ts'
import { type TAsyncIterator, IsAsyncIterator } from '../../types/async-iterator.ts'
import { type TConstructor, IsConstructor } from '../../types/constructor.ts'
import { type TFunction, IsFunction } from '../../types/function.ts'
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TIterator, IsIterator } from '../../types/iterator.ts'
import { type TObject, IsObject } from '../../types/object.ts'
import { type TPromise, IsPromise } from '../../types/promise.ts'
import { type TProperties, type TPropertyValues, PropertyValues } from '../../types/properties.ts'
import { type TRecord, IsRecord, RecordValue } from '../../types/record.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TRef, IsRef } from '../../types/ref.ts'

import { type TInterfaceDeferred, IsInterfaceDeferred } from '../../action/interface.ts'

// ------------------------------------------------------------------
// FromRef
// ------------------------------------------------------------------
type TFromRef<Stack extends string[], Context extends TProperties, Ref extends string> =
  Ref extends Stack[number]
  ? true
  : TFromType<[...Stack, Ref], Context, Context[Ref]>

function FromRef<Stack extends string[], Context extends TProperties, Ref extends string>
  (stack: [...Stack], context: Context, ref: Ref):
  TFromRef<Stack, Context, Ref> {
  return (
    stack.includes(ref)
      ? true
      : FromType([...stack, ref], context, context[ref])
  ) as never
}
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
type TFromProperties<Stack extends string[], Context extends TProperties, Properties extends TProperties,
  Types extends TSchema[] = TPropertyValues<Properties>,
> = TFromTypes<Stack, Context, Types>

function FromProperties<Stack extends string[], Context extends TProperties, Properties extends TProperties>
  (stack: [...Stack], context: Context, properties: Properties):
  TFromProperties<Stack, Context, Properties> {
  const types = PropertyValues(properties) as TSchema[]
  return FromTypes(stack, context, types) as never
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
type TFromTypes<Stack extends string[], Context extends TProperties, Types extends TSchema[]> =
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? TFromType<Stack, Context, Left> extends true
  ? true
  : TFromTypes<Stack, Context, Right>
  : false

function FromTypes<Stack extends string[], Context extends TProperties, Types extends TSchema[]>
  (stack: [...Stack], context: Context, types: [...Types]):
  TFromTypes<Stack, Context, Types> {
  const [left, ...right] = types
  return (
    IsSchema(left)
      ? FromType(stack, context, left)
        ? true
        : FromTypes(stack, context, right)
      : false
  ) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
type TFromType<Stack extends string[], Context extends TProperties, Type extends TSchema> = (
  Type extends TRef<infer Ref extends string> ? TFromRef<Stack, Context, Ref> :
  Type extends TArray<infer Type extends TSchema> ? TFromType<Stack, Context, Type> :
  Type extends TAsyncIterator<infer Type extends TSchema> ? TFromType<Stack, Context, Type> :
  Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TFromTypes<Stack, Context, [...Parameters, InstanceType]> :
  Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFromTypes<Stack, Context, [...Parameters, ReturnType]> :
  Type extends TInterfaceDeferred<TSchema[], infer Properties extends TProperties> ? TFromProperties<Stack, Context, Properties> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TFromTypes<Stack, Context, Types> :
  Type extends TIterator<infer Type extends TSchema> ? TFromType<Stack, Context, Type> :
  Type extends TObject<infer Properties extends TProperties> ? TFromProperties<Stack, Context, Properties> :
  Type extends TPromise<infer Type extends TSchema> ? TFromType<Stack, Context, Type> :
  Type extends TUnion<infer Types extends TSchema[]> ? TFromTypes<Stack, Context, Types> :
  Type extends TTuple<infer Types extends TSchema[]> ? TFromTypes<Stack, Context, Types> :
  Type extends TRecord<string, infer Type extends TSchema> ? TFromType<Stack, Context, Type> :
  false
)
function FromType<Stack extends string[], Context extends TProperties, Type extends TSchema>
  (stack: [...Stack], context: Context, type: Type):
  TFromType<Stack, Context, Type> {
  return (
    IsRef(type) ? FromRef(stack, context, type.$ref) :
    IsArray(type) ? FromType(stack, context, type.items) :
    IsAsyncIterator(type) ? FromType(stack, context, type.iteratorItems) :
    IsConstructor(type) ? FromTypes(stack, context, [...type.parameters, type.instanceType]) :
    IsFunction(type) ? FromTypes(stack, context, [...type.parameters, type.returnType]) :
    IsInterfaceDeferred(type) ? FromProperties(stack, context, type.parameters[1]) :
    IsIntersect(type) ? FromTypes(stack, context, type.allOf) :
    IsIterator(type) ? FromType(stack, context, type.iteratorItems) :
    IsObject(type) ? FromProperties(stack, context, type.properties) :
    IsPromise(type) ? FromType(stack, context, type.item) :
    IsUnion(type) ? FromTypes(stack, context, type.anyOf) :
    IsTuple(type) ? FromTypes(stack, context, type.items) :
    IsRecord(type) ? FromType(stack, context, RecordValue(type)) :
    false
  ) as never
}
// ------------------------------------------------------------------
// CyclicCheck
// ------------------------------------------------------------------
/** Performs a cyclic check on the given type. Initial key stack can be empty, but faster if specified */
export type TCyclicCheck<Stack extends string[], Context extends TProperties, Type extends TSchema,
  Result extends boolean = TFromType<Stack, Context, Type>
> = Result

/** Performs a cyclic check on the given type. Initial key stack can be empty, but faster if specified */
export function CyclicCheck<Stack extends string[], Context extends TProperties, Type extends TSchema>
  (stack: [...Stack], context: Context, type: Type):
  TCyclicCheck<Stack, Context, Type> {
  const result = FromType(stack, context, type)
  return result as never
}
