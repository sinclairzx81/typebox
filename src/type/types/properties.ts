/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

// deno-lint-ignore-file no-array-constructor
// deno-fmt-ignore-file

import { Guard } from '../../guard/index.ts'
import { type StaticType, type StaticEvaluate } from './static.ts'
import { type TSchema } from './schema.ts'
import { type TOptional, IsOptional } from './_optional.ts'
import { type TReadonly } from './_readonly.ts'
import { type TUnionToTuple } from '../engine/helpers/union.ts'

// ----------------------------------------------------------------------------
// StaticPropertiesWithModifiers
// ----------------------------------------------------------------------------
type ReadonlyOptionalKeys<Properties extends TProperties, Result extends PropertyKey = { [Key in keyof Properties]: Properties[Key] extends TReadonly<TSchema> ? (Properties[Key] extends TOptional<Properties[Key]> ? Key : never) : never }[keyof Properties]> = Result
type ReadonlyKeys<Properties extends TProperties, Result extends PropertyKey = { [Key in keyof Properties]: Properties[Key] extends TReadonly<TSchema> ? (Properties[Key] extends TOptional<Properties[Key]> ? never : Key) : never }[keyof Properties]> = Result
type OptionalKeys<Properties extends TProperties, Result extends PropertyKey = { [Key in keyof Properties]: Properties[Key] extends TOptional<TSchema> ? (Properties[Key] extends TReadonly<Properties[Key]> ? never : Key) : never }[keyof Properties]> = Result
type RequiredKeys<Properties extends TProperties, Result extends PropertyKey = keyof Omit<Properties, ReadonlyOptionalKeys<Properties> | ReadonlyKeys<Properties> | OptionalKeys<Properties>>> = Result
type StaticPropertiesWithModifiers<Properties extends TProperties, PropertiesWithoutModifiers extends Record<PropertyKey, unknown>> = StaticEvaluate<
  & Readonly<Partial<Pick<PropertiesWithoutModifiers, ReadonlyOptionalKeys<Properties>>>>
  & Readonly<Pick<PropertiesWithoutModifiers, ReadonlyKeys<Properties>>>
  & Partial<Pick<PropertiesWithoutModifiers, OptionalKeys<Properties>>>
  & Required<Pick<PropertiesWithoutModifiers, RequiredKeys<Properties>>>
>
// ----------------------------------------------------------------------------
// StaticPropertiesWithoutModifiers
// ----------------------------------------------------------------------------
type StaticPropertiesWithoutModifiers<Stack extends string[], Context extends TProperties, This extends TProperties, Properties extends TProperties, 
  Result extends Record<PropertyKey, unknown> = { 
    [Key in keyof Properties]: StaticType<Stack, Context, This, Properties[Key]> 
  }> = Result
// ----------------------------------------------------------------------------
// StaticProperties
// ----------------------------------------------------------------------------
export type StaticProperties<Stack extends string[], Context extends TProperties, This extends TProperties, Properties extends TProperties, 
  PropertiesWithoutModifiers extends Record<PropertyKey, unknown> = StaticPropertiesWithoutModifiers<Stack, Context, This, Properties>,
  PropertiesWithModifiers extends Record<PropertyKey, unknown> = StaticPropertiesWithModifiers<Properties, PropertiesWithoutModifiers>,
  Result extends Record<PropertyKey, unknown> = { [Key in keyof PropertiesWithModifiers]: PropertiesWithModifiers[Key] }
> = Result
// ----------------------------------------------------------------------------
// TProperties
// ----------------------------------------------------------------------------
/** Represents a Record<PropertyKey, TSchema> structure. */
export interface TProperties extends TSchema {
  [key: PropertyKey]: TSchema
}
// ----------------------------------------------------------------------------
// Required
// ----------------------------------------------------------------------------
/** Creates a RequiredArray derived from the given TProperties value. */
export type TRequiredArray<Properties extends TProperties,
  RequiredProperties extends TProperties = { 
    [Key in keyof Properties as Properties[Key] extends TOptional<Properties[Key]> ? never : Key] : Properties[Key]
  },
  RequiredKeys extends string[] = TUnionToTuple<Extract<keyof RequiredProperties, string>>,
  Result extends string[] | undefined = 
    RequiredKeys extends [] ? undefined : RequiredKeys
> = Result
/** Creates a RequiredArray derived from the given TProperties value. */
export function RequiredArray<Properties extends TProperties>(properties: Properties): TRequiredArray<Properties> {
  return Guard.Keys(properties).filter((key) => !IsOptional(properties[key])) as never
}
// ------------------------------------------------------------------
// PropertyKeys
// ------------------------------------------------------------------
/** Extracts a tuple of keys from a TProperties value. */
export type TPropertyKeys<Properties extends TProperties,
  Result extends string[] = TUnionToTuple<Extract<keyof Properties, string>>
> = Result
/** Extracts a tuple of keys from a TProperties value. */
export function PropertyKeys<Properties extends TProperties>(properties: Properties): TPropertyKeys<Properties> {
  return Guard.Keys(properties) as never
}
// ------------------------------------------------------------------
// PropertyValues
// ------------------------------------------------------------------
type TPropertyValuesReduce<Properties extends TProperties, Keys extends string[], Result extends TSchema[] = []> =
  Keys extends [infer Left extends string, ...infer Right extends string[]]
    ? Left extends keyof Properties
      ? TPropertyValuesReduce<Properties, Right, [...Result, Properties[Left]]>
      : TPropertyValuesReduce<Properties, Right, Result>
    : Result
/** Extracts a tuple of property values from a TProperties value. */
export type TPropertyValues<Properties extends TProperties,
  Keys extends string[] = TPropertyKeys<Properties>,
  Result extends TSchema[] = TPropertyValuesReduce<Properties, Keys>
> = Result
/** Extracts a tuple of property values from a TProperties value. */
export function PropertyValues<Properties extends TProperties>(properties: Properties): TPropertyValues<Properties> {
  return Guard.Values(properties) as never
}