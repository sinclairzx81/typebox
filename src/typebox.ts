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

// ------------------------------------------------------------------------
// Modifiers
// ------------------------------------------------------------------------

export const ReadonlyOptionalModifier = Symbol('ReadonlyOptionalModifier')
export const OptionalModifier         = Symbol('OptionalModifier')
export const ReadonlyModifier         = Symbol('ReadonlyModifier')

export type TReadonlyOptional<T extends TSchema> = T & { modifier: typeof ReadonlyOptionalModifier }
export type TOptional<T extends TSchema>         = T & { modifier: typeof OptionalModifier }
export type TReadonly<T extends TSchema>         = T & { modifier: typeof ReadonlyModifier }
export type TModifier = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>

// ------------------------------------------------------------------------
// Schema: Core
// ------------------------------------------------------------------------

export const UnionKind     = Symbol('UnionKind')
export const IntersectKind = Symbol('IntersectKind')
export const TupleKind     = Symbol('TupleKind')
export const ObjectKind    = Symbol('ObjectKind')
export const DictKind      = Symbol('DictKind')
export const ArrayKind     = Symbol('ArrayKind')
export const EnumKind      = Symbol('EnumKind')
export const LiteralKind   = Symbol('LiteralKind')
export const StringKind    = Symbol('StringKind')
export const NumberKind    = Symbol('NumberKind')
export const IntegerKind   = Symbol('IntegerKind')
export const BooleanKind   = Symbol('BooleanKind')
export const NullKind      = Symbol('NullKind')
export const UnknownKind   = Symbol('UnknownKind')
export const AnyKind       = Symbol('AnyKind')

export interface CustomOptions {
    [prop: string]: any
}

export type StringFormatOption =
    | 'date-time'    | 'time'          | 'date'         | 'email'        | 'idn-email'     | 'hostname'
    | 'idn-hostname' | 'ipv4'          | 'ipv6'         | 'uri'          | 'uri-reference' | 'iri'
    | 'uuid'         | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer'
    | 'regex'

type IsUnion<T> = [T] extends [UnionToIntersect<T>] ? false : true
export declare type StringOptions = {
    minLength?: number
    maxLength?: number
    pattern?:   string
    format?:    IsUnion<CustomOptions['format']> extends true
        ? CustomOptions['format'] | StringFormatOption
        : StringFormatOption
} & Omit<CustomOptions, 'format'>

export type ArrayOptions = {
    uniqueItems?: boolean
    minItems?:    number
    maxItems?:    number
} & CustomOptions

export type NumberOptions = {
    exclusiveMaximum?: number
    exclusiveMinimum?: number
    maximum?:          number
    minimum?:          number
    multipleOf?:       number
} & CustomOptions

export type TEnumType = Record<string, string | number>
export type TKey      = string | number
export type TValue    = string | number | boolean
export type TIntersect<T extends TSchema[]> = { kind: typeof IntersectKind, allOf: [...T] } & CustomOptions
export type TUnion<T extends TSchema[]>     = { kind: typeof UnionKind, anyOf: [...T] } & CustomOptions
export type TTuple<T extends TSchema[]>     = { kind: typeof TupleKind, type: 'array', items: [...T], additionalItems: false, minItems: number, maxItems: number } & CustomOptions
export type TProperties                     = { [key: string]: TSchema }
export type TObject<T extends TProperties>  = { kind: typeof ObjectKind, type: 'object', properties: T, required?: string[] } & CustomOptions
export type TDict<T extends TSchema>        = { kind: typeof DictKind, type: 'object', additionalProperties: T } & CustomOptions
export type TArray<T extends TSchema>       = { kind: typeof ArrayKind, type: 'array', items: T } & ArrayOptions
export type TLiteral<T extends TValue>      = { kind: typeof LiteralKind, type: 'string' | 'number' | 'boolean', enum: [T] } & CustomOptions
export type TEnum<T extends TKey>           = { kind: typeof EnumKind, enum: T[] } & CustomOptions
export type TString                         = { kind: typeof StringKind, type: 'string' } & StringOptions
export type TNumber                         = { kind: typeof NumberKind, type: 'number' } & NumberOptions
export type TInteger                        = { kind: typeof IntegerKind, type: 'integer' } & NumberOptions
export type TBoolean                        = { kind: typeof BooleanKind, type: 'boolean' } & CustomOptions
export type TNull                           = { kind: typeof NullKind, type: 'null' } & CustomOptions
export type TUnknown                        = { kind: typeof UnknownKind } & CustomOptions
export type TAny                            = { kind: typeof AnyKind } & CustomOptions

