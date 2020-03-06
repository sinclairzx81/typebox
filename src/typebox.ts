/*--------------------------------------------------------------------------

TypeBox: JSONSchema Type Builder with Static Type Resolution for TypeScript

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

// #region TContract

interface TFunction8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema, U extends TSchema> { type: 'function', arguments: [T0, T1, T2, T3, T4, T5, T6, T7], returns: U }
interface TFunction7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, U extends TSchema> { type: 'function', arguments: [T0, T1, T2, T3, T4, T5, T6], returns: U }
interface TFunction6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, U extends TSchema> { type: 'function', arguments: [T0, T1, T2, T3, T4, T5], returns: U }
interface TFunction5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, U extends TSchema> { type: 'function', arguments: [T0, T1, T2, T3, T4], returns: U }
interface TFunction4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, U extends TSchema> { type: 'function', arguments: [T0, T1, T2, T3], returns: U }
interface TFunction3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, U extends TSchema> { type: 'function', arguments: [T0, T1, T2], returns: U }
interface TFunction2<T0 extends TSchema, T1 extends TSchema, U extends TSchema> { type: 'function', arguments: [T0, T1], returns: U }
interface TFunction1<T0 extends TSchema, U extends TSchema> { type: 'function', arguments: [T0], returns: U }
interface TFunction0<U extends TSchema> { type: 'function', arguments: [], returns: U }
export type TFunction = TFunction8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction5<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction4<TSchema, TSchema, TSchema, TSchema, TSchema> |
  TFunction3<TSchema, TSchema, TSchema, TSchema> |
  TFunction2<TSchema, TSchema, TSchema> |
  TFunction1<TSchema, TSchema> |
  TFunction0<TSchema>

interface TConstructor8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema, U extends TSchema> { type: 'constructor', arguments: [T0, T1, T2, T3, T4, T5, T6, T7], returns: U }
interface TConstructor7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, U extends TSchema> { type: 'constructor', arguments: [T0, T1, T2, T3, T4, T5, T6], returns: U }
interface TConstructor6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, U extends TSchema> { type: 'constructor', arguments: [T0, T1, T2, T3, T4, T5], returns: U }
interface TConstructor5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, U extends TSchema> { type: 'constructor', arguments: [T0, T1, T2, T3, T4], returns: U }
interface TConstructor4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, U extends TSchema> { type: 'constructor', arguments: [T0, T1, T2, T3], returns: U }
interface TConstructor3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, U extends TSchema> { type: 'constructor', arguments: [T0, T1, T2], returns: U }
interface TConstructor2<T0 extends TSchema, T1 extends TSchema, U extends TSchema> { type: 'constructor', arguments: [T0, T1], returns: U }
interface TConstructor1<T0 extends TSchema, U extends TSchema> { type: 'constructor', arguments: [T0], returns: U }
interface TConstructor0<U extends TSchema> { type: 'constructor', arguments: [], returns: U }
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
export interface TPromise<T extends TSchema | TVoid | TUndefined> { type: 'promise', item: T }
export interface TVoid { type: 'void' }
export interface TUndefined { type: 'undefined' }

// #endregion

// #region TComposite

interface TIntersect8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema> { allOf: [T0, T1, T2, T3, T4, T5, T6, T7] }
interface TIntersect7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema> { allOf: [T0, T1, T2, T3, T4, T5, T6] }
interface TIntersect6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema> { allOf: [T0, T1, T2, T3, T4, T5] }
interface TIntersect5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema> { allOf: [T0, T1, T2, T3, T4] }
interface TIntersect4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema> { allOf: [T0, T1, T2, T3] }
interface TIntersect3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema> { allOf: [T0, T1, T2] }
interface TIntersect2<T0 extends TSchema, T1 extends TSchema> { allOf: [T0, T1] }
interface TIntersect1<T0 extends TSchema> { allOf: [T0] }
export type TIntersect = TIntersect8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TIntersect7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TIntersect6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TIntersect5<TSchema, TSchema, TSchema, TSchema, TSchema> |
  TIntersect4<TSchema, TSchema, TSchema, TSchema> |
  TIntersect3<TSchema, TSchema, TSchema> |
  TIntersect2<TSchema, TSchema> |
  TIntersect1<TSchema>;

interface TUnion8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema> { oneOf: [T0, T1, T2, T3, T4, T5, T6, T7] }
interface TUnion7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema> { oneOf: [T0, T1, T2, T3, T4, T5, T6] }
interface TUnion6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema> { oneOf: [T0, T1, T2, T3, T4, T5] }
interface TUnion5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema> { oneOf: [T0, T1, T2, T3, T4] }
interface TUnion4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema> { oneOf: [T0, T1, T2, T3] }
interface TUnion3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema> { oneOf: [T0, T1, T2] }
interface TUnion2<T0 extends TSchema, T1 extends TSchema> { oneOf: [T0, T1] }
interface TUnion1<T0 extends TSchema> { oneOf: [T0] }
export type TUnion = TUnion8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TUnion7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TUnion6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> |
  TUnion5<TSchema, TSchema, TSchema, TSchema, TSchema> |
  TUnion4<TSchema, TSchema, TSchema, TSchema> |
  TUnion3<TSchema, TSchema, TSchema> |
  TUnion2<TSchema, TSchema> |
  TUnion1<TSchema>;


interface TTuple8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema> { type: 'array', items: [T0, T1, T2, T3, T4, T5, T6, T7], additionalItems: false, minItems: 8, maxItems: 8 }
interface TTuple7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema> { type: 'array', items: [T0, T1, T2, T3, T4, T5, T6], additionalItems: false, minItems: 7, maxItems: 7 }
interface TTuple6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema> { type: 'array', items: [T0, T1, T2, T3, T4, T5], additionalItems: false, minItems: 6, maxItems: 6 }
interface TTuple5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema> { type: 'array', items: [T0, T1, T2, T3, T4], additionalItems: false, minItems: 5, maxItems: 5 }
interface TTuple4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema> { type: 'array', items: [T0, T1, T2, T3], additionalItems: false, minItems: 4, maxItems: 4 }
interface TTuple3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema> { type: 'array', items: [T0, T1, T2], additionalItems: false, minItems: 3, maxItems: 3 }
interface TTuple2<T0 extends TSchema, T1 extends TSchema> { type: 'array', items: [T0, T1], additionalItems: false, minItems: 2, maxItems: 2 }
interface TTuple1<T0 extends TSchema> { type: 'array', items: [T0], additionalItems: false, minItems: 1, maxItems: 1 }
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

export type TOptional<T extends TSchema | TComposite> = T & { modifier: 'optional' }
export type TReadonly<T extends TSchema | TComposite> = T & { modifier: 'readonly' }
export type TModifier = TOptional<any> | TReadonly<any>

// #endregion

// #region TSchema

type FormatOption =
  | 'date-time' | 'time' | 'date' | 'email' | 'idn-email' | 'hostname'
  | 'idn-hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uri-reference' | 'iri'
  | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer'
  | 'regex'

export interface ArrayOptions {
  [prop: string]: any
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
}
export interface NumberOptions {
  [prop: string]: any
  minimum?: number
  exclusiveMinimum?: number
  maximum?: number
  exclusiveMaximum?: number
  multipleOf?: number
}
export interface StringOptions {
  [prop: string]: any
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: FormatOption
}
export type TLiteral = TStringLiteral<string> | TNumberLiteral<number> | TBooleanLiteral<boolean>
export type TStringLiteral<T> = { type: 'string', enum: [T] }
export type TNumberLiteral<T> = { type: 'number', enum: [T] }
export type TBooleanLiteral<T> = { type: 'boolean', enum: [T] }
export type TProperties = { [key: string]: TSchema | TComposite | TOptional<TSchema | TComposite> | TReadonly<TSchema | TComposite> }
export type TObject<T extends TProperties> = { type: 'object', properties: T, required: string[] }
export type TMap<T extends TSchema | TComposite> = { type: 'object', additionalProperties: T }
export type TArray<T extends TSchema | TComposite> = { type: 'array', items: T } & ArrayOptions
export type TNumber = { type: 'number' } & NumberOptions
export type TInteger = { type: 'integer' }
export type TString = { type: 'string' } & StringOptions
export type TBoolean = { type: 'boolean' }
export type TNull = { type: 'null' }
export type TAny = {}

export type TSchema = TLiteral | TNumber | TInteger | TBoolean | TString | TObject<any> | TArray<any> | TMap<any> | TNull | TAny

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
type ReadonlyPropertyKeys<T> = { [K in keyof T]: T[K] extends TReadonly<infer U> ? K : never }[keyof T]
type OptionalPropertyKeys<T> = { [K in keyof T]: T[K] extends TOptional<infer U> ? K : never }[keyof T]
type PropertyKeys<T> = keyof Omit<T, OptionalPropertyKeys<T> | ReadonlyPropertyKeys<T>>

type StaticObjectPropertiesExpansion<T> =
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

  /** Modifies the inner type T into an optional T. */
  public static Optional<T extends TSchema | TUnion | TIntersect>(item: T): TOptional<T> {
    return { ...item, modifier: 'optional' }
  }

  /** Modifies the inner type T into an readonly T. */
  public static Readonly<T extends TSchema | TUnion | TIntersect>(item: T): TReadonly<T> {
    return { ...item, modifier: 'readonly' }
  }

  // #endregion

  // #region TSchema

  /** Creates a StringLiteral for the given value. */
  public static Literal<T extends string>(value: T): TStringLiteral<T>
  /** Creates a NumberLiteral for the given value. */
  public static Literal<T extends number>(value: T): TNumberLiteral<T>
  /** Creates a BooleanLiteral for the given value. */
  public static Literal<T extends boolean>(value: T): TBooleanLiteral<T>
  /** Creates a Literal for the given value. */
  public static Literal(value: any): TLiteral {
    const type = reflect(value)
    if (type === 'unknown') { throw Error('Invalid literal value') }
    return { type, enum: [value] } as TLiteral
  }

  /** Creates a Object type with the given properties. */
  public static Object<T extends TProperties>(properties: T): TObject<T> {
    const property_names = Object.keys(properties)
    const optional = property_names.filter(name => {
      const candidate = properties[name] as TOptional<any>
      return (candidate.modifier && candidate.modifier === 'optional')
    })
    const required = property_names.filter(name => !optional.includes(name))
    return { type: 'object', properties, required }
  }

  /** Creates a Map type of the given type. Keys are indexed with type string. */
  public static Map<T extends TSchema | TUnion | TIntersect | TTuple>(item: T): TMap<T> {
    return { type: 'object', additionalProperties: item }
  }

  /** Creates an Array type of the given argument T. */
  public static Array<T extends TSchema | TUnion | TIntersect | TTuple>(items: T, options: ArrayOptions = {}): TArray<T> {
    return { type: 'array', items, ...options }
  }

  /** Creates a String type. */
  public static String(options: StringOptions = {}): TString {
    return { type: 'string', ...options }
  }

  /** Creates a Number type. */
  public static Number(options: NumberOptions = {}): TNumber {
    return { type: 'number', ...options }
  }

  /** Creates a Integer type. */
  public static Integer(options: NumberOptions = {}): TInteger {
    return { type: 'integer', ...options }
  }

  /** Creates a Boolean type. */
  public static Boolean(): TBoolean {
    return { type: 'boolean' }
  }

  /** Creates a Null type. */
  public static Null(): TNull {
    return { type: 'null' }
  }

  /** Creates a Any type. */
  public static Any(): TAny {
    return {}
  }

  // #endregion

  // #region TComposite

  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TUnion8<T0, T1, T2, T3, T4, T5, T6, T7>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TUnion7<T0, T1, T2, T3, T4, T5, T6>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TUnion6<T0, T1, T2, T3, T4, T5>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4): TUnion5<T0, T1, T2, T3, T4>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3): TUnion4<T0, T1, T2, T3>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema>(t0: T0, t1: T1, t2: T2): TUnion3<T0, T1, T2>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema, T1 extends TSchema>(t0: T0, t1: T1): TUnion2<T0, T1>
  /** Creates a Union type for the given arguments. */
  public static Union<T0 extends TSchema>(t0: T0): TUnion1<T0>
  /** Creates a Union type for the given arguments. */
  public static Union(...types: TSchema[]): TUnion {
    return { oneOf: [...types] } as TUnion
  }

  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TIntersect8<T0, T1, T2, T3, T4, T5, T6, T7>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TIntersect7<T0, T1, T2, T3, T4, T5, T6>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TIntersect6<T0, T1, T2, T3, T4, T5>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4): TIntersect5<T0, T1, T2, T3, T4>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3): TIntersect4<T0, T1, T2, T3>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema>(t0: T0, t1: T1, t2: T2): TIntersect3<T0, T1, T2>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema, T1 extends TSchema>(t0: T0, t1: T1): TIntersect2<T0, T1>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T0 extends TSchema>(t0: T0): TIntersect1<T0>
  /** Creates an Intersect type for the given arguments. */
  public static Intersect(...types: TSchema[]): TIntersect {
    return { allOf: [...types] } as TIntersect
  }

  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TTuple8<T0, T1, T2, T3, T4, T5, T6, T7>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TTuple7<T0, T1, T2, T3, T4, T5, T6>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TTuple6<T0, T1, T2, T3, T4, T5>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4): TTuple5<T0, T1, T2, T3, T4>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3): TTuple4<T0, T1, T2, T3>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema>(t0: T0, t1: T1, t2: T2): TTuple3<T0, T1, T2>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema, T1 extends TSchema>(t0: T0, t1: T1): TTuple2<T0, T1>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T0 extends TSchema>(t0: T0): TTuple1<T0>
  /** Creates a Tuple type for the given arguments. */
  public static Tuple(...types: TSchema[]): TTuple {
    const type = 'array'
    const additionalItems = false
    const minItems = types.length
    const maxItems = types.length
    return { type, items: [...types], additionalItems, minItems, maxItems } as TTuple
  }

  // #endregion

  // #region TContract

  /** Creates a Function type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, T7 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6, T7], returns: U): TFunction8<T0, T1, T2, T3, T4, T5, T6, T7, U>
  /** Creates a Function type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6], returns: U): TFunction7<T0, T1, T2, T3, T4, T5, T6, U>
  /** Creates a Function type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5], returns: U): TFunction6<T0, T1, T2, T3, T4, T5, U>
  /** Creates a Function type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4], returns: U): TFunction5<T0, T1, T2, T3, T4, U>
  /** Creates a Function type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3], returns: U): TFunction4<T0, T1, T2, T3, U>
  /** Creates a Function type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, U extends TStatic>(args: [T0, T1, T2], returns: U): TFunction3<T0, T1, T2, U>
  /** Creates a Function type for the given arguments. */
  public static Function<T0 extends TStatic, T1 extends TStatic, U extends TStatic>(args: [T0, T1], returns: U): TFunction2<T0, T1, U>
  /** Creates a Function type for the given arguments. */
  public static Function<T0 extends TStatic, U extends TStatic>(args: [T0], returns: U): TFunction1<T0, U>
  /** Creates a Function type for the given arguments. */
  public static Function<U extends TStatic>(args: [], returns: U): TFunction0<U>
  /** Creates a Function type for the given arguments. */
  public static Function(args: TStatic[], returns: TStatic): TFunction {
    return { type: 'function', arguments: args, returns: returns } as TFunction
  }

  /** Creates a Constructor type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, T7 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6, T7], returns: U): TConstructor8<T0, T1, T2, T3, T4, T5, T6, T7, U>
  /** Creates a Constructor type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6], returns: U): TConstructor7<T0, T1, T2, T3, T4, T5, T6, U>
  /** Creates a Constructor type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5], returns: U): TConstructor6<T0, T1, T2, T3, T4, T5, U>
  /** Creates a Constructor type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4], returns: U): TConstructor5<T0, T1, T2, T3, T4, U>
  /** Creates a Constructor type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3], returns: U): TConstructor4<T0, T1, T2, T3, U>
  /** Creates a Constructor type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, U extends TStatic>(args: [T0, T1, T2], returns: U): TConstructor3<T0, T1, T2, U>
  /** Creates a Constructor type for the given arguments. */
  public static Constructor<T0 extends TStatic, T1 extends TStatic, U extends TStatic>(args: [T0, T1], returns: U): TConstructor2<T0, T1, U>
  /** Creates a Constructor type for the given arguments. */
  public static Constructor<T0 extends TStatic, U extends TStatic>(args: [T0], returns: U): TConstructor1<T0, U>
  /** Creates a Constructor type for the given arguments. */
  public static Constructor<U extends TStatic>(args: [], returns: U): TConstructor0<U>
  /** Creates a Constructor type for the given arguments. */
  public static Constructor(args: TStatic[], returns: TStatic): TConstructor {
    return { type: 'constructor', arguments: args, returns: returns } as TConstructor
  }

  /** Creates a Promise type. */
  public static Promise<T extends TSchema>(t: T): TPromise<T> {
    return { type: 'promise', item: t }
  }

  /** Creates a Void type. */
  public static Void(): TVoid {
    return { type: 'void' }
  }

  /** Creates a Undefined type. */
  public static Undefined(): TUndefined {
    return { type: 'undefined' }
  }

  // #endregion

  // #region Aliases

  /** Creates a String type that validates with the given format. Alias for ```Type.String({ format: '...' })``` */
  public static Format(format: FormatOption): TString {
    return this.String({ format })
  }

  /** Creates a String type that validates for the given regular expression. Alias for ```Type.String({ pattern: '...' })``` */
  public static Pattern(regex: RegExp): TString {
    return this.String({ pattern: regex.source })
  }

  /** Creates a String type that validate a Guid. Alias for ```Type.String({ pattern: '...' })``` */
  public static Guid(): TString {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    return this.String({ pattern: regex.source })
  }

  // #endregion
}
