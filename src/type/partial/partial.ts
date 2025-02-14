/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import { CreateType } from '../create/type'
import type { TSchema, SchemaOptions } from '../schema/index'
import type { Evaluate, Ensure } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import { type TReadonlyOptional } from '../readonly-optional/index'
import { type TComputed, Computed } from '../computed/index'
import { type TOptional, Optional } from '../optional/index'
import { type TReadonly } from '../readonly/index'
import { type TRecursive } from '../recursive/index'
import { type TObject, type TProperties, Object } from '../object/index'
import { type TIntersect, Intersect } from '../intersect/index'
import { type TUnion, Union } from '../union/index'
import { type TRef, Ref } from '../ref/index'
import { type TBigInt } from '../bigint/index'
import { type TBoolean } from '../boolean/index'
import { type TInteger } from '../integer/index'
import { type TLiteral } from '../literal/index'
import { type TNull } from '../null/index'
import { type TNumber } from '../number/index'
import { type TString } from '../string/index'
import { type TSymbol } from '../symbol/index'
import { type TUndefined } from '../undefined/index'

import { Discard } from '../discard/index'
import { TransformKind } from '../symbols/index'
import { PartialFromMappedResult, type TPartialFromMappedResult } from './partial-from-mapped-result'

// ------------------------------------------------------------------
// KindGuard
// ------------------------------------------------------------------
import * as KindGuard from '../guard/kind'

// ------------------------------------------------------------------
// FromComputed
// ------------------------------------------------------------------
// prettier-ignore
type TFromComputed<Target extends string, Parameters extends TSchema[]> = Ensure<
  TComputed<'Partial', [TComputed<Target, Parameters>]>
>
// prettier-ignore
function FromComputed<Target extends string, Parameters extends TSchema[]>(target: Target, parameters: Parameters): TFromComputed<Target, Parameters> {
  return Computed('Partial', [Computed(target, parameters)]) as never
}
// ------------------------------------------------------------------
// FromRef
// ------------------------------------------------------------------
// prettier-ignore
type TFromRef<Ref extends string> = Ensure<
  TComputed<'Partial', [TRef<Ref>]>
>
// prettier-ignore
function FromRef<Ref extends string>($ref: Ref): TFromRef<Ref> {
  return Computed('Partial', [Ref($ref)]) as never
}
// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
// prettier-ignore
type TFromProperties<Properties extends TProperties> = Evaluate<{
  [K in keyof Properties]: 
    Properties[K] extends (TReadonlyOptional<infer S>) ? TReadonlyOptional<S> : 
    Properties[K] extends (TReadonly<infer S>) ? TReadonlyOptional<S> : 
    Properties[K] extends (TOptional<infer S>) ? TOptional<S> : 
    TOptional<Properties[K]>
}>
// prettier-ignore
function FromProperties<Properties extends TProperties>(properties: Properties): TFromProperties<Properties> {
  const partialProperties = {} as TProperties
  for(const K of globalThis.Object.getOwnPropertyNames(properties)) partialProperties[K] = Optional(properties[K])
  return partialProperties as never
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
    ? TFromRest<R, [...Result, TPartial<L>]>
    : Result
)
// prettier-ignore
function FromRest<Types extends TSchema[]>(types: [...Types]): TFromRest<Types> {
  return types.map(type => PartialResolve(type)) as never
}
// ------------------------------------------------------------------
// PartialResolve
// ------------------------------------------------------------------
// prettier-ignore
function PartialResolve<Type extends TSchema>(type: Type): TPartial<Type> {
  return (
    // Mappable
    KindGuard.IsComputed(type) ? FromComputed(type.target, type.parameters) :
    KindGuard.IsRef(type) ? FromRef(type.$ref) :
    KindGuard.IsIntersect(type) ? Intersect(FromRest(type.allOf)) :
    KindGuard.IsUnion(type) ? Union(FromRest(type.anyOf)) :
    KindGuard.IsObject(type) ? FromObject(type) :
    // Intrinsic
    KindGuard.IsBigInt(type) ? type :
    KindGuard.IsBoolean(type) ? type :
    KindGuard.IsInteger(type) ? type :
    KindGuard.IsLiteral(type) ? type :
    KindGuard.IsNull(type) ? type :
    KindGuard.IsNumber(type) ? type :
    KindGuard.IsString(type) ? type :
    KindGuard.IsSymbol(type) ? type :
    KindGuard.IsUndefined(type) ? type :
    // Passthrough
    Object({})
  ) as never
}
// ------------------------------------------------------------------
// TPartial
// ------------------------------------------------------------------
// prettier-ignore
export type TPartial<Type extends TSchema> = (
  // Mappable
  Type extends TRecursive<infer Type extends TSchema> ? TRecursive<TPartial<Type>> :
  Type extends TComputed<infer Target extends string, infer Parameters extends TSchema[]> ? TFromComputed<Target, Parameters> :
  Type extends TRef<infer Ref extends string> ? TFromRef<Ref> :
  Type extends TIntersect<infer Types extends TSchema[]> ? TIntersect<TFromRest<Types>> :
  Type extends TUnion<infer Types extends TSchema[]> ? TUnion<TFromRest<Types>> :
  Type extends TObject<infer Properties extends TProperties> ? TFromObject<TObject<Properties>> :
  // Intrinsic
  Type extends TBigInt ? Type :
  Type extends TBoolean ? Type :
  Type extends TInteger ? Type :
  Type extends TLiteral ? Type :
  Type extends TNull ? Type :
  Type extends TNumber ? Type :
  Type extends TString ? Type :
  Type extends TSymbol ? Type :
  Type extends TUndefined ? Type :
  // Passthrough
  TObject<{}>
)
/** `[Json]` Constructs a type where all properties are optional */
export function Partial<MappedResult extends TMappedResult>(type: MappedResult, options?: SchemaOptions): TPartialFromMappedResult<MappedResult>
/** `[Json]` Constructs a type where all properties are optional */
export function Partial<Type extends TSchema>(type: Type, options?: SchemaOptions): TPartial<Type>
/** `[Json]` Constructs a type where all properties are optional */
export function Partial(type: TSchema, options?: SchemaOptions): unknown {
  if (KindGuard.IsMappedResult(type)) {
    return PartialFromMappedResult(type, options)
  } else {
    // special: mapping types require overridable options
    return CreateType({ ...PartialResolve(type), ...options })
  }
}
