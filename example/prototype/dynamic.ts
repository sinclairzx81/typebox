/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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

// deno-fmt-ignore-file
// deno-lint-ignore-file ban-types

import { Memory } from 'typebox/system'
import { Guard } from 'typebox/guard'
import * as S from 'typebox/schema'
import * as T from 'typebox'

// ------------------------------------------------------------------
// NonReadonlyTuple
// ------------------------------------------------------------------
type TNonReadonlyTuple<Types extends readonly unknown[]> = (
  Types extends [infer Left, ...infer Right extends unknown[]] 
  ? [TNonReadonly<Left>, ...TNonReadonlyTuple<Right>]
  : []
)
// ------------------------------------------------------------------
// NonReadonlyArray
// ------------------------------------------------------------------
type TNonReadonlyArray<Type extends unknown, Result extends unknown[] = (
  TNonReadonly<Type>[]
)> = Result
// ------------------------------------------------------------------
// NonReadonlyObject
// ------------------------------------------------------------------
type TNonReadonlyObject<Type extends object, Result extends Record<PropertyKey, unknown> = {
  -readonly [Key in keyof Type]: TNonReadonly<Type[Key]>
}> = Result
// ------------------------------------------------------------------
// NonReadonly
// ------------------------------------------------------------------
/**
 * Discards readonly modifiers on the given TypeScript. This is used to canonicalize
 * the type for static mapping, and where TypeBox types do not map over the readonly
 * form (but technically should)
 */
export type TNonReadonly<Type extends unknown> = (
  Type extends readonly [...infer Types extends unknown[]] ? TNonReadonlyTuple<Types> : 
  Type extends readonly (infer Type)[] ? TNonReadonlyArray<Type> : 
  Type extends object ? TNonReadonlyObject<Type> : 
  Type
)

// ------------------------------------------------------------------
// NonConstraints
// ------------------------------------------------------------------
const NonConstraints = [
  // Ignore
  '~kind', 
  '~optional', 
  '~readonly', 
  '~refine', 
  '~codec',
  // Mapped
  'allOf', 
  'anyOf', 
  'const', 
  'else', 
  'enum', 
  'if', 
  'items',
  'oneOf', 
  'patternProperties', 
  'prefixItems', 
  'properties',
  'required', 
  'then', 
  'type'
] as const

// ------------------------------------------------------------------
// IsNonConstraint
// ------------------------------------------------------------------
type TIsNonConstraint<Key extends string, Result extends boolean = (
  Key extends typeof NonConstraints[number] ? true : false
)> = Result
function IsNonConstraint<Key extends string>(key: Key): TIsNonConstraint<Key> {
  return NonConstraints.includes(key as never) as never
}
// ------------------------------------------------------------------
// Constraints
// ------------------------------------------------------------------
type TWithConstraintsReduce<Schema extends S.XSchemaObject, Keys extends string[], Result extends Record<PropertyKey, unknown> = {}> = (
  Keys extends [infer Left extends string, ...infer Right extends string[]]
    ? TIsNonConstraint<Left> extends true
      ? TWithConstraintsReduce<Schema, Right, Result>
      : TWithConstraintsReduce<Schema, Right, Memory.TAssign<Result, { [_ in Left]: Schema[Left & keyof Schema] }>>
  : Result
)
function WithConstraintsReduce<Schema extends S.XSchemaObject, Keys extends string[]>(schema: Schema, keys: [...Keys]) {
  return keys.reduce((result, key) => {
    const constraint = IsNonConstraint(key) ? {} : { [key]: schema[key as keyof Schema] }
    return Memory.Assign(result, constraint)
  }, {})
}
type TWithConstraints<Schema extends S.XSchemaObject,
  Keys extends string[] = T.TUnionToTuple<Extract<keyof Schema, string>>,
  Result extends Record<PropertyKey, unknown> = TWithConstraintsReduce<Schema, Keys>
