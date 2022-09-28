/*--------------------------------------------------------------------------

@sinclair/typebox

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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
// Symbols
// --------------------------------------------------------------------------

export const Kind = Symbol.for('TypeBox.Kind')
export const Hint = Symbol.for('TypeBox.Hint')
export const Modifier = Symbol.for('TypeBox.Modifier')

// --------------------------------------------------------------------------
// Modifiers
// --------------------------------------------------------------------------

export type TModifier = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>
export type TReadonly<T extends TSchema> = T & { [Modifier]: 'Readonly' }
export type TOptional<T extends TSchema> = T & { [Modifier]: 'Optional' }
export type TReadonlyOptional<T extends TSchema> = T & { [Modifier]: 'ReadonlyOptional' }

// --------------------------------------------------------------------------
// Schema
// --------------------------------------------------------------------------

export interface SchemaOptions {
  $schema?: string
  /** Id for this schema */
  $id?: string
  /** Title of this schema */
  title?: string
  /** Description of this schema */
  description?: string
  /** Default value for this schema */
  default?: any
  /** Example values matching this schema. */
  examples?: any
  [prop: string]: any
}

export interface TSchema extends SchemaOptions {
  [Kind]: string
  [Hint]?: string
  [Modifier]?: string
  params: unknown[]
  static: unknown
}

// --------------------------------------------------------------------------
// TAnySchema
// --------------------------------------------------------------------------

export type TAnySchema =
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

// --------------------------------------------------------------------------
// TNumeric
// --------------------------------------------------------------------------

export interface NumericOptions extends SchemaOptions {
  exclusiveMaximum?: number
  exclusiveMinimum?: number
  maximum?: number
  minimum?: number
  multipleOf?: number
}

export type TNumeric = TInteger | TNumber

// --------------------------------------------------------------------------
// Any
// --------------------------------------------------------------------------

export interface TAny extends TSchema {
  [Kind]: 'Any'
  static: any
}

// --------------------------------------------------------------------------
// Array
// --------------------------------------------------------------------------

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

// --------------------------------------------------------------------------
// Boolean
// --------------------------------------------------------------------------

export interface TBoolean extends TSchema {
  [Kind]: 'Boolean'
  static: boolean
  type: 'boolean'
}

// --------------------------------------------------------------------------
// Constructor
// --------------------------------------------------------------------------

export type TConstructorParameters<T extends TConstructor<TSchema[], TSchema>> = TTuple<T['parameters']>

export type TInstanceType<T extends TConstructor<TSchema[], TSchema>> = T['returns']

export type StaticContructorParameters<T extends readonly TSchema[], P extends unknown[]> = [...{ [K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : never }]

export interface TConstructor<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Constructor'
  static: new (...param: StaticContructorParameters<T, this['params']>) => Static<U, this['params']>
  type: 'constructor'
  parameters: T
  returns: U
}

// --------------------------------------------------------------------------
// Enum
// --------------------------------------------------------------------------

export interface TEnumOption<T> {
  type: 'number' | 'string'
  const: T
}

export interface TEnum<T extends Record<string, string | number> = Record<string, string | number>> extends TSchema {
  [Kind]: 'Union'
  static: T[keyof T]
  anyOf: TLiteral<string | number>[]
}

// --------------------------------------------------------------------------
// Function
// --------------------------------------------------------------------------

export type TParameters<T extends TFunction> = TTuple<T['parameters']>

export type TReturnType<T extends TFunction> = T['returns']

export type StaticFunctionParameters<T extends readonly TSchema[], P extends unknown[]> = [...{ [K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : never }]

export interface TFunction<T extends readonly TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Function'
  static: (...param: StaticFunctionParameters<T, this['params']>) => Static<U, this['params']>
  type: 'function'
  parameters: T
  returns: U
}

// --------------------------------------------------------------------------
// Integer
// --------------------------------------------------------------------------

