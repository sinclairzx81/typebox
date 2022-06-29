export declare const Kind: unique symbol
export declare const Modifier: unique symbol
export declare type TModifier = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>
export declare type TReadonly<T extends TSchema> = T & {
  [Modifier]: 'Readonly'
}
export declare type TOptional<T extends TSchema> = T & {
  [Modifier]: 'Optional'
}
export declare type TReadonlyOptional<T extends TSchema> = T & {
  [Modifier]: 'ReadonlyOptional'
}
export interface SchemaOptions {
  $schema?: string
  $id?: string
  title?: string
  description?: string
  default?: any
  examples?: any
  design?: any
  [prop: string]: any
}
export interface TSchema extends SchemaOptions {
  [Kind]: string
  [Modifier]?: string
  params: unknown[]
  static: unknown
}
export declare type TAnySchema =
  | TSchema
  | TAny
  | TArray
  | TBoolean
  | TConstructor
  | TEnum
  | TFunction
  | TInteger
  | TLiteral
  | TNull
  | TNumber
  | TObject
  | TPromise
  | TRecord
  | TSelf
  | TRef
  | TString
  | TTuple
  | TUndefined
  | TUnion
  | TUint8Array
  | TUnknown
  | TVoid
export interface NumericOptions extends SchemaOptions {
  exclusiveMaximum?: number
  exclusiveMinimum?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
}
export declare type TNumeric = TInteger | TNumber
export interface TAny extends TSchema {
  [Kind]: 'Any'
  static: any
}
export interface ArrayOptions extends SchemaOptions {
  uniqueItems?: boolean
  minItems?: number
  maxItems?: number
}
export interface TArray<T extends TSchema = TSchema> extends TSchema, ArrayOptions {
  [Kind]: 'Array'
  static: Array<Static<T, this['params']>>
  type: 'array'
  items: T
}
export interface TBoolean extends TSchema {
  [Kind]: 'Boolean'
  static: boolean
  type: 'boolean'
}
export declare type TContructorParameters<T extends readonly TSchema[], P extends unknown[]> = [
  ...{
    [K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : never
  },
]
export interface TConstructor<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Constructor'
  static: new (...param: TContructorParameters<T, this['params']>) => Static<U, this['params']>
  type: 'constructor'
  parameters: T
  returns: U
}
export interface TEnumOption<T> {
  type: 'number' | 'string'
  const: T
}
export interface TEnum<T extends Record<string, string | number> = Record<string, string | number>> extends TSchema {
  [Kind]: 'Union'
  static: T[keyof T]
  anyOf: TLiteral<string | number>[]
}
export interface TExclude<T extends TUnion, U extends TUnion> extends TUnion {
  [Kind]: 'Union'
  static: Exclude<Static<T, this['params']>, Static<U, this['params']>>
}
export interface TExtract<T extends TSchema, U extends TUnion> extends TUnion {
  [Kind]: 'Union'
  static: Extract<Static<T, this['params']>, Static<U, this['params']>>
}
export declare type TExtends<T extends TSchema, U extends TSchema, X extends TSchema, Y extends TSchema> = T extends TAny ? (U extends TUnknown ? X : U extends TAny ? X : TUnion<[X, Y]>) : T extends U ? X : Y
export declare type TFunctionParameters<T extends readonly TSchema[], P extends unknown[]> = [
  ...{
    [K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : never
  },
]
export interface TFunction<T extends readonly TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Function'
  static: (...param: TFunctionParameters<T, this['params']>) => Static<U, this['params']>
  type: 'function'
  parameters: T
  returns: U
}
export interface TInteger extends TSchema, NumericOptions {
  [Kind]: 'Integer'
  static: number
  type: 'integer'
}
export declare type IntersectEvaluate<T extends readonly TSchema[], P extends unknown[]> = {
  [K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : never
}
export declare type IntersectReduce<I extends unknown, T extends readonly any[]> = T extends [infer A, ...infer B] ? IntersectReduce<I & A, B> : I extends object ? I : {}
export interface TIntersect<T extends TObject[] = TObject[]> extends TObject {
  static: IntersectReduce<unknown, IntersectEvaluate<T, this['params']>>
  properties: Record<keyof IntersectReduce<unknown, IntersectEvaluate<T, this['params']>>, TSchema>
}
declare type UnionToIntersect<U> = (U extends unknown ? (arg: U) => 0 : never) extends (arg: infer I) => 0 ? I : never
declare type UnionLast<U> = UnionToIntersect<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0 ? L : never
declare type UnionToTuple<U, L = UnionLast<U>> = [U] extends [never] ? [] : [...UnionToTuple<Exclude<U, L>>, L]
export declare type TKeyOf<T extends TObject> = {
  [K in ObjectPropertyKeys<T>]: TLiteral<K>
} extends infer R
  ? UnionToTuple<R[keyof R]>
  : never
export declare type TLiteralValue = string | number | boolean
export interface TLiteral<T extends TLiteralValue = TLiteralValue> extends TSchema {
  [Kind]: 'Literal'
  static: T
  const: T
}
export interface TNull extends TSchema {
  [Kind]: 'Null'
  static: null
  type: 'null'
}
export interface TNumber extends TSchema, NumericOptions {
  [Kind]: 'Number'
  static: number
  type: 'number'
}
export declare type ReadonlyOptionalPropertyKeys<T extends TProperties> = {
  [K in keyof T]: T[K] extends TReadonlyOptional<TSchema> ? K : never
}[keyof T]
export declare type ReadonlyPropertyKeys<T extends TProperties> = {
  [K in keyof T]: T[K] extends TReadonly<TSchema> ? K : never
}[keyof T]
export declare type OptionalPropertyKeys<T extends TProperties> = {
  [K in keyof T]: T[K] extends TOptional<TSchema> ? K : never
}[keyof T]
export declare type RequiredPropertyKeys<T extends TProperties> = keyof Omit<T, ReadonlyOptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | OptionalPropertyKeys<T>>
export declare type PropertiesReduce<T extends TProperties, P extends unknown[]> = {
  readonly [K in ReadonlyOptionalPropertyKeys<T>]?: Static<T[K], P>
} & {
  readonly [K in ReadonlyPropertyKeys<T>]: Static<T[K], P>
} & {
  [K in OptionalPropertyKeys<T>]?: Static<T[K], P>
} & {
  [K in RequiredPropertyKeys<T>]: Static<T[K], P>
} extends infer R
  ? {
      [K in keyof R]: R[K]
    }
  : never
export interface TProperties {
  [key: string]: TSchema
}
export declare type ObjectProperties<T> = T extends TObject<infer U> ? U : never
export declare type ObjectPropertyKeys<T> = T extends TObject<infer U> ? keyof U : never
export interface ObjectOptions extends SchemaOptions {
  additionalProperties?: boolean
  minProperties?: number
  maxProperties?: number
}
export interface TObject<T extends TProperties = TProperties> extends TSchema, ObjectOptions {
  [Kind]: 'Object'
  static: PropertiesReduce<T, this['params']>
  type: 'object'
  properties: T
  required?: string[]
}
export interface TOmit<T extends TObject, Properties extends ObjectPropertyKeys<T>[]> extends TObject, ObjectOptions {
  static: Omit<Static<T, this['params']>, Properties[number]>
  properties: T extends TObject ? Omit<T['properties'], Properties[number]> : never
}
export interface TPartial<T extends TObject> extends TObject {
  static: Partial<Static<T, this['params']>>
}
export interface TPick<T extends TObject, Properties extends ObjectPropertyKeys<T>[]> extends TObject, ObjectOptions {
  static: Pick<Static<T, this['params']>, Properties[number]>
  properties: ObjectProperties<T>
}
export interface TPromise<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Promise'
  static: Promise<Static<T, this['params']>>
  type: 'promise'
  item: TSchema
}
export declare type TRecordKey = TString | TNumber | TUnion<TLiteral<any>[]>
export interface TRecord<K extends TRecordKey = TRecordKey, T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Record'
  static: Record<Static<K>, Static<T, this['params']>>
  type: 'object'
  patternProperties: {
    [pattern: string]: T
  }
  additionalProperties: false
}
export interface TSelf extends TSchema {
  [Kind]: 'Self'
  static: this['params'][0]
  $ref: string
}
export declare type TRecursiveReduce<T extends TSchema> = Static<T, [TRecursiveReduce<T>]>
export interface TRecursive<T extends TSchema> extends TSchema {
  static: TRecursiveReduce<T>
}
export interface TRef<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Ref'
  static: Static<T, this['params']>
  $ref: string
}
export interface TRequired<T extends TObject | TRef<TObject>> extends TObject {
  static: Required<Static<T, this['params']>>
}
export declare type StringFormatOption =
  | 'date-time'
  | 'time'
  | 'date'
  | 'email'
  | 'idn-email'
  | 'hostname'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'uri'
  | 'uri-reference'
  | 'iri'
  | 'uuid'
  | 'iri-reference'
  | 'uri-template'
  | 'json-pointer'
  | 'relative-json-pointer'
  | 'regex'
