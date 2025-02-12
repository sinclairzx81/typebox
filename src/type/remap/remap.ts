/*--------------------------------------------------------------------------

@sinclair/typebox/prototypes

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

import { TSchema } from '../schema/index'
import { Object, TObject, TProperties } from '../object/index'
import { Constructor, TConstructor } from '../constructor/index'
import { Function, TFunction } from '../function/index'
import { Intersect, TIntersect } from '../intersect/index'
import { Union, TUnion } from '../union/index'
import { Tuple, TTuple } from '../tuple/index'
import { Array, TArray } from '../array/index'
import { AsyncIterator, TAsyncIterator } from '../async-iterator/index'
import { Iterator, TIterator } from '../iterator/index'
import { Promise, TPromise } from '../promise/index'
import { Record, TRecord, TRecordOrObject, RecordKey, RecordValue } from '../record/index'

import * as KindGuard from '../guard/kind'
import { CloneType } from '../clone/type'

// ------------------------------------------------------------------
// Callback
// ------------------------------------------------------------------
export type TCallback = (schema: TSchema) => TSchema
// ------------------------------------------------------------------
// Mapping
// ------------------------------------------------------------------
export interface TMapping {
  input: unknown
  output: unknown
}
// ------------------------------------------------------------------
// Apply
// ------------------------------------------------------------------
// prettier-ignore
type TApply<Type extends TSchema, Mapping extends TMapping,
  Mapped = (Mapping & { input: Type })['output'],
  Result = Mapped extends TSchema ? Mapped : never
> = Result
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<Properties extends TProperties, Mapping extends TMapping, Result extends TProperties = {
  [Key in keyof Properties]: TRemap<Properties[Key], Mapping>
}> = Result
function FromProperties(properties: TProperties, func: TCallback): TProperties {
  return globalThis.Object.getOwnPropertyNames(properties).reduce((result, key) => {
    return { ...result, [key]: Remap(properties[key], func) }
  }, {})
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
// prettier-ignore
type TFromTypes<Types extends TSchema[], Mapping extends TMapping, Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromTypes<Right, Mapping, [...Result, TRemap<Left, Mapping>]>
    : Result
)
function FromTypes(types: TSchema[], callback: TCallback): TSchema[] {
  return types.map((type) => Remap(type, callback))
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
type TFromType<Type extends TSchema, Mapping extends TMapping, Result extends TSchema = (
  TApply<Type, Mapping>
)> = Result
function FromType(type: TSchema, callback: TCallback): TSchema {
  return callback(type)
}
// ------------------------------------------------------------------
// TRemap<Type, Function>
// ------------------------------------------------------------------
/** `[Internal]` Applies a recursive conditional remapping of a type and its sub type constituents */
// prettier-ignore
export type TRemap<Type extends TSchema, Mapping extends TMapping, 
  // Maps the Exterior Type
  Mapped extends TSchema = TFromType<Type, Mapping>, 
  // Maps the Interior Parameterized Types
  Result extends TSchema = (
    Mapped extends TConstructor<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TConstructor<TFromTypes<Parameters, Mapping>, TFromType<ReturnType, Mapping>> :
    Mapped extends TFunction<infer Parameters extends TSchema[], infer ReturnType extends TSchema> ? TFunction<TFromTypes<Parameters, Mapping>, TFromType<ReturnType, Mapping>> :
    Mapped extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TFromTypes<Types, Mapping>> :
    Mapped extends TUnion<infer Types extends TSchema[]> ? TUnion<TFromTypes<Types, Mapping>> :
    Mapped extends TTuple<infer Types extends TSchema[]> ? TTuple<TFromTypes<Types, Mapping>> :
    Mapped extends TArray<infer Type extends TSchema> ? TArray<TFromType<Type, Mapping>>:
    Mapped extends TAsyncIterator<infer Type extends TSchema> ? TAsyncIterator<TFromType<Type, Mapping>> :
    Mapped extends TIterator<infer Type extends TSchema> ? TIterator<TFromType<Type, Mapping>> :
    Mapped extends TPromise<infer Type extends TSchema> ? TPromise<TFromType<Type, Mapping>> :
    Mapped extends TObject<infer Properties extends TProperties> ? TObject<TFromProperties<Properties, Mapping>> :
    Mapped extends TRecord<infer Key extends TSchema, infer Value extends TSchema> ? TRecordOrObject<TFromType<Key, Mapping>, TFromType<Value, Mapping>> :
    Mapped
  )
> = Result
/** `[Internal]` Applies a recursive conditional remapping of a type and its sub type constituents */
// prettier-ignore
export function Remap(type: TSchema, callback: TCallback): TSchema {
  // Map incoming type
  const mapped = CloneType(FromType(type, callback))
  // Return remapped interior
  return (
    KindGuard.IsConstructor(type) ? Constructor(FromTypes(type.parameters, callback), FromType(type.returns, callback), mapped) :
    KindGuard.IsFunction(type) ? Function(FromTypes(type.parameters, callback), FromType(type.returns, callback), mapped) :
    KindGuard.IsIntersect(type) ? Intersect(FromTypes(type.allOf, callback), mapped) :
    KindGuard.IsUnion(type) ? Union(FromTypes(type.anyOf, callback), mapped) :
    KindGuard.IsTuple(type) ? Tuple(FromTypes(type.items || [], callback), mapped) :
    KindGuard.IsArray(type) ? Array(FromType(type.items, callback), mapped) :
    KindGuard.IsAsyncIterator(type) ? AsyncIterator(FromType(type.items, callback), mapped) :
    KindGuard.IsIterator(type) ? Iterator(FromType(type.items, callback), mapped) :
    KindGuard.IsPromise(type) ? Promise(FromType(type.items, callback), mapped) :
    KindGuard.IsObject(type) ? Object(FromProperties(type.properties, callback), mapped) :
    KindGuard.IsRecord(type) ? Record(FromType(RecordKey(type), callback), FromType(RecordValue(type), callback), mapped) :
    CloneType(mapped)
  )
}