export interface TInteger extends TSchema, NumericOptions {
  [Kind]: 'Integer'
  static: number
  type: 'integer'
}

// --------------------------------------------------------------------------
// Intersect
// --------------------------------------------------------------------------

export type IntersectReduce<I extends unknown, T extends readonly any[]> = T extends [infer A, ...infer B] ? IntersectReduce<I & A, B> : I extends object ? I : {}

// note: rename to IntersectStatic<T, P> in next minor release
export type IntersectEvaluate<T extends readonly TSchema[], P extends unknown[]> = { [K in keyof T]: T[K] extends TSchema ? Static<T[K], P> : never }

export type IntersectProperties<T extends readonly TObject[]> = {
  [K in keyof T]: T[K] extends TObject<infer P> ? P : {}
}

export interface TIntersect<T extends TObject[] = TObject[]> extends TObject {
  static: IntersectReduce<unknown, IntersectEvaluate<T, this['params']>>
  properties: IntersectReduce<unknown, IntersectProperties<T>>
}

// --------------------------------------------------------------------------
// KeyOf: Implemented by way of Union<TLiteral<string>>
// --------------------------------------------------------------------------

export type UnionToIntersect<U> = (U extends unknown ? (arg: U) => 0 : never) extends (arg: infer I) => 0 ? I : never

export type UnionLast<U> = UnionToIntersect<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0 ? L : never

export type UnionToTuple<U, L = UnionLast<U>> = [U] extends [never] ? [] : [...UnionToTuple<Exclude<U, L>>, L]

export type UnionStringLiteralToTuple<T> = T extends TUnion<infer L> ? { [I in keyof L]: L[I] extends TLiteral<infer C> ? C : never } : never

export type UnionLiteralsFromObject<T extends TObject> = { [K in ObjectPropertyKeys<T>]: TLiteral<K> } extends infer R ? UnionToTuple<R[keyof R]> : never

// export type TKeyOf<T extends TObject> = { [K in ObjectPropertyKeys<T>]: TLiteral<K> } extends infer R ? UnionToTuple<R[keyof R]> : never

export interface TKeyOf<T extends TObject> extends TUnion<UnionLiteralsFromObject<T>> {}

// --------------------------------------------------------------------------
// Literal
// --------------------------------------------------------------------------

export type TLiteralValue = string | number | boolean

export interface TLiteral<T extends TLiteralValue = TLiteralValue> extends TSchema {
  [Kind]: 'Literal'
  static: T
  const: T
}

// --------------------------------------------------------------------------
// Never
// --------------------------------------------------------------------------

export interface TNever extends TSchema {
  [Kind]: 'Never'
  static: never
  allOf: [{ type: 'boolean'; const: false }, { type: 'boolean'; const: true }]
}

// --------------------------------------------------------------------------
// Null
// --------------------------------------------------------------------------

export interface TNull extends TSchema {
  [Kind]: 'Null'
  static: null
  type: 'null'
}

// --------------------------------------------------------------------------
// Number
// --------------------------------------------------------------------------

export interface TNumber extends TSchema, NumericOptions {
  [Kind]: 'Number'
  static: number
  type: 'number'
}

// --------------------------------------------------------------------------
// Object
// --------------------------------------------------------------------------

export type ReadonlyOptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonlyOptional<TSchema> ? K : never }[keyof T]

export type ReadonlyPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonly<TSchema> ? K : never }[keyof T]

export type OptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TOptional<TSchema> ? K : never }[keyof T]

export type RequiredPropertyKeys<T extends TProperties> = keyof Omit<T, ReadonlyOptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | OptionalPropertyKeys<T>>

export type PropertiesReduce<T extends TProperties, P extends unknown[]> = { readonly [K in ReadonlyOptionalPropertyKeys<T>]?: Static<T[K], P> } & {
  readonly [K in ReadonlyPropertyKeys<T>]: Static<T[K], P>
} & {
  [K in OptionalPropertyKeys<T>]?: Static<T[K], P>
} & { [K in RequiredPropertyKeys<T>]: Static<T[K], P> } extends infer R
  ? { [K in keyof R]: R[K] }
  : never

