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
export declare type Infer<T> = {
    '_infer': T;
};
export declare type TEnumType = Record<string, string | number>;
export declare type TKey = string | number;
export declare type TValue = string | number | boolean;
export declare type TRecordKey = TString | TNumber | TKeyOf<any> | TUnion<string | number>;
export declare type TEnumKey<T = TKey> = {
    type: 'number' | 'string';
    const: T;
};
export declare type TProperties = {
    [key: string]: TSchema;
};
export declare type TTuple<I> = Infer<I> & {
    kind: typeof TupleKind;
    type: 'array';
    items?: TSchema[];
    additionalItems?: false;
    minItems: number;
    maxItems: number;
} & CustomOptions;
export declare type TObject<I> = Infer<I> & {
    kind: typeof ObjectKind;
    type: 'object';
    properties: TProperties;
    required?: string[];
} & ObjectOptions;
export declare type TUnion<I> = Infer<I> & {
    kind: typeof UnionKind;
    anyOf: TSchema[];
} & CustomOptions;
export declare type TIntersect<I> = Infer<I> & {
    kind: typeof IntersectKind;
    type: 'object';
    allOf: TSchema[];
} & IntersectOptions;
export declare type TKeyOf<I> = Infer<I> & {
    kind: typeof KeyOfKind;
    type: 'string';
    enum: string[];
} & CustomOptions;
export declare type TRecord<I> = Infer<I> & {
    kind: typeof RecordKind;
    type: 'object';
    patternProperties: {
        [pattern: string]: TSchema;
    };
} & ObjectOptions;
export declare type TArray<I> = Infer<I> & {
    kind: typeof ArrayKind;
    type: 'array';
    items: any;
} & ArrayOptions;
export declare type TLiteral<I> = Infer<I> & {
    kind: typeof LiteralKind;
    const: TValue;
} & CustomOptions;
export declare type TEnum<I> = Infer<I> & {
    kind: typeof EnumKind;
    anyOf: TSchema;
} & CustomOptions;
export declare type TString = Infer<string> & {
    kind: typeof StringKind;
    type: 'string';
} & StringOptions<string>;
export declare type TNumber = Infer<number> & {
    kind: typeof NumberKind;
    type: 'number';
} & NumberOptions;
export declare type TInteger = Infer<number> & {
    kind: typeof IntegerKind;
    type: 'integer';
} & NumberOptions;
export declare type TBoolean = Infer<boolean> & {
    kind: typeof BooleanKind;
    type: 'boolean';
} & CustomOptions;
export declare type TNull = Infer<null> & {
    kind: typeof NullKind;
    type: 'null';
} & CustomOptions;
export declare type TUnknown = Infer<unknown> & {
    kind: typeof UnknownKind;
} & CustomOptions;
export declare type TAny = Infer<any> & {
    kind: typeof AnyKind;
} & CustomOptions;
export declare const ConstructorKind: unique symbol;
export declare const FunctionKind: unique symbol;
export declare const PromiseKind: unique symbol;
export declare const UndefinedKind: unique symbol;
export declare const VoidKind: unique symbol;
export declare type TConstructor<T> = Infer<T> & {
    kind: typeof ConstructorKind;
    type: 'constructor';
    arguments: TSchema[];
    returns: TSchema;
} & CustomOptions;
export declare type TFunction<T> = Infer<T> & {
    kind: typeof FunctionKind;
    type: 'function';
    arguments: TSchema[];
    returns: TSchema;
} & CustomOptions;
export declare type TPromise<T> = Infer<T> & {
    kind: typeof PromiseKind;
    type: 'promise';
    item: TSchema;
} & CustomOptions;
export declare type TUndefined = Infer<undefined> & {
    kind: typeof UndefinedKind;
    type: 'undefined';
} & CustomOptions;
export declare type TVoid = Infer<void> & {
    kind: typeof VoidKind;
    type: 'void';
} & CustomOptions;
export declare type TSchema = TIntersect<any> | TUnion<any> | TTuple<any> | TObject<any> | TKeyOf<any> | TRecord<any> | TArray<any> | TEnum<any> | TLiteral<any> | TString | TNumber | TInteger | TBoolean | TNull | TUnknown | TAny | TConstructor<any> | TFunction<any> | TPromise<any> | TUndefined | TVoid;
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
export declare type StaticProperties<T extends TProperties> = {
    readonly [K in ReadonlyOptionalPropertyKeys<T>]?: Static<T[K]>;
} & {
    readonly [K in ReadonlyPropertyKeys<T>]: Static<T[K]>;
} & {
    [K in OptionalPropertyKeys<T>]?: Static<T[K]>;
} & {
    [K in RequiredPropertyKeys<T>]: Static<T[K]>;
};
export declare type StaticRecord<K extends TRecordKey, T extends TSchema> = K extends TString ? Record<string, Static<T>> : K extends TNumber ? Record<number, Static<T>> : K extends TKeyOf<any> ? Record<K['_infer'], Static<T>> : K extends TUnion<any> ? Record<K['_infer'], Static<T>> : never;
export declare type StaticEnum<T> = T extends TEnumKey<infer U>[] ? U : never;
export declare type StaticKeyOf<T extends TKey[]> = T extends Array<infer K> ? K : never;
export declare type StaticIntersect<T extends readonly TSchema[]> = IntersectReduce<unknown, IntersectEvaluate<T>>;
export declare type StaticUnion<T extends readonly TSchema[]> = {
    [K in keyof T]: Static<T[K]>;
}[number];
export declare type StaticTuple<T extends readonly TSchema[]> = {
    [K in keyof T]: Static<T[K]>;
};
export declare type StaticObject<T extends TProperties> = StaticProperties<StaticProperties<T>>;
export declare type StaticArray<T extends TSchema> = Array<Static<T>>;
export declare type StaticLiteral<T extends TValue> = T;
export declare type StaticConstructor<T extends readonly TSchema[], U extends TSchema> = new (...args: [...{
    [K in keyof T]: Static<T[K]>;
}]) => Static<U>;
export declare type StaticFunction<T extends readonly TSchema[], U extends TSchema> = (...args: [...{
    [K in keyof T]: Static<T[K]>;
}]) => Static<U>;
export declare type StaticPromise<T extends TSchema> = Promise<Static<T>>;
export declare type Static<T> = T extends TKeyOf<infer I> ? I : T extends TIntersect<infer I> ? I : T extends TUnion<infer I> ? I : T extends TTuple<infer I> ? I : T extends TObject<infer I> ? {
    [K in keyof I]: I[K];
} : T extends TRecord<infer I> ? I : T extends TArray<infer I> ? I : T extends TEnum<infer I> ? I : T extends TLiteral<infer I> ? I : T extends TString ? T['_infer'] : T extends TNumber ? T['_infer'] : T extends TInteger ? T['_infer'] : T extends TBoolean ? T['_infer'] : T extends TNull ? T['_infer'] : T extends TUnknown ? T['_infer'] : T extends TAny ? T['_infer'] : T extends TConstructor<infer I> ? I : T extends TFunction<infer I> ? I : T extends TPromise<infer I> ? I : T extends TUndefined ? T['_infer'] : T extends TVoid ? T['_infer'] : never;
export declare class TypeBuilder {
    /** `standard` Modifies an object property to be both readonly and optional */
    ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T>;
    /** `standard` Modifies an object property to be readonly */
    Readonly<T extends TSchema>(item: T): TReadonly<T>;
    /** `standard` Modifies an object property to be optional */
    Optional<T extends TSchema>(item: T): TOptional<T>;
    /** `standard` Creates a type type */
    Tuple<T extends TSchema[]>(items: [...T], options?: CustomOptions): TTuple<StaticTuple<T>>;
    /** `standard` Creates an object type with the given properties */
    Object<T extends TProperties>(properties: T, options?: ObjectOptions): TObject<StaticProperties<T>>;
    /** `standard` Creates an intersection type. Note this function requires draft `2019-09` to constrain with `unevaluatedProperties` */
    Intersect<T extends TSchema[]>(items: [...T], options?: IntersectOptions): TIntersect<StaticIntersect<T>>;
    /** `standard` Creates a union type */
    Union<T extends TSchema[]>(items: [...T], options?: CustomOptions): TUnion<StaticUnion<T>>;
    /** `standard` Creates an array type */
    Array<T extends TSchema>(items: T, options?: ArrayOptions): TArray<StaticArray<T>>;
    /** `standard` Creates an enum type from a TypeScript enum */
    Enum<T extends TEnumType>(item: T, options?: CustomOptions): TEnum<StaticEnum<TEnumKey<T[keyof T]>[]>>;
    /** `standard` Creates a literal type. Supports string, number and boolean values only */
    Literal<T extends TValue>(value: T, options?: CustomOptions): TLiteral<StaticLiteral<T>>;
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
    KeyOf<T extends TObject<any>>(schema: T, options?: CustomOptions): TKeyOf<keyof T['_infer']>;
    /** `standard` Creates a record type */
    Record<K extends TRecordKey, T extends TSchema>(key: K, value: T, options?: ObjectOptions): TRecord<StaticRecord<K, T>>;
    /** `standard` Makes all properties in the given object type required */
    Required<T extends TObject<any>>(schema: T, options?: ObjectOptions): TObject<Required<T['_infer']>>;
    /** `standard` Makes all properties in the given object type optional */
    Partial<T extends TObject<any>>(schema: T, options?: ObjectOptions): TObject<Partial<T['_infer']>>;
    /** `standard` Picks property keys from the given object type */
    Pick<T extends TObject<any>, K extends (keyof T['_infer'])[]>(schema: T, keys: [...K], options?: ObjectOptions): TObject<Pick<T['_infer'], K[number]>>;
    /** `standard` Omits property keys from the given object type */
    Omit<T extends TObject<any>, K extends (keyof T['_infer'])[]>(schema: T, keys: [...K], options?: ObjectOptions): TObject<Omit<T['_infer'], K[number]>>;
    /** `standard` Omits the `kind` and `modifier` properties from the underlying schema */
    Strict<T extends TSchema>(schema: T, options?: CustomOptions): T;
    /** `extended` Creates a constructor type */
    Constructor<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options?: CustomOptions): TConstructor<StaticConstructor<T, U>>;
    /** `extended` Creates a function type */
    Function<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options?: CustomOptions): TFunction<StaticFunction<T, U>>;
    /** `extended` Creates a promise type */
    Promise<T extends TSchema>(item: T, options?: CustomOptions): TPromise<StaticPromise<T>>;
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
