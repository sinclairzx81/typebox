/*--------------------------------------------------------------------------

@sinclair/typebox/typedef

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

export { type Static, TSchema, PropertiesReduce, TReadonly, TReadonlyOptional, TOptional } from '@sinclair/typebox'
import * as Types from '@sinclair/typebox'

// --------------------------------------------------------------------------
// Symbols
// --------------------------------------------------------------------------
export const Name = Symbol.for('TypeBox:Name')
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
export interface TFloat32 extends Types.TSchema  {
  [Types.Kind]: 'TypeDef:Float32'
  type: 'float32'
  static: number
}
// --------------------------------------------------------------------------
// TFloat64
// --------------------------------------------------------------------------
export interface TFloat64 extends Types.TSchema  {
  [Types.Kind]: 'TypeDef:Float64'
  type: 'float64'
  static: number
}
// --------------------------------------------------------------------------
// TInt8
// --------------------------------------------------------------------------
export interface TInt8 extends Types.TSchema  {
  [Types.Kind]: 'TypeDef:Int8'
  type: 'int8'
  static: number
}
// --------------------------------------------------------------------------
// TInt16
// --------------------------------------------------------------------------
export interface TInt16 extends Types.TSchema  {
  [Types.Kind]: 'TypeDef:Int16'
  type: 'int16'
  static: number
}
// --------------------------------------------------------------------------
// TInt32
// --------------------------------------------------------------------------
export interface TInt32 extends Types.TSchema  {
  [Types.Kind]: 'TypeDef:Int32'
  type: 'int32'
  static: number
}
// --------------------------------------------------------------------------
// TUint8
// --------------------------------------------------------------------------
export interface TUint8 extends Types.TSchema  {
  [Types.Kind]: 'TypeDef:Uint8'
  type: 'uint8'
  static: number
}
// --------------------------------------------------------------------------
// TUint16
// --------------------------------------------------------------------------
export interface TUint16 extends Types.TSchema  {
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
  static: string
}
// --------------------------------------------------------------------------
// TStruct
// --------------------------------------------------------------------------
type OptionalKeys<T extends TFields> = { [K in keyof T]: T[K] extends (Types.TReadonlyOptional<T[K]> | Types.TOptional<T[K]>) ? T[K] : never }
type RequiredKeys<T extends TFields> = { [K in keyof T]: T[K] extends (Types.TReadonlyOptional<T[K]> | Types.TOptional<T[K]>) ? never : T[K] }
export interface StructOptions {
  additionalProperties?: boolean
}
export interface TStruct<D extends string = string, T extends TFields = TFields> extends Types.TSchema, StructOptions {
  [Name]: D
  [Types.Kind]: 'TypeDef:Struct'
  static: Types.PropertiesReduce<T, this['params']>
  optionalProperties: {[K in Types.Assert<OptionalKeys<T>, keyof T>]: T[K] }
  properties: {[K in Types.Assert<RequiredKeys<T>, keyof T>]: T[K] }
}
// --------------------------------------------------------------------------
// TTimestamp
// --------------------------------------------------------------------------
export interface TTimestamp extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Timestamp'
  static: number
}
// --------------------------------------------------------------------------
// TUnion
// --------------------------------------------------------------------------
export interface TUnion<D extends string = string, T extends TStruct[] = TStruct[]> extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Union'
  static: Types.Evaluate<{ [K in keyof T]: { [key in D]: T[K][typeof Name] } & Types.Static<T[K]> }[number]>
  discriminator: D, 
  mapping: T
}
// --------------------------------------------------------------------------
// TypeRegistry
// --------------------------------------------------------------------------
Types.TypeRegistry.Set<TArray>('TypeDef:Array', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Boolean', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Int8', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Int16', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Int32', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Uint8', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Uint16', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Uint32', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Record', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:String', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Struct', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Timestamp', (schema, value) => TypeDefCheck.Check(schema, value))
Types.TypeRegistry.Set<TArray>('TypeDef:Union', (schema, value) => TypeDefCheck.Check(schema, value))
// --------------------------------------------------------------------------
// TypeDefCheck
// --------------------------------------------------------------------------
export class TypeDefCheckUnionTypeError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('TypeDefCheck: Unknown type')
  }
}
export namespace TypeDefCheck {
  // ------------------------------------------------------------------------
  // Guards
  // ------------------------------------------------------------------------
  function IsObject(value: unknown): value is Record<keyof any, unknown> {
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
  function Struct(schema: TStruct, value: unknown): boolean {
    const optionalKeys = schema.optionalProperties === undefined ? [] : globalThis.Object.getOwnPropertyNames(schema.optionalProperties)
    const requiredKeys = schema.properties === undefined ? [] : globalThis.Object.getOwnPropertyNames(schema.properties)
    if(!(IsObject(value) && 
      optionalKeys.every(key => key in value ? Visit((schema.optionalProperties as any)[key], value[key]) : true) &&
      requiredKeys.every(key => key in value && Visit(((schema as any).properties[key] as any), value[key])))) return false
    if(schema.additionalProperties === true) return true
    const unknownKeys = globalThis.Object.getOwnPropertyNames(value)
    return unknownKeys.every(key => optionalKeys.includes(key) || requiredKeys.includes(key))
  }
  function Timestamp(schema: TString, value: unknown): boolean {
    return IsInt(value, 0, Number.MAX_SAFE_INTEGER)
  }
  function Union(schema: TUnion, value: unknown): boolean {
    return IsObject(value) && 
      schema.discriminator in value &&
      IsString(value[schema.discriminator]) &&
      value[schema.discriminator] as any in schema.mapping &&
      Visit(schema.mapping[value[schema.discriminator] as any], value)
  }
  function Visit(schema: Types.TSchema, value: unknown): boolean {
    const anySchema = schema as any
    switch(anySchema[Types.Kind]) {
      case 'TypeDef:Array': return Array(anySchema, value)
      case 'TypeDef:Boolean': return Boolean(anySchema, value)
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
      case 'TypeDef:Union': return Union(anySchema, value)
      default: throw new TypeDefCheckUnionTypeError(anySchema)
    }
  }
  export function Check(schema: Types.TSchema, value: unknown): boolean {
    return Visit(schema, value)
  }
}
// --------------------------------------------------------------------------
// TypeDefTypeBuilder
// --------------------------------------------------------------------------
export class TypeDefTypeBuilder extends Types.TypeBuilder {
  // ------------------------------------------------------------------------
  // Modifiers
  // ------------------------------------------------------------------------
  /** `[Modifier]` Creates a Optional property */
  public Optional<T extends Types.TSchema>(schema: T): Types.TOptional<T> {
    return { [Types.Modifier]: 'Optional', ...Types.TypeClone.Clone(schema, {}) }
  }
  /** `[Modifier]` Creates a ReadonlyOptional property */
  public ReadonlyOptional<T extends Types.TSchema>(schema: T): Types.TReadonlyOptional<T> {
    return { [Types.Modifier]: 'ReadonlyOptional', ...Types.TypeClone.Clone(schema, {}) }
  }
  /** `[Modifier]` Creates a Readonly object or property */
  public Readonly<T extends Types.TSchema>(schema: T): Types.TReadonly<T> {
    return { [Types.Modifier]: 'Readonly', ...schema }
  }
  // ------------------------------------------------------------------------
  // Modifiers
  // ------------------------------------------------------------------------
  /** `[Standard]` Creates a TypeDef Array type */
  public Array<T extends Types.TSchema>(elements: T): TArray<T> {
    return this.Create({ [Types.Kind]: 'TypeDef:Array', elements })
  }
  /** `[Standard]` Creates a TypeDef Boolean type */
  public Boolean(): TBoolean {
    return this.Create({ [Types.Kind]: 'TypeDef:Boolean', type: 'boolean' })
  }
  /** `[Standard]` Creates a TypeDef Enum type */
  public Enum<T extends string[]>(values: [...T]): TEnum<T> {
    return this.Create({ [Types.Kind]: 'TypeDef:Enum', enum: values })
  }
  /** `[Standard]` Creates a TypeDef Float32 type */
  public Float32(): TFloat32 {
    return this.Create({ [Types.Kind]: 'TypeDef:Float32', type: 'float32' })
  }
  /** `[Standard]` Creates a TypeDef Float64 type */
  public Float64(): TFloat64 {
    return this.Create({ [Types.Kind]: 'TypeDef:Float64', type: 'float64' })
  }
  /** `[Standard]` Creates a TypeDef Int8 type */
  public Int8(): TInt8 {
    return this.Create({ [Types.Kind]: 'TypeDef:Int8', type: 'int8' })
  }
  /** `[Standard]` Creates a TypeDef Int16 type */
  public Int16(): TInt16 {
    return this.Create({ [Types.Kind]: 'TypeDef:Int16', type: 'int16' })
  }
  /** `[Standard]` Creates a TypeDef Int32 type */
  public Int32(): TInt32 {
    return this.Create({ [Types.Kind]: 'TypeDef:Int32', type: 'int32' })
  }
  /** `[Standard]` Creates a TypeDef Uint8 type */
  public Uint8(): TUint8 {
    return this.Create({ [Types.Kind]: 'TypeDef:Uint8', type: 'uint8' })
  }
  /** `[Standard]` Creates a TypeDef Uint16 type */
  public Uint16(): TUint16 {
    return this.Create({ [Types.Kind]: 'TypeDef:Uint16', type: 'uint16' })
  }
  /** `[Standard]` Creates a TypeDef Uint32 type */
  public Uint32(): TUint32 {
    return this.Create({ [Types.Kind]: 'TypeDef:Uint32', type: 'uint32' })
  }
  /** `[Standard]` Creates a TypeDef Record type */
  public Record<T extends Types.TSchema>(values: T): TRecord<T> {
    return this.Create({ [Types.Kind]: 'TypeDef:Record',values })
  }
  /** `[Standard]` Creates a TypeDef String type */
  public String(): TString {
    return this.Create({ [Types.Kind]: 'TypeDef:String',type: 'string' })
  }  
  /** `[Standard]` Creates a TypeDef Struct type */
  public Struct<N extends string, T extends TFields>(name: N, fields: T, options?: StructOptions): TStruct<N, T> {
    const optionalProperties = globalThis.Object.getOwnPropertyNames(fields).reduce((acc, key) => (Types.TypeGuard.TOptional(fields[key]) || Types.TypeGuard.TReadonlyOptional(fields[key]) ? { ...acc, [key]: fields[key] } : { ...acc }), {} as TFields)
    const properties = globalThis.Object.getOwnPropertyNames(fields).reduce((acc, key) => (Types.TypeGuard.TOptional(fields[key]) || Types.TypeGuard.TReadonlyOptional(fields[key]) ? {... acc } : { ...acc, [key]: fields[key] }), {} as TFields)
    const optionalPropertiesObject = globalThis.Object.getOwnPropertyNames(optionalProperties).length > 0 ? { optionalProperties: optionalProperties } : {}
    const propertiesObject = globalThis.Object.getOwnPropertyNames(properties).length === 0 ? {} : { properties: properties }
    return this.Create({ ...options, [Types.Kind]: 'TypeDef:Struct', [Name]: name, ...propertiesObject, ...optionalPropertiesObject })
  }
  /** `[Standard]` Creates a TypeDef Timestamp type */
  public Timestamp(): TTimestamp {
    return this.Create({ [Types.Kind]: 'TypeDef:Timestamp', type: 'timestamp' })
  }

  /** `[Standard]` Creates a TypeDef Discriminated Union type */
  public Union<D extends string, T extends TStruct<string, TFields>[]>(discriminator: D, objects: [...T]): TUnion<D, T> {
    if(objects.length === 0) throw new Error('TypeDefTypeBuilder: Union types must have at least one object') 
    const exists = objects.every(object => typeof object[Name] === 'string')
    if(!exists) throw new Error('TypeDefTypeBuilder: All union objects MUST have a descriminator')
    const unique = objects.reduce((set, current) => set.add(current[Name]), new Set<string>())
    if(unique.size !== objects.length) throw new Error('TypeDefTypeBuilder: All union objects MUST unique descriminator strings')
    const mapping = objects.reduce((acc, current) => ({ ...acc, [current[Name]]: current  }), {})
    return this.Create({ [Types.Kind]: 'TypeDef:Union', discriminator, mapping })
  }
}

/** JSON Type Definition Type Builder */
export const Type = new TypeDefTypeBuilder()

