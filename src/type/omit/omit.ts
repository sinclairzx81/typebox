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
import { Discard } from '../discard/discard'
import { TransformKind } from '../symbols/symbols'
import type { SchemaOptions, TSchema } from '../schema/index'
import type { TupleToUnion, Evaluate, Ensure } from '../helpers/index'
import { type TRecursive } from '../recursive/index'
import type { TMappedKey, TMappedResult } from '../mapped/index'
import { Computed, TComputed } from '../computed/index'
import { Literal, TLiteral, TLiteralValue } from '../literal/index'
import { IndexPropertyKeys, type TIndexPropertyKeys } from '../indexed/index'
import { Intersect, type TIntersect } from '../intersect/index'
import { Union, type TUnion } from '../union/index'
import { Object, type TObject, type TProperties } from '../object/index'
import { type TRef } from '../ref/index'

// ------------------------------------------------------------------
// Mapped
// ------------------------------------------------------------------
import { OmitFromMappedKey, type TOmitFromMappedKey } from './omit-from-mapped-key'
import { OmitFromMappedResult, type TOmitFromMappedResult } from './omit-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedKey, IsIntersect, IsUnion, IsObject, IsSchema, IsMappedResult, IsLiteralValue, IsRef } from '../guard/kind'
import { IsArray as IsArrayValue } from '../guard/value'

// ------------------------------------------------------------------
// FromIntersect
// ------------------------------------------------------------------
// prettier-ignore
type TFromIntersect<Types extends TSchema[], PropertyKeys extends PropertyKey[], Result extends TSchema[] = []> = (
  Types extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? TFromIntersect<R, PropertyKeys, [...Result, TOmit<L, PropertyKeys>]>
    : Result
)
// prettier-ignore
function FromIntersect<Types extends TSchema[], PropertyKeys extends PropertyKey[]>(types: Types, propertyKeys: PropertyKeys) {
  return types.map((type) => OmitResolve(type, propertyKeys)) as never
}
// ------------------------------------------------------------------
// FromUnion
// ------------------------------------------------------------------
// prettier-ignore
type TFromUnion<T extends TSchema[], K extends PropertyKey[], Result extends TSchema[] = []> = (
  T extends [infer L extends TSchema, ...infer R extends TSchema[]] 
    ? TFromUnion<R, K, [...Result, TOmit<L, K>]>
    : Result
)
// prettier-ignore
function FromUnion<Types extends TSchema[], PropertyKeys extends PropertyKey[]>(types: Types, propertyKeys: PropertyKeys) {
  return types.map((type) => OmitResolve(type, propertyKeys)) as never
}
// ------------------------------------------------------------------
// FromProperty
// ------------------------------------------------------------------
// prettier-ignore
function FromProperty<Properties extends TProperties, Key extends PropertyKey>(properties: Properties, key: Key): TProperties {
  const { [key]: _, ...R } = properties
  return R
}
// prettier-ignore
type TFromProperties<Properties extends TProperties, PropertyKeys extends PropertyKey[], UnionKey extends PropertyKey = TupleToUnion<PropertyKeys>> = (
  Evaluate<Omit<Properties, UnionKey>>
)
// prettier-ignore
function FromProperties<Properties extends TProperties, PropertyKeys extends PropertyKey[]>(properties: Properties, propertyKeys: PropertyKeys) {
  return propertyKeys.reduce((T, K2) => FromProperty(T, K2), properties as TProperties)
}
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
// prettier-ignore
type TFromObject<Type extends TObject, PropertyKeys extends PropertyKey[], Properties extends TProperties = Type['properties']> = Ensure<TObject<(
  TFromProperties<Properties, PropertyKeys>
)>>
// prettier-ignore
function FromObject<Properties extends TObject, PropertyKeys extends PropertyKey[]>(properties: Properties, propertyKeys: PropertyKeys): TFromObject<Properties, PropertyKeys> {
  const options = Discard(properties, [TransformKind, '$id', 'required', 'properties'])
  const omittedProperties = FromProperties(properties['properties'], propertyKeys)
  return Object(omittedProperties, options) as never
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
    : TUnion<Result>
)
// prettier-ignore
function UnionFromPropertyKeys<PropertyKeys extends PropertyKey[]>(propertyKeys: PropertyKeys): TUnionFromPropertyKeys<PropertyKeys> {
  const result = propertyKeys.reduce((result, key) => IsLiteralValue(key) ? [...result, Literal(key)]: result, [] as TLiteral[])
  return Union(result) as never
}
// ------------------------------------------------------------------
// TOmitResolve
// ------------------------------------------------------------------
// prettier-ignore
export type TOmitResolve<Properties extends TProperties, PropertyKeys extends PropertyKey[]> = (
  Properties extends TRecursive<infer Types extends TSchema> ? TRecursive<TOmitResolve<Types, PropertyKeys>> : 
  Properties extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TFromIntersect<Types, PropertyKeys>> : 
  Properties extends TUnion<infer Types extends TSchema[]> ? TUnion<TFromUnion<Types, PropertyKeys>> : 
  Properties extends TObject<infer Types extends TProperties> ? TFromObject<TObject<Types>, PropertyKeys> : 
  TObject<{}>
)
// prettier-ignore
function OmitResolve<Properties extends TSchema, PropertyKeys extends PropertyKey[]>(properties: Properties, propertyKeys: [...PropertyKeys]): TOmitResolve<Properties, PropertyKeys> {
  return (
    IsIntersect(properties) ? Intersect(FromIntersect(properties.allOf, propertyKeys)) : 
    IsUnion(properties) ? Union(FromUnion(properties.anyOf, propertyKeys)) : 
    IsObject(properties) ? FromObject(properties, propertyKeys) :
    Object({})
  ) as never
}
// ------------------------------------------------------------------
// TOmit
//
// This mapping logic is to overly complex because of the decision
// to use PropertyKey[] as the default selector. The PropertyKey[]
// did make TMapped types simpler to implement, but a non-TSchema
// selector makes supporting TComputed awkward as it requires
// generalization via TSchema. This type should be reimplemented
// in the next major revision to support TSchema as the primary
// selector.
//
// ------------------------------------------------------------------
// prettier-ignore (do not export this type)
type TResolvePropertyKeys<Key extends TSchema | PropertyKey[]> = Key extends TSchema ? TIndexPropertyKeys<Key> : Key
// prettier-ignore (do not export this type)
type TResolveTypeKey<Key extends TSchema | PropertyKey[]> = Key extends PropertyKey[] ? TUnionFromPropertyKeys<Key> : Key
// prettier-ignore
export type TOmit<Type extends TSchema, Key extends TSchema | PropertyKey[],
  IsTypeRef extends boolean = Type extends TRef ? true : false,
  IsKeyRef extends boolean = Key extends TRef ? true : false,
