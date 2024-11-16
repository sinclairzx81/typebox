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
import type { TSchema } from '../schema/index'
import type { Assert, Ensure } from '../helpers/index'
import type { TMappedResult } from '../mapped/index'
import type { SchemaOptions } from '../schema/index'
import { Literal, type TLiteral, type TLiteralValue } from '../literal/index'
import { Number, type TNumber } from '../number/index'
import { Computed, TComputed } from '../computed/index'
import { Ref, type TRef } from '../ref/index'
import { KeyOfPropertyKeys, type TKeyOfPropertyKeys } from './keyof-property-keys'
import { UnionEvaluated, type TUnionEvaluated } from '../union/index'
import { KeyOfFromMappedResult, type TKeyOfFromMappedResult } from './keyof-from-mapped-result'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsMappedResult, IsRef, IsComputed } from '../guard/kind'
// ------------------------------------------------------------------
// FromComputed
// ------------------------------------------------------------------
// prettier-ignore
type TFromComputed<Target extends string, Parameters extends TSchema[]> = Ensure<
  TComputed<'KeyOf', [TComputed<Target, Parameters>]>
>
// prettier-ignore
function FromComputed<Target extends string, Parameters extends TSchema[]>(target: Target, parameters: Parameters): TFromComputed<Target, Parameters> {
  return Computed('KeyOf', [Computed(target, parameters)]) as never
}
// ------------------------------------------------------------------
// FromRef
// ------------------------------------------------------------------
// prettier-ignore
type TFromRef<Ref extends string> = Ensure<
  TComputed<'KeyOf', [TRef<Ref>]>
>
// prettier-ignore
function FromRef<Ref extends string>($ref: Ref): TFromRef<Ref> {
  return Computed('KeyOf', [Ref($ref)]) as never
}
// ------------------------------------------------------------------
// KeyOfFromType
// ------------------------------------------------------------------
// prettier-ignore
/** `[Internal]` Used by KeyOfFromMappedResult */
export type TKeyOfFromType<Type extends TSchema, 
  PropertyKeys extends PropertyKey[] = TKeyOfPropertyKeys<Type>,
  PropertyKeyTypes extends TSchema[] = TKeyOfPropertyKeysToRest<PropertyKeys>,
  Result = TUnionEvaluated<PropertyKeyTypes>
> = Ensure<Result>
// prettier-ignore
function KeyOfFromType<Type extends TSchema>(type: Type, options?: SchemaOptions): TKeyOfFromType<Type> {
  const propertyKeys = KeyOfPropertyKeys(type) as PropertyKey[]
  const propertyKeyTypes = KeyOfPropertyKeysToRest(propertyKeys)
  const result = UnionEvaluated(propertyKeyTypes)
  return CreateType(result, options) as never
}
// ------------------------------------------------------------------
// FromPropertyKeys
// ------------------------------------------------------------------
// prettier-ignore
export type TKeyOfPropertyKeysToRest<PropertyKeys extends PropertyKey[], Result extends TSchema[] = []> = (
  PropertyKeys extends [infer L extends PropertyKey, ...infer R extends PropertyKey[]]
    ? L extends '[number]'
      ? TKeyOfPropertyKeysToRest<R, [...Result, TNumber]>
      : TKeyOfPropertyKeysToRest<R, [...Result, TLiteral<Assert<L, TLiteralValue>>]>
    : Result
)
// prettier-ignore
export function KeyOfPropertyKeysToRest<PropertyKeys extends PropertyKey[]>(propertyKeys: [...PropertyKeys]): TKeyOfPropertyKeysToRest<PropertyKeys> {
  return propertyKeys.map(L => L === '[number]' ? Number() : Literal(L as TLiteralValue)) as never
}
// ------------------------------------------------------------------
// TKeyOf
// ------------------------------------------------------------------
// prettier-ignore
export type TKeyOf<Type extends TSchema> = (
  Type extends TComputed<infer Target extends string, infer Parameters extends TSchema[]> ? TFromComputed<Target, Parameters> :
  Type extends TRef<infer Ref extends string> ? TFromRef<Ref> :
  Type extends TMappedResult ? TKeyOfFromMappedResult<Type> :
  TKeyOfFromType<Type>
)
/** `[Json]` Creates a KeyOf type */
export function KeyOf<Type extends TSchema>(type: Type, options?: SchemaOptions): TKeyOf<Type> {
  return (IsComputed(type) ? FromComputed(type.target, type.parameters) : IsRef(type) ? FromRef(type.$ref) : IsMappedResult(type) ? KeyOfFromMappedResult(type, options) : KeyOfFromType(type, options)) as never
}
