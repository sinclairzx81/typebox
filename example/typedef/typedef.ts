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

export { Static, Evaluate, TSchema, PropertiesReduce, TReadonly, TReadonlyOptional, TOptional } from '@sinclair/typebox'
import * as Types from '@sinclair/typebox'

// --------------------------------------------------------------------------
// Utility Types
// --------------------------------------------------------------------------
export type Assert<T, U> = T extends U ? T : never
export type Base = { m: string, t: string }
export type Base16 = { m: 'F', t: '01', '0': '1', '1': '2', '2': '3', '3': '4', '4': '5', '5': '6', '6': '7', '7': '8', '8': '9', '9': 'A', 'A': 'B', 'B': 'C', 'C': 'D', 'D': 'E', 'E': 'F', 'F': '0' }
export type Base10 = { m: '9', t: '01', '0': '1', '1': '2', '2': '3', '3': '4', '4': '5', '5': '6', '6': '7', '7': '8', '8': '9', '9': '0' }
export type Reverse<T extends string> = T extends `${infer L}${infer R}` ? `${Reverse<R>}${L}` : T
export type Tick<T extends string, B extends Base> = T extends keyof B ? B[T] : never
export type Next<T extends string, B extends Base> = T extends Assert<B, Base>['m'] ? Assert<B, Base>['t'] : T extends `${infer L}${infer R}` ? L extends Assert<B, Base>['m'] ? `${Assert<Tick<L, B>, string>}${Next<R, B>}` : `${Assert<Tick<L, B>, string>}${R}` : never
export type Increment<T extends string, B extends Base = Base10> = Reverse<Next<Reverse<T>, B>>
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
type InferUnion<T extends TStruct[], D extends string, Index = string> = T extends [infer L, ...infer R]
  ? Types.Evaluate<{ [_ in D]: Index } & Types.Static<Types.AssertType<L>>> | InferUnion<Types.AssertRest<R>, D, Increment<Types.Assert<Index, string>>>
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
export interface TStruct<T extends TFields = TFields> extends Types.TSchema, StructOptions {
  [Types.Kind]: 'TypeDef:Struct'
  static: Types.PropertiesReduce<T, this['params']>
  optionalProperties: { [K in Types.Assert<OptionalKeys<T>, keyof T>]: T[K] }
  properties: { [K in Types.Assert<RequiredKeys<T>, keyof T>]: T[K] }
}
// --------------------------------------------------------------------------
// TTimestamp
// --------------------------------------------------------------------------
export interface TTimestamp extends Types.TSchema {
  [Types.Kind]: 'TypeDef:Timestamp'
  static: number
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
// ValueCheck
// --------------------------------------------------------------------------
export class ValueCheckError extends Error {
  constructor(public readonly schema: Types.TSchema) {
    super('ValueCheck: Unknown type')
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
    return IsInt(value, 0, Number.MAX_SAFE_INTEGER)
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
  // Types
  // ------------------------------------------------------------------------
  /** [Standard] Creates a Array type */
  public Array<T extends Types.TSchema>(elements: T): TArray<T> {
    return this.Create({ [Types.Kind]: 'TypeDef:Array', elements })
  }
  /** [Standard] Creates a Boolean type */
  public Boolean(): TBoolean {
    return this.Create({ [Types.Kind]: 'TypeDef:Boolean', type: 'boolean' })
  }
  /** [Standard] Creates a Enum type */
  public Enum<T extends string[]>(values: [...T]): TEnum<T> {
    return this.Create({ [Types.Kind]: 'TypeDef:Enum', enum: values })
  }
  /** [Standard] Creates a Float32 type */
  public Float32(): TFloat32 {
    return this.Create({ [Types.Kind]: 'TypeDef:Float32', type: 'float32' })
  }
  /** [Standard] Creates a Float64 type */
  public Float64(): TFloat64 {
    return this.Create({ [Types.Kind]: 'TypeDef:Float64', type: 'float64' })
  }
  /** [Standard] Creates a Int8 type */
  public Int8(): TInt8 {
    return this.Create({ [Types.Kind]: 'TypeDef:Int8', type: 'int8' })
  }
  /** [Standard] Creates a Int16 type */
  public Int16(): TInt16 {
    return this.Create({ [Types.Kind]: 'TypeDef:Int16', type: 'int16' })
  }
  /** [Standard] Creates a Int32 type */
  public Int32(): TInt32 {
    return this.Create({ [Types.Kind]: 'TypeDef:Int32', type: 'int32' })
  }
  /** [Standard] Creates a Uint8 type */
  public Uint8(): TUint8 {
    return this.Create({ [Types.Kind]: 'TypeDef:Uint8', type: 'uint8' })
  }
  /** [Standard] Creates a Uint16 type */
  public Uint16(): TUint16 {
    return this.Create({ [Types.Kind]: 'TypeDef:Uint16', type: 'uint16' })
  }
  /** [Standard] Creates a Uint32 type */
  public Uint32(): TUint32 {
    return this.Create({ [Types.Kind]: 'TypeDef:Uint32', type: 'uint32' })
  }
  /** [Standard] Creates a Record type */
  public Record<T extends Types.TSchema>(values: T): TRecord<T> {
    return this.Create({ [Types.Kind]: 'TypeDef:Record', values })
  }
  /** [Standard] Creates a String type */
  public String(): TString {
    return this.Create({ [Types.Kind]: 'TypeDef:String', type: 'string' })
  }
  /** [Standard] Creates a Struct type */
  public Struct<T extends TFields>(fields: T, options?: StructOptions): TStruct<T> {
    const optionalProperties = globalThis.Object.getOwnPropertyNames(fields).reduce((acc, key) => (Types.TypeGuard.TOptional(fields[key]) || Types.TypeGuard.TReadonlyOptional(fields[key]) ? { ...acc, [key]: fields[key] } : { ...acc }), {} as TFields)
    const properties = globalThis.Object.getOwnPropertyNames(fields).reduce((acc, key) => (Types.TypeGuard.TOptional(fields[key]) || Types.TypeGuard.TReadonlyOptional(fields[key]) ? { ...acc } : { ...acc, [key]: fields[key] }), {} as TFields)
    const optionalObject = globalThis.Object.getOwnPropertyNames(optionalProperties).length > 0 ? { optionalProperties: optionalProperties } : {}
    const requiredObject = globalThis.Object.getOwnPropertyNames(properties).length === 0 ? {} : { properties: properties }
    return this.Create({ ...options, [Types.Kind]: 'TypeDef:Struct', ...requiredObject, ...optionalObject })
  }
  /** [Standard] Creates a Union type */
  public Union<T extends TStruct<TFields>[], D extends string = 'type'>(structs: [...T], discriminator?: D): TUnion<T, D> {
    discriminator = (discriminator || 'type') as D
    if (structs.length === 0) throw new Error('TypeDefTypeBuilder: Union types must contain at least one struct')
    const mapping = structs.reduce((acc, current, index) => ({ ...acc, [index.toString()]: current }), {})
    return this.Create({ [Types.Kind]: 'TypeDef:Union', discriminator, mapping })
  }
  /** [Standard] Creates a Timestamp type */
  public Timestamp(): TTimestamp {
    return this.Create({ [Types.Kind]: 'TypeDef:Timestamp', type: 'timestamp' })
  }
}

/** JSON Type Definition Type Builder */
export const Type = new TypeDefTypeBuilder()

