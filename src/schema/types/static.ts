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

import type { XSchemaLike } from '../types/schema.ts'
import type { XStandardSchemaV1, XStandardValidatorV1 } from './_standard.ts'
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
// XStandardSchemaV1
// ------------------------------------------------------------------
export type StaticXStandardSchemaV1<Validator extends XStandardValidatorV1,
  ValidateResult extends unknown = ReturnType<Validator['validate']>,
  RemoveAsync extends unknown = Exclude<ValidateResult, Promise<any>>,
  RemoveIssue extends unknown = Exclude<RemoveAsync, { issues: any }>,
  Result extends unknown = RemoveIssue extends { value: infer Value } ? Value : unknown
> = Result
// ------------------------------------------------------------------
// XAdditionalProperties
// ------------------------------------------------------------------
type StaticXAdditionalProperties<Schema extends XSchemaLike,
  Result extends Record<PropertyKey, unknown> = (
    Schema extends true ? { [key: string]: unknown } :
    Schema extends false ? {} :
    { [key: string]: XStatic<Schema> }
  )
> = Result
// ------------------------------------------------------------------
// XAllOf
// ------------------------------------------------------------------
type StaticXAllOf<Schemas extends XSchemaLike[], Result extends unknown = unknown> =
  Schemas extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? StaticXAllOf<Right, XStatic<Left> & Result>
  : Result
// ------------------------------------------------------------------
// XAnyOf
// ------------------------------------------------------------------
type StaticXAnyOf<Schemas extends XSchemaLike[], Result extends unknown = never> =
  Schemas extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? StaticXAnyOf<Right, XStatic<Left> | Result>
  : Result
// ------------------------------------------------------------------
// XConst
// ------------------------------------------------------------------
type StaticXConst<Value extends unknown> = Value
// ------------------------------------------------------------------
// XEnum
// ------------------------------------------------------------------
type StaticXEnum<Values extends unknown[], Result extends unknown = never> =
  Values extends [infer Left extends unknown, ...infer Right extends unknown[]]
  ? StaticXEnum<Right, Left | Result>
  : Result
// ------------------------------------------------------------------
// XItems
// ------------------------------------------------------------------
type StaticXItemsUnsized<Schema extends XSchemaLike> = XStatic<Schema>[]
type StaticXItemsSized<Schema extends XSchemaLike[], Result extends unknown[] = []> =
  Schema extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? StaticXItemsSized<Right, [...Result, XStatic<Left>]>
  : Result
type StaticXItems<Schemas extends XSchemaLike[] | XSchemaLike,
  Result extends unknown = (
    Schemas extends XSchemaLike[] ? StaticXItemsSized<[...Schemas]> :
    Schemas extends XSchemaLike ? StaticXItemsUnsized<Schemas> :
    never
  )
> = Result
// ------------------------------------------------------------------
// XOneOf
// ------------------------------------------------------------------
type StaticXOneOf<Schemas extends XSchemaLike[], Result extends unknown = never> =
  Schemas extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? StaticXOneOf<Right, XStatic<Left> | Result>
  : Result
// ------------------------------------------------------------------
// XPatternProperties
// ------------------------------------------------------------------
type StaticXPatternProperties<Properties extends Record<PropertyKey, XSchemaLike> = Record<PropertyKey, XSchemaLike>,
  InferredProperties extends Record<PropertyKey, unknown> = { [Key in keyof Properties]: XStatic<Properties[Key]> },
  EvaluatedProperties extends unknown = { [key: string]: InferredProperties[keyof InferredProperties] }
> = EvaluatedProperties
// ------------------------------------------------------------------
// XPrefixItems
// ------------------------------------------------------------------
type StaticXPrefixItems<Schemas extends XSchemaLike[], Result extends unknown[] = []> =
  Schemas extends [infer Left extends XSchemaLike, ...infer Right extends XSchemaLike[]]
  ? StaticXPrefixItems<Right, [...Result, XStatic<Left>]>
  : Result
// ------------------------------------------------------------------
// XProperties
// ------------------------------------------------------------------
type StaticXProperties<Properties extends Record<PropertyKey, XSchemaLike>,
  Readonly extends Record<PropertyKey, unknown> = {
    readonly [Key in keyof Properties as Properties[Key] extends { readOnly: true } ? Key : never]?: XStatic<Properties[Key]>
  },
  Standard extends Record<PropertyKey, unknown> = {
    [Key in keyof Properties as Properties[Key] extends { readOnly: true } ? never : Key]?: XStatic<Properties[Key]>
  },
  Result extends Record<PropertyKey, unknown> = Readonly & Standard