// ------------------------------------------------------------------------
// Schema: Extended
// ------------------------------------------------------------------------

export const ConstructorKind = Symbol('ConstructorKind')
export const FunctionKind    = Symbol('FunctionKind')
export const PromiseKind     = Symbol('PromiseKind')
export const UndefinedKind   = Symbol('UndefinedKind')
export const VoidKind        = Symbol('VoidKind')
export type TConstructor <T extends TSchema[], U extends TSchema> = { kind: typeof ConstructorKind, type: 'constructor', arguments: readonly [...T], returns: U } & CustomOptions
export type TFunction    <T extends TSchema[], U extends TSchema> = { kind: typeof FunctionKind, type: 'function', arguments: readonly [...T], returns: U } & CustomOptions
export type TPromise     <T extends TSchema>                      = { kind: typeof PromiseKind, type: 'promise', item: T } & CustomOptions
export type TUndefined      = { kind: typeof UndefinedKind, type: 'undefined' } & CustomOptions
export type TVoid           = { kind: typeof VoidKind, type: 'void' } & CustomOptions

// ------------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------------

export type TSchema =
    | TIntersect<any>
    | TUnion<any>
    | TTuple<any>
    | TObject<TProperties>
    | TDict<any>
    | TArray<any>
    | TEnum<any>
    | TLiteral<any>
    | TString
    | TNumber
    | TInteger
    | TBoolean
    | TNull
    | TUnknown
    | TAny
    | TConstructor<any[], any>
    | TFunction<any[], any>
    | TPromise<any>
    | TUndefined
    | TVoid

// ------------------------------------------------------------------------
// Static Inference
// ------------------------------------------------------------------------

export type UnionToIntersect<U>             = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
export type ReadonlyOptionalPropertyKeys<T> = { [K in keyof T]: T[K] extends TReadonlyOptional<infer U> ? K : never }[keyof T]
export type ReadonlyPropertyKeys<T>         = { [K in keyof T]: T[K] extends TReadonly<infer U> ? K : never }[keyof T]
export type OptionalPropertyKeys<T>         = { [K in keyof T]: T[K] extends TOptional<infer U> ? K : never }[keyof T]
export type PropertyKeys<T>                 = keyof Omit<T, OptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | ReadonlyPropertyKeys<T>>
export type StaticProperties<T> =
    { readonly [K in ReadonlyOptionalPropertyKeys<T>]?: Static<T[K]> } &
    { readonly [K in ReadonlyPropertyKeys<T>]: Static<T[K]>          } &
    {          [K in OptionalPropertyKeys<T>]?: Static<T[K]>         } &
    {          [K in PropertyKeys<T>]: Static<T[K]>                  }

export type StaticIntersect   <T extends readonly TSchema[]> = UnionToIntersect<StaticUnion<T>>
export type StaticUnion       <T extends readonly TSchema[]> = { [K in keyof T]: Static<T[K]> }[number]
export type StaticTuple       <T extends readonly TSchema[]> = { [K in keyof T]: Static<T[K]> }
export type StaticObject      <T extends TProperties>        = StaticProperties<T>
export type StaticDict        <T extends TSchema>            = { [key: string]: Static<T> }
export type StaticArray       <T extends TSchema>            = Array<Static<T>>
export type StaticLiteral     <T extends TValue>             = T
export type StaticEnum        <T extends TKey>               = T
export type StaticConstructor <T extends readonly TSchema[], U extends TSchema> = new (...args: [...{ [K in keyof T]: Static<T[K]> }]) => Static<U>
export type StaticFunction    <T extends readonly TSchema[], U extends TSchema> = (...args: [...{ [K in keyof T]: Static<T[K]> }]) => Static<U>
export type StaticPromise     <T extends TSchema>            = Promise<Static<T>>

