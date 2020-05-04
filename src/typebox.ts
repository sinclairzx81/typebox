/*--------------------------------------------------------------------------

TypeBox: JSON Schema Type Builder with Static Type Resolution for TypeScript

The MIT License (MIT)

Copyright (c) 2020 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

function reflect(value: any): 'string' | 'number' | 'boolean' | 'unknown' {
  switch (typeof value) {
    case 'string': return 'string'
    case 'number': return 'number'
    case 'boolean': return 'boolean'
    default: return 'unknown'
  }
}

export interface UserDefinedOptions {
  [prop: string]: any
}

// #region TContract

export type TFunction8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema, U extends TSchema> = { type: 'function', arguments: [T0, T1, T2, T3, T4, T5, T6, T7], returns: U } & UserDefinedOptions
export type TFunction7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, U extends TSchema> = { type: 'function', arguments: [T0, T1, T2, T3, T4, T5, T6], returns: U } & UserDefinedOptions
export type TFunction6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, U extends TSchema> = { type: 'function', arguments: [T0, T1, T2, T3, T4, T5], returns: U } & UserDefinedOptions
export type TFunction5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, U extends TSchema> = { type: 'function', arguments: [T0, T1, T2, T3, T4], returns: U } & UserDefinedOptions
export type TFunction4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, U extends TSchema> = { type: 'function', arguments: [T0, T1, T2, T3], returns: U } & UserDefinedOptions
export type TFunction3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, U extends TSchema> = { type: 'function', arguments: [T0, T1, T2], returns: U } & UserDefinedOptions
export type TFunction2<T0 extends TSchema, T1 extends TSchema, U extends TSchema> = { type: 'function', arguments: [T0, T1], returns: U } & UserDefinedOptions
export type TFunction1<T0 extends TSchema, U extends TSchema> = { type: 'function', arguments: [T0], returns: U } & UserDefinedOptions
export type TFunction0<U extends TSchema> = { type: 'function', arguments: [], returns: U } & UserDefinedOptions
export type TFunction = TFunction8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction5<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction4<TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction3<TSchema, TSchema, TSchema, TSchema> |
  TFunction2<TSchema, TSchema, TSchema> |
  TFunction1<TSchema, TSchema> |
  TFunction0<TSchema>

export type TConstructor8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema, U extends TSchema> = { type: 'constructor', arguments: [T0, T1, T2, T3, T4, T5, T6, T7], returns: U } & UserDefinedOptions
export type TConstructor7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, U extends TSchema> = { type: 'constructor', arguments: [T0, T1, T2, T3, T4, T5, T6], returns: U } & UserDefinedOptions
export type TConstructor6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, U extends TSchema> = { type: 'constructor', arguments: [T0, T1, T2, T3, T4, T5], returns: U } & UserDefinedOptions
export type TConstructor5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, U extends TSchema> = { type: 'constructor', arguments: [T0, T1, T2, T3, T4], returns: U } & UserDefinedOptions
export type TConstructor4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, U extends TSchema> = { type: 'constructor', arguments: [T0, T1, T2, T3], returns: U } & UserDefinedOptions
export type TConstructor3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, U extends TSchema> = { type: 'constructor', arguments: [T0, T1, T2], returns: U } & UserDefinedOptions
export type TConstructor2<T0 extends TSchema, T1 extends TSchema, U extends TSchema> = { type: 'constructor', arguments: [T0, T1], returns: U } & UserDefinedOptions
export type TConstructor1<T0 extends TSchema, U extends TSchema> = { type: 'constructor', arguments: [T0], returns: U } & UserDefinedOptions
export type TConstructor0<U extends TSchema> = { type: 'constructor', arguments: [], returns: U } & UserDefinedOptions
export type TConstructor = TConstructor8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TConstructor7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TConstructor6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TConstructor5<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TConstructor4<TSchema, TSchema, TSchema, TSchema, TSchema> |
  TConstructor3<TSchema, TSchema, TSchema, TSchema> |
  TConstructor2<TSchema, TSchema, TSchema> |
  TConstructor1<TSchema, TSchema> |
  TConstructor0<TSchema>

export type TContract = TFunction | TConstructor | TPromise<any> | TVoid | TUndefined
export type TPromise<T extends TSchema | TVoid | TUndefined> = { type: 'promise', item: T } & UserDefinedOptions
export type TUndefined = { type: 'undefined' } & UserDefinedOptions
export type TVoid = { type: 'void' } & UserDefinedOptions

// #endregion

// #region TComposite

export type TIntersect8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema> = { allOf: [T0, T1, T2, T3, T4, T5, T6, T7] } & UserDefinedOptions
export type TIntersect7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema> = { allOf: [T0, T1, T2, T3, T4, T5, T6] } & UserDefinedOptions
export type TIntersect6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema> = { allOf: [T0, T1, T2, T3, T4, T5] } & UserDefinedOptions
export type TIntersect5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema> = { allOf: [T0, T1, T2, T3, T4] } & UserDefinedOptions
export type TIntersect4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema> = { allOf: [T0, T1, T2, T3] } & UserDefinedOptions
export type TIntersect3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema> = { allOf: [T0, T1, T2] } & UserDefinedOptions
export type TIntersect2<T0 extends TSchema, T1 extends TSchema> = { allOf: [T0, T1] } & UserDefinedOptions
export type TIntersect1<T0 extends TSchema> = { allOf: [T0] } & UserDefinedOptions
export type TIntersect = TIntersect8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TIntersect7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TIntersect6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TIntersect5<TSchema, TSchema, TSchema, TSchema, TSchema> |
  TIntersect4<TSchema, TSchema, TSchema, TSchema> |
  TIntersect3<TSchema, TSchema, TSchema> |
  TIntersect2<TSchema, TSchema> |
  TIntersect1<TSchema>;

export type TUnion8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema> = { oneOf: [T0, T1, T2, T3, T4, T5, T6, T7] } & UserDefinedOptions
export type TUnion7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema> = { oneOf: [T0, T1, T2, T3, T4, T5, T6] } & UserDefinedOptions
export type TUnion6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema> = { oneOf: [T0, T1, T2, T3, T4, T5] } & UserDefinedOptions
export type TUnion5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema> = { oneOf: [T0, T1, T2, T3, T4] } & UserDefinedOptions
export type TUnion4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema> = { oneOf: [T0, T1, T2, T3] } & UserDefinedOptions
export type TUnion3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema> = { oneOf: [T0, T1, T2] } & UserDefinedOptions
export type TUnion2<T0 extends TSchema, T1 extends TSchema> = { oneOf: [T0, T1] } & UserDefinedOptions
export type TUnion1<T0 extends TSchema> = { oneOf: [T0] } & UserDefinedOptions
export type TUnion = TUnion8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TUnion7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TUnion6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TUnion5<TSchema, TSchema, TSchema, TSchema, TSchema> |
  TUnion4<TSchema, TSchema, TSchema, TSchema> |
  TUnion3<TSchema, TSchema, TSchema> |
  TUnion2<TSchema, TSchema> |
  TUnion1<TSchema>;


export type TTuple8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema> = { type: 'array', items: [T0, T1, T2, T3, T4, T5, T6, T7], additionalItems: false, minItems: 8, maxItems: 8 } & UserDefinedOptions
export type TTuple7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema> = { type: 'array', items: [T0, T1, T2, T3, T4, T5, T6], additionalItems: false, minItems: 7, maxItems: 7 } & UserDefinedOptions
export type TTuple6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema> = { type: 'array', items: [T0, T1, T2, T3, T4, T5], additionalItems: false, minItems: 6, maxItems: 6 } & UserDefinedOptions
export type TTuple5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema> = { type: 'array', items: [T0, T1, T2, T3, T4], additionalItems: false, minItems: 5, maxItems: 5 } & UserDefinedOptions
export type TTuple4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema> = { type: 'array', items: [T0, T1, T2, T3], additionalItems: false, minItems: 4, maxItems: 4 } & UserDefinedOptions
export type TTuple3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema> = { type: 'array', items: [T0, T1, T2], additionalItems: false, minItems: 3, maxItems: 3 } & UserDefinedOptions
export type TTuple2<T0 extends TSchema, T1 extends TSchema> = { type: 'array', items: [T0, T1], additionalItems: false, minItems: 2, maxItems: 2 } & UserDefinedOptions
export type TTuple1<T0 extends TSchema> = { type: 'array', items: [T0], additionalItems: false, minItems: 1, maxItems: 1 } & UserDefinedOptions
export type TTuple = TTuple8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TTuple7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TTuple6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TTuple5<TSchema, TSchema, TSchema, TSchema, TSchema> |
  TTuple4<TSchema, TSchema, TSchema, TSchema> |
  TTuple3<TSchema, TSchema, TSchema> |
  TTuple2<TSchema, TSchema> |
  TTuple1<TSchema>;

export type TComposite = TIntersect | TUnion | TTuple

// #endregion

// #region TModifier

export const ReadonlyOptional = Symbol('ReadonlyOptional')
export const Readonly = Symbol('Readonly')
export const Optional = Symbol('Optional')

export type TOptional<T extends TSchema | TComposite> = T & { modifier: typeof Optional }
export type TReadonly<T extends TSchema | TComposite> = T & { modifier: typeof Readonly }
export type TReadonlyOptional<T extends TSchema | TComposite> = T & { modifier: typeof ReadonlyOptional }
export type TModifier = TOptional<any> | TReadonly<any> | TReadonlyOptional<any>

// #endregion

// #region TSchema

export type FormatOption =
  | 'date-time' | 'time' | 'date' | 'email' | 'idn-email' | 'hostname'
  | 'idn-hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uri-reference' | 'iri' | 'uuid'
  | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer'
  | 'regex'

export type ArrayOptions = {
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
} & UserDefinedOptions

export type NumberOptions = {
  minimum?: number
  exclusiveMinimum?: number
  maximum?: number
  exclusiveMaximum?: number
  multipleOf?: number
} & UserDefinedOptions

/** Augmentation support for UserDefinedOptions. Used specifically for adding custom string formats. */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true
export declare type StringOptions = {
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: IsUnion<UserDefinedOptions['format']> extends true 
    ? UserDefinedOptions['format'] | FormatOption 
    : FormatOption;
} & Omit<UserDefinedOptions, 'format'>

