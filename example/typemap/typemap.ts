/*--------------------------------------------------------------------------

@sinclair/typebox/typemap

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

import { TypeCompiler, ValueError, TypeCheck } from '@sinclair/typebox/compiler'
import { Value, ValueErrorIterator } from '@sinclair/typebox/value'
import { TypeSystem } from '@sinclair/typebox/system'
import * as T from '@sinclair/typebox'

// -------------------------------------------------------------------------------------------------
// Formats
// -------------------------------------------------------------------------------------------------
// prettier-ignore
TypeSystem.Format('email', (value) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(value))
// prettier-ignore
TypeSystem.Format('uuid', (value) => /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value))
// prettier-ignore
TypeSystem.Format('url', (value) => /^(?:https?|wss?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu.test(value))
// prettier-ignore
TypeSystem.Format('ipv6', (value) => /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i.test(value))
// prettier-ignore
TypeSystem.Format('ipv4', (value) => /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/.test(value))
// -------------------------------------------------------------------------------------------------
// Type Mapping
// -------------------------------------------------------------------------------------------------
export type TypeToType<T extends Type> = T extends Type<infer S> ? S : never
export type TypeToTuple<T extends Type[]> = {
  [K in keyof T]: T[K] extends Type<infer S> ? S : never
}
export type TypeToProperties<T extends PropertiesType> = T.Assert<
  {
    [K in keyof T]: T[K] extends Type<infer S> ? S : never
  },
  T.TProperties
>
export type PropertiesType = Record<keyof any, Type>
// prettier-ignore
export type TemplateLiteralType = 
  | Type<T.TUnion> 
  | Type<T.TLiteral> 
  | Type<T.TInteger>
  | Type<T.TTemplateLiteral> 
  | Type<T.TNumber> 
  | Type<T.TBigInt> 
  | Type<T.TString> 
  | Type<T.TBoolean> 
  | Type<T.TNever>;
// -------------------------------------------------------------------------------------------------
// Error
// -------------------------------------------------------------------------------------------------
export class TypeValueError extends Error {
  constructor(public readonly errors: ValueError[]) {
    super('TypeValueError: Invalid Value')
  }
}
// -------------------------------------------------------------------------------------------------
// Assert
// -------------------------------------------------------------------------------------------------
export interface TypeAssert<T extends T.TSchema> {
  check(value: unknown): value is T.Static<T>
  errors(value: unknown): ValueErrorIterator
  code(): string
}
export class TypeAssertDynamic<T extends T.TSchema> implements TypeAssert<T> {
  readonly #schema: T
  constructor(schema: T) {
    this.#schema = schema
  }
  public check(value: unknown): value is T.Static<T, []> {
    return Value.Check(this.#schema, [], value)
  }
  public errors(value: unknown): ValueErrorIterator {
    return Value.Errors(this.#schema, [], value)
  }
  public code(): string {
    return TypeCompiler.Code(this.#schema)
  }
}
export class TypeAssertCompiled<T extends T.TSchema> implements TypeAssert<T> {
  readonly #typecheck: TypeCheck<T>
  constructor(schema: T) {
    this.#typecheck = TypeCompiler.Compile(schema)
  }
  public check(value: unknown): value is T.Static<T, []> {
    return this.#typecheck.Check(value)
  }
  public errors(value: unknown): ValueErrorIterator {
    return this.#typecheck.Errors(value)
  }
  public code(): string {
    return this.#typecheck.Code()
  }
}
// -----------------------------------------------------------------------------------------
// Type
// -----------------------------------------------------------------------------------------
export class Type<T extends T.TSchema = T.TSchema> {
  #assert: TypeAssert<T>
  #schema: T
  constructor(schema: T) {
    this.#assert = new TypeAssertDynamic(schema)
    this.#schema = schema
  }
  /** Augments this type with the given options */
  public options(options: T.SchemaOptions) {
    return new Type({ ...this.schema, ...options } as T)
  }
  /** Maps a property as readonly and optional */
  public readonlyOptional(): Type<T.TReadonlyOptional<T>> {
    return new Type(T.Type.ReadonlyOptional(this.#schema))
  }
  /** Maps a property as optional */
  public optional(): Type<T.TOptional<T>> {
    return new Type(T.Type.Optional(this.#schema))
  }
  /** Maps a property as readonly */
  public readonly(): Type<T.TReadonly<T>> {
    return new Type(T.Type.Readonly(this.#schema))
  }
  /** Composes this type as a intersect with the given type */
  public and<U extends Type>(type: U): Type<T.TIntersect<[T, TypeToType<U>]>> {
    return new Type(T.Type.Intersect([this.#schema, type.schema()])) as any
  }
  /** Composes this type as a union with the given type */
  public or<U extends Type>(type: U): Type<T.TUnion<[T, TypeToType<U>]>> {
    return new Type(T.Type.Union([this.#schema, type.schema()])) as any
  }
  /** Picks the given properties from this type */
  public pick<K extends (keyof T.Static<T>)[]>(keys: readonly [...K]): Type<T.TPick<T, K[number]>>
  /** Picks the given properties from this type */
  public pick<K extends T.TUnion<T.TLiteral<string>[]>>(keys: K): Type<T.TPick<T, T.TUnionOfLiteral<K>>>
  /** Picks the given properties from this type */
  public pick<K extends T.TLiteral<string>>(key: K): Type<T.TPick<T, K['const']>>
  /** Picks the given properties from this type */
  public pick<K extends T.TNever>(key: K): Type<T.TPick<T, never>> {
    return new Type(T.Type.Pick(this.#schema, key))
  }
  /** Omits the given properties from this type */
  public omit<K extends (keyof T.Static<T>)[]>(keys: readonly [...K]): Type<T.TOmit<T, K[number]>>
  /** Omits the given properties from this type */
  public omit<K extends T.TUnion<T.TLiteral<string>[]>>(keys: K): Type<T.TOmit<T, T.TUnionOfLiteral<K>>>
  /** Omits the given properties from this type */
  public omit<K extends T.TLiteral<string>>(key: K): Type<T.TOmit<T, K['const']>>
  /** Omits the given properties from this type */
  public omit<K extends T.TNever>(key: K): Type<T.TOmit<T, never>> {
    return new Type(T.Type.Omit(this.#schema, key))
  }
  /** Applies partial to this type */
  public partial(): Type<T.TPartial<T>> {
    return new Type(T.Type.Partial(this.#schema))
  }
  /** Applies required to this type */
  public required(): Type<T.TRequired<T>> {
    return new Type(T.Type.Required(this.schema()))
  }
  /** Returns the keys of this type */
  public keyof(): Type<T.TKeyOf<T>> {
    return new Type(T.Type.KeyOf(this.schema()))
  }
  /** Checks this value and throws if invalid */
  public assert(value: unknown): void {
    if (this.#assert.check(value)) return
    throw new TypeValueError([...this.#assert.errors(value)])
  }
  /** Casts this value into this type */
  public cast(value: unknown): T.Static<T> {
    return Value.Cast(this.#schema, [], value)
  }
  /** Returns true if this value is valid for this type */
  public check(value: unknown): value is T.Static<T> {
    return this.#assert.check(value)
  }
  /** Returns the assertion code for this type */
  public code(): string {
    return this.#assert.code()
  }
  /** Creates a default value for this type */
  public create(): T.Static<T> {
    return Value.Create(this.#schema, [])
  }
  /** Sets a default value for this type */
  public default(value: T.Static<T>): this {
    return new Type({ ...this.#schema, default: value }) as this
  }
  /** Parses the given value and returns the valid if valid. Otherwise throw. */
  public parse(value: unknown): T.Static<T> {
    this.assert(value)
    return value
  }
  /** Compiles this type */
  public compile(): this {
    const compiled = new Type(this.#schema)
    compiled.#assert = new TypeAssertCompiled(this.#schema)
    return compiled as this
  }
  /** Returns the schema associated with this type */
  public schema(): T {
    return Value.Clone(this.#schema)
  }
}
// -----------------------------------------------------------------------------------------
// Array
// -----------------------------------------------------------------------------------------
export class ArrayType<T extends T.TArray<T.TSchema>> extends Type<T> {
  public maxItems(n: number) {
    return this.options({ maxItems: n })
  }
  public minItems(n: number) {
    return this.options({ minItems: n })
  }
  public length(n: number) {
    return this.options({ minItems: n, maxItems: n })
  }
  public uniqueItems() {
    return this.options({ uniqueItems: true })
  }
}
// -----------------------------------------------------------------------------------------
// Object
// -----------------------------------------------------------------------------------------
export class ObjectType<T extends T.TObject = T.TObject> extends Type<T> {
  public strict() {
    return this.options({ additionalProperties: false })
  }
}
// -----------------------------------------------------------------------------------------
// String
// -----------------------------------------------------------------------------------------
export class StringType extends Type<T.TString> {
  public minLength(n: number) {
    return this.options({ minLength: n })
  }
  public maxLength(n: number) {
    return this.options({ maxLength: n })
  }
  public length(n: number) {
    return this.options({ maxLength: n, minLength: n })
  }
  public email() {
    return this.options({ format: 'email' })
  }
  public uuid() {
    return this.options({ format: 'uuid' })
  }
  public url() {
    return this.options({ format: 'url' })
  }
  public ipv6() {
    return this.options({ format: 'ipv6' })
  }
  public ipv4() {
    return this.options({ format: 'ipv4' })
  }
}
// -----------------------------------------------------------------------------------------
// Number
// -----------------------------------------------------------------------------------------
export class NumberType extends Type<T.TNumber> {
  public exclusiveMinimum(n: number) {
    return this.options({ exclusiveMinimum: n })
  }
  public minimum(n: number) {
    return this.options({ minimum: n })
  }
  public exclusiveMaximum(n: number) {
    return this.options({ exclusiveMaximum: n })
  }
  public maximum(n: number) {
    return this.options({ maximum: n })
  }
  public multipleOf(n: number) {
    return this.options({ multipleOf: n })
  }
  public positive() {
    return this.options({ minimum: 0 })
  }
  public negative() {
    return this.options({ maximum: 0 })
  }
}
// -----------------------------------------------------------------------------------------
// Integer
// -----------------------------------------------------------------------------------------
export class IntegerType extends Type<T.TInteger> {
  public exclusiveMinimum(n: number) {
    return this.options({ exclusiveMinimum: n })
  }
  public minimum(n: number) {
    return this.options({ minimum: n })
  }
  public exclusiveMaximum(n: number) {
    return this.options({ exclusiveMaximum: n })
  }
  public maximum(n: number) {
    return this.options({ maximum: n })
  }
  public multipleOf(n: number) {
    return this.options({ multipleOf: n })
  }
  public positive() {
    return this.options({ minimum: 0 })
  }
  public negative() {
    return this.options({ maximum: 0 })
  }
}
// -----------------------------------------------------------------------------------------
// BigInt
// -----------------------------------------------------------------------------------------
export class BigIntType extends Type<T.TBigInt> {
  public exclusiveMinimum(n: bigint) {
    return this.options({ exclusiveMinimum: n })
  }
  public minimum(n: bigint) {
    return this.options({ minimum: n })
  }
  public exclusiveMaximum(n: bigint) {
    return this.options({ exclusiveMaximum: n })
  }
  public maximum(n: bigint) {
    return this.options({ maximum: n })
  }
  public multipleOf(n: bigint) {
    return this.options({ multipleOf: n })
  }
  public positive() {
    return this.options({ minimum: BigInt(0) })
  }
  public negative() {
    return this.options({ maximum: BigInt(0) })
  }
}
// -----------------------------------------------------------------------------------------
// Uint8Array
// -----------------------------------------------------------------------------------------
export class ModelUint8Array<T extends T.TUint8Array> extends Type<T> {
  public minByteLength(n: number) {
    return this.options({ minByteLength: n })
  }
  public maxByteLength(n: number) {
    return this.options({ maxByteLength: n })
  }
}
// -----------------------------------------------------------------------------------------
// Record
// -----------------------------------------------------------------------------------------
export class RecordType<T extends T.TSchema> extends Type<T.TRecord<T.TString, T>> {}
// -----------------------------------------------------------------------------------------
// Recursive
// -----------------------------------------------------------------------------------------
export class ThisType extends Type<T.TThis> {}
export class RecursiveType<T extends T.TSchema = T.TSchema> extends Type<T> {}
// -----------------------------------------------------------------------------------------
// ModelBuilder
// -----------------------------------------------------------------------------------------
export class ModelBuilder {
  /** Creates an any type */
  public any() {
    return new Type(T.Type.Any())
  }
  /** Creates an array type */
  public array<T extends Type>(type: T) {
    return new ArrayType(T.Type.Array(type.schema()))
  }
  /** Creates boolean type */
  public boolean() {
    return new Type(T.Type.Boolean())
  }
  /** Creates a bigint type */
  public bigint() {
    return new BigIntType(T.Type.BigInt())
  }
  /** Creates a date type */
  public date() {
    return new Type(T.Type.Date())
  }
  /** Creates a integer type */
  public integer() {
    return new IntegerType(T.Type.Integer())
  }
  /** Creates a number type */
  public number() {
    return new NumberType(T.Type.Number())
  }
  /** Creates a intersect type */
  public intersect<T extends Type[]>(types: [...T]): Type<T.TIntersect<TypeToTuple<T>>> {
    const internal = types.map((type) => type.schema())
    return new Type(T.Type.Intersect(internal)) as any
  }
  /** Creates an keyof type */
  public keyof<T extends Type>(type: T): Type<T.TKeyOf<TypeToType<T>>> {
    return new Type(T.Type.KeyOf(type.schema())) as any
  }
  /** Creates a literal type */
  public literal<T extends T.TLiteralValue>(value: T) {
    return new Type(T.Type.Literal(value))
  }
  /** Creates a never type */
  public never() {
    return new Type(T.Type.Never())
  }
  /** Creates a null type */
  public null() {
    return new Type(T.Type.Null())
  }
  /** Creates a object type */
  public object<T extends PropertiesType>(properties: T): Type<T.TObject<TypeToProperties<T>>> {
    const mapped = Object.keys(properties).reduce((acc, key) => ({ ...acc, [key]: properties[key].schema() }), {} as T.TProperties)
    return new ObjectType(T.Type.Object(mapped)) as any
  }
  /** Creates a partial type */
  public partial<T extends Type>(type: T): Type<TypeToType<T>> {
    return new Type(T.Type.Partial(type.schema())) as any
  }
  /** Creates a promise type */
  public promise<T extends Type>(type: T): Type<TypeToType<T>> {
    return new Type(T.Type.Promise(type.schema())) as any
  }
  /** Creates an unknown type */
  public unknown() {
    return new Type(T.Type.Unknown())
  }
  /** Creates a record type */
  public record<T extends Type>(type: T): RecordType<TypeToType<T>> {
    return new Type(T.Type.Record(T.Type.String(), type.schema())) as any
  }
  /** Creates a recursive type */
  public recursive<T extends T.TSchema>(callback: (This: ThisType) => Type<T>) {
    // prettier-ignore
    return new Type(T.Type.Recursive((This) => callback(new ThisType(This)).schema()))
  }
  /** Creates a required type */
  public required<T extends Type>(type: T) {
    return new Type(T.Type.Required(type.schema()))
  }
  /** Creates a string type */
  public string() {
    return new StringType(T.Type.String())
  }
  /** Creates a symbol type */
  public symbol() {
    return new Type(T.Type.Symbol())
  }
  /** Creates a template literal type */
  public templateLiteral<T extends TemplateLiteralType[]>(types: [...T]): Type<T.TTemplateLiteral<TypeToTuple<T>>> {
    const mapped = types.map((type) => type.schema())
    return new Type(T.Type.TemplateLiteral(mapped as any))
  }
  /** Creates a tuple type */
  public tuple<T extends Type[]>(types: [...T]): Type<T.TTuple<TypeToTuple<T>>> {
    return new Type(T.Type.Tuple(types.map((type) => type.schema()))) as any
  }
  /** Creates a uint8array type */
  public uint8array() {
    return new Type(T.Type.Uint8Array())
  }
  /** Creates an undefined type */
  public undefined() {
    return new Type(T.Type.Undefined())
  }
  /** Creates a union type */
  public union<T extends Type[]>(union: [...T]): Type<T.TUnion<TypeToTuple<T>>> {
    const mapped = union.map((type) => type.schema())
    return new Type(T.Type.Union(mapped)) as any
  }
}

export type Infer<T extends Type> = T extends Type<infer S> ? T.Static<S> : unknown

export const TypeBuilder = new ModelBuilder()

export default TypeBuilder
