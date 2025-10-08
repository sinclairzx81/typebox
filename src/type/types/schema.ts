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

// deno-lint-ignore-file
// deno-fmt-ignore-file

import { Guard } from '../../guard/index.ts'

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
export interface TSchema { }
// ------------------------------------------------------------------
// Kind
// ------------------------------------------------------------------
export function IsKind<Kind extends string>(value: unknown, kind: Kind): value is { ['~kind']: Kind } {
  return Guard.IsObject(value) && Guard.HasPropertyKey(value, '~kind') && Guard.IsEqual(value["~kind"], kind)
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export function IsSchema(value: unknown): value is TSchema {
  return Guard.IsObject(value)
}
// ------------------------------------------------------------------
// SchemaOptions
// ------------------------------------------------------------------
export interface TSchemaOptions {
  /** 
   * Allows for additional, unlisted properties to be included, typically for extensibility. 
   */
  [key: PropertyKey]: unknown
  /** 
   * Specifies the URI of a JSON Schema that the current schema adheres to. 
   */
  $schema?: string
  /** 
   * A URI that serves as a unique identifier for the schema. 
   */
  $id?: string
  /** 
   * A short explanation about the purpose of the data described by the schema. 
   */
  title?: string
  /** 
   * A detailed explanation of the data described by the schema. 
   */
  description?: string
  /** 
   * A default value for the data, used when no value is provided. 
   */
  default?: unknown
  /** 
   * Provides one or more examples of valid data conforming to the schema. 
   */
  examples?: unknown
  /** 
   * Indicates that the data should only be readable and not modified. 
   */
  readOnly?: boolean
  /** 
   * Indicates that the data should only be writable and not read back. 
   */
  writeOnly?: boolean
  /** 
   * A schema to apply conditionally: if the data validates against this schema, 'then' applies. 
   */
  if?: TSchema
  /** 
   * A schema to apply if the data validates against the 'if' schema. 
   */
  then?: TSchema
  /** 
   * A schema to apply if the data does not validate against the 'if' schema. 
   */
  else?: TSchema
}
// ------------------------------------------------------------------
// ObjectOptions
// ------------------------------------------------------------------
export interface TObjectOptions extends TSchemaOptions {
  /** 
   * Defines whether additional properties are allowed beyond those explicitly defined in `properties`. 
   */
  additionalProperties?: TSchema | boolean
  /** 
   * The minimum number of properties required in the object. 
   */
  minProperties?: number
  /** 
   * The maximum number of properties allowed in the object. 
   */
  maxProperties?: number
  /** 
   * Defines conditional requirements for properties. 
   */
  dependencies?: Record<string, boolean | TSchema | string[]>
  /** 
   * Specifies properties that *must* be present if a given property is present. 
   */
  dependentRequired?: Record<string, string[]>
  /** 
   * Defines schemas that apply if a specific property is present. 
   */
  dependentSchemas?: Record<string, TSchema>
  /** 
   * Maps regular expressions to schemas properties matching a pattern must validate against the schema. 
   */
  patternProperties?: Record<string, TSchema>
  /** 
   * A schema that all property names within the object must validate against. 
   */
  propertyNames?: TSchema
}
// ------------------------------------------------------------------
// ArrayOptions
// ------------------------------------------------------------------
export interface TArrayOptions extends TSchemaOptions {
  /** 
   * The minimum number of items allowed in the array. 
   */
  minItems?: number
  /** 
   * The maximum number of items allowed in the array. 
   */
  maxItems?: number
  /** 
   * A schema that at least one item in the array must validate against. 
   */
  contains?: TSchema
  /** 
   * The minimum number of array items that must validate against the `contains` schema. 
   */
  minContains?: number
  /** 
   * The maximum number of array items that may validate against the `contains` schema. 
   */
  maxContains?: number
  /** 
   * An array of schemas, where each schema in `prefixItems` validates against items at corresponding positions from the beginning of the array. 
   */
  prefixItems?: TSchema[]
  /** 
   * If `true`, all items in the array must be unique. 
   */
  uniqueItems?: boolean
}
// ------------------------------------------------------------------
// TupleOptions
// ------------------------------------------------------------------
export interface TTupleOptions extends TArrayOptions {
  /** 
   * A schema to apply to any items in the array that were not validated by `prefixItems` or `items`. If `false`, no additional items are allowed. 
   */
  unevaluatedItems?: TSchema | boolean
}
// ------------------------------------------------------------------
// IntersectOptions
// ------------------------------------------------------------------
export interface TIntersectOptions extends TSchemaOptions {
  /** 
   * A schema to apply to any properties in the object that were not validated by other keywords like `properties`, `patternProperties`, or `additionalProperties`. If `false`, no additional properties are allowed. 
   */
  unevaluatedProperties?: TSchema | boolean
}
// ------------------------------------------------------------------
// NumberOptions
// ------------------------------------------------------------------
export interface TNumberOptions extends TSchemaOptions {
  /** 
   * Specifies an exclusive upper limit for the number (number must be less than this value). 
   */
  exclusiveMaximum?: number | bigint
  /** 
   * Specifies an exclusive lower limit for the number (number must be greater than this value). 
   */
  exclusiveMinimum?: number | bigint
  /** 
   * Specifies an inclusive upper limit for the number (number must be less than or equal to this value). 
   */
  maximum?: number | bigint
  /** 
   * Specifies an inclusive lower limit for the number (number must be greater than or equal to this value). 
   */
  minimum?: number | bigint
  /** 
   * Specifies that the number must be a multiple of this value. 
   */
  multipleOf?: number | bigint
}
// ------------------------------------------------------------------
// StringOptions
// ------------------------------------------------------------------
export type TFormat = 
  | 'date-time'
  | 'date'
  | 'duration'
  | 'email'
  | 'hostname'
  | 'idn-email'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'iri-reference'
  | 'iri'
  | 'json-pointer-uri-fragment'
  | 'json-pointer'
  | 'json-string'
  | 'regex'
  | 'relative-json-pointer'
  | 'time'
  | 'uri-reference'
  | 'uri-template'
  | 'url'
  | 'uuid'
  | ({} & string)
export interface TStringOptions extends TSchemaOptions {
  /** 
   * Specifies the expected string format. 
   * 
   * Common values include:
   * - `base64` – Base64-encoded string.
   * - `date-time` – [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date-time format.
   * - `date` – [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date (YYYY-MM-DD).
   * - `duration` – [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) duration format.
   * - `email` – RFC 5321/5322 compliant email address.
   * - `hostname` – RFC 1034/1035 compliant host name.
   * - `idn-email` – Internationalized email address.
   * - `idn-hostname` – Internationalized host name.
   * - `ipv4` – IPv4 address.
   * - `ipv6` – IPv6 address.
   * - `iri` / `iri-reference` – Internationalized Resource Identifier.
   * - `json-pointer` / `json-pointer-uri-fragment` – JSON Pointer format.
   * - `json-string` – String containing valid JSON.
   * - `regex` – Regular expression syntax.
   * - `relative-json-pointer` – Relative JSON Pointer format.
   * - `time` – [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time (HH:MM:SS).
   * - `uri-reference` / `uri-template` – URI reference or template.
   * - `url` – Web URL format.
   * - `uuid` – RFC 4122 UUID string.
   * 
   * May also be a custom format string.
   */
  format?: TFormat
  /** 
   * Specifies the minimum number of characters allowed in the string.  
   * Must be a non-negative integer.
   */
  minLength?: number
  /** 
   * Specifies the maximum number of characters allowed in the string.  
   * Must be a non-negative integer.
   */
  maxLength?: number
  /** 
   * Specifies a regular expression pattern that the string value must match.  
   * Can be provided as a string (ECMA-262 regex syntax) or a `RegExp` object.
   */
  pattern?: string | RegExp
}