/*--------------------------------------------------------------------------

@sinclair/typebox

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

// --------------------------------------------------------------------------
// Compositing Symbols
// --------------------------------------------------------------------------
export const Modifier = Symbol.for('TypeBox.Modifier')
export const Hint = Symbol.for('TypeBox.Hint')
export const Kind = Symbol.for('TypeBox.Kind')
// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------
export type TupleToIntersect<T extends any[]> = T extends [infer I] ? I : T extends [infer I, ...infer R] ? I & TupleToIntersect<R> : never
export type TupleToUnion<T extends any[]> = { [K in keyof T]: T[K] }[number]
export type UnionToIntersect<U> = (U extends unknown ? (arg: U) => 0 : never) extends (arg: infer I) => 0 ? I : never
export type UnionLast<U> = UnionToIntersect<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0 ? L : never
export type UnionToTuple<U, L = UnionLast<U>> = [U] extends [never] ? [] : [...UnionToTuple<Exclude<U, L>>, L]
export type Assert<T, E> = T extends E ? T : never
export type Evaluate<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
export type Ensure<T> = T extends infer U ? U : never
// --------------------------------------------------------------------------
// Modifiers
// --------------------------------------------------------------------------
export type TModifier = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>
export type TReadonly<T extends TSchema> = T & { [Modifier]: 'Readonly' }
export type TOptional<T extends TSchema> = T & { [Modifier]: 'Optional' }
export type TReadonlyOptional<T extends TSchema> = T & { [Modifier]: 'ReadonlyOptional' }
// --------------------------------------------------------------------------
// TSchema
// --------------------------------------------------------------------------
export interface SchemaOptions {
  $schema?: string
  /** Id for this schema */
  $id?: string
  /** Title of this schema */
  title?: string
  /** Description of this schema */
  description?: string
  /** Default value for this schema */
  default?: any
  /** Example values matching this schema */
  examples?: any
  [prop: string]: any
}
export interface TKind {
  [Kind]: string
}
export interface TSchema extends SchemaOptions, TKind {
  [Modifier]?: string
  [Hint]?: string
  params: unknown[]
  static: unknown
}
// --------------------------------------------------------------------------
// TAnySchema
// --------------------------------------------------------------------------
export type TAnySchema =
  | TSchema
  | TAny
  | TArray
  | TBigInt
  | TBoolean
  | TConstructor
  | TDate
  | TEnum
  | TFunction
  | TInteger
  | TIntersect
  | TLiteral
  | TNot
  | TNull
  | TNumber
  | TObject
  | TPromise
  | TRecord
  | TRef
  | TSelf
  | TString
  | TSymbol
  | TTuple
  | TUndefined
  | TUnion
  | TUint8Array
  | TUnknown
  | TVoid
// --------------------------------------------------------------------------
// TNumeric
// --------------------------------------------------------------------------
export type TNumeric = TInteger | TNumber
export interface NumericOptions<N extends number | bigint> extends SchemaOptions {
  exclusiveMaximum?: N
  exclusiveMinimum?: N
  maximum?: N
  minimum?: N
  multipleOf?: N
}
// --------------------------------------------------------------------------
// TAny
// --------------------------------------------------------------------------
export interface TAny extends TSchema {
  [Kind]: 'Any'
  static: any
}
// --------------------------------------------------------------------------
// TArray
// --------------------------------------------------------------------------
export interface ArrayOptions extends SchemaOptions {
  uniqueItems?: boolean
  minItems?: number
  maxItems?: number
}
export interface TArray<T extends TSchema = TSchema> extends TSchema, ArrayOptions {
  [Kind]: 'Array'
  static: Static<T, this['params']>[]
  type: 'array'
  items: T
}
// --------------------------------------------------------------------------
// TBigInt
// --------------------------------------------------------------------------
export interface TBigInt extends TSchema, NumericOptions<bigint> {
  [Kind]: 'BigInt'
  static: bigint
  type: 'null'
  typeOf: 'BigInt'
}
// --------------------------------------------------------------------------
// TBoolean
// --------------------------------------------------------------------------
export interface TBoolean extends TSchema {
  [Kind]: 'Boolean'
  static: boolean
  type: 'boolean'
}
// --------------------------------------------------------------------------
// TConstructorParameters
// --------------------------------------------------------------------------
export type TConstructorParameters<T extends TConstructor<TSchema[], TSchema>> = TTuple<T['parameters']>
// --------------------------------------------------------------------------
// TInstanceType
// --------------------------------------------------------------------------
export type TInstanceType<T extends TConstructor<TSchema[], TSchema>> = T['returns']
// --------------------------------------------------------------------------
// TComposite
// --------------------------------------------------------------------------
export type TCompositeUnion<Left extends TSchema, Right extends TSchema> = Ensure<TUnion<[Left, Right]>>
// note: we need to take the left and right as the accumulator is assigned for multiple composite property sets with missing properties.
export type TCompositeUnionLeft<T extends TObject, Acc extends TProperties> = {
  [K in keyof T['properties']]: K extends keyof Acc ? TCompositeUnion<T['properties'][K], Acc[K]> : T['properties'][K]
}
export type TCompositeUnionRight<T extends TObject, Acc extends TProperties> = {
  [K in keyof Acc]: K extends keyof T['properties'] ? TCompositeUnion<T['properties'][K], Acc[K]> : Acc[K]
}
export type TCompositeUnionObject<T extends TObject, Acc extends TProperties> = Evaluate<TCompositeUnionLeft<T, Acc> & TCompositeUnionRight<T, Acc>>
// prettier-ignore
export type TCompositeProperties<T extends TObject[], Acc extends TProperties> = 
  T extends [...infer L, infer R] ? TCompositeProperties<Assert<L, TObject[]>, TCompositeUnionObject<Assert<R, TObject>, Acc>> :
  T extends [] ? Acc :
  never
export type TComposite<T extends TObject[] = TObject[]> = Ensure<TObject<TCompositeProperties<T, {}>>>
// --------------------------------------------------------------------------
// TConstructor
// --------------------------------------------------------------------------
export type TConstructorParameterArray<T extends readonly TSchema[], P extends unknown[]> = [...{ [K in keyof T]: Static<Assert<T[K], TSchema>, P> }]
export interface TConstructor<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Constructor'
  static: new (...param: TConstructorParameterArray<T, this['params']>) => Static<U, this['params']>
  type: 'object'
  instanceOf: 'Constructor'
  parameters: T
  returns: U
}
// --------------------------------------------------------------------------
// TDate
// --------------------------------------------------------------------------
export interface DateOptions extends SchemaOptions {
  exclusiveMaximumTimestamp?: number
  exclusiveMinimumTimestamp?: number
  maximumTimestamp?: number
  minimumTimestamp?: number
}
export interface TDate extends TSchema, DateOptions {
  [Kind]: 'Date'
  static: Date
  type: 'object'
  instanceOf: 'Date'
}
// --------------------------------------------------------------------------
// TEnum
// --------------------------------------------------------------------------
export interface TEnumOption<T> {
  type: 'number' | 'string'
  const: T
}
export type TEnumStatic<T extends Record<string, string | number>> = T[keyof T]
export interface TEnum<T extends Record<string, string | number> = Record<string, string | number>> extends TSchema {
  [Kind]: 'Union'
  static: TEnumStatic<T>
  anyOf: TLiteral<string | number>[]
}
// --------------------------------------------------------------------------
// TExtends
// --------------------------------------------------------------------------
// prettier-ignore
export type TExtends<L extends TSchema, R extends TSchema, T extends TSchema, U extends TSchema> = 
  (Static<L> extends Static<R> ? T : U) extends infer O ? 
    UnionToTuple<O> extends [infer X, infer Y] ? TUnion<[Assert<X, TSchema>, Assert<Y, TSchema>]> : Assert<O, TSchema>
  : never
// --------------------------------------------------------------------------
// TExclude
// --------------------------------------------------------------------------
// prettier-ignore
export type TExcludeArray<T extends TSchema[], U extends TSchema> = Assert<UnionToTuple<{
  [K in keyof T]: Static<Assert<T[K], TSchema>> extends Static<U> ? never : T[K]
}[number]>, TSchema[]> extends infer R ? TUnionResult<Assert<R, TSchema[]>> : never
export type TExclude<T extends TSchema, U extends TSchema> = T extends TUnion<infer S> ? TExcludeArray<S, U> : T extends U ? TNever : T
// --------------------------------------------------------------------------
// TExtract
// --------------------------------------------------------------------------
// prettier-ignore
export type TExtractArray<T extends TSchema[], U extends TSchema> = Assert<UnionToTuple<
  {[K in keyof T]: Static<Assert<T[K], TSchema>> extends Static<U> ? T[K] : never
}[number]>, TSchema[]> extends infer R ? TUnionResult<Assert<R, TSchema[]>> : never
export type TExtract<T extends TSchema, U extends TSchema> = T extends TUnion<infer S> ? TExtractArray<S, U> : T extends U ? T : TNever
// --------------------------------------------------------------------------
// TFunction
// --------------------------------------------------------------------------
export type TFunctionParameters<T extends readonly TSchema[], P extends unknown[]> = [...{ [K in keyof T]: Static<Assert<T[K], TSchema>, P> }]
export interface TFunction<T extends readonly TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Function'
  static: (...param: TFunctionParameters<T, this['params']>) => Static<U, this['params']>
  type: 'object'
  instanceOf: 'Function'
  parameters: T
  returns: U
}
// --------------------------------------------------------------------------
// TInteger
// --------------------------------------------------------------------------
export interface TInteger extends TSchema, NumericOptions<number> {
  [Kind]: 'Integer'
  static: number
  type: 'integer'
}
// --------------------------------------------------------------------------
// TIntersect
// --------------------------------------------------------------------------
export type TUnevaluatedProperties = undefined | TSchema | boolean
export interface IntersectOptions extends SchemaOptions {
  unevaluatedProperties?: TUnevaluatedProperties
}
export type TIntersectStatic<T extends TSchema[], P extends unknown[]> = TupleToIntersect<{ [K in keyof T]: Static<Assert<T[K], TSchema>, P> }>
export interface TIntersect<T extends TSchema[] = TSchema[]> extends TSchema, IntersectOptions {
  [Kind]: 'Intersect'
  type?: 'object'
  static: TIntersectStatic<T, this['params']>
  allOf: [...T]
}
// --------------------------------------------------------------------------
// TKeyOf
// --------------------------------------------------------------------------
// prettier-ignore
export type TKeyOfTuple<T extends TSchema> = {
  [K in keyof Static<T>]: TLiteral<Assert<K, TLiteralValue>>
} extends infer U 
  ? UnionToTuple<Exclude<{ [K in keyof U]: U[K] }[keyof U], undefined>> // optional yields undefined keys
  : never
