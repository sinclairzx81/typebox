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

// --------------------------------------------------------------------------
// Modifiers
// --------------------------------------------------------------------------

export const ReadonlyOptionalModifier            = Symbol('ReadonlyOptionalModifier')
export const OptionalModifier                    = Symbol('OptionalModifier')
export const ReadonlyModifier                    = Symbol('ReadonlyModifier')

export type TModifier                            = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>
export type TReadonlyOptional<T extends TSchema> = T & { modifier: typeof ReadonlyOptionalModifier }
export type TOptional<T extends TSchema>         = T & { modifier: typeof OptionalModifier }
export type TReadonly<T extends TSchema>         = T & { modifier: typeof ReadonlyModifier }

// --------------------------------------------------------------------------
// Schema Standard
// --------------------------------------------------------------------------

export const NamespaceKind = Symbol('NamespaceKind')
export const KeyOfKind     = Symbol('KeyOfKind')
export const IntersectKind = Symbol('IntersectKind')
export const UnionKind     = Symbol('UnionKind')
export const TupleKind     = Symbol('TupleKind')
export const ObjectKind    = Symbol('ObjectKind')
export const RecordKind    = Symbol('RecordKind')
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
export const RefKind       = Symbol('RefKind')

// --------------------------------------------------------------------------
// Options
// --------------------------------------------------------------------------

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
    minProperties?: number;
    maxProperties?: number;
} & CustomOptions

// --------------------------------------------------------------------------
// Namespace
// --------------------------------------------------------------------------

export type TDefinitions                       = { [key: string]: TSchema }
export type TNamespace<T extends TDefinitions> = { kind: typeof NamespaceKind, $defs: T } & CustomOptions

// --------------------------------------------------------------------------
// TSchema
// --------------------------------------------------------------------------

export interface TSchema { $static: unknown }

// --------------------------------------------------------------------------
// Standard Schema Types
// --------------------------------------------------------------------------

export type TEnumType          = Record<string, string | number>
export type TKey               = string | number | symbol
export type TValue             = string | number | boolean
export type TRecordKey         = TString | TNumber | TKeyOf<any> | TUnion<any>
export type TEnumKey<T = TKey> = { type: 'number' | 'string', const: T }

export interface TProperties { [key: string]: TSchema }
export interface TRecord    <K extends TRecordKey, T extends TSchema> extends TSchema, ObjectOptions         { $static: StaticRecord<K, T>, kind: typeof RecordKind,    type: 'object', patternProperties: { [pattern: string]: T } }
export interface TTuple     <T extends TSchema[]>                     extends TSchema, CustomOptions         { $static: StaticTuple<T>,     kind: typeof TupleKind,     type: 'array', items?: T, additionalItems?: false, minItems: number, maxItems: number }
export interface TObject    <T extends TProperties>                   extends TSchema, ObjectOptions         { $static: StaticObject<T>,    kind: typeof ObjectKind,    type: 'object', properties: T, required?: string[] } 
export interface TUnion     <T extends TSchema[]>                     extends TSchema, CustomOptions         { $static: StaticUnion<T>,     kind: typeof UnionKind,     anyOf: T }
export interface TIntersect <T extends TSchema[]>                     extends TSchema, IntersectOptions      { $static: StaticIntersect<T>, kind: typeof IntersectKind, type: 'object', allOf: T }
export interface TKeyOf     <T extends TKey[]>                        extends TSchema, CustomOptions         { $static: StaticKeyOf<T>,     kind: typeof KeyOfKind,     type: 'string', enum: T }
export interface TArray     <T extends TSchema>                       extends TSchema, ArrayOptions          { $static: StaticArray<T>,     kind: typeof ArrayKind,     type: 'array', items: T } 
export interface TLiteral   <T extends TValue>                        extends TSchema, CustomOptions         { $static: StaticLiteral<T>,   kind: typeof LiteralKind,   const: T }
export interface TEnum      <T extends TEnumKey[]>                    extends TSchema, CustomOptions         { $static: StaticEnum<T>,      kind: typeof EnumKind,      anyOf: T }
export interface TRef       <T extends TSchema>                       extends TSchema, CustomOptions         { $static: Static<T>,          kind: typeof RefKind,       $ref: string  }
export interface TString                                              extends TSchema, StringOptions<string> { $static: string,             kind: typeof StringKind,    type: 'string' }
export interface TNumber                                              extends TSchema, NumberOptions         { $static: number,             kind: typeof NumberKind,    type: 'number' }
export interface TInteger                                             extends TSchema, NumberOptions         { $static: number,             kind: typeof IntegerKind,   type: 'integer' } 
export interface TBoolean                                             extends TSchema, CustomOptions         { $static: boolean,            kind: typeof BooleanKind,   type: 'boolean' } 
export interface TNull                                                extends TSchema, CustomOptions         { $static: null,               kind: typeof NullKind,      type: 'null' }
export interface TUnknown                                             extends TSchema, CustomOptions         { $static: unknown,            kind: typeof UnknownKind }
export interface TAny                                                 extends TSchema, CustomOptions         { $static: any,                kind: typeof AnyKind }