export interface StringOptions<TFormat extends string> extends SchemaOptions {
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: TFormat
  contentEncoding?: '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64'
  contentMediaType?: string
}
export interface TString extends TSchema, StringOptions<string> {
  [Kind]: 'String'
  static: string
  type: 'string'
}
export interface TTuple<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Tuple'
  static: {
    [K in keyof T]: T[K] extends TSchema ? Static<T[K], this['params']> : T[K]
  }
  type: 'array'
  items?: T
  additionalItems?: false
  minItems: number
  maxItems: number
}
export interface TUndefined extends TSchema {
  [Kind]: 'Undefined'
  specialized: 'Undefined'
  static: undefined
  type: 'object'
}
export interface TUnion<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Union'
  static: {
    [K in keyof T]: T[K] extends TSchema ? Static<T[K], this['params']> : never
  }[number]
  anyOf: T
}
export interface TypedArrayOptions extends SchemaOptions {
  maxByteLength?: number
  minByteLength?: number
}
export interface TUint8Array extends TSchema, TypedArrayOptions {
  [Kind]: 'Uint8Array'
  static: Uint8Array
  specialized: 'Uint8Array'
  type: 'object'
}
export interface TUnknown extends TSchema {
  [Kind]: 'Unknown'
  static: unknown
}
export interface TUnsafe<T> extends TSchema {
  [Kind]: 'Unknown'
  static: T
}
export interface TVoid extends TSchema {
  [Kind]: 'Void'
  static: void
  type: 'null'
}
export declare type Static<T extends TSchema, P extends unknown[] = []> = (T & {
  params: P
})['static']
export declare class TypeBuilder {
  /** Creates a readonly optional property */
  ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T>
  /** Creates a readonly property */
  Readonly<T extends TSchema>(item: T): TReadonly<T>
  /** Creates a optional property */
  Optional<T extends TSchema>(item: T): TOptional<T>
  /** Creates a any type */
  Any(options?: SchemaOptions): TAny
  /** Creates a array type */
  Array<T extends TSchema>(items: T, options?: ArrayOptions): TArray<T>
  /** Creates a boolean type */
  Boolean(options?: SchemaOptions): TBoolean
  /** Creates a constructor type */
  Constructor<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TConstructor<T, U>
  /** Creates a enum type */
  Enum<T extends Record<string, string | number>>(item: T, options?: SchemaOptions): TEnum<T>
  /** Creates a function type */
  Function<T extends readonly TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TFunction<T, U>
  /** Creates a integer type */
  Integer(options?: NumericOptions): TInteger
  /** Creates a intersect type. */
  Intersect<T extends TObject[]>(objects: [...T], options?: ObjectOptions): TIntersect<T>
  /** Creates a keyof type */
  KeyOf<T extends TObject>(object: T, options?: SchemaOptions): TUnion<TKeyOf<T>>
  /** Creates a literal type. */
  Literal<T extends TLiteralValue>(value: T, options?: SchemaOptions): TLiteral<T>
  /** Creates a null type */
  Null(options?: SchemaOptions): TNull
  /** Creates a number type */
  Number(options?: NumericOptions): TNumber
  /** Creates an object type with the given properties */
  Object<T extends TProperties>(properties: T, options?: ObjectOptions): TObject<T>
  /** Creates a new object whose properties are omitted from the given object */
  Omit<T extends TObject, Properties extends Array<ObjectPropertyKeys<T>>>(schema: T, keys: [...Properties], options?: ObjectOptions): TOmit<T, Properties>
  /** Creates an object type whose properties are all optional */
  Partial<T extends TObject>(schema: T, options?: ObjectOptions): TPartial<T>
  /** Creates a new object whose properties are picked from the given object */
  Pick<T extends TObject, Properties extends Array<ObjectPropertyKeys<T>>>(schema: T, keys: [...Properties], options?: ObjectOptions): TPick<T, Properties>
  /** Creates a promise type. This type cannot be represented in schema. */
  Promise<T extends TSchema>(item: T, options?: SchemaOptions): TPromise<T>
  /** Creates a record type */
  Record<K extends TRecordKey, T extends TSchema>(key: K, value: T, options?: ObjectOptions): TRecord<K, T>
  /** Creates a recursive object type */
  Recursive<T extends TSchema>(callback: (self: TSelf) => T, options?: SchemaOptions): TRecursive<T>
  /** Creates a reference schema */
  Ref<T extends TSchema>(schema: T, options?: SchemaOptions): TRef<T>
  /** Creates a string type from a regular expression */
  RegEx(regex: RegExp, options?: SchemaOptions): TString
  /** Creates an object type whose properties are all required */
  Required<T extends TObject>(schema: T, options?: SchemaOptions): TRequired<T>
  /** Removes Kind and Modifier symbol property keys from this schema */
  Strict<T extends TSchema>(schema: T): T
  /** Creates a string type */
  String<TCustomFormatOption extends string>(options?: StringOptions<StringFormatOption | TCustomFormatOption>): TString
  /** Creates a tuple type */
  Tuple<T extends TSchema[]>(items: [...T], options?: SchemaOptions): TTuple<T>
  /** Creates a undefined type */
  Undefined(options?: SchemaOptions): TUndefined
  /** Creates a union type */
  Union<T extends TSchema[]>(items: [...T], options?: SchemaOptions): TUnion<T>
  /** Creates a Uint8Array type */
  Uint8Array(options?: TypedArrayOptions): TUint8Array
  /** Creates an unknown type */
  Unknown(options?: SchemaOptions): TUnknown
  /** Creates a user defined schema that infers as type T  */
  Unsafe<T>(options?: SchemaOptions): TUnsafe<T>
  /** Creates a void type */
  Void(options?: SchemaOptions): TVoid
  /** Use this function to return TSchema with static and params omitted */
  protected Create<T>(schema: Omit<T, 'static' | 'params'>): T
  /** Clones the given value */
  protected Clone(value: any): any
}
/** JSON Schema Type Builder with Static Type Resolution for TypeScript */
export declare const Type: TypeBuilder
export {}