export type TRecordProperties<K extends TUnion<TLiteral[]>, T extends TSchema> = Static<K> extends string ? { [X in Static<K>]: T } : never

export interface TProperties {
  [key: string]: TSchema
}

export type ObjectProperties<T> = T extends TObject<infer U> ? U : never

export type ObjectPropertyKeys<T> = T extends TObject<infer U> ? keyof U : never

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

// --------------------------------------------------------------------------
// Omit
// --------------------------------------------------------------------------

export interface TOmit<T extends TObject, Properties extends ObjectPropertyKeys<T>[]> extends TObject, ObjectOptions {
  static: Omit<Static<T, this['params']>, Properties[number]>
  properties: T extends TObject ? Omit<T['properties'], Properties[number]> : never
}

// --------------------------------------------------------------------------
// Partial
// --------------------------------------------------------------------------

export interface TPartial<T extends TObject> extends TObject {
  static: Partial<Static<T, this['params']>>
}

// --------------------------------------------------------------------------
// Pick
// --------------------------------------------------------------------------

// export interface TPick<T extends TObject, Properties extends ObjectPropertyKeys<T>[]> extends TObject, ObjectOptions {
//   static: Pick<Static<T, this['params']>, Properties[number]>
//   properties: ObjectProperties<T>
// }

export type TPick<T extends TObject, Properties extends ObjectPropertyKeys<T>[]> = TObject<{
  [K in Properties[number]]: T['properties'][K]
}>

// --------------------------------------------------------------------------
// Promise
// --------------------------------------------------------------------------

export interface TPromise<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Promise'
  static: Promise<Static<T, this['params']>>
  type: 'promise'
  item: TSchema
}

// --------------------------------------------------------------------------
// Record
// --------------------------------------------------------------------------

export type TRecordKey = TString | TNumber | TUnion<TLiteral<any>[]>

export interface TRecord<K extends TRecordKey = TRecordKey, T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Record'
  static: Record<Static<K>, Static<T, this['params']>>
  type: 'object'
  patternProperties: { [pattern: string]: T }
  additionalProperties: false
}

// --------------------------------------------------------------------------
// Rec
// --------------------------------------------------------------------------

export interface TSelf extends TSchema {
  [Kind]: 'Self'
  static: this['params'][0]
  $ref: string
}

export type TRecursiveReduce<T extends TSchema> = Static<T, [TRecursiveReduce<T>]>

export interface TRecursive<T extends TSchema> extends TSchema {
  static: TRecursiveReduce<T>
}

// --------------------------------------------------------------------------
// Ref
// --------------------------------------------------------------------------

export interface TRef<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'Ref'
  static: Static<T, this['params']>
  $ref: string
}

// --------------------------------------------------------------------------
// Required
// --------------------------------------------------------------------------

export interface TRequired<T extends TObject | TRef<TObject>> extends TObject {
  static: Required<Static<T, this['params']>>
}

// --------------------------------------------------------------------------
// String
// --------------------------------------------------------------------------

export type StringFormatOption =
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

export interface StringOptions<Format extends string> extends SchemaOptions {
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: Format
  contentEncoding?: '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64'
  contentMediaType?: string
}

export interface TString<Format extends string = string> extends TSchema, StringOptions<Format> {
  [Kind]: 'String'
  static: string
  type: 'string'
}

// --------------------------------------------------------------------------
// Tuple
// --------------------------------------------------------------------------

export type TupleToArray<T extends TTuple<TSchema[]>> = T extends TTuple<infer R> ? R : never

export interface TTuple<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Tuple'
  static: { [K in keyof T]: T[K] extends TSchema ? Static<T[K], this['params']> : T[K] }
  type: 'array'
  items?: T
  additionalItems?: false
  minItems: number
  maxItems: number
}

