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

import * as Types from '@sinclair/typebox'

// ------------------------------------------------------------------
// Mapping: Functions and Type 
// ------------------------------------------------------------------
export type TMappingFunction = (schema: Types.TSchema) => Types.TSchema

export interface TMappingType {
  input: unknown
  output: unknown
}
// ------------------------------------------------------------------
// Record Parameters
// ------------------------------------------------------------------
function GetRecordPattern(record: Types.TRecord): string {
  return globalThis.Object.getOwnPropertyNames(record.patternProperties)[0]
}
function GetRecordKey(record: Types.TRecord): Types.TSchema {
  const pattern = GetRecordPattern(record)
  return (
    pattern === Types.PatternStringExact ? Types.String() :
    pattern === Types.PatternNumberExact ? Types.Number() :
    pattern === Types.PatternBooleanExact ? Types.Boolean() :
    Types.String({ pattern })
  )
}
function GetRecordValue(record: Types.TRecord): Types.TSchema {
  return record.patternProperties[GetRecordPattern(record)]
}
// ------------------------------------------------------------------
// Traversal
// ------------------------------------------------------------------
// prettier-ignore
type TApply<Type extends Types.TSchema, Func extends TMappingType,
  Mapped = (Func & { input: Type })['output'],
  Result = Mapped extends Types.TSchema ? Mapped : never
> = Result
// prettier-ignore
type TFromProperties<Properties extends Types.TProperties, Func extends TMappingType, Result extends Types.TProperties = {
  [Key in keyof Properties]: TRecursiveMap<Properties[Key], Func>
}> = Result
function FromProperties(properties: Types.TProperties, func: TMappingFunction): Types.TProperties {
  return globalThis.Object.getOwnPropertyNames(properties).reduce((result, key) => {
    return {...result, [key]: RecursiveMap(properties[key], func) }
  }, {})
}
// prettier-ignore
type TFromRest<Types extends Types.TSchema[], Func extends TMappingType, Result extends Types.TSchema[] = []> = (
  Types extends [infer Left extends Types.TSchema, ...infer Right extends Types.TSchema[]]
    ? TFromRest<Right, Func, [...Result, TRecursiveMap<Left, Func>]>
    : Result
)
function FromRest(types: Types.TSchema[], func: TMappingFunction): Types.TSchema[] {
  return types.map(type => RecursiveMap(type, func))
}
// prettier-ignore
type TFromType<Type extends Types.TSchema, Func extends TMappingType, Result extends Types.TSchema = (
  TApply<Type, Func>
)> = Result
function FromType(type: Types.TSchema, func: TMappingFunction): Types.TSchema {
  return func(type)
}
// ------------------------------------------------------------------
// TRecursiveMap<Type, Mapping>
// ------------------------------------------------------------------
/** `[Prototype]` Applies a deep recursive map across the given type and sub types. */
// prettier-ignore
export type TRecursiveMap<Type extends Types.TSchema, Func extends TMappingType, 
  // Maps the Exterior Type
  Exterior extends Types.TSchema = TFromType<Type, Func>, 
  // Maps the Interior Parameterized Types
  Interior extends Types.TSchema = (
    Exterior extends Types.TConstructor<infer Parameters extends Types.TSchema[], infer ReturnType extends Types.TSchema> ? Types.TConstructor<TFromRest<Parameters, Func>, TFromType<ReturnType, Func>> :
    Exterior extends Types.TFunction<infer Parameters extends Types.TSchema[], infer ReturnType extends Types.TSchema> ? Types.TFunction<TFromRest<Parameters, Func>, TFromType<ReturnType, Func>> :
    Exterior extends Types.TIntersect<infer Types extends Types.TSchema[]> ? Types.TIntersect<TFromRest<Types, Func>> :
    Exterior extends Types.TUnion<infer Types extends Types.TSchema[]> ? Types.TUnion<TFromRest<Types, Func>> :
    Exterior extends Types.TTuple<infer Types extends Types.TSchema[]> ? Types.TTuple<TFromRest<Types, Func>> :
    Exterior extends Types.TArray<infer Type extends Types.TSchema> ? Types.TArray<TFromType<Type, Func>>:
    Exterior extends Types.TAsyncIterator<infer Type extends Types.TSchema> ? Types.TAsyncIterator<TFromType<Type, Func>> :
    Exterior extends Types.TIterator<infer Type extends Types.TSchema> ? Types.TIterator<TFromType<Type, Func>> :
    Exterior extends Types.TPromise<infer Type extends Types.TSchema> ? Types.TPromise<TFromType<Type, Func>> :
    Exterior extends Types.TObject<infer Properties extends Types.TProperties> ? Types.TObject<TFromProperties<Properties, Func>> :
    Exterior extends Types.TRecord<infer Key extends Types.TSchema, infer Value extends Types.TSchema> ? Types.TRecordOrObject<TFromType<Key, Func>, TFromType<Value, Func>> :
    Exterior
  ),
  // Modifiers Derived from Exterior Type Mapping
  IsOptional extends number = Exterior extends Types.TOptional<Types.TSchema> ? 1 : 0,
  IsReadonly extends number = Exterior extends Types.TReadonly<Types.TSchema> ? 1 : 0,
  Result extends Types.TSchema = (
    [IsReadonly, IsOptional]  extends [1, 1] ? Types.TReadonlyOptional<Interior> :
    [IsReadonly, IsOptional]  extends [0, 1] ? Types.TOptional<Interior> :
    [IsReadonly, IsOptional]  extends [1, 0] ? Types.TReadonly<Interior> :
    Interior
  ) 
