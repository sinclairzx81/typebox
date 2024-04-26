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

import type { TSchema, SchemaOptions } from '../schema/index'
import type { Static } from '../static/index'
import type { Evaluate } from '../helpers/index'
import type { TReadonly } from '../readonly/index'
import type { TOptional } from '../optional/index'
import { CloneType } from '../clone/type'
import { Kind } from '../symbols/index'

// ------------------------------------------------------------------
// TypeGuard
// ------------------------------------------------------------------
import { IsOptional, IsSchema } from '../guard/kind'

// ------------------------------------------------------------------
// ObjectStatic
// ------------------------------------------------------------------
type ReadonlyOptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonly<TSchema> ? (T[K] extends TOptional<T[K]> ? K : never) : never }[keyof T]
type ReadonlyPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonly<TSchema> ? (T[K] extends TOptional<T[K]> ? never : K) : never }[keyof T]
type OptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TOptional<TSchema> ? (T[K] extends TReadonly<T[K]> ? never : K) : never }[keyof T]
type RequiredPropertyKeys<T extends TProperties> = keyof Omit<T, ReadonlyOptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | OptionalPropertyKeys<T>>

// prettier-ignore
type ObjectStaticProperties<T extends TProperties, R extends Record<keyof any, unknown>> = Evaluate<(
  Readonly<Partial<Pick<R, ReadonlyOptionalPropertyKeys<T>>>> &
  Readonly<Pick<R, ReadonlyPropertyKeys<T>>> &
  Partial<Pick<R, OptionalPropertyKeys<T>>> &
  Required<Pick<R, RequiredPropertyKeys<T>>>
)>
// prettier-ignore
type ObjectStatic<T extends TProperties, P extends unknown[]> = ObjectStaticProperties<T, {
  [K in keyof T]: Static<T[K], P>
}>
// ------------------------------------------------------------------
// TProperties
// ------------------------------------------------------------------
export type TPropertyKey = string | number // Consider making this PropertyKey
export type TProperties = Record<TPropertyKey, TSchema>
// ------------------------------------------------------------------
// TObject
// ------------------------------------------------------------------
export type TAdditionalProperties = undefined | TSchema | boolean
export interface ObjectOptions extends SchemaOptions {
  /** Additional property constraints for this object */
  additionalProperties?: TAdditionalProperties
  /** The minimum number of properties allowed on this object */
  minProperties?: number
  /** The maximum number of properties allowed on this object */
  maxProperties?: number
}
export interface TObject<T extends TProperties = TProperties> extends TSchema, ObjectOptions {
  [Kind]: 'Object'
  static: ObjectStatic<T, this['params']>
  additionalProperties?: TAdditionalProperties
  type: 'object'
  properties: T
  required?: string[]
}
/** `[Json]` Creates an Object type */
function _Object<T extends TProperties>(properties: T, options: ObjectOptions = {}): TObject<T> {
  const propertyKeys = globalThis.Object.getOwnPropertyNames(properties)
  const optionalKeys = propertyKeys.filter((key) => IsOptional(properties[key]))
  const requiredKeys = propertyKeys.filter((name) => !optionalKeys.includes(name))
  const clonedAdditionalProperties = IsSchema(options.additionalProperties) ? { additionalProperties: CloneType(options.additionalProperties) } : {}
  const clonedProperties = {} as Record<PropertyKey, TSchema>
  for (const key of propertyKeys) clonedProperties[key] = CloneType(properties[key])
  return (
    requiredKeys.length > 0
      ? { ...options, ...clonedAdditionalProperties, [Kind]: 'Object', type: 'object', properties: clonedProperties, required: requiredKeys }
      : { ...options, ...clonedAdditionalProperties, [Kind]: 'Object', type: 'object', properties: clonedProperties }
  ) as never
}

/** `[Json]` Creates an Object type */
export const Object = _Object