export type TLiteral = TStringLiteral<string> | TNumberLiteral<number> | TBooleanLiteral<boolean>
export type TStringLiteral<T> = { type: 'string', enum: [T] } & UserDefinedOptions
export type TNumberLiteral<T> = { type: 'number', enum: [T] } & UserDefinedOptions
export type TBooleanLiteral<T> = { type: 'boolean', enum: [T] } & UserDefinedOptions
export type TProperties = { [key: string]: TSchema | TComposite | TOptional<TSchema | TComposite> | TReadonly<TSchema | TComposite> }
export type TObject<T extends TProperties> = { type: 'object', properties: T, required: string[] } & UserDefinedOptions
export type TMap<T extends TSchema | TComposite> = { type: 'object', additionalProperties: T } & UserDefinedOptions
export type TArray<T extends TSchema | TComposite> = { type: 'array', items: T } & ArrayOptions
export type TEnum<T extends string | number> = { enum: Array<T> } & UserDefinedOptions
export type TNumber = { type: 'number' } & NumberOptions
export type TInteger = { type: 'integer' } & NumberOptions
export type TString = { type: 'string' } & StringOptions
export type TBoolean = { type: 'boolean' } & UserDefinedOptions
export type TNull = { type: 'null' } & UserDefinedOptions
export type TAny = {} & UserDefinedOptions