// prettier-ignore
export type TKeyOf<T extends TSchema = TSchema> = (
  T extends TIntersect ? TKeyOfTuple<T> :
  T extends TUnion     ? TKeyOfTuple<T> :
  T extends TObject    ? TKeyOfTuple<T> :
  []
) extends infer R ? TUnionResult<Assert<R, TSchema[]>> : never
// --------------------------------------------------------------------------
// TLiteral
// --------------------------------------------------------------------------
export type TLiteralValue = string | number | boolean // | bigint - supported but variant disable due to potential numeric type conflicts
export interface TLiteral<T extends TLiteralValue = TLiteralValue> extends TSchema {
  [Kind]: 'Literal'
  static: T
  const: T
}
// --------------------------------------------------------------------------
// TNever
// --------------------------------------------------------------------------
export interface TNever extends TSchema {
  [Kind]: 'Never'
  static: never
  allOf: [{ type: 'boolean'; const: false }, { type: 'boolean'; const: true }]
}
// --------------------------------------------------------------------------
// TNot
// --------------------------------------------------------------------------
export type TNotStatic<_ extends TSchema = TSchema, T extends TSchema = TSchema> = Static<T>
export interface TNot<Not extends TSchema = TSchema, T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Not'
  static: TNotStatic<Not, T>
  allOf: [{ not: Not }, T]
}
// --------------------------------------------------------------------------
// TNull
// --------------------------------------------------------------------------
export interface TNull extends TSchema {
  [Kind]: 'Null'
  static: null
  type: 'null'
}
// --------------------------------------------------------------------------
// TNumber
// --------------------------------------------------------------------------
export interface TNumber extends TSchema, NumericOptions<number> {
  [Kind]: 'Number'
  static: number
  type: 'number'
}
// --------------------------------------------------------------------------
// TObject
// --------------------------------------------------------------------------
export type ReadonlyOptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonlyOptional<TSchema> ? K : never }[keyof T]
export type ReadonlyPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonly<TSchema> ? K : never }[keyof T]
export type OptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TOptional<TSchema> ? K : never }[keyof T]
export type RequiredPropertyKeys<T extends TProperties> = keyof Omit<T, ReadonlyOptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | OptionalPropertyKeys<T>>
// prettier-ignore
export type PropertiesReducer<T extends TProperties, R extends Record<keyof any, unknown>> = Evaluate<(
  Readonly<Partial<Pick<R, ReadonlyOptionalPropertyKeys<T>>>> &
  Readonly<Pick<R, ReadonlyPropertyKeys<T>>> &
  Partial<Pick<R, OptionalPropertyKeys<T>>> &
  Required<Pick<R, RequiredPropertyKeys<T>>>
)>
// prettier-ignore
export type PropertiesReduce<T extends TProperties, P extends unknown[]> = PropertiesReducer<T, {
  [K in keyof T]: Static<T[K], P>
}>
export type TProperties = Record<keyof any, TSchema>
export type ObjectProperties<T> = T extends TObject<infer U> ? U : never
export type ObjectPropertyKeys<T> = T extends TObject<infer U> ? keyof U : never
export type TAdditionalProperties = undefined | TSchema | boolean
export interface ObjectOptions extends SchemaOptions {
  additionalProperties?: TAdditionalProperties
  minProperties?: number
  maxProperties?: number
}
export interface TObject<T extends TProperties = TProperties> extends TSchema, ObjectOptions {
  [Kind]: 'Object'
  static: PropertiesReduce<T, this['params']>
  additionalProperties?: TAdditionalProperties
  type: 'object'
  properties: T
  required?: string[]
}
// --------------------------------------------------------------------------
// TOmit
// --------------------------------------------------------------------------
export type TOmitArray<T extends TSchema[], K extends keyof any> = Assert<{ [K2 in keyof T]: TOmit<Assert<T[K2], TSchema>, K> }, TSchema[]>
export type TOmitProperties<T extends TProperties, K extends keyof any> = Evaluate<Assert<Omit<T, K>, TProperties>>
// prettier-ignore
export type TOmit<T extends TSchema, K extends keyof any> = 
  T extends TIntersect<infer S> ? TIntersect<TOmitArray<S, K>> : 
  T extends TUnion<infer S> ? TUnion<TOmitArray<S, K>> : 
  T extends TObject<infer S> ? TObject<TOmitProperties<S, K>> : 
  T
// --------------------------------------------------------------------------
// TParameters
// --------------------------------------------------------------------------
export type TParameters<T extends TFunction> = TTuple<T['parameters']>
// --------------------------------------------------------------------------
// TPartial
// --------------------------------------------------------------------------
export type TPartialArray<T extends TSchema[]> = Assert<{ [K in keyof T]: TPartial<Assert<T[K], TSchema>> }, TSchema[]>
// prettier-ignore
export type TPartialProperties<T extends TProperties> = Evaluate<Assert<{
  [K in keyof T]: 
    T[K] extends TReadonlyOptional<infer U> ? TReadonlyOptional<U> : 
    T[K] extends TReadonly<infer U>         ? TReadonlyOptional<U> : 
    T[K] extends TOptional<infer U>         ? TOptional<U>         : 
    TOptional<T[K]>
}, TProperties>>
// prettier-ignore
export type TPartial<T extends TSchema> = 
  T extends TIntersect<infer S> ? TIntersect<TPartialArray<S>> : 
  T extends TUnion<infer S>     ? TUnion<TPartialArray<S>> : 
  T extends TObject<infer S>    ? TObject<TPartialProperties<S>> : 
  T
// --------------------------------------------------------------------------
// TPick
// --------------------------------------------------------------------------
export type TPickArray<T extends TSchema[], K extends keyof any> = { [K2 in keyof T]: TPick<Assert<T[K2], TSchema>, K> }
// Note the key K will overlap for varying TProperties gathered via recursive union and intersect traversal. Because of this,
// we need to extract only keys assignable to T on K2. This behavior is only required for Pick only.
// prettier-ignore
export type TPickProperties<T extends TProperties, K extends keyof any> = 
  Pick<T, Assert<Extract<K, keyof T>, keyof T>> extends infer R ? ({
    [K in keyof R]: Assert<R[K], TSchema> extends TSchema ? R[K] : never
  }): never
// prettier-ignore
export type TPick<T extends TSchema, K extends keyof any> = 
  T extends TIntersect<infer S> ? TIntersect<TPickArray<S, K>> : 
  T extends TUnion<infer S> ? TUnion<TPickArray<S, K>> : 
  T extends TObject<infer S> ? TObject<TPickProperties<S, K>> :
  T

// --------------------------------------------------------------------------
// TPromise
// --------------------------------------------------------------------------
export type TPromiseStatic<T extends TSchema, P extends unknown[]> = Promise<Static<T, P>>
export interface TPromise<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Promise'
  static: TPromiseStatic<T, this['params']>
  type: 'object'
  instanceOf: 'Promise'
  item: TSchema
}
// --------------------------------------------------------------------------
// TRecord
// --------------------------------------------------------------------------
export type TRecordKey = TString | TNumeric | TUnion<TLiteral<any>[]>
export type TRecordPropertiesFromUnionLiteral<K extends TUnion<TLiteral<string | number>[]>, T extends TSchema> = Static<K> extends string ? { [X in Static<K>]: T } : never
export type TRecordPropertiesFromLiteral<K extends TLiteral<string | number>, T extends TSchema> = Evaluate<{ [K2 in K['const']]: T }>
export type TRecordStatic<K extends TRecordKey, T extends TSchema, P extends unknown[]> = Record<Static<K>, Static<T, P>>
export interface TRecord<K extends TRecordKey = TRecordKey, T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Record'
  static: TRecordStatic<K, T, this['params']>
  type: 'object'
  patternProperties: { [pattern: string]: T }
  additionalProperties: false
}
// --------------------------------------------------------------------------
// TRecursive
// --------------------------------------------------------------------------
export interface TSelf extends TSchema {
  [Kind]: 'Self'
  static: this['params'][0]
  $ref: string
}
export type TRecursiveReduce<T extends TSchema> = Static<T, [TRecursiveReduce<T>]>
export interface TRecursive<T extends TSchema> extends TSchema {
  static: TRecursiveReduce<T>
}
// --------------------------------------------------------------------------
// TRef
// --------------------------------------------------------------------------
export type TRefStatic<T extends TSchema, P extends unknown[]> = Static<T, P>
export interface TRef<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Ref'
  static: TRefStatic<T, this['params']>
  $ref: string
}
// --------------------------------------------------------------------------
// TReturnType
// --------------------------------------------------------------------------
export type TReturnType<T extends TFunction> = T['returns']
// --------------------------------------------------------------------------
// TRequired
// --------------------------------------------------------------------------
export type TRequiredArray<T extends TSchema[]> = Assert<{ [K in keyof T]: TRequired<Assert<T[K], TSchema>> }, TSchema[]>
// prettier-ignore
export type TRequiredProperties<T extends TProperties> = Evaluate<Assert<{
  [K in keyof T]: 
    T[K] extends TReadonlyOptional<infer U> ? TReadonly<U> : 
    T[K] extends TReadonly<infer U>         ? TReadonly<U> :  
    T[K] extends TOptional<infer U>         ? U : 
    T[K]
}, TProperties>>
// prettier-ignore
export type TRequired<T extends TSchema> = 
  T extends TIntersect<infer S> ? TIntersect<TRequiredArray<S>> : 
  T extends TUnion<infer S>     ? TUnion<TRequiredArray<S>> : 
  T extends TObject<infer S>    ? TObject<TRequiredProperties<S>> : 
  T
// --------------------------------------------------------------------------
// TString
// --------------------------------------------------------------------------
export type StringFormatOption =
  | 'date-time'
  | 'time'
  | 'date'
  | 'email'
  | 'idn-email'
  | 'hostname'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'uri'
  | 'uri-reference'
  | 'iri'
  | 'uuid'
  | 'iri-reference'
  | 'uri-template'
  | 'json-pointer'
  | 'relative-json-pointer'
  | 'regex'
