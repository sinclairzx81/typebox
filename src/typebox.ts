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
export const Transform = Symbol.for('TypeBox.Transform')
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
export type TReadonlyOptional<T extends TSchema> = TOptional<T> & TReadonly<T>
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
  /** The minimum number of items in this array */
  minItems?: number
  /** The maximum number of items in this array */
  maxItems?: number
  /** Should this schema contain unique items */
  uniqueItems?: boolean
  /** A schema for which some elements should match */
  contains?: TSchema
  /** A minimum number of contains schema matches */
  minContains?: number
  /** A maximum number of contains schema matches */
  maxContains?: number
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
// -------------------------------------------------------------------------------
// TAwaited
// -------------------------------------------------------------------------------
// prettier-ignore
export type TAwaitedRest<T extends TSchema[]> = T extends [infer L, ...infer R]
  ? [TAwaited<AssertType<L>>, ...TAwaitedRest<AssertRest<R>>]
  : []
// prettier-ignore
export type TAwaited<T extends TSchema> = 
  T extends TIntersect<infer S> ? TIntersect<TAwaitedRest<S>> :
  T extends TUnion<infer S>     ? TUnion<TAwaitedRest<S>> :
  T extends TPromise<infer S>   ? TAwaited<S> :
  T
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
  type: 'Constructor'
  parameters: T
  returns: U
}
// --------------------------------------------------------------------------
// TDate
// --------------------------------------------------------------------------
export interface DateOptions extends SchemaOptions {
  /** The exclusive maximum timestamp value */
  exclusiveMaximumTimestamp?: number
  /** The exclusive minimum timestamp value */
  exclusiveMinimumTimestamp?: number
  /** The maximum timestamp value */
  maximumTimestamp?: number
  /** The minimum timestamp value */
  minimumTimestamp?: number
  /** The multiple of timestamp value */
  multipleOfTimestamp?: number
}
export interface TDate extends TSchema, DateOptions {
  [Kind]: 'Date'
  static: Date
  type: 'date'
}
// --------------------------------------------------------------------------
// TEnum
// --------------------------------------------------------------------------
export type TEnumRecord = Record<TEnumKey, TEnumValue>
export type TEnumValue = string | number
export type TEnumKey = string
export interface TEnum<T extends Record<string, string | number> = Record<string, string | number>> extends TSchema {
  [Kind]: 'Union'
  [Hint]: 'Enum'
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
  type: 'Function'
  parameters: T
  returns: U
}
// --------------------------------------------------------------------------
// TIndex
// --------------------------------------------------------------------------
export type TIndexRest<T extends TSchema[], K extends TPropertyKey> = T extends [infer L, ...infer R] ? [TIndexType<AssertType<L>, K>, ...TIndexRest<AssertRest<R>, K>] : []
export type TIndexProperty<T extends TProperties, K extends TPropertyKey> = K extends keyof T ? [T[K]] : []
export type TIndexTuple<T extends TSchema[], K extends TPropertyKey> = K extends keyof T ? [T[K]] : []
// prettier-ignore
export type TIndexType<T extends TSchema, K extends TPropertyKey> =
  T extends TRecursive<infer S> ? TIndexType<S, K> :
  T extends TIntersect<infer S> ? IntersectType<AssertRest<Discard<Flat<TIndexRest<S, K>>, TNever>>> :
  T extends TUnion<infer S>     ? UnionType<AssertRest<Flat<TIndexRest<S, K>>>> :
  T extends TObject<infer S>    ? UnionType<AssertRest<Flat<TIndexProperty<S, K>>>> :
  T extends TTuple<infer S>     ? UnionType<AssertRest<Flat<TIndexTuple<S, K>>>> :
  []
// prettier-ignore
export type TIndexRestMany<T extends TSchema, K extends TPropertyKey[]> = 
 K extends [infer L, ...infer R] ? [TIndexType<T, Assert<L, TPropertyKey>>, ...TIndexRestMany<T, Assert<R, TPropertyKey[]>>] :
 []
// prettier-ignore
export type TIndex<T extends TSchema, K extends TPropertyKey[]> =
  T extends TRecursive<infer S> ? TIndex<S, K> :
  T extends TIntersect ? UnionType<Flat<TIndexRestMany<T, K>>> :
  T extends TUnion     ? UnionType<Flat<TIndexRestMany<T, K>>> :
  T extends TObject    ? UnionType<Flat<TIndexRestMany<T, K>>> :
  T extends TTuple     ? UnionType<Flat<TIndexRestMany<T, K>>> :
  TNever
// --------------------------------------------------------------------------
// TIntrinsic
// --------------------------------------------------------------------------
export type TIntrinsicMode = 'Uppercase' | 'Lowercase' | 'Capitalize' | 'Uncapitalize'
// prettier-ignore
export type TIntrinsicTemplateLiteral<T extends TTemplateLiteralKind[], M extends TIntrinsicMode> =
  M extends ('Lowercase' | 'Uppercase')     ? T extends [infer L, ...infer R] ? [TIntrinsic<AssertType<L>, M>, ...TIntrinsicTemplateLiteral<AssertRest<R>, M>] : T :  
  M extends ('Capitalize' | 'Uncapitalize') ? T extends [infer L, ...infer R] ? [TIntrinsic<AssertType<L>, M>, ...R] : T :  
  T
// prettier-ignore
export type TIntrinsicLiteral<T, M extends TIntrinsicMode> = 
  T extends string ? 
    M extends 'Uncapitalize' ? Uncapitalize<T> :  
    M extends 'Capitalize' ? Capitalize<T> :
    M extends 'Uppercase' ? Uppercase<T> :
    M extends 'Lowercase' ? Lowercase<T> :
    string
  : T
// prettier-ignore
export type TIntrinsicRest<T extends TSchema[], M extends TIntrinsicMode> = T extends [infer L, ...infer R]
  ? [TIntrinsic<AssertType<L>, M>, ...TIntrinsicRest<AssertRest<R>, M>]
  : []
// prettier-ignore
export type TIntrinsic<T extends TSchema, M extends TIntrinsicMode> =
  T extends TTemplateLiteral<infer S> ? TTemplateLiteral<TIntrinsicTemplateLiteral<S, M>> :
  T extends TUnion<infer S> ? TUnion<TIntrinsicRest<S, M>> :
  T extends TLiteral<infer S> ? TLiteral<TIntrinsicLiteral<S, M>> :
  T
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
export type TLiteralValue = boolean | number | string // | bigint - supported but variant disable due to potential numeric type conflicts
export type TLiteralBoolean = TLiteral<boolean>
export type TLiteralNumber = TLiteral<number>
export type TLiteralString = TLiteral<string>
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
export type TPropertyKey = string | number
export type TProperties = Record<TPropertyKey, TSchema>
export type ObjectProperties<T> = T extends TObject<infer U> ? U : never
export type ObjectPropertyKeys<T> = T extends TObject<infer U> ? keyof U : never
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
  static: PropertiesReduce<T, this['params']>
  additionalProperties?: TAdditionalProperties
  type: 'object'
  properties: T
  required?: string[]
}
// --------------------------------------------------------------------------
// TOmit
// --------------------------------------------------------------------------
export type TOmitProperties<T extends TProperties, K extends keyof any> = Evaluate<AssertProperties<Omit<T, K>>>
export type TOmitRest<T extends TSchema[], K extends keyof any> = AssertRest<{ [K2 in keyof T]: TOmit<AssertType<T[K2]>, K> }>
// prettier-ignore
export type TOmit<T extends TSchema = TSchema, K extends keyof any = keyof any> = 
  T extends TRecursive<infer S> ? TRecursive<TOmit<S, K>> :
  T extends TIntersect<infer S> ? TIntersect<TOmitRest<S, K>> : 
  T extends TUnion<infer S> ? TUnion<TOmitRest<S, K>> : 
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
export type TPartialRest<T extends TSchema[]> = AssertRest<{ [K in keyof T]: TPartial<AssertType<T[K]>> }>
// prettier-ignore
export type TPartialProperties<T extends TProperties> = Evaluate<AssertProperties<{
  [K in keyof T]: TOptional<T[K]>
}>>
// prettier-ignore
export type TPartial<T extends TSchema> =  
  T extends TRecursive<infer S> ? TRecursive<TPartial<S>> :   
  T extends TIntersect<infer S> ? TIntersect<TPartialRest<S>> : 
  T extends TUnion<infer S>     ? TUnion<TPartialRest<S>> : 
  T extends TObject<infer S>    ? TObject<TPartialProperties<S>> : 
  T
// --------------------------------------------------------------------------
// TPick
// --------------------------------------------------------------------------
// Note the key K will overlap for varying TProperties gathered via recursive union and intersect traversal. Because of this,
// we need to extract only keys assignable to T on K2. This behavior is only required for Pick only.
// prettier-ignore
export type TPickProperties<T extends TProperties, K extends keyof any> = 
  Pick<T, Assert<Extract<K, keyof T>, keyof T>> extends infer R ? ({
    [K in keyof R]: AssertType<R[K]> extends TSchema ? R[K] : never
  }): never
export type TPickRest<T extends TSchema[], K extends keyof any> = { [K2 in keyof T]: TPick<AssertType<T[K2]>, K> }
// prettier-ignore
export type TPick<T extends TSchema = TSchema, K extends keyof any = keyof any> = 
  T extends TRecursive<infer S> ? TRecursive<TPick<S, K>> :
  T extends TIntersect<infer S> ? TIntersect<TPickRest<S, K>> : 
  T extends TUnion<infer S> ? TUnion<TPickRest<S, K>> : 
  T extends TObject<infer S> ? TObject<TPickProperties<S, K>> :
  T
// --------------------------------------------------------------------------
// TPromise
// --------------------------------------------------------------------------
export interface TPromise<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Promise'
  static: Promise<Static<T, this['params']>>
  type: 'Promise'
  item: TSchema
}
// --------------------------------------------------------------------------
// TRecord
// --------------------------------------------------------------------------
export type TRecordFromUnionLiteralString<K extends TLiteralString, T extends TSchema> = { [_ in K['const']]: T }
export type TRecordFromUnionLiteralNumber<K extends TLiteralNumber, T extends TSchema> = { [_ in K['const']]: T }
// prettier-ignore
export type TRecordFromEnumKey<K extends TEnum, T extends TSchema> = Ensure<TRecord<K, T>>
// prettier-ignore
export type TRecordFromUnionRest<K extends TSchema[], T extends TSchema> = K extends [infer L, ...infer R] ? (
  L extends TUnion<infer S> ? TRecordFromUnionRest<S, T> & TRecordFromUnionRest<AssertRest<R>, T> :
  L extends TLiteralString ? TRecordFromUnionLiteralString<L, T> & TRecordFromUnionRest<AssertRest<R>, T> :
  L extends TLiteralNumber ? TRecordFromUnionLiteralNumber<L, T> & TRecordFromUnionRest<AssertRest<R>, T> :
{}) : {}
export type TRecordFromUnion<K extends TSchema[], T extends TSchema> = Ensure<TObject<AssertProperties<Evaluate<TRecordFromUnionRest<K, T>>>>>
export type TRecordFromTemplateLiteralKeyInfinite<K extends TTemplateLiteral, T extends TSchema> = Ensure<TRecord<K, T>>
export type TRecordFromTemplateLiteralKeyFinite<K extends TTemplateLiteral, T extends TSchema, I = Static<K>> = Ensure<TObject<Evaluate<{ [_ in Assert<I, string>]: T }>>>
// prettier-ignore
export type TRecordFromTemplateLiteralKey<K extends TTemplateLiteral, T extends TSchema> = IsTemplateLiteralFinite<K> extends false 
  ? TRecordFromTemplateLiteralKeyInfinite<K, T> 
  : TRecordFromTemplateLiteralKeyFinite<K, T>