export type TSchema = TLiteral | TNumber | TInteger | TBoolean | TString | TObject<any> | TArray<any> | TEnum<any> | TMap<any> | TNull | TAny

// #endregion

// #region StaticContract

type StaticFunction<T> =
  T extends TFunction8<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>, arg5: Static<U5>, arg6: Static<U6>, arg7: Static<U7>) => Static<R> :
  T extends TFunction7<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>, arg5: Static<U5>, arg6: Static<U6>) => Static<R> :
  T extends TFunction6<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>, arg5: Static<U5>) => Static<R> :
  T extends TFunction5<infer U0, infer U1, infer U2, infer U3, infer U4, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>) => Static<R> :
  T extends TFunction4<infer U0, infer U1, infer U2, infer U3, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>) => Static<R> :
  T extends TFunction3<infer U0, infer U1, infer U2, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>) => Static<R> :
  T extends TFunction2<infer U0, infer U1, infer R> ? (arg0: Static<U0>, arg1: Static<U1>) => Static<R> :
  T extends TFunction1<infer U0, infer R> ? (arg0: Static<U0>) => Static<R> :
  T extends TFunction0<infer R> ? () => Static<R> :
  never;


type StaticConstructor<T> =
  T extends TConstructor8<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7, infer R> ? new (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>, arg5: Static<U5>, arg6: Static<U6>, arg7: Static<U7>) => Static<R> :
  T extends TConstructor7<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer R> ? new (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>, arg5: Static<U5>, arg6: Static<U6>) => Static<R> :
  T extends TConstructor6<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer R> ? new (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>, arg5: Static<U5>) => Static<R> :
  T extends TConstructor5<infer U0, infer U1, infer U2, infer U3, infer U4, infer R> ? new (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>) => Static<R> :
  T extends TConstructor4<infer U0, infer U1, infer U2, infer U3, infer R> ? new (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>) => Static<R> :
  T extends TConstructor3<infer U0, infer U1, infer U2, infer R> ? new (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>) => Static<R> :
  T extends TConstructor2<infer U0, infer U1, infer R> ? new (arg0: Static<U0>, arg1: Static<U1>) => Static<R> :
  T extends TConstructor1<infer U0, infer R> ? new (arg0: Static<U0>) => Static<R> :
  T extends TConstructor0<infer R> ? new () => Static<R> :
  never;

