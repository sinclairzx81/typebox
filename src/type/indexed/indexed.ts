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

import { CreateType } from '../create/type'
import { type TSchema, SchemaOptions } from '../schema/index'
import { Computed, type TComputed } from '../computed/index'
import { Literal, type TLiteral, type TLiteralValue } from '../literal/index'
import { type TObject, type TProperties } from '../object/index'
import { type Ensure, type Assert } from '../helpers/index'
import { Never, type TNever } from '../never/index'
import { type TRecursive } from '../recursive/index'
import { type TIntersect } from '../intersect/index'
import { TMappedResult, type TMappedKey } from '../mapped/index'
import { Union, type TUnion } from '../union/index'
import { type TTuple } from '../tuple/index'
import { type TArray } from '../array/index'
import { Ref, type TRef } from '../ref/index'
import { IntersectEvaluated, type TIntersectEvaluated } from '../intersect/index'
import { UnionEvaluated, type TUnionEvaluated } from '../union/index'

// ------------------------------------------------------------------
// Infrastructure
// ------------------------------------------------------------------
import { IndexPropertyKeys, type TIndexPropertyKeys } from './indexed-property-keys'
import { IndexFromMappedKey, type TIndexFromMappedKey } from './indexed-from-mapped-key'
import { IndexFromMappedResult, type TIndexFromMappedResult } from './indexed-from-mapped-result'

// ------------------------------------------------------------------
// KindGuard
// ------------------------------------------------------------------
import { IsArray, IsIntersect, IsObject, IsMappedKey, IsMappedResult, IsNever, IsSchema, IsTuple, IsUnion, IsLiteralValue, IsRef, IsComputed } from '../guard/kind'
import { IsArray as IsArrayValue } from '../guard/value'

// ------------------------------------------------------------------
// FromComputed
// ------------------------------------------------------------------
// prettier-ignore
// type TFromComputed<Target extends string, Parameters extends TSchema[]> = Ensure<
//   TComputed<'Partial', [TComputed<Target, Parameters>]>
// >
// // prettier-ignore
// function FromComputed<Target extends string, Parameters extends TSchema[]>(target: Target, parameters: Parameters): TFromComputed<Target, Parameters> {
//   return Computed('Partial', [Computed(target, parameters)]) as never
// }
// // ------------------------------------------------------------------
// // FromRef
// // ------------------------------------------------------------------
// // prettier-ignore
// type TFromRef<Ref extends string> = Ensure<
//   TComputed<'Partial', [TRef<Ref>]>
// >
// // prettier-ignore
// function FromRef<Ref extends string>($ref: Ref): TFromRef<Ref> {
//   return Computed('Partial', [Ref($ref)]) as never
// }

// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<T extends TSchema[], K extends PropertyKey, Result extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TFromRest<R, K, [...Result, Assert<TIndexFromPropertyKey<L, K>, TSchema>]>
    : Result
)
// prettier-ignore
function FromRest<Types extends TSchema[], K extends PropertyKey>(types: [...Types], key: K): TFromRest<Types, K> {
  return types.map(left => IndexFromPropertyKey(left, key)) as never
}
// ------------------------------------------------------------------
// FromIntersectRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersectRest<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? Left extends TNever
      ? TFromIntersectRest<Right, [...Result]>
      : TFromIntersectRest<Right, [...Result, Left]>
    : Result
)
// prettier-ignore
function FromIntersectRest<Types extends TSchema[]>(types: [...Types]): TFromIntersectRest<Types> {
  return types.filter(left => !IsNever(left)) as never
}
// prettier-ignore
type TFromIntersect<Types extends TSchema[], Key extends PropertyKey> = (
  TIntersectEvaluated<TFromIntersectRest<TFromRest<Types, Key>>>
)
// prettier-ignore
function FromIntersect<Types extends TSchema[], Key extends PropertyKey>(types: [...Types], key: Key): TFromIntersect<Types, Key> {
  return (
    IntersectEvaluated(FromIntersectRest(FromRest(types as TSchema[], key)))
  ) as never
}
// ------------------------------------------------------------------
// FromUnionRest
//
// The following accept a tuple of indexed key results. When evaluating
// these results, we check if any result evaluated to TNever. For key
// indexed unions, a TNever result indicates that the key was not
// present on the variant. In these cases, we must evaluate the indexed
// union to TNever (as given by a [] result). This logic aligns to the
// following behaviour.
//
// Non-Overlapping Union
//
// type A = { a: string }
// type B = { b: string }
// type C = (A | B) & { a: number } // C is { a: number }
//
// Overlapping Union
//
// type A = { a: string }
// type B = { a: string }
// type C = (A | B) & { a: number } // C is { a: never }
//
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnionRest<Types extends TSchema[], Result extends TSchema[] = []> = 
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? Left extends TNever 
      ? []
      : TFromUnionRest<Right, [Left, ...Result]>
    : Result