export type Static<T> =
    T extends TIntersect<infer U>            ? StaticIntersect<U>      :
    T extends TUnion<infer U>                ? StaticUnion<U>          :
    T extends TTuple<infer U>                ? StaticTuple<U>          :
    T extends TObject<infer U>               ? StaticObject<U>         :
    T extends TDict<infer U>                 ? StaticDict<U>           :
    T extends TArray<infer U>                ? StaticArray<U>          :
    T extends TEnum<infer U>                 ? StaticEnum<U>           :
    T extends TLiteral<infer U>              ? StaticLiteral<U>        :
    T extends TString                        ? string                  :
    T extends TNumber                        ? number                  :
    T extends TInteger                       ? number                  :
    T extends TBoolean                       ? boolean                 : 
    T extends TNull                          ? null                    :
    T extends TUnknown                       ? unknown                 :
    T extends TAny                           ? any                     :
    T extends TConstructor<infer U, infer R> ? StaticConstructor<U, R> :
    T extends TFunction<infer U, infer R>    ? StaticFunction<U, R>    :
    T extends TPromise<infer U>              ? StaticPromise<U>        :
    T extends TUndefined                     ? undefined               :
    T extends TVoid                          ? void                    :
    unknown


// ------------------------------------------------------------------------
// Reflect
// ------------------------------------------------------------------------

function reflect(value: any): 'string' | 'number' | 'boolean' | 'unknown' {
    switch (typeof value) {
        case 'string': return 'string'
        case 'number': return 'number'
        case 'boolean': return 'boolean'
        default: return 'unknown'
    }
}

// ------------------------------------------------------------------------
// TypeBuilder
// ------------------------------------------------------------------------

export class TypeBuilder {

    /** Modifies a schema object property to be `readonly` and `optional`. */
    public ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T> {
        return { ...item, modifier: ReadonlyOptionalModifier }
    }

    /** Modifies a schema object property to be `readonly`. */
    public Readonly<T extends TSchema>(item: T): TReadonly<T> {
        return { ...item, modifier: ReadonlyModifier }
    }

    /** Modifies a schema object property to be `optional`. */
    public Optional<T extends TSchema>(item: T): TOptional<T> {
        return { ...item, modifier: OptionalModifier }
    }

    /** Creates an Intersect schema. */
    public Intersect<T extends TSchema[]>(items: [...T], options: CustomOptions = {}): TIntersect<T> {
        return { ...options, kind: IntersectKind, allOf: items }
    }

    /** Creates a Union schema. */
    public Union<T extends TSchema[]>(items: [...T], options: CustomOptions = {}): TUnion<T> {
        return { ...options, kind: UnionKind, anyOf: items }
    }

    /** Creates a Tuple schema. */
    public Tuple<T extends TSchema[]>(items: [...T], options: CustomOptions = {}): TTuple<T> {
        const additionalItems = false
        const minItems = items.length
        const maxItems = items.length
        return { ...options, kind: TupleKind, type: 'array', items, additionalItems, minItems, maxItems }
    }

    /** Creates a `object` schema with the given properties. */
    public Object<T extends TProperties>(properties: T, options: CustomOptions = {}): TObject<T> {
        const property_names = Object.keys(properties)
        const optional = property_names.filter(name => {
            const candidate = properties[name] as TModifier
            return (candidate.modifier &&
                (candidate.modifier === OptionalModifier ||
                    candidate.modifier === ReadonlyOptionalModifier))
        })
        const required_names = property_names.filter(name => !optional.includes(name))
        const required = required_names.length ? required_names : undefined
        return { ...options, kind: ObjectKind, type: 'object', properties, required }
    }

