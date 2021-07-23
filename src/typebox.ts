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

export type IndexedOptions = {
    minProperties?: number
    maxProperties?: number
} & CustomOptions

export type ObjectOptions = {
    additionalProperties?: boolean
} & CustomOptions

export type TEnumType          = Record<string, string | number>
export type TKey               = string | number
export type TValue             = string | number | boolean
export type TRecordKey         = TString | TNumber | TUnion<TLiteral<string | number>[]>
export type TEnumKey<T = TKey> = { type: 'number' | 'string', const: T }

export type TDefinitions                                         = { [key: string]: TSchema }
export type TProperties                                          = { [key: string]: TSchema }
export type TBox       <T extends TDefinitions>                  = { kind: typeof BoxKind, $id: string, definitions: T }
export type TTuple     <T extends TSchema[]>                     = { kind: typeof TupleKind, type: 'array', items: [...T], additionalItems: false, minItems: number, maxItems: number } & CustomOptions
export type TObject    <T extends TProperties>                   = { kind: typeof ObjectKind, type: 'object', properties: T, required?: string[] } & ObjectOptions
export type TUnion     <T extends TSchema[]>                     = { kind: typeof UnionKind, anyOf: [...T] } & CustomOptions
export type TIntersect <T extends TSchema[]>                     = { kind: typeof IntersectKind, type: 'object', allOf: [...T] } & IntersectOptions
export type TKeyOf     <T extends TKey[]>                        = { kind: typeof KeyOfKind, type: 'string', enum: [...T] } & CustomOptions
export type TRecord    <K extends TRecordKey, T extends TSchema> = { kind: typeof RecordKind, type: 'object', patternProperties: { [pattern: string]: T } } & ObjectOptions
export type TArray     <T extends TSchema>                       = { kind: typeof ArrayKind, type: 'array', items: T } & ArrayOptions
export type TLiteral   <T extends TValue>                        = { kind: typeof LiteralKind, const: T } & CustomOptions
export type TEnum      <T extends TEnumKey[]>                    = { kind: typeof EnumKind, anyOf: T } & CustomOptions
export type TString                                              = { kind: typeof StringKind, type: 'string' } & StringOptions<string>
export type TNumber                                              = { kind: typeof NumberKind, type: 'number' } & NumberOptions
export type TInteger                                             = { kind: typeof IntegerKind, type: 'integer' } & NumberOptions
export type TBoolean                                             = { kind: typeof BooleanKind, type: 'boolean' } & CustomOptions
export type TNull                                                = { kind: typeof NullKind, type: 'null' } & CustomOptions
export type TUnknown                                             = { kind: typeof UnknownKind } & CustomOptions
export type TAny                                                 = { kind: typeof AnyKind } & CustomOptions

// ------------------------------------------------------------------------
// Schema Extended
// ------------------------------------------------------------------------

export const ConstructorKind = Symbol('ConstructorKind')
export const FunctionKind    = Symbol('FunctionKind')
export const PromiseKind     = Symbol('PromiseKind')
export const UndefinedKind   = Symbol('UndefinedKind')
export const VoidKind        = Symbol('VoidKind')
export type TConstructor <T extends TSchema[], U extends TSchema> = { kind: typeof ConstructorKind, type: 'constructor', arguments: readonly [...T], returns: U } & CustomOptions
export type TFunction    <T extends TSchema[], U extends TSchema> = { kind: typeof FunctionKind,    type: 'function', arguments: readonly [...T], returns: U } & CustomOptions
export type TPromise     <T extends TSchema>                      = { kind: typeof PromiseKind,     type: 'promise', item: T } & CustomOptions
export type TUndefined       = { kind: typeof UndefinedKind, type: 'undefined' } & CustomOptions
export type TVoid            = { kind: typeof VoidKind, type: 'void' } & CustomOptions

// ------------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------------

export type TSchema =
    | TIntersect<any>
    | TUnion<any>
    | TTuple<any>
    | TObject<any>
    | TKeyOf<any>
    | TRecord<any, any>
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
// Utility Types
// ------------------------------------------------------------------------

export type TRequired<T extends TProperties> = {
    [K in keyof T]: 
        T[K] extends TReadonlyOptional<infer U> ? TReadonly<U> :  
        T[K] extends TReadonly<infer U>         ? TReadonly<U> :
        T[K] extends TOptional<infer U>         ? U :  
        T[K]
}
export type TPartial<T extends TProperties> = {
    [K in keyof T]:
        T[K] extends TReadonlyOptional<infer U> ? TReadonlyOptional<U> :  
        T[K] extends TReadonly<infer U>         ? TReadonlyOptional<U> :
        T[K] extends TOptional<infer U>         ? TOptional<U> :
        TOptional<T[K]>
}

