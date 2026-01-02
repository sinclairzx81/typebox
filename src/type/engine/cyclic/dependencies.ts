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

import { type TUnreachable, Unreachable } from '../../../system/unreachable/index.ts'

import { type TSchema } from '../../types/schema.ts'
import { type TArray, IsArray } from '../../types/array.ts'
import { type TConstructor, IsConstructor } from '../../types/constructor.ts'
import { type TFunction, IsFunction } from '../../types/function.ts'
import { type TIntersect, IsIntersect } from '../../types/intersect.ts'
import { type TObject, IsObject } from '../../types/object.ts'
import { type TProperties, type TPropertyValues, PropertyValues } from '../../types/properties.ts'
import { type TRecord, IsRecord, RecordValue } from '../../types/record.ts'
import { type TTuple, IsTuple } from '../../types/tuple.ts'
import { type TUnion, IsUnion } from '../../types/union.ts'
import { type TRef, IsRef } from '../../types/ref.ts'

import { type TInterfaceDeferred, IsInterfaceDeferred } from '../../action/interface.ts'

// ------------------------------------------------------------------
// Ref
//
// deno-coverage-ignore-start - symmetric unreachable | internal
//
// This function will always receive keys in Context.
// ------------------------------------------------------------------
type TFromRef<Context extends TProperties, Ref extends string, Dependencies extends string[]> =
  Ref extends Dependencies[number]
  ? Dependencies
  : Ref extends keyof Context
    ? TFromType<Context, Context[Ref], [...Dependencies, Ref]>
    : TUnreachable
function FromRef<Context extends TProperties, Ref extends string, Dependencies extends string[]>
  (context: Context, ref: Ref, result: [...Dependencies]):
    TFromRef<Context, Ref, Dependencies> {
  return (
    result.includes(ref)
      ? result
      : ref in context
        ? FromType(context, context[ref], [...result, ref])
        : Unreachable()
  ) as never
}
// deno-coverage-ignore-stop
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
type TFromProperties<Context extends TProperties, Properties extends TProperties, Dependencies extends string[],
  Types extends TSchema[] = TPropertyValues<Properties>,
> = TFromTypes<Context, Types, Dependencies>
function FromProperties<Context extends TProperties, Properties extends TProperties, Dependencies extends string[]>
  (context: Context, properties: Properties, result: Dependencies):
    TFromProperties<Context, Properties, Dependencies> {
  const types = PropertyValues(properties) as TSchema[]
  return FromTypes(context, types, result) as never
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
type TFromTypes<Context extends TProperties, Types extends TSchema[], Dependencies extends string[]> =
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromTypes<Context, Right, TFromType<Context, Left, Dependencies>>
    : Dependencies
function FromTypes<Context extends TProperties, Types extends TSchema[], Dependencies extends string[]>
  (context: Context, types: [...Types], result: Dependencies):
    TFromTypes<Context, Types, Dependencies> {
  return types.reduce<string[]>((result, left) => {
    return FromType(context, left, result)
  }, result) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
type TFromType<Context extends TProperties, Type extends TSchema, Result extends string[]> = (
  Type extends TRef<infer Ref extends string> ? TFromRef<Context, Ref, Result> :
  Type extends TArray<infer Type extends TSchema> ? TFromType<Context, Type, Result> :
  Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TFromTypes<Context, [...Parameters, InstanceType], Result> :
  Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFromTypes<Context, [...Parameters, ReturnType], Result> :
  Type extends TInterfaceDeferred<TSchema[], infer Properties extends TProperties> ? TFromProperties<Context, Properties, Result> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TFromTypes<Context, Types, Result> :
  Type extends TObject<infer Properties extends TProperties> ? TFromProperties<Context, Properties, Result> :
  Type extends TUnion<infer Types extends TSchema[]> ? TFromTypes<Context, Types, Result> :
  Type extends TTuple<infer Types extends TSchema[]> ? TFromTypes<Context, Types, Result> :
  Type extends TRecord<string, infer Type extends TSchema> ? TFromType<Context, Type, Result> :
  Result
)
function FromType<Context extends TProperties, Type extends TSchema, Result extends string[]>
  (context: Context, type: Type, result: Result):
    TFromType<Context, Type, Result> {
  return (
    IsRef(type) ? FromRef(context, type.$ref, result) :
    IsArray(type) ? FromType(context, type.items, result) :
    IsConstructor(type) ? FromTypes(context, [...type.parameters, type.instanceType], result) :
    IsFunction(type) ? FromTypes(context, [...type.parameters, type.returnType], result) :
    IsInterfaceDeferred(type) ? FromProperties(context, type.parameters[1], result) :
    IsIntersect(type) ? FromTypes(context, type.allOf, result) :
    IsObject(type) ? FromProperties(context, type.properties, result) :
    IsUnion(type) ? FromTypes(context, type.anyOf, result) :
    IsTuple(type) ? FromTypes(context, type.items, result) :
    IsRecord(type) ? FromType(context, RecordValue(type), result) :
    result
  ) as never
}
// ------------------------------------------------------------------
// CyclicDependencies
// ------------------------------------------------------------------
/** Returns dependent cyclic keys for the given type. This function is used to dead-type-eliminate (DTE) for initializing TCyclic types. */
export type TCyclicDependencies<Context extends TProperties, Key extends string, Type extends TSchema,
  Result extends string[] = TFromType<Context, Type, [Key]>
> = Result

/** Returns dependent cyclic keys for the given type. This function is used to dead-type-eliminate (DTE) for initializing TCyclic types. */
export function CyclicDependencies<Context extends TProperties, Key extends string, Type extends TSchema>
  (context: Context, key: Key, type: Type):
    TCyclicDependencies<Context, Key, Type> {
  const result = FromType(context, type, [key])
  return result as never
}
