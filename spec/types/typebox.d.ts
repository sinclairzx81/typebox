export declare const ReadonlyOptionalModifier: unique symbol;
export declare const OptionalModifier: unique symbol;
export declare const ReadonlyModifier: unique symbol;
export declare type TModifier = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>;
export declare type TReadonlyOptional<T extends TSchema> = T & {
    modifier: typeof ReadonlyOptionalModifier;
};
export declare type TOptional<T extends TSchema> = T & {
    modifier: typeof OptionalModifier;
};
export declare type TReadonly<T extends TSchema> = T & {
    modifier: typeof ReadonlyModifier;
};
export declare const BoxKind: unique symbol;
export declare const KeyOfKind: unique symbol;
export declare const IntersectKind: unique symbol;
export declare const UnionKind: unique symbol;
export declare const TupleKind: unique symbol;
export declare const ObjectKind: unique symbol;
export declare const RecordKind: unique symbol;
export declare const ArrayKind: unique symbol;
export declare const EnumKind: unique symbol;
export declare const LiteralKind: unique symbol;
export declare const StringKind: unique symbol;
export declare const NumberKind: unique symbol;
export declare const IntegerKind: unique symbol;
export declare const BooleanKind: unique symbol;
export declare const NullKind: unique symbol;
export declare const UnknownKind: unique symbol;
export declare const AnyKind: unique symbol;
export interface CustomOptions {
    $id?: string;
    title?: string;
    description?: string;
    default?: any;
    examples?: any;
    [prop: string]: any;
}
export declare type StringFormatOption = 'date-time' | 'time' | 'date' | 'email' | 'idn-email' | 'hostname' | 'idn-hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uri-reference' | 'iri' | 'uuid' | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer' | 'regex';
export declare type StringOptions<TFormat extends string> = {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: TFormat;
    contentEncoding?: '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64';
    contentMediaType?: string;
} & CustomOptions;
export declare type ArrayOptions = {
    uniqueItems?: boolean;
    minItems?: number;
    maxItems?: number;
} & CustomOptions;
export declare type NumberOptions = {
    exclusiveMaximum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    minimum?: number;
    multipleOf?: number;
} & CustomOptions;
export declare type IntersectOptions = {
    unevaluatedProperties?: boolean;
} & CustomOptions;
export declare type ObjectOptions = {
    additionalProperties?: boolean;
} & CustomOptions;
export declare type TDefinitions = {
    [key: string]: TSchema;
};
export declare type TNamespace<T extends TDefinitions> = {
    kind: typeof BoxKind;
    definitions: T;
} & CustomOptions;
export interface TSchema {
    '#output': unknown;
}
export declare type TEnumType = Record<string, string | number>;
export declare type TKey = string | number | symbol;
export declare type TValue = string | number | boolean;
export declare type TRecordKey = TString | TNumber | TKeyOf<any> | TUnion<any>;
export declare type TEnumKey<T = TKey> = {
    type: 'number' | 'string';
    const: T;
};
export interface TProperties {
    [key: string]: TSchema;
}
export interface TTuple<T extends TSchema[]> extends TSchema, CustomOptions {
    '#output': StaticTuple<T>;
    kind: typeof TupleKind;
    type: 'array';
    items?: T;
    additionalItems?: false;
    minItems: number;
    maxItems: number;
}
export interface TObject<T extends TProperties> extends TSchema, ObjectOptions {
    '#output': StaticObject<T>;
    kind: typeof ObjectKind;
    type: 'object';
    properties: T;
    required?: string[];
}
export interface TUnion<T extends TSchema[]> extends TSchema, CustomOptions {
    '#output': StaticUnion<T>;
    kind: typeof UnionKind;
    anyOf: T;
}
export interface TIntersect<T extends TSchema[]> extends TSchema, IntersectOptions {
    '#output': StaticIntersect<T>;
    kind: typeof IntersectKind;
    type: 'object';
    allOf: T;
}
export interface TKeyOf<T extends TKey[]> extends TSchema, CustomOptions {
    '#output': StaticKeyOf<T>;
    kind: typeof KeyOfKind;
    type: 'string';
    enum: T;
}
export interface TRecord<K extends TRecordKey, T extends TSchema> extends TSchema, ObjectOptions {
    '#output': StaticRecord<K, T>;
    kind: typeof RecordKind;
    type: 'object';
    patternProperties: {
        [pattern: string]: T;
    };
}
export interface TArray<T extends TSchema> extends TSchema, ArrayOptions {
    '#output': StaticArray<T>;
    kind: typeof ArrayKind;
    type: 'array';
    items: T;
}
export interface TLiteral<T extends TValue> extends TSchema, CustomOptions {
    '#output': StaticLiteral<T>;
    kind: typeof LiteralKind;
    const: T;
}
export interface TEnum<T extends TEnumKey[]> extends TSchema, CustomOptions {
    '#output': StaticEnum<T>;
    kind: typeof EnumKind;
    anyOf: T;
}
export interface TString extends TSchema, StringOptions<string> {
    '#output': string;
    kind: typeof StringKind;
    type: 'string';
}
export interface TNumber extends TSchema, NumberOptions {
    '#output': number;
    kind: typeof NumberKind;
    type: 'number';
}
export interface TInteger extends TSchema, NumberOptions {
    '#output': number;
    kind: typeof IntegerKind;
    type: 'integer';
}
export interface TBoolean extends TSchema, CustomOptions {
    '#output': boolean;
    kind: typeof BooleanKind;
    type: 'boolean';
}
export interface TNull extends TSchema, CustomOptions {
    '#output': null;
    kind: typeof NullKind;
    type: 'null';
}
export interface TUnknown extends TSchema, CustomOptions {
    '#output': unknown;
    kind: typeof UnknownKind;
}
export interface TAny extends TSchema, CustomOptions {
    '#output': any;
    kind: typeof AnyKind;
}
export declare const ConstructorKind: unique symbol;
export declare const FunctionKind: unique symbol;
export declare const PromiseKind: unique symbol;
export declare const UndefinedKind: unique symbol;
export declare const VoidKind: unique symbol;
export interface TConstructor<T extends TSchema[], U extends TSchema> extends TSchema, CustomOptions {
    '#output': StaticConstructor<T, U>;
    kind: typeof ConstructorKind;
    type: 'constructor';
    arguments: TSchema[];
    returns: TSchema;
}
export interface TFunction<T extends TSchema[], U extends TSchema> extends TSchema, CustomOptions {
    '#output': StaticFunction<T, U>;
    kind: typeof FunctionKind;
    type: 'function';
    arguments: TSchema[];
    returns: TSchema;
}
export interface TPromise<T extends TSchema> extends TSchema, CustomOptions {
    '#output': StaticPromise<T>;
    kind: typeof PromiseKind;
    type: 'promise';
    item: TSchema;
}
export interface TUndefined extends TSchema, CustomOptions {
    '#output': undefined;
    kind: typeof UndefinedKind;
    type: 'undefined';
}
export interface TVoid extends TSchema, CustomOptions {
    '#output': void;
    kind: typeof VoidKind;
    type: 'void';
}
export declare type TRequired<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonlyOptional<infer U> ? TReadonly<U> : T[K] extends TReadonly<infer U> ? TReadonly<U> : T[K] extends TOptional<infer U> ? U : T[K];
};
export declare type TPartial<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonlyOptional<infer U> ? TReadonlyOptional<U> : T[K] extends TReadonly<infer U> ? TReadonlyOptional<U> : T[K] extends TOptional<infer U> ? TOptional<U> : TOptional<T[K]>;
};
export declare type UnionToIntersect<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export declare type IntersectEvaluate<T extends readonly TSchema[]> = {
    [K in keyof T]: Static<T[K]>;
};
export declare type IntersectReduce<I extends unknown, T extends readonly any[]> = T extends [infer A, ...infer B] ? IntersectReduce<I & A, B> : I;
export declare type ReadonlyOptionalPropertyKeys<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonlyOptional<TSchema> ? K : never;
}[keyof T];
export declare type ReadonlyPropertyKeys<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonly<TSchema> ? K : never;
}[keyof T];
export declare type OptionalPropertyKeys<T extends TProperties> = {
    [K in keyof T]: T[K] extends TOptional<TSchema> ? K : never;
}[keyof T];
export declare type RequiredPropertyKeys<T extends TProperties> = keyof Omit<T, ReadonlyOptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | OptionalPropertyKeys<T>>;
export declare type ReduceStaticProperties<T> = {
    [K in keyof T]: T[K];
};
export declare type StaticProperties<T extends TProperties> = {
    readonly [K in ReadonlyOptionalPropertyKeys<T>]?: Static<T[K]>;
} & {
    readonly [K in ReadonlyPropertyKeys<T>]: Static<T[K]>;
} & {
    [K in OptionalPropertyKeys<T>]?: Static<T[K]>;
} & {
    [K in RequiredPropertyKeys<T>]: Static<T[K]>;
};
export declare type StaticRecord<K extends TRecordKey, T extends TSchema> = K extends TString ? Record<string, Static<T>> : K extends TNumber ? Record<number, Static<T>> : K extends TKeyOf<TKey[]> ? Record<K['#output'], Static<T>> : K extends TUnion<TSchema[]> ? Record<K['#output'], Static<T>> : never;
export declare type StaticEnum<T> = T extends TEnumKey<infer U>[] ? U : never;
export declare type StaticKeyOf<T extends TKey[]> = T extends Array<infer K> ? K : never;
export declare type StaticIntersect<T extends readonly TSchema[]> = IntersectReduce<unknown, IntersectEvaluate<T>>;
export declare type StaticUnion<T extends readonly TSchema[]> = {
    [K in keyof T]: Static<T[K]>;
}[number];
export declare type StaticTuple<T extends readonly TSchema[]> = {
    [K in keyof T]: Static<T[K]>;
};
export declare type StaticObject<T extends TProperties> = ReduceStaticProperties<StaticProperties<T>>;
export declare type StaticArray<T extends TSchema> = Array<Static<T>>;
export declare type StaticLiteral<T extends TValue> = T;
export declare type StaticParameters<T extends readonly TSchema[]> = {
    [K in keyof T]: Static<T[K]>;
};
export declare type StaticConstructor<T extends readonly TSchema[], U extends TSchema> = new (...args: [...StaticParameters<T>]) => Static<U>;
export declare type StaticFunction<T extends readonly TSchema[], U extends TSchema> = (...args: [...StaticParameters<T>]) => Static<U>;
export declare type StaticPromise<T extends TSchema> = Promise<Static<T>>;
export declare type Static<T> = T extends TSchema ? T['#output'] : never;
export declare class TypeBuilder {
    /** `standard` Modifies an object property to be both readonly and optional */
    ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T>;
    /** `standard` Modifies an object property to be readonly */
    Readonly<T extends TSchema>(item: T): TReadonly<T>;
    /** `standard` Modifies an object property to be optional */
    Optional<T extends TSchema>(item: T): TOptional<T>;
    /** `standard` Creates a type type */
    Tuple<T extends TSchema[]>(items: [...T], options?: CustomOptions): TTuple<T>;
    /** `standard` Creates an object type with the given properties */
    Object<T extends TProperties>(properties: T, options?: ObjectOptions): TObject<T>;
    /** `standard` Creates an intersection type. Note this function requires draft `2019-09` to constrain with `unevaluatedProperties` */
    Intersect<T extends TSchema[]>(items: [...T], options?: IntersectOptions): TIntersect<T>;
    /** `standard` Creates a union type */
    Union<T extends TSchema[]>(items: [...T], options?: CustomOptions): TUnion<T>;
    /** `standard` Creates an array type */
    Array<T extends TSchema>(items: T, options?: ArrayOptions): TArray<T>;
    /** `standard` Creates an enum type from a TypeScript enum */
    Enum<T extends TEnumType>(item: T, options?: CustomOptions): TEnum<TEnumKey<T[keyof T]>[]>;
    /** `standard` Creates a literal type. Supports string, number and boolean values only */
    Literal<T extends TValue>(value: T, options?: CustomOptions): TLiteral<T>;
    /** `standard` Creates a string type */
    String<TCustomFormatOption extends string>(options?: StringOptions<StringFormatOption | TCustomFormatOption>): TString;
    /** `standard` Creates a string type from a regular expression */
    RegEx(regex: RegExp, options?: CustomOptions): TString;
    /** `standard` Creates a number type */
    Number(options?: NumberOptions): TNumber;
    /** `standard` Creates an integer type */
    Integer(options?: NumberOptions): TInteger;
    /** `standard` Creates a boolean type */
    Boolean(options?: CustomOptions): TBoolean;
    /** `standard` Creates a null type */
    Null(options?: CustomOptions): TNull;
    /** `standard` Creates an unknown type */
    Unknown(options?: CustomOptions): TUnknown;
    /** `standard` Creates an any type */
    Any(options?: CustomOptions): TAny;
    /** `standard` Creates a keyof type from the given object */
    KeyOf<T extends TObject<TProperties>>(schema: T, options?: CustomOptions): TKeyOf<{
        [K in keyof T['properties']]: K extends string ? K : never;
    }[number]>;
    /** `standard` Creates a record type */
    Record<K extends TRecordKey, T extends TSchema>(key: K, value: T, options?: ObjectOptions): TRecord<K, T>;
    /** `standard` Makes all properties in the given object type required */
    Required<T extends TObject<any>>(schema: T, options?: ObjectOptions): TObject<TRequired<T['properties']>>;
    /** `standard` Makes all properties in the given object type optional */
    Partial<T extends TObject<any>>(schema: T, options?: ObjectOptions): TObject<TPartial<T['properties']>>;
    /** `standard` Picks property keys from the given object type */
    Pick<T extends TObject<TProperties>, K extends (keyof T['properties'])[]>(schema: T, keys: [...K], options?: ObjectOptions): TObject<Pick<T['properties'], K[number]>>;
    /** `standard` Omits property keys from the given object type */
    Omit<T extends TObject<any>, K extends (keyof T['properties'])[]>(schema: T, keys: [...K], options?: ObjectOptions): TObject<Omit<T['properties'], K[number]>>;
    /** `standard` Omits the `kind` and `modifier` properties from the underlying schema */
    Strict<T extends TSchema>(schema: T, options?: CustomOptions): T;
    /** `extended` Creates a constructor type */
    Constructor<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options?: CustomOptions): TConstructor<T, U>;
    /** `extended` Creates a function type */
    Function<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options?: CustomOptions): TFunction<T, U>;
    /** `extended` Creates a promise type */
    Promise<T extends TSchema>(item: T, options?: CustomOptions): TPromise<T>;
    /** `extended` Creates a undefined type */
    Undefined(options?: CustomOptions): TUndefined;
    /** `extended` Creates a void type */
    Void(options?: CustomOptions): TVoid;
    /** `experimental` Creates a recursive type */
    Rec<T extends TSchema>(callback: (self: TAny) => T, options?: CustomOptions): T;
    /** `experimental` Creates a recursive type. Pending https://github.com/ajv-validator/ajv/issues/1709 */
    /** `experimental` Creates a namespace for a set of related types */
    Namespace<T extends TDefinitions>(definitions: T, options?: CustomOptions): TNamespace<T>;
    /** `experimental` References a type within a namespace. The referenced namespace must specify an `$id` */
    Ref<T extends TNamespace<TDefinitions>, K extends keyof T['definitions']>(box: T, key: K): T['definitions'][K];
    /** `experimental` References type. The referenced type must specify an `$id` */
    Ref<T extends TSchema>(schema: T): T;
}
export declare const Type: TypeBuilder;