type StaticContract<T extends TContract> =
  T extends TFunction ? StaticFunction<T> :
  T extends TConstructor ? StaticConstructor<T> :
  T extends TPromise<infer U> ? Promise<Static<U>> :
  T extends TVoid ? void :
  T extends TUndefined ? undefined :
  never;

// #endregion

// #region StaticComposite

type StaticIntersect<T> =
  T extends TIntersect8<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> & StaticSchema<U4> & StaticSchema<U5> & StaticSchema<U6> & StaticSchema<U7> :
  T extends TIntersect7<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> & StaticSchema<U4> & StaticSchema<U5> & StaticSchema<U6> :
  T extends TIntersect6<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> & StaticSchema<U4> & StaticSchema<U5> :
  T extends TIntersect5<infer U0, infer U1, infer U2, infer U3, infer U4> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> & StaticSchema<U4> :
  T extends TIntersect4<infer U0, infer U1, infer U2, infer U3> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> :
  T extends TIntersect3<infer U0, infer U1, infer U2> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> :
  T extends TIntersect2<infer U0, infer U1> ? StaticSchema<U1> & StaticSchema<U0> :
  T extends TIntersect1<infer U0> ? StaticSchema<U0> :
  never;

type StaticUnion<T> =
  T extends TUnion8<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> | StaticSchema<U4> | StaticSchema<U5> | StaticSchema<U6> | StaticSchema<U7> :
  T extends TUnion7<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> | StaticSchema<U4> | StaticSchema<U5> | StaticSchema<U6> :
  T extends TUnion6<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> | StaticSchema<U4> | StaticSchema<U5> :
  T extends TUnion5<infer U0, infer U1, infer U2, infer U3, infer U4> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> | StaticSchema<U4> :
  T extends TUnion4<infer U0, infer U1, infer U2, infer U3> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> :
  T extends TUnion3<infer U0, infer U1, infer U2> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> :
  T extends TUnion2<infer U0, infer U1> ? StaticSchema<U0> | StaticSchema<U1> :
  T extends TUnion1<infer U0> ? StaticSchema<U0> :
  never;

