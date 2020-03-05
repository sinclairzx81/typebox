interface TFunction8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema, U extends TSchema> {
    type: 'function';
    arguments: [T0, T1, T2, T3, T4, T5, T6, T7];
    return: U;
}
interface TFunction7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, U extends TSchema> {
    type: 'function';
    arguments: [T0, T1, T2, T3, T4, T5, T6];
    return: U;
}
interface TFunction6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, U extends TSchema> {
    type: 'function';
    arguments: [T0, T1, T2, T3, T4, T5];
    return: U;
}
interface TFunction5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, U extends TSchema> {
    type: 'function';
    arguments: [T0, T1, T2, T3, T4];
    return: U;
}
interface TFunction4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, U extends TSchema> {
    type: 'function';
    arguments: [T0, T1, T2, T3];
    return: U;
}
interface TFunction3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, U extends TSchema> {
    type: 'function';
    arguments: [T0, T1, T2];
    return: U;
}
interface TFunction2<T0 extends TSchema, T1 extends TSchema, U extends TSchema> {
    type: 'function';
    arguments: [T0, T1];
    return: U;
}
interface TFunction1<T0 extends TSchema, U extends TSchema> {
    type: 'function';
    arguments: [T0];
    return: U;
}
interface TFunction0<U extends TSchema> {
    type: 'function';
    arguments: [];
    returns: U;
}
export declare type TFunction = TFunction8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TFunction7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TFunction6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TFunction5<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TFunction4<TSchema, TSchema, TSchema, TSchema, TSchema> | TFunction3<TSchema, TSchema, TSchema, TSchema> | TFunction2<TSchema, TSchema, TSchema> | TFunction1<TSchema, TSchema> | TFunction0<TSchema>;
export declare type TIntrinsic = TFunction | TVoid | TUndefined | TPromise<any>;
export interface TPromise<T extends TSchema | TVoid | TUndefined> {
    type: 'promise';
    item: T;
}
export interface TVoid {
    type: 'void';
}
export interface TUndefined {
    type: 'undefined';
}
interface TIntersect8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema> {
    allOf: [T0, T1, T2, T3, T4, T5, T6, T7];
}
interface TIntersect7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema> {
    allOf: [T0, T1, T2, T3, T4, T5, T6];
}
interface TIntersect6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema> {
    allOf: [T0, T1, T2, T3, T4, T5];
}
interface TIntersect5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema> {
    allOf: [T0, T1, T2, T3, T4];
}
interface TIntersect4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema> {
    allOf: [T0, T1, T2, T3];
}
interface TIntersect3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema> {
    allOf: [T0, T1, T2];
}
interface TIntersect2<T0 extends TSchema, T1 extends TSchema> {
    allOf: [T0, T1];
}
interface TIntersect1<T0 extends TSchema> {
    allOf: [T0];
}
export declare type TIntersect = TIntersect8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TIntersect7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TIntersect6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TIntersect5<TSchema, TSchema, TSchema, TSchema, TSchema> | TIntersect4<TSchema, TSchema, TSchema, TSchema> | TIntersect3<TSchema, TSchema, TSchema> | TIntersect2<TSchema, TSchema> | TIntersect1<TSchema>;
interface TUnion8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema> {
    oneOf: [T0, T1, T2, T3, T4, T5, T6, T7];
}
interface TUnion7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema> {
    oneOf: [T0, T1, T2, T3, T4, T5, T6];
}
interface TUnion6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema> {
    oneOf: [T0, T1, T2, T3, T4, T5];
}
interface TUnion5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema> {
    oneOf: [T0, T1, T2, T3, T4];
}
interface TUnion4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema> {
    oneOf: [T0, T1, T2, T3];
}
interface TUnion3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema> {
    oneOf: [T0, T1, T2];
}
interface TUnion2<T0 extends TSchema, T1 extends TSchema> {
    oneOf: [T0, T1];
}
interface TUnion1<T0 extends TSchema> {
    oneOf: [T0];
}
export declare type TUnion = TUnion8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TUnion7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TUnion6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TUnion5<TSchema, TSchema, TSchema, TSchema, TSchema> | TUnion4<TSchema, TSchema, TSchema, TSchema> | TUnion3<TSchema, TSchema, TSchema> | TUnion2<TSchema, TSchema> | TUnion1<TSchema>;
interface TTuple8<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema> {
    type: 'array';
    items: [T0, T1, T2, T3, T4, T5, T6, T7];
    additionalItems: false;
    minItems: 8;
    maxItems: 8;
}
interface TTuple7<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema> {
    type: 'array';
    items: [T0, T1, T2, T3, T4, T5, T6];
    additionalItems: false;
    minItems: 7;
    maxItems: 7;
}
interface TTuple6<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema> {
    type: 'array';
    items: [T0, T1, T2, T3, T4, T5];
    additionalItems: false;
    minItems: 6;
    maxItems: 6;
}
interface TTuple5<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema> {
    type: 'array';
    items: [T0, T1, T2, T3, T4];
    additionalItems: false;
    minItems: 5;
    maxItems: 5;
}
interface TTuple4<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema> {
    type: 'array';
    items: [T0, T1, T2, T3];
    additionalItems: false;
    minItems: 4;
    maxItems: 4;
}
interface TTuple3<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema> {
    type: 'array';
    items: [T0, T1, T2];
    additionalItems: false;
    minItems: 3;
    maxItems: 3;
}
interface TTuple2<T0 extends TSchema, T1 extends TSchema> {
    type: 'array';
    items: [T0, T1];
    additionalItems: false;
    minItems: 2;
    maxItems: 2;
}
interface TTuple1<T0 extends TSchema> {
    type: 'array';
    items: [T0];
    additionalItems: false;
    minItems: 1;
    maxItems: 1;
}
export declare type TTuple = TTuple8<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TTuple7<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TTuple6<TSchema, TSchema, TSchema, TSchema, TSchema, TSchema> | TTuple5<TSchema, TSchema, TSchema, TSchema, TSchema> | TTuple4<TSchema, TSchema, TSchema, TSchema> | TTuple3<TSchema, TSchema, TSchema> | TTuple2<TSchema, TSchema> | TTuple1<TSchema>;
export declare type TComposite = TIntersect | TUnion | TTuple;
export declare type TOptional<T extends TSchema | TUnion | TIntersect | TTuple> = T & {
    modifier: 'optional';
};
export declare type TReadonly<T extends TSchema | TUnion | TIntersect | TTuple> = T & {
    modifier: 'readonly';
};
export declare type TModifier = TOptional<any> | TReadonly<any>;
declare type SchemaFormat = 'date-time' | 'time' | 'date' | 'email' | 'idn-email' | 'hostname' | 'idn-hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uri-reference' | 'iri' | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer' | 'regex';
export declare type TLiteral = TStringLiteral<string> | TNumberLiteral<number> | TBooleanLiteral<boolean>;
export interface TStringLiteral<T> {
    type: 'string';
    enum: [T];
}
export interface TNumberLiteral<T> {
    type: 'number';
    enum: [T];
}
export interface TBooleanLiteral<T> {
    type: 'boolean';
    enum: [T];
}
export interface TProperties {
    [key: string]: TSchema | TUnion | TIntersect | TTuple | TOptional<TSchema | TUnion | TIntersect | TTuple> | TReadonly<TSchema | TUnion | TIntersect | TTuple>;
}
export interface TObject<T extends TProperties> {
    type: 'object';
    properties: T;
    required: string[];
}
export interface TMap<T extends TSchema | TUnion | TIntersect | TTuple> {
    type: 'object';
    additionalProperties: T;
}
export interface TArray<T extends TSchema | TUnion | TIntersect | TTuple> {
    type: 'array';
    items: T;
}
export interface TNumber {
    type: 'number';
}
export interface TString {
    type: 'string';
}
export interface TBoolean {
    type: 'boolean';
}
export interface TPattern {
    type: 'string';
    pattern: string;
}
export interface TFormat {
    type: 'string';
    format: SchemaFormat;
}
export interface TRange {
    type: 'number';
    minimum: number;
    maximum: number;
}
export interface TNull {
    type: 'null';
}
export interface TAny {
}
export declare type TSchema = TLiteral | TNumber | TBoolean | TString | TObject<any> | TArray<any> | TMap<any> | TPattern | TRange | TFormat | TNull | TAny;
declare type StaticFunction<T> = T extends TFunction8<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>, arg5: Static<U5>, arg6: Static<U6>, arg7: Static<U7>) => Static<R> : T extends TFunction7<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>, arg5: Static<U5>, arg6: Static<U6>) => Static<R> : T extends TFunction6<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>, arg5: Static<U5>) => Static<R> : T extends TFunction5<infer U0, infer U1, infer U2, infer U3, infer U4, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>, arg4: Static<U4>) => Static<R> : T extends TFunction4<infer U0, infer U1, infer U2, infer U3, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>, arg3: Static<U3>) => Static<R> : T extends TFunction3<infer U0, infer U1, infer U2, infer R> ? (arg0: Static<U0>, arg1: Static<U1>, arg2: Static<U2>) => Static<R> : T extends TFunction2<infer U0, infer U1, infer R> ? (arg0: Static<U0>, arg1: Static<U1>) => Static<R> : T extends TFunction1<infer U0, infer R> ? (arg0: Static<U0>) => Static<R> : T extends TFunction0<infer R> ? () => Static<R> : never;
declare type StaticInstrinsic<T extends TIntrinsic> = T extends TFunction ? StaticFunction<T> : T extends TPromise<infer U> ? Promise<Static<U>> : T extends TVoid ? void : T extends TUndefined ? undefined : never;
declare type StaticIntersect<T> = T extends TIntersect8<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> & StaticSchema<U4> & StaticSchema<U5> & StaticSchema<U6> & StaticSchema<U7> : T extends TIntersect7<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> & StaticSchema<U4> & StaticSchema<U5> & StaticSchema<U6> : T extends TIntersect6<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> & StaticSchema<U4> & StaticSchema<U5> : T extends TIntersect5<infer U0, infer U1, infer U2, infer U3, infer U4> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> & StaticSchema<U4> : T extends TIntersect4<infer U0, infer U1, infer U2, infer U3> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> & StaticSchema<U3> : T extends TIntersect3<infer U0, infer U1, infer U2> ? StaticSchema<U0> & StaticSchema<U1> & StaticSchema<U2> : T extends TIntersect2<infer U0, infer U1> ? StaticSchema<U1> & StaticSchema<U0> : T extends TIntersect1<infer U0> ? StaticSchema<U0> : never;
declare type StaticUnion<T> = T extends TUnion8<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> | StaticSchema<U4> | StaticSchema<U5> | StaticSchema<U6> | StaticSchema<U7> : T extends TUnion7<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> | StaticSchema<U4> | StaticSchema<U5> | StaticSchema<U6> : T extends TUnion6<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> | StaticSchema<U4> | StaticSchema<U5> : T extends TUnion5<infer U0, infer U1, infer U2, infer U3, infer U4> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> | StaticSchema<U4> : T extends TUnion4<infer U0, infer U1, infer U2, infer U3> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> | StaticSchema<U3> : T extends TUnion3<infer U0, infer U1, infer U2> ? StaticSchema<U0> | StaticSchema<U1> | StaticSchema<U2> : T extends TUnion2<infer U0, infer U1> ? StaticSchema<U0> | StaticSchema<U1> : T extends TUnion1<infer U0> ? StaticSchema<U0> : never;
declare type StaticTuple<T> = T extends TTuple8<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>, Static<U4>, Static<U5>, Static<U6>, Static<U7>] : T extends TTuple7<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5, infer U6> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>, Static<U4>, Static<U5>, Static<U6>] : T extends TTuple6<infer U0, infer U1, infer U2, infer U3, infer U4, infer U5> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>, Static<U4>, Static<U5>] : T extends TTuple5<infer U0, infer U1, infer U2, infer U3, infer U4> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>, Static<U4>] : T extends TTuple4<infer U0, infer U1, infer U2, infer U3> ? [Static<U0>, Static<U1>, Static<U2>, Static<U3>] : T extends TTuple3<infer U0, infer U1, infer U2> ? [Static<U0>, Static<U1>, Static<U2>] : T extends TTuple2<infer U0, infer U1> ? [Static<U0>, Static<U1>] : T extends TTuple1<infer U0> ? [Static<U0>] : never;
declare type StaticComposite<T extends TComposite> = T extends TIntersect ? StaticIntersect<T> : T extends TUnion ? StaticUnion<T> : T extends TTuple ? StaticTuple<T> : never;
declare type StaticLiteral<T> = T extends TStringLiteral<infer U> ? U : T extends TNumberLiteral<infer U> ? U : T extends TBooleanLiteral<infer U> ? U : never;
declare type ReadonlyPropertyKeys<T> = {
    [K in keyof T]: T[K] extends TReadonly<infer U> ? K : never;
}[keyof T];
declare type OptionalPropertyKeys<T> = {
    [K in keyof T]: T[K] extends TOptional<infer U> ? K : never;
}[keyof T];
declare type PropertyKeys<T> = keyof Omit<T, OptionalPropertyKeys<T> | ReadonlyPropertyKeys<T>>;
declare type StaticObjectProperties<T> = {
    readonly [K in ReadonlyPropertyKeys<T>]: Static<T[K]>;
} & {
    [K in OptionalPropertyKeys<T>]?: Static<T[K]>;
} & {
    [K in PropertyKeys<T>]: Static<T[K]>;
};
declare type StaticSchema<T extends TSchema> = T extends TObject<infer U> ? StaticObjectProperties<U> : T extends TMap<infer U> ? {
    [key: string]: Static<U>;
} : T extends TArray<infer U> ? Array<Static<U>> : T extends TLiteral ? StaticLiteral<T> : T extends TString ? string : T extends TNumber ? number : T extends TBoolean ? boolean : T extends TNull ? null : T extends TAny ? any : T extends TPattern ? string : T extends TFormat ? string : T extends TRange ? number : never;
export declare type TStatic = TComposite | TSchema | TIntrinsic | TModifier;
export declare type Static<T extends TStatic> = T extends TIntrinsic ? StaticInstrinsic<T> : T extends TComposite ? StaticComposite<T> : T extends TSchema ? StaticSchema<T> : never;
export declare class Type {
    /** Modifies the inner type T into an optional T. */
    static Optional<T extends TSchema | TUnion | TIntersect>(item: T): TOptional<T>;
    /** Modifies the inner type T into an readonly T. */
    static Readonly<T extends TSchema | TUnion | TIntersect>(item: T): TReadonly<T>;
    /** Creates a Object type with the given properties. */
    static Object<T extends TProperties>(properties: T): TObject<T>;
    /** Creates a Map type of the given type. Keys are indexed with type string. */
    static Map<T extends TSchema | TUnion | TIntersect | TTuple>(additionalProperties: T): TMap<T>;
    /** Creates an Array type of the given argument T. */
    static Array<T extends TSchema | TUnion | TIntersect | TTuple>(items: T): TArray<T>;
    /** Creates a String type. */
    static String(): TString;
    /** Creates a Number type. */
    static Number(): TNumber;
    /** Creates a Boolean type. */
    static Boolean(): TBoolean;
    /** Creates a Null type. */
    static Null(): TNull;
    /** Creates a Any type. */
    static Any(): TAny;
    /** Creates a Promise type. */
    static Promise<T extends TSchema>(t: T): TPromise<T>;
    /** Creates a Void type. */
    static Void(): TVoid;
    /** Creates a Undefined type. */
    static Undefined(): TUndefined;
    /** Creates a StringLiteral for the given value. */
    static Literal<T extends string>(value: T): TStringLiteral<T>;
    /** Creates a NumberLiteral for the given value. */
    static Literal<T extends number>(value: T): TNumberLiteral<T>;
    /** Creates a BooleanLiteral for the given value. */
    static Literal<T extends boolean>(value: T): TBooleanLiteral<T>;
    /** Creates a Union type for the given arguments. */
    static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TUnion8<T0, T1, T2, T3, T4, T5, T6, T7>;
    /** Creates a Union type for the given arguments. */
    static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TUnion7<T0, T1, T2, T3, T4, T5, T6>;
    /** Creates a Union type for the given arguments. */
    static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TUnion6<T0, T1, T2, T3, T4, T5>;
    /** Creates a Union type for the given arguments. */
    static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4): TUnion5<T0, T1, T2, T3, T4>;
    /** Creates a Union type for the given arguments. */
    static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3): TUnion4<T0, T1, T2, T3>;
    /** Creates a Union type for the given arguments. */
    static Union<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema>(t0: T0, t1: T1, t2: T2): TUnion3<T0, T1, T2>;
    /** Creates a Union type for the given arguments. */
    static Union<T0 extends TSchema, T1 extends TSchema>(t0: T0, t1: T1): TUnion2<T0, T1>;
    /** Creates a Union type for the given arguments. */
    static Union<T0 extends TSchema>(t0: T0): TUnion1<T0>;
    /** Creates an Intersect type for the given arguments. */
    static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TIntersect8<T0, T1, T2, T3, T4, T5, T6, T7>;
    /** Creates an Intersect type for the given arguments. */
    static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TIntersect7<T0, T1, T2, T3, T4, T5, T6>;
    /** Creates an Intersect type for the given arguments. */
    static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TIntersect6<T0, T1, T2, T3, T4, T5>;
    /** Creates an Intersect type for the given arguments. */
    static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4): TIntersect5<T0, T1, T2, T3, T4>;
    /** Creates an Intersect type for the given arguments. */
    static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3): TIntersect4<T0, T1, T2, T3>;
    /** Creates an Intersect type for the given arguments. */
    static Intersect<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema>(t0: T0, t1: T1, t2: T2): TIntersect3<T0, T1, T2>;
    /** Creates an Intersect type for the given arguments. */
    static Intersect<T0 extends TSchema, T1 extends TSchema>(t0: T0, t1: T1): TIntersect2<T0, T1>;
    /** Creates an Intersect type for the given arguments. */
    static Intersect<T0 extends TSchema>(t0: T0): TIntersect1<T0>;
    /** Creates a Tuple type for the given arguments. */
    static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema, T7 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): TTuple8<T0, T1, T2, T3, T4, T5, T6, T7>;
    /** Creates a Tuple type for the given arguments. */
    static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema, T6 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): TTuple7<T0, T1, T2, T3, T4, T5, T6>;
    /** Creates a Tuple type for the given arguments. */
    static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema, T5 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): TTuple6<T0, T1, T2, T3, T4, T5>;
    /** Creates a Tuple type for the given arguments. */
    static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema, T4 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3, t4: T4): TTuple5<T0, T1, T2, T3, T4>;
    /** Creates a Tuple type for the given arguments. */
    static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema, T3 extends TSchema>(t0: T0, t1: T1, t2: T2, t3: T3): TTuple4<T0, T1, T2, T3>;
    /** Creates a Tuple type for the given arguments. */
    static Tuple<T0 extends TSchema, T1 extends TSchema, T2 extends TSchema>(t0: T0, t1: T1, t2: T2): TTuple3<T0, T1, T2>;
    /** Creates a Tuple type for the given arguments. */
    static Tuple<T0 extends TSchema, T1 extends TSchema>(t0: T0, t1: T1): TTuple2<T0, T1>;
    /** Creates a Tuple type for the given arguments. */
    static Tuple<T0 extends TSchema>(t0: T0): TTuple1<T0>;
    /** Creates a Function type for the given arguments. */
    static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, T7 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6, T7], returns: U): TFunction8<T0, T1, T2, T3, T4, T5, T6, T7, U>;
    /** Creates a Function type for the given arguments. */
    static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, T6 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5, T6], returns: U): TFunction7<T0, T1, T2, T3, T4, T5, T6, U>;
    /** Creates a Function type for the given arguments. */
    static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, T5 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4, T5], returns: U): TFunction6<T0, T1, T2, T3, T4, T5, U>;
    /** Creates a Function type for the given arguments. */
    static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, T4 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3, T4], returns: U): TFunction5<T0, T1, T2, T3, T4, U>;
    /** Creates a Function type for the given arguments. */
    static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, T3 extends TStatic, U extends TStatic>(args: [T0, T1, T2, T3], returns: U): TFunction4<T0, T1, T2, T3, U>;
    /** Creates a Function type for the given arguments. */
    static Function<T0 extends TStatic, T1 extends TStatic, T2 extends TStatic, U extends TStatic>(args: [T0, T1, T2], returns: U): TFunction3<T0, T1, T2, U>;
    /** Creates a Function type for the given arguments. */
    static Function<T0 extends TStatic, T1 extends TStatic, U extends TStatic>(args: [T0, T1], returns: U): TFunction2<T0, T1, U>;
    /** Creates a Function type for the given arguments. */
    static Function<T0 extends TStatic, U extends TStatic>(args: [T0], returns: U): TFunction1<T0, U>;
    /** Creates a Function type for the given arguments. */
    static Function<U extends TStatic>(args: [], returns: U): TFunction0<U>;
    /** Creates a Pattern type that resolves to a string. */
    static Pattern(regex: RegExp): TPattern;
    /** Creates a Format type that resolves to a string. */
    static Format(format: SchemaFormat): TFormat;
    /** Creates a Range type that resolves to a number. */
    static Range(minimum: number, maximum: number): TRange;
    /** Creates a Pattern type to validate UUID-4. */
    static Guid(): TPattern;
}
export {};