> = Result
function WithConstraints<Schema extends S.XSchemaObject>(schema: Schema) {
  const keys = Guard.Keys(schema as Record<PropertyKey, unknown>)
  const result = WithConstraintsReduce(schema, keys)
  return result as never
}
// ------------------------------------------------------------------
// AllOf
// ------------------------------------------------------------------
type TFromAllOf<Schema extends S.XAllOf,
  Types extends T.TSchema[] = TFromSchemas<Schema['allOf']>,
  Result extends T.TSchema = T.TIntersect<Types>
> = Result
function FromAllOf<Schema extends S.XAllOf>(schema: Schema): TFromAllOf<Schema> {
  const types = FromSchemas(schema.allOf)
  return T.Intersect(types) as never
}
// ------------------------------------------------------------------
// AnyOf
// ------------------------------------------------------------------
type TFromAnyOf<Schema extends S.XAnyOf,
  Types extends T.TSchema[] = TFromSchemas<Schema['anyOf']>,
  Result extends T.TSchema = T.TUnion<Types>
> = Result
function FromAnyOf<Schema extends S.XAnyOf>(schema: Schema): TFromAnyOf<Schema> {
  const types = FromSchemas(schema.anyOf)
  return T.Union(types) as never
}
// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
type TFromConst<Schema extends S.XConst, Result extends T.TSchema = (
  Schema['const'] extends T.TLiteralValue 
    ? T.TLiteral<Schema['const']> 
    : T.TNever
)> = Result
function FromConst<Schema extends S.XConst>(schema: Schema): TFromConst<Schema> {
  return (T.IsLiteralValue(schema.const) ? T.Literal(schema.const) : T.Never()) as never
}
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
type TFromEnumFilter<Values extends unknown[], Result extends T.TEnumValue[] = []> = (
  Values extends [infer Left extends unknown, ...infer Right extends unknown[]]
    ? Left extends T.TEnumValue
      ? TFromEnumFilter<Right, [...Result, Left]>
      : TFromEnumFilter<Right, Result>
    : Result
)
function FromEnumFilter<Values extends unknown[]>(values: [...Values]): TFromEnumFilter<Values> {
  return values.filter(value => T.IsEnumValue(value)) as never
}
type TFromEnum<Schema extends S.XEnum,
  Values extends T.TEnumValue[] = TFromEnumFilter<Schema['enum']>,
  Result extends T.TSchema = T.TEnum<Values>
> = Result

function FromEnum<Schema extends S.XEnum>(schema: Schema): TFromEnum<Schema>  {
  const values = FromEnumFilter(schema.enum)
  const result = T.Enum(values)
  return result as never
}
// ------------------------------------------------------------------
// If
// ------------------------------------------------------------------
type TFromIf<Schema extends S.XIf, 
  IfType extends T.TSchema = TFromSchema<Schema['if']>,
  ThenType extends T.TSchema = Schema extends S.XThen ? TFromSchema<Schema['then']> : T.TUnknown,
  ElseType extends T.TSchema = Schema extends S.XElse ? TFromSchema<Schema['else']> : T.TUnknown,
  Result extends T.TSchema = T.TDependent<IfType, ThenType, ElseType>
> = Result
function FromIf<Schema extends S.XIf>(schema: Schema): TFromIf<Schema>  {
  const ifType = FromSchema(schema.if)
  const thenType = S.IsThen(schema) ? FromSchema(schema.then) : T.Unknown()
  const elseType = S.IsElse(schema) ? FromSchema(schema.else) : T.Unknown()
  return T.Dependent(ifType, thenType, elseType) as never
}
// ------------------------------------------------------------------
// Items
// ------------------------------------------------------------------
type TFromItemsSized<Schema extends S.XItemsSized,
  Types extends T.TSchema[] = TFromSchemas<Schema['items']>,
  Result extends T.TSchema = T.TTuple<Types>
> = Result
function FromItemsSized<Schema extends S.XItemsSized>(schema: Schema): TFromItemsSized<Schema> {
  const types = FromSchemas(schema.items)
  return T.Tuple(types) as never
}
type TFromItemsUnsized<Schema extends S.XItemsUnsized,
  Types extends T.TSchema = TFromSchema<Schema['items']>,
  Result extends T.TSchema = T.TArray<Types>
