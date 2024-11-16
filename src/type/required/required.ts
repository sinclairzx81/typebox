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
import type { TSchema, SchemaOptions } from '../schema/index'
import type { Evaluate, Ensure } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import { type TReadonlyOptional } from '../readonly-optional/index'
import { type TComputed, Computed } from '../computed/index'
import { type TOptional } from '../optional/index'
import { type TReadonly } from '../readonly/index'
import { type TRecursive } from '../recursive/index'
import { type TObject, type TProperties, Object } from '../object/index'
import { type TIntersect, Intersect } from '../intersect/index'
import { type TUnion, Union } from '../union/index'
import { type TRef, Ref } from '../ref/index'
import { OptionalKind, TransformKind } from '../symbols/index'
import { Discard } from '../discard/index'
import { RequiredFromMappedResult, type TRequiredFromMappedResult } from './required-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedResult, IsIntersect, IsUnion, IsObject, IsRef, IsComputed } from '../guard/kind'

// ------------------------------------------------------------------
// FromComputed
// ------------------------------------------------------------------
// prettier-ignore
type TFromComputed<Target extends string, Parameters extends TSchema[]> = Ensure<
  TComputed<'Required', [TComputed<Target, Parameters>]>
>
// prettier-ignore
function FromComputed<Target extends string, Parameters extends TSchema[]>(target: Target, parameters: Parameters): TFromComputed<Target, Parameters> {
  return Computed('Required', [Computed(target, parameters)]) as never
}
// ------------------------------------------------------------------
// FromRef
// ------------------------------------------------------------------
// prettier-ignore
type TFromRef<Ref extends string> = Ensure<
  TComputed<'Required', [TRef<Ref>]>
>
// prettier-ignore
function FromRef<Ref extends string>($ref: Ref): TFromRef<Ref> {
  return Computed('Required', [Ref($ref)]) as never
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<Properties extends TProperties> = Evaluate<{
  [K in keyof Properties]:
    Properties[K] extends (TReadonlyOptional<infer S>) ? TReadonly<S> :
    Properties[K] extends (TReadonly<infer S>) ? TReadonly<S> :
    Properties[K] extends (TOptional<infer S>) ? S :
    Properties[K]
}>
// prettier-ignore
function FromProperties<Properties extends TProperties>(properties: Properties) {
  const requiredProperties = {} as TProperties
  for(const K of globalThis.Object.getOwnPropertyNames(properties)) requiredProperties[K] = Discard(properties[K], [OptionalKind]) as TSchema
  return requiredProperties as never
}
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
// prettier-ignore
type TFromObject<Type extends TObject, Properties extends TProperties = Type['properties']> = Ensure<TObject<(
  TFromProperties<Properties>
)>>
// prettier-ignore
function FromObject<Type extends TObject>(type: Type): TFromObject<Type> {
  const options = Discard(type, [TransformKind, '$id', 'required', 'properties'])
  const properties = FromProperties(type['properties'])
  return Object(properties, options) as never
}
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<Types extends TSchema[], Result extends TSchema[] = []> = (
  Types extends [infer L extends TSchema, ...infer R extends TSchema[]]
    ? TFromRest<R, [...Result, TRequired<L>]>
    : Result
)
// prettier-ignore
function FromRest<Types extends TSchema[]>(types: [...Types]) : TFromRest<Types> {
  return types.map(type => RequiredResolve(type)) as never
}
// ------------------------------------------------------------------
// RequiredResolve
// ------------------------------------------------------------------
// prettier-ignore
function RequiredResolve<Type extends TSchema>(type: Type): TRequired<Type> {
  return (
    IsComputed(type) ? FromComputed(type.target, type.parameters) :
    IsRef(type) ? FromRef(type.$ref) :
    IsIntersect(type) ? Intersect(FromRest(type.allOf)) :
    IsUnion(type) ?  Union(FromRest(type.anyOf)) :
    IsObject(type) ? FromObject(type) :
    Object({})
  ) as never
}
// ------------------------------------------------------------------
// TRequired
// ------------------------------------------------------------------
// prettier-ignore
export type TRequired<Type extends TSchema> = (
  Type extends TRecursive<infer Type extends TSchema> ? TRecursive<TRequired<Type>> :
  Type extends TComputed<infer Target extends string, infer Parameters extends TSchema[]> ? TFromComputed<Target, Parameters> :
  Type extends TRef<infer Ref extends string> ? TFromRef<Ref> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TFromRest<Types>> :
  Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TFromRest<Types>> :
  Type extends TObject<infer Properties extends TProperties> ? TFromObject<TObject<Properties>> :
  TObject<{}>
)
/** `[Json]` Constructs a type where all properties are required */
export function Required<MappedResult extends TMappedResult>(type: MappedResult, options?: SchemaOptions): TRequiredFromMappedResult<MappedResult>
/** `[Json]` Constructs a type where all properties are required */
export function Required<Type extends TSchema>(type: Type, options?: SchemaOptions): TRequired<Type>
/** `[Json]` Constructs a type where all properties are required */
export function Required<Type extends TSchema>(type: Type, options?: SchemaOptions): never {
  if (IsMappedResult(type)) {
    return RequiredFromMappedResult(type, options) as never
  } else {
    // special: mapping types require overridable options
    return CreateType({ ...RequiredResolve(type), ...options }) as never
  }
}