export type TRecordFromLiteralStringKey<K extends TLiteralString, T extends TSchema> = Ensure<TObject<{ [_ in K['const']]: T }>>
export type TRecordFromLiteralNumberKey<K extends TLiteralNumber, T extends TSchema> = Ensure<TObject<{ [_ in K['const']]: T }>>
export type TRecordFromStringKey<K extends TString, T extends TSchema> = Ensure<TRecord<K, T>>
export type TRecordFromNumberKey<K extends TNumber, T extends TSchema> = Ensure<TRecord<K, T>>
export type TRecordFromIntegerKey<K extends TInteger, T extends TSchema> = Ensure<TRecord<K, T>>
// prettier-ignore
export type TRecordResolve<K extends TSchema, T extends TSchema> = 
  K extends TEnum<infer _> ? TRecordFromEnumKey<K, T> : // Enum before Union (intercept Hint)
  K extends TUnion<infer S> ? TRecordFromUnion<S, T> :
  K extends TTemplateLiteral ? TRecordFromTemplateLiteralKey<K, T> :
  K extends TLiteralString ? TRecordFromLiteralStringKey<K, T> :
  K extends TLiteralNumber ? TRecordFromLiteralNumberKey<K, T> :
  K extends TString ? TRecordFromStringKey<K, T> :
  K extends TNumber ? TRecordFromNumberKey<K, T> :
  K extends TInteger ? TRecordFromIntegerKey<K, T> :
  TNever
export interface TRecord<K extends TSchema = TSchema, T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Record'
  static: Record<Assert<Static<K>, string | number>, Static<T, this['params']>>
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
export type TRest<T extends TSchema> = T extends TIntersect<infer R> ? R : T extends TUnion<infer R> ? R : T extends TTuple<infer R> ? R : []
// --------------------------------------------------------------------------
// TReturnType
// --------------------------------------------------------------------------
export type TReturnType<T extends TFunction> = T['returns']
// --------------------------------------------------------------------------
// TRequired
// --------------------------------------------------------------------------
export type TRequiredRest<T extends TSchema[]> = AssertRest<{ [K in keyof T]: TRequired<AssertType<T[K]>> }>
// prettier-ignore
export type TRequiredProperties<T extends TProperties> = Evaluate<AssertProperties<{
  [K in keyof T]: T[K] extends TOptional<infer S> ? S : T[K]
}>>
// prettier-ignore
export type TRequired<T extends TSchema> = 
  T extends TRecursive<infer S> ? TRecursive<TRequired<S>> :   
  T extends TIntersect<infer S> ? TIntersect<TRequiredRest<S>> : 
  T extends TUnion<infer S>     ? TUnion<TRequiredRest<S>> : 
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
  /** The maximum string length */
  maxLength?: number
  /** The minimum string length */
  minLength?: number
  /** A regular expression pattern this string should match */
  pattern?: string
  /** A format this string should match */
  format?: StringFormatOption
  /** The content encoding for this string */
  contentEncoding?: StringContentEncodingOption
  /** The content media type for this string */
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
export type TTemplateLiteralKeyRest<T extends TTemplateLiteral> = Assert<UnionToTuple<Static<T>>, TPropertyKey[]>
export interface TTemplateLiteral<T extends TTemplateLiteralKind[] = TTemplateLiteralKind[]> extends TSchema {
  [Kind]: 'TemplateLiteral'
  static: TTemplateLiteralUnion<T>
  type: 'string'
  pattern: string // todo: it may be possible to infer this pattern
}
// --------------------------------------------------------------------------
// TTransform
// --------------------------------------------------------------------------
// prettier-ignore
export type DecodeProperties<T extends TProperties> = {
  [K in keyof T]: DecodeType<T[K]>
}
// prettier-ignore
export type DecodeRest<T extends TSchema[]> = T extends [infer L extends TSchema, ...infer R extends TSchema[]]
  ? [DecodeType<L>, ...DecodeRest<R>]
  : []