// --------------------------------------------------------------------------
// Undefined
// --------------------------------------------------------------------------

export interface TUndefined extends TSchema {
  [Kind]: 'Undefined'
  specialized: 'Undefined'
  static: undefined
  type: 'object'
}

// --------------------------------------------------------------------------
// Union
// --------------------------------------------------------------------------

export interface TUnion<T extends TSchema[] = TSchema[]> extends TSchema {
  [Kind]: 'Union'
  static: { [K in keyof T]: T[K] extends TSchema ? Static<T[K], this['params']> : never }[number]
  anyOf: T
}

// -------------------------------------------------------------------------
// Uint8Array
// -------------------------------------------------------------------------

export interface Uint8ArrayOptions extends SchemaOptions {
  maxByteLength?: number
  minByteLength?: number
}

export interface TUint8Array extends TSchema, Uint8ArrayOptions {
  [Kind]: 'Uint8Array'
  static: Uint8Array
  specialized: 'Uint8Array'
  type: 'object'
}

// --------------------------------------------------------------------------
// Unknown
// --------------------------------------------------------------------------

export interface TUnknown extends TSchema {
  [Kind]: 'Unknown'
  static: unknown
}

// --------------------------------------------------------------------------
// Unsafe
// --------------------------------------------------------------------------

export interface UnsafeOptions extends SchemaOptions {
  [Kind]?: string
}

export interface TUnsafe<T> extends TSchema {
  [Kind]: string
  static: T
}

// --------------------------------------------------------------------------
// Void
// --------------------------------------------------------------------------

export interface TVoid extends TSchema {
  [Kind]: 'Void'
  static: void
  type: 'null'
}

// --------------------------------------------------------------------------
// Static<T>
// --------------------------------------------------------------------------

/** Creates a static type from a TypeBox type */
export type Static<T extends TSchema, P extends unknown[] = []> = (T & { params: P })['static']

// --------------------------------------------------------------------------
// TypeBuilder
// --------------------------------------------------------------------------

let TypeOrdinal = 0

export class TypeBuilder {
  // ----------------------------------------------------------------------
  // Modifiers
  // ----------------------------------------------------------------------

  /** Creates a readonly optional property */
  public ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T> {
    return { [Modifier]: 'ReadonlyOptional', ...item }
  }

  /** Creates a readonly property */
  public Readonly<T extends TSchema>(item: T): TReadonly<T> {
    return { [Modifier]: 'Readonly', ...item }
  }

  /** Creates a optional property */
  public Optional<T extends TSchema>(item: T): TOptional<T> {
    return { [Modifier]: 'Optional', ...item }
  }

  // ----------------------------------------------------------------------
  // Types
  // ----------------------------------------------------------------------

  /** Creates a any type */
  public Any(options: SchemaOptions = {}): TAny {
    return this.Create({ ...options, [Kind]: 'Any' })
  }

  /** Creates a array type */
  public Array<T extends TSchema>(items: T, options: ArrayOptions = {}): TArray<T> {
    return this.Create({ ...options, [Kind]: 'Array', type: 'array', items })
  }

  /** Creates a boolean type */
  public Boolean(options: SchemaOptions = {}): TBoolean {
    return this.Create({ ...options, [Kind]: 'Boolean', type: 'boolean' })
  }

  /** Creates a tuple type from this constructors parameters */
  public ConstructorParameters<T extends TConstructor<any[], any>>(schema: T, options: SchemaOptions = {}): TConstructorParameters<T> {
    return this.Tuple([...schema.parameters], { ...options })
  }

  /** Creates a constructor type */
  public Constructor<T extends TTuple<TSchema[]>, U extends TSchema>(parameters: T, returns: U, options?: SchemaOptions): TConstructor<TupleToArray<T>, U>

  /** Creates a constructor type */
  public Constructor<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TConstructor<T, U>