    /** Creates a `{ [key: string]: T }` schema. */
    public Dict<T extends TSchema>(item: T, options: CustomOptions = {}): TDict<T> {
        const additionalProperties = item
        return { ...options, kind: DictKind, type: 'object', additionalProperties }
    }

    /** Creates an `Array<T>` schema. */
    public Array<T extends TSchema>(items: T, options: ArrayOptions = {}): TArray<T> {
        return { ...options, kind: ArrayKind, type: 'array', items }
    }

    /** Creates an `Enum<T>` schema from a TypeScript `enum` definition. */
    public Enum<T extends TEnumType>(item: T, options: CustomOptions = {}): TEnum<T[keyof T]> {
        const values = Object.keys(item).filter(key => isNaN(key as any)).map(key => item[key]) as T[keyof T][]
        return { ...options, kind: EnumKind, enum: values }
    }

    /** Creates a literal schema. Supports `string | number | boolean` values. */
    public Literal<T extends TValue>(value: T, options: CustomOptions = {}): TLiteral<T> {
        const type = reflect(value)
        if (type === 'unknown') { throw Error(`Invalid literal value '${value}'`) }
        return { ...options, kind: LiteralKind, type, enum: [value] }
    }

    /** Creates a `string` schema. */
    public String(options: StringOptions = {}): TString {
        return { ...options, kind: StringKind, type: 'string' }
    }

    /** Creates a `string` schema from a regular expression. */
    public RegEx(regex: RegExp, options: CustomOptions = {}): TString {
        return this.String({ ...options, pattern: regex.source })
    }

    /** Creates a `number` schema. */
    public Number(options: NumberOptions = {}): TNumber {
        return { ...options, kind: NumberKind, type: 'number' }
    }

    /** Creates a `integer` schema. */
    public Integer(options: NumberOptions = {}): TInteger {
        return { ...options, kind: IntegerKind, type: 'integer' }
    }

    /** Creates a `boolean` type. */
    public Boolean(options: CustomOptions = {}): TBoolean {
        return { ...options, kind: BooleanKind, type: 'boolean' }
    }

    /** Creates a `null` type. */
    public Null(options: CustomOptions = {}): TNull {
        return { ...options, kind: NullKind, type: 'null' }
    }

    /** Creates an `unknown` type. */
    public Unknown(options: CustomOptions = {}): TUnknown {
        return { ...options, kind: UnknownKind }
    }

    /** Creates an `any` type. */
    public Any(options: CustomOptions = {}): TAny {
        return { ...options, kind: AnyKind }
    }

    /** `NON-STANDARD` Creates a `constructor` schema. */
    public Constructor<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options: CustomOptions = {}): TConstructor<T, U> {
        return { ...options, kind: ConstructorKind, type: 'constructor', arguments: args, returns };
    }

    /** `NON-STANDARD` Creates a `function` schema. */
    public Function<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options: CustomOptions = {}): TFunction<T, U> {
        return { ...options, kind: FunctionKind, type: 'function', arguments: args, returns };
    }

    /** `NON-STANDARD` Creates a `Promise<T>` schema. */
    public Promise<T extends TSchema>(item: T, options: CustomOptions = {}): TPromise<T> {
        return { ...options, type: 'promise', kind: PromiseKind, item }
    }

    /** `NON-STANDARD` Creates a `undefined` schema. */
    public Undefined(options: CustomOptions = {}): TUndefined {
        return { ...options, type: 'undefined', kind: UndefinedKind }
    }

    /** `NON-STANDARD` Creates a `void` schema. */
    public Void(options: CustomOptions = {}): TVoid {
        return { ...options, type: 'void', kind: VoidKind }
    }
}

export const Type = new TypeBuilder()