// ------------------------------------------------------------------------
// Static Inference
// ------------------------------------------------------------------------

export type UnionToIntersect<U>                                  = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
export type ObjectPropertyKeys           <T>                     = T extends TObject<infer U> ? PropertyKeys<U> : never
export type PropertyKeys                 <T extends TProperties> = keyof T
export type ReadonlyOptionalPropertyKeys <T extends TProperties> = { [K in keyof T]: T[K] extends TReadonlyOptional<infer U> ? K : never }[keyof T]
export type ReadonlyPropertyKeys         <T extends TProperties> = { [K in keyof T]: T[K] extends TReadonly<infer U> ? K : never }[keyof T]
export type OptionalPropertyKeys         <T extends TProperties> = { [K in keyof T]: T[K] extends TOptional<infer U> ? K : never }[keyof T]
export type RequiredPropertyKeys         <T extends TProperties> = keyof Omit<T, ReadonlyOptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | OptionalPropertyKeys<T>>
export type ReduceModifiers              <T extends object> = { [K in keyof T]: T[K] }
export type StaticModifiers<T extends TProperties> =
    { readonly [K in ReadonlyOptionalPropertyKeys<T>]?: Static<T[K]> } &
    { readonly [K in ReadonlyPropertyKeys<T>]:          Static<T[K]> } &
    {          [K in OptionalPropertyKeys<T>]?:         Static<T[K]> } &
    {          [K in RequiredPropertyKeys<T>]:          Static<T[K]> }

export type StaticEnum        <T>                                               = T extends TEnumKey<infer U>[] ? U : never
export type StaticKeyOf       <T extends TKey[]>                                = T extends Array<infer K> ? K : never
export type StaticIntersect   <T extends readonly TSchema[]>                    = UnionToIntersect<StaticUnion<T>>
export type StaticUnion       <T extends readonly TSchema[]>                    = { [K in keyof T]: Static<T[K]> }[number]
export type StaticTuple       <T extends readonly TSchema[]>                    = { [K in keyof T]: Static<T[K]> }
export type StaticObject      <T extends TProperties>                           = ReduceModifiers<StaticModifiers<T>>
export type StaticRecord      <K extends TRecordKey, T extends TSchema>         = K extends TString ? { [key: string]: Static<T> } : K extends TNumber ? { [key: number]: Static<T> } : K extends TUnion<infer L> ? L extends TLiteral<any>[] ? {[K in StaticUnion<L>]: Static<T> } : never : never
export type StaticArray       <T extends TSchema>                               = Array<Static<T>>
export type StaticLiteral     <T extends TValue>                                = T
export type StaticConstructor <T extends readonly TSchema[], U extends TSchema> = new (...args: [...{ [K in keyof T]: Static<T[K]> }]) => Static<U>
export type StaticFunction    <T extends readonly TSchema[], U extends TSchema> = (...args: [...{ [K in keyof T]: Static<T[K]> }]) => Static<U>
export type StaticPromise     <T extends TSchema>                               = Promise<Static<T>>