// --------------------------------------------------------------------------
// Extended Schema Types
// --------------------------------------------------------------------------

export const ConstructorKind = Symbol('ConstructorKind')
export const FunctionKind    = Symbol('FunctionKind')
export const PromiseKind     = Symbol('PromiseKind')
export const UndefinedKind   = Symbol('UndefinedKind')
export const VoidKind        = Symbol('VoidKind')
export interface TConstructor <T extends TSchema[], U extends TSchema> extends TSchema, CustomOptions { $static: StaticConstructor<T, U>, kind: typeof ConstructorKind, type: 'constructor', arguments: TSchema[], returns: TSchema }
export interface TFunction    <T extends TSchema[], U extends TSchema> extends TSchema, CustomOptions { $static: StaticFunction<T, U>, kind: typeof FunctionKind, type: 'function', arguments: TSchema[], returns: TSchema }
export interface TPromise     <T extends TSchema>                      extends TSchema, CustomOptions { $static: StaticPromise<T>, kind: typeof PromiseKind, type: 'promise', item: TSchema }
export interface TUndefined                                            extends TSchema, CustomOptions { $static: undefined, kind: typeof UndefinedKind, type: 'undefined' }
export interface TVoid                                                 extends TSchema, CustomOptions { $static: void, kind: typeof VoidKind, type: 'void' }

// --------------------------------------------------------------------------
// Utility Types
// --------------------------------------------------------------------------

export type Selectable = TObject<TProperties> | TRef<TObject<TProperties>>
export type SelectablePropertyKeys             <T extends Selectable>          = T extends TObject<infer U> ? keyof U : T extends TRef<TObject<infer U>> ? keyof U : never
export type SelectableProperties               <T extends Selectable>          = T extends TObject<infer U> ? U : T extends TRef<TObject<infer U>> ? U : never
export type UnionToIntersect<U>                                                = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
export type StaticReadonlyOptionalPropertyKeys <T extends TProperties>         = { [K in keyof T]: T[K] extends TReadonlyOptional<TSchema> ? K : never }[keyof T]
export type StaticReadonlyPropertyKeys         <T extends TProperties>         = { [K in keyof T]: T[K] extends TReadonly<TSchema> ? K : never }[keyof T]
export type StaticOptionalPropertyKeys         <T extends TProperties>         = { [K in keyof T]: T[K] extends TOptional<TSchema> ? K : never }[keyof T]
export type StaticRequiredPropertyKeys         <T extends TProperties>         = keyof Omit<T, StaticReadonlyOptionalPropertyKeys<T> | StaticReadonlyPropertyKeys<T> | StaticOptionalPropertyKeys<T>>
export type StaticIntersectEvaluate            <T extends readonly TSchema[]>  = {[K in keyof T]: T[K] extends TSchema ? Static<T[K]> : never }
export type StaticIntersectReduce<I extends unknown, T extends readonly any[]> = T extends [infer A, ...infer B] ? StaticIntersectReduce<I & A, B> : I
export type StaticRequired<T extends TProperties> = {
    [K in keyof T]: 
        T[K] extends TReadonlyOptional<infer U> ? TReadonly<U> :  
        T[K] extends TReadonly<infer U>         ? TReadonly<U> :
        T[K] extends TOptional<infer U>         ? U :  
        T[K]
}
export type StaticPartial<T extends TProperties> = {
    [K in keyof T]:
        T[K] extends TReadonlyOptional<infer U> ? TReadonlyOptional<U> :  
        T[K] extends TReadonly<infer U>         ? TReadonlyOptional<U> :
        T[K] extends TOptional<infer U>         ? TOptional<U> :
        TOptional<T[K]>
}

