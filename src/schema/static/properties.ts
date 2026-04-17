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

// deno-fmt-ignore-file

import type { XSchema } from '../types/schema.ts'
import type { XRequired } from '../types/required.ts'
import type { XStaticSchema } from './schema.ts'

// ------------------------------------------------------------------
// IsReadonly
// ------------------------------------------------------------------
type XIsReadonly<Schema extends XSchema> = (
  Schema extends { readOnly: true } ? true :
  Schema extends { '~readonly': true } ? true : // review
  false
)
// ------------------------------------------------------------------
// RequiredArray
// ------------------------------------------------------------------
type XRequiredArray<Schema extends XSchema,
  Result extends PropertyKey[] = Schema extends XRequired<infer Keys extends string[]> ? Keys : []
> = Result
// ------------------------------------------------------------------
// Keys
// ------------------------------------------------------------------
type XReadonlyKeys<Properties extends Record<PropertyKey, XSchema>,
  ReadonlyProperties extends Record<PropertyKey, unknown> = { [Key in keyof Properties as XIsReadonly<Properties[Key]> extends true ? Key : never]: unknown },
  Result extends PropertyKey = keyof ReadonlyProperties
> = Result
type XRequiredKeys<Properties extends Record<PropertyKey, XSchema>, RequiredArray extends string[], 
  Result extends PropertyKey = RequiredArray extends [] ? never : Extract<keyof Properties, RequiredArray[number]>
> = Result
type XUnknownKeys<Properties extends Record<PropertyKey, XSchema>, RequiredArray extends string[],
  Result extends PropertyKey = Exclude<RequiredArray[number], keyof Properties>
> = Result
type XOptionalKeys<Properties extends Record<PropertyKey, XSchema>, RequiredArray extends string[],
  Result extends PropertyKey = RequiredArray extends [] ? keyof Properties : Exclude<keyof Properties, RequiredArray[number]>
> = Result
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
type XReadonlyOptionalProperties<Stack extends string[], Root extends XSchema, OptionalKeys extends PropertyKey, Properties extends Record<PropertyKey, XSchema>> = {
  readonly [Key in Extract<keyof Properties, OptionalKeys>]?: XStaticSchema<Stack, Root, Properties[Key]>
}
type XReadonlyRequiredProperties<Stack extends string[], Root extends XSchema, RequiredKeys extends PropertyKey, Properties extends Record<PropertyKey, XSchema>> = {
  readonly [Key in Extract<keyof Properties, RequiredKeys>]: XStaticSchema<Stack, Root, Properties[Key]>
}
type XOptionalProperties<Stack extends string[], Root extends XSchema, OptionalKeys extends PropertyKey, Properties extends Record<PropertyKey, XSchema>> = {
  [Key in Extract<keyof Properties, OptionalKeys>]?: XStaticSchema<Stack, Root, Properties[Key]>
}
type XRequiredProperties<Stack extends string[], Root extends XSchema, RequiredKeys extends PropertyKey, Properties extends Record<PropertyKey, XSchema>> = {
  [Key in Extract<keyof Properties, RequiredKeys>]: XStaticSchema<Stack, Root, Properties[Key]>
}
type XUnknownProperties<UnknownKeys extends PropertyKey> = {
  [Key in UnknownKeys]: unknown
}
// ------------------------------------------------------------------
// XStaticProperties
// ------------------------------------------------------------------
export type XStaticProperties<Stack extends string[], Root extends XSchema, Schema extends XSchema, Properties extends Record<PropertyKey, XSchema>,
  RequiredArray extends string[] = XRequiredArray<Schema>,
  // Keys
  ReadonlyKeys extends PropertyKey = XReadonlyKeys<Properties>,
  OptionalKeys extends PropertyKey = XOptionalKeys<Properties, RequiredArray>,
  RequiredKeys extends PropertyKey = XRequiredKeys<Properties, RequiredArray>,
  UnknownKeys extends PropertyKey = XUnknownKeys<Properties, RequiredArray>,
  // Properties
  ReadonlyOptionalProperties extends Record<PropertyKey, unknown> = XReadonlyOptionalProperties<Stack, Root, Extract<OptionalKeys, ReadonlyKeys>, Properties>,
  ReadonlyRequiredProperties extends Record<PropertyKey, unknown> = XReadonlyRequiredProperties<Stack, Root, Extract<RequiredKeys, ReadonlyKeys>, Properties>,
  OptionalProperties extends Record<PropertyKey, unknown> = XOptionalProperties<Stack, Root, Exclude<OptionalKeys, ReadonlyKeys>, Properties>,
  RequiredProperties extends Record<PropertyKey, unknown> = XRequiredProperties<Stack, Root, Exclude<RequiredKeys, ReadonlyKeys>, Properties>,
  UnknownProperties extends Record<PropertyKey, unknown> = XUnknownProperties<UnknownKeys>,
  // Properties
  Result extends Record<PropertyKey, unknown> = (
    ReadonlyOptionalProperties &
    ReadonlyRequiredProperties &
    OptionalProperties & 
    RequiredProperties & 
    UnknownProperties
  )
> = Result