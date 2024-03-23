/*--------------------------------------------------------------------------

@sinclair/typebox/prototypes

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

import * as Type from '@sinclair/typebox'

// ------------------------------------------------------------------
// Schematics
// ------------------------------------------------------------------
const IsExact = (value: unknown, expect: unknown) => value === expect
const IsSValue = (value: unknown): value is SValue => Type.ValueGuard.IsString(value) || Type.ValueGuard.IsNumber(value) || Type.ValueGuard.IsBoolean(value)
const IsSEnum = (value: unknown): value is SEnum => Type.ValueGuard.IsObject(value) && Type.ValueGuard.IsArray(value.enum) && value.enum.every((value) => IsSValue(value))
const IsSAllOf = (value: unknown): value is SAllOf => Type.ValueGuard.IsObject(value) && Type.ValueGuard.IsArray(value.allOf)
const IsSAnyOf = (value: unknown): value is SAnyOf => Type.ValueGuard.IsObject(value) && Type.ValueGuard.IsArray(value.anyOf)
const IsSOneOf = (value: unknown): value is SOneOf => Type.ValueGuard.IsObject(value) && Type.ValueGuard.IsArray(value.oneOf)
const IsSTuple = (value: unknown): value is STuple => Type.ValueGuard.IsObject(value) && IsExact(value.type, 'array') && Type.ValueGuard.IsArray(value.items)
const IsSArray = (value: unknown): value is SArray => Type.ValueGuard.IsObject(value) && IsExact(value.type, 'array') && !Type.ValueGuard.IsArray(value.items) && Type.ValueGuard.IsObject(value.items)
const IsSConst = (value: unknown): value is SConst => Type.ValueGuard.IsObject(value) && Type.ValueGuard.IsObject(value['const'])
const IsSString = (value: unknown): value is SString => Type.ValueGuard.IsObject(value) && IsExact(value.type, 'string')
const IsSNumber = (value: unknown): value is SNumber => Type.ValueGuard.IsObject(value) && IsExact(value.type, 'number')
const IsSInteger = (value: unknown): value is SInteger => Type.ValueGuard.IsObject(value) && IsExact(value.type, 'integer')
const IsSBoolean = (value: unknown): value is SBoolean => Type.ValueGuard.IsObject(value) && IsExact(value.type, 'boolean')
const IsSNull = (value: unknown): value is SBoolean => Type.ValueGuard.IsObject(value) && IsExact(value.type, 'null')
const IsSProperties = (value: unknown): value is SProperties => Type.ValueGuard.IsObject(value)
// prettier-ignore
const IsSObject = (value: unknown): value is SObject => Type.ValueGuard.IsObject(value) && IsExact(value.type, 'object') && IsSProperties(value.properties) && (value.required === undefined || Type.ValueGuard.IsArray(value.required) && value.required.every((value: unknown) => Type.ValueGuard.IsString(value)))
type SValue = string | number | boolean
type SEnum = Readonly<{ enum: readonly SValue[] }>
type SAllOf = Readonly<{ allOf: readonly unknown[] }>
type SAnyOf = Readonly<{ anyOf: readonly unknown[] }>
type SOneOf = Readonly<{ oneOf: readonly unknown[] }>
type SProperties = Record<PropertyKey, unknown>
type SObject = Readonly<{ type: 'object'; properties: SProperties; required?: readonly string[] }>
type STuple = Readonly<{ type: 'array'; items: readonly unknown[] }>
type SArray = Readonly<{ type: 'array'; items: unknown }>
type SConst = Readonly<{ const: SValue }>
type SString = Readonly<{ type: 'string' }>
type SNumber = Readonly<{ type: 'number' }>
type SInteger = Readonly<{ type: 'integer' }>
type SBoolean = Readonly<{ type: 'boolean' }>
type SNull = Readonly<{ type: 'null' }>
// ------------------------------------------------------------------
// FromRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromRest<T extends readonly unknown[], Acc extends Type.TSchema[] = []> = (
  T extends readonly [infer L extends unknown, ...infer R extends unknown[]]
    ? TFromSchema<L> extends infer S extends Type.TSchema
      ? TFromRest<R, [...Acc, S]>
      : TFromRest<R, [...Acc]>
    : Acc
)
function FromRest<T extends readonly unknown[]>(T: T): TFromRest<T> {
  return T.map((L) => FromSchema(L)) as never
}
// ------------------------------------------------------------------
// FromEnumRest
// ------------------------------------------------------------------
// prettier-ignore
type TFromEnumRest<T extends readonly SValue[], Acc extends Type.TSchema[] = []> = (
  T extends readonly [infer L extends SValue, ...infer R extends SValue[]]
    ? TFromEnumRest<R, [...Acc, Type.TLiteral<L>]>
    : Acc
)
function FromEnumRest<T extends readonly SValue[]>(T: T): TFromEnumRest<T> {
  return T.map((L) => Type.Literal(L)) as never
}
// ------------------------------------------------------------------
// AllOf
// ------------------------------------------------------------------
// prettier-ignore
type TFromAllOf<T extends SAllOf> = (
  TFromRest<T['allOf']> extends infer Rest extends Type.TSchema[]
    ? Type.TIntersectEvaluated<Rest>
    : Type.TNever
)
function FromAllOf<T extends SAllOf>(T: T): TFromAllOf<T> {
  return Type.IntersectEvaluated(FromRest(T.allOf), T)
}
// ------------------------------------------------------------------
// AnyOf
// ------------------------------------------------------------------
// prettier-ignore
type TFromAnyOf<T extends SAnyOf> = (
  TFromRest<T['anyOf']> extends infer Rest extends Type.TSchema[]
    ? Type.TUnionEvaluated<Rest>
    : Type.TNever
)
function FromAnyOf<T extends SAnyOf>(T: T): TFromAnyOf<T> {
  return Type.UnionEvaluated(FromRest(T.anyOf), T)
}
// ------------------------------------------------------------------
// OneOf
// ------------------------------------------------------------------
// prettier-ignore
type TFromOneOf<T extends SOneOf> = (
  TFromRest<T['oneOf']> extends infer Rest extends Type.TSchema[]
    ? Type.TUnionEvaluated<Rest>
    : Type.TNever
)
function FromOneOf<T extends SOneOf>(T: T): TFromOneOf<T> {
  return Type.UnionEvaluated(FromRest(T.oneOf), T)
}
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
// prettier-ignore
type TFromEnum<T extends SEnum> = (
  TFromEnumRest<T['enum']> extends infer Elements extends Type.TSchema[]
    ? Type.TUnionEvaluated<Elements>
    : Type.TNever
)
function FromEnum<T extends SEnum>(T: T): TFromEnum<T> {
  return Type.UnionEvaluated(FromEnumRest(T.enum))
}
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
type TFromTuple<T extends STuple> = (
  TFromRest<T['items']> extends infer Elements extends Type.TSchema[]
    ? Type.TTuple<Elements>
    : Type.TTuple<[]>
)
// prettier-ignore
function FromTuple<T extends STuple>(T: T): TFromTuple<T> {
  return Type.Tuple(FromRest(T.items), T) as never
}
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
type TFromArray<T extends SArray> = (
  TFromSchema<T['items']> extends infer Items extends Type.TSchema
    ? Type.TArray<Items>
    : Type.TArray<Type.TUnknown>
)
// prettier-ignore
function FromArray<T extends SArray>(T: T): TFromArray<T> {
  return Type.Array(FromSchema(T.items), T) as never
}
// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
// prettier-ignore
type TFromConst<T extends SConst> = (
  Type.Ensure<Type.TLiteral<T['const']>>
)
function FromConst<T extends SConst>(T: T) {
  return Type.Literal(T.const, T)
}
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
type TFromPropertiesIsOptional<K extends PropertyKey, R extends string | unknown> = unknown extends R ? true : K extends R ? false : true
// prettier-ignore
type TFromProperties<T extends SProperties, R extends string | unknown> = Type.Evaluate<{
  -readonly [K in keyof T]: TFromPropertiesIsOptional<K, R> extends true
    ? Type.TOptional<TFromSchema<T[K]>>
    : TFromSchema<T[K]>
}>
// prettier-ignore
type TFromObject<T extends SObject> = (
  TFromProperties<T['properties'], Exclude<T['required'], undefined>[number]> extends infer Properties extends Type.TProperties
    ? Type.TObject<Properties>
    : Type.TObject<{}>
)
function FromObject<T extends SObject>(T: T): TFromObject<T> {
  const properties = globalThis.Object.getOwnPropertyNames(T.properties).reduce((Acc, K) => {
    return { ...Acc, [K]: T.required && T.required.includes(K) ? FromSchema(T.properties[K]) : Type.Optional(FromSchema(T.properties[K])) }
  }, {} as Type.TProperties)
  return Type.Object(properties, T) as never
}
// ------------------------------------------------------------------
// FromSchema
// ------------------------------------------------------------------
// prettier-ignore
export type TFromSchema<T> = (
  T extends SAllOf ? TFromAllOf<T> :
  T extends SAnyOf ? TFromAnyOf<T> :
  T extends SOneOf ? TFromOneOf<T> :
  T extends SEnum ? TFromEnum<T> :
  T extends SObject ? TFromObject<T> :
  T extends STuple ? TFromTuple<T> :
  T extends SArray ? TFromArray<T> :
  T extends SConst ? TFromConst<T> :
  T extends SString ? Type.TString :
  T extends SNumber ? Type.TNumber :
  T extends SInteger ? Type.TInteger :
  T extends SBoolean ? Type.TBoolean :
  T extends SNull ? Type.TNull :
  Type.TUnknown
)
/** Parses a TypeBox type from raw JsonSchema */
export function FromSchema<T>(T: T): TFromSchema<T> {
  // prettier-ignore
  return (
    IsSAllOf(T) ? FromAllOf(T) :
    IsSAnyOf(T) ? FromAnyOf(T) :
    IsSOneOf(T) ? FromOneOf(T) :
    IsSEnum(T) ? FromEnum(T) :
    IsSObject(T) ? FromObject(T) :
    IsSTuple(T) ? FromTuple(T) :
    IsSArray(T) ? FromArray(T) :
    IsSConst(T) ? FromConst(T) :
    IsSString(T) ? Type.String(T) :
    IsSNumber(T) ? Type.Number(T) :
    IsSInteger(T) ? Type.Integer(T) :
    IsSBoolean(T) ? Type.Boolean(T) :
    IsSNull(T) ? Type.Null(T) :
    Type.Unknown(T || {})
  ) as never
}