export type Static<T> =
    T extends TKeyOf<infer U>                ? StaticKeyOf<U>          :
    T extends TIntersect<infer U>            ? StaticIntersect<U>      : 
    T extends TUnion<infer U>                ? StaticUnion<U>          :
    T extends TTuple<infer U>                ? StaticTuple<U>          :
    T extends TObject<infer U>               ? StaticObject<U>         :
    T extends TRecord<infer K, infer U>      ? StaticRecord<K, U>      :
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

    /** `STANDARD` Modifies a schema object property to be `readonly` and `optional`. */
    public ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T> {
        return { ...item, modifier: ReadonlyOptionalModifier }
    }

    /** `STANDARD` Modifies a schema object property to be `readonly`. */
    public Readonly<T extends TSchema>(item: T): TReadonly<T> {
        return { ...item, modifier: ReadonlyModifier }
    }

    /** `STANDARD` Modifies a schema object property to be `optional`. */
    public Optional<T extends TSchema>(item: T): TOptional<T> {
        return { ...item, modifier: OptionalModifier }
    }

    /** `STANDARD` Creates a Tuple schema. */
    public Tuple<T extends TSchema[]>(items: [...T], options: CustomOptions = {}): TTuple<T> {
        const additionalItems = false
        const minItems = items.length
        const maxItems = items.length
        return { ...options, kind: TupleKind, type: 'array', items, additionalItems, minItems, maxItems }
    }

    /** `STANDARD` Creates a `object` schema with the given properties. */
    public Object<T extends TProperties>(properties: T, options: ObjectOptions = {}): TObject<T> {
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
            { ...options, kind: ObjectKind, type: 'object', properties }
    }

    /** `STANDARD` Creates an intersection schema. Note this function requires draft `2019-09` to constrain with `unevaluatedProperties`. */
    public Intersect<T extends TSchema[]>(items: [...T], options: IntersectOptions = {}): TIntersect<T> {
        return { ...options, kind: IntersectKind, type: 'object', allOf: items }
    }
    
    /** `STANDARD` Creates a Union schema. */
    public Union<T extends TSchema[]>(items: [...T], options: CustomOptions = {}): TUnion<T> {
        return { ...options, kind: UnionKind, anyOf: items }
    }

    /** `STANDARD` Creates an `Array<T>` schema. */
    public Array<T extends TSchema>(items: T, options: ArrayOptions = {}): TArray<T> {
        return { ...options, kind: ArrayKind, type: 'array', items }
    }
    
    /** `STANDARD` Creates an `Enum<T>` schema from a TypeScript `enum` definition. */
    public Enum<T extends TEnumType>(item: T, options: CustomOptions = {}): TEnum<TEnumKey<T[keyof T]>[]> {
        const values = Object.keys(item).filter(key => isNaN(key as any)).map(key => item[key]) as T[keyof T][]
        const anyOf  = values.map(value => typeof value === 'string' ? { type: 'string' as const, const: value } : { type: 'number' as const, const: value })
        return { ...options, kind: EnumKind, anyOf } 
    }

    /** `STANDARD` Creates a literal schema. Supports `string | number | boolean` values. */
    public Literal<T extends TValue>(value: T, options: CustomOptions = {}): TLiteral<T> {
        return { ...options, kind: LiteralKind, const: value, type: typeof value as 'string' | 'number' | 'boolean' }
    }

    /** `STANDARD` Creates a `string` schema. */
    public String<TCustomFormatOption extends string>(options: StringOptions<StringFormatOption | TCustomFormatOption> = {}): TString {
        return { ...options, kind: StringKind, type: 'string' }
    }

    /** `STANDARD` Creates a `string` schema from a regular expression. */
    public RegEx(regex: RegExp, options: CustomOptions = {}): TString {
        return this.String({ ...options, pattern: regex.source })
    }

    /** `STANDARD` Creates a `number` schema. */
    public Number(options: NumberOptions = {}): TNumber {
        return { ...options, kind: NumberKind, type: 'number' }
    }

    /** `STANDARD` Creates a `integer` schema. */
    public Integer(options: NumberOptions = {}): TInteger {
        return { ...options, kind: IntegerKind, type: 'integer' }
    }

    /** `STANDARD` Creates a `boolean` schema. */
    public Boolean(options: CustomOptions = {}): TBoolean {
        return { ...options, kind: BooleanKind, type: 'boolean' }
    }

    /** `STANDARD` Creates a `null` schema. */
    public Null(options: CustomOptions = {}): TNull {
        return { ...options, kind: NullKind, type: 'null' }
    }

    /** `STANDARD` Creates an `unknown` schema. */
    public Unknown(options: CustomOptions = {}): TUnknown {
        return { ...options, kind: UnknownKind }
    }

    /** `STANDARD` Creates an `any` schema. */
    public Any(options: CustomOptions = {}): TAny {
        return { ...options, kind: AnyKind }
    }
    
    /** `STANDARD` Creates a `keyof` schema. */
    public KeyOf<T extends TObject<TProperties>>(schema: T, options: CustomOptions = {}): TKeyOf<ObjectPropertyKeys<T>[]> {
        const keys = Object.keys(schema.properties) as ObjectPropertyKeys<T>[]
        return {...options, kind: KeyOfKind, type: 'string', enum: keys }
    }
    
    /** `STANDARD` Creates a `Record<Keys, Value>` schema. */
    public Record<K extends TRecordKey, T extends TSchema>(key: K, value: T, options: ObjectOptions = {}): TRecord<K, T> {
        const pattern = key.kind === UnionKind  ? `^${key.anyOf.map(key => key.const).join('|')}$` :
                        key.kind === NumberKind ? '^(0|[1-9][0-9]*)$' :
                        key.pattern             ? key.pattern :  '^.*$'
        return { ...options, kind: RecordKind, type: 'object', patternProperties: { [pattern]: value } }
    }

    /** `STANDARD` Make all properties in schema object required. */
    public Required<T extends TObject<TProperties>>(schema: T, options: ObjectOptions = {}): TObject<TRequired<T['properties']>> {
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
    
    /** `STANDARD`  Make all properties in schema object optional. */
    public Partial<T extends TObject<TProperties>>(schema: T, options: ObjectOptions = {}): TObject<TPartial<T['properties']>> {
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

    /** `STANDARD` Picks property keys from the given object schema. */
    public Pick<T extends TObject<TProperties>, K extends PropertyKeys<T['properties']>[]>(schema: T, keys: [...K], options: ObjectOptions = {}): TObject<Pick<T['properties'], K[number]>> {
        const next = { ...clone(schema), ...options }
        next.required = next.required ? next.required.filter((key: string) => keys.includes(key)) : undefined
        for(const key of Object.keys(next.properties)) {
            if(!keys.includes(key)) delete next.properties[key]
        }
        return next
    }
    
    /** `STANDARD` Omits property keys from the given object schema. */
    public Omit<T extends TObject<TProperties>, K extends PropertyKeys<T['properties']>[]>(schema: T, keys: [...K], options: ObjectOptions = {}): TObject<Omit<T['properties'], K[number]>> {
        const next = { ...clone(schema), ...options }
        next.required = next.required ? next.required.filter((key: string) => !keys.includes(key)) : undefined
        for(const key of Object.keys(next.properties)) {
            if(keys.includes(key)) delete next.properties[key]
        }
        return next
    }

    /** `STANDARD` Omits the `kind` and `modifier` properties from the given schema. */
    public Strict<T extends TSchema>(schema: T, options: CustomOptions = {}): T {
        return JSON.parse(JSON.stringify({ ...options, ...schema })) as T
    }
    
    /** `EXTENDED` Creates a `constructor` schema. */
    public Constructor<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options: CustomOptions = {}): TConstructor<T, U> {
        return { ...options, kind: ConstructorKind, type: 'constructor', arguments: args, returns };
    }

    /** `EXTENDED` Creates a `function` schema. */
    public Function<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options: CustomOptions = {}): TFunction<T, U> {
        return { ...options, kind: FunctionKind, type: 'function', arguments: args, returns };
    }

    /** `EXTENDED` Creates a `Promise<T>` schema. */
    public Promise<T extends TSchema>(item: T, options: CustomOptions = {}): TPromise<T> {
        return { ...options, type: 'promise', kind: PromiseKind, item }
    }

    /** `EXTENDED` Creates a `undefined` schema. */
    public Undefined(options: CustomOptions = {}): TUndefined {
        return { ...options, type: 'undefined', kind: UndefinedKind }
    }

    /** `EXTENDED` Creates a `void` schema. */
    public Void(options: CustomOptions = {}): TVoid {
        return { ...options, type: 'void', kind: VoidKind }
    }

    /** `EXPERIMENTAL` Creates a container for schema definitions. */
    public Box<T extends TDefinitions>($id: string, definitions: T): TBox<T> {
        return { kind: BoxKind, $id, definitions }
    }
    
    /** `EXPERIMENTAL` References a schema within a box. */
    public Ref<T extends TBox<TDefinitions>, K extends keyof T['definitions']>(box: T, key: K): T['definitions'][K] {
        return { $ref: `${box.$id}#/definitions/${key as string}` } as unknown as T['definitions'][K]
    }
    
    /** `EXPERIMENTAL` Creates a recursive type. */
    public Rec<T extends TSchema>($id: string, callback: (self: TAny) => T): T {
        const self = callback({ $ref: `${$id}#/definitions/self` } as any)
        return { $id,  $ref: `${$id}#/definitions/self`, definitions: { self } } as unknown as T
    }

    /** `EXPERIMENTAL` Creates a recursive type. Pending https://github.com/ajv-validator/ajv/issues/1709 */
    // public Rec<T extends TProperties>($id: string, callback: (self: TAny) => T, options: ObjectOptions = {}): TObject<T> {
    //     const properties = callback({ $recursiveRef: `${$id}` } as any)
    //     return { ...options, kind: ObjectKind, $id, $recursiveAnchor: true, type: 'object', properties }
    // }
}

export const Type = new TypeBuilder()
