/*--------------------------------------------------------------------------

@sinclair/typebox/typedef

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { SetErrorFunction, DefaultErrorFunction } from '@sinclair/typebox/errors'
import * as Types from '@sinclair/typebox/type'

// --------------------------------------------------------------------------
// Metadata
// --------------------------------------------------------------------------
export interface Metadata {
  [name: string]: any
}
// --------------------------------------------------------------------------
// TArray
// --------------------------------------------------------------------------
export interface TArray<T extends Types.TSchema = Types.TSchema> extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Array'
  static: Types.Static<T, this['params']>[]
  elements: T
}
// --------------------------------------------------------------------------
// TBoolean
// --------------------------------------------------------------------------
export interface TBoolean extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Boolean'
  static: 'boolean'
  type: 'boolean'
}
// --------------------------------------------------------------------------
// TUnion
// --------------------------------------------------------------------------
export type InferUnion<T extends TStruct[], D extends string, Index = string> = 
  T extends [infer L extends TStruct, ...infer R extends TStruct[]]
    ? Types.Evaluate<{ [_ in D]: Index } & Types.Static<L>> | InferUnion<R, D, Types.TIncrement<Types.Assert<Index, string>>>
    : never

export interface TUnion<T extends TStruct[] = TStruct[], D extends string = string> extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Union'
  static: InferUnion<T, D, '0'>
  discriminator: D,
  mapping: T
}
// --------------------------------------------------------------------------
// TEnum
// --------------------------------------------------------------------------
export interface TEnum<T extends string[] = string[]> extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Enum'
  static: T[number]
  enum: [...T]
}
// --------------------------------------------------------------------------
// TFloat32
// --------------------------------------------------------------------------
export interface TFloat32 extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Float32'
  type: 'float32'
  static: number
}
// --------------------------------------------------------------------------
// TFloat64
// --------------------------------------------------------------------------
export interface TFloat64 extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Float64'
  type: 'float64'
  static: number
}
// --------------------------------------------------------------------------
// TInt8
// --------------------------------------------------------------------------
export interface TInt8 extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Int8'
  type: 'int8'
  static: number
}
// --------------------------------------------------------------------------
// TInt16
// --------------------------------------------------------------------------
export interface TInt16 extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Int16'
  type: 'int16'
  static: number
}
// --------------------------------------------------------------------------
// TInt32
// --------------------------------------------------------------------------
export interface TInt32 extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Int32'
  type: 'int32'
  static: number
}
// --------------------------------------------------------------------------
// TUint8
// --------------------------------------------------------------------------
export interface TUint8 extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Uint8'
  type: 'uint8'
  static: number
}
// --------------------------------------------------------------------------
// TUint16
// --------------------------------------------------------------------------
export interface TUint16 extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Uint16'
  type: 'uint16'
  static: number
}
// --------------------------------------------------------------------------
// TUint32
// --------------------------------------------------------------------------
export interface TUint32 extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Uint32'
  type: 'uint32'
  static: number
}
// --------------------------------------------------------------------------
// TProperties
// --------------------------------------------------------------------------
export type TFields = Record<string, Types.TSchema>
// --------------------------------------------------------------------------
// TRecord
// --------------------------------------------------------------------------
export interface TRecord<T extends Types.TSchema = Types.TSchema> extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Record'
  static: Record<string, Types.Static<T, this['params']>>
  values: T
}
// --------------------------------------------------------------------------
// TString
// --------------------------------------------------------------------------
export interface TString extends Types.TSchema {
  [Types.Kind]: 'TypeDef:String'
  type: 'string'
  static: string
}
// --------------------------------------------------------------------------
// TStruct
// --------------------------------------------------------------------------
// used for structural type inference
type OptionalKeys<T extends TFields> = { [K in keyof T]: T[K] extends (Types.TOptional<T[K]>) ? T[K] : never }
type RequiredKeys<T extends TFields> = { [K in keyof T]: T[K] extends (Types.TOptional<T[K]>) ? never : T[K] }
// static inference
type ReadonlyOptionalPropertyKeys<T extends TFields> = { [K in keyof T]: T[K] extends Types.TReadonly<Types.TSchema> ? (T[K] extends Types.TOptional<T[K]> ? K : never) : never }[keyof T]
type ReadonlyPropertyKeys<T extends TFields> = { [K in keyof T]: T[K] extends Types.TReadonly<Types.TSchema> ? (T[K] extends Types.TOptional<T[K]> ? never : K) : never }[keyof T]
type OptionalPropertyKeys<T extends TFields> = { [K in keyof T]: T[K] extends Types.TOptional<Types.TSchema> ? (T[K] extends Types.TReadonly<T[K]> ? never : K) : never }[keyof T]
type RequiredPropertyKeys<T extends TFields> = keyof Omit<T, ReadonlyOptionalPropertyKeys<T> | ReadonlyPropertyKeys<T> | OptionalPropertyKeys<T>>
// prettier-ignore
type StructStaticProperties<T extends TFields, R extends Record<keyof any, unknown>> = Types.Evaluate<(
  Readonly<Partial<Pick<R, ReadonlyOptionalPropertyKeys<T>>>> &
  Readonly<Pick<R, ReadonlyPropertyKeys<T>>> &
  Partial<Pick<R, OptionalPropertyKeys<T>>> &
  Required<Pick<R, RequiredPropertyKeys<T>>>
)>
// prettier-ignore
export type StructStatic<T extends TFields, P extends unknown[]> = StructStaticProperties<T, {
  [K in keyof T]: Static<T[K], P>
}>
export interface StructMetadata extends Metadata {
  additionalProperties?: boolean
}
export interface TStruct<T extends TFields = TFields> extends Types.TSchema, StructMetadata {
  [Types.Kind]: 'TypeDef:Struct'
  static: StructStatic<T, this['params']>
  optionalProperties: { [K in Types.Assert<OptionalKeys<T>, keyof T>]: T[K] }
  properties: { [K in Types.Assert<RequiredKeys<T>, keyof T>]: T[K] }
}
// --------------------------------------------------------------------------
// TTimestamp
// --------------------------------------------------------------------------
export interface TTimestamp extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Timestamp'
  type: 'timestamp'
  static: string
}
// --------------------------------------------------------------------------
// Static
// --------------------------------------------------------------------------
export type Static<T extends Types.TSchema, P extends unknown[] = []> = Types.Static<T, P>

// --------------------------------------------------------------------------
// TimestampFormat
// --------------------------------------------------------------------------
export namespace TimestampFormat {
  const DATE_TIME_SEPARATOR = /t|\s/i
  const TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i
  const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/
  const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  function IsLeapYear(year: number): boolean {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  }
  function IsDate(str: string): boolean {
    const matches: string[] | null = DATE.exec(str)
    if (!matches) return false
    const year: number = +matches[1]
    const month: number = +matches[2]
    const day: number = +matches[3]
    return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && IsLeapYear(year) ? 29 : DAYS[month])
  }
  function IsTime(str: string, strictTimeZone?: boolean): boolean {
    const matches: string[] | null = TIME.exec(str)
    if (!matches) return false
    const hr: number = +matches[1]
    const min: number = +matches[2]
    const sec: number = +matches[3]
    const tz: string | undefined = matches[4]
    const tzSign: number = matches[5] === '-' ? -1 : 1
    const tzH: number = +(matches[6] || 0)
    const tzM: number = +(matches[7] || 0)
    if (tzH > 23 || tzM > 59 || (strictTimeZone && !tz)) return false
    if (hr <= 23 && min <= 59 && sec < 60) return true
    const utcMin = min - tzM * tzSign
    const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0)
    return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61
  }
  function IsDateTime(value: string, strictTimeZone?: boolean): boolean {
    const dateTime: string[] = value.split(DATE_TIME_SEPARATOR)
    return dateTime.length === 2 && IsDate(dateTime[0]) && IsTime(dateTime[1], strictTimeZone)
  }
  export function Check(value: string): boolean {
    return IsDateTime(value)
  }
}
// --------------------------------------------------------------------------
// ValueCheck
// --------------------------------------------------------------------------
export class ValueCheckError extends Types.TypeBoxError {
  constructor(public readonly schema: Types.TSchema) {
    super('Unknown type')
  }
}
export namespace ValueCheck {
  // ------------------------------------------------------------------------
  // Guards
  // ------------------------------------------------------------------------
  function IsObject(value: unknown): value is Record<keyof any, any> {
    return typeof value === 'object' && value !== null && !globalThis.Array.isArray(value)
  }
  function IsArray(value: unknown): value is unknown[] {
    return globalThis.Array.isArray(value)
  }
  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }
  function IsInt(value: unknown, min: number, max: number): value is number {
    return typeof value === 'number' && globalThis.Number.isInteger(value) && value >= min && value < max
  }
  // ------------------------------------------------------------------------
  // Types
  // ------------------------------------------------------------------------
  function Array(schema: TArray, value: unknown): boolean {
    return IsArray(value) && value.every(value => Visit(schema.elements, value))
  }
  function Boolean(schema: TBoolean, value: unknown): boolean {
    return typeof value === 'boolean'
  }
  function Enum(schema: TEnum, value: unknown): boolean {
    return typeof value === 'string' && schema.enum.includes(value)
  }
  function Float32(schema: TFloat32, value: unknown): boolean {
    return typeof value === 'number'
  }
  function Float64(schema: TFloat64, value: unknown): boolean {
    return typeof value === 'number'
  }
  function Int8(schema: TInt8, value: unknown): boolean {
    return IsInt(value, -128, 127)
  }
  function Int16(schema: TInt16, value: unknown): boolean {
    return IsInt(value, -32_768, 32_767)
  }
  function Int32(schema: TInt32, value: unknown): boolean {
    return IsInt(value, -2_147_483_648, 2_147_483_647)
  }
  function Uint8(schema: TUint8, value: unknown): boolean {
    return IsInt(value, 0, 255)
  }
  function Uint16(schema: TUint16, value: unknown): boolean {
    return IsInt(value, 0, 65535)
  }
  function Uint32(schema: TUint32, value: unknown): boolean {
    return IsInt(value, 0, 4_294_967_295)
  }
  function Record(schema: TRecord, value: unknown): boolean {
    return IsObject(value) && globalThis.Object.getOwnPropertyNames(value).every(key => Visit(schema.values, value[key]))
  }
  function String(schema: TString, value: unknown): boolean {
    return typeof value === 'string'
  }
  function Struct(schema: TStruct, value: unknown, descriminator?: string): boolean {
    if (!IsObject(value)) return false
    const optionalKeys = schema.optionalProperties === undefined ? [] : globalThis.Object.getOwnPropertyNames(schema.optionalProperties)
    const requiredKeys = schema.properties === undefined ? [] : globalThis.Object.getOwnPropertyNames(schema.properties)
    const unknownKeys = globalThis.Object.getOwnPropertyNames(value)
    for (const requiredKey of requiredKeys) {
      if (!(requiredKey in value)) return false
      const requiredProperty = value[requiredKey]
      const requiredSchema = (schema as any).properties[requiredKey]
      if (!Visit(requiredSchema, requiredProperty)) return false
    }
    for (const optionalKey of optionalKeys) {
      if (!(optionalKey in value)) continue
      const optionalProperty = value[optionalKey]
      const optionalSchema = (schema as any).properties[optionalKey]
      if (!Visit(optionalSchema, optionalProperty)) return false
    }
    if (schema.additionalProperties === true) return true
    const knownKeys = [...optionalKeys, ...requiredKeys]
    for (const unknownKey of unknownKeys) if (!knownKeys.includes(unknownKey) && (descriminator !== undefined && unknownKey !== descriminator)) return false
    for (const knownKey of knownKeys) if (!unknownKeys.includes(knownKey)) return false
    return true
  }
  function Timestamp(schema: TString, value: unknown): boolean {
    return IsString(value) && TimestampFormat.Check(value)
  }
  function Union(schema: TUnion, value: unknown): boolean {
    if (!IsObject(value)) return false
    if (!(schema.discriminator in value)) return false
    if (!IsString(value[schema.discriminator])) return false
    if (!(value[schema.discriminator] in schema.mapping)) return false
    const struct = schema.mapping[value[schema.discriminator]] as TStruct
    return Struct(struct, value, schema.discriminator)
  }
  function Visit(schema: Types.TSchema, value: unknown): boolean {
    const anySchema = schema as any
    switch (anySchema[Types.Kind]) {
      case 'TypeDef:Array': return Array(anySchema, value)
      case 'TypeDef:Boolean': return Boolean(anySchema, value)
      case 'TypeDef:Union': return Union(anySchema, value)
      case 'TypeDef:Enum': return Enum(anySchema, value)
      case 'TypeDef:Float32': return Float32(anySchema, value)
      case 'TypeDef:Float64': return Float64(anySchema, value)
      case 'TypeDef:Int8': return Int8(anySchema, value)
      case 'TypeDef:Int16': return Int16(anySchema, value)
      case 'TypeDef:Int32': return Int32(anySchema, value)
      case 'TypeDef:Uint8': return Uint8(anySchema, value)
      case 'TypeDef:Uint16': return Uint16(anySchema, value)
      case 'TypeDef:Uint32': return Uint32(anySchema, value)
      case 'TypeDef:Record': return Record(anySchema, value)
      case 'TypeDef:String': return String(anySchema, value)
      case 'TypeDef:Struct': return Struct(anySchema, value)
      case 'TypeDef:Timestamp': return Timestamp(anySchema, value)
      default: throw new ValueCheckError(anySchema)
    }
  }
  export function Check<T extends Types.TSchema>(schema: T, value: unknown): value is Types.Static<T> {
    return Visit(schema, value)
  }
}
// --------------------------------------------------------------------------
// TypeGuard
// --------------------------------------------------------------------------
export namespace TypeGuard {
  // ------------------------------------------------------------------------
  // Guards
  // ------------------------------------------------------------------------
  function IsObject(value: unknown): value is Record<keyof any, unknown> {
    return typeof value === 'object'
  }
  function IsArray(value: unknown): value is unknown[] {
    return globalThis.Array.isArray(value)
  }
  function IsOptionalBoolean(value: unknown): value is boolean | undefined {
    return IsBoolean(value) || value === undefined
  }
  function IsBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }
  function IsString(value: unknown): value is string {
    return typeof value === 'string'
  }
  // ------------------------------------------------------------------------
  // Types
  // ------------------------------------------------------------------------
  export function TArray(schema: unknown): schema is TArray {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Array' && TSchema(schema['elements'])
  }
  export function TBoolean(schema: unknown): schema is TBoolean {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Boolean' && schema['type'] === 'boolean'
  }
  export function TUnion(schema: unknown): schema is TUnion {
    if(!(IsObject(schema) && schema[Types.Kind] === 'TypeDef:Union' && IsString(schema['discriminator']) && IsObject(schema['mapping']))) return false
    return globalThis.Object.getOwnPropertyNames(schema['mapping']).every(key => TSchema((schema['mapping'] as any)[key]))
  }
  export function TEnum(schema: unknown): schema is TEnum {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Enum' && IsArray(schema['enum']) && schema['enum'].every(item => IsString(item))
  }
  export function TFloat32(schema: unknown): schema is TFloat32 {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Float32' && schema['type'] === 'float32'
  }
  export function TFloat64(schema: unknown): schema is TFloat64 {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Float64' && schema['type'] === 'float64'
  }
  export function TInt8(schema: unknown): schema is TInt8 {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Int8' && schema['type'] === 'int8'
  }
  export function TInt16(schema: unknown): schema is TInt16 {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Int16' && schema['type'] === 'int16'
  }
  export function TInt32(schema: unknown): schema is TInt32 {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Int32' && schema['type'] === 'int32'
  }
  export function TUint8(schema: unknown): schema is TUint8 {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Uint8' && schema['type'] === 'uint8'
  }
  export function TUint16(schema: unknown): schema is TUint16 {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Uint16' && schema['type'] === 'uint16'
  }
  export function TUint32(schema: unknown): schema is TUint32 {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Uint32' && schema['type'] === 'uint32'
  }
  export function TRecord(schema: unknown): schema is TRecord {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Record' && TSchema(schema['values'])
  }
  export function TString(schema: unknown): schema is TString {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:String' && schema['type'] === 'string'
  }
  export function TStruct(schema: unknown): schema is TStruct {
    if(!(IsObject(schema) && schema[Types.Kind] === 'TypeDef:Struct' && IsOptionalBoolean(schema['additionalProperties']))) return false
    const optionalProperties = schema['optionalProperties']
    const requiredProperties = schema['properties']
    const optionalCheck = optionalProperties === undefined || IsObject(optionalProperties) && globalThis.Object.getOwnPropertyNames(optionalProperties).every(key => TSchema(optionalProperties[key]))
    const requiredCheck = requiredProperties === undefined || IsObject(requiredProperties) && globalThis.Object.getOwnPropertyNames(requiredProperties).every(key => TSchema(requiredProperties[key]))
    return optionalCheck && requiredCheck
  }
  export function TTimestamp(schema: unknown): schema is TTimestamp {
    return IsObject(schema) && schema[Types.Kind] === 'TypeDef:Timestamp' && schema['type'] === 'timestamp'
  }
  export function TKind(schema: unknown): schema is Types.TKind {
    return IsObject(schema) && Types.Kind in schema && typeof (schema as any)[Types.Kind] === 'string' // TS 4.1.5: any required for symbol indexer
  }
  export function TSchema(schema: unknown): schema is Types.TSchema {
    // prettier-ignore
    return (
      TArray(schema) || 
      TBoolean(schema) || 
      TUnion(schema) || 
      TEnum(schema) ||
      TFloat32(schema) ||
      TFloat64(schema) ||
      TInt8(schema) ||
      TInt16(schema) ||
      TInt32(schema) ||
      TUint8(schema) ||
      TUint16(schema) ||
      TUint32(schema) ||
      TRecord(schema) ||
      TString(schema) ||
      TStruct(schema) ||
      TTimestamp(schema) ||
      (TKind(schema) && Types.TypeRegistry.Has(schema[Types.Kind]))
    )
  }
}
// --------------------------------------------------------------------------
// TypeRegistry
// --------------------------------------------------------------------------
Types.TypeRegistry.Set<TArray>('TypeDef:Array', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TBoolean>('TypeDef:Boolean', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TUnion>('TypeDef:Union', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TInt8>('TypeDef:Int8', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TInt16>('TypeDef:Int16', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TInt32>('TypeDef:Int32', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TUint8>('TypeDef:Uint8', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TUint16>('TypeDef:Uint16', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TUint32>('TypeDef:Uint32', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TRecord>('TypeDef:Record', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TString>('TypeDef:String', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TStruct>('TypeDef:Struct', (schema, value) => ValueCheck.Check(schema, value))
Types.TypeRegistry.Set<TTimestamp>('TypeDef:Timestamp', (schema, value) => ValueCheck.Check(schema, value))
// --------------------------------------------------------------------------
// TypeSystemErrorFunction
// --------------------------------------------------------------------------
SetErrorFunction((error) => {
  switch(error.schema[Types.Kind]) {
    case 'TypeDef:Array': return 'Expected Array'
    case 'TypeDef:Boolean': return 'Expected Boolean'
    case 'TypeDef:Union': return 'Expected Union'
    case 'TypeDef:Int8': return 'Expected Int8'
    case 'TypeDef:Int16': return 'Expected Int16'
    case 'TypeDef:Int32': return 'Expected Int32'
    case 'TypeDef:Uint8': return 'Expected Uint8'
    case 'TypeDef:Uint16': return 'Expected Uint16'
    case 'TypeDef:Uint32': return 'Expected Uint32'
    case 'TypeDef:Record': return 'Expected Record'
    case 'TypeDef:String': return 'Expected String'
    case 'TypeDef:Struct': return 'Expected Struct'
    case 'TypeDef:Timestamp': return 'Expected Timestamp'
  }
  return DefaultErrorFunction(error)
})
// --------------------------------------------------------------------------
// TypeDefBuilder
// --------------------------------------------------------------------------
export class TypeDefBuilder {
  // ------------------------------------------------------------------------
  // Core
  // ------------------------------------------------------------------------
  protected Create(schema: Record<PropertyKey, any>, metadata: Record<keyof any, any>): any {
    const keys = globalThis.Object.getOwnPropertyNames(metadata)
    return keys.length > 0 ? { ...schema, metadata: { ...metadata } } : { ...schema }
  }
  /** [Standard] Removes compositing symbols from this schema */
  public Strict<T extends Types.TSchema>(schema: T): T {
    return JSON.parse(JSON.stringify(schema)) as T
  }
  // ------------------------------------------------------------------------
  // Modifiers
  // ------------------------------------------------------------------------
  /** `[Standard]` Creates an Optional property */
  public Optional<T extends Types.TSchema>(schema: T): Types.TOptional<T> {
    return this.Optional(schema)
  }
  /** `[Standard]` Creates a Readonly property */
  public Readonly<T extends Types.TSchema>(schema: T): Types.TReadonly<T> {
    return this.Readonly(schema)
  }
  // ------------------------------------------------------------------------
  // Types
  // ------------------------------------------------------------------------
  /** [Standard] Creates a Array type */
  public Array<T extends Types.TSchema>(elements: T, metadata: Metadata = {}): TArray<T> {
    return this.Create({ [Types.Kind]: 'TypeDef:Array', elements }, metadata)
  }
  /** [Standard] Creates a Boolean type */
  public Boolean(metadata: Metadata = {}): TBoolean {
    return this.Create({ [Types.Kind]: 'TypeDef:Boolean', type: 'boolean' }, metadata)
  }
  /** [Standard] Creates a Enum type */
  public Enum<T extends string[]>(values: [...T], metadata: Metadata = {}): TEnum<T> {
    return this.Create({[Types.Kind]: 'TypeDef:Enum', enum: values }, metadata )
  }
  /** [Standard] Creates a Float32 type */
  public Float32(metadata: Metadata = {}): TFloat32 {
    return this.Create({ [Types.Kind]: 'TypeDef:Float32', type: 'float32' }, metadata)
  }
  /** [Standard] Creates a Float64 type */
  public Float64(metadata: Metadata = {}): TFloat64 {
    return this.Create({  [Types.Kind]: 'TypeDef:Float64', type: 'float64' }, metadata)
  }
  /** [Standard] Creates a Int8 type */
  public Int8(metadata: Metadata = {}): TInt8 {
    return this.Create({ [Types.Kind]: 'TypeDef:Int8', type: 'int8' }, metadata)
  }
  /** [Standard] Creates a Int16 type */
  public Int16(metadata: Metadata = {}): TInt16 {
    return this.Create({ [Types.Kind]: 'TypeDef:Int16', type: 'int16' }, metadata)
  }
  /** [Standard] Creates a Int32 type */
  public Int32(metadata: Metadata = {}): TInt32 {
    return this.Create({ [Types.Kind]: 'TypeDef:Int32', type: 'int32' }, metadata)
  }
  /** [Standard] Creates a Uint8 type */
  public Uint8(metadata: Metadata = {}): TUint8 {
    return this.Create({ [Types.Kind]: 'TypeDef:Uint8', type: 'uint8' }, metadata)
  }
  /** [Standard] Creates a Uint16 type */
  public Uint16(metadata: Metadata = {}): TUint16 {
    return this.Create({ [Types.Kind]: 'TypeDef:Uint16', type: 'uint16' }, metadata)
  }
  /** [Standard] Creates a Uint32 type */
  public Uint32(metadata: Metadata = {}): TUint32 {
    return this.Create({ [Types.Kind]: 'TypeDef:Uint32', type: 'uint32' }, metadata)
  }
  /** [Standard] Creates a Record type */
  public Record<T extends Types.TSchema>(values: T, metadata: Metadata = {}): TRecord<T> {
    return this.Create({ [Types.Kind]: 'TypeDef:Record', values },metadata)
  }
  /** [Standard] Creates a String type */
  public String(metadata: Metadata = {}): TString {
    return this.Create({ [Types.Kind]: 'TypeDef:String', type: 'string' }, metadata)
  }
  /** [Standard] Creates a Struct type */
  public Struct<T extends TFields>(fields: T, metadata: StructMetadata = {}): TStruct<T> {
    const optionalProperties = globalThis.Object.getOwnPropertyNames(fields).reduce((acc, key) => (Types.TypeGuard.IsOptional(fields[key]) ? { ...acc, [key]: fields[key] } : { ...acc }), {} as TFields)
    const properties = globalThis.Object.getOwnPropertyNames(fields).reduce((acc, key) => (Types.TypeGuard.IsOptional(fields[key]) ? { ...acc } : { ...acc, [key]: fields[key] }), {} as TFields)
    const optionalObject = globalThis.Object.getOwnPropertyNames(optionalProperties).length > 0 ? { optionalProperties: optionalProperties } : {}
    const requiredObject = globalThis.Object.getOwnPropertyNames(properties).length === 0 ? {} : { properties: properties }
    return this.Create({ [Types.Kind]: 'TypeDef:Struct', ...requiredObject, ...optionalObject }, metadata)
  }
  /** [Standard] Creates a Union type */
  public Union<T extends TStruct<TFields>[], D extends string = 'type'>(structs: [...T], discriminator?: D): TUnion<T, D> {
    discriminator = (discriminator || 'type') as D
    if (structs.length === 0) throw new Error('TypeDefBuilder: Union types must contain at least one struct')
    const mapping = structs.reduce((acc, current, index) => ({ ...acc, [index.toString()]: current }), {})
    return this.Create({ [Types.Kind]: 'TypeDef:Union', discriminator, mapping }, {})
  }
  /** [Standard] Creates a Timestamp type */
  public Timestamp(metadata: Metadata = {}): TTimestamp {
    return this.Create({ [Types.Kind]: 'TypeDef:Timestamp', type: 'timestamp' }, metadata)
  }
}

/** JSON Type Definition Type Builder */
export const Type = new TypeDefBuilder()