export interface StringOptions<Format extends string> extends SchemaOptions {
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: Format
  contentEncoding?: '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64'
  contentMediaType?: string
}
export interface TString<Format extends string = string> extends TSchema, StringOptions<Format> {
  [Kind]: 'String'
  static: string
  type: 'string'
}
// --------------------------------------------------------------------------
// TSymbol
// --------------------------------------------------------------------------
export type SymbolValue = string | number | undefined
export interface TSymbol extends TSchema, SchemaOptions {
  [Kind]: 'Symbol'
  static: symbol
  type: 'null'
  typeOf: 'Symbol'
}
// --------------------------------------------------------------------------
// TTuple
// --------------------------------------------------------------------------
export type TTupleIntoArray<T extends TTuple<TSchema[]>> = T extends TTuple<infer R> ? Assert<R, TSchema[]> : never
export type TTupleStatic<T extends TSchema[], P extends unknown[]> = {
  [K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : T[K]
}
export interface TTuple<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Tuple'
  static: TTupleStatic<T, this['params']>
  type: 'array'
  items?: T
  additionalItems?: false
  minItems: number
  maxItems: number
}
// --------------------------------------------------------------------------
// TUndefined
// --------------------------------------------------------------------------
export interface TUndefined extends TSchema {
  [Kind]: 'Undefined'
  static: undefined
  type: 'null'
  typeOf: 'Undefined'
}
// --------------------------------------------------------------------------
// TUnionOfLiteral
// --------------------------------------------------------------------------
export type TUnionOfLiteralArray<T extends TLiteral<string>[]> = { [K in keyof T]: Assert<T[K], TLiteral>['const'] }[number]
export type TUnionOfLiteral<T extends TUnion<TLiteral<string>[]>> = TUnionOfLiteralArray<T['anyOf']>
// --------------------------------------------------------------------------
// TUnionResult - Used by Extract, Exclude and KeyOf for normalized union unwrap
// --------------------------------------------------------------------------
export type TUnionResult<T extends TSchema[]> = T extends [] ? TNever : T extends [infer S] ? S : TUnion<T>
// --------------------------------------------------------------------------
// TUnion
// --------------------------------------------------------------------------
export interface TUnion<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Union'
  static: { [K in keyof T]: T[K] extends TSchema ? Static<T[K], this['params']> : never }[number]
  anyOf: T
}
// --------------------------------------------------------------------------
// TUint8Array
// --------------------------------------------------------------------------
export interface Uint8ArrayOptions extends SchemaOptions {
  maxByteLength?: number
  minByteLength?: number
}
export interface TUint8Array extends TSchema, Uint8ArrayOptions {
  [Kind]: 'Uint8Array'
  static: Uint8Array
  instanceOf: 'Uint8Array'
  type: 'object'
}
// --------------------------------------------------------------------------
// TUnknown
// --------------------------------------------------------------------------
export interface TUnknown extends TSchema {
  [Kind]: 'Unknown'
  static: unknown
}
// --------------------------------------------------------------------------
// TUnsafe
// --------------------------------------------------------------------------
export interface UnsafeOptions extends SchemaOptions {
  [Kind]?: string
}
export interface TUnsafe<T> extends TSchema {
  [Kind]: string
  static: T
}
// --------------------------------------------------------------------------
// TVoid
// --------------------------------------------------------------------------
export interface TVoid extends TSchema {
  [Kind]: 'Void'
  static: void
  type: 'null'
  typeOf: 'Void'
}
// --------------------------------------------------------------------------
// Static<T>
// --------------------------------------------------------------------------
/** Creates a TypeScript static type from a TypeBox type */
export type Static<T extends TSchema, P extends unknown[] = []> = (T & { params: P })['static']