// prettier-ignore
export type DecodeType<T extends TSchema> = (
  T extends TOptional<infer S extends TSchema> ? TOptional<DecodeType<S>> :
  T extends TReadonly<infer S extends TSchema> ? TReadonly<DecodeType<S>> :
  T extends TTransform<infer _, infer R> ? TUnsafe<R> :
  T extends TArray<infer S extends TSchema> ? TArray<DecodeType<S>> :
  T extends TAsyncIterator<infer S extends TSchema> ? TAsyncIterator<DecodeType<S>> :
  T extends TConstructor<infer P extends TSchema[], infer R extends TSchema> ? TConstructor<P, DecodeType<R>> :
  T extends TEnum<infer S> ? TEnum<S> : // intercept for union. interior non decodable
  T extends TFunction<infer P extends TSchema[], infer R extends TSchema> ? TFunction<P, DecodeType<R>> :
  T extends TIntersect<infer S extends TSchema[]> ? TIntersect<DecodeRest<S>> :
  T extends TIterator<infer S extends TSchema> ? TIterator<DecodeType<S>> :
  T extends TNot<infer S extends TSchema> ? TNot<DecodeType<S>> :
  T extends TObject<infer S> ? TObject<Evaluate<DecodeProperties<S>>> :
  T extends TPromise<infer S extends TSchema> ? TPromise<DecodeType<S>> :
  T extends TRecord<infer K, infer S> ? TRecord<K, DecodeType<S>> :
  T extends TRecursive<infer S extends TSchema> ? TRecursive<DecodeType<S>> :
  T extends TRef<infer S extends TSchema> ? TRef<DecodeType<S>> :
  T extends TTuple<infer S extends TSchema[]> ? TTuple<DecodeRest<S>> :
  T extends TUnion<infer S extends TSchema[]> ? TUnion<DecodeRest<S>> :
  T
)
export type TransformFunction<T = any, U = any> = (value: T) => U
export interface TransformOptions<I extends TSchema = TSchema, O extends unknown = unknown> {
  Decode: TransformFunction<StaticDecode<I>, O>
  Encode: TransformFunction<O, StaticDecode<I>>
}
export type TTransformResolve<T extends TSchema, P extends unknown[] = []> = T extends TTransform<infer _, infer S> ? S : Static<T, P>
export interface TTransform<I extends TSchema = TSchema, O extends unknown = unknown> extends TSchema {
  static: TTransformResolve<I, this['params']>
  [Transform]: TransformOptions<I, O>
  [key: string]: any
}
// --------------------------------------------------------------------------
// TTuple
// --------------------------------------------------------------------------
export type TTupleRest<T extends TSchema[], P extends unknown[]> = T extends [infer L, ...infer R] ? [Static<AssertType<L>, P>, ...TTupleRest<AssertRest<R>, P>] : []
export interface TTuple<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Tuple'
  static: TTupleRest<T, this['params']>
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
/** Creates the decoded static form for a TypeBox type */
export type StaticDecode<T extends TSchema, P extends unknown[] = []> = Static<DecodeType<T>, P>
/** Creates the encoded static form for a TypeBox type */
export type StaticEncode<T extends TSchema, P extends unknown[] = []> = Static<T, P>
/** Creates the static type for a TypeBox type */
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
// TypeBoxError
// --------------------------------------------------------------------------
export class TypeBoxError extends Error {
  constructor(message: string) {
    super(message)
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
/** Provides functions to type guard raw JavaScript values */
export namespace ValueGuard {
  /** Returns true if this value is an array */
  export function IsArray(value: unknown): value is unknown[] {
    return Array.isArray(value)
  }
  /** Returns true if this value is bigint */
  export function IsBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint'
  }
  /** Returns true if this value is a boolean */
  export function IsBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }
  /** Returns true if this value is null */
  export function IsNull(value: unknown): value is null {
    return value === null
  }
  /** Returns true if this value is number */
  export function IsNumber(value: unknown): value is number {
    return typeof value === 'number'
  }
  /** Returns true if this value is an object */
  export function IsObject(value: unknown): value is Record<PropertyKey, unknown> {
    return typeof value === 'object' && value !== null
  }
  /** Returns true if this value is string */
  export function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }
  /** Returns true if this value is undefined */
  export function IsUndefined(value: unknown): value is undefined {
    return value === undefined
  }
}
// --------------------------------------------------------------------------
// TypeGuard
// --------------------------------------------------------------------------
export class TypeGuardUnknownTypeError extends TypeBoxError {}
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
  // ----------------------------------------------------------------
  // Types
  // ----------------------------------------------------------------
  /** Returns true if the given value is TAny */
  export function TAny(schema: unknown): schema is TAny {
    // prettier-ignore
    return (
      TKindOf(schema, 'Any') &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given value is TArray */
  export function TArray(schema: unknown): schema is TArray {
    return (
      TKindOf(schema, 'Array') &&
      schema.type === 'array' &&
      IsOptionalString(schema.$id) &&
      TSchema(schema.items) &&
      IsOptionalNumber(schema.minItems) &&
      IsOptionalNumber(schema.maxItems) &&
      IsOptionalBoolean(schema.uniqueItems) &&
      IsOptionalSchema(schema.contains) &&
      IsOptionalNumber(schema.minContains) &&
      IsOptionalNumber(schema.maxContains)
    )
  }
  /** Returns true if the given value is TAsyncIterator */
  export function TAsyncIterator(schema: unknown): schema is TAsyncIterator {
    // prettier-ignore
    return (
      TKindOf(schema, 'AsyncIterator') && 
      schema.type === 'AsyncIterator' &&
      IsOptionalString(schema.$id) &&
      TSchema(schema.items)
    )
  }
  /** Returns true if the given value is TBigInt */
  export function TBigInt(schema: unknown): schema is TBigInt {
    // prettier-ignore
    return (
      TKindOf(schema, 'BigInt') && 
      schema.type === 'bigint' &&
      IsOptionalString(schema.$id) &&
      IsOptionalBigInt(schema.exclusiveMaximum) &&
      IsOptionalBigInt(schema.exclusiveMinimum) &&
      IsOptionalBigInt(schema.maximum) &&
      IsOptionalBigInt(schema.minimum) &&
      IsOptionalBigInt(schema.multipleOf) 
    )
  }
  /** Returns true if the given value is TBoolean */
  export function TBoolean(schema: unknown): schema is TBoolean {
    // prettier-ignore
    return (
      TKindOf(schema, 'Boolean') && 
      schema.type === 'boolean' && 
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given value is TConstructor */
  export function TConstructor(schema: unknown): schema is TConstructor {
    // prettier-ignore
    return (
      TKindOf(schema, 'Constructor') && 
      schema.type === 'Constructor' &&
      IsOptionalString(schema.$id) && 
      ValueGuard.IsArray(schema.parameters) &&
      schema.parameters.every(schema => TSchema(schema)) &&
      TSchema(schema.returns)
    )
  }
  /** Returns true if the given value is TDate */
  export function TDate(schema: unknown): schema is TDate {
    return (
      TKindOf(schema, 'Date') &&
      schema.type === 'Date' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.exclusiveMaximumTimestamp) &&
      IsOptionalNumber(schema.exclusiveMinimumTimestamp) &&
      IsOptionalNumber(schema.maximumTimestamp) &&
      IsOptionalNumber(schema.minimumTimestamp) &&
      IsOptionalNumber(schema.multipleOfTimestamp)
    )
  }
  /** Returns true if the given value is TFunction */
  export function TFunction(schema: unknown): schema is TFunction {
    // prettier-ignore
    return (
      TKindOf(schema, 'Function') &&
      schema.type === 'Function' &&
      IsOptionalString(schema.$id) && 
      ValueGuard.IsArray(schema.parameters) && 
      schema.parameters.every(schema => TSchema(schema)) &&
      TSchema(schema.returns)
    )
  }
  /** Returns true if the given value is TInteger */
  export function TInteger(schema: unknown): schema is TInteger {
    return (
      TKindOf(schema, 'Integer') &&
      schema.type === 'integer' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.exclusiveMaximum) &&
      IsOptionalNumber(schema.exclusiveMinimum) &&
      IsOptionalNumber(schema.maximum) &&
      IsOptionalNumber(schema.minimum) &&
      IsOptionalNumber(schema.multipleOf)
    )
  }
  /** Returns true if the given value is TIntersect */
  export function TIntersect(schema: unknown): schema is TIntersect {
    // prettier-ignore
    return (
      TKindOf(schema, 'Intersect') &&
      (ValueGuard.IsString(schema.type) && schema.type !== 'object' ? false : true) &&
      ValueGuard.IsArray(schema.allOf) && 
      schema.allOf.every(schema => TSchema(schema) && !TTransform(schema)) &&
      IsOptionalString(schema.type) &&
      (IsOptionalBoolean(schema.unevaluatedProperties) || IsOptionalSchema(schema.unevaluatedProperties)) &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given value is TIterator */
  export function TIterator(schema: unknown): schema is TIterator {
    // prettier-ignore
    return (
      TKindOf(schema, 'Iterator') &&
      schema.type === 'Iterator' &&
      IsOptionalString(schema.$id) &&
      TSchema(schema.items)
    )
  }
  /** Returns true if the given value is a TKind with the given name. */
  export function TKindOf<T extends string>(schema: unknown, kind: T): schema is Record<PropertyKey, unknown> & { [Kind]: T } {
    return TKind(schema) && schema[Kind] === kind
  }
  /** Returns true if the given value is TKind */
  export function TKind(schema: unknown): schema is Record<PropertyKey, unknown> & { [Kind]: string } {
    return ValueGuard.IsObject(schema) && Kind in schema && ValueGuard.IsString(schema[Kind])
  }
  /** Returns true if the given value is TLiteral<string> */
  export function TLiteralString(schema: unknown): schema is TLiteral<string> {
    return TLiteral(schema) && ValueGuard.IsString(schema.const)
  }
  /** Returns true if the given value is TLiteral<number> */
  export function TLiteralNumber(schema: unknown): schema is TLiteral<number> {
    return TLiteral(schema) && ValueGuard.IsNumber(schema.const)
  }
  /** Returns true if the given value is TLiteral<boolean> */
  export function TLiteralBoolean(schema: unknown): schema is TLiteral<boolean> {
    return TLiteral(schema) && ValueGuard.IsBoolean(schema.const)
  }
  /** Returns true if the given value is TLiteral */
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
  /** Returns true if the given value is TNever */
  export function TNever(schema: unknown): schema is TNever {
    // prettier-ignore
    return (
      TKindOf(schema, 'Never') &&
      ValueGuard.IsObject(schema.not) && 
      Object.getOwnPropertyNames(schema.not).length === 0
    )
  }
  /** Returns true if the given value is TNot */
  export function TNot(schema: unknown): schema is TNot {
    // prettier-ignore
    return (
      TKindOf(schema, 'Not') &&
      TSchema(schema.not) 
    )
  }
  /** Returns true if the given value is TNull */
  export function TNull(schema: unknown): schema is TNull {
    // prettier-ignore
    return (
      TKindOf(schema, 'Null') &&
      schema.type === 'null' && 
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given value is TNumber */
  export function TNumber(schema: unknown): schema is TNumber {
    return (
      TKindOf(schema, 'Number') &&
      schema.type === 'number' &&
      IsOptionalString(schema.$id) &&
      IsOptionalNumber(schema.exclusiveMaximum) &&
      IsOptionalNumber(schema.exclusiveMinimum) &&
      IsOptionalNumber(schema.maximum) &&
      IsOptionalNumber(schema.minimum) &&
      IsOptionalNumber(schema.multipleOf)
    )
  }
  /** Returns true if the given value is TObject */
  export function TObject(schema: unknown): schema is TObject {
    // prettier-ignore
    return (
      TKindOf(schema, 'Object') &&
      schema.type === 'object' &&
      IsOptionalString(schema.$id) &&
      ValueGuard.IsObject(schema.properties) &&
      IsAdditionalProperties(schema.additionalProperties) &&
      IsOptionalNumber(schema.minProperties) &&
      IsOptionalNumber(schema.maxProperties) &&
      Object.entries(schema.properties).every(([key, schema]) => IsControlCharacterFree(key) && TSchema(schema))
    )
  }
  /** Returns true if the given value is TPromise */
  export function TPromise(schema: unknown): schema is TPromise {
    // prettier-ignore
    return (
      TKindOf(schema, 'Promise') &&
      schema.type === 'Promise' &&
      IsOptionalString(schema.$id) && 
      TSchema(schema.item)
    )
  }
  /** Returns true if the given value is TRecord */
  export function TRecord(schema: unknown): schema is TRecord {
    // prettier-ignore
    return (
      TKindOf(schema, 'Record') &&
      schema.type === 'object' && 
      IsOptionalString(schema.$id) && 
      IsAdditionalProperties(schema.additionalProperties) &&
      ValueGuard.IsObject(schema.patternProperties) &&
      ((schema: Record<PropertyKey, unknown>) => {
        const keys = Object.getOwnPropertyNames(schema.patternProperties)
        return (
          keys.length === 1 &&
          IsPattern(keys[0]) &&
          ValueGuard.IsObject(schema.patternProperties) &&
          TSchema(schema.patternProperties[keys[0]])
        )
      })(schema)
    )
  }
  /** Returns true if this value is TRecursive */
  export function TRecursive(schema: unknown): schema is { [Hint]: 'Recursive' } {
    return ValueGuard.IsObject(schema) && Hint in schema && schema[Hint] === 'Recursive'
  }
  /** Returns true if the given value is TRef */
  export function TRef(schema: unknown): schema is TRef {
    // prettier-ignore
    return (
      TKindOf(schema, 'Ref') &&
      IsOptionalString(schema.$id) && 
      ValueGuard.IsString(schema.$ref)
    )
  }
  /** Returns true if the given value is TString */
  export function TString(schema: unknown): schema is TString {
    // prettier-ignore
    return (
      TKindOf(schema, 'String') && 
      schema.type === 'string' && 
      IsOptionalString(schema.$id) && 
      IsOptionalNumber(schema.minLength) && 
      IsOptionalNumber(schema.maxLength) && 
      IsOptionalPattern(schema.pattern) && 
      IsOptionalFormat(schema.format)
    )
  }
  /** Returns true if the given value is TSymbol */
  export function TSymbol(schema: unknown): schema is TSymbol {
    // prettier-ignore
    return (
      TKindOf(schema, 'Symbol') &&
      schema.type === 'symbol' &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given value is TTemplateLiteral */
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
  /** Returns true if the given value is TThis */
  export function TThis(schema: unknown): schema is TThis {
    // prettier-ignore
    return (
      TKindOf(schema, 'This') &&
      IsOptionalString(schema.$id) && 
      ValueGuard.IsString(schema.$ref)
    )
  }
  /** Returns true of this value is TTransform */
  export function TTransform(schema: unknown): schema is { [Transform]: TransformOptions } {
    return ValueGuard.IsObject(schema) && Transform in schema
  }
  /** Returns true if the given value is TTuple */
  export function TTuple(schema: unknown): schema is TTuple {
    // prettier-ignore
    return (
      TKindOf(schema, 'Tuple') &&
      schema.type === 'array' && 
      IsOptionalString(schema.$id) && 
      ValueGuard.IsNumber(schema.minItems) && 
      ValueGuard.IsNumber(schema.maxItems) && 
      schema.minItems === schema.maxItems &&
      (( // empty
        ValueGuard.IsUndefined(schema.items) &&
        ValueGuard.IsUndefined(schema.additionalItems) &&
        schema.minItems === 0
      ) || (
        ValueGuard.IsArray(schema.items) && 
        schema.items.every(schema => TSchema(schema))
      ))
    )
  }
  /** Returns true if the given value is TUndefined */
  export function TUndefined(schema: unknown): schema is TUndefined {
    // prettier-ignore
    return (
      TKindOf(schema, 'Undefined') &&
      schema.type === 'undefined' &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given value is TUnion<Literal<string | number>[]> */
  export function TUnionLiteral(schema: unknown): schema is TUnion<TLiteral[]> {
    return TUnion(schema) && schema.anyOf.every((schema) => TLiteralString(schema) || TLiteralNumber(schema))
  }
  /** Returns true if the given value is TUnion */
  export function TUnion(schema: unknown): schema is TUnion {
    // prettier-ignore
    return (
      TKindOf(schema, 'Union') &&
      IsOptionalString(schema.$id) &&
      ValueGuard.IsObject(schema) &&
      ValueGuard.IsArray(schema.anyOf) &&
      schema.anyOf.every(schema => TSchema(schema))
    )
  }
  /** Returns true if the given value is TUint8Array */
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
  /** Returns true if the given value is TUnknown */
  export function TUnknown(schema: unknown): schema is TUnknown {
    // prettier-ignore
    return (
      TKindOf(schema, 'Unknown') &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if the given value is a raw TUnsafe */
  export function TUnsafe(schema: unknown): schema is TUnsafe<unknown> {
    return TKindOf(schema, 'Unsafe')
  }
  /** Returns true if the given value is TVoid */
  export function TVoid(schema: unknown): schema is TVoid {
    // prettier-ignore
    return (
      TKindOf(schema, 'Void') &&
      schema.type === 'void' &&
      IsOptionalString(schema.$id)
    )
  }
  /** Returns true if this value has a Readonly symbol */
  export function TReadonly<T extends TSchema>(schema: T): schema is TReadonly<T> {
    return ValueGuard.IsObject(schema) && schema[Readonly] === 'Readonly'
  }
  /** Returns true if this value has a Optional symbol */
  export function TOptional<T extends TSchema>(schema: T): schema is TOptional<T> {
    return ValueGuard.IsObject(schema) && schema[Optional] === 'Optional'
  }
  /** Returns true if the given value is TSchema */
  export function TSchema(schema: unknown): schema is TSchema {
    // prettier-ignore
    return (
      ValueGuard.IsObject(schema)
    ) && (
      TAny(schema) ||
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
      (TKind(schema) && TypeRegistry.Has(schema[Kind] as any))
    )
  }
}
// --------------------------------------------------------------------------
// ExtendsUndefined
// --------------------------------------------------------------------------
/** Fast undefined check used for properties of type undefined */
export namespace ExtendsUndefined {
  export function Check(schema: TSchema): boolean {
    return schema[Kind] === 'Intersect'
      ? (schema as TIntersect).allOf.every((schema) => Check(schema))
      : schema[Kind] === 'Union'
      ? (schema as TUnion).anyOf.some((schema) => Check(schema))
      : schema[Kind] === 'Undefined'
      ? true
      : schema[Kind] === 'Not'
      ? !Check(schema.not)
      : false
  }
}
// --------------------------------------------------------------------------
// TypeExtends
// --------------------------------------------------------------------------
export class TypeExtendsError extends TypeBoxError {}
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
    return result === TypeExtendsResult.False ? result : TypeExtendsResult.True
  }
  // --------------------------------------------------------------------------
  // Throw
  // --------------------------------------------------------------------------
  function Throw(message: string): never {
    throw new TypeExtendsError(message)
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
    // prettier-ignore
    return (
      TypeGuard.TNever(right) ? TNeverRight(left, right) :
      TypeGuard.TIntersect(right) ? TIntersectRight(left, right) :
      TypeGuard.TUnion(right) ? TUnionRight(left, right) :
      TypeGuard.TUnknown(right) ? TUnknownRight(left, right) :
      TypeGuard.TAny(right) ? TAnyRight(left, right) :
      Throw('StructuralRight')
    )
  }
  // --------------------------------------------------------------------------
  // Any
  // --------------------------------------------------------------------------
  function TAnyRight(left: TSchema, right: TAny) {
    return TypeExtendsResult.True
  }
  function TAny(left: TAny, right: TSchema) {
    // prettier-ignore
    return (
      TypeGuard.TIntersect(right) ? TIntersectRight(left, right) :
      (TypeGuard.TUnion(right) && right.anyOf.some((schema) => TypeGuard.TAny(schema) || TypeGuard.TUnknown(schema))) ? TypeExtendsResult.True :
      TypeGuard.TUnion(right) ? TypeExtendsResult.Union  :
      TypeGuard.TUnknown(right) ? TypeExtendsResult.True :
      TypeGuard.TAny(right) ? TypeExtendsResult.True :
      TypeExtendsResult.Union
    )
  }
  // --------------------------------------------------------------------------
  // Array
  // --------------------------------------------------------------------------
  function TArrayRight(left: TSchema, right: TArray) {
    // prettier-ignore
    return (
      TypeGuard.TUnknown(left) ? TypeExtendsResult.False :
      TypeGuard.TAny(left) ?TypeExtendsResult.Union :
      TypeGuard.TNever(left) ? TypeExtendsResult.True :
      TypeExtendsResult.False
    )
  }
  function TArray(left: TArray, right: TSchema) {
    // prettier-ignore
    return (
      TypeGuard.TObject(right) && IsObjectArrayLike(right) ? TypeExtendsResult.True :
      IsStructuralRight(right) ? StructuralRight(left, right) :
      !TypeGuard.TArray(right) ? TypeExtendsResult.False :
      IntoBooleanResult(Visit(left.items, right.items))
    )
  }
  // --------------------------------------------------------------------------
  // AsyncIterator
  // --------------------------------------------------------------------------
  function TAsyncIterator(left: TAsyncIterator, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      !TypeGuard.TAsyncIterator(right) ? TypeExtendsResult.False :
      IntoBooleanResult(Visit(left.items, right.items))
    )
  }
  // --------------------------------------------------------------------------
  // BigInt
  // --------------------------------------------------------------------------
  function TBigInt(left: TBigInt, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TBigInt(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Boolean
  // --------------------------------------------------------------------------
  function TBooleanRight(left: TSchema, right: TBoolean) {
    return TypeGuard.TLiteral(left) && ValueGuard.IsBoolean(left.const) ? TypeExtendsResult.True : TypeGuard.TBoolean(left) ? TypeExtendsResult.True : TypeExtendsResult.False
  }
  function TBoolean(left: TBoolean, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TBoolean(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Constructor
  // --------------------------------------------------------------------------
  function TConstructor(left: TConstructor, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      !TypeGuard.TConstructor(right) ? TypeExtendsResult.False :
      left.parameters.length > right.parameters.length ? TypeExtendsResult.False :
      (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === TypeExtendsResult.True)) ? TypeExtendsResult.False :
      IntoBooleanResult(Visit(left.returns, right.returns))
    )
  }
  // --------------------------------------------------------------------------
  // Date
  // --------------------------------------------------------------------------
  function TDate(left: TDate, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TDate(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Function
  // --------------------------------------------------------------------------
  function TFunction(left: TFunction, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      !TypeGuard.TFunction(right) ? TypeExtendsResult.False :
      left.parameters.length > right.parameters.length ? TypeExtendsResult.False :
      (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === TypeExtendsResult.True)) ? TypeExtendsResult.False :
      IntoBooleanResult(Visit(left.returns, right.returns))
    )
  }
  // --------------------------------------------------------------------------
  // Integer
  // --------------------------------------------------------------------------
  function TIntegerRight(left: TSchema, right: TInteger) {
    // prettier-ignore
    return (
      TypeGuard.TLiteral(left) && ValueGuard.IsNumber(left.const) ? TypeExtendsResult.True :
      TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  function TInteger(left: TInteger, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return (
      TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? TypeExtendsResult.True : 
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Intersect
  // --------------------------------------------------------------------------
  function TIntersectRight(left: TSchema, right: TIntersect): TypeExtendsResult {
    // prettier-ignore
    return right.allOf.every((schema) => Visit(left, schema) === TypeExtendsResult.True) 
      ? TypeExtendsResult.True 
      : TypeExtendsResult.False
  }
  function TIntersect(left: TIntersect, right: TSchema) {
    // prettier-ignore
    return left.allOf.some((schema) => Visit(schema, right) === TypeExtendsResult.True) 
      ? TypeExtendsResult.True 
      : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Iterator
  // --------------------------------------------------------------------------
  function TIterator(left: TIterator, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      !TypeGuard.TIterator(right) ? TypeExtendsResult.False :
      IntoBooleanResult(Visit(left.items, right.items))
    )
  }
  // --------------------------------------------------------------------------
  // Literal
  // --------------------------------------------------------------------------
  function TLiteral(left: TLiteral, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return (
      TypeGuard.TLiteral(right) && right.const === left.const ? TypeExtendsResult.True : 
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TString(right) ? TStringRight(left, right) :
      TypeGuard.TNumber(right) ? TNumberRight(left, right) :
      TypeGuard.TInteger(right) ? TIntegerRight(left, right) :
      TypeGuard.TBoolean(right) ? TBooleanRight(left, right) :
      TypeExtendsResult.False
    )
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
    // prettier-ignore
    return (
      TypeGuard.TNot(left) ? Visit(UnwrapTNot(left), right) :
      TypeGuard.TNot(right) ? Visit(left, UnwrapTNot(right)) :
      Throw('Invalid fallthrough for Not')
    )
  }
  // --------------------------------------------------------------------------
  // Null
  // --------------------------------------------------------------------------
  function TNull(left: TNull, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TNull(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Number
  // --------------------------------------------------------------------------
  function TNumberRight(left: TSchema, right: TNumber) {
    // prettier-ignore
    return (
      TypeGuard.TLiteralNumber(left) ? TypeExtendsResult.True :
      TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  function TNumber(left: TNumber, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
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
    // prettier-ignore
    return (
      Visit(left, right) === TypeExtendsResult.False ? TypeExtendsResult.False :
      TypeGuard.TOptional(left) && !TypeGuard.TOptional(right) ? TypeExtendsResult.False :
      TypeExtendsResult.True
    )
  }
  function TObjectRight(left: TSchema, right: TObject) {
    // prettier-ignore
    return (
      TypeGuard.TUnknown(left) ? TypeExtendsResult.False :
      TypeGuard.TAny(left) ? TypeExtendsResult.Union : (
        TypeGuard.TNever(left) ||
        (TypeGuard.TLiteralString(left) && IsObjectStringLike(right)) ||
        (TypeGuard.TLiteralNumber(left) && IsObjectNumberLike(right)) ||
        (TypeGuard.TLiteralBoolean(left) && IsObjectBooleanLike(right)) ||
        (TypeGuard.TSymbol(left) && IsObjectSymbolLike(right)) ||
        (TypeGuard.TBigInt(left) && IsObjectBigIntLike(right)) ||
        (TypeGuard.TString(left) && IsObjectStringLike(right)) ||
        (TypeGuard.TSymbol(left) && IsObjectSymbolLike(right)) ||
        (TypeGuard.TNumber(left) && IsObjectNumberLike(right)) ||
        (TypeGuard.TInteger(left) && IsObjectNumberLike(right)) ||
        (TypeGuard.TBoolean(left) && IsObjectBooleanLike(right)) ||
        (TypeGuard.TUint8Array(left) && IsObjectUint8ArrayLike(right)) ||
        (TypeGuard.TDate(left) && IsObjectDateLike(right)) ||
        (TypeGuard.TConstructor(left) && IsObjectConstructorLike(right)) ||
        (TypeGuard.TFunction(left) && IsObjectFunctionLike(right)) 
      ) ? TypeExtendsResult.True :
      (TypeGuard.TRecord(left) && TypeGuard.TString(RecordKey(left))) ? (() => {
        // When expressing a Record with literal key values, the Record is converted into a Object with
        // the Hint assigned as `Record`. This is used to invert the extends logic.
        return right[Hint] === 'Record' ? TypeExtendsResult.True : TypeExtendsResult.False
      })() :
      (TypeGuard.TRecord(left) && TypeGuard.TNumber(RecordKey(left))) ? (() => {
        return IsObjectPropertyCount(right, 0) 
          ? TypeExtendsResult.True 
          : TypeExtendsResult.False
      })() :
      TypeExtendsResult.False
    )
  }
  function TObject(left: TObject, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      !TypeGuard.TObject(right) ? TypeExtendsResult.False :
      (() => {
        for (const key of Object.getOwnPropertyNames(right.properties)) {
          if (!(key in left.properties) && !TypeGuard.TOptional(right.properties[key])) {
            return TypeExtendsResult.False
          }
          if(TypeGuard.TOptional(right.properties[key])) {
            return TypeExtendsResult.True
          }
          if (Property(left.properties[key], right.properties[key]) === TypeExtendsResult.False) {
            return TypeExtendsResult.False
          }
        }
        return TypeExtendsResult.True
      })()
    )
  }
  // --------------------------------------------------------------------------
  // Promise
  // --------------------------------------------------------------------------
  function TPromise(left: TPromise, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) && IsObjectPromiseLike(right) ? TypeExtendsResult.True :
      !TypeGuard.TPromise(right) ? TypeExtendsResult.False :
      IntoBooleanResult(Visit(left.item, right.item))
    )
  }
  // --------------------------------------------------------------------------
  // Record
  // --------------------------------------------------------------------------
  function RecordKey(schema: TRecord) {
    // prettier-ignore
    return (
      PatternNumberExact in schema.patternProperties ? Type.Number() :
      PatternStringExact in schema.patternProperties ? Type.String() :
      Throw('Unknown record key pattern')
    )
  }
  function RecordValue(schema: TRecord) {
    // prettier-ignore
    return (
      PatternNumberExact in schema.patternProperties ? schema.patternProperties[PatternNumberExact] :
      PatternStringExact in schema.patternProperties ? schema.patternProperties[PatternStringExact] :
      Throw('Unable to get record value schema')
    )
  }
  function TRecordRight(left: TSchema, right: TRecord) {
    const [Key, Value] = [RecordKey(right), RecordValue(right)]
    // prettier-ignore
    return (
      (TypeGuard.TLiteralString(left) && TypeGuard.TNumber(Key) && IntoBooleanResult(Visit(left, Value)) === TypeExtendsResult.True) ? TypeExtendsResult.True :
      TypeGuard.TUint8Array(left) && TypeGuard.TNumber(Key) ? Visit(left, Value) :
      TypeGuard.TString(left) && TypeGuard.TNumber(Key) ? Visit(left, Value) :
      TypeGuard.TArray(left) && TypeGuard.TNumber(Key) ? Visit(left, Value) :
      TypeGuard.TObject(left) ? (() => {
        for (const key of Object.getOwnPropertyNames(left.properties)) {
          if (Property(Value, left.properties[key]) === TypeExtendsResult.False) {
            return TypeExtendsResult.False
          }
        }
        return TypeExtendsResult.True
      })() : 
      TypeExtendsResult.False
    )
  }
  function TRecord(left: TRecord, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      !TypeGuard.TRecord(right) ? TypeExtendsResult.False :
      Visit(RecordValue(left), RecordValue(right))
    )
  }
  // --------------------------------------------------------------------------
  // String
  // --------------------------------------------------------------------------
  function TStringRight(left: TSchema, right: TString) {
    // prettier-ignore
    return (
      TypeGuard.TLiteral(left) && ValueGuard.IsString(left.const) ? TypeExtendsResult.True :
      TypeGuard.TString(left) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  function TString(left: TString, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TString(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Symbol
  // --------------------------------------------------------------------------
  function TSymbol(left: TSymbol, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TSymbol(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // TemplateLiteral
  // --------------------------------------------------------------------------
  function TTemplateLiteral(left: TSchema, right: TSchema) {
    // TemplateLiteral types are resolved to either unions for finite expressions or string
    // for infinite expressions. Here we call to TemplateLiteralResolver to resolve for
    // either type and continue evaluating.
    // prettier-ignore
    return (
      TypeGuard.TTemplateLiteral(left) ? Visit(TemplateLiteralResolver.Resolve(left), right) :
      TypeGuard.TTemplateLiteral(right) ? Visit(left, TemplateLiteralResolver.Resolve(right)) :
      Throw('Invalid fallthrough for TemplateLiteral')
    )
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
    // prettier-ignore
    return (
      TypeGuard.TNever(left) ? TypeExtendsResult.True :
      TypeGuard.TUnknown(left) ? TypeExtendsResult.False :
      TypeGuard.TAny(left) ? TypeExtendsResult.Union :
      TypeExtendsResult.False
    )
  }
  function TTuple(left: TTuple, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) && IsObjectArrayLike(right) ? TypeExtendsResult.True :
      TypeGuard.TArray(right) && IsArrayOfTuple(left, right) ? TypeExtendsResult.True :
      !TypeGuard.TTuple(right) ? TypeExtendsResult.False :
      (ValueGuard.IsUndefined(left.items) && !ValueGuard.IsUndefined(right.items)) || (!ValueGuard.IsUndefined(left.items) && ValueGuard.IsUndefined(right.items)) ? TypeExtendsResult.False :
      (ValueGuard.IsUndefined(left.items) && !ValueGuard.IsUndefined(right.items)) ? TypeExtendsResult.True :
      left.items!.every((schema, index) => Visit(schema, right.items![index]) === TypeExtendsResult.True) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Uint8Array
  // --------------------------------------------------------------------------
  function TUint8Array(left: TUint8Array, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TUint8Array(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Undefined
  // --------------------------------------------------------------------------
  function TUndefined(left: TUndefined, right: TSchema) {
    // prettier-ignore
    return (
      IsStructuralRight(right) ? StructuralRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TRecord(right) ? TRecordRight(left, right) :
      TypeGuard.TVoid(right) ? VoidRight(left, right) :
      TypeGuard.TUndefined(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Union
  // --------------------------------------------------------------------------
  function TUnionRight(left: TSchema, right: TUnion): TypeExtendsResult {
    // prettier-ignore
    return right.anyOf.some((schema) => Visit(left, schema) === TypeExtendsResult.True) 
      ? TypeExtendsResult.True 
      : TypeExtendsResult.False
  }
  function TUnion(left: TUnion, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return left.anyOf.every((schema) => Visit(schema, right) === TypeExtendsResult.True) 
      ? TypeExtendsResult.True 
      : TypeExtendsResult.False
  }
  // --------------------------------------------------------------------------
  // Unknown
  // --------------------------------------------------------------------------
  function TUnknownRight(left: TSchema, right: TUnknown) {
    return TypeExtendsResult.True
  }
  function TUnknown(left: TUnknown, right: TSchema) {
    // prettier-ignore
    return (
      TypeGuard.TNever(right) ? TNeverRight(left, right) :
      TypeGuard.TIntersect(right) ? TIntersectRight(left, right) :
      TypeGuard.TUnion(right) ? TUnionRight(left, right) :
      TypeGuard.TAny(right) ? TAnyRight(left, right) :
      TypeGuard.TString(right) ? TStringRight(left, right) :
      TypeGuard.TNumber(right) ? TNumberRight(left, right) :
      TypeGuard.TInteger(right) ? TIntegerRight(left, right) :
      TypeGuard.TBoolean(right) ? TBooleanRight(left, right) :
      TypeGuard.TArray(right) ? TArrayRight(left, right) :
      TypeGuard.TTuple(right) ? TTupleRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TUnknown(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
    )
  }
  // --------------------------------------------------------------------------
  // Void
  // --------------------------------------------------------------------------
  function VoidRight(left: TSchema, right: TVoid) {
    // prettier-ignore
    return TypeGuard.TUndefined(left) ? TypeExtendsResult.True :
      TypeGuard.TUndefined(left) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
  }
  function TVoid(left: TVoid, right: TSchema) {
    // prettier-ignore
    return TypeGuard.TIntersect(right) ? TIntersectRight(left, right) :
      TypeGuard.TUnion(right) ? TUnionRight(left, right) :
      TypeGuard.TUnknown(right) ? TUnknownRight(left, right) :
      TypeGuard.TAny(right) ? TAnyRight(left, right) :
      TypeGuard.TObject(right) ? TObjectRight(left, right) :
      TypeGuard.TVoid(right) ? TypeExtendsResult.True : 
      TypeExtendsResult.False
  }
  function Visit(left: TSchema, right: TSchema): TypeExtendsResult {
    // prettier-ignore
    return (
      // resolvable
      (TypeGuard.TTemplateLiteral(left) || TypeGuard.TTemplateLiteral(right)) ? TTemplateLiteral(left, right) :
      (TypeGuard.TNot(left) || TypeGuard.TNot(right)) ? TNot(left, right) :
      // standard
      TypeGuard.TAny(left) ? TAny(left, right) :
      TypeGuard.TArray(left) ? TArray(left, right) :
      TypeGuard.TBigInt(left) ? TBigInt(left, right) :
      TypeGuard.TBoolean(left) ? TBoolean(left, right) :
      TypeGuard.TAsyncIterator(left) ? TAsyncIterator(left, right) :
      TypeGuard.TConstructor(left) ? TConstructor(left, right) :
      TypeGuard.TDate(left) ? TDate(left, right) :
      TypeGuard.TFunction(left) ? TFunction(left, right) :
      TypeGuard.TInteger(left) ? TInteger(left, right) :
      TypeGuard.TIntersect(left) ? TIntersect(left, right) :
      TypeGuard.TIterator(left) ? TIterator(left, right) :
      TypeGuard.TLiteral(left) ? TLiteral(left, right) :
      TypeGuard.TNever(left) ? TNever(left, right) :
      TypeGuard.TNull(left) ? TNull(left, right) :
      TypeGuard.TNumber(left) ? TNumber(left, right) :
      TypeGuard.TObject(left) ? TObject(left, right) :
      TypeGuard.TRecord(left) ? TRecord(left, right) :
      TypeGuard.TString(left) ? TString(left, right) :
      TypeGuard.TSymbol(left) ? TSymbol(left, right) :
      TypeGuard.TTuple(left) ? TTuple(left, right) :
      TypeGuard.TPromise(left) ? TPromise(left, right) :
      TypeGuard.TUint8Array(left) ? TUint8Array(left, right) :
      TypeGuard.TUndefined(left) ? TUndefined(left, right) :
      TypeGuard.TUnion(left) ? TUnion(left, right) :
      TypeGuard.TUnknown(left) ? TUnknown(left, right) :
      TypeGuard.TVoid(left) ? TVoid(left, right) :
      Throw(`Unknown left type operand '${left[Kind]}'`)
    )
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
    // prettier-ignore
    return ValueGuard.IsArray(value) ? ArrayType(value) :
      ValueGuard.IsObject(value) ? ObjectType(value) :
      value
  }
  /** Clones a Rest */
  export function Rest<T extends TSchema[]>(schemas: [...T]): T {
    return schemas.map((schema) => Type(schema)) as T
  }
  /** Clones a Type */
  export function Type<T extends TSchema>(schema: T, options: SchemaOptions = {}): T {
    return { ...Visit(schema), ...options }
  }
}
// --------------------------------------------------------------------------
// IndexedAccessor
// --------------------------------------------------------------------------
export namespace IndexedAccessor {
  function OptionalUnwrap(schema: TSchema[]): TSchema[] {
    return schema.map((schema) => {
      const { [Optional]: _, ...clone } = TypeClone.Type(schema)
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
    return IsIntersectOptional(schema.allOf) ? Type.Optional(Type.Intersect(OptionalUnwrap(schema.allOf))) : schema
  }
  function ResolveUnion(schema: TUnion): TSchema {
    return IsUnionOptional(schema.anyOf) ? Type.Optional(Type.Union(OptionalUnwrap(schema.anyOf))) : schema
  }
  function ResolveOptional(schema: TSchema) {
    // prettier-ignore
    return schema[Kind] === 'Intersect' ? ResolveIntersect(schema as TIntersect) :
      schema[Kind] === 'Union' ? ResolveUnion(schema as TUnion) :
      schema
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
    // prettier-ignore
    return schema[Kind] === 'Intersect' ? TIntersect(schema as TIntersect, key) :
      schema[Kind] === 'Union' ? TUnion(schema as TUnion, key) :
      schema[Kind] === 'Object' ? TObject(schema as TObject, key) :
      schema[Kind] === 'Tuple' ? TTuple(schema as TTuple, key) :
      Type.Never()
  }
  export function Resolve(schema: TSchema, keys: TPropertyKey[], options: SchemaOptions = {}): TSchema {
    const resolved = keys.map((key) => Visit(schema, key.toString()))
    return ResolveOptional(Type.Union(resolved, options))
  }
}
// --------------------------------------------------------------------------
// Intrinsic
// --------------------------------------------------------------------------
export namespace Intrinsic {
  function Uncapitalize(value: string): string {
    const [first, rest] = [value.slice(0, 1), value.slice(1)]
    return `${first.toLowerCase()}${rest}`
  }
  function Capitalize(value: string): string {
    const [first, rest] = [value.slice(0, 1), value.slice(1)]
    return `${first.toUpperCase()}${rest}`
  }
  function Uppercase(value: string): string {
    return value.toUpperCase()
  }
  function Lowercase(value: string): string {
    return value.toLowerCase()
  }
  function IntrinsicTemplateLiteral(schema: TTemplateLiteral, mode: TIntrinsicMode) {
    // note: template literals require special runtime handling as they are encoded in string patterns.
    // This diverges from the mapped type which would otherwise map on the template literal kind.
    const expression = TemplateLiteralParser.ParseExact(schema.pattern)
    const finite = TemplateLiteralFinite.Check(expression)
    if (!finite) return { ...schema, pattern: IntrinsicLiteral(schema.pattern, mode) } as any
    const strings = [...TemplateLiteralGenerator.Generate(expression)]
    const literals = strings.map((value) => Type.Literal(value))
    const mapped = IntrinsicRest(literals as any, mode)
    const union = Type.Union(mapped)
    return Type.TemplateLiteral([union])
  }
  function IntrinsicLiteral(value: TLiteralValue, mode: TIntrinsicMode) {
    // prettier-ignore
    return typeof value === 'string' ? (
      mode === 'Uncapitalize' ? Uncapitalize(value) :
      mode === 'Capitalize' ? Capitalize(value) : 
      mode === 'Uppercase' ? Uppercase(value) : 
      mode === 'Lowercase' ? Lowercase(value) : 
    value) : value.toString()
  }
  function IntrinsicRest(schema: TSchema[], mode: TIntrinsicMode): TSchema[] {
    if (schema.length === 0) return []
    const [L, ...R] = schema
    return [Map(L, mode), ...IntrinsicRest(R, mode)]
  }
  function Visit(schema: TSchema, mode: TIntrinsicMode) {
    // prettier-ignore
    return TypeGuard.TTemplateLiteral(schema) ?  IntrinsicTemplateLiteral(schema, mode) :
      TypeGuard.TUnion(schema) ? Type.Union(IntrinsicRest(schema.anyOf, mode)) :
      TypeGuard.TLiteral(schema) ? Type.Literal(IntrinsicLiteral(schema.const, mode)) :
      schema
  }
  /** Applies an intrinsic string manipulation to the given type. */
  export function Map<T extends TSchema, M extends TIntrinsicMode>(schema: T, mode: M): TIntrinsic<T, M> {
    return Visit(schema, mode)
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
    // prettier-ignore
    return (
      schema[Kind] === 'Intersect' ? TIntersect(schema as TIntersect, callback) : 
      schema[Kind] === 'Union' ? TUnion(schema as TUnion, callback) : 
      schema[Kind] === 'Object' ? TObject(schema as TObject, callback) : 
      schema
    )
  }
  export function Map<T = TSchema>(schema: TSchema, callback: (object: TObject) => TObject, options: SchemaOptions): T {
    return { ...Visit(TypeClone.Type(schema), callback), ...options } as unknown as T
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
    // prettier-ignore
    return (
      TypeGuard.TIntersect(schema) ? TIntersect(schema, options) :
      TypeGuard.TUnion(schema) ? TUnion(schema, options) :
      TypeGuard.TObject(schema) ? TObject(schema, options) :
      TypeGuard.TRecord(schema) ? TRecord(schema, options) : 
      []
    )
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
export class KeyArrayResolverError extends TypeBoxError {}
export namespace KeyArrayResolver {
  /** Resolves an array of string[] keys from the given schema or array type. */
  export function Resolve(schema: TSchema | string[]): string[] {
    // prettier-ignore
    return Array.isArray(schema) ? schema :
      TypeGuard.TUnionLiteral(schema) ? schema.anyOf.map((schema) => schema.const.toString()) :
      TypeGuard.TLiteral(schema) ? [schema.const as string] :
      TypeGuard.TTemplateLiteral(schema) ? (() => {
        const expression = TemplateLiteralParser.ParseExact(schema.pattern)
        if (!TemplateLiteralFinite.Check(expression)) throw new KeyArrayResolverError('Cannot resolve keys from infinite template expression')
        return [...TemplateLiteralGenerator.Generate(expression)]
      })() : []
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
export class TemplateLiteralPatternError extends TypeBoxError {}
export namespace TemplateLiteralPattern {
  function Throw(message: string): never {
    throw new TemplateLiteralPatternError(message)
  }
  function Escape(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  function Visit(schema: TSchema, acc: string): string {
    // prettier-ignore
    return (
      TypeGuard.TTemplateLiteral(schema) ? schema.pattern.slice(1, schema.pattern.length - 1) :
      TypeGuard.TUnion(schema) ? `(${schema.anyOf.map((schema) => Visit(schema, acc)).join('|')})` :
      TypeGuard.TNumber(schema) ? `${acc}${PatternNumber}` :
      TypeGuard.TInteger(schema) ? `${acc}${PatternNumber}` :
      TypeGuard.TBigInt(schema) ? `${acc}${PatternNumber}` :
      TypeGuard.TString(schema) ? `${acc}${PatternString}` :
      TypeGuard.TLiteral(schema) ? `${acc}${Escape(schema.const.toString())}` :
      TypeGuard.TBoolean(schema) ? `${acc}${PatternBoolean}` :
      Throw(`Unexpected Kind '${schema[Kind]}'`)
    )
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
export class TemplateLiteralParserError extends TypeBoxError {}
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
    // prettier-ignore
    return (expressions.length === 0) ? { type: 'const', const: '' } :
      (expressions.length === 1) ? expressions[0] :
      { type: 'and', expr: expressions }
  }
  /** Parses a pattern and returns an expression tree */
  export function Parse(pattern: string): Expression {
    // prettier-ignore
    return IsGroup(pattern) ? Parse(InGroup(pattern)) :
      IsPrecedenceOr(pattern) ? Or(pattern) :
      IsPrecedenceAnd(pattern) ? And(pattern) :
      { type: 'const', const: pattern }
  }
  /** Parses a pattern and strips forward and trailing ^ and $ */
  export function ParseExact(pattern: string): Expression {
    return Parse(pattern.slice(1, pattern.length - 1))
  }
}
// --------------------------------------------------------------------------------------
// TemplateLiteralFinite
// --------------------------------------------------------------------------------------
export class TemplateLiteralFiniteError extends TypeBoxError {}
export namespace TemplateLiteralFinite {
  function Throw(message: string): never {
    throw new TemplateLiteralFiniteError(message)
  }
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
    // prettier-ignore
    return IsBoolean(expression) ? true :
      IsNumber(expression) || IsString(expression) ? false :
      (expression.type === 'and') ? expression.expr.every((expr) => Check(expr)) :
      (expression.type === 'or') ? expression.expr.every((expr) => Check(expr)) :
      (expression.type === 'const') ? true :
      Throw(`Unknown expression type`)
  }
}
// --------------------------------------------------------------------------------------
// TemplateLiteralGenerator
// --------------------------------------------------------------------------------------
export class TemplateLiteralGeneratorError extends TypeBoxError {}
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
    // prettier-ignore
    return (
      expression.type === 'and' ? yield* And(expression) :
      expression.type === 'or' ? yield* Or(expression) :
      expression.type === 'const' ? yield* Const(expression) :
      (() => { throw new TemplateLiteralGeneratorError('Unknown expression') })()
    )
  }
}
// ---------------------------------------------------------------------
// TemplateLiteralDslParser
// ---------------------------------------------------------------------
export namespace TemplateLiteralDslParser {
  function* ParseUnion(template: string): IterableIterator<TTemplateLiteralKind> {
    const trim = template.trim().replace(/"|'/g, '')
    // prettier-ignore
    return (
      trim === 'boolean' ? yield Type.Boolean() :
      trim === 'number' ? yield Type.Number() :
      trim === 'bigint' ? yield Type.BigInt() :
      trim === 'string' ? yield Type.String() :
      yield (() => {
        const literals = trim.split('|').map((literal) => Type.Literal(literal.trim()))
        return (
          literals.length === 0 ? Type.Never() : 
          literals.length === 1 ? literals[0] : 
          Type.Union(literals)
        )
      })()
    )
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
// ---------------------------------------------------------------------
// TransformBuilder
// ---------------------------------------------------------------------
export class TransformDecodeBuilder<T extends TSchema> {
  constructor(private readonly schema: T) {}
  public Decode<U extends unknown, D extends TransformFunction<StaticDecode<T>, U>>(decode: D): TransformEncodeBuilder<T, D> {
    return new TransformEncodeBuilder(this.schema, decode)
  }
}
export class TransformEncodeBuilder<T extends TSchema, D extends TransformFunction> {
  constructor(private readonly schema: T, private readonly decode: D) {}
  public Encode<E extends TransformFunction<ReturnType<D>, StaticDecode<T>>>(encode: E): TTransform<T, ReturnType<D>> {
    const schema = TypeClone.Type(this.schema)
    // prettier-ignore
    return (
      TypeGuard.TTransform(schema) ? (() => {
        const Encode = (value: unknown) => schema[Transform].Encode(encode(value as any))
        const Decode = (value: unknown) => this.decode(schema[Transform].Decode(value))
        const Codec = { Encode: Encode, Decode: Decode }
        return { ...schema, [Transform]: Codec }
      })() : (() => {
        const Codec = { Decode: this.decode, Encode: encode }
        return { ...schema, [Transform]: Codec }
      })()
    ) as TTransform<T, ReturnType<D>>
  }
}
// --------------------------------------------------------------------------
// TypeOrdinal: Used for auto $id generation
// --------------------------------------------------------------------------
let TypeOrdinal = 0
// --------------------------------------------------------------------------
// TypeBuilder
// --------------------------------------------------------------------------
export class TypeBuilderError extends TypeBoxError {}
export class TypeBuilder {
  /** `[Internal]` Creates a schema without `static` and `params` types */
  protected Create<T>(schema: Omit<T, 'static' | 'params'>): T {
    return schema as any
  }
  /** `[Internal]` Throws a TypeBuilder error with the given message */
  protected Throw(message: string): never {
    throw new TypeBuilderError(message)
  }
  /** `[Internal]` Discards property keys from the given record type */
  protected Discard(record: Record<PropertyKey, any>, keys: PropertyKey[]) {
    return keys.reduce((acc, key) => {
      const { [key as any]: _, ...rest } = acc
      return rest
    }, record) as any
  }
  /** `[Json]` Omits compositing symbols from this schema */
  public Strict<T extends TSchema>(schema: T): T {
    return JSON.parse(JSON.stringify(schema))
  }
}
// --------------------------------------------------------------------------
// JsonTypeBuilder
// --------------------------------------------------------------------------
export class JsonTypeBuilder extends TypeBuilder {
  // ------------------------------------------------------------------------
  // Modifiers
  // ------------------------------------------------------------------------
  /** `[Json]` Creates a Readonly and Optional property */
  public ReadonlyOptional<T extends TSchema>(schema: T): TReadonly<TOptional<T>> {
    return this.Readonly(this.Optional(schema))
  }
  /** `[Json]` Creates a Readonly property */
  public Readonly<T extends TSchema>(schema: T): TReadonly<T> {
    return { ...TypeClone.Type(schema), [Readonly]: 'Readonly' }
  }
  /** `[Json]` Creates an Optional property */
  public Optional<T extends TSchema>(schema: T): TOptional<T> {
    return { ...TypeClone.Type(schema), [Optional]: 'Optional' }
  }
  // ------------------------------------------------------------------------
  // Types
  // ------------------------------------------------------------------------
  /** `[Json]` Creates an Any type */
  public Any(options: SchemaOptions = {}): TAny {
    return this.Create({ ...options, [Kind]: 'Any' })
  }
  /** `[Json]` Creates an Array type */
  public Array<T extends TSchema>(schema: T, options: ArrayOptions = {}): TArray<T> {
    return this.Create({ ...options, [Kind]: 'Array', type: 'array', items: TypeClone.Type(schema) })
  }
  /** `[Json]` Creates a Boolean type */
  public Boolean(options: SchemaOptions = {}): TBoolean {
    return this.Create({ ...options, [Kind]: 'Boolean', type: 'boolean' })
  }
  /** `[Json]` Intrinsic function to Capitalize LiteralString types */
  public Capitalize<T extends TSchema>(schema: T, options: SchemaOptions = {}): TIntrinsic<T, 'Capitalize'> {
    return { ...Intrinsic.Map(TypeClone.Type(schema), 'Capitalize'), ...options }
  }
  /** `[Json]` Creates a Composite object type */
  public Composite<T extends TObject[]>(objects: [...T], options?: ObjectOptions): TComposite<T> {
    const intersect: any = Type.Intersect(objects, {})
    const keys = KeyResolver.ResolveKeys(intersect, { includePatterns: false })
    const properties = keys.reduce((acc, key) => ({ ...acc, [key]: Type.Index(intersect, [key]) }), {} as TProperties)
    return Type.Object(properties, options) as TComposite<T>
  }
  /** `[Json]` Creates a Enum type */
  public Enum<V extends TEnumValue, T extends Record<TEnumKey, V>>(item: T, options: SchemaOptions = {}): TEnum<T> {
    // prettier-ignore
    const values1 = Object.getOwnPropertyNames(item).filter((key) => isNaN(key as any)).map((key) => item[key]) as T[keyof T][]
    const values2 = [...new Set(values1)]
    const anyOf = values2.map((value) => Type.Literal(value))
    return this.Union(anyOf, { ...options, [Hint]: 'Enum' }) as TEnum<T>
  }
  /** `[Json]` Creates a Conditional type */
  public Extends<L extends TSchema, R extends TSchema, T extends TSchema, U extends TSchema>(left: L, right: R, trueType: T, falseType: U, options: SchemaOptions = {}): TExtends<L, R, T, U> {
    switch (TypeExtends.Extends(left, right)) {
      case TypeExtendsResult.Union:
        return this.Union([TypeClone.Type(trueType, options), TypeClone.Type(falseType, options)]) as any as TExtends<L, R, T, U>
      case TypeExtendsResult.True:
        return TypeClone.Type(trueType, options) as unknown as TExtends<L, R, T, U>
      case TypeExtendsResult.False:
        return TypeClone.Type(falseType, options) as unknown as TExtends<L, R, T, U>
    }
  }
  /** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
  public Exclude<L extends TSchema, R extends TSchema>(unionType: L, excludedMembers: R, options: SchemaOptions = {}): TExclude<L, R> {
    // prettier-ignore
    return (
      TypeGuard.TTemplateLiteral(unionType) ? this.Exclude(TemplateLiteralResolver.Resolve(unionType), excludedMembers, options) :
      TypeGuard.TTemplateLiteral(excludedMembers) ? this.Exclude(unionType, TemplateLiteralResolver.Resolve(excludedMembers), options) :
      TypeGuard.TUnion(unionType) ? (() => {
        const narrowed = unionType.anyOf.filter((inner) => TypeExtends.Extends(inner, excludedMembers) === TypeExtendsResult.False)
        return (narrowed.length === 1 ? TypeClone.Type(narrowed[0], options) : this.Union(narrowed, options)) as TExclude<L, R>
      })() :
      TypeExtends.Extends(unionType, excludedMembers) !== TypeExtendsResult.False ? this.Never(options) : 
      TypeClone.Type(unionType, options)
    ) as TExclude<L, R>
  }
  /** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
  public Extract<L extends TSchema, R extends TSchema>(type: L, union: R, options: SchemaOptions = {}): TExtract<L, R> {
    // prettier-ignore
    return (
      TypeGuard.TTemplateLiteral(type) ? this.Extract(TemplateLiteralResolver.Resolve(type), union, options) :
      TypeGuard.TTemplateLiteral(union) ? this.Extract(type, TemplateLiteralResolver.Resolve(union), options) :
      TypeGuard.TUnion(type) ? (() => {
        const narrowed = type.anyOf.filter((inner) => TypeExtends.Extends(inner, union) !== TypeExtendsResult.False)
        return (narrowed.length === 1 ? TypeClone.Type(narrowed[0], options) : this.Union(narrowed, options))
      })() :
      TypeExtends.Extends(type, union) !== TypeExtendsResult.False ? TypeClone.Type(type, options) : 
      this.Never(options)
    ) as TExtract<L, R>
  }
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TArray, K extends TNumber>(schema: T, keys: K, options?: SchemaOptions): AssertType<T['items']>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TTuple, K extends (keyof Static<T>)[]>(schema: T, keys: [...K], options?: SchemaOptions): TIndex<T, Assert<K, TPropertyKey[]>>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TTuple, K extends TNumber>(schema: T, keys: K, options?: SchemaOptions): UnionType<AssertRest<T['items']>>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TSchema, K extends TTemplateLiteral>(schema: T, keys: K, options?: SchemaOptions): TIndex<T, TTemplateLiteralKeyRest<K>>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TSchema, K extends TLiteral<TPropertyKey>>(schema: T, keys: K, options?: SchemaOptions): TIndex<T, [K['const']]>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TSchema, K extends (keyof Static<T>)[]>(schema: T, keys: [...K], options?: SchemaOptions): TIndex<T, Assert<K, TPropertyKey[]>>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TSchema, K extends TUnion<TLiteral<TPropertyKey>[]>>(schema: T, keys: K, options?: SchemaOptions): TIndex<T, TUnionLiteralKeyRest<K>>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TSchema, K extends TSchema>(schema: T, key: K, options?: SchemaOptions): TSchema
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index(schema: TSchema, unresolved: any, options: SchemaOptions = {}): any {
    // prettier-ignore
    return (
      TypeGuard.TArray(schema) && TypeGuard.TNumber(unresolved) ? (() => {
        return TypeClone.Type(schema.items, options)
      })() : 
      TypeGuard.TTuple(schema) && TypeGuard.TNumber(unresolved) ? (() => {
        const items = ValueGuard.IsUndefined(schema.items) ? [] : schema.items
        const cloned = items.map((schema) => TypeClone.Type(schema))
        return this.Union(cloned, options)
      })() : (() => {
        const keys = KeyArrayResolver.Resolve(unresolved)
        const clone = TypeClone.Type(schema)
        return IndexedAccessor.Resolve(clone, keys, options)
      })()
    )
  }
  /** `[Json]` Creates an Integer type */
  public Integer(options: NumericOptions<number> = {}): TInteger {
    return this.Create({ ...options, [Kind]: 'Integer', type: 'integer' })
  }
  /** `[Json]` Creates an Intersect type */
  public Intersect(allOf: [], options?: SchemaOptions): TNever
  /** `[Json]` Creates an Intersect type */
  public Intersect<T extends [TSchema]>(allOf: [...T], options?: SchemaOptions): T[0]
  /** `[Json]` Creates an Intersect type */
  public Intersect<T extends TSchema[]>(allOf: [...T], options?: IntersectOptions): TIntersect<T>
  /** `[Json]` Creates an Intersect type */
  public Intersect(allOf: TSchema[], options: IntersectOptions = {}) {
    if (allOf.length === 0) return Type.Never()
    if (allOf.length === 1) return TypeClone.Type(allOf[0], options)
    if (allOf.some((schema) => TypeGuard.TTransform(schema))) this.Throw('Cannot intersect transform types')
    const objects = allOf.every((schema) => TypeGuard.TObject(schema))
    const cloned = TypeClone.Rest(allOf)
    // prettier-ignore
    const clonedUnevaluatedProperties = TypeGuard.TSchema(options.unevaluatedProperties) 
      ? { unevaluatedProperties: TypeClone.Type(options.unevaluatedProperties) } 
      : {}
    return options.unevaluatedProperties === false || TypeGuard.TSchema(options.unevaluatedProperties) || objects
      ? this.Create({ ...options, ...clonedUnevaluatedProperties, [Kind]: 'Intersect', type: 'object', allOf: cloned })
      : this.Create({ ...options, ...clonedUnevaluatedProperties, [Kind]: 'Intersect', allOf: cloned })
  }
  /** `[Json]` Creates a KeyOf type */
  public KeyOf<T extends TSchema>(schema: T, options: SchemaOptions = {}): TKeyOf<T> {
    // prettier-ignore
    return (
      TypeGuard.TRecord(schema) ? (() => {
        const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0]
        return (
          pattern === PatternNumberExact ? this.Number(options) :
          pattern === PatternStringExact ? this.String(options) :
          this.Throw('Unable to resolve key type from Record key pattern')
        )
      })() :
      TypeGuard.TTuple(schema) ? (() => {
        const items = ValueGuard.IsUndefined(schema.items) ? [] : schema.items
        const literals = items.map((_, index) => Type.Literal(index.toString()))
        return this.Union(literals, options)
      })() : 
      TypeGuard.TArray(schema) ? (() => {
        return this.Number(options)
      })() : (() => {
        const keys = KeyResolver.ResolveKeys(schema, { includePatterns: false })
        if (keys.length === 0) return this.Never(options) as TKeyOf<T>
        const literals = keys.map((key) => this.Literal(key))
        return this.Union(literals, options)
      })()
    ) as unknown as TKeyOf<T>
  }
  /** `[Json]` Creates a Literal type */
  public Literal<T extends TLiteralValue>(value: T, options: SchemaOptions = {}): TLiteral<T> {
    return this.Create({ ...options, [Kind]: 'Literal', const: value, type: typeof value as 'string' | 'number' | 'boolean' })
  }
  /** `[Json]` Intrinsic function to Lowercase LiteralString types */
  public Lowercase<T extends TSchema>(schema: T, options: SchemaOptions = {}): TIntrinsic<T, 'Lowercase'> {
    return { ...Intrinsic.Map(TypeClone.Type(schema), 'Lowercase'), ...options }
  }
  /** `[Json]` Creates a Never type */
  public Never(options: SchemaOptions = {}): TNever {
    return this.Create({ ...options, [Kind]: 'Never', not: {} })
  }
  /** `[Json]` Creates a Not type */
  public Not<T extends TSchema>(schema: T, options?: SchemaOptions): TNot<T> {
    return this.Create({ ...options, [Kind]: 'Not', not: TypeClone.Type(schema) })
  }
  /** `[Json]` Creates a Null type */
  public Null(options: SchemaOptions = {}): TNull {
    return this.Create({ ...options, [Kind]: 'Null', type: 'null' })
  }
  /** `[Json]` Creates a Number type */
  public Number(options: NumericOptions<number> = {}): TNumber {
    return this.Create({ ...options, [Kind]: 'Number', type: 'number' })
  }
  /** `[Json]` Creates an Object type */
  public Object<T extends TProperties>(properties: T, options: ObjectOptions = {}): TObject<T> {
    const propertyKeys = Object.getOwnPropertyNames(properties)
    const optionalKeys = propertyKeys.filter((key) => TypeGuard.TOptional(properties[key]))
    const requiredKeys = propertyKeys.filter((name) => !optionalKeys.includes(name))
    const clonedAdditionalProperties = TypeGuard.TSchema(options.additionalProperties) ? { additionalProperties: TypeClone.Type(options.additionalProperties) } : {}
    const clonedProperties = propertyKeys.reduce((acc, key) => ({ ...acc, [key]: TypeClone.Type(properties[key]) }), {} as TProperties)
    return requiredKeys.length > 0
      ? this.Create({ ...options, ...clonedAdditionalProperties, [Kind]: 'Object', type: 'object', properties: clonedProperties, required: requiredKeys })
      : this.Create({ ...options, ...clonedAdditionalProperties, [Kind]: 'Object', type: 'object', properties: clonedProperties })
  }
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends (keyof Static<T>)[]>(schema: T, keys: readonly [...K], options?: SchemaOptions): TOmit<T, K[number]>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TUnion<TLiteral<string>[]>>(schema: T, keys: K, options?: SchemaOptions): TOmit<T, TUnionLiteralKeyRest<K>[number]>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TLiteral<string>>(schema: T, key: K, options?: SchemaOptions): TOmit<T, K['const']>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TTemplateLiteral>(schema: T, key: K, options?: SchemaOptions): TOmit<T, TTemplateLiteralKeyRest<K>[number]>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TNever>(schema: T, key: K, options?: SchemaOptions): TOmit<T, never>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit(schema: TSchema, unresolved: any, options: SchemaOptions = {}): any {
    const keys = KeyArrayResolver.Resolve(unresolved)
    // prettier-ignore
    return ObjectMap.Map(this.Discard(TypeClone.Type(schema), ['$id', Transform]), (object) => {
      if (ValueGuard.IsArray(object.required)) {
        object.required = object.required.filter((key: string) => !keys.includes(key as any))
        if (object.required.length === 0) delete object.required
      }
      for (const key of Object.getOwnPropertyNames(object.properties)) {
        if (keys.includes(key as any)) delete object.properties[key]
      }
      return this.Create(object)
    }, options)
  }
  /** `[Json]` Constructs a type where all properties are optional */
  public Partial<T extends TSchema>(schema: T, options: ObjectOptions = {}): TPartial<T> {
    // prettier-ignore
    return ObjectMap.Map(this.Discard(TypeClone.Type(schema), ['$id', Transform]), (object) => {
      const properties = Object.getOwnPropertyNames(object.properties).reduce((acc, key) => {
        return { ...acc, [key]: this.Optional(object.properties[key]) }
      }, {} as TProperties)
      return this.Object(properties, this.Discard(object, ['required']) /* object used as options to retain other constraints */)
    }, options)
  }
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends (keyof Static<T>)[]>(schema: T, keys: readonly [...K], options?: SchemaOptions): TPick<T, K[number]>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TUnion<TLiteral<string>[]>>(schema: T, keys: K, options?: SchemaOptions): TPick<T, TUnionLiteralKeyRest<K>[number]>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TLiteral<string>>(schema: T, key: K, options?: SchemaOptions): TPick<T, K['const']>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TTemplateLiteral>(schema: T, key: K, options?: SchemaOptions): TPick<T, TTemplateLiteralKeyRest<K>[number]>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TNever>(schema: T, key: K, options?: SchemaOptions): TPick<T, never>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick(schema: TSchema, unresolved: any, options: SchemaOptions = {}): any {
    const keys = KeyArrayResolver.Resolve(unresolved)
    // prettier-ignore
    return ObjectMap.Map(this.Discard(TypeClone.Type(schema), ['$id', Transform]), (object) => {
      if (ValueGuard.IsArray(object.required)) {
        object.required = object.required.filter((key: any) => keys.includes(key))
        if (object.required.length === 0) delete object.required
      }
      for (const key of Object.getOwnPropertyNames(object.properties)) {
        if (!keys.includes(key as any)) delete object.properties[key]
      }
      return this.Create(object)
    }, options)
  }
  /** `[Json]` Creates a Record type */
  public Record<K extends TSchema, T extends TSchema>(key: K, schema: T, options: ObjectOptions = {}): TRecordResolve<K, T> {
    // prettier-ignore
    return (
      TypeGuard.TTemplateLiteral(key) ? (() => {
        const expression = TemplateLiteralParser.ParseExact(key.pattern)
        // prettier-ignore
        return TemplateLiteralFinite.Check(expression)
          ? (this.Object([...TemplateLiteralGenerator.Generate(expression)].reduce((acc, key) => ({ ...acc, [key]: TypeClone.Type(schema) }), {} as TProperties), options))
          : this.Create<any>({ ...options, [Kind]: 'Record', type: 'object', patternProperties: { [key.pattern]: TypeClone.Type(schema) }})
      })() :
      TypeGuard.TUnion(key) ? (() => {
        const union = UnionResolver.Resolve(key)
        if (TypeGuard.TUnionLiteral(union)) {
          const properties = union.anyOf.reduce((acc: any, literal: any) => ({ ...acc, [literal.const]: TypeClone.Type(schema) }), {} as TProperties)
          return this.Object(properties, { ...options, [Hint]: 'Record' })
        } else this.Throw('Record key of type union contains non-literal types')
      })() : 
      TypeGuard.TLiteral(key) ? (() => {
        // prettier-ignore
        return (ValueGuard.IsString(key.const) || ValueGuard.IsNumber(key.const))
        ? this.Object({ [key.const]: TypeClone.Type(schema) }, options)
        : this.Throw('Record key of type literal is not of type string or number')
      })() : 
      TypeGuard.TInteger(key) || TypeGuard.TNumber(key) ? (() => {
        return this.Create<any>({ ...options, [Kind]: 'Record', type: 'object', patternProperties: { [PatternNumberExact]: TypeClone.Type(schema) } })
      })() : 
      TypeGuard.TString(key) ? (() => {
        const pattern = ValueGuard.IsUndefined(key.pattern) ? PatternStringExact : key.pattern
        return this.Create<any>({ ...options, [Kind]: 'Record', type: 'object', patternProperties: { [pattern]: TypeClone.Type(schema) } })
      })() : 
      this.Never()
    )
  }
  /** `[Json]` Creates a Recursive type */
  public Recursive<T extends TSchema>(callback: (thisType: TThis) => T, options: SchemaOptions = {}): TRecursive<T> {
    if (ValueGuard.IsUndefined(options.$id)) (options as any).$id = `T${TypeOrdinal++}`
    const thisType = callback({ [Kind]: 'This', $ref: `${options.$id}` } as any)
    thisType.$id = options.$id
    return this.Create({ ...options, [Hint]: 'Recursive', ...thisType } as any)
  }
  /** `[Json]` Creates a Ref type. The referenced type must contain a $id */
  public Ref<T extends TSchema>(schema: T, options?: SchemaOptions): TRef<T>
  /** `[Json]` Creates a Ref type. */
  public Ref<T extends TSchema>($ref: string, options?: SchemaOptions): TRef<T>
  /** `[Json]` Creates a Ref type. */
  public Ref(unresolved: TSchema | string, options: SchemaOptions = {}) {
    if (ValueGuard.IsString(unresolved)) return this.Create({ ...options, [Kind]: 'Ref', $ref: unresolved })
    if (ValueGuard.IsUndefined(unresolved.$id)) this.Throw('Reference target type must specify an $id')
    return this.Create({ ...options, [Kind]: 'Ref', $ref: unresolved.$id! })
  }
  /** `[Json]` Constructs a type where all properties are required */
  public Required<T extends TSchema>(schema: T, options: SchemaOptions = {}): TRequired<T> {
    // prettier-ignore
    return ObjectMap.Map(this.Discard(TypeClone.Type(schema), ['$id', Transform]), (object) => {
      const properties = Object.getOwnPropertyNames(object.properties).reduce((acc, key) => {
        return { ...acc, [key]: this.Discard(object.properties[key], [Optional]) as TSchema }
      }, {} as TProperties)
      return this.Object(properties, object /* object used as options to retain other constraints  */)
    }, options)
  }
  /** `[Json]` Extracts interior Rest elements from Tuple, Intersect and Union types */
  public Rest<T extends TSchema>(schema: T): TRest<T> {
    return (
      TypeGuard.TTuple(schema) && !ValueGuard.IsUndefined(schema.items) ? TypeClone.Rest(schema.items) : TypeGuard.TIntersect(schema) ? TypeClone.Rest(schema.allOf) : TypeGuard.TUnion(schema) ? TypeClone.Rest(schema.anyOf) : []
    ) as TRest<T>
  }
  /** `[Json]` Creates a String type */
  public String(options: StringOptions = {}): TString {
    return this.Create({ ...options, [Kind]: 'String', type: 'string' })
  }
  /** `[Json]` Creates a TemplateLiteral type from template dsl string */
  public TemplateLiteral<T extends string>(templateDsl: T, options?: SchemaOptions): TTemplateLiteralDslParser<T>
  /** `[Json]` Creates a TemplateLiteral type */
  public TemplateLiteral<T extends TTemplateLiteralKind[]>(kinds: [...T], options?: SchemaOptions): TTemplateLiteral<T>
  /** `[Json]` Creates a TemplateLiteral type */
  public TemplateLiteral(unresolved: unknown, options: SchemaOptions = {}) {
    // prettier-ignore
    const pattern = ValueGuard.IsString(unresolved)
      ? TemplateLiteralPattern.Create(TemplateLiteralDslParser.Parse(unresolved))
      : TemplateLiteralPattern.Create(unresolved as TTemplateLiteralKind[])
    return this.Create({ ...options, [Kind]: 'TemplateLiteral', type: 'string', pattern })
  }
  /** `[Json]` Creates a Transform type */
  public Transform<I extends TSchema>(schema: I): TransformDecodeBuilder<I> {
    return new TransformDecodeBuilder(schema)
  }
  /** `[Json]` Creates a Tuple type */
  public Tuple<T extends TSchema[]>(items: [...T], options: SchemaOptions = {}): TTuple<T> {
    const [additionalItems, minItems, maxItems] = [false, items.length, items.length]
    const clonedItems = TypeClone.Rest(items)
    // prettier-ignore
    const schema = (items.length > 0 ? 
      { ...options, [Kind]: 'Tuple', type: 'array', items: clonedItems, additionalItems, minItems, maxItems } : 
      { ...options, [Kind]: 'Tuple', type: 'array', minItems, maxItems }) as any
    return this.Create(schema)
  }
  /** `[Json]` Intrinsic function to Uncapitalize LiteralString types */
  public Uncapitalize<T extends TSchema>(schema: T, options: SchemaOptions = {}): TIntrinsic<T, 'Uncapitalize'> {
    return { ...Intrinsic.Map(TypeClone.Type(schema), 'Uncapitalize'), ...options }
  }
  /** `[Json]` Creates a Union type */
  public Union(anyOf: [], options?: SchemaOptions): TNever
  /** `[Json]` Creates a Union type */
  public Union<T extends [TSchema]>(anyOf: [...T], options?: SchemaOptions): T[0]
  /** `[Json]` Creates a Union type */
  public Union<T extends TSchema[]>(anyOf: [...T], options?: SchemaOptions): TUnion<T>
  /** `[Json-Experimental]` Converts a TemplateLiteral into a Union */
  public Union<T extends TTemplateLiteral>(template: T): TUnionTemplateLiteral<T>
  /** `[Json]` Creates a Union type */
  public Union(union: TSchema[] | TTemplateLiteral, options: SchemaOptions = {}) {
    // prettier-ignore
    return TypeGuard.TTemplateLiteral(union) 
      ? TemplateLiteralResolver.Resolve(union)
      : (() => {
        const anyOf = union
        if (anyOf.length === 0) return this.Never(options)
        if (anyOf.length === 1) return this.Create(TypeClone.Type(anyOf[0], options))
        const clonedAnyOf = TypeClone.Rest(anyOf)
        return this.Create({ ...options, [Kind]: 'Union', anyOf: clonedAnyOf })
      })()
  }
  /** `[Json]` Creates an Unknown type */
  public Unknown(options: SchemaOptions = {}): TUnknown {
    return this.Create({ ...options, [Kind]: 'Unknown' })
  }
  /** `[Json]` Creates a Unsafe type that will infers as the generic argument T */
  public Unsafe<T>(options: UnsafeOptions = {}): TUnsafe<T> {
    return this.Create({ ...options, [Kind]: options[Kind] || 'Unsafe' })
  }
  /** `[Json]` Intrinsic function to Uppercase LiteralString types */
  public Uppercase<T extends TSchema>(schema: T, options: SchemaOptions = {}): TIntrinsic<T, 'Uppercase'> {
    return { ...Intrinsic.Map(TypeClone.Type(schema), 'Uppercase'), ...options }
  }
}
// --------------------------------------------------------------------------
// JavaScriptTypeBuilder
// --------------------------------------------------------------------------
export class JavaScriptTypeBuilder extends JsonTypeBuilder {
  /** `[JavaScript]` Creates a AsyncIterator type */
  public AsyncIterator<T extends TSchema>(items: T, options: SchemaOptions = {}): TAsyncIterator<T> {
    return this.Create({ ...options, [Kind]: 'AsyncIterator', type: 'AsyncIterator', items: TypeClone.Type(items) })
  }
  /** `[JavaScript]` Constructs a type by recursively unwrapping Promise types */
  public Awaited<T extends TSchema>(schema: T, options: SchemaOptions = {}): TAwaited<T> {
    // prettier-ignore
    const Unwrap = (rest: TSchema[]): TSchema[] => rest.length > 0 ? (() => {
      const [L, ...R] = rest
      return [this.Awaited(L), ...Unwrap(R)]
    })() : rest
    // prettier-ignore
    return (
      TypeGuard.TIntersect(schema) ? Type.Intersect(Unwrap(schema.allOf)) : 
      TypeGuard.TUnion(schema) ? Type.Union(Unwrap(schema.anyOf)) :
      TypeGuard.TPromise(schema) ? this.Awaited(schema.item) : 
      TypeClone.Type(schema, options)
    ) as TAwaited<T>
  }
  /** `[JavaScript]` Creates a BigInt type */
  public BigInt(options: NumericOptions<bigint> = {}): TBigInt {
    return this.Create({ ...options, [Kind]: 'BigInt', type: 'bigint' })
  }
  /** `[JavaScript]` Extracts the ConstructorParameters from the given Constructor type */
  public ConstructorParameters<T extends TConstructor<any[], any>>(schema: T, options: SchemaOptions = {}): TConstructorParameters<T> {
    return this.Tuple([...schema.parameters], { ...options })
  }
  /** `[JavaScript]` Creates a Constructor type */
  public Constructor<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TConstructor<T, U> {
    const [clonedParameters, clonedReturns] = [TypeClone.Rest(parameters), TypeClone.Type(returns)]
    return this.Create({ ...options, [Kind]: 'Constructor', type: 'Constructor', parameters: clonedParameters, returns: clonedReturns })
  }
  /** `[JavaScript]` Creates a Date type */
  public Date(options: DateOptions = {}): TDate {
    return this.Create({ ...options, [Kind]: 'Date', type: 'Date' })
  }
  /** `[JavaScript]` Creates a Function type */
  public Function<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TFunction<T, U> {
    const [clonedParameters, clonedReturns] = [TypeClone.Rest(parameters), TypeClone.Type(returns)]
    return this.Create({ ...options, [Kind]: 'Function', type: 'Function', parameters: clonedParameters, returns: clonedReturns })
  }
  /** `[JavaScript]` Extracts the InstanceType from the given Constructor type */
  public InstanceType<T extends TConstructor<any[], any>>(schema: T, options: SchemaOptions = {}): TInstanceType<T> {
    return TypeClone.Type(schema.returns, options)
  }
  /** `[JavaScript]` Creates an Iterator type */
  public Iterator<T extends TSchema>(items: T, options: SchemaOptions = {}): TIterator<T> {
    return this.Create({ ...options, [Kind]: 'Iterator', type: 'Iterator', items: TypeClone.Type(items) })
  }
  /** `[JavaScript]` Extracts the Parameters from the given Function type */
  public Parameters<T extends TFunction<any[], any>>(schema: T, options: SchemaOptions = {}): TParameters<T> {
    return this.Tuple(schema.parameters, { ...options })
  }
  /** `[JavaScript]` Creates a Promise type */
  public Promise<T extends TSchema>(item: T, options: SchemaOptions = {}): TPromise<T> {
    return this.Create({ ...options, [Kind]: 'Promise', type: 'Promise', item: TypeClone.Type(item) })
  }
  /** `[JavaScript]` Creates a String type from a Regular Expression pattern */
  public RegExp(pattern: string, options?: SchemaOptions): TString
  /** `[JavaScript]` Creates a String type from a Regular Expression */
  public RegExp(regex: RegExp, options?: SchemaOptions): TString
  /** `[Extended]` Creates a String type */
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
  /** `[JavaScript]` Extracts the ReturnType from the given Function type */
  public ReturnType<T extends TFunction<any[], any>>(schema: T, options: SchemaOptions = {}): TReturnType<T> {
    return TypeClone.Type(schema.returns, options)
  }
  /** `[JavaScript]` Creates a Symbol type */
  public Symbol(options?: SchemaOptions): TSymbol {
    return this.Create({ ...options, [Kind]: 'Symbol', type: 'symbol' })
  }
  /** `[JavaScript]` Creates a Undefined type */
  public Undefined(options: SchemaOptions = {}): TUndefined {
    return this.Create({ ...options, [Kind]: 'Undefined', type: 'undefined' })
  }
  /** `[JavaScript]` Creates a Uint8Array type */
  public Uint8Array(options: Uint8ArrayOptions = {}): TUint8Array {
    return this.Create({ ...options, [Kind]: 'Uint8Array', type: 'Uint8Array' })
  }
  /** `[JavaScript]` Creates a Void type */
  public Void(options: SchemaOptions = {}): TVoid {
    return this.Create({ ...options, [Kind]: 'Void', type: 'void' })
  }
}
/** Json Type Builder with Static Resolution for TypeScript */
export const JsonType = new JsonTypeBuilder()
/** JavaScript Type Builder with Static Resolution for TypeScript */
export const Type = new JavaScriptTypeBuilder()