> = Result
// ------------------------------------------------------------------
// XRequired
// ------------------------------------------------------------------
type RequiredSelectProperty<Properties extends Record<PropertyKey, XSchemaLike>, Key extends string, Result extends Record<PropertyKey, unknown> = (
  Key extends keyof Properties
  ? Properties[Key] extends { readOnly: true }
  ? { readonly [_ in Key]: XStatic<Properties[Key]> }
  : { [_ in Key]: XStatic<Properties[Key]> }
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
type StaticXRequired<Schema extends XSchemaLike, Keys extends string[],
  Properties extends Record<PropertyKey, XSchemaLike> = RequiredGetProperties<Schema>,
  Result extends Record<PropertyKey, unknown> = RequiredSelectProperties<Properties, Keys>
> = Result
// ------------------------------------------------------------------
// XStaticKeywords
//
// Returns a Tuple where each element is an inferred Keyword. 
// ------------------------------------------------------------------
type StaticXKeywords<Schema, Result extends unknown[] = [
  Schema extends XAdditionalProperties<infer Type extends XSchemaLike> ? StaticXAdditionalProperties<Type> : unknown,
  Schema extends XAllOf<infer Types extends XSchemaLike[]> ? StaticXAllOf<Types> : unknown,
  Schema extends XAnyOf<infer Types extends XSchemaLike[]> ? StaticXAnyOf<Types> : unknown,
  Schema extends XConst<infer Value extends unknown> ? StaticXConst<Value> : unknown,
  Schema extends XEnum<infer Values extends unknown[]> ? StaticXEnum<Values> : unknown,
  Schema extends XItems<infer Types extends XSchemaLike[] | XSchemaLike> ? StaticXItems<Types> : unknown,
  Schema extends XOneOf<infer Types extends XSchemaLike[]> ? StaticXOneOf<Types> : unknown,
  Schema extends XPatternProperties<infer Properties extends Record<PropertyKey, XSchemaLike>> ? StaticXPatternProperties<Properties> : unknown,
  Schema extends XPrefixItems<infer Types extends XSchemaLike[]> ? StaticXPrefixItems<Types> : unknown,
  Schema extends XProperties<infer Properties extends Record<PropertyKey, XSchemaLike>> ? StaticXProperties<Properties> : unknown,
  Schema extends XRequired<infer Keys extends string[]> ? StaticXRequired<Schema, Keys> : unknown,
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
// StaticXReduce
// ------------------------------------------------------------------
type StaticXReduce<Schemas extends unknown[], Result extends unknown = unknown> = (
  Schemas extends [infer Left extends unknown, ...infer Right extends unknown[]]
  ? StaticXReduce<Right, Result & Left>
  : Result
)
// ------------------------------------------------------------------
// XStaticNonReadonly
// ------------------------------------------------------------------
type StaticXNonReadonlyTuple<Schemas extends readonly unknown[]> = (
  Schemas extends [infer Left, ...infer Right extends unknown[]]
  ? [StaticXNonReadonly<Left>, ...StaticXNonReadonlyTuple<Right>]
  : []
)
type StaticXNonReadonlyArray<Schema extends unknown,
  Result extends unknown[] = StaticXNonReadonly<Schema>[]
> = Result
type StaticXNonReadonlyObject<Schema extends object, Result extends Record<PropertyKey, unknown> = {
  -readonly [K in keyof Schema]: StaticXNonReadonly<Schema[K]>
}> = Result
type StaticXNonReadonly<Schema> = (
  Schema extends readonly [...infer Rest extends unknown[]] ? StaticXNonReadonlyTuple<Rest> :
  Schema extends readonly (infer U)[] ? StaticXNonReadonlyArray<U> :
  Schema extends object ? StaticXNonReadonlyObject<Schema> :
  Schema
)
// ------------------------------------------------------------------
// StaticXEvaluate
// ------------------------------------------------------------------
type StaticXEvaluate<Schema extends unknown,
  Result extends unknown = Schema extends object
  ? { [Key in keyof Schema]: Schema[Key] }
  : Schema
> = Result
type StaticXSchema<Schema extends unknown,
  NonReadonly extends unknown = StaticXNonReadonly<Schema>,
  Keywords extends unknown[] = StaticXKeywords<NonReadonly>,
  Reduced extends unknown = StaticXReduce<Keywords>,
  Result extends unknown = StaticXEvaluate<Reduced>
> = Result
// ------------------------------------------------------------------
// XStatic
// ------------------------------------------------------------------
/** Statically infers a JSON Schema or Standard Schema */
export type XStatic<Schema extends XSchemaLike, Result extends unknown = (
  Schema extends XStandardSchemaV1<infer Validator extends XStandardValidatorV1>
  ? StaticXStandardSchemaV1<Validator>
  : StaticXSchema<Schema>
)> = Result