  /** Creates a constructor type */
  public Constructor(parameters: any, returns: any, options: SchemaOptions = {}) {
    if (parameters[Kind] === 'Tuple') {
      const inner = parameters.items === undefined ? [] : parameters.items
      return this.Create({ ...options, [Kind]: 'Constructor', type: 'constructor', parameters: inner, returns })
    } else if (globalThis.Array.isArray(parameters)) {
      return this.Create({ ...options, [Kind]: 'Constructor', type: 'constructor', parameters, returns })
    } else {
      throw new Error('TypeBuilder.Constructor: Invalid parameters')
    }
  }

  /** Creates a enum type */
  public Enum<T extends Record<string, string | number>>(item: T, options: SchemaOptions = {}): TEnum<T> {
    const values = Object.keys(item)
      .filter((key) => isNaN(key as any))
      .map((key) => item[key]) as T[keyof T][]
    const anyOf = values.map((value) => (typeof value === 'string' ? { [Kind]: 'Literal', type: 'string' as const, const: value } : { [Kind]: 'Literal', type: 'number' as const, const: value }))
    return this.Create({ ...options, [Kind]: 'Union', [Hint]: 'Enum', anyOf })
  }

  /** Creates a function type */
  public Function<T extends TTuple<TSchema[]>, U extends TSchema>(parameters: T, returns: U, options?: SchemaOptions): TFunction<TupleToArray<T>, U>

