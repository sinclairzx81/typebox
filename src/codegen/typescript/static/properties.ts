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

import * as Schema from '../../../schema/index.ts'
import { StaticSchema } from './schema.ts'
import { Distinct } from './_distinct.ts'

// ------------------------------------------------------------------
// Exclude Extract Operators
// ------------------------------------------------------------------
function Extract<T>(left: T[], right: T[]): T[] {
  return left.filter((value) => right.includes(value))
}
function Exclude<T>(left: T[], right: T[]): T[] {
  return left.filter((value) => !right.includes(value))
}
// ------------------------------------------------------------------
// Utility: Property Key Rendering
// ------------------------------------------------------------------
const IdentifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/
function PropertyKeyString(key: string): string {
  return IdentifierPattern.test(key) ? key : JSON.stringify(key)
}
// ------------------------------------------------------------------
// IsReadonly
// ------------------------------------------------------------------
function IsReadonly(schema: Schema.XSchema): boolean {
  return (
    (schema as Record<PropertyKey, unknown>)['readOnly'] === true ||
    (schema as Record<PropertyKey, unknown>)['~readonly'] === true // review
  )
}
// ------------------------------------------------------------------
// RequiredArray
// ------------------------------------------------------------------
function RequiredArray(schema: Schema.XSchemaObject): string[] {
  return Schema.IsRequired(schema) ? schema.required : []
}
// ------------------------------------------------------------------
// Keys
// ------------------------------------------------------------------
function ReadonlyKeys(properties: Record<PropertyKey, Schema.XSchema>): string[] {
  return Object.keys(properties).filter((key) => IsReadonly(properties[key]))
}
function RequiredKeys(properties: Record<PropertyKey, Schema.XSchema>, requiredArray: string[]): string[] {
  return requiredArray.length === 0 ? [] : Extract(Object.keys(properties), requiredArray)
}
function UnknownKeys(properties: Record<PropertyKey, Schema.XSchema>, requiredArray: string[]): string[] {
  return Exclude(requiredArray, Object.keys(properties))
}
function OptionalKeys(properties: Record<PropertyKey, Schema.XSchema>, requiredArray: string[]): string[] {
  return requiredArray.length === 0 ? Object.keys(properties) : Exclude(Object.keys(properties), requiredArray)
}
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
function ReadonlyOptionalProperties(stack: string[], root: Schema.XSchema, keys: string[], properties: Record<PropertyKey, Schema.XSchema>): string[] {
  return keys.map((key) => `readonly ${PropertyKeyString(key)}?: ${StaticSchema([...stack], root, properties[key])}`)
}
function ReadonlyRequiredProperties(stack: string[], root: Schema.XSchema, keys: string[], properties: Record<PropertyKey, Schema.XSchema>): string[] {
  return keys.map((key) => `readonly ${PropertyKeyString(key)}: ${StaticSchema([...stack], root, properties[key])}`)
}
function OptionalProperties(stack: string[], root: Schema.XSchema, keys: string[], properties: Record<PropertyKey, Schema.XSchema>): string[] {
  return keys.map((key) => `${PropertyKeyString(key)}?: ${StaticSchema([...stack], root, properties[key])}`)
}
function RequiredProperties(stack: string[], root: Schema.XSchema, keys: string[], properties: Record<PropertyKey, Schema.XSchema>): string[] {
  return keys.map((key) => `${PropertyKeyString(key)}: ${StaticSchema([...stack], root, properties[key])}`)
}
function UnknownProperties(keys: string[]): string[] {
  return keys.map((key) => `${PropertyKeyString(key)}: unknown`)
}
// ------------------------------------------------------------------
// StaticProperties
// ------------------------------------------------------------------
export function StaticProperties(stack: string[], root: Schema.XSchema, schema: Schema.XSchemaObject, properties: Record<PropertyKey, Schema.XSchema>): string {
  const requiredArray = RequiredArray(schema)
  // Keys
  const readonlyKeys = ReadonlyKeys(properties)
  const optionalKeys = OptionalKeys(properties, requiredArray)
  const requiredKeys = RequiredKeys(properties, requiredArray)
  const unknownKeys = UnknownKeys(properties, requiredArray)
  // Properties
  const readonlyOptionalProperties = ReadonlyOptionalProperties(stack, root, Extract(optionalKeys, readonlyKeys), properties)
  const readonlyRequiredProperties = ReadonlyRequiredProperties(stack, root, Extract(requiredKeys, readonlyKeys), properties)
  const optionalProperties = OptionalProperties(stack, root, Exclude(optionalKeys, readonlyKeys), properties)
  const requiredProperties = RequiredProperties(stack, root, Exclude(requiredKeys, readonlyKeys), properties)
  const unknownProperties = UnknownProperties(unknownKeys)
  // Result
  const members = Distinct([
    ...readonlyOptionalProperties,
    ...readonlyRequiredProperties,
    ...optionalProperties,
    ...requiredProperties,
    ...unknownProperties
  ])
  return members.length === 0 ? '{}' : `{ ${members.join(', ')} }`
}