> = (
  Type extends TMappedResult ? TOmitFromMappedResult<Type, TResolvePropertyKeys<Key>> :
  Key extends TMappedKey ? TOmitFromMappedKey<Type, Key> :
  [IsTypeRef, IsKeyRef] extends [true, true] ? TComputed<'Omit', [Type, TResolveTypeKey<Key>]> :
  [IsTypeRef, IsKeyRef] extends [false, true] ? TComputed<'Omit', [Type, TResolveTypeKey<Key>]> :
  [IsTypeRef, IsKeyRef] extends [true, false] ? TComputed<'Omit', [Type, TResolveTypeKey<Key>]> :
  TOmitResolve<Type, TResolvePropertyKeys<Key>>
)
/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Omit<Type extends TSchema, Key extends PropertyKey[]>(type: Type, key: readonly [...Key], options?: SchemaOptions): TOmit<Type, Key>
/** `[Json]` Constructs a type whose keys are picked from the given type */
export function Omit<Type extends TSchema, Key extends TSchema>(type: Type, key: Key, options?: SchemaOptions): TOmit<Type, Key>
/** `[Json]` Constructs a type whose keys are picked from the given type */
// prettier-ignore
export function Omit(type: any, key: any, options?: SchemaOptions): any {
  const typeKey: TSchema = IsArrayValue(key) ? UnionFromPropertyKeys(key as PropertyKey[]) : key 
  const propertyKeys: PropertyKey[] = IsSchema(key) ? IndexPropertyKeys(key) : key
  const isTypeRef: boolean = IsRef(type)
  const isKeyRef: boolean = IsRef(key)
  return (
    IsMappedResult(type) ? OmitFromMappedResult(type, propertyKeys, options) :
    IsMappedKey(key) ? OmitFromMappedKey(type, key, options) :
    (isTypeRef && isKeyRef) ? Computed('Omit', [type, typeKey], options) :
    (!isTypeRef && isKeyRef) ? Computed('Omit', [type, typeKey], options) :
    (isTypeRef && !isKeyRef) ? Computed('Omit', [type, typeKey], options) :
    CreateType({ ...OmitResolve(type, propertyKeys), ...options })
  ) as never
}