  /** Creates a function type */
  public Function<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options?: SchemaOptions): TFunction<T, U>

  /** Creates a function type */
  public Function(parameters: any, returns: any, options: SchemaOptions = {}) {
    if (parameters[Kind] === 'Tuple') {
      const inner = parameters.items === undefined ? [] : parameters.items
      return this.Create({ ...options, [Kind]: 'Function', type: 'function', parameters: inner, returns })
    } else if (globalThis.Array.isArray(parameters)) {
      return this.Create({ ...options, [Kind]: 'Function', type: 'function', parameters, returns })
    } else {
      throw new Error('TypeBuilder.Function: Invalid parameters')
    }
  }

  /** Creates a type from this constructors instance type */
  public InstanceType<T extends TConstructor<any[], any>>(schema: T, options: SchemaOptions = {}): TInstanceType<T> {
    return { ...options, ...this.Clone(schema.returns) }
  }

  /** Creates a integer type */
  public Integer(options: NumericOptions = {}): TInteger {
    return this.Create({ ...options, [Kind]: 'Integer', type: 'integer' })
  }

  /** Creates a intersect type. */
  public Intersect<T extends TObject[]>(objects: [...T], options: ObjectOptions = {}): TIntersect<T> {
    const isOptional = (schema: TSchema) => (schema[Modifier] && schema[Modifier] === 'Optional') || schema[Modifier] === 'ReadonlyOptional'
    const [required, optional] = [new Set<string>(), new Set<string>()]
    for (const object of objects) {
      for (const [key, schema] of Object.entries(object.properties)) {
        if (isOptional(schema)) optional.add(key)
      }
    }
    for (const object of objects) {
      for (const key of Object.keys(object.properties)) {
        if (!optional.has(key)) required.add(key)
      }
    }
    const properties = {} as Record<string, any>
    for (const object of objects) {
      for (const [key, schema] of Object.entries(object.properties)) {
        properties[key] = properties[key] === undefined ? schema : { [Kind]: 'Union', anyOf: [properties[key], { ...schema }] }
      }
    }
    if (required.size > 0) {
      return this.Create({ ...options, [Kind]: 'Object', type: 'object', properties, required: [...required] })
    } else {
      return this.Create({ ...options, [Kind]: 'Object', type: 'object', properties })
    }
  }

  /** Creates a keyof type */
  public KeyOf<T extends TObject>(object: T, options: SchemaOptions = {}): TKeyOf<T> {
    const items = Object.keys(object.properties).map((key) => this.Create({ ...options, [Kind]: 'Literal', type: 'string', const: key }))
    return this.Create({ ...options, [Kind]: 'Union', [Hint]: 'KeyOf', anyOf: items })
  }

  /** Creates a literal type. */
  public Literal<T extends TLiteralValue>(value: T, options: SchemaOptions = {}): TLiteral<T> {
    return this.Create({ ...options, [Kind]: 'Literal', const: value, type: typeof value as 'string' | 'number' | 'boolean' })
  }

  /** Creates a never type */
  public Never(options: SchemaOptions = {}): TNever {
    return this.Create({
      ...options,
      [Kind]: 'Never',
      allOf: [
        { type: 'boolean', const: false },
        { type: 'boolean', const: true },
      ],
    })
  }

  /** Creates a null type */
  public Null(options: SchemaOptions = {}): TNull {
    return this.Create({ ...options, [Kind]: 'Null', type: 'null' })
  }

  /** Creates a number type */
  public Number(options: NumericOptions = {}): TNumber {
    return this.Create({ ...options, [Kind]: 'Number', type: 'number' })
  }

  /** Creates an object type with the given properties */
  public Object<T extends TProperties>(properties: T, options: ObjectOptions = {}): TObject<T> {
    const property_names = Object.keys(properties)
    const optional = property_names.filter((name) => {
      const property = properties[name] as TModifier
      const modifier = property[Modifier]
      return modifier && (modifier === 'Optional' || modifier === 'ReadonlyOptional')
    })
    const required = property_names.filter((name) => !optional.includes(name))
    if (required.length > 0) {
      return this.Create({ ...options, [Kind]: 'Object', type: 'object', properties, required })
    } else {
      return this.Create({ ...options, [Kind]: 'Object', type: 'object', properties })
    }
  }

  /** Creates a new object whose properties are omitted from the given object */
  public Omit<T extends TObject, K extends TUnion<TLiteral<string>[]>>(schema: T, keys: K, options?: ObjectOptions): TOmit<T, UnionStringLiteralToTuple<K>>

  /** Creates a new object whose properties are omitted from the given object */
  public Omit<T extends TObject, K extends ObjectPropertyKeys<T>[]>(schema: T, keys: [...K], options?: ObjectOptions): TOmit<T, K>

  /** Creates a new object whose properties are omitted from the given object */
  public Omit(schema: any, keys: any, options: ObjectOptions = {}) {
    const select: string[] = keys[Kind] === 'Union' ? keys.anyOf.map((schema: TLiteral) => schema.const) : keys
    const next = { ...this.Clone(schema), ...options, [Hint]: 'Omit' }
    if (next.required) {
      next.required = next.required.filter((key: string) => !select.includes(key as any))
      if (next.required.length === 0) delete next.required
    }
    for (const key of Object.keys(next.properties)) {
      if (select.includes(key as any)) delete next.properties[key]
    }
    return this.Create(next)
  }

  /** Creates a tuple type from this functions parameters */
  public Parameters<T extends TFunction<any[], any>>(schema: T, options: SchemaOptions = {}): TParameters<T> {
    return Type.Tuple(schema.parameters, { ...options })
  }

  /** Creates an object type whose properties are all optional */
  public Partial<T extends TObject>(schema: T, options: ObjectOptions = {}): TPartial<T> {
    const next = { ...this.Clone(schema), ...options, [Hint]: 'Partial' }
    delete next.required
    for (const key of Object.keys(next.properties)) {
      const property = next.properties[key]
      const modifer = property[Modifier]
      switch (modifer) {
        case 'ReadonlyOptional':
          property[Modifier] = 'ReadonlyOptional'
          break
        case 'Readonly':
          property[Modifier] = 'ReadonlyOptional'
          break
        case 'Optional':
          property[Modifier] = 'Optional'
          break
        default:
          property[Modifier] = 'Optional'
          break
      }
    }
    return this.Create(next)
  }

  /** Creates a object whose properties are picked from the given object */
  public Pick<T extends TObject, K extends TUnion<TLiteral<string>[]>>(schema: T, keys: K, options?: ObjectOptions): TPick<T, UnionStringLiteralToTuple<K>>

  /** Creates a object whose properties are picked from the given object */
  public Pick<T extends TObject, K extends ObjectPropertyKeys<T>[]>(schema: T, keys: [...K], options?: ObjectOptions): TPick<T, K>

  /** Creates a object whose properties are picked from the given object */
  public Pick<T extends TObject, K extends ObjectPropertyKeys<T>[]>(schema: any, keys: any, options: ObjectOptions = {}) {
    const select: string[] = keys[Kind] === 'Union' ? keys.anyOf.map((schema: TLiteral) => schema.const) : keys
    const next = { ...this.Clone(schema), ...options, [Hint]: 'Pick' }
    if (next.required) {
      next.required = next.required.filter((key: any) => select.includes(key))
      if (next.required.length === 0) delete next.required
    }
    for (const key of Object.keys(next.properties)) {
      if (!select.includes(key as any)) delete next.properties[key]
    }
    return this.Create(next)
  }

  /** Creates a promise type. This type cannot be represented in schema. */
  public Promise<T extends TSchema>(item: T, options: SchemaOptions = {}): TPromise<T> {
    return this.Create({ ...options, [Kind]: 'Promise', type: 'promise', item })
  }

  /** Creates an object whose properties are derived from the given string literal union. */
  public Record<K extends TUnion<TLiteral[]>, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): TObject<TRecordProperties<K, T>>

  /** Creates a record type */
  public Record<K extends TString | TNumber, T extends TSchema>(key: K, schema: T, options?: ObjectOptions): TRecord<K, T>

  /** Creates a record type */
  public Record(key: any, value: any, options: ObjectOptions = {}) {
    // If string literal union return TObject with properties extracted from union.
    if (key[Kind] === 'Union') {
      return this.Object(
        key.anyOf.reduce((acc: any, literal: any) => {
          return { ...acc, [literal.const]: value }
        }, {}),
        { ...options, [Hint]: 'Record' },
      )
    }
    // otherwise return TRecord with patternProperties
    const pattern = key[Kind] === 'Number' ? '^(0|[1-9][0-9]*)$' : key[Kind] === 'String' && key.pattern ? key.pattern : '^.*$'
    return this.Create({
      ...options,
      [Kind]: 'Record',
      type: 'object',
      patternProperties: { [pattern]: value },
      additionalProperties: false,
    })
  }

  /** Creates a recursive object type */
  public Recursive<T extends TSchema>(callback: (self: TSelf) => T, options: SchemaOptions = {}): TRecursive<T> {
    if (options.$id === undefined) options.$id = `T${TypeOrdinal++}`
    const self = callback({ [Kind]: 'Self', $ref: `${options.$id}` } as any)
    self.$id = options.$id
    return this.Create({ ...options, ...self } as any)
  }

  /** Creates a reference schema */
  public Ref<T extends TSchema>(schema: T, options: SchemaOptions = {}): TRef<T> {
    if (schema.$id === undefined) throw Error('TypeBuilder.Ref: Referenced schema must specify an $id')
    return this.Create({ ...options, [Kind]: 'Ref', $ref: schema.$id! })
  }

  /** Creates a string type from a regular expression */
  public RegEx(regex: RegExp, options: SchemaOptions = {}): TString {
    return this.Create({ ...options, [Kind]: 'String', type: 'string', pattern: regex.source })
  }

  /** Creates an object type whose properties are all required */
  public Required<T extends TObject>(schema: T, options: SchemaOptions = {}): TRequired<T> {
    const next = { ...this.Clone(schema), ...options, [Hint]: 'Required' }
    next.required = Object.keys(next.properties)
    for (const key of Object.keys(next.properties)) {
      const property = next.properties[key]
      const modifier = property[Modifier]
      switch (modifier) {
        case 'ReadonlyOptional':
          property[Modifier] = 'Readonly'
          break
        case 'Readonly':
          property[Modifier] = 'Readonly'
          break
        case 'Optional':
          delete property[Modifier]
          break
        default:
          delete property[Modifier]
          break
      }
    }
    return this.Create(next)
  }

  /** Creates a type from this functions return type */
  public ReturnType<T extends TFunction<any[], any>>(schema: T, options: SchemaOptions = {}): TReturnType<T> {
    return { ...options, ...this.Clone(schema.returns) }
  }

  /** Removes Kind and Modifier symbol property keys from this schema */
  public Strict<T extends TSchema>(schema: T): T {
    return JSON.parse(JSON.stringify(schema))
  }

  /** Creates a string type */
  public String<Format extends string>(options: StringOptions<StringFormatOption | Format> = {}): TString<Format> {
    return this.Create({ ...options, [Kind]: 'String', type: 'string' })
  }

  /** Creates a tuple type */
  public Tuple<T extends TSchema[]>(items: [...T], options: SchemaOptions = {}): TTuple<T> {
    const additionalItems = false
    const minItems = items.length
    const maxItems = items.length
    const schema = (items.length > 0 ? { ...options, [Kind]: 'Tuple', type: 'array', items, additionalItems, minItems, maxItems } : { ...options, [Kind]: 'Tuple', type: 'array', minItems, maxItems }) as any
    return this.Create(schema)
  }

  /** Creates a undefined type */
  public Undefined(options: SchemaOptions = {}): TUndefined {
    return this.Create({ ...options, [Kind]: 'Undefined', type: 'object', specialized: 'Undefined' })
  }

  /** Creates a union type */

  public Union(items: [], options?: SchemaOptions): TNever
  public Union<T extends TSchema[]>(items: [...T], options?: SchemaOptions): TUnion<T>
  public Union<T extends TSchema[]>(items: [...T], options: SchemaOptions = {}) {
    return items.length === 0 ? Type.Never({ ...options }) : this.Create({ ...options, [Kind]: 'Union', anyOf: items })
  }

  /** Creates a Uint8Array type */
  public Uint8Array(options: Uint8ArrayOptions = {}): TUint8Array {
    return this.Create({ ...options, [Kind]: 'Uint8Array', type: 'object', specialized: 'Uint8Array' })
  }

  /** Creates an unknown type */
  public Unknown(options: SchemaOptions = {}): TUnknown {
    return this.Create({ ...options, [Kind]: 'Unknown' })
  }

  /** Creates a user defined schema that infers as type T  */
  public Unsafe<T>(options: UnsafeOptions = {}): TUnsafe<T> {
    return this.Create({ ...options, [Kind]: options[Kind] || 'Unsafe' })
  }

  /** Creates a void type */
  public Void(options: SchemaOptions = {}): TVoid {
    return this.Create({ ...options, [Kind]: 'Void', type: 'null' })
  }

  /** Use this function to return TSchema with static and params omitted */
  protected Create<T>(schema: Omit<T, 'static' | 'params'>): T {
    return schema as any
  }

  /** Clones the given value */
  protected Clone(value: any): any {
    const isObject = (object: any): object is Record<string | symbol, any> => typeof object === 'object' && object !== null && !Array.isArray(object)
    const isArray = (object: any): object is any[] => typeof object === 'object' && object !== null && Array.isArray(object)
    if (isObject(value)) {
      return Object.keys(value).reduce(
        (acc, key) => ({
          ...acc,
          [key]: this.Clone(value[key]),
        }),
        Object.getOwnPropertySymbols(value).reduce(
          (acc, key) => ({
            ...acc,
            [key]: this.Clone(value[key]),
          }),
          {},
        ),
      )
    } else if (isArray(value)) {
      return value.map((item: any) => this.Clone(item))
    } else {
      return value
    }
  }
}

/** JSON Schema Type Builder with Static Type Resolution for TypeScript */
export const Type = new TypeBuilder()
