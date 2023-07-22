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
// Symbols
// --------------------------------------------------------------------------
export const Readonly = Symbol.for('TypeBox.Readonly')
export const Optional = Symbol.for('TypeBox.Optional')
export const Hint = Symbol.for('TypeBox.Hint')
export const Kind = Symbol.for('TypeBox.Kind')
// --------------------------------------------------------------------------
// Patterns
// --------------------------------------------------------------------------
export const PatternBoolean = '(true|false)'
export const PatternNumber = '(0|[1-9][0-9]*)'
export const PatternString = '(.*)'
export const PatternBooleanExact = `^${PatternBoolean}$`
export const PatternNumberExact = `^${PatternNumber}$`
export const PatternStringExact = `^${PatternString}$`
// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------
export type TupleToIntersect<T extends any[]> = T extends [infer I] ? I : T extends [infer I, ...infer R] ? I & TupleToIntersect<R> : never
export type TupleToUnion<T extends any[]> = { [K in keyof T]: T[K] }[number]
export type UnionToIntersect<U> = (U extends unknown ? (arg: U) => 0 : never) extends (arg: infer I) => 0 ? I : never
export type UnionLast<U> = UnionToIntersect<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0 ? L : never
export type UnionToTuple<U, L = UnionLast<U>> = [U] extends [never] ? [] : [...UnionToTuple<Exclude<U, L>>, L]
export type Discard<T extends unknown[], D extends unknown> = T extends [infer L, ...infer R] ? (L extends D ? Discard<R, D> : [L, ...Discard<R, D>]) : []
export type Flat<T> = T extends [] ? [] : T extends [infer L] ? [...Flat<L>] : T extends [infer L, ...infer R] ? [...Flat<L>, ...Flat<R>] : [T]
export type Trim<T> = T extends `${' '}${infer U}` ? Trim<U> : T extends `${infer U}${' '}` ? Trim<U> : T
export type Assert<T, E> = T extends E ? T : never
export type Evaluate<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
export type Ensure<T> = T extends infer U ? U : never
// --------------------------------------------------------------------------
// Type Assertions
// --------------------------------------------------------------------------
export type AssertProperties<T> = T extends TProperties ? T : TProperties
export type AssertRest<T, E extends TSchema[] = TSchema[]> = T extends E ? T : []
export type AssertType<T, E extends TSchema = TSchema> = T extends E ? T : TNever
// --------------------------------------------------------------------------
// Modifiers
// --------------------------------------------------------------------------
export type TModifier = TOptional<TSchema> | TReadonly<TSchema>
export type TReadonly<T extends TSchema> = T & { [Readonly]: 'Readonly' }
export type TOptional<T extends TSchema> = T & { [Optional]: 'Optional' }
// --------------------------------------------------------------------------
// Readonly Unwrap
// --------------------------------------------------------------------------
// prettier-ignore
export type ReadonlyUnwrapType<T extends TSchema> =
  T extends TReadonly<infer S> ? ReadonlyUnwrapType<S> : 
  T extends TOptional<infer S> ? TOptional<ReadonlyUnwrapType<S>> :
  T
// prettier-ignore
export type ReadonlyUnwrapRest<T extends TSchema[]> = T extends [infer L, ...infer R]
  ? L extends TReadonly<infer S>
    ? [ReadonlyUnwrapType<AssertType<S>>, ...ReadonlyUnwrapRest<AssertRest<R>>] 
    : [L, ...ReadonlyUnwrapRest<AssertRest<R>>]
  :  []
// --------------------------------------------------------------------------
// Optional Unwrap
// --------------------------------------------------------------------------
// prettier-ignore
export type OptionalUnwrapType<T extends TSchema> =
  T extends TReadonly<infer S> ? TReadonly<OptionalUnwrapType<S>> :
  T extends TOptional<infer S> ? OptionalUnwrapType<S> : 
  T
// prettier-ignore
export type OptionalUnwrapRest<T extends TSchema[]> = T extends [infer L, ...infer R]
  ? L extends TOptional<infer S>
    ? [OptionalUnwrapType<AssertType<S>>, ...OptionalUnwrapRest<AssertRest<R>>] 
    : [L, ...OptionalUnwrapRest<AssertRest<R>>]
  :  []
// --------------------------------------------------------------------------
// IntersectType
// --------------------------------------------------------------------------
// prettier-ignore
export type IntersectOptional<T extends TSchema[]> = T extends [infer L, ...infer R] 
  ? L extends TOptional<AssertType<L>> 
    ? IntersectOptional<AssertRest<R>> 
    : false
  : true
// prettier-ignore
export type IntersectResolve<T extends TSchema[], U = OptionalUnwrapRest<AssertRest<T>>> = IntersectOptional<AssertRest<T>> extends true
  ? TOptional<TIntersect<AssertRest<U>>>
  : TIntersect<AssertRest<U>>
// prettier-ignore
export type IntersectType<T extends TSchema[]> = 
    T extends [] ? TNever : 
    T extends [TSchema] ? AssertType<T[0]> : 
    IntersectResolve<T>
// --------------------------------------------------------------------------
// UnionType
// --------------------------------------------------------------------------
// prettier-ignore
export type UnionOptional<T extends TSchema[]> = T extends [infer L, ...infer R]
  ? L extends (TOptional<AssertType<L>>)
    ? true 
    : UnionOptional<AssertRest<R>> 
  : false
// prettier-ignore
export type UnionResolve<T extends TSchema[], U = OptionalUnwrapRest<AssertRest<T>>> = UnionOptional<AssertRest<T>> extends true
  ? TOptional<TUnion<AssertRest<U>>>
  : TUnion<AssertRest<U>>
// prettier-ignore
export type UnionType<T extends TSchema[]> = 
  T extends [] ? TNever : 
  T extends [TSchema] ? AssertType<T[0]> : 
  UnionResolve<T>
// --------------------------------------------------------------------------
// Key
// --------------------------------------------------------------------------
export type Key = string | number
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
  /** Optional annotation for readOnly */
  readOnly?: boolean
  /** Optional annotation for writeOnly */
  writeOnly?: boolean
  [prop: string]: any
}
export interface TKind {
  [Kind]: string
}
export interface TSchema extends SchemaOptions, TKind {
  [Readonly]?: string
  [Optional]?: string
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
  | TAsyncIterator
  | TBigInt
  | TBoolean
  | TConstructor
  | TDate
  | TEnum
  | TFunction
  | TInteger
  | TIntersect
  | TIterator
  | TLiteral
  | TNot
  | TNull
  | TNumber
  | TObject
  | TPromise
  | TRecord
  | TRef
  | TString
  | TSymbol
  | TTemplateLiteral
  | TThis
  | TTuple
  | TUndefined
  | TUnion
  | TUint8Array
  | TUnknown
  | TVoid
// --------------------------------------------------------------------------
// TNumeric
// --------------------------------------------------------------------------
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
  minItems?: number
  maxItems?: number
  contains?: TSchema
  minContains?: number
  maxContains?: number
  uniqueItems?: boolean
}
export interface TArray<T extends TSchema = TSchema> extends TSchema, ArrayOptions {
  [Kind]: 'Array'
  static: Static<T, this['params']>[]
  type: 'array'
  items: T
}
// --------------------------------------------------------------------------
// TAsyncIterator
// --------------------------------------------------------------------------
export interface TAsyncIterator<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'AsyncIterator'
  static: AsyncIterableIterator<Static<T, this['params']>>
  type: 'AsyncIterator'
  items: T
}
// --------------------------------------------------------------------------
// TBigInt
// --------------------------------------------------------------------------
export interface TBigInt extends TSchema, NumericOptions<bigint> {
  [Kind]: 'BigInt'
  static: bigint
  type: 'bigint'
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
// prettier-ignore
export type TCompositeKeys<T extends TObject[]> = T extends [infer L, ...infer R] 
  ? keyof Assert<L, TObject>['properties'] | TCompositeKeys<Assert<R, TObject[]>>
  : never
// prettier-ignore
export type TCompositeIndex<T extends TIntersect<TObject[]>, K extends string[]> = K extends [infer L, ...infer R] 
  ? { [_ in Assert<L, string>]: TIndexType<T, Assert<L, string>> } & TCompositeIndex<T, Assert<R, string[]>> 
  : {}
// prettier-ignore
export type TCompositeReduce<T extends TObject[]> = UnionToTuple<TCompositeKeys<T>> extends infer K 
  ? Evaluate<TCompositeIndex<TIntersect<T>, Assert<K, string[]>>> 
  : {} //                    ^ indexed via intersection of T
// prettier-ignore
export type TComposite<T extends TObject[]> = TIntersect<T> extends TIntersect 
  ? TObject<TCompositeReduce<T>>
  : TObject<{}>
// --------------------------------------------------------------------------
// TConstructor
// --------------------------------------------------------------------------
export type TConstructorParameterArray<T extends readonly TSchema[], P extends unknown[]> = [...{ [K in keyof T]: Static<AssertType<T[K]>, P> }]
export interface TConstructor<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Constructor'
  static: new (...param: TConstructorParameterArray<T, this['params']>) => Static<U, this['params']>
  type: 'constructor'
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
  type: 'date'
}
// --------------------------------------------------------------------------
// TEnum
// --------------------------------------------------------------------------
export interface TEnumOption<T> {
  type: 'number' | 'string'
  const: T
}
export interface TEnum<T extends Record<string, string | number> = Record<string, string | number>> extends TSchema {
  [Kind]: 'Union'
  static: T[keyof T]
  anyOf: TLiteral<T[keyof T]>[]
}
// --------------------------------------------------------------------------
// TExtends
// --------------------------------------------------------------------------
// prettier-ignore
export type TExtends<L extends TSchema, R extends TSchema, T extends TSchema, U extends TSchema> = 
  (Static<L> extends Static<R> ? T : U) extends infer O ? 
    UnionToTuple<O> extends [infer X, infer Y] ? TUnion<[AssertType<X>, AssertType<Y>]> : AssertType<O>
  : never
// --------------------------------------------------------------------------
// TExclude
// --------------------------------------------------------------------------
export type TExcludeTemplateLiteralResult<T extends string> = UnionType<AssertRest<UnionToTuple<{ [K in T]: TLiteral<K> }[T]>>>
export type TExcludeTemplateLiteral<T extends TTemplateLiteral, U extends TSchema> = Exclude<Static<T>, Static<U>> extends infer S ? TExcludeTemplateLiteralResult<Assert<S, string>> : never
// prettier-ignore
export type TExcludeArray<T extends TSchema[], U extends TSchema> = AssertRest<UnionToTuple<{
  [K in keyof T]: Static<AssertType<T[K]>> extends Static<U> ? never : T[K]
}[number]>> extends infer R ? UnionType<AssertRest<R>> : never
// prettier-ignore
export type TExclude<T extends TSchema, U extends TSchema> = 
  T extends TTemplateLiteral ? TExcludeTemplateLiteral<T, U> : 
  T extends TUnion<infer S> ? TExcludeArray<S, U> : 
  T extends U ? TNever : T
// --------------------------------------------------------------------------
// TExtract
// --------------------------------------------------------------------------
export type TExtractTemplateLiteralResult<T extends string> = UnionType<AssertRest<UnionToTuple<{ [K in T]: TLiteral<K> }[T]>>>
export type TExtractTemplateLiteral<T extends TTemplateLiteral, U extends TSchema> = Extract<Static<T>, Static<U>> extends infer S ? TExtractTemplateLiteralResult<Assert<S, string>> : never
// prettier-ignore
export type TExtractArray<T extends TSchema[], U extends TSchema> = AssertRest<UnionToTuple<
  {[K in keyof T]: Static<AssertType<T[K]>> extends Static<U> ? T[K] : never
}[number]>> extends infer R ? UnionType<AssertRest<R>> : never
// prettier-ignore
export type TExtract<T extends TSchema, U extends TSchema> = 
  T extends TTemplateLiteral ? TExtractTemplateLiteral<T, U> : 
  T extends TUnion<infer S> ? TExtractArray<S, U> : 
  T extends U ? T : T
// --------------------------------------------------------------------------
// TFunction
// --------------------------------------------------------------------------
export type TFunctionParameters<T extends TSchema[], P extends unknown[]> = [...{ [K in keyof T]: Static<AssertType<T[K]>, P> }]
export interface TFunction<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Function'
  static: (...param: TFunctionParameters<T, this['params']>) => Static<U, this['params']>
  type: 'function'
  parameters: T
  returns: U
}
// --------------------------------------------------------------------------
// TIndex
// --------------------------------------------------------------------------

export type TIndexRest<T extends TSchema[], K extends Key> = T extends [infer L, ...infer R] ? [TIndexType<AssertType<L>, K>, ...TIndexRest<AssertRest<R>, K>] : []
export type TIndexProperty<T extends TProperties, K extends Key> = K extends keyof T ? [T[K]] : []
export type TIndexTuple<T extends TSchema[], K extends Key> = K extends keyof T ? [T[K]] : []
// prettier-ignore
export type TIndexType<T extends TSchema, K extends Key> =
  T extends TRecursive<infer S> ? TIndexType<S, K> :
  T extends TIntersect<infer S> ? IntersectType<AssertRest<Discard<Flat<TIndexRest<S, K>>, TNever>>> :
  T extends TUnion<infer S>     ? UnionType<AssertRest<Flat<TIndexRest<S, K>>>> :
  T extends TObject<infer S>    ? UnionType<AssertRest<Flat<TIndexProperty<S, K>>>> :
  T extends TTuple<infer S>     ? UnionType<AssertRest<Flat<TIndexTuple<S, K>>>> :
  []