// ------------------------------------------------------------------------
// Static Schema
// ------------------------------------------------------------------------

export type StaticProperties <T extends TProperties> =
    { readonly [K in StaticReadonlyOptionalPropertyKeys<T>]?: Static<T[K]> } &
    { readonly [K in StaticReadonlyPropertyKeys<T>]:          Static<T[K]> } &
    {          [K in StaticOptionalPropertyKeys<T>]?:         Static<T[K]> } &
    {          [K in StaticRequiredPropertyKeys<T>]:          Static<T[K]> }
export type StaticRecord <K extends TRecordKey, T extends TSchema> = 
    K extends TString           ? Record<string, Static<T>> : 
    K extends TNumber           ? Record<number, Static<T>> : 
    K extends TKeyOf<TKey[]>    ? Record<K['$static'], Static<T>> : 
    K extends TUnion<TSchema[]> ? Record<K['$static'], Static<T>> :
    never
export type StaticEnum        <T>                                               = T extends TEnumKey<infer U>[] ? U : never
export type StaticKeyOf       <T extends TKey[]>                                = T extends Array<infer K> ? K : never
export type StaticIntersect   <T extends readonly TSchema[]>                    = StaticIntersectReduce<unknown, StaticIntersectEvaluate<T>>
export type StaticUnion       <T extends readonly TSchema[]>                    = { [K in keyof T]: T[K] extends TSchema ? Static<T[K]> : never }[number]
export type StaticTuple       <T extends readonly TSchema[]>                    = { [K in keyof T]: T[K] extends TSchema ? Static<T[K]> : never }
export type StaticObject      <T extends TProperties>                           = StaticProperties<T> extends infer I ? {[K in keyof I]: I[K]}: never
export type StaticArray       <T extends TSchema>                               = Array<Static<T>>
export type StaticLiteral     <T extends TValue>                                = T
export type StaticParameters  <T extends readonly TSchema[]>                    = {[K in keyof T]: T[K] extends TSchema ? Static<T[K]>: never }
export type StaticConstructor <T extends readonly TSchema[], U extends TSchema> = new (...args: [...StaticParameters<T>]) => Static<U>
export type StaticFunction    <T extends readonly TSchema[], U extends TSchema> = (...args: [...StaticParameters<T>]) => Static<U>
export type StaticPromise     <T extends TSchema>                               = Promise<Static<T>>
export type Static            <T extends TSchema>                               = T['$static']

// --------------------------------------------------------------------------
// Utility
// --------------------------------------------------------------------------

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

// --------------------------------------------------------------------------
// TypeBuilder
// --------------------------------------------------------------------------

export class TypeBuilder {

    protected readonly schemas = new Map<string, TSchema>()

    /** `Standard` Modifies an object property to be both readonly and optional */
    public ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T> {
        return { ...item, modifier: ReadonlyOptionalModifier }
    }

    /** `Standard` Modifies an object property to be readonly */
    public Readonly<T extends TSchema>(item: T): TReadonly<T> {
        return { ...item, modifier: ReadonlyModifier }
    }

     /** `Standard` Modifies an object property to be optional */
    public Optional<T extends TSchema>(item: T): TOptional<T> {
        return { ...item, modifier: OptionalModifier }
    }