> = Result
function FromItemsUnsized<Schema extends S.XItemsUnsized>(schema: Schema): TFromItemsUnsized<Schema> {
  const items = FromSchema(schema.items)
  return T.Array(items) as never
}
type TFromItems<Schema extends S.XItems, Result extends T.TSchema = (
  Schema extends S.XItemsSized ? TFromItemsSized<Schema> : TFromItemsUnsized<Schema>
)> = Result
function FromItems<Schema extends S.XItems>(schema: Schema): TFromItems<Schema>  {
  const result = S.IsItemsSized(schema) ? FromItemsSized(schema) : FromItemsUnsized(schema) 
  return result as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
type TFromTypeName<TypeName extends string, Result extends T.TSchema = (
  TypeName extends 'array' ? T.TUnknown : // resolve via keywords
  TypeName extends 'object' ?  T.TUnknown : // resolve via keywords
  TypeName extends 'bigint' ? T.TBigInt :
  TypeName extends 'boolean' ? T.TBoolean :
  TypeName extends 'integer' ? T.TInteger :
  TypeName extends 'number' ? T.TNumber :
  TypeName extends 'null' ? T.TNull :
  TypeName extends 'string' ? T.TString :
  TypeName extends 'symbol' ? T.TSymbol :
  TypeName extends 'void' ? T.TVoid :
  T.TUnknown
)> = Result
function FromTypeName<TypeName extends string>(typeName: TypeName): TFromTypeName<TypeName> {
  return (
    Guard.IsEqual(typeName, 'array') ? T.Unknown() : // resolve via keywords
    Guard.IsEqual(typeName, 'object') ? T.Unknown() : // resolve via keywords
    Guard.IsEqual(typeName, 'bigint') ? T.BigInt({}) :
    Guard.IsEqual(typeName, 'boolean') ? T.Boolean() :
    Guard.IsEqual(typeName, 'integer') ? T.Integer() :
    Guard.IsEqual(typeName, 'number') ? T.Number() :
    Guard.IsEqual(typeName, 'null') ? T.Null() :
    Guard.IsEqual(typeName, 'string') ? T.String() :
    Guard.IsEqual(typeName, 'symbol') ? T.Symbol() :
    Guard.IsEqual(typeName, 'void') ? T.Void() :
    T.Unknown()
  ) as never
}
type TFromTypeNames<TypeNames extends string[], Result extends T.TSchema[] = []> = (
  TypeNames extends [infer Left extends string, ...infer Right extends string[]]
    ? TFromTypeNames<Right, [...Result, TFromTypeName<Left>]>
    : T.TUnion<Result>
)
function FromTypeNames<TypeNames extends string[]>(typeNames: [...TypeNames]): TFromTypeNames<TypeNames> {
  const anyOf = typeNames.map(typeName => FromTypeName(typeName)) as T.TSchema[]
  return T.Union(anyOf) as never
}
type TFromType<Schema extends S.XType, Result extends T.TSchema = (
 Schema['type'] extends [...infer TypeNames extends string[]] ? TFromTypeNames<TypeNames> :
 Schema['type'] extends infer TypeName extends string ? TFromTypeName<TypeName> :
 T.TUnknown
)> = Result
function FromType<Schema extends S.XType>(schema: Schema): TFromType<Schema> {
  return (
    Guard.IsArray(schema.type) ? FromTypeNames(schema.type) :
    Guard.IsString(schema.type) ? FromTypeName(schema.type) :
    T.Unknown()
  ) as never
}
// ------------------------------------------------------------------
// OneOf
// ------------------------------------------------------------------
type TFromOneOf<Schema extends S.XOneOf,
  Types extends T.TSchema[] = TFromSchemas<Schema['oneOf']>,
  Result extends T.TSchema = T.TUnion<Types>
> = Result
function FromOneOf<Schema extends S.XOneOf>(schema: Schema): TFromOneOf<Schema> {
  const types = FromSchemas(schema.oneOf)
  return T.Union(types) as never
}
// ------------------------------------------------------------------
// PatternProperties
// ------------------------------------------------------------------
type TFromPatternProperties<Schema extends S.XPatternProperties, 
  PatternProperties extends Record<string, S.XSchema> = Schema['patternProperties'],
  Keys extends string[] = T.TUnionToTuple<Extract<keyof PatternProperties, string>>,
  Pattern extends string = Keys extends [infer Key extends string] ? Key : T.TStringKey,
  Value extends T.TSchema = Pattern extends PatternProperties ? TFromSchema<PatternProperties[Pattern]> : T.TUnknown,
  Result extends T.TSchema = T.TRecord<Pattern, Value>
> = Result
function FromPatternProperties<Schema extends S.XPatternProperties>(schema: Schema): TFromPatternProperties<Schema> {
  const patternProperties = schema['patternProperties']
  const keys = Guard.Keys(patternProperties)
  const pattern = Guard.IsEqual(keys.length, 1) ? keys[0] : T.StringKey
  const value = Guard.HasPropertyKey(patternProperties, pattern) ? FromSchema(patternProperties[pattern]) : T.Unknown()
  return T.RecordFromPattern(pattern, value) as never
}
// ------------------------------------------------------------------
// PrefixItems
// ------------------------------------------------------------------
type TFromPrefixItems<Schema extends S.XPrefixItems,
  Types extends T.TSchema[] = TFromSchemas<Schema['prefixItems']>,
  Result extends T.TSchema = T.TTuple<Types>
> = Result
function FromPrefixItems<Schema extends S.XPrefixItems>(schema: Schema): TFromPrefixItems<Schema>  {
  const types = FromSchemas(schema.prefixItems)
  return T.Tuple(types) as never
}
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
type TFromProperties<Schema extends S.XProperties, 
  Properties extends T.TProperties = {
    [Key in keyof Schema['properties']]: T.TOptional<TFromSchema<Schema['properties'][Key]>>
  },
  Result extends T.TSchema = T.TObject<Properties>
> = Result
function FromProperties<Schema extends S.XProperties>(schema: Schema): TFromProperties<Schema> {
  const properties = Guard.Keys(schema.properties).reduce((result, key) => {
    return {...result, [key]: T.Optional(FromSchema(schema.properties[key])) }
  }, {}) as T.TProperties
  return T.Object(properties) as never
}
// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
type TFromRequiredReduce<Required extends string[], Result extends T.TProperties = {}> = (
  Required extends [infer Left extends string, ...infer Right extends string[]]
    ? TFromRequiredReduce<Right, Memory.TAssign<Result, { [_ in Left]: T.TUnknown }>>
    : Result
)
type TFromRequired<Schema extends S.XRequired,
  Properties extends T.TProperties = TFromRequiredReduce<Schema['required']>,
  Result extends T.TSchema = T.TObject<Properties>
> = Result
function FromRequired<Schema extends S.XRequired>(schema: Schema): TFromRequired<Schema> {
  const properties = schema.required.reduce((result, key) => {
    return { ...result, [key]: T.Unknown() }
  }, {}) as T.TProperties
  const result = T.Object(properties) 
  return result as never
}
// ------------------------------------------------------------------
// SchemaObject
// ------------------------------------------------------------------
type TFromSchemaObject<Schema extends S.XSchemaObject, 
  Intersection extends T.TSchema[] = [
    Schema extends S.XAllOf ? TFromAllOf<Schema> : T.TUnknown,
    Schema extends S.XAnyOf ? TFromAnyOf<Schema> : T.TUnknown,
    Schema extends S.XConst ? TFromConst<Schema> : T.TUnknown,
    Schema extends S.XEnum ? TFromEnum<Schema> : T.TUnknown,
    Schema extends S.XIf ? TFromIf<Schema> : T.TUnknown,
    Schema extends S.XItems ? TFromItems<Schema> : T.TUnknown,
    Schema extends S.XOneOf ? TFromOneOf<Schema> : T.TUnknown,
    Schema extends S.XPatternProperties ? TFromPatternProperties<Schema> : T.TUnknown,
    Schema extends S.XProperties ? TFromProperties<Schema> : T.TUnknown,
    Schema extends S.XPrefixItems ? TFromPrefixItems<Schema> : T.TUnknown,
    Schema extends S.XRequired ? TFromRequired<Schema> : T.TUnknown,
    Schema extends S.XType ? TFromType<Schema> : T.TUnknown,
  ],
  Evaluated extends T.TSchema = T.TEvaluateIntersect<Intersection>,
  Constraints extends T.TSchema = TWithConstraints<Schema>,
  Result extends T.TSchema = T.TWith<Evaluated, Constraints>
> = Result

function FromSchemaObject<Schema extends S.XSchemaObject>(schema: Schema): TFromSchemaObject<Schema> {
  const intersection = [
    S.IsAllOf(schema) ? FromAllOf(schema) : T.Unknown(),
    S.IsAnyOf(schema) ? FromAnyOf(schema) : T.Unknown(),
    S.IsConst(schema) ? FromConst(schema) : T.Unknown(),
    S.IsEnum(schema) ? FromEnum(schema) : T.Unknown(),
    S.IsIf(schema) ? FromIf(schema) : T.Unknown(),
    S.IsItems(schema) ? FromItems(schema) : T.Unknown(),
    S.IsOneOf(schema) ? FromOneOf(schema) : T.Unknown(),
    S.IsPatternProperties(schema) ? FromPatternProperties(schema) : T.Unknown(),
    S.IsProperties(schema) ? FromProperties(schema) : T.Unknown(),
    S.IsPrefixItems(schema) ? FromPrefixItems(schema) : T.Unknown(),
    S.IsRequired(schema) ? FromRequired(schema) : T.Unknown(),
    S.IsType(schema) ? FromType(schema) : T.Unknown(),
  ]
  const evaluated = T.EvaluateIntersect(intersection)
  const constraints = WithConstraints(schema)
  return T.With(evaluated, constraints) as never
}
// ------------------------------------------------------------------
// SchemaBoolean
// ------------------------------------------------------------------
type TFromSchemaBoolean<Schema extends S.XSchemaBoolean, Result extends T.TSchema = (
  Schema extends true ? T.TUnknown : T.TNever
)> = Result
function FromSchemaBoolean<Schema extends S.XSchemaBoolean>(schema: Schema): TFromSchemaBoolean<Schema> {
  const result = schema ? T.Unknown() : T.Never() 
  return result as never
}
// ------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------
type TFromSchemas<Schemas extends S.XSchema[], Result extends T.TSchema[] = []> = (
  Schemas extends [infer Left extends S.XSchema, ...infer Right extends S.XSchema[]]
    ? TFromSchemas<Right, [...Result, TFromSchema<Left>]>
    : Result
)
function FromSchemas<Schemas extends S.XSchema[]>(schemas: [...Schemas]): TFromSchemas<Schemas> {
  return schemas.map(schema => FromSchema(schema)) as never
}
// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
type TFromSchema<Schema extends S.XSchema, Result extends T.TSchema = (
  Schema extends S.XSchemaBoolean ? TFromSchemaBoolean<Schema> : 
  Schema extends S.XSchemaObject ? TFromSchemaObject<Schema> :
  T.TUnknown
)> = Result

function FromSchema<Schema extends S.XSchema>(schema: Schema): TFromSchema<Schema> {
  const result = (
    S.IsSchemaBoolean(schema) ? FromSchemaBoolean(schema) :
    S.IsSchemaObject(schema) ? FromSchemaObject(schema) :
    T.Unknown()
  )
  return result as never
}
// ------------------------------------------------------------------
// Dynamic
// ------------------------------------------------------------------
/** (Experimental) Dynamically load JSON Schema as a Type.* compositor type */
export type TDynamic<Schema extends unknown, 
  Normal extends unknown = TNonReadonly<Schema>,
  Result extends T.TSchema = Normal extends S.XSchema ?  TFromSchema<Normal>: T.TUnknown
> = Result
/** (Experimental) Dynamically load JSON Schema as a Type.* compositor type */
export function Dynamic<const Schema extends unknown>(schema: Schema): TDynamic<Schema> {
  const normal = schema
  const result = S.IsSchema(normal) ? FromSchema(normal) : T.Unknown()
  return result as never
}