// prettier-ignore
export type TIndexRestMany<T extends TSchema, K extends Key[]> = 
 K extends [infer L, ...infer R] ? [TIndexType<T, Assert<L, Key>>, ...TIndexRestMany<T, Assert<R, Key[]>>] :
 []
// prettier-ignore
export type TIndex<T extends TSchema, K extends Key[]> =
  T extends TRecursive<infer S> ? TIndex<S, K> :
  T extends TIntersect ? UnionType<Flat<TIndexRestMany<T, K>>> :
  T extends TUnion     ? UnionType<Flat<TIndexRestMany<T, K>>> :
  T extends TObject    ? UnionType<Flat<TIndexRestMany<T, K>>> :
  T extends TTuple     ? UnionType<Flat<TIndexRestMany<T, K>>> :
  TNever
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
export interface TIntersect<T extends TSchema[] = TSchema[]> extends TSchema, IntersectOptions {
  [Kind]: 'Intersect'
  static: TupleToIntersect<{ [K in keyof T]: Static<AssertType<T[K]>, this['params']> }>
  type?: 'object'
  allOf: [...T]
}
// --------------------------------------------------------------------------
// TIterator
// --------------------------------------------------------------------------
export interface TIterator<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Iterator'
  static: IterableIterator<Static<T, this['params']>>
  type: 'Iterator'
  items: T
}
// --------------------------------------------------------------------------
// TKeyOf
// --------------------------------------------------------------------------
// prettier-ignore
export type TKeyOfProperties<T extends TSchema> = Discard<Static<T> extends infer S
  ? UnionToTuple<{[K in keyof S]: TLiteral<Assert<K, TLiteralValue>>}[keyof S]>
  : [], undefined> // note: optional properties produce undefined types in tuple result. discard.
// prettier-ignore
export type TKeyOfIndicesArray<T extends TSchema[]> = UnionToTuple<keyof T & `${number}`>
// prettier-ignore
export type TKeyOfIndices<T extends TSchema[]> = AssertRest<TKeyOfIndicesArray<T> extends infer R ? {
  [K in keyof R] : TLiteral<Assert<R[K], TLiteralValue>>
}: []>
// prettier-ignore
export type TKeyOf<T extends TSchema = TSchema> = (
  T extends TRecursive<infer S> ? TKeyOfProperties<S> :
  T extends TIntersect          ? TKeyOfProperties<T> :
  T extends TUnion              ? TKeyOfProperties<T> :
  T extends TObject             ? TKeyOfProperties<T> :
  T extends TTuple<infer K>     ? TKeyOfIndices<K> :
  T extends TArray              ? [TNumber] :
  T extends TRecord<infer K>    ? [K] :
  []
) extends infer R ? UnionType<AssertRest<R>> : never
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
  not: {}
}
// --------------------------------------------------------------------------
// TNot
// --------------------------------------------------------------------------
export interface TNot<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Not'
  static: T extends TNot<infer U> ? Static<U> : unknown
  not: T
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
export type ReadonlyOptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonly<TSchema> ? (T[K] extends TOptional<T[K]> ? K : never) : never }[keyof T]
export type ReadonlyPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonly<TSchema> ? (T[K] extends TOptional<T[K]> ? never : K) : never }[keyof T]
export type OptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TOptional<TSchema> ? (T[K] extends TReadonly<T[K]> ? never : K) : never }[keyof T]
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
export type TOmitArray<T extends TSchema[], K extends keyof any> = AssertRest<{ [K2 in keyof T]: TOmit<AssertType<T[K2]>, K> }>
export type TOmitProperties<T extends TProperties, K extends keyof any> = Evaluate<AssertProperties<Omit<T, K>>>
// prettier-ignore
export type TOmit<T extends TSchema = TSchema, K extends keyof any = keyof any> = 
  T extends TRecursive<infer S> ? TRecursive<TOmit<S, K>> :
  T extends TIntersect<infer S> ? TIntersect<TOmitArray<S, K>> : 
  T extends TUnion<infer S> ? TUnion<TOmitArray<S, K>> : 
  T extends TObject<infer S> ? TObject<TOmitProperties<S, K>> : 
  T
// --------------------------------------------------------------------------
// TParameters
// --------------------------------------------------------------------------
export type TParameters<T extends TFunction> = Ensure<TTuple<T['parameters']>>
// --------------------------------------------------------------------------
// TPartial
// --------------------------------------------------------------------------
export type TPartialObjectArray<T extends TObject[]> = AssertRest<{ [K in keyof T]: TPartial<AssertType<T[K], TObject>> }, TObject[]>
export type TPartialArray<T extends TSchema[]> = AssertRest<{ [K in keyof T]: TPartial<AssertType<T[K]>> }>
// prettier-ignore
export type TPartialProperties<T extends TProperties> = Evaluate<AssertProperties<{
  [K in keyof T]: TOptional<T[K]>
}>>
// prettier-ignore
export type TPartial<T extends TSchema> =  
  T extends TRecursive<infer S> ? TRecursive<TPartial<S>> :   
  T extends TIntersect<infer S> ? TIntersect<TPartialArray<S>> : 
  T extends TUnion<infer S>     ? TUnion<TPartialArray<S>> : 
  T extends TObject<infer S>    ? TObject<TPartialProperties<S>> : 
  T
// --------------------------------------------------------------------------
// TPick
// --------------------------------------------------------------------------
export type TPickArray<T extends TSchema[], K extends keyof any> = { [K2 in keyof T]: TPick<AssertType<T[K2]>, K> }
// Note the key K will overlap for varying TProperties gathered via recursive union and intersect traversal. Because of this,
// we need to extract only keys assignable to T on K2. This behavior is only required for Pick only.
// prettier-ignore
export type TPickProperties<T extends TProperties, K extends keyof any> = 
  Pick<T, Assert<Extract<K, keyof T>, keyof T>> extends infer R ? ({
    [K in keyof R]: AssertType<R[K]> extends TSchema ? R[K] : never
  }): never
// prettier-ignore
export type TPick<T extends TSchema = TSchema, K extends keyof any = keyof any> = 
  T extends TRecursive<infer S> ? TRecursive<TPick<S, K>> :
  T extends TIntersect<infer S> ? TIntersect<TPickArray<S, K>> : 
  T extends TUnion<infer S> ? TUnion<TPickArray<S, K>> : 
  T extends TObject<infer S> ? TObject<TPickProperties<S, K>> :
  T
// --------------------------------------------------------------------------
// TPromise
// --------------------------------------------------------------------------
export interface TPromise<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Promise'
  static: Promise<Static<T, this['params']>>
  type: 'promise'
  item: TSchema
}
// --------------------------------------------------------------------------
// TRecord
// --------------------------------------------------------------------------
export type RecordTemplateLiteralObjectType<K extends TTemplateLiteral, T extends TSchema> = Ensure<TObject<Evaluate<{ [_ in Static<K>]: T }>>>
export type RecordTemplateLiteralType<K extends TTemplateLiteral, T extends TSchema> = IsTemplateLiteralFinite<K> extends true ? RecordTemplateLiteralObjectType<K, T> : TRecord<K, T>
export type RecordUnionLiteralType<K extends TUnion, T extends TSchema> = Static<K> extends string ? Ensure<TObject<{ [X in Static<K>]: T }>> : never
export type RecordLiteralType<K extends TLiteral<string | number>, T extends TSchema> = Ensure<TObject<{ [K2 in K['const']]: T }>>
export type RecordNumberType<K extends TInteger | TNumber, T extends TSchema> = Ensure<TRecord<K, T>>
export type RecordStringType<K extends TString, T extends TSchema> = Ensure<TRecord<K, T>>
export type RecordKey = TUnion<TLiteral<string | number>[]> | TLiteral<string | number> | TTemplateLiteral | TInteger | TNumber | TString
export interface TRecord<K extends RecordKey = RecordKey, T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Record'
  static: Record<Static<K>, Static<T, this['params']>>
  type: 'object'
  patternProperties: { [pattern: string]: T }
  additionalProperties: TAdditionalProperties
}
// --------------------------------------------------------------------------
// TRecursive
// --------------------------------------------------------------------------
export interface TThis extends TSchema {
  [Kind]: 'This'
  static: this['params'][0]
  $ref: string
}
export type TRecursiveReduce<T extends TSchema> = Static<T, [TRecursiveReduce<T>]>
export interface TRecursive<T extends TSchema> extends TSchema {
  [Hint]: 'Recursive'
  static: TRecursiveReduce<T>
}
// --------------------------------------------------------------------------
// TRef
// --------------------------------------------------------------------------
export interface TRef<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Ref'
  static: Static<T, this['params']>
  $ref: string
}
// --------------------------------------------------------------------------
// TRest
// --------------------------------------------------------------------------
export type TRest<T extends TSchema> = T extends TTuple<infer R> ? Assert<R, TSchema[]> : Assert<[T], TSchema[]>
// --------------------------------------------------------------------------
// TReturnType
// --------------------------------------------------------------------------
export type TReturnType<T extends TFunction> = T['returns']
// --------------------------------------------------------------------------
// TRequired
// --------------------------------------------------------------------------
export type TRequiredArray<T extends TSchema[]> = AssertRest<{ [K in keyof T]: TRequired<AssertType<T[K]>> }>
// prettier-ignore
export type TRequiredProperties<T extends TProperties> = Evaluate<AssertProperties<{
  [K in keyof T]: T[K] extends TOptional<infer S> ? S : T[K]
}>>
// prettier-ignore
export type TRequired<T extends TSchema> = 
  T extends TRecursive<infer S> ? TRecursive<TRequired<S>> :   
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
  | ({} & string)
// prettier-ignore
export type StringContentEncodingOption = 
  | '7bit' 
  | '8bit' 
  | 'binary' 
  | 'quoted-printable' 
  | 'base64' 
  | ({} & string)
export interface StringOptions extends SchemaOptions {
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: StringFormatOption
  contentEncoding?: StringContentEncodingOption
  contentMediaType?: string
}
export interface TString extends TSchema, StringOptions {
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
  type: 'symbol'
}
// -------------------------------------------------------------------------
// TTemplateLiteralParserDsl
// -------------------------------------------------------------------------
// prettier-ignore
export type TTemplateLiteralDslParserUnionLiteral<T extends string> = 
  T extends `${infer L}|${infer R}` ? [TLiteral<Trim<L>>, ...TTemplateLiteralDslParserUnionLiteral<R>] : 
  T extends `${infer L}` ? [TLiteral<Trim<L>>] : 
  []
export type TTemplateLiteralDslParserUnion<T extends string> = UnionType<TTemplateLiteralDslParserUnionLiteral<T>>
// prettier-ignore
export type TTemplateLiteralDslParserTerminal<T extends string> = 
  T extends 'boolean' ? TBoolean :  
  T extends 'bigint' ? TBigInt :  
  T extends 'number' ? TNumber :
  T extends 'string' ? TString :
  TTemplateLiteralDslParserUnion<T>
// prettier-ignore
export type TTemplateLiteralDslParserTemplate<T extends string> = 
  T extends `{${infer L}}${infer R}` ? [TTemplateLiteralDslParserTerminal<L>, ...TTemplateLiteralDslParserTemplate<R>] :
  T extends `${infer L}$${infer R}`  ? [TLiteral<L>, ...TTemplateLiteralDslParserTemplate<R>] :
  T extends `${infer L}`             ? [TLiteral<L>] : 
  []
export type TTemplateLiteralDslParser<T extends string> = Ensure<TTemplateLiteral<Assert<TTemplateLiteralDslParserTemplate<T>, TTemplateLiteralKind[]>>>
// --------------------------------------------------------------------------
// TTemplateLiteral
// --------------------------------------------------------------------------
// prettier-ignore
export type IsTemplateLiteralFiniteCheck<T> =
  T extends TTemplateLiteral<infer U> ? IsTemplateLiteralFiniteArray<Assert<U, TTemplateLiteralKind[]>> :    
  T extends TUnion<infer U> ? IsTemplateLiteralFiniteArray<Assert<U, TTemplateLiteralKind[]>> :    
  T extends TString ? false :
  T extends TBoolean ? false :
  T extends TNumber ? false :
  T extends TInteger ? false :
  T extends TBigInt ? false :
  T extends TLiteral ? true  : 
  false
// prettier-ignore
export type IsTemplateLiteralFiniteArray<T extends TTemplateLiteralKind[]> = 
  T extends [infer L, ...infer R] ? IsTemplateLiteralFiniteCheck<L> extends false ? false : IsTemplateLiteralFiniteArray<Assert<R, TTemplateLiteralKind[]>> :
  true
