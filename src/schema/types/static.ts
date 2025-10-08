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

// deno-fmt-ignore-file

import type { XGuard } from './_guard.ts'
import type { XSchemaLike } from './schema.ts'
import type { XAdditionalProperties } from './additionalProperties.ts'
import type { XAnyOf } from './anyOf.ts'
import type { XAllOf } from './allOf.ts'
import type { XConst } from './const.ts'
import type { XEnum } from './enum.ts'
import type { XItems } from './items.ts'
import type { XOneOf } from './oneOf.ts'
import type { XPatternProperties } from './patternProperties.ts'
import type { XPrefixItems } from './prefixItems.ts'
import type { XProperties } from './properties.ts'
import type { XRequired } from './required.ts'

// ------------------------------------------------------------------
// XStaticBase
// ------------------------------------------------------------------
export type XStaticBase<Value extends unknown> = Value

// ------------------------------------------------------------------
// XAdditionalProperties
// ------------------------------------------------------------------
type XStaticAdditionalProperties<Schema extends XSchemaLike,
  Result extends Record<PropertyKey, unknown> = (
    Schema extends true ? { [key: string]: unknown } :
    Schema extends false ? {} :
    { [key: string]: XStaticType<Schema> }
  )
> = Result
// ------------------------------------------------------------------
// XAllOf
// ------------------------------------------------------------------
type XStaticAllOf<Schemas extends XSchemaLike[], Result extends unknown = unknown> =
  Schemas extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? XStaticAllOf<Right, XStaticType<Left> & Result>
  : Result
// ------------------------------------------------------------------
// XAnyOf
// ------------------------------------------------------------------
type XStaticAnyOf<Schemas extends XSchemaLike[], Result extends unknown = never> =
  Schemas extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? XStaticAnyOf<Right, XStaticType<Left> | Result>
  : Result
// ------------------------------------------------------------------
// XConst
// ------------------------------------------------------------------
type XStaticConst<Value extends unknown> = Value
// ------------------------------------------------------------------
// XEnum
// ------------------------------------------------------------------
type XStaticEnum<Values extends unknown[], Result extends unknown = never> =
  Values extends [infer Left extends unknown, ...infer Right extends unknown[]]
  ? XStaticEnum<Right, Left | Result>
  : Result
// ------------------------------------------------------------------
// XItems
// ------------------------------------------------------------------
type XStaticItemsUnsized<Schema extends XSchemaLike> = XStaticType<Schema>[]
type XStaticItemsSized<Schema extends XSchemaLike[], Result extends unknown[] = []> =
  Schema extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? XStaticItemsSized<Right, [...Result, XStaticType<Left>]>
  : Result
type XStaticItems<Schemas extends XSchemaLike[] | XSchemaLike,
  Result extends unknown = (
    Schemas extends XSchemaLike[] ? XStaticItemsSized<[...Schemas]> :
    Schemas extends XSchemaLike ? XStaticItemsUnsized<Schemas> :
    never
  )
> = Result
// ------------------------------------------------------------------
// XOneOf
// ------------------------------------------------------------------
type XStaticOneOf<Schemas extends XSchemaLike[], Result extends unknown = never> =
  Schemas extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? XStaticOneOf<Right, XStaticType<Left> | Result>
  : Result
// ------------------------------------------------------------------
// XPatternProperties
// ------------------------------------------------------------------
type XStaticPatternProperties<Properties extends Record<PropertyKey, XSchemaLike> = Record<PropertyKey, XSchemaLike>,
  InferredProperties extends Record<PropertyKey, unknown> = { [Key in keyof Properties]: XStaticType<Properties[Key]> },
  EvaluatedProperties extends unknown = { [key: string]: InferredProperties[keyof InferredProperties] }
> = EvaluatedProperties
// ------------------------------------------------------------------
// XPrefixItems
// ------------------------------------------------------------------
type XStaticPrefixItems<Schemas extends XSchemaLike[], Result extends unknown[] = []> =
  Schemas extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? XStaticPrefixItems<Right, [...Result, XStaticType<Left>]>
  : Result
// ------------------------------------------------------------------
// XProperties
// ------------------------------------------------------------------
type XStaticProperties<Properties extends Record<PropertyKey, XSchemaLike>,
  Readonly extends Record<PropertyKey, unknown> = {
    readonly [Key in keyof Properties as Properties[Key] extends { readOnly: true } ? Key : never]?: XStaticType<Properties[Key]>
  },
  Standard extends Record<PropertyKey, unknown> = {
    [Key in keyof Properties as Properties[Key] extends { readOnly: true } ? never : Key]?: XStaticType<Properties[Key]>
  },
  Result extends Record<PropertyKey, unknown> = Readonly & Standard
> = Result
// ------------------------------------------------------------------
// XRequired
// ------------------------------------------------------------------
type RequiredSelectProperty<Properties extends Record<PropertyKey, XSchemaLike>, Key extends string, Result extends Record<PropertyKey, unknown> = (
  Key extends keyof Properties
  ? Properties[Key] extends { readOnly: true }
    ? { readonly [_ in Key]: XStaticType<Properties[Key]> }
    : { [_ in Key]: XStaticType<Properties[Key]> }
  : { [_ in Key]: unknown }
)> = Result
type RequiredSelectProperties<Properties extends Record<PropertyKey, XSchemaLike>, Keys extends string[], Result extends Record<PropertyKey, unknown> = {}> =
  Keys extends [infer Left extends string, ...infer Right extends string[]]
  ? RequiredSelectProperties<Properties, Right, Result & RequiredSelectProperty<Properties, Left>>
  : Result
