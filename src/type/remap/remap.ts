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

import * as t from '@sinclair/typebox'

// ------------------------------------------------------------------
// Callback
// ------------------------------------------------------------------
export type TCallback = (schema: t.TSchema) => t.TSchema
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
type TApply<Type extends t.TSchema, Mapping extends TMapping,
  Mapped = (Mapping & { input: Type })['output'],
  Result = Mapped extends t.TSchema ? Mapped : never
> = Result
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<Properties extends t.TProperties, Mapping extends TMapping, Result extends t.TProperties = {
  [Key in keyof Properties]: TRemap<Properties[Key], Mapping>
}> = Result
function FromProperties(properties: t.TProperties, func: TCallback): t.TProperties {
  return globalThis.Object.getOwnPropertyNames(properties).reduce((result, key) => {
    return { ...result, [key]: Remap(properties[key], func) }
  }, {})
}
// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
// prettier-ignore
type TFromTypes<Types extends t.TSchema[], Mapping extends TMapping, Result extends t.TSchema[] = []> = (
  Types extends [infer Left extends t.TSchema, ...infer Right extends t.TSchema[]]
    ? TFromTypes<Right, Mapping, [...Result, TRemap<Left, Mapping>]>
    : Result
)
function FromTypes(types: t.TSchema[], callback: TCallback): t.TSchema[] {
  return types.map((type) => Remap(type, callback))
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
type TFromType<Type extends t.TSchema, Mapping extends TMapping, Result extends t.TSchema = (
  TApply<Type, Mapping>
)> = Result
function FromType(type: t.TSchema, callback: TCallback): t.TSchema {
  return callback(type)
}
// ------------------------------------------------------------------
// TRemap<Type, Function>
// ------------------------------------------------------------------
/** `[Internal]` Applies a recursive conditional remapping of a type and its sub type constituents */
// prettier-ignore
export type TRemap<Type extends t.TSchema, Mapping extends TMapping, 
  // Maps the Exterior Type
  Mapped extends t.TSchema = TFromType<Type, Mapping>, 
  // Maps the Interior Parameterized Types
  Result extends t.TSchema = (
    Mapped extends t.TConstructor<infer Parameters extends t.TSchema[], infer ReturnType extends t.TSchema> ? t.TConstructor<TFromTypes<Parameters, Mapping>, TFromType<ReturnType, Mapping>> :
    Mapped extends t.TFunction<infer Parameters extends t.TSchema[], infer ReturnType extends t.TSchema> ? t.TFunction<TFromTypes<Parameters, Mapping>, TFromType<ReturnType, Mapping>> :
    Mapped extends t.TIntersect<infer Types extends t.TSchema[]> ? t.TIntersect<TFromTypes<Types, Mapping>> :
    Mapped extends t.TUnion<infer Types extends t.TSchema[]> ? t.TUnion<TFromTypes<Types, Mapping>> :
    Mapped extends t.TTuple<infer Types extends t.TSchema[]> ? t.TTuple<TFromTypes<Types, Mapping>> :
    Mapped extends t.TArray<infer Type extends t.TSchema> ? t.TArray<TFromType<Type, Mapping>>:
    Mapped extends t.TAsyncIterator<infer Type extends t.TSchema> ? t.TAsyncIterator<TFromType<Type, Mapping>> :
    Mapped extends t.TIterator<infer Type extends t.TSchema> ? t.TIterator<TFromType<Type, Mapping>> :
    Mapped extends t.TPromise<infer Type extends t.TSchema> ? t.TPromise<TFromType<Type, Mapping>> :
    Mapped extends t.TObject<infer Properties extends t.TProperties> ? t.TObject<TFromProperties<Properties, Mapping>> :
    Mapped extends t.TRecord<infer Key extends t.TSchema, infer Value extends t.TSchema> ? t.TRecordOrObject<TFromType<Key, Mapping>, TFromType<Value, Mapping>> :
    Mapped
  )
> = Result
/** `[Internal]` Applies a recursive conditional remapping of a type and its sub type constituents */
// prettier-ignore
export function Remap(type: t.TSchema, callback: TCallback): t.TSchema {
  // Map incoming type
  const mapped = t.CloneType(FromType(type, callback))
  // Return remapped interior
  return (
    t.KindGuard.IsConstructor(type) ? t.Constructor(FromTypes(type.parameters, callback), FromType(type.returns, callback), mapped) :
    t.KindGuard.IsFunction(type) ? t.Function(FromTypes(type.parameters, callback), FromType(type.returns, callback), mapped) :
    t.KindGuard.IsIntersect(type) ? t.Intersect(FromTypes(type.allOf, callback), mapped) :
    t.KindGuard.IsUnion(type) ? t.Union(FromTypes(type.anyOf, callback), mapped) :
    t.KindGuard.IsTuple(type) ? t.Tuple(FromTypes(type.items || [], callback), mapped) :
    t.KindGuard.IsArray(type) ? t.Array(FromType(type.items, callback), mapped) :
    t.KindGuard.IsAsyncIterator(type) ? t.AsyncIterator(FromType(type.items, callback), mapped) :
    t.KindGuard.IsIterator(type) ? t.Iterator(FromType(type.items, callback), mapped) :
    t.KindGuard.IsPromise(type) ? t.Promise(FromType(type.items, callback), mapped) :
    t.KindGuard.IsObject(type) ? t.Object(FromProperties(type.properties, callback), mapped) :
    t.KindGuard.IsRecord(type) ? t.Record(FromType(t.RecordKey(type), callback), FromType(t.RecordValue(type), callback), mapped) :
    t.CloneType(mapped)
  )
}
