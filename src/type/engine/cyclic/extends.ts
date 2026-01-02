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
import { type TAny, Any } from '../../types/any.ts'
import { type TArray, Array, IsArray, ArrayOptions } from '../../types/array.ts'
import { type TConstructor, Constructor, IsConstructor } from '../../types/constructor.ts'
import { type TCyclic } from '../../types/cyclic.ts'
import { type TFunction, Function as _Function, IsFunction } from '../../types/function.ts'
import { type TIntersect, Intersect, IsIntersect } from '../../types/intersect.ts'
import { type TObject, Object, IsObject } from '../../types/object.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TRecord, IsRecord, Record, RecordKey, RecordValue } from '../../types/record.ts'
import { type TRef, IsRef } from '../../types/ref.ts'
import { type TTuple, Tuple, IsTuple } from '../../types/tuple.ts'
import { type TUnion, Union, IsUnion } from '../../types/union.ts'
import { type TUnknown, Unknown } from '../../types/unknown.ts'

// ------------------------------------------------------------------
// FromRef
// ------------------------------------------------------------------
type TFromRef<_Ref extends string> = (
  TAny
)
function FromRef<Ref extends string>(_ref: Ref): TFromRef<Ref> {
  return Any()
}
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
type TFromProperties<Properties extends TProperties, Result extends TProperties = {
  [Key in keyof Properties]: TFromType<Properties[Key]>
}> = { [Key in keyof Result]: Result[Key] }

function FromProperties<Properties extends TProperties>(properties: Properties): TFromProperties<Properties> {
  return Guard.Keys(properties).reduce((result, key) => {
    return { ...result, [key]: FromType(properties[key]) }
  }, {} as TProperties) as never
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
type TFromTypes<Types extends TSchema[], Result extends TSchema[] = []> =
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
  ? TFromTypes<Right, [...Result, TFromType<Left>]>
  : Result

function FromTypes<Types extends TSchema[]>(types: [...Types]): TFromTypes<Types> {
  return types.reduce((result, left) => {
    return [...result, FromType(left)]
  }, [] as TSchema[]) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
type TFromType<Type extends TSchema> = (
  Type extends TRef<infer Ref extends string> ? TFromRef<Ref> :
  Type extends TArray<infer Type extends TSchema> ? TArray<TFromType<Type>> :
  Type extends TConstructor<infer Parameters extends TSchema[], infer InstanceType extends TSchema> ? TFunction<TFromTypes<Parameters>, TFromType<InstanceType>> :
  Type extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFunction<TFromTypes<Parameters>, TFromType<ReturnType>> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TFromTypes<Types>> :
  Type extends TObject<infer Properties extends TProperties> ? TObject<TFromProperties<Properties>> :
  Type extends TRecord<infer Pattern extends string, infer Value extends TSchema> ? TRecord<Pattern, TFromType<Value>> :
  Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TFromTypes<Types>> :
  Type extends TTuple<infer Types extends TSchema[]> ? TTuple<TFromTypes<Types>> :
  Type
)
function FromType<Type extends TSchema>(type: Type): TFromType<Type> {
  return (
    IsRef(type) ? FromRef(type.$ref) :
    IsArray(type) ? Array(FromType(type.items), ArrayOptions(type)) :
    IsConstructor(type) ? Constructor(FromTypes(type.parameters), FromType(type.instanceType)) :
    IsFunction(type) ? _Function(FromTypes(type.parameters), FromType(type.returnType)) :
    IsIntersect(type) ? Intersect(FromTypes(type.allOf)) :
    IsObject(type) ? Object(FromProperties(type.properties)) :
    IsRecord(type) ? Record(RecordKey(type), FromType(RecordValue(type))) :
    IsUnion(type) ? Union(FromTypes(type.anyOf)) :
    IsTuple(type) ? Tuple(FromTypes(type.items)) :
    type
  ) as never
}
// ------------------------------------------------------------------
// CyclicAnyFromParameters
// ------------------------------------------------------------------
type TCyclicAnyFromParameters<Defs extends TProperties, Ref extends string> =  (
  Ref extends keyof Defs
    ? TFromType<Defs[Ref]>
    : TUnknown
)
function CyclicAnyFromParameters<Defs extends TProperties, Ref extends string>(defs: Defs, ref: Ref): TCyclicAnyFromParameters<Defs, Ref> {
  return (
    ref in defs
      ? FromType(defs[ref])
      : Unknown()
  ) as never
}
// ------------------------------------------------------------------
// CyclicExtends
// ------------------------------------------------------------------
/** Transforms TCyclic TRef's into TAny's. This function is used prior to TExtends checks to enable cyclics to be structurally checked and terminated (with TAny) at first point of recursion, what would otherwise be a recursive TRef.*/
export type TCyclicExtends<Type extends TCyclic,
  Result extends TSchema = TCyclicAnyFromParameters<Type['$defs'], Type['$ref']>
> = Result

/** Transforms TCyclic TRef's into TAny's. This function is used prior to TExtends checks to enable cyclics to be structurally checked and terminated (with TAny) at first point of recursion, what would otherwise be a recursive TRef.*/
export function CyclicExtends<Type extends TCyclic>(type: Type): TCyclicExtends<Type> {
  return CyclicAnyFromParameters(type.$defs, type.$ref) as never
}