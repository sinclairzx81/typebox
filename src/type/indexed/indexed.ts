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
import { TypeBoxError } from '../error/index'

import { type TSchema, SchemaOptions } from '../schema/index'
import { type Assert } from '../helpers/index'
import { type TComputed, Computed } from '../computed/index'
import { type TNever, Never } from '../never/index'
import { type TArray } from '../array/index'
import { type TIntersect } from '../intersect/index'
import { type TMappedResult, type TMappedKey } from '../mapped/index'
import { type TObject, type TProperties } from '../object/index'
import { type TUnion } from '../union/index'
import { type TRecursive } from '../recursive/index'
import { type TRef } from '../ref/index'
import { type TTuple } from '../tuple/index'

import { IntersectEvaluated, type TIntersectEvaluated } from '../intersect/index'
import { UnionEvaluated, type TUnionEvaluated } from '../union/index'

import { IndexPropertyKeys, type TIndexPropertyKeys } from './indexed-property-keys'
import { IndexFromMappedKey, type TIndexFromMappedKey } from './indexed-from-mapped-key'
import { IndexFromMappedResult, type TIndexFromMappedResult } from './indexed-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsArray, IsIntersect, IsObject, IsMappedKey, IsMappedResult, IsNever, IsSchema, IsTuple, IsUnion, IsRef } from '../guard/kind'

// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<Types extends TSchema[], Key extends PropertyKey, Result extends TSchema[] = []> = (
  Types extends [infer Left extends TSchema, ...infer Right extends TSchema[]]
    ? TFromRest<Right, Key, [...Result, Assert<TIndexFromPropertyKey<Left, Key>, TSchema>]>
    : Result
)
// prettier-ignore
function FromRest<Types extends TSchema[], Key extends PropertyKey>(types: [...Types], key: Key): TFromRest<Types, Key> {
  return types.map(type => IndexFromPropertyKey(type, key)) as never
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
  return types.filter(type => !IsNever(type)) as never
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
type TFromTuple<Types extends TSchema[], Key extends PropertyKey> = (
  Key extends keyof Types ? Types[Key] : 
  Key extends '[number]' ? TUnionEvaluated<Types> : 
  TNever
)
// prettier-ignore
function FromTuple<Types extends TSchema[], Key extends PropertyKey>(types: [...Types], key: Key): TFromTuple<Types, Key>  {
  return (
    key in types ? types[key as number] : 
    key === '[number]' ? UnionEvaluated(types) : 
    Never()
  ) as never
}
// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
// prettier-ignore
type TFromArray<Type extends TSchema, Key extends PropertyKey> = (
  Key extends '[number]' 
    ? Type 
    : TNever
)
// prettier-ignore
function FromArray<Type extends TSchema, Key extends PropertyKey>(type: Type, key: Key): TFromArray<Type, Key>  {
  return (
    key === '[number]' 
      ? type 
      : Never()
  ) as never
}
// ------------------------------------------------------------------
// FromProperty
// ------------------------------------------------------------------
type AssertPropertyKey<T> = Assert<T, string | number>

// prettier-ignore
type TFromProperty<Properties extends TProperties, Key extends PropertyKey> = (
  // evaluate for string keys
  Key extends keyof Properties 
    ? Properties[Key] 
    // evaluate for numeric keys
    : `${AssertPropertyKey<Key>}` extends `${AssertPropertyKey<keyof Properties>}` 
      ? Properties[AssertPropertyKey<Key>]
      : TNever
)
// prettier-ignore
function FromProperty<Properties extends TProperties, Key extends PropertyKey>(properties: Properties, propertyKey: Key): TFromProperty<Properties, Key> {
  return (propertyKey in properties ? properties[propertyKey as string] : Never()) as never
}
// ------------------------------------------------------------------
// FromKey
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexFromPropertyKey<Type extends TSchema, Key extends PropertyKey> = (
  Type extends TRecursive<infer Type extends TSchema> ? TIndexFromPropertyKey<Type, Key> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TFromIntersect<Types, Key> :
  Type extends TUnion<infer Types extends TSchema[]> ? TFromUnion<Types, Key> :
  Type extends TTuple<infer Types extends TSchema[]> ? TFromTuple<Types, Key> :
  Type extends TArray<infer Type extends TSchema> ? TFromArray<Type, Key> :
  Type extends TObject<infer Properties extends TProperties> ? TFromProperty<Properties, Key> :
  TNever
)
// prettier-ignore
export function IndexFromPropertyKey<Type extends TSchema, Key extends PropertyKey>(type: Type, propertyKey: Key): TIndexFromPropertyKey<Type, Key> {
  return (
    IsIntersect(type) ? FromIntersect(type.allOf, propertyKey) :
    IsUnion(type) ? FromUnion(type.anyOf, propertyKey) :
    IsTuple(type) ? FromTuple(type.items ?? [], propertyKey) :
    IsArray(type) ? FromArray(type.items, propertyKey) :
    IsObject(type) ? FromProperty(type.properties, propertyKey) :
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
  return propertyKeys.map(propertyKey => IndexFromPropertyKey(type, propertyKey)) as never
}
// ------------------------------------------------------------------
// FromSchema
// ------------------------------------------------------------------
// prettier-ignore
type FromSchema<Type extends TSchema, PropertyKeys extends PropertyKey[]> = (
  TUnionEvaluated<TIndexFromPropertyKeys<Type, PropertyKeys>>
)
// prettier-ignore
function FromSchema<Type extends TSchema, PropertyKeys extends PropertyKey[]>(type: Type, propertyKeys: [...PropertyKeys]): FromSchema<Type, PropertyKeys> {
  return (
    UnionEvaluated(IndexFromPropertyKeys(type, propertyKeys as PropertyKey[]))
  ) as never
}
// ------------------------------------------------------------------
// FromSchema
// ------------------------------------------------------------------
// prettier-ignore
export type TIndexFromComputed<Type extends TSchema, Key extends TSchema> = (
  TComputed<'Index', [Type, Key]>
)
// prettier-ignore
export function IndexFromComputed<Type extends TSchema, Key extends TSchema>(type: Type, key: Key): TIndexFromComputed<Type, Key> {
  return Computed('Index', [type, key])
}
// ------------------------------------------------------------------
// TIndex
// ------------------------------------------------------------------
// prettier-ignore
export type TIndex<Type extends TSchema, PropertyKeys extends PropertyKey[]> = (
  FromSchema<Type, PropertyKeys>
)
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TRef, Key extends TSchema>(type: Type, key: Key, options?: SchemaOptions): TIndexFromComputed<Type, Key>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, Key extends TRef>(type: Type, key: Key, options?: SchemaOptions): TIndexFromComputed<Type, Key>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TRef, Key extends TRef>(type: Type, key: Key, options?: SchemaOptions): TIndexFromComputed<Type, Key>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, MappedResult extends TMappedResult>(type: Type, mappedResult: MappedResult, options?: SchemaOptions): TIndexFromMappedResult<Type, MappedResult>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, MappedResult extends TMappedResult>(type: Type, mappedResult: MappedResult, options?: SchemaOptions): TIndexFromMappedResult<Type, MappedResult>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, MappedKey extends TMappedKey>(type: Type, mappedKey: MappedKey, options?: SchemaOptions): TIndexFromMappedKey<Type, MappedKey>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, Key extends TSchema, PropertyKeys extends PropertyKey[] = TIndexPropertyKeys<Key>>(T: Type, K: Key, options?: SchemaOptions): TIndex<Type, PropertyKeys>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index<Type extends TSchema, PropertyKeys extends PropertyKey[]>(type: Type, propertyKeys: readonly [...PropertyKeys], options?: SchemaOptions): TIndex<Type, PropertyKeys>
/** `[Json]` Returns an Indexed property type for the given keys */
export function Index(type: TSchema, key: any, options?: SchemaOptions): any {
  // computed-type
  if (IsRef(type) || IsRef(key)) {
    const error = `Index types using Ref parameters require both Type and Key to be of TSchema`
    if (!IsSchema(type) || !IsSchema(key)) throw new TypeBoxError(error)
    return Computed('Index', [type, key])
  }
  // mapped-types
  if (IsMappedResult(key)) return IndexFromMappedResult(type, key, options)
  if (IsMappedKey(key)) return IndexFromMappedKey(type, key, options)
  // prettier-ignore
  return CreateType(
    IsSchema(key) 
      ? FromSchema(type, IndexPropertyKeys(key)) 
      : FromSchema(type, key as string[])
  , options) as never
}