type StaticTuple<T> =
  T extends TTuple8<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>, Static<U4>, Static<U5>, Static<U6>, Static<U7>] :
  T extends TTuple7<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>, Static<U4>, Static<U5>, Static<U6>] :
  T extends TTuple6<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>, Static<U4>, Static<U5>] :
  T extends TTuple5<infer U0, infer U1, infer U2, infer U3, infer U4> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>, Static<U4>] :
  T extends TTuple4<infer U0, infer U1, infer U2, infer U3> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>] :
  T extends TTuple3<infer U0, infer U1, infer U2> ? [Static<U0>, Static<U1>, Static<U2>] :
  T extends TTuple2<infer U0, infer U1> ? [Static<U0>, Static<U1>] :
  T extends TTuple1<infer U0> ? [Static<U0>] :
  never;

type StaticComposite<T extends TComposite> =
  T extends TIntersect ? StaticIntersect<T> :
  T extends TUnion ? StaticUnion<T> :
  T extends TTuple ? StaticTuple<T> :
  never;

// #endregion

// #region StaticSchema

type StaticLiteral<T> =
  T extends TStringLiteral<infer U> ? U :
  T extends TNumberLiteral<infer U> ? U :
  T extends TBooleanLiteral<infer U> ? U :
  never;

// Extract 'optional', 'readonly' and 'general' property keys from T
type ReadonlyOptionalPropertyKeys<T> = { [K in keyof T]: T[K] extends TReadonlyOptional<infer U> ? K : never }[keyof T]
type ReadonlyPropertyKeys<T> = { [K in keyof T]: T[K] extends TReadonly<infer U> ? K : never }[keyof T]
type OptionalPropertyKeys<T> = { [K in keyof T]: T[K] extends TOptional<infer U> ? K : never }[keyof T]
type PropertyKeys<T> = keyof Omit<T, OptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | ReadonlyOptionalPropertyKeys<T>>

type StaticObjectPropertiesExpansion<T> =
  { readonly [K in ReadonlyOptionalPropertyKeys<T>]?: Static<T[K]> } &
  { readonly [K in ReadonlyPropertyKeys<T>]: Static<T[K]> } &
  { [K in OptionalPropertyKeys<T>]?: Static<T[K]> } &
  { [K in PropertyKeys<T>]: Static<T[K]> }

type StaticObjectProperties<T> = {
  [K in keyof StaticObjectPropertiesExpansion<T>]: StaticObjectPropertiesExpansion<T>[K]
}

type StaticSchema<T extends TSchema> =
  T extends TObject<infer U> ? StaticObjectProperties<U> :
  T extends TMap<infer U> ? { [key: string]: Static<U> } :
  T extends TArray<infer U> ? Array<Static<U>> :
  T extends TEnum<infer U> ? U :
  T extends TLiteral ? StaticLiteral<T> :
  T extends TString ? string :
  T extends TNumber ? number :
  T extends TInteger ? number :
  T extends TBoolean ? boolean :
  T extends TNull ? null :
  T extends TAny ? any :
  never;

// #endregion

export type TStatic = TComposite | TSchema | TContract | TModifier

// Static
export type Static<T extends TStatic> =
  T extends TContract ? StaticContract<T> :
  T extends TComposite ? StaticComposite<T> :
  T extends TSchema ? StaticSchema<T> :
  never;

export class Type {

  // #region TModifier

  /** Modifies the inner type T into a readonly optional T. */
  public static ReadonlyOptional<T extends TSchema | TUnion | TIntersect>(item: T): TReadonlyOptional<T> {
    return { ...item, modifier: ReadonlyOptional }
  }

