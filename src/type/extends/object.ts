/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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

// deno-lint-ignore-file ban-types
// deno-fmt-ignore-file

import { type TUnreachable, Unreachable } from '../../system/unreachable/index.ts'

import { Memory } from '../../system/memory/index.ts'
import { Guard } from '../../guard/index.ts'
import { type TProperties } from '../types/properties.ts'
import { type TSchema } from '../types/schema.ts'
import { type TOptional, IsOptional } from '../types/_optional.ts'
import { type TInfer, IsInfer } from '../types/infer.ts'
import { type TNever, IsNever } from '../types/never.ts'
import { type TObject, IsObject, Object } from '../types/object.ts'
import { type TRecord, IsRecord, RecordPattern, RecordValue } from '../types/record.ts'
import { type TUnion, Union, IsUnion } from '../types/union.ts'

import { type TExtendsLeft, ExtendsLeft } from './extends_left.ts'
import { type TExtendsRight, ExtendsRight } from './extends_right.ts'
import { type TUnionToTuple } from '../engine/helpers/union.ts'

import * as Result from './result.ts'

// ----------------------------------------------------------------------------
// ExtendsPropertyOptional
// ----------------------------------------------------------------------------
type TExtendsPropertyOptional<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (
  Left extends TOptional<Left>
  ? Right extends TOptional<Right>
    ? Result.TExtendsTrue<Inferred>
    : Result.TExtendsFalse
  : Result.TExtendsTrue<Inferred>
)
function ExtendsPropertyOptional<Inferred extends TProperties, Left extends TSchema, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsPropertyOptional<Inferred, Left, Right> {
  return (
    IsOptional(left)
      ? IsOptional(right)
        ? Result.ExtendsTrue(inferred)
        : Result.ExtendsFalse()
      : Result.ExtendsTrue(inferred)
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsProperty
// ----------------------------------------------------------------------------
type TExtendsProperty<Inferred extends TProperties, Left extends TSchema, Right extends TSchema> = (
  // Right TInfer<TNever> is TExtendsFalse
  Right extends TInfer<string, TNever> 
    ? Result.TExtendsFalse 
    : TExtendsLeft<Inferred, Left, Right> extends Result.TExtendsTrueLike<infer Inferred extends TProperties>
      ? TExtendsPropertyOptional<Inferred, Left, Right>
      : Result.TExtendsFalse
)
function ExtendsProperty<Inferred extends TProperties, Left extends TSchema, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsProperty<Inferred, Left, Right> {
  return (
    // Right TInfer<TNever> is TExtendsFalse
    (IsInfer(right) && IsNever(right.extends))
      ? Result.ExtendsFalse()
      : Result.Match(ExtendsLeft(inferred, left, right), inferred => 
        ExtendsPropertyOptional(inferred, left, right),
        () => Result.ExtendsFalse())
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsPropertiesComparer
//
// This function compares left and right properties and maps them into the
// Properties result. We then check that ALL properties ExtendsTrue, and if
// so, remap to a single output Inferred result. This logic is quite wild 
// as we need extract results from an accumulated Properties. We trust
// TUnionToTuple to hold up obtaining Keys for the ExtractInferredProperties
// routines.
//
// deno-coverage-ignore-start - symmetric unreachable | internal
//
// All Keys are assured to be in Properties. We should refactor this code
// such that the runtime implementation more closely mirrors the type
// implementation. (revise-implementation)
//
// ----------------------------------------------------------------------------
type TExtractInferredProperties<Keys extends PropertyKey[], Properties extends Record<PropertyKey, Result.TResult>, Result extends TProperties = {}> = (
  Keys extends [infer Left extends PropertyKey, ...infer Right extends PropertyKey[]]
  ? Left extends keyof Properties
    ? Properties[Left] extends Result.TExtendsTrueLike<infer Inferred extends TProperties>
      ? TExtractInferredProperties<Right, Properties, Result & Inferred>
      : TExtractInferredProperties<Right, Properties, Result>
    : TUnreachable // TExtractInferredProperties<Right, Properties, Result>
  : Result
)
function ExtractInferredProperties<Keys extends PropertyKey[], Properties extends Record<PropertyKey, Result.TResult>>
  (keys: [...Keys], properties: Properties): 
    TExtractInferredProperties<Keys, Properties> {
  return keys.reduce((result, key) => {
    return key in properties
      ? Result.IsExtendsTrueLike(properties[key])
        // @ts-ignore 5.0.4 cannot see `.inferred`
        ? { ...result, ...properties[key].inferred }
        : Unreachable() // result
      : Unreachable() // result
  }, {}) as never
}
// deno-coverage-ignore-stop
// ---
type TExtendsPropertiesComparer<Inferred extends TProperties, Left extends TProperties, Right extends TProperties,
  Properties extends Record<PropertyKey, Result.TExtendsTrue | Result.TExtendsFalse> = {
    [RightKey in keyof Right]: (
      RightKey extends keyof Left
      // We don't consider the exterior Inferred as part of the property check as
      // we don't want the exterior Context to override the Inferred Context for
      // the Property Key. This override behavior is observed in the following
      // case we want the inferred A to shadow the exterior A.
      //
      // const A = Type.Script(`{ x: 1, y: 1 }`)
      // const S = Type.Script({ A }, `{
      //   [K in keyof A]: A extends { 
      //     x: infer A, 
      //     y: infer B 
      //   } ? [A, B]   <-- inferred 'A' shadows the exterior 'A'
      //     : never
      // }`)
      ? TExtendsProperty<{}, Left[RightKey], Right[RightKey]>
      // If the right key K is not in left, but the right property is optional
      // then we say this property is permissable. This is because an optional
      // property on right is the same as property missing in left. If the
      // right is infer, then we just assign the extend type to inferred.
      : Right[RightKey] extends TOptional<Right[RightKey]>
      ? Right[RightKey] extends TInfer
      ? Result.TExtendsTrue<Memory.TAssign<Inferred, { [_ in Right[RightKey]['name']]: Right[RightKey]['extends'] }>>
      : Result.TExtendsTrue<Inferred>
      : Result.TExtendsFalse
    )
  },
  // Check if all properties are ExtendsTrueLike
  Checked extends boolean = Properties[keyof Right] extends Result.TExtendsTrueLike ? true : false,
  // Extract inferred results from properties, but only if the check is true.
  Extracted extends TProperties = Checked extends true ? TExtractInferredProperties<TUnionToTuple<keyof Properties>, Properties> : {},
> = (
    Checked extends true
    ? Result.TExtendsTrue<Extracted>
    : Result.TExtendsFalse
  )
function ExtendsPropertiesComparer<Inferred extends TProperties, Left extends TProperties, Right extends TProperties>
  (inferred: Inferred, left: Left, right: Right):
    TExtendsPropertiesComparer<Inferred, Left, Right> {
  const properties: Record<PropertyKey, Result.TExtendsTrue<TProperties> | Result.TExtendsFalse> = {}
  for (const rightKey of Guard.Keys(right)) {
    properties[rightKey] = (
      rightKey in left
        // We don't consider the exterior Inferred as part of the property check as
        // we don't want the exterior Context to override the Inferred Context for
        // the Property Key. This override behavior is observed in the following
        // case we want the inferred A to shadow the exterior A.
        //
        // const A = Type.Script(`{ x: 1, y: 1 }`)
        // const S = Type.Script({ A }, `{
        //   [K in keyof A]: A extends { 
        //     x: infer A, 
        //     y: infer B 
        //   } ? [A, B]   <-- inferred 'A' shadows the exterior 'A'
        //     : never
        // }`)
        ? ExtendsProperty({}, left[rightKey], right[rightKey])
        // If the right key K is not in left, but the right property is optional
        // then we say this property is permissable. This is because an optional
        // property on right is the same as property missing in left. If the
        // right is infer, then we just assign the extend type to inferred.
        : IsOptional(right[rightKey])
          ? IsInfer(right[rightKey])
            // @ts-ignore 5.0.1 - cannot observe extend in right[rightKey].extends
            ? Result.ExtendsTrue(Memory.Assign(inferred, { [right[rightKey].name]: right[rightKey].extends }))
            : Result.ExtendsTrue(inferred)
          : Result.ExtendsFalse()
    )
  }
  // Check if all properties are ExtendsTrueLike
  const checked = Guard.Values(properties).every(result => Result.IsExtendsTrueLike(result))
  // Extract inferred results from properties, but only if the check is true.
  const extracted = checked ? ExtractInferredProperties(Guard.Keys(properties), properties) : {}
  return (
    checked
      ? Result.ExtendsTrue(extracted)
      : Result.ExtendsFalse()
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsProperties
//
// The Compared function generates it's own Inferred set from the Properties. We
// apply the ComparedInferred to the exterior Inferred here but I can't remember
// why I decided to do it this way. The alternative would be to iteratively building 
// the context during Property enumeration checks. I suppose doing it this way
// reduces the number of intersections.
//
// ----------------------------------------------------------------------------
type TExtendsProperties<Inferred extends TProperties, Left extends TProperties, Right extends TProperties,
  Compared extends Result.TResult = TExtendsPropertiesComparer<Inferred, Left, Right>
> = (
    Compared extends Result.TExtendsTrueLike<infer ComparedInferred extends TProperties>
    ? Result.TExtendsTrue<Memory.TAssign<Inferred, ComparedInferred>>
    : Result.TExtendsFalse
  )
function ExtendsProperties<Inferred extends TProperties, Left extends TProperties, Right extends TProperties>
  (inferred: Inferred, left: Left, right: Right):
    TExtendsProperties<Inferred, Left, Right> {
  const compared = ExtendsPropertiesComparer(inferred, left, right)
  return (
    Result.IsExtendsTrueLike(compared)
      ? Result.ExtendsTrue(Memory.Assign(inferred, compared.inferred))
      : Result.ExtendsFalse()
  ) as never
}
// ----------------------------------------------------------------------------
// ExtendsObjectToObject
// ----------------------------------------------------------------------------
type TExtendsObjectToObject<Inferred extends TProperties, Left extends TProperties, Right extends TProperties> = (
  TExtendsProperties<Inferred, Left, Right>
)
function ExtendsObjectToObject<Inferred extends TProperties, Left extends TProperties, Right extends TProperties>
  (inferred: Inferred, left: Left, right: Right):
    TExtendsObjectToObject<Inferred, Left, Right> {
  return ExtendsProperties(inferred, left, right) as never
}

// ----------------------------------------------------------------------------
// ObjectToRecord
//
// It should be possible to unify this logic, specifically the property
// level extends checks and inferred merge logic. To be honest, this
// entire module needs to be cleaned up. Consider computing a forward
// "Entries" data structure that can be uniformly compared for both
// Object and Record comparisons. This also has some cross over with
// Indexed and KeyOf operators which could also benefit from unified
// 'Entry' enumeration. (review)
//
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// RecordMergeInferred
// ----------------------------------------------------------------------------
type TRecordMergeInferred<Left extends TProperties, Right extends TProperties,
  Result extends TProperties = {
    [Key in keyof Right]: Key extends keyof Left
      ? Left[Key] extends TUnion<infer Types extends TSchema[]>
        ? TUnion<[...Types, Right[Key]]>
        : TUnion<[Left[Key], Right[Key]]>
      : Right[Key]
}> = Result
function RecordMergeInferred<Left extends TProperties, Right extends TProperties>
  (left: Left, right: Right): TRecordMergeInferred<Left, Right> {
  return Guard.Keys(right).reduce<TProperties>((result, key) => {
    return {
      ...result, [key]: Guard.HasPropertyKey(left, key)
        ? IsUnion(result[key])
          // @ts-ignore 5.0.4 cannot see `.anyOf`
          ? Union([...result[key].anyOf, right[key]])
          : Union([left[key], right[key]])
        : right[key]
    }
  }, left) as never
}
// ----------------------------------------------------------------------------
// ExtendsRecordComparer
// ----------------------------------------------------------------------------
type TExtendsRecordComparer<Properties extends TProperties, Keys extends (keyof Properties)[], Type extends TSchema, Result extends TProperties> = (
  Keys extends [infer Left extends (keyof Properties), ...infer Right extends (keyof Properties)[]]
    ? TExtendsLeft<{}, Properties[Left], Type> extends Result.TExtendsTrueLike<infer Inferred extends TProperties>
      ? TExtendsRecordComparer<Properties, Right, Type, TRecordMergeInferred<Result, Inferred>> 
      : Result.TExtendsFalse
    : Result.TExtendsTrue<Result>
)
function ExtendsRecordComparer<Properties extends TProperties, Keys extends (keyof Properties)[], Type extends TSchema, Result extends TProperties>
 (properties: Properties, keys: Keys, type: Type, result: Result): TExtendsRecordComparer<Properties, Keys, Type, Result> {
  return Guard.ShiftLeft(keys, (left, right) => 
    Result.Match(ExtendsLeft({}, properties[left], type), inferred => 
      ExtendsRecordComparer(properties, right, type, RecordMergeInferred(result, inferred)),
      () => Result.ExtendsFalse()),
    () => Result.ExtendsTrue(result)) as never
}
// ----------------------------------------------------------------------------
// ExtendsObjectToRecord
// ----------------------------------------------------------------------------
type TExtendsObjectToRecord<Inferred extends TProperties, Properties extends TProperties, _Pattern extends string, Value extends TSchema,
  Keys extends (keyof Properties)[] = TUnionToTuple<keyof Properties>,
  Result extends  Result.TResult = TExtendsRecordComparer<Properties, Keys, Value, Inferred>
> = Result
function ExtendsObjectToRecord<Inferred extends TProperties, Properties extends TProperties, Pattern extends string, Value extends TSchema>
  (inferred: Inferred, properties: Properties, _pattern: Pattern, value: Value):
    TExtendsObjectToRecord<Inferred, Properties, Pattern, Value> {
  const keys = Guard.Keys(properties)
  const result = ExtendsRecordComparer(properties, keys, value, inferred)
  return result as never
}
// ----------------------------------------------------------------------------
// ExtendsObject
// ----------------------------------------------------------------------------
export type TExtendsObject<Inferred extends TProperties, Left extends TProperties, Right extends TSchema> = (
  Right extends TRecord<infer Pattern extends string, infer Value extends TSchema> ? TExtendsObjectToRecord<Inferred, Left, Pattern, Value> : 
  Right extends TObject<infer Properties extends TProperties> ? TExtendsObjectToObject<Inferred, Left, Properties> : 
  TExtendsRight<Inferred, TObject<Left>, Right>
)
export function ExtendsObject<Inferred extends TProperties, Left extends TProperties, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsObject<Inferred, Left, Right> {
  return (
    IsRecord(right) ? ExtendsObjectToRecord(inferred, left, RecordPattern(right), RecordValue(right)) : 
    IsObject(right) ? ExtendsObjectToObject(inferred, left, right.properties) : 
    ExtendsRight(inferred, Object(left), right)
  ) as never
}