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

export { type Static } from '@sinclair/typebox'
import { TypeBuilder, TypeRegistry, Kind, Static, TSchema } from '@sinclair/typebox'

export const Descriminator = Symbol.for('TypeBox:TypeDef:Descriminator')

// --------------------------------------------------------------------------
// TArray
// --------------------------------------------------------------------------
export interface TArray<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'TypeDef:Array'
  static: Static<T, this['params']>[]
  elements: T
}
// --------------------------------------------------------------------------
// TBoolean
// --------------------------------------------------------------------------
export interface TBoolean extends TSchema {
  [Kind]: 'TypeDef:Boolean'
  static: 'boolean'
  type: 'boolean'
}
// --------------------------------------------------------------------------
// TEnum
// --------------------------------------------------------------------------
export interface TEnum<T extends string[] = string[]> extends TSchema {
  [Kind]: 'TypeDef:Enum'
  static: T[number]
  enum: [...T]
}
// --------------------------------------------------------------------------
// TFloat32
// --------------------------------------------------------------------------
export interface TFloat32 extends TSchema  {
  [Kind]: 'TypeDef:Float32'
  type: 'float32'
  static: number
}
// --------------------------------------------------------------------------
// TFloat64
// --------------------------------------------------------------------------
export interface TFloat64 extends TSchema  {
  [Kind]: 'TypeDef:Float64'
  type: 'float64'
  static: number
}
// --------------------------------------------------------------------------
// TInt8
// --------------------------------------------------------------------------
export interface TInt8 extends TSchema  {
  [Kind]: 'TypeDef:Int8'
  type: 'int8'
  static: number
}
// --------------------------------------------------------------------------
// TInt16
// --------------------------------------------------------------------------
export interface TInt16 extends TSchema  {
  [Kind]: 'TypeDef:Int16'
  type: 'int16'
  static: number
}
// --------------------------------------------------------------------------
// TInt32
// --------------------------------------------------------------------------
export interface TInt32 extends TSchema  {
  [Kind]: 'TypeDef:Int32'
  type: 'int32'
  static: number
}
// --------------------------------------------------------------------------
// TUint8
// --------------------------------------------------------------------------
export interface TUint8 extends TSchema  {
  [Kind]: 'TypeDef:Uint8'
  type: 'uint8'
  static: number
}
// --------------------------------------------------------------------------
// TUint16
// --------------------------------------------------------------------------
export interface TUint16 extends TSchema  {
  [Kind]: 'TypeDef:Uint16'
  type: 'uint16'
  static: number
}
// --------------------------------------------------------------------------
// TUint32
// --------------------------------------------------------------------------
export interface TUint32 extends TSchema {
  [Kind]: 'TypeDef:Uint32'
  type: 'uint32'
  static: number
}
// --------------------------------------------------------------------------
// TProperties
// --------------------------------------------------------------------------
export type TProperties = Record<keyof any, TSchema>
// --------------------------------------------------------------------------
// TObject
// --------------------------------------------------------------------------
export interface TObject<T extends TProperties = TProperties, D extends string | undefined = undefined> extends TSchema {
  [Descriminator]: D
  [Kind]: 'TypeDef:Object'
  static: {[K in keyof T]: Static<T[K], this['params']> }
  properties: T
}
// --------------------------------------------------------------------------
// TRecord
// --------------------------------------------------------------------------
export interface TRecord<T extends TSchema = TSchema> extends TSchema {
  [Kind]: 'TypeDef:Record'
  static: Record<string, Static<T, this['params']>>
  values: T
}
// --------------------------------------------------------------------------
// TString
// --------------------------------------------------------------------------
export interface TString extends TSchema {
  [Kind]: 'TypeDef:String'
  static: string
}
// --------------------------------------------------------------------------
// TTimestamp
// --------------------------------------------------------------------------
export interface TTimestamp extends TSchema {
  [Kind]: 'TypeDef:Timestamp'
  static: number
}
// --------------------------------------------------------------------------
// TUnion
// --------------------------------------------------------------------------
export interface TUnion<T extends TObject[] = [], D extends string = string> extends TSchema {
  [Kind]: 'TypeDef:Union'
  discriminator: D, 
  mapping: T
}
// --------------------------------------------------------------------------
// TypeDefCheck
// --------------------------------------------------------------------------
export class TypeDefCheckUnionTypeError extends Error {
  constructor(public readonly schema: TSchema) {
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
    console.log('float32', value)
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
  function Object(schema: TObject, value: unknown): boolean {
    return IsObject(value) && globalThis.Object.getOwnPropertyNames(schema.properties).every(key => key in value && Visit(schema.properties[key], value[key]))
  }
  function Record(schema: TRecord, value: unknown): boolean {
    return IsObject(value) && globalThis.Object.getOwnPropertyNames(value).every(key => Visit(schema.values, value[key]))
  }
  function String(schema: TString, value: unknown): boolean {
    return typeof value === 'string'
  }
  function Timestamp(schema: TString, value: unknown): boolean {
    return IsInt(value, 0, Number.MAX_SAFE_INTEGER)
  }
  function Union(schema: TUnion, value: unknown): boolean {
    return false
  }
  function Visit(schema: TSchema, value: unknown): boolean {
    const anySchema = schema as any
    switch(anySchema[Kind]) {
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
      case 'TypeDef:Object': return Object(anySchema, value)
      case 'TypeDef:Record': return Record(anySchema, value)
      case 'TypeDef:String': return String(anySchema, value)
      case 'TypeDef:Timestamp': return Timestamp(anySchema, value)
      case 'TypeDef:Union': return Union(anySchema, value)
      default: throw new TypeDefCheckUnionTypeError(anySchema)
    }
  }
  export function Check(schema: TSchema, value: unknown): boolean {
    return Visit(schema, value)
  }
}
//export type StaticTypeDefUnion<D extends string, M extends Record<string, TUnsafe<any>>> = { [K in keyof M]: { [P in D]: K } & Static<M[K]> }[keyof M];
// --------------------------------------------------------------------------
// TypeRegistry
// --------------------------------------------------------------------------
TypeRegistry.Set<TArray>('TypeDef:Array', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Boolean', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Int8', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Int16', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Int32', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Uint8', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Uint16', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Uint32', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Object', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Record', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:String', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Timestamp', (schema, value) => TypeDefCheck.Check(schema, value))
TypeRegistry.Set<TArray>('TypeDef:Union', (schema, value) => TypeDefCheck.Check(schema, value))
// --------------------------------------------------------------------------
// TypeDefTypeBuilder
// --------------------------------------------------------------------------
export class TypeDefTypeBuilder extends TypeBuilder {
  /** `[Standard]` Creates a TypeDef Array type */
  public Array<T extends TSchema>(elements: T): TArray<T> {
    return this.Create({ [Kind]: 'TypeDef:Array', elements })
  }
  /** `[Standard]` Creates a TypeDef Boolean type */
  public Boolean(): TBoolean {
    return this.Create({ [Kind]: 'TypeDef:Boolean', type: 'boolean' })
  }
  /** `[Standard]` Creates a TypeDef Enum type */
  public Enum<T extends string[]>(values: [...T]): TEnum<T> {
    return this.Create({ [Kind]: 'TypeDef:Enum', enum: values })
  }
  /** `[Standard]` Creates a TypeDef Float32 type */
  public Float32(): TFloat32 {
    return this.Create({ [Kind]: 'TypeDef:Float32', type: 'float32' })
  }
  /** `[Standard]` Creates a TypeDef Float64 type */
  public Float64(): TFloat64 {
    return this.Create({ [Kind]: 'TypeDef:Float64', type: 'float64' })
  }
  /** `[Standard]` Creates a TypeDef Int8 type */
  public Int8(): TInt8 {
    return this.Create({ [Kind]: 'TypeDef:Int8', type: 'int8' })
  }
  /** `[Standard]` Creates a TypeDef Int16 type */
  public Int16(): TInt16 {
    return this.Create({ [Kind]: 'TypeDef:Int16', type: 'int16' })
  }
  /** `[Standard]` Creates a TypeDef Int32 type */
  public Int32(): TInt32 {
    return this.Create({ [Kind]: 'TypeDef:Int32', type: 'int32' })
  }
  /** `[Standard]` Creates a TypeDef Uint8 type */
  public Uint8(): TUint8 {
    return this.Create({ [Kind]: 'TypeDef:Uint8', type: 'uint8' })
  }
  /** `[Standard]` Creates a TypeDef Uint16 type */
  public Uint16(): TUint16 {
    return this.Create({ [Kind]: 'TypeDef:Uint16', type: 'uint16' })
  }
  /** `[Standard]` Creates a TypeDef Uint32 type */
  public Uint32(): TUint32 {
    return this.Create({ [Kind]: 'TypeDef:Uint32', type: 'uint32' })
  }
  /** `[Standard]` Creates a TypeDef Object type */
  public Object<T extends TProperties, D extends string>(properties: T, descriminator: D): TObject<T, D> {
    return this.Create({ [Kind]: 'TypeDef:Object', [Descriminator]: descriminator, properties })
  }
  /** `[Standard]` Creates a TypeDef Record type */
  public Record<T extends TSchema>(values: T): TRecord<T> {
    return this.Create({ [Kind]: 'TypeDef:Record',values })
  }
  /** `[Standard]` Creates a TypeDef String type */
  public String(): TString {
    return this.Create({ [Kind]: 'TypeDef:String',type: 'string' })
  }
  /** `[Standard]` Creates a TypeDef Timestamp type */
  public Timestamp(): TTimestamp {
    return this.Create({ [Kind]: 'TypeDef:Timestamp', type: 'timestamp' })
  }
  /** `[Standard]` Creates a TypeDef Union type */
  public Union<T extends TObject[]>(objects: T): TUnion<T> {
    //return this.Create({ [Kind]: 'TypeDef:Union', discriminator, mapping })
    throw 1
  }
}

/** JSON Type Definition Type Builder */
export const TypeDef = new TypeDefTypeBuilder()