  /** Modifies the inner type T into an optional T. */
  public static Optional<T extends TSchema | TUnion | TIntersect>(item: T): TOptional<T> {
    return { ...item, modifier: Optional }
  }

  /** Modifies the inner type T into an readonly T. */
  public static Readonly<T extends TSchema | TUnion | TIntersect>(item: T): TReadonly<T> {
    return { ...item, modifier: Readonly }
  }

  // #endregion

  // #region TComposite

  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema>(items: [T0, T1, T2, T3, T4, T5, T6, T7], options?: UserDefinedOptions): TUnion8<T0, T1, T2, T3, T4, T5, T6, T7>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema>(items: [T0, T1, T2, T3, T4, T5, T6], options?: UserDefinedOptions): TUnion7<T0, T1, T2, T3, T4, T5, T6>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema>(items: [T0, T1, T2, T3, T4, T5], options?: UserDefinedOptions): TUnion6<T0, T1, T2, T3, T4, T5>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema>(items: [T0, T1, T2, T3, T4], options?: UserDefinedOptions): TUnion5<T0, T1, T2, T3, T4>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema>(items: [T0, T1, T2, T3], options?: UserDefinedOptions): TUnion4<T0, T1, T2, T3>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema>(items: [T0, T1, T2], options?: UserDefinedOptions): TUnion3<T0, T1, T2>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema>(items: [T0, T1], options?: UserDefinedOptions): TUnion2<T0, T1>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema>(items: [T0], options?: UserDefinedOptions): TUnion1<T0>
  /** Creates a Union type for the given arguments. */
  public static Union(items: TSchema[], options: UserDefinedOptions = {}): TUnion {
    return { ...options, oneOf: items } as TUnion
  }

  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema>(items: [T0, T1, T2, T3, T4, T5, T6, T7], options?: UserDefinedOptions): TIntersect8<T0, T1, T2, T3, T4, T5, T6, T7>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema>(items: [T0, T1, T2, T3, T4, T5, T6], options?: UserDefinedOptions): TIntersect7<T0, T1, T2, T3, T4, T5, T6>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema>(items: [T0, T1, T2, T3, T4, T5], options?: UserDefinedOptions): TIntersect6<T0, T1, T2, T3, T4, T5>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema>(items: [T0, T1, T2, T3, T4], options?: UserDefinedOptions): TIntersect5<T0, T1, T2, T3, T4>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema>(items: [T0, T1, T2, T3], options?: UserDefinedOptions): TIntersect4<T0, T1, T2, T3>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema>(items: [T0, T1, T2], options?: UserDefinedOptions): TIntersect3<T0, T1, T2>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema>(items: [T0, T1], options?: UserDefinedOptions): TIntersect2<T0, T1>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema>(items: [T0], options?: UserDefinedOptions): TIntersect1<T0>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect(items: TSchema[], options: UserDefinedOptions = {}): TIntersect {
    return { ...options, allOf: items } as TIntersect
  }

  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema>(items: [T0, T1, T2, T3, T4, T5, T6, T7], options?: UserDefinedOptions): TTuple8<T0, T1, T2, T3, T4, T5, T6, T7>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema>(items: [T0, T1, T2, T3, T4, T5, T6], options?: UserDefinedOptions): TTuple7<T0, T1, T2, T3, T4, T5, T6>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema>(items: [T0, T1, T2, T3, T4, T5], options?: UserDefinedOptions): TTuple6<T0, T1, T2, T3, T4, T5>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema>(items: [T0, T1, T2, T3, T4], options?: UserDefinedOptions): TTuple5<T0, T1, T2, T3, T4>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema>(items: [T0, T1, T2, T3], options?: UserDefinedOptions): TTuple4<T0, T1, T2, T3>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema>(items: [T0, T1, T2], options?: UserDefinedOptions): TTuple3<T0, T1, T2>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema>(items: [T0, T1], options?: UserDefinedOptions): TTuple2<T0, T1>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema>(items: [T0], options?: UserDefinedOptions): TTuple1<T0>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple(items: TSchema[], options: UserDefinedOptions = {}): TTuple {
    const type = 'array'
    const additionalItems = false
    const minItems = items.length
    const maxItems = items.length
    return { ...options, type, items, additionalItems, minItems, maxItems } as TTuple
  }