// prettier-ignore
function FromUnionRest<Types extends TSchema[]>(types: [...Types]): TFromUnionRest<Types> {
  return (
    types.some(L => IsNever(L)) 
      ? [] 
      : types 
  ) as never
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<Types extends TSchema[], Key extends PropertyKey> = (
  TUnionEvaluated<TFromUnionRest<TFromRest<Types, Key>>>
)
// prettier-ignore
function FromUnion<Types extends TSchema[], Key extends PropertyKey>(types: [...Types], key: Key): TFromUnion<Types, Key> {
  return (
    UnionEvaluated(FromUnionRest(FromRest(types as TSchema[], key)))
  ) as never
}
// ------------------------------------------------------------------
// FromTuple
// ------------------------------------------------------------------

// prettier-ignore
type TFromTuple<Types extends TSchema[], Key extends PropertyKey, Result extends TSchema = (
  Key extends '[number]' ? TUnionEvaluated<Types> :
  Key extends keyof Types
    ? Types[Key] extends infer Type extends TSchema
      ? Type
      : TNever 
    : TNever
)> = Result
// prettier-ignore
function FromTuple<Types extends TSchema[], Key extends PropertyKey>(types: [...Types], key: Key): TFromTuple<Types, Key>  {
  return (
    key === '[number]' ? UnionEvaluated(types) : 
    key in types ? types[key as number] : 
    Never()
  ) as never
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
// prettier-ignore
type TFromArray<Type extends TSchema, Key extends PropertyKey> = (
  Key extends '[number]' ? Type : TNever
)
// prettier-ignore
function FromArray<Type extends TSchema, Key extends PropertyKey>(type: Type, key: Key): TFromArray<Type, Key> {
  // ... ?
  return (key === '[number]' ? type : Never()) as never
}
// ------------------------------------------------------------------
// FromProperty
// ------------------------------------------------------------------
type AssertPropertyKey<T extends unknown> = Assert<T, string | number>

// prettier-ignore
type TFromProperty<Properties extends TProperties, Key extends PropertyKey, Result extends TSchema = (
  // evaluate for string keys
  Key extends keyof Properties 
    ? Properties[Key] 
    // evaluate for numeric keys
    : `${AssertPropertyKey<Key>}` extends `${AssertPropertyKey<keyof Properties>}` 
      ? Properties[AssertPropertyKey<Key>]
      : TNever
)> = Result
// prettier-ignore
function FromProperty<Properties extends TProperties, Key extends PropertyKey>(properties: Properties, key: Key): TFromProperty<Properties, Key> {
  return (key in properties ? properties[key as string] : Never()) as never
}
// ------------------------------------------------------------------
// FromKey
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexFromPropertyKey<Type extends TSchema, Key extends PropertyKey> = (
  Type extends TRecursive<infer S extends TSchema> ? TIndexFromPropertyKey<S, Key> :
  Type extends TIntersect<infer S extends TSchema[]> ? TFromIntersect<S, Key> :
  Type extends TUnion<infer S extends TSchema[]> ? TFromUnion<S, Key> :
  Type extends TTuple<infer S extends TSchema[]> ? TFromTuple<S, Key> :
  Type extends TArray<infer S extends TSchema> ? TFromArray<S, Key> :
  Type extends TObject<infer S extends TProperties> ? TFromProperty<S, Key> :
  TNever
)
// prettier-ignore
export function IndexFromPropertyKey<Type extends TSchema, Key extends PropertyKey>(type: Type, key: Key): TIndexFromPropertyKey<Type, Key> {
  return (
    IsIntersect(type) ? FromIntersect(type.allOf, key) :
    IsUnion(type) ? FromUnion(type.anyOf, key) :
    IsTuple(type) ? FromTuple(type.items ?? [], key) :
    IsArray(type) ? FromArray(type.items, key) :
    IsObject(type) ? FromProperty(type.properties, key) :
    Never()
  ) as never
}
// ------------------------------------------------------------------
// FromKeys
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexFromPropertyKeys<Type extends TSchema, PropertyKeys extends PropertyKey[], Result extends TSchema[] = []> = (
  PropertyKeys extends [infer Left extends PropertyKey, ...infer Right extends PropertyKey[]]
    ? TIndexFromPropertyKeys<Type, Right, [...Result, Assert<TIndexFromPropertyKey<Type, Left>, TSchema>]>
    : Result
)
// prettier-ignore
export function IndexFromPropertyKeys<Type extends TSchema, PropertyKeys extends PropertyKey[]>(type: Type, propertyKeys: [...PropertyKeys]): TIndexFromPropertyKeys<Type, PropertyKeys> {
  return propertyKeys.map(left => IndexFromPropertyKey(type, left)) as never
}
// ------------------------------------------------------------------
// FromSchema
// ------------------------------------------------------------------
// prettier-ignore
type TFromType<Type extends TSchema, PropertyKeys extends PropertyKey[], 
  Result extends TSchema[] = TIndexFromPropertyKeys<Type, PropertyKeys>,
> = TUnionEvaluated<Result>
// prettier-ignore
function FromType<Type extends TSchema, PropertyKeys extends PropertyKey[]>(type: Type, propertyKeys: [...PropertyKeys]): TFromType<Type, PropertyKeys> {
  const result = IndexFromPropertyKeys(type, propertyKeys as PropertyKey[])
  return UnionEvaluated(result) as never
}
// ------------------------------------------------------------------
// UnionFromPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
type TUnionFromPropertyKeys<PropertyKeys extends PropertyKey[], Result extends TLiteral[] = []> = (
  PropertyKeys extends [infer Key extends PropertyKey, ...infer Rest extends PropertyKey[]]
    ? Key extends TLiteralValue
      ? TUnionFromPropertyKeys<Rest, [...Result, TLiteral<Key>]>
      : TUnionFromPropertyKeys<Rest, [...Result]>
    : TUnionEvaluated<Result>
)
// prettier-ignore
function UnionFromPropertyKeys<PropertyKeys extends PropertyKey[]>(propertyKeys: PropertyKeys): TUnionFromPropertyKeys<PropertyKeys> {
  const result = propertyKeys.reduce((result, key) => IsLiteralValue(key) ? [...result, Literal(key)]: result, [] as TLiteral[])
  return UnionEvaluated(result) as never
}
// ------------------------------------------------------------------
// TIndex
// ------------------------------------------------------------------
// prettier-ignore (do not export this type)
type TResolvePropertyKeys<Key extends TSchema | PropertyKey[]> = Key extends TSchema ? TIndexPropertyKeys<Key> : Key
// prettier-ignore (do not export this type)
type TResolveTypeKey<Key extends TSchema | PropertyKey[]> = Key extends PropertyKey[] ? TUnionFromPropertyKeys<Key> : Key
// prettier-ignore
export type TIndex<Type extends TSchema, Key extends TSchema | PropertyKey[],
  IsTypeRef extends boolean = Type extends TRef ? true : false,
  IsKeyRef extends boolean = Key extends TRef ? true : false,
> = (
  Key extends TMappedResult ? TIndexFromMappedResult<Type, Key> :
  Key extends TMappedKey ? TIndexFromMappedKey<Type, Key> :
  [IsTypeRef, IsKeyRef] extends [true, true] ? TComputed<'Index', [Type, TResolveTypeKey<Key>]> :
  [IsTypeRef, IsKeyRef] extends [false, true] ? TComputed<'Index', [Type, TResolveTypeKey<Key>]> :
  [IsTypeRef, IsKeyRef] extends [true, false] ? TComputed<'Index', [Type, TResolveTypeKey<Key>]> : 
  TFromType<Type, TResolvePropertyKeys<Key>>
)
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, Key extends PropertyKey[]>(type: Type, key: readonly [...Key], options?: SchemaOptions): TIndex<Type, Key>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, Key extends TMappedKey>(type: Type, key: Key, options?: SchemaOptions): TIndex<Type, Key>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, Key extends TMappedResult>(type: Type, key: Key, options?: SchemaOptions): TIndex<Type, Key>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, Key extends TSchema>(type: Type, key: Key, options?: SchemaOptions): TIndex<Type, Key>
/** `[Json]` Returns an Indexed property type for the given keys */
// prettier-ignore
export function Index(type: any, key: any, options?: SchemaOptions): any {
  const typeKey: TSchema = IsArrayValue(key) ? UnionFromPropertyKeys(key as PropertyKey[]) : key 
  const propertyKeys: PropertyKey[] = IsSchema(key) ? IndexPropertyKeys(key) : key
  const isTypeRef: boolean = IsRef(type)
  const isKeyRef: boolean = IsRef(key)
  return (
    IsMappedResult(key) ? IndexFromMappedResult(type, key, options) :
    IsMappedKey(key) ? IndexFromMappedKey(type, key, options) :
    (isTypeRef && isKeyRef) ? Computed('Index', [type, typeKey], options) :
    (!isTypeRef && isKeyRef) ? Computed('Index', [type, typeKey], options) :
    (isTypeRef && !isKeyRef) ? Computed('Index', [type, typeKey], options) :
    CreateType(FromType(type, propertyKeys), options) 
  ) as never
}