// --------------------------------------------------------------------------
// TypeRegistry
// --------------------------------------------------------------------------
export type TypeRegistryValidationFunction<TSchema> = (schema: TSchema, value: unknown) => boolean
/** A registry for user defined types */
export namespace TypeRegistry {
  const map = new Map<string, TypeRegistryValidationFunction<any>>()
  /** Returns the entries in this registry */
  export function Entries() {
    return new Map(map)
  }
  /** Clears all user defined types */
  export function Clear() {
    return map.clear()
  }
  /** Returns true if this registry contains this kind */
  export function Has(kind: string) {
    return map.has(kind)
  }
  /** Sets a validation function for a user defined type */
  export function Set<TSchema = unknown>(kind: string, func: TypeRegistryValidationFunction<TSchema>) {
    map.set(kind, func)
  }
  /** Gets a custom validation function for a user defined type */
  export function Get(kind: string) {
    return map.get(kind)
  }
}
// --------------------------------------------------------------------------
// TypeRegistry
// --------------------------------------------------------------------------
export type FormatRegistryValidationFunction = (value: string) => boolean
/** A registry for user defined string formats */
export namespace FormatRegistry {
  const map = new Map<string, FormatRegistryValidationFunction>()
  /** Returns the entries in this registry */
  export function Entries() {
    return new Map(map)
  }
  /** Clears all user defined string formats */
  export function Clear() {
    return map.clear()
  }
  /** Returns true if the user defined string format exists */
  export function Has(format: string) {
    return map.has(format)
  }
  /** Sets a validation function for a user defined string format */
  export function Set(format: string, func: FormatRegistryValidationFunction) {
    map.set(format, func)
  }
  /** Gets a validation function for a user defined string format */
  export function Get(format: string) {
    return map.get(format)
  }
}
// --------------------------------------------------------------------------
// TypeGuard
// --------------------------------------------------------------------------
export class TypeGuardUnknownTypeError extends Error {
  constructor(public readonly schema: unknown) {
    super('TypeGuard: Unknown type')
  }
}
/** Provides functions to test if JavaScript values are TypeBox types */
export namespace TypeGuard {
  function IsObject(value: unknown): value is Record<string | symbol, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }
  function IsArray(value: unknown): value is any[] {
    return typeof value === 'object' && value !== null && Array.isArray(value)
  }
  function IsPattern(value: unknown): value is string {
    try {
      new RegExp(value as string)
      return true
    } catch {
      return false
    }
  }
  function IsControlCharacterFree(value: unknown): value is string {
    if (typeof value !== 'string') return false
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i)
      if ((code >= 7 && code <= 13) || code === 27 || code === 127) {
        return false
      }
    }
    return true
  }
  function IsBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  }
  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }
  function IsNumber(value: unknown): value is number {
    return typeof value === 'number' && globalThis.Number.isFinite(value)
  }
  function IsBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }
  function IsOptionalBigInt(value: unknown): value is bigint | undefined {
    return value === undefined || (value !== undefined && IsBigInt(value))
  }
  function IsOptionalNumber(value: unknown): value is number | undefined {
    return value === undefined || (value !== undefined && IsNumber(value))
  }
  function IsOptionalBoolean(value: unknown): value is boolean | undefined {
    return value === undefined || (value !== undefined && IsBoolean(value))
  }
  function IsOptionalString(value: unknown): value is string | undefined {
    return value === undefined || (value !== undefined && IsString(value))
  }
  function IsOptionalPattern(value: unknown): value is string | undefined {
    return value === undefined || (value !== undefined && IsString(value) && IsControlCharacterFree(value) && IsPattern(value))
  }
  function IsOptionalFormat(value: unknown): value is string | undefined {
    return value === undefined || (value !== undefined && IsString(value) && IsControlCharacterFree(value))
  }
  function IsOptionalSchema(value: unknown): value is boolean | undefined {
    return value === undefined || TSchema(value)
  }
  /** Returns true if the given schema is TAny */
  export function TAny(schema: unknown): schema is TAny {
    return TKind(schema) && schema[Kind] === 'Any' && IsOptionalString(schema.$id)
  }
  /** Returns true if the given schema is TArray */
  export function TArray(schema: unknown): schema is TArray {
    return (
      TKind(schema) &&
      schema[Kind] === 'Array' &&
      schema.type === 'array' &&
      IsOptionalString(schema.$id) &&
      TSchema(schema.items) &&
      IsOptionalNumber(schema.minItems) &&
      IsOptionalNumber(schema.maxItems) &&
      IsOptionalBoolean(schema.uniqueItems)
    )
  }
  /** Returns true if the given schema is TSymbol */
  export function TBigInt(schema: unknown): schema is TBigInt {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'BigInt' && 
      schema.type === 'null' &&
      schema.typeOf === 'BigInt' &&
      IsOptionalString(schema.$id) &&
      IsOptionalBigInt(schema.multipleOf) &&
      IsOptionalBigInt(schema.minimum) &&
      IsOptionalBigInt(schema.maximum) &&
      IsOptionalBigInt(schema.exclusiveMinimum) &&
      IsOptionalBigInt(schema.exclusiveMaximum)
    )
  }
  /** Returns true if the given schema is TBoolean */
  export function TBoolean(schema: unknown): schema is TBoolean {
    // prettier-ignore
    return (
      TKind(schema) &&
      schema[Kind] === 'Boolean' && 
      schema.type === 'boolean' && 
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is TConstructor */
  export function TConstructor(schema: unknown): schema is TConstructor {
    // prettier-ignore
    if (!(
      TKind(schema) &&
      schema[Kind] === 'Constructor' && 
      schema.type === 'object' && 
      schema.instanceOf === 'Constructor' && 
      IsOptionalString(schema.$id) && 
      IsArray(schema.parameters) && 
      TSchema(schema.returns))
    ) {
      return false
    }
    for (const parameter of schema.parameters) {
      if (!TSchema(parameter)) return false
    }
    return true
  }
  /** Returns true if the given schema is TDate */
  export function TDate(schema: unknown): schema is TDate {
    return (
      TKind(schema) &&
      schema[Kind] === 'Date' &&
      schema.type === 'object' &&
      schema.instanceOf === 'Date' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.minimumTimestamp) &&
      IsOptionalNumber(schema.maximumTimestamp) &&
      IsOptionalNumber(schema.exclusiveMinimumTimestamp) &&
      IsOptionalNumber(schema.exclusiveMaximumTimestamp)
    )
  }
  /** Returns true if the given schema is TFunction */
  export function TFunction(schema: unknown): schema is TFunction {
    // prettier-ignore
    if (!(
      TKind(schema) &&
      schema[Kind] === 'Function' && 
      schema.type === 'object' &&
      schema.instanceOf === 'Function' &&
      IsOptionalString(schema.$id) && 
      IsArray(schema.parameters) && 
      TSchema(schema.returns))
    ) {
      return false
    }
    for (const parameter of schema.parameters) {
      if (!TSchema(parameter)) return false
    }
    return true
  }
  /** Returns true if the given schema is TInteger */
  export function TInteger(schema: unknown): schema is TInteger {
    return (
      TKind(schema) &&
      schema[Kind] === 'Integer' &&
      schema.type === 'integer' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.multipleOf) &&
      IsOptionalNumber(schema.minimum) &&
      IsOptionalNumber(schema.maximum) &&
      IsOptionalNumber(schema.exclusiveMinimum) &&
      IsOptionalNumber(schema.exclusiveMaximum)
    )
  }
  /** Returns true if the given schema is TIntersect */
  export function TIntersect(schema: unknown): schema is TIntersect {
    // prettier-ignore
    if (!(
      TKind(schema) &&
      schema[Kind] === 'Intersect' && 
      IsArray(schema.allOf) && 
      IsOptionalString(schema.type) &&
      (IsOptionalBoolean(schema.unevaluatedProperties) || IsOptionalSchema(schema.unevaluatedProperties)) &&
      IsOptionalString(schema.$id))
    ) {
      return false
    }
    if ('type' in schema && schema.type !== 'object') {
      return false
    }
    for (const inner of schema.allOf) {
      if (!TSchema(inner)) return false
    }
    return true
  }
  /** Returns true if the given schema is TKind */
  export function TKind(schema: unknown): schema is Record<typeof Kind | string, unknown> {
    return IsObject(schema) && Kind in schema && typeof (schema as any)[Kind] === 'string' // TS 4.1.5: any required for symbol indexer
  }
  /** Returns true if the given schema is TLiteral */
  export function TLiteral(schema: unknown): schema is TLiteral {
    // prettier-ignore
    return (
      TKind(schema) &&
      schema[Kind] === 'Literal' && 
      IsOptionalString(schema.$id) && 
      (
        IsString(schema.const) || 
        IsNumber(schema.const) || 
        IsBoolean(schema.const) ||
        IsBigInt(schema.const)
      )
    )
  }
  /** Returns true if the given schema is TNever */
  export function TNever(schema: unknown): schema is TNever {
    return TKind(schema) && schema[Kind] === 'Never' && IsObject(schema.not) && globalThis.Object.getOwnPropertyNames(schema.not).length === 0
  }
  /** Returns true if the given schema is TNot */
  export function TNot(schema: unknown): schema is TNot {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'Not' && 
      IsArray(schema.allOf) && 
      schema.allOf.length === 2 && 
      IsObject(schema.allOf[0]) && 
      TSchema(schema.allOf[0].not) && 
      TSchema(schema.allOf[1]) 
    )
  }
  /** Returns true if the given schema is TNull */
  export function TNull(schema: unknown): schema is TNull {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'Null' && 
      schema.type === 'null' && 
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is TNumber */
  export function TNumber(schema: unknown): schema is TNumber {
    return (
      TKind(schema) &&
      schema[Kind] === 'Number' &&
      schema.type === 'number' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.multipleOf) &&
      IsOptionalNumber(schema.minimum) &&
      IsOptionalNumber(schema.maximum) &&
      IsOptionalNumber(schema.exclusiveMinimum) &&
      IsOptionalNumber(schema.exclusiveMaximum)
    )
  }
  /** Returns true if the given schema is TObject */
  export function TObject(schema: unknown): schema is TObject {
    if (
      !(
        TKind(schema) &&
        schema[Kind] === 'Object' &&
        schema.type === 'object' &&
        IsOptionalString(schema.$id) &&
        IsObject(schema.properties) &&
        (IsOptionalBoolean(schema.additionalProperties) || IsOptionalSchema(schema.additionalProperties)) &&
        IsOptionalNumber(schema.minProperties) &&
        IsOptionalNumber(schema.maxProperties)
      )
    ) {
      return false
    }
    for (const [key, value] of Object.entries(schema.properties)) {
      if (!IsControlCharacterFree(key)) return false
      if (!TSchema(value)) return false
    }
    return true
  }
  /** Returns true if the given schema is TPromise */
  export function TPromise(schema: unknown): schema is TPromise {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'Promise' && 
      schema.type === 'object' && 
      schema.instanceOf === 'Promise' &&
      IsOptionalString(schema.$id) && 
      TSchema(schema.item)
    )
  }
  /** Returns true if the given schema is TRecord */
  export function TRecord(schema: unknown): schema is TRecord {
    // prettier-ignore
    if (!(
      TKind(schema) && 
      schema[Kind] === 'Record' && 
      schema.type === 'object' && 
      IsOptionalString(schema.$id) && 
      schema.additionalProperties === false && 
      IsObject(schema.patternProperties))
    ) {
      return false
    }
    const keys = Object.keys(schema.patternProperties)
    if (keys.length !== 1) {
      return false
    }
    if (!IsPattern(keys[0])) {
      return false
    }
    if (!TSchema(schema.patternProperties[keys[0]])) {
      return false
    }
    return true
  }
  /** Returns true if the given schema is TSelf */
  export function TSelf(schema: unknown): schema is TSelf {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'Self' && 
      IsOptionalString(schema.$id) && 
      IsString(schema.$ref)
    )
  }
  /** Returns true if the given schema is TRef */
  export function TRef(schema: unknown): schema is TRef {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'Ref' && 
      IsOptionalString(schema.$id) && 
      IsString(schema.$ref)
    )
  }
  /** Returns true if the given schema is TString */
  export function TString(schema: unknown): schema is TString {
    return (
      TKind(schema) &&
      schema[Kind] === 'String' &&
      schema.type === 'string' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.minLength) &&
      IsOptionalNumber(schema.maxLength) &&
      IsOptionalPattern(schema.pattern) &&
      IsOptionalFormat(schema.format)
    )
  }

  /** Returns true if the given schema is TSymbol */
  export function TSymbol(schema: unknown): schema is TSymbol {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'Symbol' && 
      schema.type === 'null' &&
      schema.typeOf === 'Symbol' &&
      IsOptionalString(schema.$id)
    )
  }

  /** Returns true if the given schema is TTuple */
  export function TTuple(schema: unknown): schema is TTuple {
    // prettier-ignore
    if (!(
      TKind(schema) && 
      schema[Kind] === 'Tuple' && 
      schema.type === 'array' && 
      IsOptionalString(schema.$id) && 
      IsNumber(schema.minItems) && 
      IsNumber(schema.maxItems) && 
      schema.minItems === schema.maxItems)
    ) {
      return false
    }
    if (schema.items === undefined && schema.additionalItems === undefined && schema.minItems === 0) {
      return true
    }
    if (!IsArray(schema.items)) {
      return false
    }
    for (const inner of schema.items) {
      if (!TSchema(inner)) return false
    }
    return true
  }
  /** Returns true if the given schema is TUndefined */
  export function TUndefined(schema: unknown): schema is TUndefined {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'Undefined' && 
      schema.type === 'null' && 
      schema.typeOf === 'Undefined' && 
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is TUnion */
  export function TUnion(schema: unknown): schema is TUnion {
    // prettier-ignore
    if (!(
      TKind(schema) && 
      schema[Kind] === 'Union' && 
      IsArray(schema.anyOf) && 
      IsOptionalString(schema.$id))
    ) {
      return false
    }
    for (const inner of schema.anyOf) {
      if (!TSchema(inner)) return false
    }
    return true
  }
  /** Returns true if the given schema is TUnion<Literal<string>[]> */
  export function TUnionLiteral(schema: unknown): schema is TUnion<TLiteral<string>[]> {
    return TUnion(schema) && schema.anyOf.every((schema) => TLiteral(schema) && typeof schema.const === 'string')
  }

  /** Returns true if the given schema is TUint8Array */
  export function TUint8Array(schema: unknown): schema is TUint8Array {
    return TKind(schema) && schema[Kind] === 'Uint8Array' && schema.type === 'object' && IsOptionalString(schema.$id) && schema.instanceOf === 'Uint8Array' && IsOptionalNumber(schema.minByteLength) && IsOptionalNumber(schema.maxByteLength)
  }
  /** Returns true if the given schema is TUnknown */
  export function TUnknown(schema: unknown): schema is TUnknown {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'Unknown' && 
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is TVoid */
  export function TVoid(schema: unknown): schema is TVoid {
    // prettier-ignore
    return (
      TKind(schema) && 
      schema[Kind] === 'Void' && 
      schema.type === 'null' && 
      schema.typeOf === 'Void' && 
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if this schema has the ReadonlyOptional modifier */
  export function TReadonlyOptional<T extends TSchema>(schema: T): schema is TReadonlyOptional<T> {
    return IsObject(schema) && schema[Modifier] === 'ReadonlyOptional'
  }
  /** Returns true if this schema has the Readonly modifier */
  export function TReadonly<T extends TSchema>(schema: T): schema is TReadonly<T> {
    return IsObject(schema) && schema[Modifier] === 'Readonly'
  }
  /** Returns true if this schema has the Optional modifier */
  export function TOptional<T extends TSchema>(schema: T): schema is TOptional<T> {
    return IsObject(schema) && schema[Modifier] === 'Optional'
  }
  /** Returns true if the given schema is TSchema */
  export function TSchema(schema: unknown): schema is TSchema {
    return (
      typeof schema === 'object' &&
      (TAny(schema) ||
        TArray(schema) ||
        TBoolean(schema) ||
        TBigInt(schema) ||
        TConstructor(schema) ||
        TDate(schema) ||
        TFunction(schema) ||
        TInteger(schema) ||
        TIntersect(schema) ||
        TLiteral(schema) ||
        TNever(schema) ||
        TNot(schema) ||
        TNull(schema) ||
        TNumber(schema) ||
        TObject(schema) ||
        TPromise(schema) ||
        TRecord(schema) ||
        TSelf(schema) ||
        TRef(schema) ||
        TString(schema) ||
        TSymbol(schema) ||
        TTuple(schema) ||
        TUndefined(schema) ||
        TUnion(schema) ||
        TUint8Array(schema) ||
        TUnknown(schema) ||
        TVoid(schema) ||
        (TKind(schema) && TypeRegistry.Has(schema[Kind] as any)))
    )
  }
}
// --------------------------------------------------------------------------
// ExtendsUndefined
// --------------------------------------------------------------------------
/** Fast undefined check used for properties of type undefined */
export namespace ExtendsUndefined {
  export function Check(schema: TSchema): boolean {
    if (schema[Kind] === 'Undefined') return true
    if (schema[Kind] === 'Union') {
      const union = schema as TUnion
      return union.anyOf.some((schema) => Check(schema))
    }
    return false
  }
}
// --------------------------------------------------------------------------
// TypeExtends
// --------------------------------------------------------------------------
export enum TypeExtendsResult {
  Union,
  True,
  False,
}
export namespace TypeExtends {
  // --------------------------------------------------------------------------
  // IntoBooleanResult
  // --------------------------------------------------------------------------
  function IntoBooleanResult(result: TypeExtendsResult) {
    return result === TypeExtendsResult.False ? TypeExtendsResult.False : TypeExtendsResult.True
  }
  // --------------------------------------------------------------------------
  // Any
  // --------------------------------------------------------------------------
  function AnyRight(left: TSchema, right: TAny) {
    return TypeExtendsResult.True
  }
  function Any(left: TAny, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right) && right.anyOf.some((schema) => TypeGuard.TAny(schema) || TypeGuard.TUnknown(schema))) return TypeExtendsResult.True
    if (TypeGuard.TUnion(right)) return TypeExtendsResult.Union
    if (TypeGuard.TUnknown(right)) return TypeExtendsResult.True
    if (TypeGuard.TAny(right)) return TypeExtendsResult.True
    return TypeExtendsResult.Union
  }
  // --------------------------------------------------------------------------
  // Array
  // --------------------------------------------------------------------------
  function ArrayRight(left: TSchema, right: TArray) {
    if (TypeGuard.TUnknown(left)) return TypeExtendsResult.False
    if (TypeGuard.TAny(left)) return TypeExtendsResult.Union
    if (TypeGuard.TNever(left)) return TypeExtendsResult.True
    return TypeExtendsResult.False
  }
  function Array(left: TArray, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right) && IsObjectArrayLike(right)) return TypeExtendsResult.True
    if (!TypeGuard.TArray(right)) return TypeExtendsResult.False
    return IntoBooleanResult(Visit(left.items, right.items))
  }
  // --------------------------------------------------------------------------
  // BigInt
  // --------------------------------------------------------------------------
  function BigInt(left: TBigInt, right: TSchema): TypeExtendsResult {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TNever(right)) return NeverRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    return TypeGuard.TBigInt(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Boolean
  // --------------------------------------------------------------------------
  function BooleanRight(left: TSchema, right: TBoolean) {
    if (TypeGuard.TLiteral(left) && typeof left.const === 'boolean') return TypeExtendsResult.True
    return TypeGuard.TBoolean(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function Boolean(left: TBoolean, right: TSchema): TypeExtendsResult {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TNever(right)) return NeverRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    return TypeGuard.TBoolean(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Constructor
  // --------------------------------------------------------------------------
  function Constructor(left: TConstructor, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (!TypeGuard.TConstructor(right)) return TypeExtendsResult.False
    if (left.parameters.length > right.parameters.length) return TypeExtendsResult.False
    if (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === TypeExtendsResult.True)) {
      return TypeExtendsResult.False
    }
    return IntoBooleanResult(Visit(left.returns, right.returns))
  }
  // --------------------------------------------------------------------------
  // Date
  // --------------------------------------------------------------------------
  function Date(left: TDate, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    return TypeGuard.TDate(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Function
  // --------------------------------------------------------------------------
  function Function(left: TFunction, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (!TypeGuard.TFunction(right)) return TypeExtendsResult.False
    if (left.parameters.length > right.parameters.length) return TypeExtendsResult.False
    if (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === TypeExtendsResult.True)) {
      return TypeExtendsResult.False
    }
    return IntoBooleanResult(Visit(left.returns, right.returns))
  }
  // --------------------------------------------------------------------------
  // Integer
  // --------------------------------------------------------------------------
  function IntegerRight(left: TSchema, right: TInteger) {
    if (TypeGuard.TLiteral(left) && typeof left.const === 'number') return TypeExtendsResult.True
    return TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function Integer(left: TInteger, right: TSchema): TypeExtendsResult {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TNever(right)) return NeverRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    return TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Intersect
  // --------------------------------------------------------------------------
  function IntersectRight(left: TSchema, right: TIntersect): TypeExtendsResult {
    return right.allOf.every((schema) => Visit(left, schema) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function Intersect(left: TIntersect, right: TSchema) {
    return left.allOf.some((schema) => Visit(schema, right) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Literal
  // --------------------------------------------------------------------------
  function IsLiteralString(schema: TLiteral) {
    return typeof schema.const === 'string'
  }
  function IsLiteralNumber(schema: TLiteral) {
    return typeof schema.const === 'number'
  }
  function IsLiteralBoolean(schema: TLiteral) {
    return typeof schema.const === 'boolean'
  }
  function Literal(left: TLiteral, right: TSchema): TypeExtendsResult {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TNever(right)) return NeverRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    if (TypeGuard.TString(right)) return StringRight(left, right)
    if (TypeGuard.TNumber(right)) return NumberRight(left, right)
    if (TypeGuard.TInteger(right)) return IntegerRight(left, right)
    if (TypeGuard.TBoolean(right)) return BooleanRight(left, right)
    return TypeGuard.TLiteral(right) && right.const === left.const ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Never
  // --------------------------------------------------------------------------
  function NeverRight(left: TSchema, right: TNever) {
    return TypeExtendsResult.False
  }
  function Never(left: TNever, right: TSchema) {
    return TypeExtendsResult.True
  }
  // --------------------------------------------------------------------------
  // Null
  // --------------------------------------------------------------------------
  function Null(left: TNull, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TNever(right)) return NeverRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    return TypeGuard.TNull(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Number
  // --------------------------------------------------------------------------
  function NumberRight(left: TSchema, right: TNumber) {
    if (TypeGuard.TLiteral(left) && IsLiteralNumber(left)) return TypeExtendsResult.True
    return TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function Number(left: TNumber, right: TSchema): TypeExtendsResult {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TNever(right)) return NeverRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    return TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Object
  // --------------------------------------------------------------------------
  function IsObjectPropertyCount(schema: TObject, count: number) {
    return globalThis.Object.keys(schema.properties).length === count
  }
  function IsObjectStringLike(schema: TObject) {
    return IsObjectArrayLike(schema)
  }
  function IsObjectSymbolLike(schema: TObject) {
    // prettier-ignore
    return IsObjectPropertyCount(schema, 0) || (
      IsObjectPropertyCount(schema, 1) && 'description' in schema.properties && TypeGuard.TUnion(schema.properties.description) && schema.properties.description.anyOf.length === 2 && ((
        TypeGuard.TString(schema.properties.description.anyOf[0]) &&
        TypeGuard.TUndefined(schema.properties.description.anyOf[1])
      ) || (
        TypeGuard.TString(schema.properties.description.anyOf[1]) &&
        TypeGuard.TUndefined(schema.properties.description.anyOf[0])
      ))
    )
  }
  function IsObjectNumberLike(schema: TObject) {
    return IsObjectPropertyCount(schema, 0)
  }
  function IsObjectBooleanLike(schema: TObject) {
    return IsObjectPropertyCount(schema, 0)
  }
  function IsObjectBigIntLike(schema: TObject) {
    return IsObjectPropertyCount(schema, 0)
  }
  function IsObjectDateLike(schema: TObject) {
    return IsObjectPropertyCount(schema, 0)
  }
  function IsObjectUint8ArrayLike(schema: TObject) {
    return IsObjectArrayLike(schema)
  }
  function IsObjectFunctionLike(schema: TObject) {
    const length = Type.Number()
    return IsObjectPropertyCount(schema, 0) || (IsObjectPropertyCount(schema, 1) && 'length' in schema.properties && IntoBooleanResult(Visit(schema.properties['length'], length)) === TypeExtendsResult.True)
  }
  function IsObjectConstructorLike(schema: TObject) {
    return IsObjectPropertyCount(schema, 0)
  }
  function IsObjectArrayLike(schema: TObject) {
    const length = Type.Number()
    return IsObjectPropertyCount(schema, 0) || (IsObjectPropertyCount(schema, 1) && 'length' in schema.properties && IntoBooleanResult(Visit(schema.properties['length'], length)) === TypeExtendsResult.True)
  }
  function IsObjectPromiseLike(schema: TObject) {
    const then = Type.Function([Type.Any()], Type.Any())
    return IsObjectPropertyCount(schema, 0) || (IsObjectPropertyCount(schema, 1) && 'then' in schema.properties && IntoBooleanResult(Visit(schema.properties['then'], then)) === TypeExtendsResult.True)
  }
  // --------------------------------------------------------------------------
  // Property
  // --------------------------------------------------------------------------
  function Property(left: TSchema, right: TSchema) {
    if (Visit(left, right) === TypeExtendsResult.False) return TypeExtendsResult.False
    if (TypeGuard.TOptional(left) && !TypeGuard.TOptional(right)) return TypeExtendsResult.False
    return TypeExtendsResult.True
  }
  function ObjectRight(left: TSchema, right: TObject) {
    if (TypeGuard.TUnknown(left)) return TypeExtendsResult.False
    if (TypeGuard.TAny(left)) return TypeExtendsResult.Union
    if (TypeGuard.TNever(left)) return TypeExtendsResult.True
    if (TypeGuard.TLiteral(left) && IsLiteralString(left) && IsObjectStringLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TLiteral(left) && IsLiteralNumber(left) && IsObjectNumberLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TLiteral(left) && IsLiteralBoolean(left) && IsObjectBooleanLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TSymbol(left) && IsObjectSymbolLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TBigInt(left) && IsObjectBigIntLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TString(left) && IsObjectStringLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TSymbol(left) && IsObjectSymbolLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TNumber(left) && IsObjectNumberLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TInteger(left) && IsObjectNumberLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TBoolean(left) && IsObjectBooleanLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TUint8Array(left) && IsObjectUint8ArrayLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TDate(left) && IsObjectDateLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TConstructor(left) && IsObjectConstructorLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TFunction(left) && IsObjectFunctionLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TRecord(left) && TypeGuard.TString(RecordKey(left))) {
      // When expressing a Record with literal key values, the Record is converted into a Object with
      // the Hint assigned as `Record`. This is used to invert the extends logic.
      return right[Hint] === 'Record' ? TypeExtendsResult.True : TypeExtendsResult.False
    }
    if (TypeGuard.TRecord(left) && TypeGuard.TNumber(RecordKey(left))) {
      return IsObjectPropertyCount(right, 0) ? TypeExtendsResult.True : TypeExtendsResult.False
    }
    return TypeExtendsResult.False
  }
  function Object(left: TObject, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    if (!TypeGuard.TObject(right)) return TypeExtendsResult.False
    for (const key of globalThis.Object.keys(right.properties)) {
      if (!(key in left.properties)) return TypeExtendsResult.False
      if (Property(left.properties[key], right.properties[key]) === TypeExtendsResult.False) {
        return TypeExtendsResult.False
      }
    }
    return TypeExtendsResult.True
  }
  // --------------------------------------------------------------------------
  // Promise
  // --------------------------------------------------------------------------
  function Promise(left: TPromise, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right) && IsObjectPromiseLike(right)) return TypeExtendsResult.True
    if (!TypeGuard.TPromise(right)) return TypeExtendsResult.False
    return IntoBooleanResult(Visit(left.item, right.item))
  }
  // --------------------------------------------------------------------------
  // Record
  // --------------------------------------------------------------------------
  function RecordKey(schema: TRecord) {
    if ('^(0|[1-9][0-9]*)$' in schema.patternProperties) return Type.Number()
    if ('^.*$' in schema.patternProperties) return Type.String()
    throw Error('TypeExtends: Cannot get record key')
  }
  function RecordValue(schema: TRecord) {
    if ('^(0|[1-9][0-9]*)$' in schema.patternProperties) return schema.patternProperties['^(0|[1-9][0-9]*)$']
    if ('^.*$' in schema.patternProperties) return schema.patternProperties['^.*$']
    throw Error('TypeExtends: Cannot get record value')
  }
  function RecordRight(left: TSchema, right: TRecord) {
    const Key = RecordKey(right)
    const Value = RecordValue(right)
    if (TypeGuard.TLiteral(left) && IsLiteralString(left) && TypeGuard.TNumber(Key) && IntoBooleanResult(Visit(left, Value)) === TypeExtendsResult.True) return TypeExtendsResult.True
    if (TypeGuard.TUint8Array(left) && TypeGuard.TNumber(Key)) return Visit(left, Value)
    if (TypeGuard.TString(left) && TypeGuard.TNumber(Key)) return Visit(left, Value)
    if (TypeGuard.TArray(left) && TypeGuard.TNumber(Key)) return Visit(left, Value)
    if (TypeGuard.TObject(left)) {
      for (const key of globalThis.Object.keys(left.properties)) {
        if (Property(Value, left.properties[key]) === TypeExtendsResult.False) {
          return TypeExtendsResult.False
        }
      }
      return TypeExtendsResult.True
    }
    return TypeExtendsResult.False
  }
  function Record(left: TRecord, right: TSchema) {
    const Value = RecordValue(left)
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (!TypeGuard.TRecord(right)) return TypeExtendsResult.False
    return Visit(Value, RecordValue(right))
  }
  // --------------------------------------------------------------------------
  // String
  // --------------------------------------------------------------------------
  function StringRight(left: TSchema, right: TString) {
    if (TypeGuard.TLiteral(left) && typeof left.const === 'string') return TypeExtendsResult.True
    return TypeGuard.TString(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function String(left: TString, right: TSchema): TypeExtendsResult {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TNever(right)) return NeverRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    return TypeGuard.TString(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Symbol
  // --------------------------------------------------------------------------
  function Symbol(left: TSymbol, right: TSchema): TypeExtendsResult {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TNever(right)) return NeverRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    return TypeGuard.TSymbol(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Tuple
  // --------------------------------------------------------------------------
  function TupleRight(left: TSchema, right: TTuple) {
    if (TypeGuard.TUnknown(left)) return TypeExtendsResult.False
    if (TypeGuard.TAny(left)) return TypeExtendsResult.Union
    if (TypeGuard.TNever(left)) return TypeExtendsResult.True
    return TypeExtendsResult.False
  }
  function IsArrayOfTuple(left: TTuple, right: TSchema) {
    return TypeGuard.TArray(right) && left.items !== undefined && left.items.every((schema) => Visit(schema, right.items) === TypeExtendsResult.True)
  }
  function Tuple(left: TTuple, right: TSchema): TypeExtendsResult {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right) && IsObjectArrayLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TArray(right) && IsArrayOfTuple(left, right)) return TypeExtendsResult.True
    if (!TypeGuard.TTuple(right)) return TypeExtendsResult.False
    if ((left.items === undefined && right.items !== undefined) || (left.items !== undefined && right.items === undefined)) return TypeExtendsResult.False
    if (left.items === undefined && right.items === undefined) return TypeExtendsResult.True
    return left.items!.every((schema, index) => Visit(schema, right.items![index]) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Uint8Array
  // --------------------------------------------------------------------------
  function Uint8Array(left: TUint8Array, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    return TypeGuard.TUint8Array(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Undefined
  // --------------------------------------------------------------------------
  function Undefined(left: TUndefined, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TNever(right)) return NeverRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return RecordRight(left, right)
    if (TypeGuard.TVoid(right)) return VoidRight(left, right)
    return TypeGuard.TUndefined(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Union
  // --------------------------------------------------------------------------
  function UnionRight(left: TSchema, right: TUnion): TypeExtendsResult {
    return right.anyOf.some((schema) => Visit(left, schema) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function Union(left: TUnion, right: TSchema) {
    return left.anyOf.every((schema) => Visit(schema, right) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Unknown
  // --------------------------------------------------------------------------
  function UnknownRight(left: TSchema, right: TUnknown) {
    return TypeExtendsResult.True
  }
  function Unknown(left: TUnknown, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TString(right)) return StringRight(left, right)
    if (TypeGuard.TNumber(right)) return NumberRight(left, right)
    if (TypeGuard.TInteger(right)) return IntegerRight(left, right)
    if (TypeGuard.TBoolean(right)) return BooleanRight(left, right)
    if (TypeGuard.TArray(right)) return ArrayRight(left, right)
    if (TypeGuard.TTuple(right)) return TupleRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    return TypeGuard.TUnknown(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Void
  // --------------------------------------------------------------------------
  function VoidRight(left: TSchema, right: TVoid) {
    if (TypeGuard.TUndefined(left)) return TypeExtendsResult.True
    return TypeGuard.TUndefined(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function Void(left: TVoid, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return IntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return UnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return UnknownRight(left, right)
    if (TypeGuard.TAny(right)) return AnyRight(left, right)
    if (TypeGuard.TObject(right)) return ObjectRight(left, right)
    return TypeGuard.TVoid(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function Visit(left: TSchema, right: TSchema): TypeExtendsResult {
    if (TypeGuard.TAny(left)) return Any(left, right)
    if (TypeGuard.TArray(left)) return Array(left, right)
    if (TypeGuard.TBigInt(left)) return BigInt(left, right)
    if (TypeGuard.TBoolean(left)) return Boolean(left, right)
    if (TypeGuard.TConstructor(left)) return Constructor(left, right)
    if (TypeGuard.TDate(left)) return Date(left, right)
    if (TypeGuard.TFunction(left)) return Function(left, right)
    if (TypeGuard.TInteger(left)) return Integer(left, right)
    if (TypeGuard.TIntersect(left)) return Intersect(left, right)
    if (TypeGuard.TLiteral(left)) return Literal(left, right)
    if (TypeGuard.TNever(left)) return Never(left, right)
    if (TypeGuard.TNull(left)) return Null(left, right)
    if (TypeGuard.TNumber(left)) return Number(left, right)
    if (TypeGuard.TRecord(left)) return Record(left, right)
    if (TypeGuard.TString(left)) return String(left, right)
    if (TypeGuard.TSymbol(left)) return Symbol(left, right)
    if (TypeGuard.TObject(left)) return Object(left, right)
    if (TypeGuard.TTuple(left)) return Tuple(left, right)
    if (TypeGuard.TPromise(left)) return Promise(left, right)
    if (TypeGuard.TUint8Array(left)) return Uint8Array(left, right)
    if (TypeGuard.TUndefined(left)) return Undefined(left, right)
    if (TypeGuard.TUnion(left)) return Union(left, right)
    if (TypeGuard.TUnknown(left)) return Unknown(left, right)
    if (TypeGuard.TVoid(left)) return Void(left, right)
    throw Error(`TypeExtends: Unknown left type operand '${left[Kind]}'`)
  }
  export function Extends(left: TSchema, right: TSchema): TypeExtendsResult {
    return Visit(left, right)
  }
}
// --------------------------------------------------------------------------
// TypeClone
// --------------------------------------------------------------------------
/** Specialized Clone for Types */
export namespace TypeClone {
  function IsObject(value: unknown): value is Record<string | symbol, any> {
    return typeof value === 'object' && value !== null
  }
  function IsArray(value: unknown): value is unknown[] {
    return globalThis.Array.isArray(value)
  }
  function Array(value: unknown[]) {
    return (value as any).map((value: unknown) => Visit(value as any))
  }
  function Object(value: Record<keyof any, unknown>) {
    const clonedProperties = globalThis.Object.getOwnPropertyNames(value).reduce((acc, key) => {
      return { ...acc, [key]: Visit(value[key]) }
    }, {})
    const clonedSymbols = globalThis.Object.getOwnPropertySymbols(value).reduce((acc, key) => {
      return { ...acc, [key]: Visit(value[key as any]) }
    }, {})
    return { ...clonedProperties, ...clonedSymbols }
  }
  function Visit(value: unknown): any {
    if (IsArray(value)) return Array(value)
    if (IsObject(value)) return Object(value)
    return value
  }
  /** Clones a type. This function will omit non-self referential identifiers on the cloned type. */
  export function Clone<T extends TSchema>(schema: T, options: SchemaOptions): T {
    return { ...Visit(schema), ...options }
  }
}
// --------------------------------------------------------------------------
// ObjectMap
// --------------------------------------------------------------------------
export namespace ObjectMap {
  function Intersect(schema: TIntersect, callback: (object: TObject) => TObject) {
    return Type.Intersect(
      schema.allOf.map((inner) => Visit(inner, callback)),
      { ...schema },
    )
  }
  function Union(schema: TUnion, callback: (object: TObject) => TObject) {
    return Type.Union(
      schema.anyOf.map((inner) => Visit(inner, callback)),
      { ...schema },
    )
  }
  function Object(schema: TObject, callback: (object: TObject) => TObject) {
    return callback(schema)
  }
  function Visit(schema: TSchema, callback: (object: TObject) => TObject): TSchema {
    if (TypeGuard.TIntersect(schema)) return Intersect(schema, callback)
    if (TypeGuard.TUnion(schema)) return Union(schema, callback)
    if (TypeGuard.TObject(schema)) return Object(schema, callback)
    return schema
  }
  export function Map<T = TSchema>(schema: TSchema, callback: (object: TObject) => TObject, options: SchemaOptions): T {
    return { ...Visit(TypeClone.Clone(schema, {}), callback), ...options } as unknown as T
  }
}
// --------------------------------------------------------------------------
// KeyResolver
// --------------------------------------------------------------------------
export namespace KeyResolver {
  function IsKeyable(schema: TSchema) {
    return TypeGuard.TIntersect(schema) || TypeGuard.TUnion(schema) || (TypeGuard.TObject(schema) && globalThis.Object.getOwnPropertyNames(schema.properties).length > 0)
  }
  function Intersect(schema: TIntersect) {
    return [...schema.allOf.filter((schema) => IsKeyable(schema)).reduce((set, schema) => Visit(schema).map((key) => set.add(key))[0], new Set<string>())]
  }
  function Union(schema: TUnion) {
    const sets = schema.anyOf.filter((schema) => IsKeyable(schema)).map((inner) => Visit(inner))
    return [...sets.reduce((set, outer) => outer.map((key) => (sets.every((inner) => inner.includes(key)) ? set.add(key) : set))[0], new Set<string>())]
  }
  function Object(schema: TObject) {
    return globalThis.Object.keys(schema.properties)
  }
  function Visit(schema: TSchema): string[] {
    if (TypeGuard.TIntersect(schema)) return Intersect(schema)
    if (TypeGuard.TUnion(schema)) return Union(schema)
    if (TypeGuard.TObject(schema)) return Object(schema)
    return []
  }
  export function Resolve<T extends TSchema>(schema: T) {
    return Visit(schema)
  }
}
// --------------------------------------------------------------------------
// TypeOrdinal: Used for auto $id generation
// --------------------------------------------------------------------------
let TypeOrdinal = 0
// --------------------------------------------------------------------------
// TypeBuilder
// --------------------------------------------------------------------------
export class TypeBuilder {
  /** `[Utility]` Creates a schema without `static` and `params` types */
  protected Create<T>(schema: Omit<T, 'static' | 'params'>): T {
    return schema as any
  }
  /** `[Standard]` Omits compositing symbols from this schema */
  public Strict<T extends TSchema>(schema: T): T {
    return JSON.parse(JSON.stringify(schema))
  }
}
// --------------------------------------------------------------------------
// StandardTypeBuilder
// --------------------------------------------------------------------------
export class StandardTypeBuilder extends TypeBuilder {
  // ------------------------------------------------------------------------
  // Modifiers
  // ------------------------------------------------------------------------
  /** `[Modifier]` Creates a Optional property */
  public Optional<T extends TSchema>(schema: T): TOptional<T> {
    return { [Modifier]: 'Optional', ...TypeClone.Clone(schema, {}) }
  }
  /** `[Modifier]` Creates a ReadonlyOptional property */
  public ReadonlyOptional<T extends TSchema>(schema: T): TReadonlyOptional<T> {
    return { [Modifier]: 'ReadonlyOptional', ...TypeClone.Clone(schema, {}) }
  }
  /** `[Modifier]` Creates a Readonly object or property */
  public Readonly<T extends TSchema>(schema: T): TReadonly<T> {
    return { [Modifier]: 'Readonly', ...schema }
  }
  // ------------------------------------------------------------------------
  // Types
  // ------------------------------------------------------------------------
  /** `[Standard]` Creates an Any type */
  public Any(options: SchemaOptions = {}): TAny {
    return this.Create({ ...options, [Kind]: 'Any' })
  }
  /** `[Standard]` Creates an Array type */
  public Array<T extends TSchema>(items: T, options: ArrayOptions = {}): TArray<T> {
    return this.Create({ ...options, [Kind]: 'Array', type: 'array', items: TypeClone.Clone(items, {}) })
  }
  /** `[Standard]` Creates a Boolean type */
  public Boolean(options: SchemaOptions = {}): TBoolean {
    return this.Create({ ...options, [Kind]: 'Boolean', type: 'boolean' })
  }
  /** `[Standard]` Creates a Composite object type that will union any overlapping properties of the given object array */
  public Composite<T extends TObject[]>(schemas: [...T], options?: ObjectOptions): TComposite<T> {
    const properties = {} as TProperties
    for (const object of schemas) {
      for (const [key, property] of globalThis.Object.entries(object.properties)) {
        properties[key] = key in properties ? this.Union([properties[key], property]) : TypeClone.Clone(property, {})
      }
    }
    return this.Object(properties, options) as TComposite<T>
  }
  /** `[Standard]` Creates a Enum type */
  public Enum<T extends Record<string, string | number>>(item: T, options: SchemaOptions = {}): TEnum<T> {
    // prettier-ignore
    const values = globalThis.Object.keys(item).filter((key) => isNaN(key as any)).map((key) => item[key]) as T[keyof T][]
    const anyOf = values.map((value) => (typeof value === 'string' ? { [Kind]: 'Literal', type: 'string' as const, const: value } : { [Kind]: 'Literal', type: 'number' as const, const: value }))
    return this.Create({ ...options, [Kind]: 'Union', anyOf })
  }
  /** `[Standard]` A conditional type expression that will return the true type if the left type extends the right */
  public Extends<L extends TSchema, R extends TSchema, T extends TSchema, U extends TSchema>(left: L, right: R, trueType: T, falseType: U, options: SchemaOptions = {}): TExtends<L, R, T, U> {
    switch (TypeExtends.Extends(left, right)) {
      case TypeExtendsResult.Union:
        return this.Union([TypeClone.Clone(trueType, options), TypeClone.Clone(falseType, options)]) as any as TExtends<L, R, T, U>
      case TypeExtendsResult.True:
        return TypeClone.Clone(trueType, options) as TExtends<L, R, T, U>
      case TypeExtendsResult.False:
        return TypeClone.Clone(falseType, options) as TExtends<L, R, T, U>
    }
  }
  /** `[Standard]` Excludes from the left type any type that is not assignable to the right */
  public Exclude<L extends TSchema, R extends TSchema>(left: L, right: R, options: SchemaOptions = {}): TExclude<L, R> {
    if (TypeGuard.TUnion(left)) {
      const narrowed = left.anyOf.filter((inner) => TypeExtends.Extends(inner, right) === TypeExtendsResult.False)
      return (narrowed.length === 1 ? TypeClone.Clone(narrowed[0], options) : this.Union(narrowed, options)) as TExclude<L, R>
    } else {
      return (TypeExtends.Extends(left, right) !== TypeExtendsResult.False ? this.Never(options) : TypeClone.Clone(left, options)) as any
    }
  }
  /** `[Standard]` Extracts from left left any type that is assignable to the right */
  public Extract<L extends TSchema, R extends TSchema>(left: L, right: R, options: SchemaOptions = {}): TExtract<L, R> {
    if (TypeGuard.TUnion(left)) {
      const narrowed = left.anyOf.filter((inner) => TypeExtends.Extends(inner, right) !== TypeExtendsResult.False)
      return (narrowed.length === 1 ? TypeClone.Clone(narrowed[0], options) : this.Union(narrowed, options)) as TExtract<L, R>
    } else {
      return (TypeExtends.Extends(left, right) !== TypeExtendsResult.False ? TypeClone.Clone(left, options) : this.Never(options)) as any
    }
  }
  /** `[Standard]` Creates an Integer type */
  public Integer(options: NumericOptions<number> = {}): TInteger {
    return this.Create({ ...options, [Kind]: 'Integer', type: 'integer' })
  }
  /** `[Standard]` Creates a Intersect type */
  public Intersect(allOf: [], options?: SchemaOptions): TNever
  /** `[Standard]` Creates a Intersect type */
  public Intersect<T extends [TSchema]>(allOf: [...T], options?: SchemaOptions): T[0]
  // /** `[Standard]` Creates a Intersect type */
  public Intersect<T extends TSchema[]>(allOf: [...T], options?: IntersectOptions): TIntersect<T>
  public Intersect(allOf: TSchema[], options: IntersectOptions = {}) {
    if (allOf.length === 0) return Type.Never()
    if (allOf.length === 1) return TypeClone.Clone(allOf[0], options)
    const objects = allOf.every((schema) => TypeGuard.TObject(schema))
    const cloned = allOf.map((schema) => TypeClone.Clone(schema, {}))
    const clonedUnevaluatedProperties = TypeGuard.TSchema(options.unevaluatedProperties) ? { unevaluatedProperties: TypeClone.Clone(options.unevaluatedProperties, {}) } : {}
    if (options.unevaluatedProperties === false || TypeGuard.TSchema(options.unevaluatedProperties) || objects) {
      return this.Create({ ...options, ...clonedUnevaluatedProperties, [Kind]: 'Intersect', type: 'object', allOf: cloned })
    } else {
      return this.Create({ ...options, ...clonedUnevaluatedProperties, [Kind]: 'Intersect', allOf: cloned })
    }
  }
  /** `[Standard]` Creates a KeyOf type */
  public KeyOf<T extends TSchema>(schema: T, options: SchemaOptions = {}): TKeyOf<T> {
    const keys = KeyResolver.Resolve(schema)
    // prettier-ignore
    const keyof = keys.length === 0 ? this.Never(options) : this.Union(keys.map((key) => this.Literal(key)), options)
    return keyof as TKeyOf<T>
  }
  /** `[Standard]` Creates a Literal type */
  public Literal<T extends TLiteralValue>(value: T, options: SchemaOptions = {}): TLiteral<T> {
    return this.Create({ ...options, [Kind]: 'Literal', const: value, type: typeof value as 'string' | 'number' | 'boolean' })
  }
  /** `[Standard]` Creates a Never type */
  public Never(options: SchemaOptions = {}): TNever {
    return this.Create({ ...options, [Kind]: 'Never', not: {} })
  }
  /** `[Standard]` Creates a Not type. The first argument is the disallowed type, the second is the allowed. */
  public Not<N extends TSchema, T extends TSchema>(not: N, schema: T, options?: SchemaOptions): TNot<N, T> {
    return this.Create({ ...options, [Kind]: 'Not', allOf: [{ not: TypeClone.Clone(not, {}) }, TypeClone.Clone(schema, {})] })
  }
  /** `[Standard]` Creates a Null type */
  public Null(options: SchemaOptions = {}): TNull {
    return this.Create({ ...options, [Kind]: 'Null', type: 'null' })
  }
  /** `[Standard]` Creates a Number type */
  public Number(options: NumericOptions<number> = {}): TNumber {
    return this.Create({ ...options, [Kind]: 'Number', type: 'number' })
  }
  /** `[Standard]` Creates an Object type */
  public Object<T extends TProperties>(properties: T, options: ObjectOptions = {}): TObject<T> {
    const propertyKeys = globalThis.Object.getOwnPropertyNames(properties)
    const optionalKeys = propertyKeys.filter((key) => TypeGuard.TOptional(properties[key]) || TypeGuard.TReadonlyOptional(properties[key]))
    const requiredKeys = propertyKeys.filter((name) => !optionalKeys.includes(name))
    const clonedAdditionalProperties = TypeGuard.TSchema(options.additionalProperties) ? { additionalProperties: TypeClone.Clone(options.additionalProperties, {}) } : {}
    const clonedProperties = propertyKeys.reduce((acc, key) => ({ ...acc, [key]: TypeClone.Clone(properties[key], {}) }), {} as TProperties)
    if (requiredKeys.length > 0) {
      return this.Create({ ...options, ...clonedAdditionalProperties, [Kind]: 'Object', type: 'object', properties: clonedProperties, required: requiredKeys })
    } else {
      return this.Create({ ...options, ...clonedAdditionalProperties, [Kind]: 'Object', type: 'object', properties: clonedProperties })
    }
  }
  /** `[Standard]` Creates a mapped type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends (keyof Static<T>)[]>(schema: T, keys: readonly [...K], options?: SchemaOptions): TOmit<T, K[number]>
  /** `[Standard]` Creates a mapped type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TUnion<TLiteral<string>[]>>(schema: T, keys: K, options?: SchemaOptions): TOmit<T, TUnionOfLiteral<K>>
  /** `[Standard]` Creates a mapped type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TLiteral<string>>(schema: T, key: K, options?: SchemaOptions): TOmit<T, K['const']>
  /** `[Standard]` Creates a mapped type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TNever>(schema: T, key: K, options?: SchemaOptions): TOmit<T, never>
  public Omit(schema: TSchema, unresolved: unknown, options: SchemaOptions = {}): any {
    // prettier-ignore
    const keys = 
      TypeGuard.TUnionLiteral(unresolved) ? unresolved.anyOf.map((schema) => schema.const) : 
      TypeGuard.TLiteral(unresolved) ? [unresolved.const] : 
      TypeGuard.TNever(unresolved) ? [] :
      (unresolved as string[])
    // prettier-ignore
    return ObjectMap.Map(TypeClone.Clone(schema, {}), (schema) => {
      if (schema.required) {
        schema.required = schema.required.filter((key: string) => !keys.includes(key as any))
        if (schema.required.length === 0) delete schema.required
      }
      for (const key of globalThis.Object.keys(schema.properties)) {
        if (keys.includes(key as any)) delete schema.properties[key]
      }
      return this.Create(schema)
    }, options)
  }

  /** `[Standard]` Creates a mapped type where all properties are Optional */
  public Partial<T extends TSchema>(schema: T, options: ObjectOptions = {}): TPartial<T> {
    function Apply(schema: TSchema) {
      // prettier-ignore
      switch (schema[Modifier]) {
        case 'ReadonlyOptional': schema[Modifier] = 'ReadonlyOptional'; break;
        case 'Readonly': schema[Modifier] = 'ReadonlyOptional'; break;
        case 'Optional': schema[Modifier] = 'Optional'; break;
        default: schema[Modifier] = 'Optional'; break;
      }
    }
    // prettier-ignore
    return ObjectMap.Map<TPartial<T>>(TypeClone.Clone(schema, {}), (schema) => {
      delete schema.required
      globalThis.Object.keys(schema.properties).forEach(key => Apply(schema.properties[key]))
      return schema
    }, options)
  }
  /** `[Standard]` Creates a mapped type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends (keyof Static<T>)[]>(schema: T, keys: readonly [...K], options?: SchemaOptions): TPick<T, K[number]>
  /** `[Standard]` Creates a mapped type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TUnion<TLiteral<string>[]>>(schema: T, keys: K, options?: SchemaOptions): TPick<T, TUnionOfLiteral<K>>
  /** `[Standard]` Creates a mapped type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TLiteral<string>>(schema: T, key: K, options?: SchemaOptions): TPick<T, K['const']>
  /** `[Standard]` Creates a mapped type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TNever>(schema: T, key: K, options?: SchemaOptions): TPick<T, never>
  public Pick(schema: TSchema, unresolved: unknown, options: SchemaOptions = {}): any {
    // prettier-ignore
    const keys = 
      TypeGuard.TUnionLiteral(unresolved) ? unresolved.anyOf.map((schema) => schema.const) : 
      TypeGuard.TLiteral(unresolved) ? [unresolved.const] : 
      TypeGuard.TNever(unresolved) ? [] :
      (unresolved as string[])
    // prettier-ignore
    return ObjectMap.Map(TypeClone.Clone(schema, {}), (schema) => {
      if (schema.required) {
        schema.required = schema.required.filter((key: any) => keys.includes(key))
        if (schema.required.length === 0) delete schema.required
      }
      for (const key of globalThis.Object.keys(schema.properties)) {
        if (!keys.includes(key as any)) delete schema.properties[key]
      }
      return this.Create(schema)
    }, options)
  }
  /** `[Standard]` Creates an Object type from the given Literal Union */
  public Record<K extends TUnion<TLiteral<string | number>[]>, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): TObject<TRecordPropertiesFromUnionLiteral<K, T>>
  /** `[Standard]` Creates an Object type from the given Literal Union */
  public Record<K extends TLiteral<string | number>, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): TObject<TRecordPropertiesFromLiteral<K, T>>
  /** `[Standard]` Creates a Record type */
  public Record<K extends TString | TNumeric, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): TRecord<K, T>
  public Record(key: any, schema: TSchema, options: ObjectOptions = {}) {
    if (TypeGuard.TLiteral(key)) {
      if (typeof key.const === 'string' || typeof key.const === 'number') {
        return this.Object({ [key.const]: TypeClone.Clone(schema, {}) }, options)
      } else throw Error('TypeBuilder: Record key can only be derived from literals of number or string')
    }
    if (TypeGuard.TUnion(key)) {
      if (key.anyOf.every((schema) => TypeGuard.TLiteral(schema) && (typeof schema.const === 'string' || typeof schema.const === 'number'))) {
        const properties = key.anyOf.reduce((acc: any, literal: any) => ({ ...acc, [literal.const]: TypeClone.Clone(schema, {}) }), {} as TProperties)
        return this.Object(properties, { ...options, [Hint]: 'Record' })
      } else throw Error('TypeBuilder: Record key can only be derived from union literal of number or string')
    }
    const pattern = ['Integer', 'Number'].includes(key[Kind]) ? '^(0|[1-9][0-9]*)$' : key[Kind] === 'String' && key.pattern ? key.pattern : '^.*$'
    return this.Create({
      ...options,
      [Kind]: 'Record',
      type: 'object',
      patternProperties: { [pattern]: TypeClone.Clone(schema, {}) },
      additionalProperties: false,
    })
  }
  /** `[Standard]` Creates a Recursive type */
  public Recursive<T extends TSchema>(callback: (self: TSelf) => T, options: SchemaOptions = {}): TRecursive<T> {
    if (options.$id === undefined) (options as any).$id = `T${TypeOrdinal++}`
    const self = callback({ [Kind]: 'Self', $ref: `${options.$id}` } as any)
    self.$id = options.$id
    return this.Create({ ...options, ...self } as any)
  }
  /** `[Standard]` Creates a Ref type. The referenced type must contain a $id */
  public Ref<T extends TSchema>(schema: T, options: SchemaOptions = {}): TRef<T> {
    if (schema.$id === undefined) throw Error('StandardTypeBuilder.Ref: Target type must specify an $id')
    return this.Create({ ...options, [Kind]: 'Ref', $ref: schema.$id! })
  }
  /** `[Standard]` Creates a mapped type where all properties are Required */
  public Required<T extends TSchema>(schema: T, options: SchemaOptions = {}): TRequired<T> {
    function Apply(schema: TSchema) {
      // prettier-ignore
      switch (schema[Modifier]) {
        case 'ReadonlyOptional': schema[Modifier] = 'Readonly'; break
        case 'Readonly': schema[Modifier] = 'Readonly'; break
        case 'Optional': delete schema[Modifier]; break
        default: delete schema[Modifier]; break
      }
    }
    // prettier-ignore
    return ObjectMap.Map<TRequired<T>>(TypeClone.Clone(schema, {}), (schema) => {
      schema.required = globalThis.Object.keys(schema.properties)
      globalThis.Object.keys(schema.properties).forEach(key => Apply(schema.properties[key]))
      return schema
    }, options)
  }
  /** `[Standard]` Creates a String type */
  public String<Format extends string>(options: StringOptions<StringFormatOption | Format> = {}): TString<Format> {
    return this.Create({ ...options, [Kind]: 'String', type: 'string' })
  }
  /** `[Standard]` Creates a Tuple type */
  public Tuple<T extends TSchema[]>(items: [...T], options: SchemaOptions = {}): TTuple<T> {
    const [additionalItems, minItems, maxItems] = [false, items.length, items.length]
    const clonedItems = items.map((item) => TypeClone.Clone(item, {}))
    // prettier-ignore
    const schema = (items.length > 0 ? 
      { ...options, [Kind]: 'Tuple', type: 'array', items: clonedItems, additionalItems, minItems, maxItems } : 
      { ...options, [Kind]: 'Tuple', type: 'array', minItems, maxItems }) as any
    return this.Create(schema)
  }
  /** `[Standard]` Creates a Union type */
  public Union(anyOf: [], options?: SchemaOptions): TNever
  /** `[Standard]` Creates a Union type */
  public Union<T extends [TSchema]>(anyOf: [...T], options?: SchemaOptions): T[0]
  /** `[Standard]` Creates a Union type */
  public Union<T extends TSchema[]>(anyOf: [...T], options?: SchemaOptions): TUnion<T>
  public Union(anyOf: TSchema[], options: SchemaOptions = {}) {
    if (anyOf.length === 0) return this.Never(options)
    if (anyOf.length === 1) return this.Create(TypeClone.Clone(anyOf[0], options))
    const clonedAnyOf = anyOf.map((schema) => TypeClone.Clone(schema, {}))
    return this.Create({ ...options, [Kind]: 'Union', anyOf: clonedAnyOf })
  }
  /** `[Standard]` Creates an Unknown type */
  public Unknown(options: SchemaOptions = {}): TUnknown {
    return this.Create({ ...options, [Kind]: 'Unknown' })
  }
  /** `[Standard]` Creates a Unsafe type that infers for the generic argument */
  public Unsafe<T>(options: UnsafeOptions = {}): TUnsafe<T> {
    return this.Create({ ...options, [Kind]: options[Kind] || 'Unsafe' })
  }
}
// --------------------------------------------------------------------------
// TypeBuilder
// --------------------------------------------------------------------------
export class ExtendedTypeBuilder extends StandardTypeBuilder {
  /** `[Extended]` Creates a BigInt type */
  public BigInt(options: NumericOptions<bigint> = {}): TBigInt {
    return this.Create({ ...options, [Kind]: 'BigInt', type: 'null', typeOf: 'BigInt' })
  }
  /** `[Extended]` Extracts the ConstructorParameters from the given Constructor type */
  public ConstructorParameters<T extends TConstructor<any[], any>>(schema: T, options: SchemaOptions = {}): TConstructorParameters<T> {
    return this.Tuple([...schema.parameters], { ...options })
  }
  /** `[Extended]` Creates a Constructor type */
  public Constructor<T extends TTuple<TSchema[]>, U extends TSchema>(parameters: T, returns: U, options?: SchemaOptions): TConstructor<TTupleIntoArray<T>, U>
  /** `[Extended]` Creates a Constructor type */
  public Constructor<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TConstructor<T, U>
  public Constructor(parameters: any, returns: any, options: SchemaOptions = {}) {
    const clonedReturns = TypeClone.Clone(returns, {})
    if (TypeGuard.TTuple(parameters)) {
      const clonedParameters = parameters.items === undefined ? [] : parameters.items.map((parameter) => TypeClone.Clone(parameter, {}))
      return this.Create({ ...options, [Kind]: 'Constructor', type: 'object', instanceOf: 'Constructor', parameters: clonedParameters, returns: clonedReturns })
    } else if (globalThis.Array.isArray(parameters)) {
      const clonedParameters = parameters.map((parameter) => TypeClone.Clone(parameter, {}))
      return this.Create({ ...options, [Kind]: 'Constructor', type: 'object', instanceOf: 'Constructor', parameters: clonedParameters, returns: clonedReturns })
    } else {
      throw new Error('ExtendedTypeBuilder.Constructor: Invalid parameters')
    }
  }
  /** `[Extended]` Creates a Date type */
  public Date(options: DateOptions = {}): TDate {
    return this.Create({ ...options, [Kind]: 'Date', type: 'object', instanceOf: 'Date' })
  }
  /** `[Extended]` Creates a Function type */
  public Function<T extends TTuple<TSchema[]>, U extends TSchema>(parameters: T, returns: U, options?: SchemaOptions): TFunction<TTupleIntoArray<T>, U>
  /** `[Extended]` Creates a Function type */
  public Function<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TFunction<T, U>
  public Function(parameters: any, returns: any, options: SchemaOptions = {}) {
    const clonedReturns = TypeClone.Clone(returns, {})
    if (TypeGuard.TTuple(parameters)) {
      const clonedParameters = parameters.items === undefined ? [] : parameters.items.map((parameter) => TypeClone.Clone(parameter, {}))
      return this.Create({ ...options, [Kind]: 'Function', type: 'object', instanceOf: 'Function', parameters: clonedParameters, returns: clonedReturns })
    } else if (globalThis.Array.isArray(parameters)) {
      const clonedParameters = parameters.map((parameter) => TypeClone.Clone(parameter, {}))
      return this.Create({ ...options, [Kind]: 'Function', type: 'object', instanceOf: 'Function', parameters: clonedParameters, returns: clonedReturns })
    } else {
      throw new Error('ExtendedTypeBuilder.Function: Invalid parameters')
    }
  }
  /** `[Extended]` Extracts the InstanceType from the given Constructor */
  public InstanceType<T extends TConstructor<any[], any>>(schema: T, options: SchemaOptions = {}): TInstanceType<T> {
    return TypeClone.Clone(schema.returns, options)
  }
  /** `[Extended]` Extracts the Parameters from the given Function type */
  public Parameters<T extends TFunction<any[], any>>(schema: T, options: SchemaOptions = {}): TParameters<T> {
    return this.Tuple(schema.parameters, { ...options })
  }
  /** `[Extended]` Creates a Promise type */
  public Promise<T extends TSchema>(item: T, options: SchemaOptions = {}): TPromise<T> {
    return this.Create({ ...options, [Kind]: 'Promise', type: 'object', instanceOf: 'Promise', item: TypeClone.Clone(item, {}) })
  }
  /** `[Extended]` Creates a regular expression type */
  public RegEx(regex: RegExp, options: SchemaOptions = {}): TString {
    return this.Create({ ...options, [Kind]: 'String', type: 'string', pattern: regex.source })
  }
  /** `[Extended]` Extracts the ReturnType from the given Function */
  public ReturnType<T extends TFunction<any[], any>>(schema: T, options: SchemaOptions = {}): TReturnType<T> {
    return TypeClone.Clone(schema.returns, options)
  }
  /** `[Extended]` Creates a Symbol type */
  public Symbol(options?: SchemaOptions): TSymbol {
    return this.Create({ ...options, [Kind]: 'Symbol', type: 'null', typeOf: 'Symbol' })
  }
  /** `[Extended]` Creates a Undefined type */
  public Undefined(options: SchemaOptions = {}): TUndefined {
    return this.Create({ ...options, [Kind]: 'Undefined', type: 'null', typeOf: 'Undefined' })
  }
  /** `[Extended]` Creates a Uint8Array type */
  public Uint8Array(options: Uint8ArrayOptions = {}): TUint8Array {
    return this.Create({ ...options, [Kind]: 'Uint8Array', type: 'object', instanceOf: 'Uint8Array' })
  }
  /** `[Extended]` Creates a Void type */
  public Void(options: SchemaOptions = {}): TVoid {
    return this.Create({ ...options, [Kind]: 'Void', type: 'null', typeOf: 'Void' })
  }
}

/** JSON Schema TypeBuilder with Static Resolution for TypeScript */
export const StandardType = new StandardTypeBuilder()

/** JSON Schema TypeBuilder with Static Resolution for TypeScript */
export const Type = new ExtendedTypeBuilder()