> = Result
/** `[Prototype]` Applies a deep recursive map across the given type and sub types. */
// prettier-ignore
export function RecursiveMap(type: Types.TSchema, func: TMappingFunction): Types.TSchema {
  // Maps the Exterior Type
  const exterior = Types.CloneType(FromType(type, func), type)
  // Maps the Interior Parameterized Types
  const interior = (
    Types.KindGuard.IsConstructor(type) ? Types.Constructor(FromRest(type.parameters, func), FromType(type.returns, func), exterior) :
    Types.KindGuard.IsFunction(type) ? Types.Function(FromRest(type.parameters, func), FromType(type.returns, func), exterior) :
    Types.KindGuard.IsIntersect(type) ? Types.Intersect(FromRest(type.allOf, func), exterior) :
    Types.KindGuard.IsUnion(type) ? Types.Union(FromRest(type.anyOf, func), exterior) :
    Types.KindGuard.IsTuple(type) ? Types.Tuple(FromRest(type.items || [], func), exterior) :
    Types.KindGuard.IsArray(type) ? Types.Array(FromType(type.items, func), exterior) :
    Types.KindGuard.IsAsyncIterator(type) ? Types.AsyncIterator(FromType(type.items, func), exterior) :
    Types.KindGuard.IsIterator(type) ? Types.Iterator(FromType(type.items, func), exterior) :
    Types.KindGuard.IsPromise(type) ? Types.Promise(FromType(type.items, func), exterior) :
    Types.KindGuard.IsObject(type) ? Types.Object(FromProperties(type.properties, func), exterior) :
    Types.KindGuard.IsRecord(type) ? Types.Record(FromType(GetRecordKey(type), func), FromType(GetRecordValue(type), func), exterior) :
    Types.CloneType(exterior, exterior)
  )
  // Modifiers Derived from Exterior Type Mapping
  const isOptional = Types.KindGuard.IsOptional(exterior)
  const isReadonly = Types.KindGuard.IsOptional(exterior)
  return (
    isOptional && isReadonly ? Types.ReadonlyOptional(interior) :
    isOptional ? Types.Optional(interior) :
    isReadonly ? Types.Readonly(interior) :
    interior
  )
}