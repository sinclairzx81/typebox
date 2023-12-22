/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import { Any, type TAny } from '../any/index'
import { Array, type TArray, type ArrayOptions } from '../array/index'
import { Boolean, type TBoolean } from '../boolean/index'
import { Composite, type TComposite } from '../composite/index'
import { Const, type TConst } from '../const/index'
import { Deref, type TDeref } from '../deref/index'
import { Enum, type TEnum, type TEnumKey, type TEnumValue } from '../enum/index'
import { Exclude, type TExclude, type TExcludeFromMappedResult } from '../exclude/index'
import { Extends, type TExtends, type TExtendsFromMappedKey, type TExtendsFromMappedResult } from '../extends/index'
import { Extract, type TExtract, type TExtractFromMappedResult } from '../extract/index'
import { Index, TIndex, type TIndexPropertyKeys, type TIndexFromMappedKey, type TIndexFromMappedResult } from '../indexed/index'
import { Integer, type IntegerOptions, type TInteger } from '../integer/index'
import { Intersect, type IntersectOptions } from '../intersect/index'
import { Capitalize, Uncapitalize, Lowercase, Uppercase, type TCapitalize, type TUncapitalize, type TLowercase, type TUppercase } from '../intrinsic/index'
import { KeyOf, type TKeyOf, type TKeyOfFromMappedResult } from '../keyof/index'
import { Literal, type TLiteral, type TLiteralValue } from '../literal/index'
import { Mapped, type TMappedFunction, type TMapped, type TMappedResult } from '../mapped/index'
import { Never, type TNever } from '../never/index'
import { Not, type TNot } from '../not/index'
import { Null, type TNull } from '../null/index'
import { type TMappedKey } from '../mapped/index'
import { Number, type TNumber, type NumberOptions } from '../number/index'
import { Object, type TObject, type TProperties, type ObjectOptions } from '../object/index'
import { Omit, type TOmit, type TOmitFromMappedKey, type TOmitFromMappedResult } from '../omit/index'
import { Optional, type TOptionalWithFlag, type TOptionalFromMappedResult } from '../optional/index'
import { Partial, type TPartial, type TPartialFromMappedResult } from '../partial/index'
import { Pick, type TPick, type TPickFromMappedKey, type TPickFromMappedResult } from '../pick/index'
import { Readonly, type TReadonlyWithFlag, type TReadonlyFromMappedResult } from '../readonly/index'
import { ReadonlyOptional, type TReadonlyOptional } from '../readonly-optional/index'
import { Record, type TRecordOrObject } from '../record/index'
import { Recursive, type TRecursive, type TThis } from '../recursive/index'
import { Ref, type TRef } from '../ref/index'
import { Required, type TRequired, type TRequiredFromMappedResult } from '../required/index'
import { Rest, type TRest } from '../rest/index'
import { type TSchema, type SchemaOptions } from '../schema/index'
import { Strict } from '../strict/index'
import { String, type TString, type StringOptions } from '../string/index'
import { TemplateLiteral, type TTemplateLiteral, type TTemplateLiteralKind, type TTemplateLiteralSyntax } from '../template-literal/index'
import { Transform, TransformDecodeBuilder } from '../transform/index'
import { Tuple, type TTuple } from '../tuple/index'
import { Union } from '../union/index'
import { Unknown, type TUnknown } from '../unknown/index'
import { Unsafe, type TUnsafe, type UnsafeOptions } from '../unsafe/index'