export type IsTemplateLiteralFinite<T> = T extends TTemplateLiteral<infer U> ? IsTemplateLiteralFiniteArray<U> : false
export type TTemplateLiteralKind = TUnion | TLiteral | TInteger | TTemplateLiteral | TNumber | TBigInt | TString | TBoolean | TNever
// prettier-ignore
export type TTemplateLiteralConst<T, Acc extends string> = 
  T extends TUnion<infer U> ? { [K in keyof U]: TTemplateLiteralUnion<Assert<[U[K]], TTemplateLiteralKind[]>, Acc> }[number] :
  T extends TTemplateLiteral ? `${Static<T>}` : 
  T extends TLiteral<infer U> ? `${U}` :
  T extends TString ? `${string}` : 
  T extends TNumber ? `${number}` : 
  T extends TBigInt ? `${bigint}` : 
  T extends TBoolean ? `${boolean}` :
  never
// prettier-ignore
export type TTemplateLiteralUnion<T extends TTemplateLiteralKind[], Acc extends string = ''> = 
  T extends [infer L, ...infer R] ? `${TTemplateLiteralConst<L, Acc>}${TTemplateLiteralUnion<Assert<R, TTemplateLiteralKind[]>, Acc>}` :
  Acc
export type TTemplateLiteralKeyRest<T extends TTemplateLiteral> = Assert<UnionToTuple<Static<T>>, Key[]>
export interface TTemplateLiteral<T extends TTemplateLiteralKind[] = TTemplateLiteralKind[]> extends TSchema {
  [Kind]: 'TemplateLiteral'
  static: TTemplateLiteralUnion<T>
  type: 'string'
  pattern: string // todo: it may be possible to infer this pattern
}
// --------------------------------------------------------------------------
// TTuple
// --------------------------------------------------------------------------
export type TTupleIntoArray<T extends TTuple<TSchema[]>> = T extends TTuple<infer R> ? AssertRest<R> : never
export type TTupleInfer<T extends TSchema[], P extends unknown[]> = T extends [infer L, ...infer R] ? [Static<AssertType<L>, P>, ...TTupleInfer<AssertRest<R>, P>] : []
export interface TTuple<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Tuple'
  static: TTupleInfer<T, this['params']> // { [K in keyof T]: T[K] extends TSchema ? Static<T[K], this['params']> : T[K] }
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
  type: 'undefined'
}
// --------------------------------------------------------------------------
// TUnionLiteral
// --------------------------------------------------------------------------
// prettier-ignore
export type TLiteralUnionReduce<T extends TLiteral<string | number>[]> = 
  T extends [infer L, ...infer R] ? [Assert<L, TLiteral<string | number>>['const'], ...TLiteralUnionReduce<Assert<R, TLiteral<string | number>[]>>] : 
  []
// prettier-ignore
export type TUnionLiteralKeyRest<T extends TUnion<TLiteral<string | number>[]>> = 
  T extends TUnion<infer S> ? TLiteralUnionReduce<Assert<S, TLiteral<string | number>[]>> : 
  []
