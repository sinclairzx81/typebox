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

export type TFunction<U extends TSchema = TSchema, T extends TSchema[] = []> = { type: 'function', arguments: [...T], returns: U } & UserDefinedOptions

export type TConstructor<U extends TSchema = TSchema, T extends TSchema[] = []> = { type: 'constructor', arguments: [...T], returns: U } & UserDefinedOptions

type TContract = TConstructor | TFunction


// #endregion

// #region TComposite

export type TIntersect<T extends TSchema[] = any> = { allOf: [...T] } & UserDefinedOptions
export type TUnion<T extends TSchema[] = any> = { oneOf: [...T] } & UserDefinedOptions

export type TTuple<T extends TSchema[] = any> = { type: 'array', items: [...T], additionalItems: false, minItems: number, maxItems: number } & UserDefinedOptions

export type TComposite = TIntersect | TUnion | TTuple

// #endregion

// #region TModifier

export const OptionalModifier = Symbol('OptionalModifier')
export const ReadonlyModifier = Symbol('ReadonlyModifier')
export type TOptional<T extends TSchema | TComposite> = T & { modifier: typeof OptionalModifier }
export type TReadonly<T extends TSchema | TComposite> = T & { modifier: typeof ReadonlyModifier }
export type TModifier = TOptional<any> | TReadonly<any>

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
export type TObject<T extends TProperties> = { type: 'object', properties: T, required?: string[] } & UserDefinedOptions
export type TMap<T extends TSchema | TComposite> = { type: 'object', additionalProperties: T } & UserDefinedOptions
export type TArray<T extends TSchema | TComposite> = { type: 'array', items: T } & ArrayOptions
export type TEnum<T extends string | number> = { enum: Array<T> } & UserDefinedOptions
export type TNumber = { type: 'number' } & NumberOptions
export type TInteger = { type: 'integer' } & NumberOptions
export type TString = { type: 'string' } & StringOptions
export type TBoolean = { type: 'boolean' } & UserDefinedOptions
export type TNull = { type: 'null' } & UserDefinedOptions
export type TAny = {} & UserDefinedOptions
// Extended
export type TPromise<T extends TSchema | TVoid | TUndefined> = { type: 'promise', item: T } & UserDefinedOptions
export type TUndefined = { type: 'undefined' } & UserDefinedOptions
export type TVoid = { type: 'void' } & UserDefinedOptions

export type TSchema = TLiteral | TNumber | TInteger | TBoolean | TString | TObject<any> | TArray<any> | TEnum<any> | TMap<any> | TNull | TAny | TPromise<any> | TUndefined | TVoid

// #endregion

// #region StaticContract

type StaticFunction<T> =
  T extends TFunction<infer R, infer U> ? (args: [...Static<U>]) => Static<R> :
  never;


type StaticConstructor<T> =
  T extends TConstructor<infer R, infer U> ? new (args: [...Static<U>]) => Static<R> :
  never;

type StaticContract<T extends TSchema> =
  T extends TFunction ? StaticFunction<T> :
  T extends TConstructor ? StaticConstructor<T> :
  never;

// #endregion

// #region StaticComposite

type MapStatic<T> = { [P in keyof T]: Static<T[P]> };

type StaticIntersect<T> =
  T extends TIntersect<infer U> ? UnionToIntersection<MapStatic<U>[number]> :
  never;

type StaticUnion<T> =
  T extends TUnion<infer U> ? MapStatic<U>[number] :
  never;

type StaticTuple<T> =
  T extends TTuple<infer U> ? MapStatic<U> :
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

type StaticObjectProperties<T> =
  { readonly [K in ReadonlyPropertyKeys<T>]: Static<T[K]> } &
  { [K in OptionalPropertyKeys<T>]?: Static<T[K]> } &
  { [K in PropertyKeys<T>]: Static<T[K]> }

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
  // Extended
  T extends TPromise<infer U> ? Promise<Static<U>> :
  T extends TVoid ? void :
  T extends TUndefined ? undefined :
  never;

// #endregion

export type TStatic = TComposite | TSchema | TModifier | TContract

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
    return { ...item, modifier: OptionalModifier }
  }

  /** Modifies the inner type T into an readonly T. */
  public static Readonly<T extends TSchema | TUnion | TIntersect>(item: T): TReadonly<T> {
    return { ...item, modifier: ReadonlyModifier }
  }

  // #endregion

  // #region TComposite

  /** Creates a Union type for the given arguments. */
  public static Union<T extends TSchema[]>(items: [...T], options: UserDefinedOptions = {}): TUnion<T> {
    return { ...options, oneOf: items };
  }

  /** Creates an Intersect type for the given arguments. */
  public static Intersect<T extends TSchema[]>(items: [...T], options: UserDefinedOptions = {}): TIntersect<T> {
    return { ...options, allOf: items };
  }

  /** Creates a Tuple type for the given arguments. */
  public static Tuple<T extends TSchema[]>(items: [...T], options: UserDefinedOptions = {}): TTuple<T> {
    const type = 'array'
    const additionalItems = false
    const minItems = items.length
    const maxItems = items.length
    return { ...options, type, items, additionalItems, minItems, maxItems };
  }

  // #endregion

  // #region TContract

  /** Creates a `function` type for the given arguments. */
  public static Function<U extends TSchema, T extends TSchema[] = []>(args: T, returns: U, options: UserDefinedOptions = {}): TFunction<U, T> {
    return { ...options, type: 'function', arguments: args, returns };
  }

  /** Creates a `constructor` type for the given arguments. */
  public static Constructor<U extends TSchema, T extends TSchema[] = []>(args: T, returns: U, options?: UserDefinedOptions): TConstructor<U, T> {
    return { ...options, type: 'constructor', arguments: args, returns };
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
      return (candidate.modifier && candidate.modifier === OptionalModifier)
    })
    const required = property_names.filter(name => !optional.includes(name))
    return { ...options, type: 'object', properties, required: required.length ? required : undefined }
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
  public static Pattern(regex: RegExp) {
    return this.String({ pattern: regex.source })
  }

  /**
   * Deprecated: Use `Type.String({ format: 'uuid' })`
   *
   * Creates a `string` type that validate a Guid. Alias for ```Type.String({ pattern: '...' })```
   */
  public static Guid() {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    return this.String({ pattern: regex.source })
  }

  // #endregion
}