    /** `Standard` Creates a type type */
    public Tuple<T extends TSchema[]>(items: [...T], options: CustomOptions = {}): TTuple<T> {
        const additionalItems = false
        const minItems = items.length
        const maxItems = items.length
        const schema = ((items.length > 0)
            ? { ...options, kind: TupleKind, type: 'array', items, additionalItems, minItems, maxItems }
            : { ...options, kind: TupleKind, type: 'array', minItems, maxItems }) as any
        return this.Store(schema)
    }

    /** `Standard` Creates an object type with the given properties */
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
        return this.Store(((required) 
            ? { ...options, kind: ObjectKind, type: 'object', properties, required } 
            : { ...options, kind: ObjectKind, type: 'object', properties }))
    }

    /** `Standard` Creates an intersect type. */
    public Intersect<T extends TSchema[]>(items: [...T], options: IntersectOptions = {}): TIntersect<T> {
        return this.Store({ ...options, kind: IntersectKind, type: 'object', allOf: items })
    }
    
    /** `Standard` Creates a union type */
    public Union<T extends TSchema[]>(items: [...T], options: CustomOptions = {}): TUnion<T> {
        return this.Store({ ...options, kind: UnionKind, anyOf: items })
    }

    /** `Standard` Creates an array type */
    public Array<T extends TSchema>(items: T, options: ArrayOptions = {}): TArray<T> {
        return this.Store({ ...options, kind: ArrayKind, type: 'array', items })
    }
    
    /** `Standard` Creates an enum type from a TypeScript enum */
    public Enum<T extends TEnumType>(item: T, options: CustomOptions = {}): TEnum<TEnumKey<T[keyof T]>[]> {
        const values = Object.keys(item).filter(key => isNaN(key as any)).map(key => item[key]) as T[keyof T][]
        const anyOf  = values.map(value => typeof value === 'string' ? { type: 'string' as const, const: value } : { type: 'number' as const, const: value })
        return this.Store({ ...options, kind: EnumKind, anyOf })
    }

    /** `Standard` Creates a literal type. Supports string, number and boolean values only */
    public Literal<T extends TValue>(value: T, options: CustomOptions = {}): TLiteral<T> {
        return this.Store({ ...options, kind: LiteralKind, const: value, type: typeof value as 'string' | 'number' | 'boolean' })
    }

    /** `Standard` Creates a string type */
    public String<TCustomFormatOption extends string>(options: StringOptions<StringFormatOption | TCustomFormatOption> = {}): TString {
        return this.Store({ ...options, kind: StringKind, type: 'string' })
    }

    /** `Standard` Creates a string type from a regular expression */
    public RegEx(regex: RegExp, options: CustomOptions = {}): TString {
        return this.String({ ...options, pattern: regex.source })
    }

    /** `Standard` Creates a number type */
    public Number(options: NumberOptions = {}): TNumber {
        return this.Store({ ...options, kind: NumberKind, type: 'number' })
    }

    /** `Standard` Creates an integer type */
    public Integer(options: NumberOptions = {}): TInteger {
        return this.Store({ ...options, kind: IntegerKind, type: 'integer' })
    }

    /** `Standard` Creates a boolean type */
    public Boolean(options: CustomOptions = {}): TBoolean {
        return this.Store({ ...options, kind: BooleanKind, type: 'boolean' })
    }

    /** `Standard` Creates a null type */
    public Null(options: CustomOptions = {}): TNull {
        return this.Store({ ...options, kind: NullKind, type: 'null' })
    }

    /** `Standard` Creates an unknown type */
    public Unknown(options: CustomOptions = {}): TUnknown {
        return this.Store({ ...options, kind: UnknownKind })
    }

    /** `Standard` Creates an any type */
    public Any(options: CustomOptions = {}): TAny {
        return this.Store({ ...options, kind: AnyKind })
    }
    
    /** `Standard` Creates a record type */
    public Record<K extends TRecordKey, T extends TSchema>(key: K, value: T, options: ObjectOptions = {}): TRecord<K, T> {
        const pattern = (() => {
            switch(key.kind) {
                case UnionKind:  return `^${key.anyOf.map((literal: any) => literal.const as TValue).join('|')}$`
                case KeyOfKind:  return `^${key.enum.join('|')}$`
                case NumberKind: return '^(0|[1-9][0-9]*)$'
                case StringKind: return key.pattern ? key.pattern : '^.*$'
                default: throw Error('Invalid Record Key')
            }
        })()
        return this.Store({ ...options, kind: RecordKind, type: 'object', patternProperties: { [pattern]: value } })
    }

    /** `Standard` Creates a keyof type from the given object */
    public KeyOf<T extends TObject<TProperties> | TRef<TObject<TProperties>>>(object: T, options: CustomOptions = {}): TKeyOf<SelectablePropertyKeys<T>[]> {
        const source = this.Deref(object)
        const keys = Object.keys(source.properties)
        return this.Store({...options, kind: KeyOfKind, type: 'string', enum: keys })
    }

    /** `Standard` Makes all properties in the given object type required */
    public Required<T extends TObject<TProperties> | TRef<TObject<TProperties>>>(object: T, options: ObjectOptions = {}): TObject<StaticRequired<T['properties']>> {
        const source = this.Deref(object)
        const schema = { ...clone(source), ...options }
        schema.required = Object.keys(schema.properties)
        for(const key of Object.keys(schema.properties)) {
            const property = schema.properties[key]
            switch(property.modifier) {
                case ReadonlyOptionalModifier: property.modifier = ReadonlyModifier; break;
                case ReadonlyModifier: property.modifier = ReadonlyModifier; break;
                case OptionalModifier: delete property.modifier; break;
                default: delete property.modifier; break;
            }
        }
        return this.Store(schema)
    }
    
    /** `Standard` Makes all properties in the given object type optional */
    public Partial<T extends TObject<TProperties> | TRef<TObject<TProperties>>>(object: T, options: ObjectOptions = {}): TObject<StaticPartial<T['properties']>> {
        const source = this.Deref(object)
        const schema = { ...clone(source), ...options }
        delete schema.required
        for(const key of Object.keys(schema.properties)) {
            const property = schema.properties[key]
            switch(property.modifier) {
                case ReadonlyOptionalModifier: property.modifier = ReadonlyOptionalModifier; break;
                case ReadonlyModifier: property.modifier = ReadonlyOptionalModifier; break;
                case OptionalModifier: property.modifier = OptionalModifier; break;
                default: property.modifier = OptionalModifier; break;
            }
        }
        return this.Store(schema)
    }
    
    /** `Standard` Picks property keys from the given object type */
    public Pick<T extends TObject<TProperties> | TRef<TObject<TProperties>>, K extends SelectablePropertyKeys<T>[]>(object: T, keys: [...K], options: ObjectOptions = {}): TObject<Pick<SelectableProperties<T>, K[number]>> {
        const source = this.Deref(object)
        const schema = { ...clone(source), ...options }
        schema.required = schema.required ? schema.required.filter((key: K) => keys.includes(key as any)) : undefined
        for(const key of Object.keys(schema.properties)) {
            if(!keys.includes(key as any)) delete schema.properties[key]
        }
        return this.Store(schema)
    }
    
    /** `Standard` Omits property keys from the given object type */
    public Omit<T extends TObject<TProperties> | TRef<TObject<TProperties>>, K extends SelectablePropertyKeys<T>[]>(object: T, keys: [...K], options: ObjectOptions = {}):TObject<Omit<SelectableProperties<T>, K[number]>> {
        const source = this.Deref(object)
        const schema = { ...clone(source), ...options }
        schema.required = schema.required ? schema.required.filter((key: string) => !keys.includes(key as any)) : undefined
        for(const key of Object.keys(schema.properties)) {
            if(keys.includes(key as any)) delete schema.properties[key]
        }
        return this.Store(schema)
    }

    /** `Standard` Omits the `kind` and `modifier` properties from the underlying schema */
    public Strict<T extends TSchema>(schema: T, options: CustomOptions = {}): T {
        return JSON.parse(JSON.stringify({ ...options, ...schema })) as T
    }
    
    /** `Extended` Creates a constructor type */
    public Constructor<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options: CustomOptions = {}): TConstructor<T, U> {
        return this.Store({ ...options, kind: ConstructorKind, type: 'constructor', arguments: args, returns })
    }

    /** `Extended` Creates a function type */
    public Function<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options: CustomOptions = {}): TFunction<T, U> {
        return this.Store({ ...options, kind: FunctionKind, type: 'function', arguments: args, returns })
    }

    /** `Extended` Creates a promise type */
    public Promise<T extends TSchema>(item: T, options: CustomOptions = {}): TPromise<T> {
        return this.Store({ ...options, type: 'promise', kind: PromiseKind, item })
    }

    /** `Extended` Creates a undefined type */
    public Undefined(options: CustomOptions = {}): TUndefined {
        return this.Store({ ...options, type: 'undefined', kind: UndefinedKind })
    }

    /** `Extended` Creates a void type */
    public Void(options: CustomOptions = {}): TVoid {
        return this.Store({ ...options, type: 'void', kind: VoidKind })
    }
    
    /** `Standard` Creates a namespace for a set of related types */
    public Namespace<T extends TDefinitions>($defs: T, options: CustomOptions = {}): TNamespace<T> {
        return this.Store({ ...options, kind: NamespaceKind, $defs })
    }
    
    /** `Standard` References a type within a namespace. The referenced namespace must specify an `$id` */
    public Ref<T extends TNamespace<TDefinitions>, K extends keyof T['$defs']>(namespace: T, key: K): TRef<T['$defs'][K]>
    
    /** `Standard` References type. The referenced type must specify an `$id` */
    public Ref<T extends TSchema>(schema: T): TRef<T>
    
    public Ref(...args: any[]): any {
        if(args.length === 2) {
            const namespace = args[0] as TNamespace<TDefinitions>
            const targetKey = args[1] as string
            if(namespace.$id === undefined) throw new Error(`Referenced namespace has no $id`)
            if(!this.schemas.has(namespace.$id)) throw new Error(`Unable to locate namespace with $id '${namespace.$id}'`)
            return this.Store({ kind: RefKind, $ref: `${namespace.$id}#/$defs/${targetKey}` })
        } else if(args.length === 1) {
            const target = args[0] as any
            if(target.$id === undefined) throw new Error(`Referenced schema has no $id`)
            if(!this.schemas.has(target.$id)) throw new Error(`Unable to locate schema with $id '${target.$id}'`)
            return this.Store({ kind: RefKind, $ref: target.$id })
        } else {
            throw new Error('Type.Ref: Invalid arguments')
        }
    }

    /** `Experimental` Creates a recursive type */
    public Rec<T extends TSchema>(callback: (self: TAny) => T, options: CustomOptions = {}): T {
        const $id = options.$id || ''
        const self = callback({ $ref: `${$id}#/$defs/self` } as any)
        return this.Store({ ...options, $ref: `${$id}#/$defs/self`, $defs: { self } })
    }

    /** Conditionally stores and schema if it contains an $id and returns  */
    protected Store<T extends TSchema | TNamespace<TDefinitions>, S = Omit<T, '$static'>>(schema: S): T {
        const $schema: any = schema
        if(!$schema['$id']) return $schema
        this.schemas.set($schema['$id'], $schema)
        return $schema
    }

    /** Conditionally dereferences a schema if RefKind. Otherwise return argument */
    protected Deref<T extends TSchema>(schema: T): any {
        const $schema: any = schema
        if($schema['kind'] !== RefKind) return schema
        if(!this.schemas.has($schema['$ref'])) throw Error(`Unable to locate schema with $id '${$schema['$ref']}'`)
        return this.Deref(this.schemas.get($schema['$ref'])!)
    }
}


export const Type = new TypeBuilder()