type RequiredGetProperties<Schema extends XSchemaLike, Result extends Record<PropertyKey, unknown> = (
  Schema extends XProperties<infer Properties extends Record<PropertyKey, XSchemaLike>>
  ? Properties
  : {}
)> = Result
type XStaticRequired<Schema extends XSchemaLike, Keys extends string[],
  Properties extends Record<PropertyKey, XSchemaLike> = RequiredGetProperties<Schema>,
  Result extends Record<PropertyKey, unknown> = RequiredSelectProperties<Properties, Keys>
> = Result
// ------------------------------------------------------------------
// XStaticKeywords
// ------------------------------------------------------------------
type XStaticKeywords<Schema, Result extends unknown[] = [
  Schema extends XAdditionalProperties<infer Type extends XSchemaLike> ? XStaticAdditionalProperties<Type> : unknown,
  Schema extends XAllOf<infer Types extends XSchemaLike[]> ? XStaticAllOf<Types> : unknown,
  Schema extends XAnyOf<infer Types extends XSchemaLike[]> ? XStaticAnyOf<Types> : unknown,
  Schema extends XConst<infer Value extends unknown> ? XStaticConst<Value> : unknown,
  Schema extends XEnum<infer Values extends unknown[]> ? XStaticEnum<Values> : unknown,
  Schema extends XItems<infer Types extends XSchemaLike[] | XSchemaLike> ? XStaticItems<Types> : unknown,
  Schema extends XOneOf<infer Types extends XSchemaLike[]> ? XStaticOneOf<Types> : unknown,
  Schema extends XPatternProperties<infer Properties extends Record<PropertyKey, XSchemaLike>> ? XStaticPatternProperties<Properties> : unknown,
  Schema extends XPrefixItems<infer Types extends XSchemaLike[]> ? XStaticPrefixItems<Types> : unknown,
  Schema extends XProperties<infer Properties extends Record<PropertyKey, XSchemaLike>> ? XStaticProperties<Properties> : unknown,
  Schema extends XRequired<infer Keys extends string[]> ? XStaticRequired<Schema, Keys> : unknown,
  Schema extends { type: 'array' } ? {} : unknown,
  Schema extends { type: 'bigint' } ? bigint : unknown,
  Schema extends { type: 'boolean' } ? boolean : unknown,
  Schema extends { type: 'integer' } ? number : unknown,
  Schema extends { type: 'object' } ? object : unknown,
  Schema extends { type: 'null' } ? null : unknown,
  Schema extends { type: 'number' } ? number : unknown,
  Schema extends { type: 'string' } ? string : unknown,
  Schema extends { type: 'symbol' } ? symbol : unknown,
  Schema extends { type: 'undefined' } ? undefined : unknown,
]> = Result
// ------------------------------------------------------------------
// XStaticKeywordIntersect
// ------------------------------------------------------------------
type XStaticKeywordIntersect<Schemas extends unknown[], Result extends unknown = unknown> = (
  Schemas extends [infer Left extends unknown, ...infer Right extends unknown[]]
  ? XStaticKeywordIntersect<Right, Result & Left>
  : Result
)
// ------------------------------------------------------------------
// XStaticEvaluate
// ------------------------------------------------------------------
type XStaticEvaluate<Schema extends unknown,
  Result extends unknown = Schema extends object
  ? { [Key in keyof Schema]: Schema[Key] }
  : Schema
> = Result
// ------------------------------------------------------------------
// XStaticJsonSchema
// ------------------------------------------------------------------
type XStaticJsonSchema<Schema extends unknown,
  Keywords extends unknown[] = XStaticKeywords<Schema>,
  Intersect extends unknown = XStaticKeywordIntersect<Keywords>,
  Result extends unknown = XStaticEvaluate<Intersect>
> = Result
// ------------------------------------------------------------------
// XStatic
// ------------------------------------------------------------------
/** Statically infers a JSON Schema or Validator */
export type XStaticType<Schema extends XSchemaLike, Result extends unknown = (
  Schema extends XGuard<infer Value> ? Value : XStaticJsonSchema<Schema>
)> = Result
// ------------------------------------------------------------------
// XStaticMutable: Preflight
// ------------------------------------------------------------------
type XStaticMutableTuple<Schemas extends readonly unknown[]> = (
  Schemas extends [infer Left, ...infer Right extends unknown[]]
  ? [XStaticMutable<Left>, ...XStaticMutableTuple<Right>]
  : []
)
type XStaticMutableArray<Schema extends unknown,
  Result extends unknown[] = XStaticMutable<Schema>[]
> = Result
type XStaticMutableObject<Schema extends object, Result extends Record<PropertyKey, unknown> = {
  -readonly [K in keyof Schema]: XStaticMutable<Schema[K]>
}> = Result
type XStaticMutable<Schema> = (
  Schema extends XGuard ? Schema :
  Schema extends readonly [...infer Schemas extends unknown[]] ? XStaticMutableTuple<Schemas> :
  Schema extends readonly (infer Schema)[] ? XStaticMutableArray<Schema> :
  Schema extends object ? XStaticMutableObject<Schema> :
  Schema
)
// ------------------------------------------------------------------
// XStatic
// ------------------------------------------------------------------
/** Statically infers a JSON Schema */
export type XStatic<Schema extends XSchemaLike, 
  Mutable extends XSchemaLike = XStaticMutable<Schema>,
  Result extends unknown = XStaticType<Mutable>  
> = Result