// --------------------------------------------------------------------------
// TUnion
// --------------------------------------------------------------------------
// prettier-ignore
export type TUnionTemplateLiteral<T extends TTemplateLiteral, S extends string = Static<T>> = Ensure<UnionType<Assert<UnionToTuple<{[K in S]: TLiteral<K>}[S]>,TLiteral[]>>>
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
  type: 'uint8array'
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
  type: 'void'
}
// --------------------------------------------------------------------------
// Static<T>
// --------------------------------------------------------------------------
/** Infers a static type from a TypeBox type */
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
  /** Deletes a registered type */
  export function Delete(kind: string) {
    return map.delete(kind)
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
  /** Deletes a registered format */
  export function Delete(format: string) {
    return map.delete(format)
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
// ValueGuard
// --------------------------------------------------------------------------
export namespace ValueGuard {
  export function IsObject(value: unknown): value is Record<PropertyKey, unknown> {
    return typeof value === 'object' && value !== null
  }
  export function IsArray(value: unknown): value is unknown[] {
    return Array.isArray(value)
  }
  export function IsNull(value: unknown): value is null {
    return value === null
  }
  export function IsUndefined(value: unknown): value is undefined {
    return value === undefined
  }
  export function IsBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  }
  export function IsBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }
  export function IsNumber(value: unknown): value is number {
    return typeof value === 'number'
  }
  export function IsString(value: unknown): value is string {
    return typeof value === 'string'
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
  function IsPattern(value: unknown): value is string {
    try {
      new RegExp(value as string)
      return true
    } catch {
      return false
    }
  }
  function IsControlCharacterFree(value: unknown): value is string {
    if (!ValueGuard.IsString(value)) return false
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i)
      if ((code >= 7 && code <= 13) || code === 27 || code === 127) {
        return false
      }
    }
    return true
  }
  function IsAdditionalProperties(value: unknown): value is TAdditionalProperties {
    return IsOptionalBoolean(value) || TSchema(value)
  }
  function IsOptionalBigInt(value: unknown): value is bigint | undefined {
    return ValueGuard.IsUndefined(value) || ValueGuard.IsBigInt(value)
  }
  function IsOptionalNumber(value: unknown): value is number | undefined {
    return ValueGuard.IsUndefined(value) || ValueGuard.IsNumber(value)
  }
  function IsOptionalBoolean(value: unknown): value is boolean | undefined {
    return ValueGuard.IsUndefined(value) || ValueGuard.IsBoolean(value)
  }
  function IsOptionalString(value: unknown): value is string | undefined {
    return ValueGuard.IsUndefined(value) || ValueGuard.IsString(value)
  }
  function IsOptionalPattern(value: unknown): value is string | undefined {
    return ValueGuard.IsUndefined(value) || (ValueGuard.IsString(value) && IsControlCharacterFree(value) && IsPattern(value))
  }
  function IsOptionalFormat(value: unknown): value is string | undefined {
    return ValueGuard.IsUndefined(value) || (ValueGuard.IsString(value) && IsControlCharacterFree(value))
  }
  function IsOptionalSchema(value: unknown): value is boolean | undefined {
    return ValueGuard.IsUndefined(value) || TSchema(value)
  }
  /** Returns true if the given schema is TAny */
  export function TAny(schema: unknown): schema is TAny {
    // prettier-ignore
    return (
      TKindOf(schema, 'Any') &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is TArray */
  export function TArray(schema: unknown): schema is TArray {
    return (
      TKindOf(schema, 'Array') &&
      schema.type === 'array' &&
      IsOptionalString(schema.$id) &&
      TSchema(schema.items) &&
      IsOptionalSchema(schema.contains) &&
      IsOptionalNumber(schema.minContains) &&
      IsOptionalNumber(schema.maxContains) &&
      IsOptionalNumber(schema.minItems) &&
      IsOptionalNumber(schema.maxItems) &&
      IsOptionalBoolean(schema.uniqueItems)
    )
  }
  /** Returns true if the given schema is TAsyncIterator */
  export function TAsyncIterator(schema: unknown): schema is TAsyncIterator {
    // prettier-ignore
    return (
      TKindOf(schema, 'AsyncIterator') && 
      schema.type === 'AsyncIterator' &&
      IsOptionalString(schema.$id) &&
      TSchema(schema.items)
    )
  }
  /** Returns true if the given schema is TBigInt */
  export function TBigInt(schema: unknown): schema is TBigInt {
    // prettier-ignore
    return (
      TKindOf(schema, 'BigInt') && 
      schema.type === 'bigint' &&
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
      TKindOf(schema, 'Boolean') && 
      schema.type === 'boolean' && 
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is TConstructor */
  export function TConstructor(schema: unknown): schema is TConstructor {
    // prettier-ignore
    if (!(
      TKindOf(schema, 'Constructor') && 
      schema.type === 'constructor' &&
      IsOptionalString(schema.$id) && 
      ValueGuard.IsArray(schema.parameters) && 
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
      TKindOf(schema, 'Date') &&
      schema.type === 'Date' &&
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
      TKindOf(schema, 'Function') &&
      schema.type === 'function' &&
      IsOptionalString(schema.$id) && 
      ValueGuard.IsArray(schema.parameters) && 
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
      TKindOf(schema, 'Integer') &&
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
      TKindOf(schema, 'Intersect') &&
      ValueGuard.IsArray(schema.allOf) && 
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
  /** Returns true if the given schema is TIterator */
  export function TIterator(schema: unknown): schema is TIterator {
    // prettier-ignore
    return (
      TKindOf(schema, 'Iterator') &&
      schema.type === 'Iterator' &&
      IsOptionalString(schema.$id) &&
      TSchema(schema.items)
    )
  }
  /** Returns true if the given schema is a TKind with the given name. */
  export function TKindOf<T extends string>(schema: unknown, kind: T): schema is Record<PropertyKey, unknown> & { [Kind]: T } {
    return TKind(schema) && schema[Kind] === kind
  }
  /** Returns true if the given schema is TKind */
  export function TKind(schema: unknown): schema is Record<PropertyKey, unknown> & { [Kind]: string } {
    return ValueGuard.IsObject(schema) && Kind in schema && ValueGuard.IsString(schema[Kind])
  }
  /** Returns true if the given schema is TLiteral<string> */
  export function TLiteralString(schema: unknown): schema is TLiteral<string> {
    return TLiteral(schema) && ValueGuard.IsString(schema.const)
  }
  /** Returns true if the given schema is TLiteral<number> */
  export function TLiteralNumber(schema: unknown): schema is TLiteral<number> {
    return TLiteral(schema) && ValueGuard.IsNumber(schema.const)
  }
  /** Returns true if the given schema is TLiteral<boolean> */
  export function TLiteralBoolean(schema: unknown): schema is TLiteral<boolean> {
    return TLiteral(schema) && ValueGuard.IsBoolean(schema.const)
  }
  /** Returns true if the given schema is TLiteral */
  export function TLiteral(schema: unknown): schema is TLiteral {
    // prettier-ignore
    return (
      TKindOf(schema, 'Literal') &&
      IsOptionalString(schema.$id) && (
        ValueGuard.IsBoolean(schema.const) ||
        ValueGuard.IsNumber(schema.const) ||
        ValueGuard.IsString(schema.const)
      )
    )
  }
  /** Returns true if the given schema is TNever */
  export function TNever(schema: unknown): schema is TNever {
    // prettier-ignore
    return (
      TKindOf(schema, 'Never') &&
      ValueGuard.IsObject(schema.not) && 
      Object.getOwnPropertyNames(schema.not).length === 0
    )
  }
  /** Returns true if the given schema is TNot */
  export function TNot(schema: unknown): schema is TNot {
    // prettier-ignore
    return (
      TKindOf(schema, 'Not') &&
      TSchema(schema.not) 
    )
  }
  /** Returns true if the given schema is TNull */
  export function TNull(schema: unknown): schema is TNull {
    // prettier-ignore
    return (
      TKindOf(schema, 'Null') &&
      schema.type === 'null' && 
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is TNumber */
  export function TNumber(schema: unknown): schema is TNumber {
    return (
      TKindOf(schema, 'Number') &&
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
        TKindOf(schema, 'Object') &&
        schema.type === 'object' &&
        IsOptionalString(schema.$id) &&
        ValueGuard.IsObject(schema.properties) &&
        IsAdditionalProperties(schema.additionalProperties) &&
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
      TKindOf(schema, 'Promise') &&
      schema.type === 'Promise' &&
      IsOptionalString(schema.$id) && 
      TSchema(schema.item)
    )
  }
  /** Returns true if the given schema is TRecord */
  export function TRecord(schema: unknown): schema is TRecord {
    // prettier-ignore
    if (!(
      TKindOf(schema, 'Record') &&
      schema.type === 'object' && 
      IsOptionalString(schema.$id) && 
      IsAdditionalProperties(schema.additionalProperties) &&
      ValueGuard.IsObject(schema.patternProperties))
    ) {
      return false
    }
    const keys = Object.getOwnPropertyNames(schema.patternProperties)
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
  /** Returns true if the given schema is TRef */
  export function TRef(schema: unknown): schema is TRef {
    // prettier-ignore
    return (
      TKindOf(schema, 'Ref') &&
      IsOptionalString(schema.$id) && 
      ValueGuard.IsString(schema.$ref)
    )
  }
  /** Returns true if the given schema is TString */
  export function TString(schema: unknown): schema is TString {
    return (
      TKindOf(schema, 'String') && schema.type === 'string' && IsOptionalString(schema.$id) && IsOptionalNumber(schema.minLength) && IsOptionalNumber(schema.maxLength) && IsOptionalPattern(schema.pattern) && IsOptionalFormat(schema.format)
    )
  }
  /** Returns true if the given schema is TSymbol */
  export function TSymbol(schema: unknown): schema is TSymbol {
    // prettier-ignore
    return (
      TKindOf(schema, 'Symbol') &&
      schema.type === 'symbol' &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is TTemplateLiteral */
  export function TTemplateLiteral(schema: unknown): schema is TTemplateLiteral {
    // prettier-ignore
    return (
      TKindOf(schema, 'TemplateLiteral') &&
      schema.type === 'string' &&
      ValueGuard.IsString(schema.pattern) &&
      schema.pattern[0] === '^' &&
      schema.pattern[schema.pattern.length - 1] === '$'
    )
  }
  /** Returns true if the given schema is TThis */
  export function TThis(schema: unknown): schema is TThis {
    // prettier-ignore
    return (
      TKindOf(schema, 'This') &&
      IsOptionalString(schema.$id) && 
      ValueGuard.IsString(schema.$ref)
    )
  }
  /** Returns true if the given schema is TTuple */
  export function TTuple(schema: unknown): schema is TTuple {
    // prettier-ignore
    if (!(
      TKindOf(schema, 'Tuple') &&
      schema.type === 'array' && 
      IsOptionalString(schema.$id) && 
      ValueGuard.IsNumber(schema.minItems) && 
      ValueGuard.IsNumber(schema.maxItems) && 
      schema.minItems === schema.maxItems)
    ) {
      return false
    }
    if (ValueGuard.IsUndefined(schema.items) && ValueGuard.IsUndefined(schema.additionalItems) && schema.minItems === 0) {
      return true
    }
    if (!ValueGuard.IsArray(schema.items)) {
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
      TKindOf(schema, 'Undefined') &&
      schema.type === 'undefined' &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is TUnion<Literal<string | number>[]> */
  export function TUnionLiteral(schema: unknown): schema is TUnion<TLiteral[]> {
    return TUnion(schema) && schema.anyOf.every((schema) => TLiteralString(schema) || TLiteralNumber(schema))
  }
  /** Returns true if the given schema is TUnion */
  export function TUnion(schema: unknown): schema is TUnion {
    // prettier-ignore
    if (!(
      TKindOf(schema, 'Union') &&
      ValueGuard.IsArray(schema.anyOf) && 
      IsOptionalString(schema.$id))
    ) {
      return false
    }
    for (const inner of schema.anyOf) {
      if (!TSchema(inner)) return false
    }
    return true
  }
  /** Returns true if the given schema is TUint8Array */
  export function TUint8Array(schema: unknown): schema is TUint8Array {
    // prettier-ignore
    return (
      TKindOf(schema, 'Uint8Array') &&
      schema.type === 'Uint8Array' && 
      IsOptionalString(schema.$id) && 
      IsOptionalNumber(schema.minByteLength) && 
      IsOptionalNumber(schema.maxByteLength)
    )
  }
  /** Returns true if the given schema is TUnknown */
  export function TUnknown(schema: unknown): schema is TUnknown {
    // prettier-ignore
    return (
      TKindOf(schema, 'Unknown') &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given schema is a raw TUnsafe */
  export function TUnsafe(schema: unknown): schema is TUnsafe<unknown> {
    return TKindOf(schema, 'Unsafe')
  }
  /** Returns true if the given schema is TVoid */
  export function TVoid(schema: unknown): schema is TVoid {
    // prettier-ignore
    return (
      TKindOf(schema, 'Void') &&
      schema.type === 'void' &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if this schema has the Readonly modifier */
  export function TReadonly<T extends TSchema>(schema: T): schema is TReadonly<T> {
    return ValueGuard.IsObject(schema) && schema[Readonly] === 'Readonly'
  }
  /** Returns true if this schema has the Optional modifier */
  export function TOptional<T extends TSchema>(schema: T): schema is TOptional<T> {
    return ValueGuard.IsObject(schema) && schema[Optional] === 'Optional'
  }
  /** Returns true if the given schema is TSchema */
  export function TSchema(schema: unknown): schema is TSchema {
    return (
      ValueGuard.IsObject(schema) &&
      (TAny(schema) ||
        TArray(schema) ||
        TBoolean(schema) ||
        TBigInt(schema) ||
        TAsyncIterator(schema) ||
        TConstructor(schema) ||
        TDate(schema) ||
        TFunction(schema) ||
        TInteger(schema) ||
        TIntersect(schema) ||
        TIterator(schema) ||
        TLiteral(schema) ||
        TNever(schema) ||
        TNot(schema) ||
        TNull(schema) ||
        TNumber(schema) ||
        TObject(schema) ||
        TPromise(schema) ||
        TRecord(schema) ||
        TRef(schema) ||
        TString(schema) ||
        TSymbol(schema) ||
        TTemplateLiteral(schema) ||
        TThis(schema) ||
        TTuple(schema) ||
        TUndefined(schema) ||
        TUnion(schema) ||
        TUint8Array(schema) ||
        TUnknown(schema) ||
        TUnsafe(schema) ||
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
    if (schema[Kind] === 'Not') {
      return !Check(schema.not)
    }
    if (schema[Kind] === 'Intersect') {
      const intersect = schema as TIntersect
      return intersect.allOf.every((schema) => Check(schema))
    }
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
  // StructuralRight
  // --------------------------------------------------------------------------
  function IsStructuralRight(right: TSchema): boolean {
    // prettier-ignore
    return (
      TypeGuard.TNever(right) || 
      TypeGuard.TIntersect(right) || 
      TypeGuard.TUnion(right) || 
      TypeGuard.TUnknown(right) || 
      TypeGuard.TAny(right)
    )
  }
  function StructuralRight(left: TSchema, right: TSchema) {
    if (TypeGuard.TNever(right)) return TNeverRight(left, right)
    if (TypeGuard.TIntersect(right)) return TIntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return TUnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return TUnknownRight(left, right)
    if (TypeGuard.TAny(right)) return TAnyRight(left, right)
    throw Error('TypeExtends: StructuralRight')
  }
  // --------------------------------------------------------------------------
  // Any
  // --------------------------------------------------------------------------
  function TAnyRight(left: TSchema, right: TAny) {
    return TypeExtendsResult.True
  }
  function TAny(left: TAny, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return TIntersectRight(left, right)
    if (TypeGuard.TUnion(right) && right.anyOf.some((schema) => TypeGuard.TAny(schema) || TypeGuard.TUnknown(schema))) return TypeExtendsResult.True
    if (TypeGuard.TUnion(right)) return TypeExtendsResult.Union
    if (TypeGuard.TUnknown(right)) return TypeExtendsResult.True
    if (TypeGuard.TAny(right)) return TypeExtendsResult.True
    return TypeExtendsResult.Union
  }
  // --------------------------------------------------------------------------
  // Array
  // --------------------------------------------------------------------------
  function TArrayRight(left: TSchema, right: TArray) {
    if (TypeGuard.TUnknown(left)) return TypeExtendsResult.False
    if (TypeGuard.TAny(left)) return TypeExtendsResult.Union
    if (TypeGuard.TNever(left)) return TypeExtendsResult.True
    return TypeExtendsResult.False
  }
  function TArray(left: TArray, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right) && IsObjectArrayLike(right)) return TypeExtendsResult.True
    if (!TypeGuard.TArray(right)) return TypeExtendsResult.False
    return IntoBooleanResult(Visit(left.items, right.items))
  }
  // --------------------------------------------------------------------------
  // AsyncIterator
  // --------------------------------------------------------------------------
  function TAsyncIterator(left: TAsyncIterator, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (!TypeGuard.TAsyncIterator(right)) return TypeExtendsResult.False
    return IntoBooleanResult(Visit(left.items, right.items))
  }
  // --------------------------------------------------------------------------
  // BigInt
  // --------------------------------------------------------------------------
  function TBigInt(left: TBigInt, right: TSchema): TypeExtendsResult {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    return TypeGuard.TBigInt(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Boolean
  // --------------------------------------------------------------------------
  function TBooleanRight(left: TSchema, right: TBoolean) {
    if (TypeGuard.TLiteral(left) && ValueGuard.IsBoolean(left.const)) return TypeExtendsResult.True
    return TypeGuard.TBoolean(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function TBoolean(left: TBoolean, right: TSchema): TypeExtendsResult {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    return TypeGuard.TBoolean(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Constructor
  // --------------------------------------------------------------------------
  function TConstructor(left: TConstructor, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
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
  function TDate(left: TDate, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    return TypeGuard.TDate(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Function
  // --------------------------------------------------------------------------
  function TFunction(left: TFunction, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
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
  function TIntegerRight(left: TSchema, right: TInteger) {
    if (TypeGuard.TLiteral(left) && ValueGuard.IsNumber(left.const)) return TypeExtendsResult.True
    return TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function TInteger(left: TInteger, right: TSchema): TypeExtendsResult {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    return TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Intersect
  // --------------------------------------------------------------------------
  function TIntersectRight(left: TSchema, right: TIntersect): TypeExtendsResult {
    return right.allOf.every((schema) => Visit(left, schema) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function TIntersect(left: TIntersect, right: TSchema) {
    return left.allOf.some((schema) => Visit(schema, right) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Iterator
  // --------------------------------------------------------------------------
  function TIterator(left: TIterator, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (!TypeGuard.TIterator(right)) return TypeExtendsResult.False
    return IntoBooleanResult(Visit(left.items, right.items))
  }
  // --------------------------------------------------------------------------
  // Literal
  // --------------------------------------------------------------------------
  function TLiteral(left: TLiteral, right: TSchema): TypeExtendsResult {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    if (TypeGuard.TString(right)) return TStringRight(left, right)
    if (TypeGuard.TNumber(right)) return TNumberRight(left, right)
    if (TypeGuard.TInteger(right)) return TIntegerRight(left, right)
    if (TypeGuard.TBoolean(right)) return TBooleanRight(left, right)
    return TypeGuard.TLiteral(right) && right.const === left.const ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Never
  // --------------------------------------------------------------------------
  function TNeverRight(left: TSchema, right: TNever) {
    return TypeExtendsResult.False
  }
  function TNever(left: TNever, right: TSchema) {
    return TypeExtendsResult.True
  }
  // --------------------------------------------------------------------------
  // Not
  // --------------------------------------------------------------------------
  function UnwrapTNot<T extends TNot>(schema: T): TUnknown | TNot['not'] {
    let [current, depth]: [TSchema, number] = [schema, 0]
    while (true) {
      if (!TypeGuard.TNot(current)) break
      current = current.not
      depth += 1
    }
    return depth % 2 === 0 ? current : Type.Unknown()
  }
  function TNot(left: TSchema, right: TSchema) {
    // TypeScript has no concept of negated types, and attempts to correctly check the negated
    // type at runtime would put TypeBox at odds with TypeScripts ability to statically infer
    // the type. Instead we unwrap to either unknown or T and continue evaluating.
    if (TypeGuard.TNot(left)) return Visit(UnwrapTNot(left), right)
    if (TypeGuard.TNot(right)) return Visit(left, UnwrapTNot(right))
    throw new Error(`TypeExtends: Invalid fallthrough for Not`)
  }
  // --------------------------------------------------------------------------
  // Null
  // --------------------------------------------------------------------------
  function TNull(left: TNull, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    return TypeGuard.TNull(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Number
  // --------------------------------------------------------------------------
  function TNumberRight(left: TSchema, right: TNumber) {
    if (TypeGuard.TLiteralNumber(left)) return TypeExtendsResult.True
    return TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function TNumber(left: TNumber, right: TSchema): TypeExtendsResult {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    return TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Object
  // --------------------------------------------------------------------------
  function IsObjectPropertyCount(schema: TObject, count: number) {
    return Object.getOwnPropertyNames(schema.properties).length === count
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
  function TObjectRight(left: TSchema, right: TObject) {
    if (TypeGuard.TUnknown(left)) return TypeExtendsResult.False
    if (TypeGuard.TAny(left)) return TypeExtendsResult.Union
    if (TypeGuard.TNever(left)) return TypeExtendsResult.True
    if (TypeGuard.TLiteralString(left) && IsObjectStringLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TLiteralNumber(left) && IsObjectNumberLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TLiteralBoolean(left) && IsObjectBooleanLike(right)) return TypeExtendsResult.True
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
  function TObject(left: TObject, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    if (!TypeGuard.TObject(right)) return TypeExtendsResult.False
    for (const key of Object.getOwnPropertyNames(right.properties)) {
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
  function TPromise(left: TPromise, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right) && IsObjectPromiseLike(right)) return TypeExtendsResult.True
    if (!TypeGuard.TPromise(right)) return TypeExtendsResult.False
    return IntoBooleanResult(Visit(left.item, right.item))
  }
  // --------------------------------------------------------------------------
  // Record
  // --------------------------------------------------------------------------
  function RecordKey(schema: TRecord) {
    if (PatternNumberExact in schema.patternProperties) return Type.Number()
    if (PatternStringExact in schema.patternProperties) return Type.String()
    throw Error('TypeExtends: Cannot get record key')
  }
  function RecordValue(schema: TRecord) {
    if (PatternNumberExact in schema.patternProperties) return schema.patternProperties[PatternNumberExact]
    if (PatternStringExact in schema.patternProperties) return schema.patternProperties[PatternStringExact]
    throw Error('TypeExtends: Cannot get record value')
  }
  function TRecordRight(left: TSchema, right: TRecord) {
    const Key = RecordKey(right)
    const Value = RecordValue(right)
    if (TypeGuard.TLiteralString(left) && TypeGuard.TNumber(Key) && IntoBooleanResult(Visit(left, Value)) === TypeExtendsResult.True) return TypeExtendsResult.True
    if (TypeGuard.TUint8Array(left) && TypeGuard.TNumber(Key)) return Visit(left, Value)
    if (TypeGuard.TString(left) && TypeGuard.TNumber(Key)) return Visit(left, Value)
    if (TypeGuard.TArray(left) && TypeGuard.TNumber(Key)) return Visit(left, Value)
    if (TypeGuard.TObject(left)) {
      for (const key of Object.getOwnPropertyNames(left.properties)) {
        if (Property(Value, left.properties[key]) === TypeExtendsResult.False) {
          return TypeExtendsResult.False
        }
      }
      return TypeExtendsResult.True
    }
    return TypeExtendsResult.False
  }
  function TRecord(left: TRecord, right: TSchema) {
    const Value = RecordValue(left)
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (!TypeGuard.TRecord(right)) return TypeExtendsResult.False
    return Visit(Value, RecordValue(right))
  }
  // --------------------------------------------------------------------------
  // String
  // --------------------------------------------------------------------------
  function TStringRight(left: TSchema, right: TString) {
    if (TypeGuard.TLiteral(left) && ValueGuard.IsString(left.const)) return TypeExtendsResult.True
    return TypeGuard.TString(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function TString(left: TString, right: TSchema): TypeExtendsResult {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    return TypeGuard.TString(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Symbol
  // --------------------------------------------------------------------------
  function TSymbol(left: TSymbol, right: TSchema): TypeExtendsResult {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    return TypeGuard.TSymbol(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // TemplateLiteral
  // --------------------------------------------------------------------------
  function TTemplateLiteral(left: TSchema, right: TSchema) {
    // TemplateLiteral types are resolved to either unions for finite expressions or string
    // for infinite expressions. Here we call to TemplateLiteralResolver to resolve for
    // either type and continue evaluating.
    if (TypeGuard.TTemplateLiteral(left)) return Visit(TemplateLiteralResolver.Resolve(left), right)
    if (TypeGuard.TTemplateLiteral(right)) return Visit(left, TemplateLiteralResolver.Resolve(right))
    throw new Error(`TypeExtends: Invalid fallthrough for TemplateLiteral`)
  }
  // --------------------------------------------------------------------------
  // Tuple
  // --------------------------------------------------------------------------
  function IsArrayOfTuple(left: TTuple, right: TSchema) {
    // prettier-ignore
    return (
      TypeGuard.TArray(right) && 
      left.items !== undefined && 
      left.items.every((schema) => Visit(schema, right.items) === TypeExtendsResult.True)
    )
  }
  function TTupleRight(left: TSchema, right: TTuple) {
    if (TypeGuard.TNever(left)) return TypeExtendsResult.True
    if (TypeGuard.TUnknown(left)) return TypeExtendsResult.False
    if (TypeGuard.TAny(left)) return TypeExtendsResult.Union
    return TypeExtendsResult.False
  }
  function TTuple(left: TTuple, right: TSchema): TypeExtendsResult {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right) && IsObjectArrayLike(right)) return TypeExtendsResult.True
    if (TypeGuard.TArray(right) && IsArrayOfTuple(left, right)) return TypeExtendsResult.True
    if (!TypeGuard.TTuple(right)) return TypeExtendsResult.False
    if ((ValueGuard.IsUndefined(left.items) && !ValueGuard.IsUndefined(right.items)) || (!ValueGuard.IsUndefined(left.items) && ValueGuard.IsUndefined(right.items))) return TypeExtendsResult.False
    if (ValueGuard.IsUndefined(left.items) && !ValueGuard.IsUndefined(right.items)) return TypeExtendsResult.True
    return left.items!.every((schema, index) => Visit(schema, right.items![index]) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Uint8Array
  // --------------------------------------------------------------------------
  function TUint8Array(left: TUint8Array, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    return TypeGuard.TUint8Array(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Undefined
  // --------------------------------------------------------------------------
  function TUndefined(left: TUndefined, right: TSchema) {
    if (IsStructuralRight(right)) return StructuralRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    if (TypeGuard.TRecord(right)) return TRecordRight(left, right)
    if (TypeGuard.TVoid(right)) return VoidRight(left, right)
    return TypeGuard.TUndefined(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Union
  // --------------------------------------------------------------------------
  function TUnionRight(left: TSchema, right: TUnion): TypeExtendsResult {
    return right.anyOf.some((schema) => Visit(left, schema) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function TUnion(left: TUnion, right: TSchema): TypeExtendsResult {
    return left.anyOf.every((schema) => Visit(schema, right) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Unknown
  // --------------------------------------------------------------------------
  function TUnknownRight(left: TSchema, right: TUnknown) {
    return TypeExtendsResult.True
  }
  function TUnknown(left: TUnknown, right: TSchema) {
    if (TypeGuard.TNever(right)) return TNeverRight(left, right)
    if (TypeGuard.TIntersect(right)) return TIntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return TUnionRight(left, right)
    if (TypeGuard.TAny(right)) return TAnyRight(left, right)
    if (TypeGuard.TString(right)) return TStringRight(left, right)
    if (TypeGuard.TNumber(right)) return TNumberRight(left, right)
    if (TypeGuard.TInteger(right)) return TIntegerRight(left, right)
    if (TypeGuard.TBoolean(right)) return TBooleanRight(left, right)
    if (TypeGuard.TArray(right)) return TArrayRight(left, right)
    if (TypeGuard.TTuple(right)) return TTupleRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    return TypeGuard.TUnknown(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Void
  // --------------------------------------------------------------------------
  function VoidRight(left: TSchema, right: TVoid) {
    if (TypeGuard.TUndefined(left)) return TypeExtendsResult.True
    return TypeGuard.TUndefined(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function TVoid(left: TVoid, right: TSchema) {
    if (TypeGuard.TIntersect(right)) return TIntersectRight(left, right)
    if (TypeGuard.TUnion(right)) return TUnionRight(left, right)
    if (TypeGuard.TUnknown(right)) return TUnknownRight(left, right)
    if (TypeGuard.TAny(right)) return TAnyRight(left, right)
    if (TypeGuard.TObject(right)) return TObjectRight(left, right)
    return TypeGuard.TVoid(right) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function Visit(left: TSchema, right: TSchema): TypeExtendsResult {
    // Resolvable Types
    if (TypeGuard.TTemplateLiteral(left) || TypeGuard.TTemplateLiteral(right)) return TTemplateLiteral(left, right)
    if (TypeGuard.TNot(left) || TypeGuard.TNot(right)) return TNot(left, right)
    // Standard Types
    if (TypeGuard.TAny(left)) return TAny(left, right)
    if (TypeGuard.TArray(left)) return TArray(left, right)
    if (TypeGuard.TBigInt(left)) return TBigInt(left, right)
    if (TypeGuard.TBoolean(left)) return TBoolean(left, right)
    if (TypeGuard.TAsyncIterator(left)) return TAsyncIterator(left, right)
    if (TypeGuard.TConstructor(left)) return TConstructor(left, right)
    if (TypeGuard.TDate(left)) return TDate(left, right)
    if (TypeGuard.TFunction(left)) return TFunction(left, right)
    if (TypeGuard.TInteger(left)) return TInteger(left, right)
    if (TypeGuard.TIntersect(left)) return TIntersect(left, right)
    if (TypeGuard.TIterator(left)) return TIterator(left, right)
    if (TypeGuard.TLiteral(left)) return TLiteral(left, right)
    if (TypeGuard.TNever(left)) return TNever(left, right)
    if (TypeGuard.TNull(left)) return TNull(left, right)
    if (TypeGuard.TNumber(left)) return TNumber(left, right)
    if (TypeGuard.TObject(left)) return TObject(left, right)
    if (TypeGuard.TRecord(left)) return TRecord(left, right)
    if (TypeGuard.TString(left)) return TString(left, right)
    if (TypeGuard.TSymbol(left)) return TSymbol(left, right)
    if (TypeGuard.TTuple(left)) return TTuple(left, right)
    if (TypeGuard.TPromise(left)) return TPromise(left, right)
    if (TypeGuard.TUint8Array(left)) return TUint8Array(left, right)
    if (TypeGuard.TUndefined(left)) return TUndefined(left, right)
    if (TypeGuard.TUnion(left)) return TUnion(left, right)
    if (TypeGuard.TUnknown(left)) return TUnknown(left, right)
    if (TypeGuard.TVoid(left)) return TVoid(left, right)
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
  function ObjectType(value: Record<keyof any, unknown>) {
    const clonedProperties = Object.getOwnPropertyNames(value).reduce((acc, key) => ({ ...acc, [key]: Visit(value[key]) }), {})
    const clonedSymbols = Object.getOwnPropertySymbols(value).reduce((acc, key) => ({ ...acc, [key]: Visit(value[key as any]) }), {})
    return { ...clonedProperties, ...clonedSymbols }
  }
  function ArrayType(value: unknown[]) {
    return (value as any).map((value: unknown) => Visit(value as any))
  }
  function Visit(value: unknown): any {
    if (ValueGuard.IsArray(value)) return ArrayType(value)
    if (ValueGuard.IsObject(value)) return ObjectType(value)
    return value
  }
  /** Clones a type. */
  export function Clone<T extends TSchema>(schema: T, options: SchemaOptions): T {
    return { ...Visit(schema), ...options }
  }
}
// --------------------------------------------------------------------------
// IndexedAccessor
// --------------------------------------------------------------------------
export namespace IndexedAccessor {
  function OptionalUnwrap(schema: TSchema[]): TSchema[] {
    return schema.map((schema) => {
      const { [Optional]: _, ...clone } = TypeClone.Clone(schema, {})
      return clone
    })
  }
  function IsIntersectOptional(schema: TSchema[]): boolean {
    return schema.every((schema) => TypeGuard.TOptional(schema))
  }
  function IsUnionOptional(schema: TSchema[]): boolean {
    return schema.some((schema) => TypeGuard.TOptional(schema))
  }
  function ResolveIntersect(schema: TIntersect): TSchema {
    const optional = IsIntersectOptional(schema.allOf)
    return optional ? Type.Optional(Type.Intersect(OptionalUnwrap(schema.allOf))) : schema
  }
  function ResolveUnion(schema: TUnion): TSchema {
    const optional = IsUnionOptional(schema.anyOf)
    return optional ? Type.Optional(Type.Union(OptionalUnwrap(schema.anyOf))) : schema
  }
  function ResolveOptional(schema: TSchema) {
    if (schema[Kind] === 'Intersect') return ResolveIntersect(schema as TIntersect)
    if (schema[Kind] === 'Union') return ResolveUnion(schema as TUnion)
    return schema
  }
  function TIntersect(schema: TIntersect, key: string): TSchema {
    const resolved = schema.allOf.reduce((acc, schema) => {
      const indexed = Visit(schema, key)
      return indexed[Kind] === 'Never' ? acc : [...acc, indexed]
    }, [] as TSchema[])
    return ResolveOptional(Type.Intersect(resolved))
  }
  function TUnion(schema: TUnion, key: string): TSchema {
    const resolved = schema.anyOf.map((schema) => Visit(schema, key))
    return ResolveOptional(Type.Union(resolved))
  }
  function TObject(schema: TObject, key: string): TSchema {
    const property = schema.properties[key]
    return ValueGuard.IsUndefined(property) ? Type.Never() : Type.Union([property])
  }
  function TTuple(schema: TTuple, key: string): TSchema {
    const items = schema.items
    if (ValueGuard.IsUndefined(items)) return Type.Never()
    const element = items[key as any as number] //
    if (ValueGuard.IsUndefined(element)) return Type.Never()
    return element
  }
  function Visit(schema: TSchema, key: string): TSchema {
    if (schema[Kind] === 'Intersect') return TIntersect(schema as TIntersect, key)
    if (schema[Kind] === 'Union') return TUnion(schema as TUnion, key)
    if (schema[Kind] === 'Object') return TObject(schema as TObject, key)
    if (schema[Kind] === 'Tuple') return TTuple(schema as TTuple, key)
    return Type.Never()
  }
  export function Resolve(schema: TSchema, keys: Key[], options: SchemaOptions = {}): TSchema {
    const resolved = keys.map((key) => Visit(schema, key.toString()))
    return ResolveOptional(Type.Union(resolved, options))
  }
}
// --------------------------------------------------------------------------
// ObjectMap
// --------------------------------------------------------------------------
export namespace ObjectMap {
  function TIntersect(schema: TIntersect, callback: (object: TObject) => TObject) {
    // prettier-ignore
    return Type.Intersect(schema.allOf.map((inner) => Visit(inner, callback)), { ...schema })
  }
  function TUnion(schema: TUnion, callback: (object: TObject) => TObject) {
    // prettier-ignore
    return Type.Union(schema.anyOf.map((inner) => Visit(inner, callback)), { ...schema })
  }
  function TObject(schema: TObject, callback: (object: TObject) => TObject) {
    return callback(schema)
  }
  function Visit(schema: TSchema, callback: (object: TObject) => TObject): TSchema {
    // There are cases where users need to map objects with unregistered kinds. Using a TypeGuard here would
    // prevent sub schema mapping as unregistered kinds will not pass TSchema checks. This is notable in the
    // case of TObject where unregistered property kinds cause the TObject check to fail. As mapping is only
    // used for composition, we use explicit checks instead.
    if (schema[Kind] === 'Intersect') return TIntersect(schema as TIntersect, callback)
    if (schema[Kind] === 'Union') return TUnion(schema as TUnion, callback)
    if (schema[Kind] === 'Object') return TObject(schema as TObject, callback)
    return schema
  }
  export function Map<T = TSchema>(schema: TSchema, callback: (object: TObject) => TObject, options: SchemaOptions): T {
    return { ...Visit(TypeClone.Clone(schema, {}), callback), ...options } as unknown as T
  }
}
// --------------------------------------------------------------------------
// KeyResolver
// --------------------------------------------------------------------------
export interface KeyResolverOptions {
  includePatterns: boolean
}
export namespace KeyResolver {
  function UnwrapPattern(key: string) {
    return key[0] === '^' && key[key.length - 1] === '$' ? key.slice(1, key.length - 1) : key
  }
  function TIntersect(schema: TIntersect, options: KeyResolverOptions): string[] {
    return schema.allOf.reduce((acc, schema) => [...acc, ...Visit(schema, options)], [] as string[])
  }
  function TUnion(schema: TUnion, options: KeyResolverOptions): string[] {
    const sets = schema.anyOf.map((inner) => Visit(inner, options))
    return [...sets.reduce((set, outer) => outer.map((key) => (sets.every((inner) => inner.includes(key)) ? set.add(key) : set))[0], new Set<string>())]
  }
  function TObject(schema: TObject, options: KeyResolverOptions): string[] {
    return Object.getOwnPropertyNames(schema.properties)
  }
  function TRecord(schema: TRecord, options: KeyResolverOptions): string[] {
    return options.includePatterns ? Object.getOwnPropertyNames(schema.patternProperties) : []
  }
  function Visit(schema: TSchema, options: KeyResolverOptions): string[] {
    if (TypeGuard.TIntersect(schema)) return TIntersect(schema, options)
    if (TypeGuard.TUnion(schema)) return TUnion(schema, options)
    if (TypeGuard.TObject(schema)) return TObject(schema, options)
    if (TypeGuard.TRecord(schema)) return TRecord(schema, options)
    return []
  }
  /** Resolves an array of keys in this schema */
  export function ResolveKeys(schema: TSchema, options: KeyResolverOptions): string[] {
    return [...new Set(Visit(schema, options))]
  }
  /** Resolves a regular expression pattern matching all keys in this schema */
  export function ResolvePattern(schema: TSchema): string {
    const keys = ResolveKeys(schema, { includePatterns: true })
    const pattern = keys.map((key) => `(${UnwrapPattern(key)})`)
    return `^(${pattern.join('|')})$`
  }
}
// --------------------------------------------------------------------------
// KeyArrayResolver
// --------------------------------------------------------------------------
export namespace KeyArrayResolver {
  /** Resolves an array of string[] keys from the given schema or array type. */
  export function Resolve(schema: TSchema | string[]): string[] {
    if (Array.isArray(schema)) return schema
    if (TypeGuard.TUnionLiteral(schema)) return schema.anyOf.map((schema) => schema.const.toString())
    if (TypeGuard.TLiteral(schema)) return [schema.const as string]
    if (TypeGuard.TTemplateLiteral(schema)) {
      const expression = TemplateLiteralParser.ParseExact(schema.pattern)
      if (!TemplateLiteralFinite.Check(expression)) throw Error('KeyArrayResolver: Cannot resolve keys from infinite template expression')
      return [...TemplateLiteralGenerator.Generate(expression)]
    }
    return []
  }
}
// --------------------------------------------------------------------------
// UnionResolver
// --------------------------------------------------------------------------
export namespace UnionResolver {
  function* TUnion(union: TUnion): IterableIterator<TSchema> {
    for (const schema of union.anyOf) {
      if (schema[Kind] === 'Union') {
        yield* TUnion(schema as TUnion)
      } else {
        yield schema
      }
    }
  }
  /** Returns a resolved union with interior unions flattened */
  export function Resolve(union: TUnion): TUnion {
    return Type.Union([...TUnion(union)], { ...union })
  }
}
// --------------------------------------------------------------------------
// TemplateLiteralPattern
// --------------------------------------------------------------------------
export namespace TemplateLiteralPattern {
  function Escape(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  function Visit(schema: TSchema, acc: string): string {
    if (TypeGuard.TTemplateLiteral(schema)) {
      return schema.pattern.slice(1, schema.pattern.length - 1)
    } else if (TypeGuard.TUnion(schema)) {
      return `(${schema.anyOf.map((schema) => Visit(schema, acc)).join('|')})`
    } else if (TypeGuard.TNumber(schema)) {
      return `${acc}${PatternNumber}`
    } else if (TypeGuard.TInteger(schema)) {
      return `${acc}${PatternNumber}`
    } else if (TypeGuard.TBigInt(schema)) {
      return `${acc}${PatternNumber}`
    } else if (TypeGuard.TString(schema)) {
      return `${acc}${PatternString}`
    } else if (TypeGuard.TLiteral(schema)) {
      return `${acc}${Escape(schema.const.toString())}`
    } else if (TypeGuard.TBoolean(schema)) {
      return `${acc}${PatternBoolean}`
    } else if (TypeGuard.TNever(schema)) {
      throw Error('TemplateLiteralPattern: TemplateLiteral cannot operate on types of TNever')
    } else {
      throw Error(`TemplateLiteralPattern: Unexpected Kind '${schema[Kind]}'`)
    }
  }
  export function Create(kinds: TTemplateLiteralKind[]): string {
    return `^${kinds.map((schema) => Visit(schema, '')).join('')}\$`
  }
}
// --------------------------------------------------------------------------------------
// TemplateLiteralResolver
// --------------------------------------------------------------------------------------
export namespace TemplateLiteralResolver {
  /** Resolves a template literal as a TUnion */
  export function Resolve(template: TTemplateLiteral): TString | TUnion | TLiteral {
    const expression = TemplateLiteralParser.ParseExact(template.pattern)
    if (!TemplateLiteralFinite.Check(expression)) return Type.String()
    const literals = [...TemplateLiteralGenerator.Generate(expression)].map((value) => Type.Literal(value))
    return Type.Union(literals)
  }
}
// --------------------------------------------------------------------------------------
// TemplateLiteralParser
// --------------------------------------------------------------------------------------
export class TemplateLiteralParserError extends Error {
  constructor(message: string) {
    super(message)
  }
}
export namespace TemplateLiteralParser {
  export type Expression = And | Or | Const
  export type Const = { type: 'const'; const: string }
  export type And = { type: 'and'; expr: Expression[] }
  export type Or = { type: 'or'; expr: Expression[] }
  function IsNonEscaped(pattern: string, index: number, char: string) {
    return pattern[index] === char && pattern.charCodeAt(index - 1) !== 92
  }
  function IsOpenParen(pattern: string, index: number) {
    return IsNonEscaped(pattern, index, '(')
  }
  function IsCloseParen(pattern: string, index: number) {
    return IsNonEscaped(pattern, index, ')')
  }
  function IsSeparator(pattern: string, index: number) {
    return IsNonEscaped(pattern, index, '|')
  }
  function IsGroup(pattern: string) {
    if (!(IsOpenParen(pattern, 0) && IsCloseParen(pattern, pattern.length - 1))) return false
    let count = 0
    for (let index = 0; index < pattern.length; index++) {
      if (IsOpenParen(pattern, index)) count += 1
      if (IsCloseParen(pattern, index)) count -= 1
      if (count === 0 && index !== pattern.length - 1) return false
    }
    return true
  }
  function InGroup(pattern: string) {
    return pattern.slice(1, pattern.length - 1)
  }
  function IsPrecedenceOr(pattern: string) {
    let count = 0
    for (let index = 0; index < pattern.length; index++) {
      if (IsOpenParen(pattern, index)) count += 1
      if (IsCloseParen(pattern, index)) count -= 1
      if (IsSeparator(pattern, index) && count === 0) return true
    }
    return false
  }
  function IsPrecedenceAnd(pattern: string) {
    for (let index = 0; index < pattern.length; index++) {
      if (IsOpenParen(pattern, index)) return true
    }
    return false
  }
  function Or(pattern: string): Expression {
    let [count, start] = [0, 0]
    const expressions: Expression[] = []
    for (let index = 0; index < pattern.length; index++) {
      if (IsOpenParen(pattern, index)) count += 1
      if (IsCloseParen(pattern, index)) count -= 1
      if (IsSeparator(pattern, index) && count === 0) {
        const range = pattern.slice(start, index)
        if (range.length > 0) expressions.push(Parse(range))
        start = index + 1
      }
    }
    const range = pattern.slice(start)
    if (range.length > 0) expressions.push(Parse(range))
    if (expressions.length === 0) return { type: 'const', const: '' }
    if (expressions.length === 1) return expressions[0]
    return { type: 'or', expr: expressions }
  }
  function And(pattern: string): Expression {
    function Group(value: string, index: number): [number, number] {
      if (!IsOpenParen(value, index)) throw new TemplateLiteralParserError(`TemplateLiteralParser: Index must point to open parens`)
      let count = 0
      for (let scan = index; scan < value.length; scan++) {
        if (IsOpenParen(value, scan)) count += 1
        if (IsCloseParen(value, scan)) count -= 1
        if (count === 0) return [index, scan]
      }
      throw new TemplateLiteralParserError(`TemplateLiteralParser: Unclosed group parens in expression`)
    }
    function Range(pattern: string, index: number): [number, number] {
      for (let scan = index; scan < pattern.length; scan++) {
        if (IsOpenParen(pattern, scan)) return [index, scan]
      }
      return [index, pattern.length]
    }
    const expressions: Expression[] = []
    for (let index = 0; index < pattern.length; index++) {
      if (IsOpenParen(pattern, index)) {
        const [start, end] = Group(pattern, index)
        const range = pattern.slice(start, end + 1)
        expressions.push(Parse(range))
        index = end
      } else {
        const [start, end] = Range(pattern, index)
        const range = pattern.slice(start, end)
        if (range.length > 0) expressions.push(Parse(range))
        index = end - 1
      }
    }
    if (expressions.length === 0) return { type: 'const', const: '' }
    if (expressions.length === 1) return expressions[0]
    return { type: 'and', expr: expressions }
  }
  /** Parses a pattern and returns an expression tree */
  export function Parse(pattern: string): Expression {
    if (IsGroup(pattern)) return Parse(InGroup(pattern))
    if (IsPrecedenceOr(pattern)) return Or(pattern)
    if (IsPrecedenceAnd(pattern)) return And(pattern)
    return { type: 'const', const: pattern }
  }
  /** Parses a pattern and strips forward and trailing ^ and $ */
  export function ParseExact(pattern: string): Expression {
    return Parse(pattern.slice(1, pattern.length - 1))
  }
}
// --------------------------------------------------------------------------------------
// TemplateLiteralFinite
// --------------------------------------------------------------------------------------
export namespace TemplateLiteralFinite {
  function IsNumber(expression: TemplateLiteralParser.Expression): boolean {
    // prettier-ignore
    return (
      expression.type === 'or' && 
      expression.expr.length === 2 && 
      expression.expr[0].type === 'const' && 
      expression.expr[0].const === '0' && 
      expression.expr[1].type === 'const' && 
      expression.expr[1].const === '[1-9][0-9]*'
    )
  }
  function IsBoolean(expression: TemplateLiteralParser.Expression): boolean {
    // prettier-ignore
    return (
      expression.type === 'or' && 
      expression.expr.length === 2 && 
      expression.expr[0].type === 'const' && 
      expression.expr[0].const === 'true' && 
      expression.expr[1].type === 'const' && 
      expression.expr[1].const === 'false'
    )
  }
  function IsString(expression: TemplateLiteralParser.Expression) {
    return expression.type === 'const' && expression.const === '.*'
  }
  export function Check(expression: TemplateLiteralParser.Expression): boolean {
    if (IsBoolean(expression)) return true
    if (IsNumber(expression) || IsString(expression)) return false
    if (expression.type === 'and') return expression.expr.every((expr) => Check(expr))
    if (expression.type === 'or') return expression.expr.every((expr) => Check(expr))
    if (expression.type === 'const') return true
    throw Error(`TemplateLiteralFinite: Unknown expression type`)
  }
}
// --------------------------------------------------------------------------------------
// TemplateLiteralGenerator
// --------------------------------------------------------------------------------------
export namespace TemplateLiteralGenerator {
  function* Reduce(buffer: string[][]): IterableIterator<string> {
    if (buffer.length === 1) return yield* buffer[0]
    for (const left of buffer[0]) {
      for (const right of Reduce(buffer.slice(1))) {
        yield `${left}${right}`
      }
    }
  }
  function* And(expression: TemplateLiteralParser.And): IterableIterator<string> {
    return yield* Reduce(expression.expr.map((expr) => [...Generate(expr)]))
  }
  function* Or(expression: TemplateLiteralParser.Or): IterableIterator<string> {
    for (const expr of expression.expr) yield* Generate(expr)
  }
  function* Const(expression: TemplateLiteralParser.Const): IterableIterator<string> {
    return yield expression.const
  }
  export function* Generate(expression: TemplateLiteralParser.Expression): IterableIterator<string> {
    if (expression.type === 'and') return yield* And(expression)
    if (expression.type === 'or') return yield* Or(expression)
    if (expression.type === 'const') return yield* Const(expression)
    throw Error('TemplateLiteralGenerator: Unknown expression')
  }
}
// ---------------------------------------------------------------------
// TemplateLiteralDslParser
// ---------------------------------------------------------------------
export namespace TemplateLiteralDslParser {
  function* ParseUnion(template: string): IterableIterator<TTemplateLiteralKind> {
    const trim = template.trim().replace(/"|'/g, '')
    if (trim === 'boolean') return yield Type.Boolean()
    if (trim === 'number') return yield Type.Number()
    if (trim === 'bigint') return yield Type.BigInt()
    if (trim === 'string') return yield Type.String()
    const literals = trim.split('|').map((literal) => Type.Literal(literal.trim()))
    return yield literals.length === 0 ? Type.Never() : literals.length === 1 ? literals[0] : Type.Union(literals)
  }
  function* ParseTerminal(template: string): IterableIterator<TTemplateLiteralKind> {
    if (template[1] !== '{') {
      const L = Type.Literal('$')
      const R = ParseLiteral(template.slice(1))
      return yield* [L, ...R]
    }
    for (let i = 2; i < template.length; i++) {
      if (template[i] === '}') {
        const L = ParseUnion(template.slice(2, i))
        const R = ParseLiteral(template.slice(i + 1))
        return yield* [...L, ...R]
      }
    }
    yield Type.Literal(template)
  }
  function* ParseLiteral(template: string): IterableIterator<TTemplateLiteralKind> {
    for (let i = 0; i < template.length; i++) {
      if (template[i] === '$') {
        const L = Type.Literal(template.slice(0, i))
        const R = ParseTerminal(template.slice(i))
        return yield* [L, ...R]
      }
    }
    yield Type.Literal(template)
  }
  export function Parse(template_dsl: string): TTemplateLiteralKind[] {
    return [...ParseLiteral(template_dsl)]
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
  /** `[Utility]` Discards a property key from the given schema */
  protected Discard(schema: TSchema, key: PropertyKey): TSchema {
    const { [key as any]: _, ...rest } = schema
    return rest as TSchema
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
  /** `[Standard]` Creates a Readonly and Optional property */
  public ReadonlyOptional<T extends TSchema>(schema: T): TReadonly<TOptional<T>> {
    return this.Readonly(this.Optional(schema))
  }
  /** `[Standard]` Creates a Readonly property */
  public Readonly<T extends TSchema>(schema: T): TReadonly<T> {
    return { ...TypeClone.Clone(schema, {}), [Readonly]: 'Readonly' }
  }
  /** `[Standard]` Creates an Optional property */
  public Optional<T extends TSchema>(schema: T): TOptional<T> {
    return { ...TypeClone.Clone(schema, {}), [Optional]: 'Optional' }
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
  /** `[Standard]` Creates a Composite object type. */
  public Composite<T extends TObject[]>(objects: [...T], options?: ObjectOptions): TComposite<T> {
    const intersect: any = Type.Intersect(objects, {})
    const keys = KeyResolver.ResolveKeys(intersect, { includePatterns: false })
    const properties = keys.reduce((acc, key) => ({ ...acc, [key]: Type.Index(intersect, [key]) }), {} as TProperties)
    return Type.Object(properties, options) as TComposite<T>
  }
  /** `[Standard]` Creates a Enum type */
  public Enum<T extends Record<string, string | number>>(item: T, options: SchemaOptions = {}): TEnum<T> {
    // prettier-ignore
    const values = Object.getOwnPropertyNames(item).filter((key) => isNaN(key as any)).map((key) => item[key]) as T[keyof T][]
    const anyOf = values.map((value) => (ValueGuard.IsString(value) ? { [Kind]: 'Literal', type: 'string' as const, const: value } : { [Kind]: 'Literal', type: 'number' as const, const: value }))
    return this.Create({ ...options, [Kind]: 'Union', anyOf })
  }
  /** `[Standard]` A conditional type expression that will return the true type if the left type extends the right */
  public Extends<L extends TSchema, R extends TSchema, T extends TSchema, U extends TSchema>(left: L, right: R, trueType: T, falseType: U, options: SchemaOptions = {}): TExtends<L, R, T, U> {
    switch (TypeExtends.Extends(left, right)) {
      case TypeExtendsResult.Union:
        return this.Union([TypeClone.Clone(trueType, options), TypeClone.Clone(falseType, options)]) as any as TExtends<L, R, T, U>
      case TypeExtendsResult.True:
        return TypeClone.Clone(trueType, options) as unknown as TExtends<L, R, T, U>
      case TypeExtendsResult.False:
        return TypeClone.Clone(falseType, options) as unknown as TExtends<L, R, T, U>
    }
  }
  /** `[Standard]` Excludes from the left type any type that is not assignable to the right */
  public Exclude<L extends TSchema, R extends TSchema>(left: L, right: R, options: SchemaOptions = {}): TExclude<L, R> {
    if (TypeGuard.TTemplateLiteral(left)) return this.Exclude(TemplateLiteralResolver.Resolve(left), right, options) as TExclude<L, R>
    if (TypeGuard.TTemplateLiteral(right)) return this.Exclude(left, TemplateLiteralResolver.Resolve(right), options) as any as TExclude<L, R>
    if (TypeGuard.TUnion(left)) {
      const narrowed = left.anyOf.filter((inner) => TypeExtends.Extends(inner, right) === TypeExtendsResult.False)
      return (narrowed.length === 1 ? TypeClone.Clone(narrowed[0], options) : this.Union(narrowed, options)) as TExclude<L, R>
    } else {
      return (TypeExtends.Extends(left, right) !== TypeExtendsResult.False ? this.Never(options) : TypeClone.Clone(left, options)) as any
    }
  }
  /** `[Standard]` Extracts from the left type any type that is assignable to the right */
  public Extract<L extends TSchema, R extends TSchema>(left: L, right: R, options: SchemaOptions = {}): TExtract<L, R> {
    if (TypeGuard.TTemplateLiteral(left)) return this.Extract(TemplateLiteralResolver.Resolve(left), right, options) as TExtract<L, R>
    if (TypeGuard.TTemplateLiteral(right)) return this.Extract(left, TemplateLiteralResolver.Resolve(right), options) as any as TExtract<L, R>
    if (TypeGuard.TUnion(left)) {
      const narrowed = left.anyOf.filter((inner) => TypeExtends.Extends(inner, right) !== TypeExtendsResult.False)
      return (narrowed.length === 1 ? TypeClone.Clone(narrowed[0], options) : this.Union(narrowed, options)) as TExtract<L, R>
    } else {
      return (TypeExtends.Extends(left, right) !== TypeExtendsResult.False ? TypeClone.Clone(left, options) : this.Never(options)) as any
    }
  }
  /** `[Standard]` Returns indexed property types for the given keys */
  public Index<T extends TTuple, K extends TNumber>(schema: T, keys: K, options?: SchemaOptions): UnionType<Assert<T['items'], TSchema[]>>
  /** `[Standard]` Returns indexed property types for the given keys */
  public Index<T extends TArray, K extends TNumber>(schema: T, keys: K, options?: SchemaOptions): AssertType<T['items']>
  /** `[Standard]` Returns indexed property types for the given keys */
  public Index<T extends TSchema, K extends TTemplateLiteral>(schema: T, keys: K, options?: SchemaOptions): TIndex<T, TTemplateLiteralKeyRest<K>>
  /** `[Standard]` Returns indexed property types for the given keys */
  public Index<T extends TSchema, K extends TLiteral<Key>>(schema: T, keys: K, options?: SchemaOptions): TIndex<T, [K['const']]>
  /** `[Standard]` Returns indexed property types for the given keys */
  public Index<T extends TSchema, K extends (keyof Static<T>)[]>(schema: T, keys: [...K], options?: SchemaOptions): TIndex<T, Assert<K, Key[]>>
  /** `[Standard]` Returns indexed property types for the given keys */
  public Index<T extends TSchema, K extends TUnion<TLiteral<Key>[]>>(schema: T, keys: K, options?: SchemaOptions): TIndex<T, TUnionLiteralKeyRest<K>>
  /** `[Standard]` Returns indexed property types for the given keys */
  public Index<T extends TSchema, K extends TSchema>(schema: T, key: K, options?: SchemaOptions): TSchema
  /** `[Standard]` Returns indexed property types for the given keys */
  public Index(schema: TSchema, unresolved: any, options: SchemaOptions = {}): any {
    if (TypeGuard.TArray(schema) && TypeGuard.TNumber(unresolved)) {
      return TypeClone.Clone(schema.items, options)
    } else if (TypeGuard.TTuple(schema) && TypeGuard.TNumber(unresolved)) {
      const items = ValueGuard.IsUndefined(schema.items) ? [] : schema.items
      const cloned = items.map((schema) => TypeClone.Clone(schema, {}))
      return this.Union(cloned, options)
    } else {
      const keys = KeyArrayResolver.Resolve(unresolved)
      const clone = TypeClone.Clone(schema, {})
      return IndexedAccessor.Resolve(clone, keys, options)
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
    if (TypeGuard.TRecord(schema)) {
      const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
      if (pattern === PatternNumberExact) return this.Number(options) as unknown as TKeyOf<T>
      if (pattern === PatternStringExact) return this.String(options) as unknown as TKeyOf<T>
      throw Error('StandardTypeBuilder: Unable to resolve key type from Record key pattern')
    } else if (TypeGuard.TTuple(schema)) {
      const items = ValueGuard.IsUndefined(schema.items) ? [] : schema.items
      const literals = items.map((_, index) => Type.Literal(index))
      return this.Union(literals, options) as unknown as TKeyOf<T>
    } else if (TypeGuard.TArray(schema)) {
      return this.Number(options) as unknown as TKeyOf<T>
    } else {
      const keys = KeyResolver.ResolveKeys(schema, { includePatterns: false })
      if (keys.length === 0) return this.Never(options) as TKeyOf<T>
      const literals = keys.map((key) => this.Literal(key))
      return this.Union(literals, options) as unknown as TKeyOf<T>
    }
  }
  /** `[Standard]` Creates a Literal type */
  public Literal<T extends TLiteralValue>(value: T, options: SchemaOptions = {}): TLiteral<T> {
    return this.Create({ ...options, [Kind]: 'Literal', const: value, type: typeof value as 'string' | 'number' | 'boolean' })
  }
  /** `[Standard]` Creates a Never type */
  public Never(options: SchemaOptions = {}): TNever {
    return this.Create({ ...options, [Kind]: 'Never', not: {} })
  }
  /** `[Standard]` Creates a Not type */
  public Not<T extends TSchema>(not: T, options?: SchemaOptions): TNot<T> {
    return this.Create({ ...options, [Kind]: 'Not', not })
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
    const propertyKeys = Object.getOwnPropertyNames(properties)
    const optionalKeys = propertyKeys.filter((key) => TypeGuard.TOptional(properties[key]))
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
  public Omit<T extends TSchema, K extends TUnion<TLiteral<string>[]>>(schema: T, keys: K, options?: SchemaOptions): TOmit<T, TUnionLiteralKeyRest<K>[number]>
  /** `[Standard]` Creates a mapped type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TLiteral<string>>(schema: T, key: K, options?: SchemaOptions): TOmit<T, K['const']>
  /** `[Standard]` Creates a mapped type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TTemplateLiteral>(schema: T, key: K, options?: SchemaOptions): TOmit<T, TTemplateLiteralKeyRest<K>[number]>
  /** `[Standard]` Creates a mapped type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TNever>(schema: T, key: K, options?: SchemaOptions): TOmit<T, never>
  public Omit(schema: TSchema, unresolved: any, options: SchemaOptions = {}): any {
    const keys = KeyArrayResolver.Resolve(unresolved)
    // prettier-ignore
    return ObjectMap.Map(TypeClone.Clone(schema, {}), (schema) => {
      if (schema.required) {
        schema.required = schema.required.filter((key: string) => !keys.includes(key as any))
        if (schema.required.length === 0) delete schema.required
      }
      for (const key of Object.getOwnPropertyNames(schema.properties)) {
        if (keys.includes(key as any)) delete schema.properties[key]
      }
      return this.Create(schema)
    }, options)
  }
  /** `[Standard]` Creates a mapped type where all properties are Optional */
  public Partial<T extends TSchema>(schema: T, options: ObjectOptions = {}): TPartial<T> {
    // prettier-ignore
    return ObjectMap.Map(schema, (object) => {
      const properties = Object.getOwnPropertyNames(object.properties).reduce((acc, key) => {
        return { ...acc, [key]: this.Optional(object.properties[key]) }
      }, {} as TProperties)
      return this.Object(properties, this.Discard(object, 'required') /* object used as options to retain other constraints */)
    }, options)
  }
  /** `[Standard]` Creates a mapped type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends (keyof Static<T>)[]>(schema: T, keys: readonly [...K], options?: SchemaOptions): TPick<T, K[number]>
  /** `[Standard]` Creates a mapped type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TUnion<TLiteral<string>[]>>(schema: T, keys: K, options?: SchemaOptions): TPick<T, TUnionLiteralKeyRest<K>[number]>
  /** `[Standard]` Creates a mapped type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TLiteral<string>>(schema: T, key: K, options?: SchemaOptions): TPick<T, K['const']>
  /** `[Standard]` Creates a mapped type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TTemplateLiteral>(schema: T, key: K, options?: SchemaOptions): TPick<T, TTemplateLiteralKeyRest<K>[number]>
  /** `[Standard]` Creates a mapped type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TNever>(schema: T, key: K, options?: SchemaOptions): TPick<T, never>
  public Pick(schema: TSchema, unresolved: any, options: SchemaOptions = {}): any {
    const keys = KeyArrayResolver.Resolve(unresolved)
    // prettier-ignore
    return ObjectMap.Map(TypeClone.Clone(schema, {}), (schema) => {
      if (schema.required) {
        schema.required = schema.required.filter((key: any) => keys.includes(key))
        if (schema.required.length === 0) delete schema.required
      }
      for (const key of Object.getOwnPropertyNames(schema.properties)) {
        if (!keys.includes(key as any)) delete schema.properties[key]
      }
      return this.Create(schema)
    }, options)
  }
  /** `[Standard]` Creates a Record type */
  public Record<K extends TUnion, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): RecordUnionLiteralType<K, T>
  /** `[Standard]` Creates a Record type */
  public Record<K extends TLiteral<string | number>, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): RecordLiteralType<K, T>
  /** `[Standard]` Creates a Record type */
  public Record<K extends TTemplateLiteral, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): RecordTemplateLiteralType<K, T>
  /** `[Standard]` Creates a Record type */
  public Record<K extends TInteger | TNumber, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): RecordNumberType<K, T>
  /** `[Standard]` Creates a Record type */
  public Record<K extends TString, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): RecordStringType<K, T>
  /** `[Standard]` Creates a Record type */
  public Record(key: RecordKey, schema: TSchema, options: ObjectOptions = {}) {
    if (TypeGuard.TTemplateLiteral(key)) {
      const expression = TemplateLiteralParser.ParseExact(key.pattern)
      // prettier-ignore
      return TemplateLiteralFinite.Check(expression)
        ? (this.Object([...TemplateLiteralGenerator.Generate(expression)].reduce((acc, key) => ({ ...acc, [key]: TypeClone.Clone(schema, {}) }), {} as TProperties), options))
        : this.Create<any>({ ...options, [Kind]: 'Record', type: 'object', patternProperties: { [key.pattern]: TypeClone.Clone(schema, {}) }})
    } else if (TypeGuard.TUnion(key)) {
      const union = UnionResolver.Resolve(key)
      if (TypeGuard.TUnionLiteral(union)) {
        const properties = union.anyOf.reduce((acc: any, literal: any) => ({ ...acc, [literal.const]: TypeClone.Clone(schema, {}) }), {} as TProperties)
        return this.Object(properties, { ...options, [Hint]: 'Record' })
      } else throw Error('StandardTypeBuilder: Record key of type union contains non-literal types')
    } else if (TypeGuard.TLiteral(key)) {
      if (ValueGuard.IsString(key.const) || ValueGuard.IsNumber(key.const)) {
        return this.Object({ [key.const]: TypeClone.Clone(schema, {}) }, options)
      } else throw Error('StandardTypeBuilder: Record key of type literal is not of type string or number')
    } else if (TypeGuard.TInteger(key) || TypeGuard.TNumber(key)) {
      return this.Create<any>({ ...options, [Kind]: 'Record', type: 'object', patternProperties: { [PatternNumberExact]: TypeClone.Clone(schema, {}) } })
    } else if (TypeGuard.TString(key)) {
      const pattern = ValueGuard.IsUndefined(key.pattern) ? PatternStringExact : key.pattern
      return this.Create<any>({ ...options, [Kind]: 'Record', type: 'object', patternProperties: { [pattern]: TypeClone.Clone(schema, {}) } })
    } else {
      throw Error(`StandardTypeBuilder: Record key is an invalid type`)
    }
  }
  /** `[Standard]` Creates a Recursive type */
  public Recursive<T extends TSchema>(callback: (thisType: TThis) => T, options: SchemaOptions = {}): TRecursive<T> {
    if (ValueGuard.IsUndefined(options.$id)) (options as any).$id = `T${TypeOrdinal++}`
    const thisType = callback({ [Kind]: 'This', $ref: `${options.$id}` } as any)
    thisType.$id = options.$id
    return this.Create({ ...options, [Hint]: 'Recursive', ...thisType } as any)
  }
  /** `[Standard]` Creates a Ref type. The referenced type must contain a $id */
  public Ref<T extends TSchema>(schema: T, options?: SchemaOptions): TRef<T>
  /** `[Standard]` Creates a Ref type. */
  public Ref<T extends TSchema>($ref: string, options?: SchemaOptions): TRef<T>
  /** `[Standard]` Creates a Ref type. */
  public Ref(unresolved: TSchema | string, options: SchemaOptions = {}) {
    if (ValueGuard.IsString(unresolved)) return this.Create({ ...options, [Kind]: 'Ref', $ref: unresolved })
    if (ValueGuard.IsUndefined(unresolved.$id)) throw Error('StandardTypeBuilder.Ref: Target type must specify an $id')
    return this.Create({ ...options, [Kind]: 'Ref', $ref: unresolved.$id! })
  }
  /** `[Standard]` Creates a mapped type where all properties are Required */
  public Required<T extends TSchema>(schema: T, options: SchemaOptions = {}): TRequired<T> {
    // prettier-ignore
    return ObjectMap.Map(schema, (object) => {
      const properties = Object.getOwnPropertyNames(object.properties).reduce((acc, key) => {
        return { ...acc, [key]: this.Discard(object.properties[key], Optional) as TSchema }
      }, {} as TProperties)
      return this.Object(properties, object /* object used as options to retain other constraints  */)
    }, options)
  }
  /** `[Standard]` Returns a schema array which allows types to compose with the JavaScript spread operator */
  public Rest<T extends TSchema>(schema: T): TRest<T> {
    if (TypeGuard.TTuple(schema)) {
      if (ValueGuard.IsUndefined(schema.items)) return [] as TSchema[] as TRest<T>
      return schema.items.map((schema) => TypeClone.Clone(schema, {})) as TRest<T>
    } else {
      return [TypeClone.Clone(schema, {})] as TRest<T>
    }
  }
  /** `[Standard]` Creates a String type */
  public String(options: StringOptions = {}): TString {
    return this.Create({ ...options, [Kind]: 'String', type: 'string' })
  }
  /** `[Experimental]` Creates a template literal type from dsl string */
  public TemplateLiteral<T extends string>(dsl: T, options?: SchemaOptions): TTemplateLiteralDslParser<T>
  /** `[Standard]` Creates a template literal type */
  public TemplateLiteral<T extends TTemplateLiteralKind[]>(kinds: [...T], options?: SchemaOptions): TTemplateLiteral<T>
  /** `[Standard]` Creates a template literal type */
  public TemplateLiteral(unresolved: unknown, options: SchemaOptions = {}) {
    // prettier-ignore
    const pattern = (ValueGuard.IsString(unresolved))
      ? TemplateLiteralPattern.Create(TemplateLiteralDslParser.Parse(unresolved))
      : TemplateLiteralPattern.Create(unresolved as TTemplateLiteralKind[])
    return this.Create({ ...options, [Kind]: 'TemplateLiteral', type: 'string', pattern })
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
  /** `[Experimental]` Remaps a TemplateLiteral into a Union representation. This function is known to cause TS compiler crashes for finite templates with large generation counts. Use with caution. */
  public Union<T extends TTemplateLiteral>(template: T): TUnionTemplateLiteral<T>
  public Union(union: TSchema[] | TTemplateLiteral, options: SchemaOptions = {}) {
    if (TypeGuard.TTemplateLiteral(union)) {
      return TemplateLiteralResolver.Resolve(union)
    } else {
      const anyOf = union
      if (anyOf.length === 0) return this.Never(options)
      if (anyOf.length === 1) return this.Create(TypeClone.Clone(anyOf[0], options))
      const clonedAnyOf = anyOf.map((schema) => TypeClone.Clone(schema, {}))
      return this.Create({ ...options, [Kind]: 'Union', anyOf: clonedAnyOf })
    }
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
// ExtendedTypeBuilder
// --------------------------------------------------------------------------
export class ExtendedTypeBuilder extends StandardTypeBuilder {
  /** `[Extended]` Creates a async iterator type */
  public AsyncIterator<T extends TSchema>(items: T, options: SchemaOptions = {}): TAsyncIterator<T> {
    return this.Create({ ...options, [Kind]: 'AsyncIterator', type: 'AsyncIterator', items: TypeClone.Clone(items, {}) })
  }
  /** `[Extended]` Creates a BigInt type */
  public BigInt(options: NumericOptions<bigint> = {}): TBigInt {
    return this.Create({ ...options, [Kind]: 'BigInt', type: 'bigint' })
  }
  /** `[Extended]` Extracts the ConstructorParameters from the given Constructor type */
  public ConstructorParameters<T extends TConstructor<any[], any>>(schema: T, options: SchemaOptions = {}): TConstructorParameters<T> {
    return this.Tuple([...schema.parameters], { ...options })
  }
  /** `[Extended]` Creates a Constructor type */
  public Constructor<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TConstructor<T, U> {
    const clonedReturns = TypeClone.Clone(returns, {})
    const clonedParameters = parameters.map((parameter) => TypeClone.Clone(parameter, {}))
    return this.Create({ ...options, [Kind]: 'Constructor', type: 'constructor', parameters: clonedParameters, returns: clonedReturns })
  }
  /** `[Extended]` Creates a Date type */
  public Date(options: DateOptions = {}): TDate {
    return this.Create({ ...options, [Kind]: 'Date', type: 'Date' })
  }
  /** `[Extended]` Creates a Function type */
  public Function<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TFunction<T, U> {
    const clonedReturns = TypeClone.Clone(returns, {})
    const clonedParameters = parameters.map((parameter) => TypeClone.Clone(parameter, {}))
    return this.Create({ ...options, [Kind]: 'Function', type: 'function', parameters: clonedParameters, returns: clonedReturns })
  }
  /** `[Extended]` Extracts the InstanceType from the given Constructor */
  public InstanceType<T extends TConstructor<any[], any>>(schema: T, options: SchemaOptions = {}): TInstanceType<T> {
    return TypeClone.Clone(schema.returns, options)
  }
  /** `[Extended]` Creates an iterator type */
  public Iterator<T extends TSchema>(items: T, options: SchemaOptions = {}): TIterator<T> {
    return this.Create({ ...options, [Kind]: 'Iterator', type: 'Iterator', items: TypeClone.Clone(items, {}) })
  }
  /** `[Extended]` Extracts the Parameters from the given Function type */
  public Parameters<T extends TFunction<any[], any>>(schema: T, options: SchemaOptions = {}): TParameters<T> {
    return this.Tuple(schema.parameters, { ...options })
  }
  /** `[Extended]` Creates a Promise type */
  public Promise<T extends TSchema>(item: T, options: SchemaOptions = {}): TPromise<T> {
    return this.Create({ ...options, [Kind]: 'Promise', type: 'Promise', item: TypeClone.Clone(item, {}) })
  }
  /** `[Extended]` Creates a String pattern type from Regular Expression */
  public RegExp(pattern: string, options?: SchemaOptions): TString
  /** `[Extended]` Creates a String pattern type from Regular Expression */
  public RegExp(regex: RegExp, options?: SchemaOptions): TString
  /** `[Extended]` Creates a String pattern type from Regular Expression */
  public RegExp(unresolved: string | RegExp, options: SchemaOptions = {}) {
    const pattern = ValueGuard.IsString(unresolved) ? unresolved : unresolved.source
    return this.Create({ ...options, [Kind]: 'String', type: 'string', pattern })
  }
  /**
   * @deprecated Use `Type.RegExp`
   */
  public RegEx(regex: RegExp, options: SchemaOptions = {}): TString {
    return this.RegExp(regex, options)
  }
  /** `[Extended]` Extracts the ReturnType from the given Function */
  public ReturnType<T extends TFunction<any[], any>>(schema: T, options: SchemaOptions = {}): TReturnType<T> {
    return TypeClone.Clone(schema.returns, options)
  }
  /** `[Extended]` Creates a Symbol type */
  public Symbol(options?: SchemaOptions): TSymbol {
    return this.Create({ ...options, [Kind]: 'Symbol', type: 'symbol' })
  }
  /** `[Extended]` Creates a Undefined type */
  public Undefined(options: SchemaOptions = {}): TUndefined {
    return this.Create({ ...options, [Kind]: 'Undefined', type: 'undefined' })
  }
  /** `[Extended]` Creates a Uint8Array type */
  public Uint8Array(options: Uint8ArrayOptions = {}): TUint8Array {
    return this.Create({ ...options, [Kind]: 'Uint8Array', type: 'Uint8Array' })
  }
  /** `[Extended]` Creates a Void type */
  public Void(options: SchemaOptions = {}): TVoid {
    return this.Create({ ...options, [Kind]: 'Void', type: 'void' })
  }
}
/** JSON Schema Type Builder with Static Resolution for TypeScript */
export const StandardType = new StandardTypeBuilder()
/** JSON Schema Type Builder with Static Resolution for TypeScript */
export const Type = new ExtendedTypeBuilder()
