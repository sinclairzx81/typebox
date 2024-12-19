/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import { Any, type TAny } from '../any/index'
import { Array, type TArray, type ArrayOptions } from '../array/index'
import { Boolean, type TBoolean } from '../boolean/index'
import { Composite, type TComposite } from '../composite/index'
import { Const, type TConst } from '../const/index'
import { Enum, type TEnum, type TEnumKey, type TEnumValue } from '../enum/index'
import { Exclude, type TExclude, type TExcludeFromMappedResult, type TExcludeFromTemplateLiteral } from '../exclude/index'
import { Extends, type TExtends, type TExtendsFromMappedKey, type TExtendsFromMappedResult } from '../extends/index'
import { Extract, type TExtract, type TExtractFromMappedResult, type TExtractFromTemplateLiteral } from '../extract/index'
import { Index, TIndex, type TIndexPropertyKeys, type TIndexFromMappedKey, type TIndexFromMappedResult, type TIndexFromComputed } from '../indexed/index'
import { Integer, type IntegerOptions, type TInteger } from '../integer/index'
import { Intersect, type IntersectOptions } from '../intersect/index'
import { Capitalize, Uncapitalize, Lowercase, Uppercase, type TCapitalize, type TUncapitalize, type TLowercase, type TUppercase } from '../intrinsic/index'
import { KeyOf, type TKeyOf } from '../keyof/index'
import { Literal, type TLiteral, type TLiteralValue } from '../literal/index'
import { Mapped, type TMappedFunction, type TMapped, type TMappedResult } from '../mapped/index'
import { Never, type TNever } from '../never/index'
import { Not, type TNot } from '../not/index'
import { Null, type TNull } from '../null/index'
import { type TMappedKey } from '../mapped/index'
import { Module, TModule } from '../module/index'
import { Number, type TNumber, type NumberOptions } from '../number/index'
import { Object, type TObject, type TProperties, type ObjectOptions } from '../object/index'
import { Omit, type TOmit } from '../omit/index'
import { Optional, type TOptionalWithFlag, type TOptionalFromMappedResult } from '../optional/index'
import { Partial, type TPartial, type TPartialFromMappedResult } from '../partial/index'
import { Pick, type TPick } from '../pick/index'
import { Readonly, type TReadonlyWithFlag, type TReadonlyFromMappedResult } from '../readonly/index'
import { ReadonlyOptional, type TReadonlyOptional } from '../readonly-optional/index'
import { Record, type TRecordOrObject } from '../record/index'
import { Recursive, type TRecursive, type TThis } from '../recursive/index'
import { Ref, type TRef, type TRefUnsafe } from '../ref/index'
import { Required, type TRequired, type TRequiredFromMappedResult } from '../required/index'
import { Rest, type TRest } from '../rest/index'
import { type TSchema, type SchemaOptions } from '../schema/index'
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
  // Modifiers
  // ------------------------------------------------------------------------
  /** `[Json]` Creates a Readonly and Optional property */
  public ReadonlyOptional<Type extends TSchema>(type: Type): TReadonlyOptional<Type> {
    return ReadonlyOptional(type)
  }
  /** `[Json]` Creates a Readonly property */
  public Readonly<Type extends TMappedResult, Flag extends boolean>(type: Type, enable: Flag): TReadonlyFromMappedResult<Type, Flag>
  /** `[Json]` Creates a Readonly property */
  public Readonly<Type extends TSchema, Flag extends boolean>(type: Type, enable: Flag): TReadonlyWithFlag<Type, Flag>
  /** `[Json]` Creates a Optional property */
  public Readonly<Type extends TMappedResult>(type: Type): TReadonlyFromMappedResult<Type, true>
  /** `[Json]` Creates a Readonly property */
  public Readonly<Type extends TSchema>(type: Type): TReadonlyWithFlag<Type, true>
  /** `[Json]` Creates a Readonly property */
  public Readonly(type: TSchema, enable?: boolean): any {
    return Readonly(type, enable ?? true)
  }
  /** `[Json]` Creates a Optional property */
  public Optional<Type extends TMappedResult, Flag extends boolean>(type: Type, enable: Flag): TOptionalFromMappedResult<Type, Flag>
  /** `[Json]` Creates a Optional property */
  public Optional<Type extends TSchema, Flag extends boolean>(type: Type, enable: Flag): TOptionalWithFlag<Type, Flag>
  /** `[Json]` Creates a Optional property */
  public Optional<Type extends TMappedResult>(type: Type): TOptionalFromMappedResult<Type, true>
  /** `[Json]` Creates a Optional property */
  public Optional<Type extends TSchema>(type: Type): TOptionalWithFlag<Type, true>
  /** `[Json]` Creates a Optional property */
  public Optional(type: TSchema, enable?: boolean): any {
    return Optional(type, enable ?? true)
  }
  // ------------------------------------------------------------------------
  // Types
  // ------------------------------------------------------------------------
  /** `[Json]` Creates an Any type */
  public Any(options?: SchemaOptions): TAny {
    return Any(options)
  }
  /** `[Json]` Creates an Array type */
  public Array<Type extends TSchema>(items: Type, options?: ArrayOptions): TArray<Type> {
    return Array(items, options)
  }
  /** `[Json]` Creates a Boolean type */
  public Boolean(options?: SchemaOptions): TBoolean {
    return Boolean(options)
  }
  /** `[Json]` Intrinsic function to Capitalize LiteralString types */
  public Capitalize<T extends TSchema>(schema: T, options?: SchemaOptions): TCapitalize<T> {
    return Capitalize(schema, options)
  }
  /** `[Json]` Creates a Composite object type */
  public Composite<T extends TSchema[]>(schemas: [...T], options?: ObjectOptions): TComposite<T> {
    return Composite(schemas, options) // (error) TS 5.4.0-dev - review TComposite implementation
  }
  /** `[JavaScript]` Creates a readonly const type from the given value. */
  public Const</* const (not supported in 4.0) */ T>(value: T, options?: SchemaOptions): TConst<T> {
    return Const(value, options)
  }
  /** `[Json]` Creates a Enum type */
  public Enum<V extends TEnumValue, T extends Record<TEnumKey, V>>(item: T, options?: SchemaOptions): TEnum<T> {
    return Enum(item, options)
  }
  /** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
  public Exclude<L extends TMappedResult, R extends TSchema>(unionType: L, excludedMembers: R, options?: SchemaOptions): TExcludeFromMappedResult<L, R>
  /** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
  public Exclude<L extends TTemplateLiteral, R extends TSchema>(unionType: L, excludedMembers: R, options?: SchemaOptions): TExcludeFromTemplateLiteral<L, R>
  /** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
  public Exclude<L extends TSchema, R extends TSchema>(unionType: L, excludedMembers: R, options?: SchemaOptions): TExclude<L, R>
  /** `[Json]` Constructs a type by excluding from unionType all union members that are assignable to excludedMembers */
  public Exclude(unionType: TSchema, excludedMembers: TSchema, options?: SchemaOptions): any {
    return Exclude(unionType, excludedMembers, options)
  }
  /** `[Json]` Creates a Conditional type */
  public Extends<L extends TMappedResult, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions): TExtendsFromMappedResult<L, R, T, F>
  /** `[Json]` Creates a Conditional type */
  public Extends<L extends TMappedKey, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions): TExtendsFromMappedKey<L, R, T, F>
  /** `[Json]` Creates a Conditional type */
  public Extends<L extends TSchema, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions): TExtends<L, R, T, F>
  /** `[Json]` Creates a Conditional type */
  public Extends<L extends TSchema, R extends TSchema, T extends TSchema, F extends TSchema>(L: L, R: R, T: T, F: F, options?: SchemaOptions) {
    return Extends(L, R, T, F, options)
  }
  /** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
  public Extract<L extends TMappedResult, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtractFromMappedResult<L, R>
  /** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
  public Extract<L extends TTemplateLiteral, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtractFromTemplateLiteral<L, R>
  /** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
  public Extract<L extends TSchema, R extends TSchema>(type: L, union: R, options?: SchemaOptions): TExtract<L, R>
  /** `[Json]` Constructs a type by extracting from type all union members that are assignable to union */
  public Extract(type: TSchema, union: TSchema, options?: SchemaOptions): any {
    return Extract(type, union, options)
  }
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<Type extends TRef, Key extends TSchema>(type: Type, key: Key, options?: SchemaOptions): TIndexFromComputed<Type, Key>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<Type extends TSchema, Key extends TRef>(type: Type, key: Key, options?: SchemaOptions): TIndexFromComputed<Type, Key>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<Type extends TRef, Key extends TRef>(type: Type, key: Key, options?: SchemaOptions): TIndexFromComputed<Type, Key>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<Type extends TSchema, MappedResult extends TMappedResult>(type: Type, mappedResult: MappedResult, options?: SchemaOptions): TIndexFromMappedResult<Type, MappedResult>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<Type extends TSchema, MappedKey extends TMappedKey>(type: Type, mappedKey: MappedKey, options?: SchemaOptions): TIndexFromMappedKey<Type, MappedKey>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<Type extends TSchema, Key extends TSchema, PropertyKeys extends PropertyKey[] = TIndexPropertyKeys<Key>>(T: Type, K: Key, options?: SchemaOptions): TIndex<Type, PropertyKeys>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index<Type extends TSchema, PropertyKeys extends PropertyKey[]>(type: Type, propertyKeys: readonly [...PropertyKeys], options?: SchemaOptions): TIndex<Type, PropertyKeys>
  /** `[Json]` Returns an Indexed property type for the given keys */
  public Index(type: TSchema, key: any, options?: SchemaOptions): any {
    return Index(type, key, options)
  }
  /** `[Json]` Creates an Integer type */
  public Integer(options?: IntegerOptions): TInteger {
    return Integer(options)
  }
  /** `[Json]` Creates an Intersect type */
  public Intersect<Types extends TSchema[]>(types: [...Types], options?: IntersectOptions): Intersect<Types> {
    return Intersect(types, options)
  }
  /** `[Json]` Creates a KeyOf type */
  public KeyOf<Type extends TSchema>(type: Type, options?: SchemaOptions): TKeyOf<Type> {
    return KeyOf(type, options) as never
  }
  /** `[Json]` Creates a Literal type */
  public Literal<LiteralValue extends TLiteralValue>(literalValue: LiteralValue, options?: SchemaOptions): TLiteral<LiteralValue> {
    return Literal(literalValue, options)
  }
  /** `[Json]` Intrinsic function to Lowercase LiteralString types */
  public Lowercase<Type extends TSchema>(type: Type, options?: SchemaOptions): TLowercase<Type> {
    return Lowercase(type, options)
  }
  /** `[Json]` Creates a Mapped object type */
  public Mapped<K extends TSchema, I extends PropertyKey[] = TIndexPropertyKeys<K>, F extends TMappedFunction<I> = TMappedFunction<I>, R extends TMapped<I, F> = TMapped<I, F>>(key: K, map: F, options?: ObjectOptions): R
  /** `[Json]` Creates a Mapped object type */
  public Mapped<K extends PropertyKey[], F extends TMappedFunction<K> = TMappedFunction<K>, R extends TMapped<K, F> = TMapped<K, F>>(key: [...K], map: F, options?: ObjectOptions): R
  /** `[Json]` Creates a Mapped object type */
  public Mapped(key: any, map: TMappedFunction<any>, options?: ObjectOptions): any {
    return Mapped(key, map, options)
  }
  /** `[Json]` Creates a Type Definition Module. */
  public Module<Properties extends TProperties>(properties: Properties): TModule<Properties> {
    return Module(properties)
  }
  /** `[Json]` Creates a Never type */
  public Never(options?: SchemaOptions): TNever {
    return Never(options)
  }
  /** `[Json]` Creates a Not type */
  public Not<T extends TSchema>(type: T, options?: SchemaOptions): TNot<T> {
    return Not(type, options)
  }
  /** `[Json]` Creates a Null type */
  public Null(options?: SchemaOptions): TNull {
    return Null(options)
  }
  /** `[Json]` Creates a Number type */
  public Number(options?: NumberOptions): TNumber {
    return Number(options)
  }
  /** `[Json]` Creates an Object type */
  public Object<T extends TProperties>(properties: T, options?: ObjectOptions): TObject<T> {
    return Object(properties, options)
  }
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Omit<Type extends TSchema, Key extends PropertyKey[]>(type: Type, key: readonly [...Key], options?: SchemaOptions): TOmit<Type, Key>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Omit<Type extends TSchema, Key extends TSchema>(type: Type, key: Key, options?: SchemaOptions): TOmit<Type, Key>
  /** `[Json]` Constructs a type whose keys are omitted from the given type */
  public Omit(schema: TSchema, selector: any, options?: SchemaOptions): any {
    return Omit(schema, selector, options)
  }
  /** `[Json]` Constructs a type where all properties are optional */
  public Partial<MappedResult extends TMappedResult>(type: MappedResult, options?: SchemaOptions): TPartialFromMappedResult<MappedResult>
  /** `[Json]` Constructs a type where all properties are optional */
  public Partial<Type extends TSchema>(type: Type, options?: SchemaOptions): TPartial<Type>
  /** `[Json]` Constructs a type where all properties are optional */
  public Partial(type: TSchema, options?: SchemaOptions): any {
    return Partial(type, options)
  }
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<Type extends TSchema, Key extends PropertyKey[]>(type: Type, key: readonly [...Key], options?: SchemaOptions): TPick<Type, Key>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick<Type extends TSchema, Key extends TSchema>(type: Type, key: Key, options?: SchemaOptions): TPick<Type, Key>
  /** `[Json]` Constructs a type whose keys are picked from the given type */
  public Pick(type: any, key: any, options?: SchemaOptions): any {
    return Pick(type, key, options)
  }
  /** `[Json]` Creates a Record type */
  public Record<Key extends TSchema, Value extends TSchema>(key: Key, value: Value, options?: ObjectOptions): TRecordOrObject<Key, Value> {
    return Record(key, value, options)
  }
  /** `[Json]` Creates a Recursive type */
  public Recursive<T extends TSchema>(callback: (thisType: TThis) => T, options?: SchemaOptions): TRecursive<T> {
    return Recursive(callback, options)
  }

  /** `[Json]` Creates a Ref type.*/
  public Ref<Ref extends string>($ref: Ref, options?: SchemaOptions): TRef<Ref>
  /**
   * @deprecated `[Json]` Creates a Ref type. This signature was deprecated in 0.34.0 where Ref requires callers to pass
   * a `string` value for the reference (and not a schema).
   *
   * To adhere to the 0.34.0 signature, Ref implementations should be updated to the following.
   *
   * ```typescript
   * // pre-0.34.0
   *
   * const T = Type.String({ $id: 'T' })
   *
   * const R = Type.Ref(T)
   * ```
   * should be changed to the following
   *
   * ```typescript
   * // post-0.34.0
   *
   * const T = Type.String({ $id: 'T' })
   *
   * const R = Type.Unsafe<Static<typeof T>>(Type.Ref('T'))
   * ```
   * You can also create a generic function to replicate the pre-0.34.0 signature if required
   *
   * ```typescript
   * const LegacyRef = <T extends TSchema>(schema: T) => Type.Unsafe<Static<T>>(Type.Ref(schema.$id!))
   * ```
   */
  public Ref<Type extends TSchema>(type: Type, options?: SchemaOptions): TRefUnsafe<Type>
  /** `[Json]` Creates a Ref type. The referenced type must contain a $id */
  public Ref(...args: any[]): unknown {
    return Ref(args[0] as string, args[1])
  }
  /** `[Json]` Constructs a type where all properties are required */
  public Required<MappedResult extends TMappedResult>(type: MappedResult, options?: SchemaOptions): TRequiredFromMappedResult<MappedResult>
  /** `[Json]` Constructs a type where all properties are required */
  public Required<Type extends TSchema>(type: Type, options?: SchemaOptions): TRequired<Type>
  /** `[Json]` Constructs a type where all properties are required */
  public Required(type: TSchema, options?: SchemaOptions): any {
    return Required(type, options)
  }
  /** `[Json]` Extracts interior Rest elements from Tuple, Intersect and Union types */
  public Rest<Type extends TSchema>(type: Type): TRest<Type> {
    return Rest(type)
  }
  /** `[Json]` Creates a String type */
  public String(options?: StringOptions): TString {
    return String(options)
  }
  /** `[Json]` Creates a TemplateLiteral type from template dsl string */
  public TemplateLiteral<Syntax extends string>(syntax: Syntax, options?: SchemaOptions): TTemplateLiteralSyntax<Syntax>
  /** `[Json]` Creates a TemplateLiteral type */
  public TemplateLiteral<Kinds extends TTemplateLiteralKind[]>(kinds: [...Kinds], options?: SchemaOptions): TTemplateLiteral<Kinds>
  /** `[Json]` Creates a TemplateLiteral type */
  public TemplateLiteral(unresolved: TTemplateLiteralKind[] | string, options?: SchemaOptions) {
    return TemplateLiteral(unresolved as any, options)
  }
  /** `[Json]` Creates a Transform type */
  public Transform<Type extends TSchema>(type: Type): TransformDecodeBuilder<Type> {
    return Transform(type)
  }
  /** `[Json]` Creates a Tuple type */
  public Tuple<Types extends TSchema[]>(types: [...Types], options?: SchemaOptions): TTuple<Types> {
    return Tuple(types, options)
  }
  /** `[Json]` Intrinsic function to Uncapitalize LiteralString types */
  public Uncapitalize<Type extends TSchema>(type: Type, options?: SchemaOptions): TUncapitalize<Type> {
    return Uncapitalize(type, options)
  }
  /** `[Json]` Creates a Union type */
  public Union<Types extends TSchema[]>(types: [...Types], options?: SchemaOptions): Union<Types> {
    return Union(types, options)
  }
  /** `[Json]` Creates an Unknown type */
  public Unknown(options?: SchemaOptions): TUnknown {
    return Unknown(options)
  }
  /** `[Json]` Creates a Unsafe type that will infers as the generic argument T */
  public Unsafe<T>(options?: UnsafeOptions): TUnsafe<T> {
    return Unsafe(options)
  }
  /** `[Json]` Intrinsic function to Uppercase LiteralString types */
  public Uppercase<T extends TSchema>(schema: T, options?: SchemaOptions): TUppercase<T> {
    return Uppercase(schema, options)
  }
}