/** Json Type Builder with Static Resolution for TypeScript */
export class JsonTypeBuilder {
  // ------------------------------------------------------------------------
  // Strict
  // ------------------------------------------------------------------------
  /** `[Json]` Omits compositing symbols from this schema */
  public Strict<T extends TSchema>(schema: T): T {
    return Strict(schema)
  }
  // ------------------------------------------------------------------------
  // Modifiers
  // ------------------------------------------------------------------------
  /** `[Json]` Creates a Readonly and Optional property */
  public ReadonlyOptional<T extends TSchema>(schema: T): TReadonlyOptional<T> {
    return ReadonlyOptional(schema)
  }
  /** `[Json]` Creates a Readonly property */
  public Readonly<T extends TMappedResult, F extends boolean>(schema: T, enable: F): TReadonlyFromMappedResult<T, F>
  /** `[Json]` Creates a Readonly property */
  public Readonly<T extends TSchema, F extends boolean>(schema: T, enable: F): TReadonlyWithFlag<T, F>
  /** `[Json]` Creates a Optional property */
  public Readonly<T extends TMappedResult>(schema: T): TReadonlyFromMappedResult<T, true>
  /** `[Json]` Creates a Readonly property */
  public Readonly<T extends TSchema>(schema: T): TReadonlyWithFlag<T, true>
  /** `[Json]` Creates a Readonly property */
  public Readonly(schema: TSchema, enable?: boolean): any {
    return Readonly(schema, enable ?? true)
  }
  /** `[Json]` Creates a Optional property */
  public Optional<T extends TMappedResult, F extends boolean>(schema: T, enable: F): TOptionalFromMappedResult<T, F>
  /** `[Json]` Creates a Optional property */
  public Optional<T extends TSchema, F extends boolean>(schema: T, enable: F): TOptionalWithFlag<T, F>
  /** `[Json]` Creates a Optional property */
  public Optional<T extends TMappedResult>(schema: T): TOptionalFromMappedResult<T, true>
  /** `[Json]` Creates a Optional property */
  public Optional<T extends TSchema>(schema: T): TOptionalWithFlag<T, true>
  /** `[Json]` Creates a Optional property */
  public Optional(schema: TSchema, enable?: boolean): any {
    return Optional(schema, enable ?? true)
  }
  // ------------------------------------------------------------------------
  // Types
  // ------------------------------------------------------------------------
  /** `[Json]` Creates an Any type */
  public Any(options: SchemaOptions = {}): TAny {
    return Any(options)
  }
  /** `[Json]` Creates an Array type */
  public Array<T extends TSchema>(schema: T, options: ArrayOptions = {}): TArray<T> {
    return Array(schema, options)
  }
  /** `[Json]` Creates a Boolean type */
  public Boolean(options: SchemaOptions = {}): TBoolean {
    return Boolean(options)
  }
  /** `[Json]` Intrinsic function to Capitalize LiteralString types */
  public Capitalize<T extends TSchema>(schema: T, options: SchemaOptions = {}): TCapitalize<T> {
    return Capitalize(schema, options)
  }
  /** `[Json]` Creates a Composite object type */
  public Composite<T extends TObject[]>(objects: [...T], options?: ObjectOptions): TComposite<T> {
    return Composite(objects, options) as any // (error) TS 5.4.0-dev - review TComposite implementation
  }
  /** `[JavaScript]` Creates a readonly const type from the given value. */
  public Const</* const (not supported in 4.0) */ T>(value: T, options: SchemaOptions = {}): TConst<T> {
    return Const(value, options)
  }
  /** `[Json]` Creates a dereferenced type */
  public Deref<T extends TSchema>(schema: T, references: TSchema[]): TDeref<T> {
    return Deref(schema, references)
  }
  /** `[Json]` Creates a Enum type */
  public Enum<V extends TEnumValue, T extends Record<TEnumKey, V>>(item: T, options: SchemaOptions = {}): TEnum<T> {
    return Enum(item, options)
  }
  /** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
  public Exclude<L extends TMappedResult, R extends TSchema>(unionType: L, excludedMembers: R, options?: SchemaOptions): TExcludeFromMappedResult<L, R>
  /** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
  public Exclude<L extends TSchema, R extends TSchema>(unionType: L, excludedMembers: R, options?: SchemaOptions): TExclude<L, R>
  /** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
  public Exclude(unionType: TSchema, excludedMembers: TSchema, options: SchemaOptions = {}): any {
    return Exclude(unionType, excludedMembers, options)
  }
  /** `[Json]` Creates a Conditional type */
  public Extends<L extends TMappedResult, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions): TExtendsFromMappedResult<L, R, T, F>
  /** `[Json]` Creates a Conditional type */
  public Extends<L extends TMappedKey, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions): TExtendsFromMappedKey<L, R, T, F>
  /** `[Json]` Creates a Conditional type */
  public Extends<L extends TSchema, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions): TExtends<L, R, T, F>
  /** `[Json]` Creates a Conditional type */
  public Extends<L extends TSchema, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options: SchemaOptions = {}) {
    return Extends(L, R, T, F, options)
  }
  /** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
  public Extract<L extends TMappedResult, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtractFromMappedResult<L, R>
  /** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
  public Extract<L extends TSchema, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtract<L, R>
  /** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
  public Extract(type: TSchema, union: TSchema, options: SchemaOptions = {}): any {
    return Extract(type, union, options)
  }
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TSchema, K extends TMappedResult>(T: T, K: K, options?: SchemaOptions): TIndexFromMappedResult<T, K>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TSchema, K extends TMappedKey>(T: T, K: K, options?: SchemaOptions): TIndexFromMappedKey<T, K>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TSchema, K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>>(T: T, K: K, options?: SchemaOptions): TIndex<T, I>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<T extends TSchema, K extends PropertyKey[]>(T: T, K: readonly [...K], options?: SchemaOptions): TIndex<T, K>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index(schema: TSchema, unresolved: any, options: SchemaOptions = {}): any {
    return Index(schema, unresolved, options)
  }
  /** `[Json]` Creates an Integer type */
  public Integer(options: IntegerOptions = {}): TInteger {
    return Integer(options)
  }
  /** `[Json]` Creates an Intersect type */
  public Intersect<T extends TSchema[]>(T: [...T], options: IntersectOptions = {}): Intersect<T> {
    return Intersect(T, options)
  }
  /** `[Json]` Creates a KeyOf type */
  public KeyOf<T extends TMappedResult>(schema: T, options?: SchemaOptions): TKeyOfFromMappedResult<T>
  /** `[Json]` Creates a KeyOf type */
  public KeyOf<T extends TSchema>(schema: T, options?: SchemaOptions): TKeyOf<T>
  /** `[Json]` Creates a KeyOf type */
  public KeyOf(schema: TSchema, options: SchemaOptions = {}): any {
    return KeyOf(schema, options)
  }
  /** `[Json]` Creates a Literal type */
  public Literal<T extends TLiteralValue>(value: T, options: SchemaOptions = {}): TLiteral<T> {
    return Literal(value, options)
  }
  /** `[Json]` Intrinsic function to Lowercase LiteralString types */
  public Lowercase<T extends TSchema>(schema: T, options: SchemaOptions = {}): TLowercase<T> {
    return Lowercase(schema, options)
  }
  /** `[Json]` Creates a Mapped object type */
  public Mapped<K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>, F extends TMappedFunction<I> = TMappedFunction<I>, R extends TMapped<I, F> = TMapped<I, F>>(key: K, map: F, options?: ObjectOptions): R
  /** `[Json]` Creates a Mapped object type */
  public Mapped<K extends PropertyKey[], F extends TMappedFunction<K> = TMappedFunction<K>, R extends TMapped<K, F> = TMapped<K, F>>(key: [...K], map: F, options?: ObjectOptions): R
  /** `[Json]` Creates a Mapped object type */
  public Mapped(key: any, map: TMappedFunction<any>, options: ObjectOptions = {}): any {
    return Mapped(key, map, options)
  }
  /** `[Json]` Creates a Never type */
  public Never(options: SchemaOptions = {}): TNever {
    return Never(options)
  }
  /** `[Json]` Creates a Not type */
  public Not<T extends TSchema>(schema: T, options?: SchemaOptions): TNot<T> {
    return Not(schema, options)
  }
  /** `[Json]` Creates a Null type */
  public Null(options: SchemaOptions = {}): TNull {
    return Null(options)
  }
  /** `[Json]` Creates a Number type */
  public Number(options: NumberOptions = {}): TNumber {
    return Number(options)
  }
  /** `[Json]` Creates an Object type */
  public Object<T extends TProperties>(properties: T, options: ObjectOptions = {}): TObject<T> {
    return Object(properties, options)
  }
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit<T extends TMappedResult, K extends PropertyKey[]>(T: T, K: [...K], options?: SchemaOptions): TOmitFromMappedResult<T, K>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TMappedKey>(T: T, K: K): TOmitFromMappedKey<T, K>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>>(T: T, K: K, options?: SchemaOptions): TOmit<T, I>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit<T extends TSchema, K extends PropertyKey[]>(T: T, K: readonly [...K], options?: SchemaOptions): TOmit<T, K>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit(schema: TSchema, unresolved: any, options: SchemaOptions = {}): any {
    return Omit(schema, unresolved, options)
  }
  /** `[Json]` Constructs a type where all properties are optional */
  public Partial<T extends TMappedResult>(T: T, options?: ObjectOptions): TPartialFromMappedResult<T>
  /** `[Json]` Constructs a type where all properties are optional */
  public Partial<T extends TSchema>(schema: T, options?: ObjectOptions): TPartial<T>
  /** `[Json]` Constructs a type where all properties are optional */
  public Partial(schema: TSchema, options: ObjectOptions = {}): any {
    return Partial(schema, options)
  }
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<T extends TMappedResult, K extends PropertyKey[]>(T: T, K: [...K]): TPickFromMappedResult<T, K>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TMappedKey>(T: T, K: K): TPickFromMappedKey<T, K>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>>(T: T, K: K, options?: SchemaOptions): TPick<T, I>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<T extends TSchema, K extends PropertyKey[]>(T: T, K: readonly [...K], options?: SchemaOptions): TPick<T, K>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick(schema: TSchema, unresolved: any, options: SchemaOptions = {}): any {
    return Pick(schema, unresolved, options)
  }
  /** `[Json]` Creates a Record type */
  public Record<K extends TSchema, T extends TSchema>(key: K, schema: T, options: ObjectOptions = {}): TRecordOrObject<K, T> {
    return Record(key, schema)
  }
  /** `[Json]` Creates a Recursive type */
  public Recursive<T extends TSchema>(callback: (thisType: TThis) => T, options: SchemaOptions = {}): TRecursive<T> {
    return Recursive(callback, options)
  }
  /** `[Json]` Creates a Ref type. The referenced type must contain a $id */
  public Ref<T extends TSchema>(schema: T, options?: SchemaOptions): TRef<T>
  /** `[Json]` Creates a Ref type. */
  public Ref<T extends TSchema>($ref: string, options?: SchemaOptions): TRef<T>
  /** `[Json]` Creates a Ref type. */
  public Ref(unresolved: TSchema | string, options: SchemaOptions = {}) {
    return Ref(unresolved as any, options)
  }
  /** `[Json]` Constructs a type where all properties are required */
  public Required<T extends TMappedResult>(T: T, options?: ObjectOptions): TRequiredFromMappedResult<T>
  /** `[Json]` Constructs a type where all properties are required */
  public Required<T extends TSchema>(schema: T, options?: ObjectOptions): TRequired<T>
  /** `[Json]` Constructs a type where all properties are required */
  public Required(schema: TSchema, options: ObjectOptions = {}): any {
    return Required(schema, options)
  }
  /** `[Json]` Extracts interior Rest elements from Tuple, Intersect and Union types */
  public Rest<T extends TSchema>(schema: T): TRest<T> {
    return Rest(schema)
  }
  /** `[Json]` Creates a String type */
  public String(options: StringOptions = {}): TString {
    return String(options)
  }
  /** `[Json]` Creates a TemplateLiteral type from template dsl string */
  public TemplateLiteral<T extends string>(syntax: T, options?: SchemaOptions): TTemplateLiteralSyntax<T>
  /** `[Json]` Creates a TemplateLiteral type */
  public TemplateLiteral<T extends TTemplateLiteralKind[]>(kinds: [...T], options?: SchemaOptions): TTemplateLiteral<T>
  /** `[Json]` Creates a TemplateLiteral type */
  public TemplateLiteral(unresolved: TTemplateLiteralKind[] | string, options: SchemaOptions = {}) {
    return TemplateLiteral(unresolved as any, options)
  }
  /** `[Json]` Creates a Transform type */
  public Transform<I extends TSchema>(schema: I): TransformDecodeBuilder<I> {
    return Transform(schema)
  }
  /** `[Json]` Creates a Tuple type */
  public Tuple<T extends TSchema[]>(items: [...T], options: SchemaOptions = {}): TTuple<T> {
    return Tuple(items, options)
  }
  /** `[Json]` Intrinsic function to Uncapitalize LiteralString types */
  public Uncapitalize<T extends TSchema>(schema: T, options: SchemaOptions = {}): TUncapitalize<T> {
    return Uncapitalize(schema, options)
  }
  /** `[Json]` Creates a Union type */
  public Union<T extends TSchema[]>(schemas: [...T], options: SchemaOptions = {}): Union<T> {
    return Union(schemas, options)
  }
  /** `[Json]` Creates an Unknown type */
  public Unknown(options: SchemaOptions = {}): TUnknown {
    return Unknown(options)
  }
  /** `[Json]` Creates a Unsafe type that will infers as the generic argument T */
  public Unsafe<T>(options: UnsafeOptions = {}): TUnsafe<T> {
    return Unsafe(options)
  }
  /** `[Json]` Intrinsic function to Uppercase LiteralString types */
  public Uppercase<T extends TSchema>(schema: T, options: SchemaOptions = {}): TUppercase<T> {
    return Uppercase(schema, options)
  }
}