  // #endregion

  // #region TContract

  /** Creates a `function` type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, T7 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6, T7], returns: U, options?: UserDefinedOptions): TFunction8<T0, T1, T2, T3, T4, T5, T6, T7, U>
  /** Creates a `function` type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6], returns: U, options?: UserDefinedOptions): TFunction7<T0, T1, T2, T3, T4, T5, T6, U>
  /** Creates a `function` type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5], returns: U, options?: UserDefinedOptions): TFunction6<T0, T1, T2, T3, T4, T5, U>
  /** Creates a `function` type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4], returns: U, options?: UserDefinedOptions): TFunction5<T0, T1, T2, T3, T4, U>
  /** Creates a `function` type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3], returns: U, options?: UserDefinedOptions): TFunction4<T0, T1, T2, T3, U>
  /** Creates a `function` type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, U extends TStatic>(args: [T0, T1, T2], returns: U, options?: UserDefinedOptions): TFunction3<T0, T1, T2, U>
  /** Creates a `function` type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, U extends TStatic>(args: [T0, T1], returns: U, options?: UserDefinedOptions): TFunction2<T0, T1, U>
  /** Creates a `function` type for the given arguments. */
  public static Function<T0 extends TStatic, U extends TStatic>(args: [T0], returns: U, options?: UserDefinedOptions): TFunction1<T0, U>
  /** Creates a `function` type for the given arguments. */
  public static Function<U extends TStatic>(args: [], returns: U, options?: UserDefinedOptions): TFunction0<U>
  /** Creates a `function` type for the given arguments. */
  public static Function(args: TStatic[], returns: TStatic, options: UserDefinedOptions = {}): TFunction {
    return { ...options, type: 'function', arguments: args, returns } as TFunction
  }

  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, T7 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6, T7], returns: U, options?: UserDefinedOptions): TConstructor8<T0, T1, T2, T3, T4, T5, T6, T7, U>
  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6], returns: U, options?: UserDefinedOptions): TConstructor7<T0, T1, T2, T3, T4, T5, T6, U>
  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5], returns: U, options?: UserDefinedOptions): TConstructor6<T0, T1, T2, T3, T4, T5, U>
  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4], returns: U, options?: UserDefinedOptions): TConstructor5<T0, T1, T2, T3, T4, U>
  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3], returns: U, options?: UserDefinedOptions): TConstructor4<T0, T1, T2, T3, U>
  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, U extends TStatic>(args: [T0, T1, T2], returns: U, options?: UserDefinedOptions): TConstructor3<T0, T1, T2, U>
  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, U extends TStatic>(args: [T0, T1], returns: U, options?: UserDefinedOptions): TConstructor2<T0, T1, U>
  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<T0 extends TStatic, U extends TStatic>(args: [T0], returns: U, options?: UserDefinedOptions): TConstructor1<T0, U>
  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<U extends TStatic>(args: [], returns: U, options?: UserDefinedOptions): TConstructor0<U>
  /** Creates a `constructor` type for the given arguments. */
  public static Constructor(args: TStatic[], returns: TStatic, options: UserDefinedOptions = {}): TConstructor {
    return { ...options, type: 'constructor', arguments: args, returns } as TConstructor
  }

  /** Creates a `Promise<T>` type. */
  public static Promise<T extends TSchema>(item: T, options: UserDefinedOptions = {}): TPromise<T> {
    return { ...options, type: 'promise', item }
  }

  /** Creates a `void` type. */
  public static Void(options: UserDefinedOptions = {}): TVoid {
    return { ...options, type: 'void' }
  }

  /** Creates a `undefined` type. */
  public static Undefined(options: UserDefinedOptions = {}): TUndefined {
    return { ...options, type: 'undefined' }
  }

  // #endregion

  // #region TSchema

  /** Creates a `string` literal for the given value. */
  public static Literal<T extends string>(value: T, options?: UserDefinedOptions): TStringLiteral<T>
  /** Creates a `number` literal for the given value. */
  public static Literal<T extends number>(value: T, options?: UserDefinedOptions): TNumberLiteral<T>
  /** Creates a `boolean` literal for the given value. */
  public static Literal<T extends boolean>(value: T, options?: UserDefinedOptions): TBooleanLiteral<T>
  /** Creates a literal from the given value. */
  public static Literal(value: string | number | boolean, options: UserDefinedOptions = {}): TLiteral {
    const type = reflect(value)
    if (type === 'unknown') { throw Error('Invalid literal value') }
    return { ...options, type, enum: [value] } as TLiteral
  }

  /** Creates a `object` type with the given properties. */
  public static Object<T extends TProperties>(properties: T, options: UserDefinedOptions = {}): TObject<T> {
    const property_names = Object.keys(properties)
    const optional = property_names.filter(name => {
      const candidate = properties[name] as TModifier
      return (candidate.modifier &&
        (candidate.modifier === ReadonlyOptional ||
          candidate.modifier === Optional))
    })
    const required = property_names.filter(name => !optional.includes(name))
    return { ...options, type: 'object', properties, required }
  }

  /** Creates a `{[key: string]: T}` type for the given item. */
  public static Map<T extends TSchema | TUnion | TIntersect | TTuple>(item: T, options: UserDefinedOptions = {}): TMap<T> {
    const additionalProperties = item
    return { ...options, type: 'object', additionalProperties }
  }

  /** Creates an `Array<T>` type for the given item.` */
  public static Array<T extends TSchema | TUnion | TIntersect | TTuple>(items: T, options: ArrayOptions = {}): TArray<T> {
    return { ...options, type: 'array', items }
  }
  
  /** Creates an `Enum<T>` from an existing TypeScript enum definition. */
  public static Enum<T extends Record<string, string | number>>(item: T, options?: UserDefinedOptions): TEnum<T[keyof T]> {
    // We explicitly want to ignore reverse-lookup entries for number enums hence we are 
    // getting only keys which are non-numeric and retrieve their value. Credits to 
    // https://github.com/UselessPickles/ts-enum-util (Jeff Lau) for inspiration.
    const values = Object.keys(item).filter(key => isNaN(key as any)).map(key => item[key]) as T[keyof T][]
    return { ...options, enum: values }
  }

  /** Creates a `string` type. */
  public static String(options: StringOptions = {}): TString {
    return { ...options, type: 'string' }
  }

  /** Creates a `number` type. */
  public static Number(options: NumberOptions = {}): TNumber {
    return { ...options, type: 'number' }
  }

  /** Creates a `number` type that checks for `integer`. */
  public static Integer(options: NumberOptions = {}): TInteger {
    return { ...options, type: 'integer' }
  }

  /** Creates a `boolean` type. */
  public static Boolean(options: UserDefinedOptions = {}): TBoolean {
    return { ...options, type: 'boolean' }
  }

  /** Creates a `null` type. */
  public static Null(options: UserDefinedOptions = {}): TNull {
    return { ...options, type: 'null' }
  }

  /** Creates a `any` type. */
  public static Any(options: UserDefinedOptions = {}): TAny {
    return { ...options }
  }

  // #endregion

  // #region Aliases

  /** Creates a `string` type that validates for the given regular expression. Alias for ```Type.String({ pattern: '...' })``` */
  public static Pattern(regex: RegExp): TString {
    return this.String({ pattern: regex.source })
  }

  /** 
   * Deprecated: Use `Type.String({ format: 'uuid' })`
   * 
   * Creates a `string` type that validate a Guid. Alias for ```Type.String({ pattern: '...' })``` 
   */
  public static Guid(): TString {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    return this.String({ pattern: regex.source })
  }

  // #endregion
}
