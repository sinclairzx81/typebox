/*--------------------------------------------------------------------------

TypeBox: JSON Schema Type Builder with Static Type Resolution for TypeScript

The MIT License (MIT)

Copyright (c) 2021 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

export const ReadonlyOptionalModifier            = Symbol('ReadonlyOptionalModifier')
export const OptionalModifier                    = Symbol('OptionalModifier')
export const ReadonlyModifier                    = Symbol('ReadonlyModifier')

export type TModifier                            = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>
export type TReadonlyOptional<T extends TSchema> = T & { modifier: typeof ReadonlyOptionalModifier }
export type TOptional<T extends TSchema>         = T & { modifier: typeof OptionalModifier }
export type TReadonly<T extends TSchema>         = T & { modifier: typeof ReadonlyModifier }

// ------------------------------------------------------------------------
// Schema Standard
// ------------------------------------------------------------------------

export const BoxKind         = Symbol('BoxKind')
export const KeyOfKind       = Symbol('KeyOfKind')
export const IntersectKind   = Symbol('IntersectKind')
export const UnionKind       = Symbol('UnionKind')
export const TupleKind       = Symbol('TupleKind')
export const ObjectKind      = Symbol('ObjectKind')
export const RecordKind      = Symbol('RecordKind')
export const ArrayKind       = Symbol('ArrayKind')
export const EnumKind        = Symbol('EnumKind')
export const LiteralKind     = Symbol('LiteralKind')
export const StringKind      = Symbol('StringKind')
export const NumberKind      = Symbol('NumberKind')
export const IntegerKind     = Symbol('IntegerKind')
export const BooleanKind     = Symbol('BooleanKind')
export const NullKind        = Symbol('NullKind')
export const UnknownKind     = Symbol('UnknownKind')
export const AnyKind         = Symbol('AnyKind')

export interface CustomOptions {
    $id?: string
    title?: string
    description?: string
    default?: any
    examples?: any
    [prop: string]: any
}

export type StringFormatOption =
    | 'date-time'    | 'time'          | 'date'         | 'email'        | 'idn-email'     | 'hostname'
    | 'idn-hostname' | 'ipv4'          | 'ipv6'         | 'uri'          | 'uri-reference' | 'iri'
    | 'uuid'         | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer'
    | 'regex'

export declare type StringOptions<TFormat extends string> = {
    minLength?: number
    maxLength?: number
    pattern?: string
    format?: TFormat
    contentEncoding?: '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64'
    contentMediaType?: string
} & CustomOptions

export type ArrayOptions = {
    uniqueItems?: boolean
    minItems?: number
    maxItems?: number
} & CustomOptions

export type NumberOptions = {
    exclusiveMaximum?: number
    exclusiveMinimum?: number
    maximum?: number
    minimum?: number
    multipleOf?: number
} & CustomOptions

export type IntersectOptions = {
    unevaluatedProperties?: boolean
} & CustomOptions

export type ObjectOptions = {
    additionalProperties?: boolean
} & CustomOptions

// ------------------------------------------------------------------------
// Namespacing
// ------------------------------------------------------------------------

export type TDefinitions                       = { [key: string]: TSchema }
export type TNamespace<T extends TDefinitions> = { kind: typeof BoxKind, definitions: T } & CustomOptions

// ------------------------------------------------------------------------
// Infer<T>
// ------------------------------------------------------------------------

export type Infer<T> = { '_infer': T }

// ------------------------------------------------------------------------
// Standard Schema Types
// ------------------------------------------------------------------------

export type TEnumType          = Record<string, string | number>
export type TKey               = string | number
export type TValue             = string | number | boolean
export type TRecordKey         = TString | TNumber | TKeyOf<any> | TUnion<string | number>
export type TEnumKey<T = TKey> = { type: 'number' | 'string', const: T }
export type TProperties        = { [key: string]: TSchema }
export type TTuple<I>          = Infer<I> & { kind: typeof TupleKind, type: 'array', items?: TSchema[], additionalItems?: false, minItems: number, maxItems: number } & CustomOptions
export type TObject<I>         = Infer<I> & { kind: typeof ObjectKind, type: 'object', properties: TProperties, required?: string[] } & ObjectOptions
export type TUnion<I>          = Infer<I> & { kind: typeof UnionKind, anyOf: TSchema[] } & CustomOptions
export type TIntersect<I>      = Infer<I> & { kind: typeof IntersectKind, type: 'object', allOf: TSchema[] } & IntersectOptions
export type TKeyOf<I>          = Infer<I> & { kind: typeof KeyOfKind, type: 'string', enum: string[] } & CustomOptions
export type TRecord<I>         = Infer<I> & { kind: typeof RecordKind, type: 'object', patternProperties: { [pattern: string]: TSchema } } & ObjectOptions
export type TArray<I>          = Infer<I> & { kind: typeof ArrayKind, type: 'array', items: any } & ArrayOptions
export type TLiteral<I>        = Infer<I> & { kind: typeof LiteralKind, const: TValue } & CustomOptions
export type TEnum<I>           = Infer<I> & { kind: typeof EnumKind, anyOf: TSchema } & CustomOptions
export type TString            = Infer<string>  & { kind: typeof StringKind, type: 'string' } & StringOptions<string>
export type TNumber            = Infer<number>  & { kind: typeof NumberKind, type: 'number' } & NumberOptions
export type TInteger           = Infer<number>  & { kind: typeof IntegerKind, type: 'integer' } & NumberOptions
export type TBoolean           = Infer<boolean> & { kind: typeof BooleanKind, type: 'boolean' } & CustomOptions
export type TNull              = Infer<null>    & { kind: typeof NullKind, type: 'null' } & CustomOptions
export type TUnknown           = Infer<unknown> & { kind: typeof UnknownKind } & CustomOptions
export type TAny               = Infer<any>     & { kind: typeof AnyKind } & CustomOptions

// ------------------------------------------------------------------------
// Extended Schema Types
// ------------------------------------------------------------------------

export const ConstructorKind = Symbol('ConstructorKind')
export const FunctionKind    = Symbol('FunctionKind')
export const PromiseKind     = Symbol('PromiseKind')
export const UndefinedKind   = Symbol('UndefinedKind')
export const VoidKind        = Symbol('VoidKind')
export type TConstructor <T> = Infer<T> & { kind: typeof ConstructorKind, type: 'constructor', arguments: TSchema[], returns: TSchema } & CustomOptions
export type TFunction    <T> = Infer<T> & { kind: typeof FunctionKind,    type: 'function', arguments: TSchema[], returns: TSchema } & CustomOptions
export type TPromise     <T> = Infer<T> & { kind: typeof PromiseKind,     type: 'promise', item: TSchema } & CustomOptions
export type TUndefined       = Infer<undefined> & { kind: typeof UndefinedKind, type: 'undefined' } & CustomOptions
export type TVoid            = Infer<void>      & { kind: typeof VoidKind, type: 'void' } & CustomOptions

// ------------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------------

export type TSchema =
    | TIntersect<any>
    | TUnion<any>
    | TTuple<any>
    | TObject<any>
    | TKeyOf<any>
    | TRecord<any>
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
    | TConstructor<any>
    | TFunction<any>
    | TPromise<any>
    | TUndefined
    | TVoid

// ------------------------------------------------------------------------
// Static Inference
// ------------------------------------------------------------------------

export type UnionToIntersect<U>                             = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
export type IntersectEvaluate<T extends readonly TSchema[]> = {[K in keyof T]: Static<T[K]> }
export type IntersectReduce<I extends unknown, T extends readonly any[]> = T extends [infer A, ...infer B] ? IntersectReduce<I & A, B> : I
export type ReadonlyOptionalPropertyKeys <T extends TProperties> = { [K in keyof T]: T[K] extends TReadonlyOptional<TSchema> ? K : never }[keyof T]
export type ReadonlyPropertyKeys         <T extends TProperties> = { [K in keyof T]: T[K] extends TReadonly<TSchema> ? K : never }[keyof T]
export type OptionalPropertyKeys         <T extends TProperties> = { [K in keyof T]: T[K] extends TOptional<TSchema> ? K : never }[keyof T]
export type RequiredPropertyKeys         <T extends TProperties> = keyof Omit<T, ReadonlyOptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | OptionalPropertyKeys<T>>
export type StaticProperties<T extends TProperties> =
    { readonly [K in ReadonlyOptionalPropertyKeys<T>]?: Static<T[K]> } &
    { readonly [K in ReadonlyPropertyKeys<T>]:          Static<T[K]> } &
    {          [K in OptionalPropertyKeys<T>]?:         Static<T[K]> } &
    {          [K in RequiredPropertyKeys<T>]:          Static<T[K]> }
export type StaticRecord      <K extends TRecordKey, T extends TSchema> = 
    K extends TString     ? Record<string, Static<T>> : 
    K extends TNumber     ? Record<number, Static<T>> : 
    K extends TKeyOf<any> ? Record<K['_infer'], Static<T>> : 
    K extends TUnion<any> ? Record<K['_infer'], Static<T>> :
    never
export type StaticEnum        <T>                                       = T extends TEnumKey<infer U>[] ? U : never
export type StaticKeyOf       <T extends TKey[]>                        = T extends Array<infer K> ? K : never
export type StaticIntersect   <T extends readonly TSchema[]>            = IntersectReduce<unknown, IntersectEvaluate<T>>
export type StaticUnion       <T extends readonly TSchema[]>            = { [K in keyof T]: Static<T[K]> }[number]
export type StaticTuple       <T extends readonly TSchema[]>            = { [K in keyof T]: Static<T[K]> }
export type StaticObject      <T extends TProperties>                   = StaticProperties<StaticProperties<T>>
export type StaticArray       <T extends TSchema>                               = Array<Static<T>>
export type StaticLiteral     <T extends TValue>                                = T
export type StaticConstructor <T extends readonly TSchema[], U extends TSchema> = new (...args: [...{ [K in keyof T]: Static<T[K]> }]) => Static<U>
export type StaticFunction    <T extends readonly TSchema[], U extends TSchema> = (...args: [...{ [K in keyof T]: Static<T[K]> }]) => Static<U>
export type StaticPromise     <T extends TSchema>                               = Promise<Static<T>>
export type Static<T> =
    T extends TKeyOf<infer I>       ? I :
    T extends TIntersect<infer I>   ? I : 
    T extends TUnion<infer I>       ? I :
    T extends TTuple<infer I>       ? I :
    T extends TObject<infer I>      ? { [K in keyof I]: I[K] } : // Reduce Modifiers
    T extends TRecord<infer I>      ? I :
    T extends TArray<infer I>       ? I :
    T extends TEnum<infer I>        ? I :
    T extends TLiteral<infer I>     ? I :
    T extends TString               ? T['_infer'] :
    T extends TNumber               ? T['_infer'] :
    T extends TInteger              ? T['_infer'] :
    T extends TBoolean              ? T['_infer'] : 
    T extends TNull                 ? T['_infer'] :
    T extends TUnknown              ? T['_infer'] :
    T extends TAny                  ? T['_infer'] :
    T extends TConstructor<infer I> ? I :
    T extends TFunction<infer I>    ? I :
    T extends TPromise<infer I>     ? I :
    T extends TUndefined            ? T['_infer'] :
    T extends TVoid                 ? T['_infer'] :
    never

// ------------------------------------------------------------------------
// Utility
// ------------------------------------------------------------------------

function isObject(object: any) {
    return typeof object === 'object' && object !== null && !Array.isArray(object)
}

function isArray(object: any) {
    return typeof object === 'object' && object !== null && Array.isArray(object)
}

function clone(object: any): any {
    if(isObject(object)) return Object.keys(object).reduce<any>((acc, key) => ({...acc, [key]: clone(object[key]) }), {})
    if(isArray(object)) return object.map((item: any) => clone(item))
    return object
}

// ------------------------------------------------------------------------
// TypeBuilder
// ------------------------------------------------------------------------

export class TypeBuilder {

    /** `standard` Modifies an object property to be both readonly and optional */
    public ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T> {
        return { ...item, modifier: ReadonlyOptionalModifier }
    }

    /** `standard` Modifies an object property to be readonly */
    public Readonly<T extends TSchema>(item: T): TReadonly<T> {
        return { ...item, modifier: ReadonlyModifier }
    }

     /** `standard` Modifies an object property to be optional */
    public Optional<T extends TSchema>(item: T): TOptional<T> {
        return { ...item, modifier: OptionalModifier }
    }

    /** `standard` Creates a type type */
    public Tuple<T extends TSchema[]>(items: [...T], options: CustomOptions = {}): TTuple<StaticTuple<T>> {
        const additionalItems = false
        const minItems = items.length
        const maxItems = items.length
        return (items.length > 0)
            ? { ...options, kind: TupleKind, type: 'array', items, additionalItems, minItems, maxItems }
            : { ...options, kind: TupleKind, type: 'array', minItems, maxItems } as any
    }

    /** `standard` Creates an object type with the given properties */
    public Object<T extends TProperties>(properties: T, options: ObjectOptions = {}): TObject<StaticProperties<T>> {
        const property_names = Object.keys(properties)
        const optional = property_names.filter(name => {
            const candidate = properties[name] as TModifier
            return (candidate.modifier &&
                (candidate.modifier === OptionalModifier ||
                    candidate.modifier === ReadonlyOptionalModifier))
        })
        const required_names = property_names.filter(name => !optional.includes(name))
        const required = (required_names.length > 0) ? required_names : undefined
        return (required) ?
            { ...options, kind: ObjectKind, type: 'object', properties, required } : 
            { ...options, kind: ObjectKind, type: 'object', properties } as any
    }

    /** `standard` Creates an intersection type. Note this function requires draft `2019-09` to constrain with `unevaluatedProperties` */
    public Intersect<T extends TSchema[]>(items: [...T], options: IntersectOptions = {}): TIntersect<StaticIntersect<T>> {
        return { ...options, kind: IntersectKind, type: 'object', allOf: items } as any
    }
    
    /** `standard` Creates a union type */
    public Union<T extends TSchema[]>(items: [...T], options: CustomOptions = {}): TUnion<StaticUnion<T>> {
        return { ...options, kind: UnionKind, anyOf: items } as any
    }

    /** `standard` Creates an array type */
    public Array<T extends TSchema>(items: T, options: ArrayOptions = {}): TArray<StaticArray<T>> {
        return { ...options, kind: ArrayKind, type: 'array', items } as any
    }
    
    /** `standard` Creates an enum type from a TypeScript enum */
    public Enum<T extends TEnumType>(item: T, options: CustomOptions = {}): TEnum<StaticEnum<TEnumKey<T[keyof T]>[]>> {
        const values = Object.keys(item).filter(key => isNaN(key as any)).map(key => item[key]) as T[keyof T][]
        const anyOf  = values.map(value => typeof value === 'string' ? { type: 'string' as const, const: value } : { type: 'number' as const, const: value })
        return { ...options, kind: EnumKind, anyOf } as any
    }

    /** `standard` Creates a literal type. Supports string, number and boolean values only */
    public Literal<T extends TValue>(value: T, options: CustomOptions = {}): TLiteral<StaticLiteral<T>> {
        return { ...options, kind: LiteralKind, const: value, type: typeof value as 'string' | 'number' | 'boolean' } as any
    }

    /** `standard` Creates a string type */
    public String<TCustomFormatOption extends string>(options: StringOptions<StringFormatOption | TCustomFormatOption> = {}): TString {
        return { ...options, kind: StringKind, type: 'string' } as any
    }

    /** `standard` Creates a string type from a regular expression */
    public RegEx(regex: RegExp, options: CustomOptions = {}): TString {
        return this.String({ ...options, pattern: regex.source }) as any
    }

    /** `standard` Creates a number type */
    public Number(options: NumberOptions = {}): TNumber {
        return { ...options, kind: NumberKind, type: 'number' } as any
    }

    /** `standard` Creates an integer type */
    public Integer(options: NumberOptions = {}): TInteger {
        return { ...options, kind: IntegerKind, type: 'integer' } as any
    }

    /** `standard` Creates a boolean type */
    public Boolean(options: CustomOptions = {}): TBoolean {
        return { ...options, kind: BooleanKind, type: 'boolean' } as any
    }

    /** `standard` Creates a null type */
    public Null(options: CustomOptions = {}): TNull {
        return { ...options, kind: NullKind, type: 'null' } as any
    }

    /** `standard` Creates an unknown type */
    public Unknown(options: CustomOptions = {}): TUnknown {
        return { ...options, kind: UnknownKind } as any
    }

    /** `standard` Creates an any type */
    public Any(options: CustomOptions = {}): TAny {
        return { ...options, kind: AnyKind } as any
    }
    
    /** `standard` Creates a keyof type from the given object */
    public KeyOf<T extends TObject<any>>(schema: T, options: CustomOptions = {}): TKeyOf<keyof T['_infer']> {
        const keys = Object.keys(schema.properties)
        return {...options, kind: KeyOfKind, type: 'string', enum: keys } as any
    }
    
    /** `standard` Creates a record type */
    public Record<K extends TRecordKey, T extends TSchema>(key: K, value: T, options: ObjectOptions = {}): TRecord<StaticRecord<K, T>> {
        const pattern = (() => {
            switch(key.kind) {
                case UnionKind:  return `^${key.anyOf.map(literal => literal.const as TValue).join('|')}$`
                case KeyOfKind:  return `^${key.enum.join('|')}$`
                case NumberKind: return '^(0|[1-9][0-9]*)$'
                case StringKind: return key.pattern ? key.pattern : '^.*$'
                default: throw Error('Invalid Record Key')
            }
        })()
        return { ...options, kind: RecordKind, type: 'object', patternProperties: { [pattern]: value } } as any
    }

    /** `standard` Makes all properties in the given object type required */
    public Required<T extends TObject<any>>(schema: T, options: ObjectOptions = {}): TObject<Required<T['_infer']>> {
        const next = { ...clone(schema), ...options }
        next.required = Object.keys(next.properties)
        for(const key of Object.keys(next.properties)) {
            const property = next.properties[key]
            switch(property.modifier) {
                case ReadonlyOptionalModifier: property.modifier = ReadonlyModifier; break;
                case ReadonlyModifier: property.modifier = ReadonlyModifier; break;
                case OptionalModifier: delete property.modifier; break;
                default: delete property.modifier; break;
            }
        }
        return next
    }
    
    /** `standard` Makes all properties in the given object type optional */
    public Partial<T extends TObject<any>>(schema: T, options: ObjectOptions = {}): TObject<Partial<T['_infer']>> {
        const next = { ...clone(schema), ...options }
        delete next.required
        for(const key of Object.keys(next.properties)) {
            const property = next.properties[key]
            switch(property.modifier) {
                case ReadonlyOptionalModifier: property.modifier = ReadonlyOptionalModifier; break;
                case ReadonlyModifier: property.modifier = ReadonlyOptionalModifier; break;
                case OptionalModifier: property.modifier = OptionalModifier; break;
                default: property.modifier = OptionalModifier; break;
            }
        }
        return next
    }

    /** `standard` Picks property keys from the given object type */
    public Pick<T extends TObject<any>, K extends (keyof T['_infer'])[]>(schema: T, keys: [...K], options: ObjectOptions = {}): TObject<Pick<T['_infer'], K[number]>> {
        const next = { ...clone(schema), ...options }
        next.required = next.required ? next.required.filter((key: string) => keys.includes(key)) : undefined
        for(const key of Object.keys(next.properties)) {
            if(!keys.includes(key)) delete next.properties[key]
        }
        return next
    }
    
    /** `standard` Omits property keys from the given object type */
    public Omit<T extends TObject<any>, K extends (keyof T['_infer'])[]>(schema: T, keys: [...K], options: ObjectOptions = {}): TObject<Omit<T['_infer'], K[number]>> {
        const next = { ...clone(schema), ...options }
        next.required = next.required ? next.required.filter((key: string) => !keys.includes(key)) : undefined
        for(const key of Object.keys(next.properties)) {
            if(keys.includes(key)) delete next.properties[key]
        }
        return next
    }

    /** `standard` Omits the `kind` and `modifier` properties from the underlying schema */
    public Strict<T extends TSchema>(schema: T, options: CustomOptions = {}): T {
        return JSON.parse(JSON.stringify({ ...options, ...schema })) as T
    }
    
    /** `extended` Creates a constructor type */
    public Constructor<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options: CustomOptions = {}): TConstructor<StaticConstructor<T, U>> {
        return { ...options, kind: ConstructorKind, type: 'constructor', arguments: args, returns } as any
    }

    /** `extended` Creates a function type */
    public Function<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options: CustomOptions = {}): TFunction<StaticFunction<T, U>> {
        return { ...options, kind: FunctionKind, type: 'function', arguments: args, returns } as any
    }

    /** `extended` Creates a promise type */
    public Promise<T extends TSchema>(item: T, options: CustomOptions = {}): TPromise<StaticPromise<T>> {
        return { ...options, type: 'promise', kind: PromiseKind, item } as any
    }

    /** `extended` Creates a undefined type */
    public Undefined(options: CustomOptions = {}): TUndefined {
        return { ...options, type: 'undefined', kind: UndefinedKind } as any
    }

    /** `extended` Creates a void type */
    public Void(options: CustomOptions = {}): TVoid {
        return { ...options, type: 'void', kind: VoidKind } as any
    }
    
    /** `experimental` Creates a recursive type */
    public Rec<T extends TSchema>(callback: (self: TAny) => T, options: CustomOptions = {}): T {
        const $id = options.$id || ''
        const self = callback({ $ref: `${$id}#/definitions/self` } as any)
        return { ...options, $ref: `${$id}#/definitions/self`, definitions: { self } } as unknown as T
    }

    /** `experimental` Creates a recursive type. Pending https://github.com/ajv-validator/ajv/issues/1709 */
    // public Rec<T extends TProperties>($id: string, callback: (self: TAny) => T, options: ObjectOptions = {}): TObject<T> {
    //     const properties = callback({ $recursiveRef: `${$id}` } as any)
    //     return { ...options, kind: ObjectKind, $id, $recursiveAnchor: true, type: 'object', properties }
    // }

    /** `experimental` Creates a namespace for a set of related types */
    public Namespace<T extends TDefinitions>(definitions: T, options: CustomOptions = {}): TNamespace<T> {
        return { ...options, kind: BoxKind, definitions } as any
    }
    
    /** `experimental` References a type within a namespace. The referenced namespace must specify an `$id` */
    public Ref<T extends TNamespace<TDefinitions>, K extends keyof T['definitions']>(box: T, key: K): T['definitions'][K] 
    
    /** `experimental` References type. The referenced type must specify an `$id` */
    public Ref<T extends TSchema>(schema: T): T
    
    public Ref(...args: any[]): any {
        const $id = args[0]['$id'] || '' as string 
        const key = args[1]              as string
        return (args.length === 2) ? { $ref: `${$id}#/definitions/${key}` } : { $ref: $id }
    }
}

export const Type = new TypeBuilder()
