/*--------------------------------------------------------------------------

@sinclair/typebox/syntax

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import * as T from '@sinclair/typebox'

// ------------------------------------------------------------------
//
// Dereference
//
// Referential types pull from the Context or defer dereferencing
// for later execution. This overlaps with module dereferencing,
// where named identifiers in the syntax are deferred until
// instantiation. This code should be revised as part of a
// general-purpose Instantiate module (next revision)
//
// ------------------------------------------------------------------
// prettier-ignore
type TDereference<Context extends T.TProperties, Key extends string> = (
  Key extends keyof Context ? Context[Key] : T.TRef<Key>
)
// prettier-ignore
const Dereference = (context: T.TProperties, key: string): T.TSchema => {
  return key in context ? context[key] : T.Ref(key)
}

// ------------------------------------------------------------------
//
// Delimited
//
// Delimited sequences use an accumulated buffer to parse sequence
// tokens. This approach is more scalable than using a Union + Tuple
// + Epsilon pattern, as TypeScript can instantiate deeper when
// tail-call recursive accumulators are employed. However, this
// comes with a latent processing cost due to the need to decode
// the accumulated buffer.
//
// - Encoding: [[<Ident>, ','][], [<Ident>] | []]
//
// ------------------------------------------------------------------
// prettier-ignore
type TDelimitedDecode<Input extends ([unknown, unknown] | unknown)[], Result extends unknown[] = []> = (
  Input extends [infer Left, ...infer Right]
  ? Left extends [infer Item, infer _]
  ? TDelimitedDecode<Right, [...Result, Item]>
  : TDelimitedDecode<Right, [...Result, Left]>
  : Result
)
// prettier-ignore
type TDelimited<Input extends [unknown, unknown]> 
  = Input extends [infer Left extends unknown[], infer Right extends unknown[]]
  ? TDelimitedDecode<[...Left, ...Right]>
  : []
// prettier-ignore
const DelimitedDecode = (input: ([unknown, unknown] | unknown)[], result: unknown[] = []) => {
  return input.reduce<unknown[]>((result, left) => {
    return T.ValueGuard.IsArray(left) && left.length === 2
      ? [...result, left[0]]
      : [...result, left]
  }, [])
}
// prettier-ignore
const Delimited = (input: [unknown, unknown]) => {
  const [left, right] = input as [unknown[], unknown[]]
  return DelimitedDecode([...left, ...right])
}
// -------------------------------------------------------------------
// GenericReferenceParameterList: [[Type, ','][], [Type] | []]
// -------------------------------------------------------------------
// prettier-ignore
export type TGenericReferenceParameterListMapping<Input extends [unknown, unknown], Context extends T.TProperties>
  = TDelimited<Input>
// prettier-ignore
export function GenericReferenceParameterListMapping(input: [unknown, unknown], context: unknown) {
  return Delimited(input)
}
// -------------------------------------------------------------------
// GenericReference: [<Ident>, '<', GenericReferenceParameterList, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TGenericReferenceMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties,
  Result = Context extends T.TProperties
  ? Input extends [infer Reference extends string, '<', infer Args extends T.TSchema[], '>']
  ? T.TInstantiate<TDereference<Context, Reference>, Args>
  : never
  : never
> = Result
// prettier-ignore
export function GenericReferenceMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const type = Dereference(context as T.TProperties, input[0] as string)
  const args = input[2] as T.TSchema[]
  return T.Instantiate(type, args)
}
// -------------------------------------------------------------------
// GenericArgumentsList: [[<Ident>, ','][], [<Ident>] | []]
// -------------------------------------------------------------------
// prettier-ignore
export type TGenericArgumentsListMapping<Input extends [unknown, unknown], Context extends T.TProperties>
  = TDelimited<Input>
// prettier-ignore
export function GenericArgumentsListMapping(input: [unknown, unknown], context: unknown) {
  return Delimited(input)
}
// -------------------------------------------------------------------
// GenericArguments: ['<', GenericArgumentsList, '>']
// -------------------------------------------------------------------
// prettier-ignore
type GenericArgumentsContext<Arguments extends string[], Context extends T.TProperties, Result extends T.TProperties = {}> = (
  Arguments extends [...infer Left extends string[], infer Right extends string]
  ? GenericArgumentsContext<Left, Context, Result & { [_ in Right]: T.TArgument<Left['length']> }>
  : T.Evaluate<Result & Context>
)
// prettier-ignore
export type TGenericArgumentsMapping<Input extends [unknown, unknown, unknown], Context extends T.TProperties> =
  Input extends ['<', infer Arguments extends string[], '>']
  ? Context extends infer Context extends T.TProperties
  ? GenericArgumentsContext<Arguments, Context>
  : never
  : never
// ...
// prettier-ignore
const GenericArgumentsContext = (_arguments: string[], context: T.TProperties) => {
  return _arguments.reduce((result, arg, index) => {
    return { ...result, [arg]: T.Argument(index) }
  }, context)
}
// prettier-ignore
export function GenericArgumentsMapping(input: [unknown, unknown, unknown], context: unknown) {
  return input.length === 3
    ? GenericArgumentsContext(input[1] as string[], context as T.TProperties)
    : {}
}
// -------------------------------------------------------------------
// KeywordString: 'string'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordStringMapping<Input extends 'string', Context extends T.TProperties>
  = T.TString
// prettier-ignore
export function KeywordStringMapping(input: 'string', context: unknown) {
  return T.String()
}
// -------------------------------------------------------------------
// KeywordNumber: 'number'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordNumberMapping<Input extends 'number', Context extends T.TProperties>
  = T.TNumber
// prettier-ignore
export function KeywordNumberMapping(input: 'number', context: unknown) {
  return T.Number()
}
// -------------------------------------------------------------------
// KeywordBoolean: 'boolean'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordBooleanMapping<Input extends 'boolean', Context extends T.TProperties>
  = T.TBoolean
// prettier-ignore
export function KeywordBooleanMapping(input: 'boolean', context: unknown) {
  return T.Boolean()
}
// -------------------------------------------------------------------
// KeywordUndefined: 'undefined'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordUndefinedMapping<Input extends 'undefined', Context extends T.TProperties>
  = T.TUndefined
// prettier-ignore
export function KeywordUndefinedMapping(input: 'undefined', context: unknown) {
  return T.Undefined()
}
// -------------------------------------------------------------------
// KeywordNull: 'null'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordNullMapping<Input extends 'null', Context extends T.TProperties>
  = T.TNull
// prettier-ignore
export function KeywordNullMapping(input: 'null', context: unknown) {
  return T.Null()
}
// -------------------------------------------------------------------
// KeywordInteger: 'integer'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordIntegerMapping<Input extends 'integer', Context extends T.TProperties>
  = T.TInteger
// prettier-ignore
export function KeywordIntegerMapping(input: 'integer', context: unknown) {
  return T.Integer()
}
// -------------------------------------------------------------------
// KeywordBigInt: 'bigint'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordBigIntMapping<Input extends 'bigint', Context extends T.TProperties>
  = T.TBigInt
// prettier-ignore
export function KeywordBigIntMapping(input: 'bigint', context: unknown) {
  return T.BigInt()
}
// -------------------------------------------------------------------
// KeywordUnknown: 'unknown'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordUnknownMapping<Input extends 'unknown', Context extends T.TProperties>
  = T.TUnknown
// prettier-ignore
export function KeywordUnknownMapping(input: 'unknown', context: unknown) {
  return T.Unknown()
}
// -------------------------------------------------------------------
// KeywordAny: 'any'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordAnyMapping<Input extends 'any', Context extends T.TProperties>
  = T.TAny
// prettier-ignore
export function KeywordAnyMapping(input: 'any', context: unknown) {
  return T.Any()
}
// -------------------------------------------------------------------
// KeywordNever: 'never'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordNeverMapping<Input extends 'never', Context extends T.TProperties>
  = T.TNever
// prettier-ignore
export function KeywordNeverMapping(input: 'never', context: unknown) {
  return T.Never()
}
// -------------------------------------------------------------------
// KeywordSymbol: 'symbol'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordSymbolMapping<Input extends 'symbol', Context extends T.TProperties>
  = T.TSymbol
// prettier-ignore
export function KeywordSymbolMapping(input: 'symbol', context: unknown) {
  return T.Symbol()
}
// -------------------------------------------------------------------
// KeywordVoid: 'void'
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordVoidMapping<Input extends 'void', Context extends T.TProperties>
  = T.TVoid
// prettier-ignore
export function KeywordVoidMapping(input: 'void', context: unknown) {
  return T.Void()
}
// -------------------------------------------------------------------
// Keyword: KeywordString | KeywordNumber | KeywordBoolean | KeywordUndefined | KeywordNull | KeywordInteger | KeywordBigInt | KeywordUnknown | KeywordAny | KeywordNever | KeywordSymbol | KeywordVoid
// -------------------------------------------------------------------
// prettier-ignore
export type TKeywordMapping<Input extends unknown, Context extends T.TProperties>
  = Input
// prettier-ignore
export function KeywordMapping(input: unknown, context: unknown) {
  return input
}
// -------------------------------------------------------------------
// LiteralString: <String>
// -------------------------------------------------------------------
// prettier-ignore
export type TLiteralStringMapping<Input extends string, Context extends T.TProperties> = 
  Input extends T.TLiteralValue ? T.TLiteral<Input> : never
// prettier-ignore
export function LiteralStringMapping(input: string, context: unknown) {
  return T.Literal(input)
}
// -------------------------------------------------------------------
// LiteralNumber: <Number>
// -------------------------------------------------------------------
// prettier-ignore
export type TLiteralNumberMapping<Input extends string, Context extends T.TProperties> =
  Input extends `${infer Value extends number}` ? T.TLiteral<Value> : never
// prettier-ignore
export function LiteralNumberMapping(input: string, context: unknown) {
  return T.Literal(parseFloat(input))
}
// -------------------------------------------------------------------
// LiteralBoolean: 'true' | 'false'
// -------------------------------------------------------------------
// prettier-ignore
export type TLiteralBooleanMapping<Input extends 'true' | 'false', Context extends T.TProperties> 
  = Input extends 'true' ? T.TLiteral<true> : T.TLiteral<false>
// prettier-ignore
export function LiteralBooleanMapping(input: 'true' | 'false', context: unknown) {
  return T.Literal(input === 'true')
}
// -------------------------------------------------------------------
// Literal: LiteralBoolean | LiteralNumber | LiteralString
// -------------------------------------------------------------------
// prettier-ignore
export type TLiteralMapping<Input extends unknown, Context extends T.TProperties>
  = Input
// prettier-ignore
export function LiteralMapping(input: unknown, context: unknown) {
  return input
}
// -------------------------------------------------------------------
// KeyOf: ['keyof'] | []
// -------------------------------------------------------------------
// prettier-ignore
export type TKeyOfMapping<Input extends [unknown] | [], Context extends T.TProperties>
  = Input extends [unknown] ? true : false
// prettier-ignore
export function KeyOfMapping(input: [unknown] | [], context: unknown) {
  return input.length > 0
}
// -------------------------------------------------------------------
// IndexArray: ['[', Type, ']'] | ['[', ']'][]
// -------------------------------------------------------------------
// prettier-ignore
type TIndexArrayMappingReduce<Input extends unknown[], Result extends unknown[] = []> = (
  Input extends [infer Left extends unknown, ...infer Right extends unknown[]]
  ? Left extends ['[', infer Type extends T.TSchema, ']']
  ? TIndexArrayMappingReduce<Right, [...Result, [Type]]>
  : TIndexArrayMappingReduce<Right, [...Result, []]>
  : Result
)
// prettier-ignore
export type TIndexArrayMapping<Input extends ([unknown, unknown, unknown] | [unknown, unknown])[], Context extends T.TProperties>
  = Input extends unknown[]
  ? TIndexArrayMappingReduce<Input>
  : []
// prettier-ignore
export function IndexArrayMapping(input: ([unknown, unknown, unknown] | [unknown, unknown])[], context: unknown) {
  return input.reduce((result: unknown[], current) => {
    return current.length === 3
      ? [...result, [current[1]]]
      : [...result, []]
  }, [] as unknown[])
}
// -------------------------------------------------------------------
// Extends: ['extends', Type, '?', Type, ':', Type] | []
// -------------------------------------------------------------------
// prettier-ignore
export type TExtendsMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown] | [], Context extends T.TProperties>
  = Input extends ['extends', infer Type extends T.TSchema, '?', infer True extends T.TSchema, ':', infer False extends T.TSchema]
  ? [Type, True, False]
  : []
// prettier-ignore
export function ExtendsMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown] | [], context: unknown) {
  return input.length === 6
    ? [input[1], input[3], input[5]]
    : []
}
// -------------------------------------------------------------------
// Base: ['(', Type, ')'] | Keyword | Object | Tuple | Literal | Constructor | Function | Mapped | AsyncIterator | Iterator | ConstructorParameters | FunctionParameters | InstanceType | ReturnType | Argument | Awaited | Array | Record | Promise | Partial | Required | Pick | Omit | Exclude | Extract | Uppercase | Lowercase | Capitalize | Uncapitalize | Date | Uint8Array | GenericReference | Reference
// -------------------------------------------------------------------
// prettier-ignore
export type TBaseMapping<Input extends [unknown, unknown, unknown] | unknown, Context extends T.TProperties> = (
  Input extends ['(', infer Type extends T.TSchema, ')'] ? Type :
  Input extends infer Type extends T.TSchema ? Type :
  never
)
// prettier-ignore
export function BaseMapping(input: [unknown, unknown, unknown] | unknown, context: unknown) {
  return T.ValueGuard.IsArray(input) && input.length === 3 ? input[1] : input
}
// -------------------------------------------------------------------
// Factor: [KeyOf, Base, IndexArray, Extends]
// -------------------------------------------------------------------
// prettier-ignore
type TFactorIndexArray<Type extends T.TSchema, IndexArray extends unknown[]> = (
  IndexArray extends [...infer Left extends unknown[], infer Right extends T.TSchema[]] ? (
    Right extends [infer Indexer extends T.TSchema] ? T.TIndex<TFactorIndexArray<Type, Left>, T.TIndexPropertyKeys<Indexer>> :
    Right extends [] ? T.TArray<TFactorIndexArray<Type, Left>> :
    T.TNever
  ) : Type
)
// prettier-ignore
type TFactorExtends<Type extends T.TSchema, Extends extends unknown[]> = (
  Extends extends [infer Right extends T.TSchema, infer True extends T.TSchema, infer False extends T.TSchema]
  ? T.TExtends<Type, Right, True, False>
  : Type
)
// prettier-ignore
export type TFactorMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties> =
  Input extends [infer KeyOf extends boolean, infer Type extends T.TSchema, infer IndexArray extends unknown[], infer Extends extends unknown[]]
  ? KeyOf extends true
  ? TFactorExtends<T.TKeyOf<TFactorIndexArray<Type, IndexArray>>, Extends>
  : TFactorExtends<TFactorIndexArray<Type, IndexArray>, Extends>
  : never

// ...
// prettier-ignore
const FactorIndexArray = (Type: T.TSchema, indexArray: unknown[]): T.TSchema => {
  return indexArray.reduceRight<T.TSchema>((result, right) => {
    const _right = right as T.TSchema[]
    return (
      _right.length === 1 ? T.Index(result, _right[0]) :
      _right.length === 0 ? T.Array(result, _right[0]) :
      T.Never()
    )
  }, Type)
}
// prettier-ignore
const FactorExtends = (Type: T.TSchema, Extends: T.TSchema[]) => {
  return Extends.length === 3
    ? T.Extends(Type, Extends[0], Extends[1], Extends[2])
    : Type
}
// prettier-ignore
export function FactorMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [KeyOf, Type, IndexArray, Extends] = input as [boolean, T.TSchema, unknown[], T.TSchema[]]
  return KeyOf
    ? FactorExtends(T.KeyOf(FactorIndexArray(Type, IndexArray)), Extends)
    : FactorExtends(FactorIndexArray(Type, IndexArray), Extends)
}

// ------------------------------------------------------------------
//
// ExprBinaryMapping
//
// TypeBox Union and Intersection types are flattened to prevent
// excessive nesting of `anyOf` and `allOf`, ensuring a more
// readable and presentable type for the user. This function
// recursively reduces Union and Intersection types based on
// binary expressions parsed from input.
//
// ------------------------------------------------------------------
// prettier-ignore
type TExprBinaryMapping<Left extends T.TSchema, Rest extends unknown[]> = (
  Rest extends [infer Operator extends unknown, infer Right extends T.TSchema, infer Next extends unknown[]] ? (
    TExprBinaryMapping<Right, Next> extends infer Schema extends T.TSchema ? (
      Operator extends '&' ? (
        Schema extends T.TIntersect<infer Types extends T.TSchema[]>
        ? T.TIntersect<[Left, ...Types]>
        : T.TIntersect<[Left, Schema]>
      ) :
      Operator extends '|' ? (
        Schema extends T.TUnion<infer Types extends T.TSchema[]>
        ? T.TUnion<[Left, ...Types]>
        : T.TUnion<[Left, Schema]>
      ) : never
    ) : never
  ) : Left
)
// prettier-ignore
function ExprBinaryMapping(Left: T.TSchema, Rest: unknown[]): T.TSchema {
  return (
    Rest.length === 3 ? (() => {
      const [Operator, Right, Next] = Rest as [string, T.TSchema, unknown[]]
      const Schema = ExprBinaryMapping(Right, Next)
      if (Operator === '&') {
        return T.TypeGuard.IsIntersect(Schema)
          ? T.Intersect([Left, ...Schema.allOf])
          : T.Intersect([Left, Schema])
      }
      if (Operator === '|') {
        return T.TypeGuard.IsUnion(Schema)
          ? T.Union([Left, ...Schema.anyOf])
          : T.Union([Left, Schema])
      }
      throw 1
    })() : Left
  )
}
// -------------------------------------------------------------------
// ExprTermTail: ['&', Factor, ExprTermTail] | []
// -------------------------------------------------------------------
// prettier-ignore
export type TExprTermTailMapping<Input extends [unknown, unknown, unknown] | [], Context extends T.TProperties>
  = Input
// prettier-ignore
export function ExprTermTailMapping(input: [unknown, unknown, unknown] | [], context: unknown) {
  return input
}
// -------------------------------------------------------------------
// ExprTerm: [Factor, ExprTermTail]
// -------------------------------------------------------------------
// prettier-ignore
export type TExprTermMapping<Input extends [unknown, unknown], Context extends T.TProperties> = (
  Input extends [infer Left extends T.TSchema, infer Rest extends unknown[]]
  ? TExprBinaryMapping<Left, Rest>
  : []
)
// prettier-ignore
export function ExprTermMapping(input: [unknown, unknown], context: unknown) {
  const [left, rest] = input as [T.TSchema, unknown[]]
  return ExprBinaryMapping(left, rest)
}
// -------------------------------------------------------------------
// ExprTail: ['|', ExprTerm, ExprTail] | []
// -------------------------------------------------------------------
// prettier-ignore
export type TExprTailMapping<Input extends [unknown, unknown, unknown] | [], Context extends T.TProperties>
  = Input
// prettier-ignore
export function ExprTailMapping(input: [unknown, unknown, unknown] | [], context: unknown) {
  return input
}
// -------------------------------------------------------------------
// Expr: [ExprTerm, ExprTail]
// -------------------------------------------------------------------
// prettier-ignore
export type TExprMapping<Input extends [unknown, unknown], Context extends T.TProperties>
  = Input extends [infer Left extends T.TSchema, infer Rest extends unknown[]]
  ? TExprBinaryMapping<Left, Rest>
  : []
// prettier-ignore
export function ExprMapping(input: [unknown, unknown], context: unknown) {
  const [left, rest] = input as [T.TSchema, unknown[]]
  return ExprBinaryMapping(left, rest)
}
// -------------------------------------------------------------------
// Type: GenericArguments -> Expr | Expr
// -------------------------------------------------------------------
// prettier-ignore
export type TTypeMapping<Input extends unknown, Context extends T.TProperties>
  = Input
// prettier-ignore
export function TypeMapping(input: unknown, context: unknown) {
  return input
}
// -------------------------------------------------------------------
// PropertyKey: <Ident> | <String>
// -------------------------------------------------------------------
// prettier-ignore
export type TPropertyKeyMapping<Input extends string, Context extends T.TProperties>
  = Input
// prettier-ignore
export function PropertyKeyMapping(input: string, context: unknown) {
  return input
}
// -------------------------------------------------------------------
// Readonly: ['readonly'] | []
// -------------------------------------------------------------------
// prettier-ignore
export type TReadonlyMapping<Input extends [unknown] | [], Context extends T.TProperties>
  = Input extends [unknown] ? true : false
// prettier-ignore
export function ReadonlyMapping(input: [unknown] | [], context: unknown) {
  return input.length > 0
}
// -------------------------------------------------------------------
// Optional: ['?'] | []
// -------------------------------------------------------------------
// prettier-ignore
export type TOptionalMapping<Input extends [unknown] | [], Context extends T.TProperties>
  = Input extends [unknown] ? true : false
// prettier-ignore
export function OptionalMapping(input: [unknown] | [], context: unknown) {
  return input.length > 0
}
// -------------------------------------------------------------------
// Property: [Readonly, PropertyKey, Optional, ':', Type]
// -------------------------------------------------------------------
// prettier-ignore
export type TPropertyMapping<Input extends [unknown, unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends [infer IsReadonly extends boolean, infer Key extends string, infer IsOptional extends boolean, string, infer Type extends T.TSchema] ? {
    [_ in Key]: (
      [IsReadonly, IsOptional] extends [true, true] ? T.TReadonlyOptional<Type> :
      [IsReadonly, IsOptional] extends [true, false] ? T.TReadonly<Type> :
      [IsReadonly, IsOptional] extends [false, true] ? T.TOptional<Type> :
      Type
    )
  } : never
// prettier-ignore
export function PropertyMapping(input: [unknown, unknown, unknown, unknown, unknown], context: unknown) {
  const [isReadonly, key, isOptional, _colon, type] = input as [boolean, string, boolean, ':', T.TSchema]
  return {
    [key]: (
      isReadonly && isOptional ? T.ReadonlyOptional(type) :
      isReadonly && !isOptional ? T.Readonly(type) :
      !isReadonly && isOptional ? T.Optional(type) :
      type
    )
  }
}
// -------------------------------------------------------------------
// PropertyDelimiter: [',', '\n'] | [';', '\n'] | [','] | [';'] | ['\n']
// -------------------------------------------------------------------
// prettier-ignore
export type TPropertyDelimiterMapping<Input extends [unknown, unknown] | [unknown], Context extends T.TProperties>
  = Input
// prettier-ignore
export function PropertyDelimiterMapping(input: [unknown, unknown] | [unknown], context: unknown) {
  return input
}
// -------------------------------------------------------------------
// PropertyList: [[Property, PropertyDelimiter][], [Property] | []]
// -------------------------------------------------------------------
// prettier-ignore
export type TPropertyListMapping<Input extends [unknown, unknown], Context extends T.TProperties>
  = TDelimited<Input>
// prettier-ignore
export function PropertyListMapping(input: [unknown, unknown], context: unknown) {
  return Delimited(input)
}
// -------------------------------------------------------------------
// Object: ['{', PropertyList, '}']
// -------------------------------------------------------------------
// prettier-ignore
type TObjectMappingReduce<PropertiesList extends T.TProperties[], Result extends T.TProperties = {}> = (
  PropertiesList extends [infer Left extends T.TProperties, ...infer Right extends T.TProperties[]]
  ? TObjectMappingReduce<Right, Result & Left>
  : { [Key in keyof Result]: Result[Key] }
)
// prettier-ignore
export type TObjectMapping<Input extends [unknown, unknown, unknown], Context extends T.TProperties> =
  Input extends ['{', infer PropertyList extends T.TProperties[], '}']
  ? T.TObject<TObjectMappingReduce<PropertyList>>
  : never
// prettier-ignore
export function ObjectMapping(input: [unknown, unknown, unknown], context: unknown) {
  const propertyList = input[1] as T.TProperties[]
  return T.Object(propertyList.reduce((result, property) => {
    return { ...result, ...property }
  }, {} as T.TProperties))
}
// -------------------------------------------------------------------
// ElementList: [[Type, ','][], [Type] | []]
// -------------------------------------------------------------------
// prettier-ignore
export type TElementListMapping<Input extends [unknown, unknown], Context extends T.TProperties>
  = TDelimited<Input>
// prettier-ignore
export function ElementListMapping(input: [unknown, unknown], context: unknown) {
  return Delimited(input)
}
// -------------------------------------------------------------------
// Tuple: ['[', ElementList, ']']
// -------------------------------------------------------------------
// prettier-ignore
export type TTupleMapping<Input extends [unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['[', infer Types extends T.TSchema[], ']'] ? T.TTuple<Types> : never
// prettier-ignore
export function TupleMapping(input: [unknown, unknown, unknown], context: unknown) {
  return T.Tuple(input[1] as T.TSchema[])
}
// -------------------------------------------------------------------
// Parameter: [<Ident>, ':', Type]
// -------------------------------------------------------------------
// prettier-ignore
export type TParameterMapping<Input extends [unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends [string, ':', infer Type extends T.TSchema] ? Type : never
// prettier-ignore
export function ParameterMapping(input: [unknown, unknown, unknown], context: unknown) {
  const [_ident, _colon, type] = input as [string, ':', T.TSchema]
  return type
}
// -------------------------------------------------------------------
// ParameterList: [[Parameter, ','][], [Parameter] | []]
// -------------------------------------------------------------------
// prettier-ignore
export type TParameterListMapping<Input extends [unknown, unknown], Context extends T.TProperties>
  = TDelimited<Input>
// prettier-ignore
export function ParameterListMapping(input: [unknown, unknown], context: unknown) {
  return Delimited(input)
}
// -------------------------------------------------------------------
// Function: ['(', ParameterList, ')', '=>', Type]
// -------------------------------------------------------------------
// prettier-ignore
export type TFunctionMapping<Input extends [unknown, unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['(', infer ParameterList extends T.TSchema[], ')', '=>', infer ReturnType extends T.TSchema]
  ? T.TFunction<ParameterList, ReturnType>
  : never
// prettier-ignore
export function FunctionMapping(input: [unknown, unknown, unknown, unknown, unknown], context: unknown) {
  const [_lparan, parameterList, _rparan, _arrow, returnType] = input as ['(', T.TSchema[], ')', '=>', T.TSchema]
  return T.Function(parameterList, returnType)
}
// -------------------------------------------------------------------
// Constructor: ['new', '(', ParameterList, ')', '=>', Type]
// -------------------------------------------------------------------
// prettier-ignore
export type TConstructorMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['new', '(', infer ParameterList extends T.TSchema[], ')', '=>', infer InstanceType extends T.TSchema]
  ? T.TConstructor<ParameterList, InstanceType>
  : never
// prettier-ignore
export function ConstructorMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown], context: unknown) {
  const [_new, _lparan, parameterList, _rparan, _arrow, instanceType] = input as ['new', '(', T.TSchema[], ')', '=>', T.TSchema]
  return T.Constructor(parameterList, instanceType)
}
// -------------------------------------------------------------------
// Mapped: ['{', '[', <Ident>, 'in', Type, ']', ':', Type, '}']
// -------------------------------------------------------------------
// prettier-ignore
export type TMappedMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['{', '[', infer _Key extends string, 'in', infer _Right extends T.TSchema, ']', ':', infer _Type extends T.TSchema, '}']
  ? T.TLiteral<'Mapped types not supported'>
  : never
// prettier-ignore
export function MappedMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown], context: unknown) {
  const [_lbrace, _lbracket, _key, _in, _right, _rbracket, _colon, _type] = input as ['{', '[', string, 'in', T.TSchema, ']', ':', T.TSchema, '}']
  return T.Literal('Mapped types not supported')
}
// -------------------------------------------------------------------
// AsyncIterator: ['AsyncIterator', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TAsyncIteratorMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['AsyncIterator', '<', infer Type extends T.TSchema, '>']
  ? T.TAsyncIterator<Type>
  : never
// prettier-ignore
export function AsyncIteratorMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['AsyncIterator', '<', T.TSchema, '>']
  return T.AsyncIterator(type)
}
// -------------------------------------------------------------------
// Iterator: ['Iterator', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TIteratorMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Iterator', '<', infer Type extends T.TSchema, '>']
  ? T.TIterator<Type>
  : never
// prettier-ignore
export function IteratorMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Iterator', '<', T.TSchema, '>']
  return T.Iterator(type)
}
// -------------------------------------------------------------------
// Argument: ['Argument', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TArgumentMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Argument', '<', infer Type extends T.TSchema, '>']
  ? Type extends T.TLiteral<infer Index extends number>
  ? T.TArgument<Index>
  : T.TNever
  : never
// prettier-ignore
export function ArgumentMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  return T.KindGuard.IsLiteralNumber(input[2])
    ? T.Argument(Math.trunc(input[2].const))
    : T.Never()
}
// -------------------------------------------------------------------
// Awaited: ['Awaited', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TAwaitedMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Awaited', '<', infer Type extends T.TSchema, '>']
  ? T.TAwaited<Type>
  : never
// prettier-ignore
export function AwaitedMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Awaited', '<', T.TSchema, '>']
  return T.Awaited(type)
}
// -------------------------------------------------------------------
// Array: ['Array', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TArrayMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Array', '<', infer Type extends T.TSchema, '>']
  ? T.TArray<Type>
  : never
// prettier-ignore
export function ArrayMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Array', '<', T.TSchema, '>']
  return T.Array(type)
}
// -------------------------------------------------------------------
// Record: ['Record', '<', Type, ',', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TRecordMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Record', '<', infer Key extends T.TSchema, ',', infer Type extends T.TSchema, '>']
  ? T.TRecordOrObject<Key, Type>
  : never
// prettier-ignore
export function RecordMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, key, _comma, type, _rangle] = input as ['Record', '<', T.TSchema, ',', T.TSchema, '>']
  return T.Record(key, type)
}
// -------------------------------------------------------------------
// Promise: ['Promise', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TPromiseMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Promise', '<', infer Type extends T.TSchema, '>']
  ? T.TPromise<Type>
  : never
// prettier-ignore
export function PromiseMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Promise', '<', T.TSchema, '>']
  return T.Promise(type)
}
// -------------------------------------------------------------------
// ConstructorParameters: ['ConstructorParameters', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TConstructorParametersMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['ConstructorParameters', '<', infer Type extends T.TSchema, '>']
  ? T.TConstructorParameters<Type>
  : never
// prettier-ignore
export function ConstructorParametersMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['ConstructorParameters', '<', T.TSchema, '>']
  return T.ConstructorParameters(type)
}
// -------------------------------------------------------------------
// FunctionParameters: ['Parameters', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TFunctionParametersMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Parameters', '<', infer Type extends T.TSchema, '>']
  ? T.TParameters<Type>
  : never
// prettier-ignore
export function FunctionParametersMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Parameters', '<', T.TSchema, '>']
  return T.Parameters(type)
}
// -------------------------------------------------------------------
// InstanceType: ['InstanceType', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TInstanceTypeMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['InstanceType', '<', infer Type extends T.TSchema, '>']
  ? T.TInstanceType<Type>
  : never
// prettier-ignore
export function InstanceTypeMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['InstanceType', '<', T.TSchema, '>']
  return T.InstanceType(type)
}
// -------------------------------------------------------------------
// ReturnType: ['ReturnType', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TReturnTypeMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['ReturnType', '<', infer Type extends T.TSchema, '>']
  ? T.TReturnType<Type>
  : never
// prettier-ignore
export function ReturnTypeMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['ReturnType', '<', T.TSchema, '>']
  return T.ReturnType(type)
}
// -------------------------------------------------------------------
// Partial: ['Partial', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TPartialMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Partial', '<', infer Type extends T.TSchema, '>']
  ? T.TPartial<Type>
  : never
// prettier-ignore
export function PartialMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Partial', '<', T.TSchema, '>']
  return T.Partial(type)
}
// -------------------------------------------------------------------
// Required: ['Required', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TRequiredMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Required', '<', infer Type extends T.TSchema, '>']
  ? T.TRequired<Type>
  : never
// prettier-ignore
export function RequiredMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Required', '<', T.TSchema, '>']
  return T.Required(type)
}
// -------------------------------------------------------------------
// Pick: ['Pick', '<', Type, ',', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TPickMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Pick', '<', infer Type extends T.TSchema, ',', infer Key extends T.TSchema, '>']
  ? T.TPick<Type, Key>
  : never
// prettier-ignore
export function PickMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, key, _comma, type, _rangle] = input as ['Pick', '<', T.TSchema, ',', T.TSchema, '>']
  return T.Pick(key, type)
}
// -------------------------------------------------------------------
// Omit: ['Omit', '<', Type, ',', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TOmitMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Omit', '<', infer Type extends T.TSchema, ',', infer Key extends T.TSchema, '>']
  ? T.TOmit<Type, Key>
  : never
// prettier-ignore
export function OmitMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, key, _comma, type, _rangle] = input as ['Omit', '<', T.TSchema, ',', T.TSchema, '>']
  return T.Omit(key, type)
}
// -------------------------------------------------------------------
// Exclude: ['Exclude', '<', Type, ',', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TExcludeMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Exclude', '<', infer Type extends T.TSchema, ',', infer Key extends T.TSchema, '>']
  ? T.TExclude<Type, Key>
  : never
// prettier-ignore
export function ExcludeMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, key, _comma, type, _rangle] = input as ['Exclude', '<', T.TSchema, ',', T.TSchema, '>']
  return T.Exclude(key, type)
}
// -------------------------------------------------------------------
// Extract: ['Extract', '<', Type, ',', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TExtractMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Extract', '<', infer Type extends T.TSchema, ',', infer Key extends T.TSchema, '>']
  ? T.TExtract<Type, Key>
  : never
// prettier-ignore
export function ExtractMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, key, _comma, type, _rangle] = input as ['Extract', '<', T.TSchema, ',', T.TSchema, '>']
  return T.Extract(key, type)
}
// -------------------------------------------------------------------
// Uppercase: ['Uppercase', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TUppercaseMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Uppercase', '<', infer Type extends T.TSchema, '>']
  ? T.TUppercase<Type>
  : never
// prettier-ignore
export function UppercaseMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Uppercase', '<', T.TSchema, '>']
  return T.Uppercase(type)
}
// -------------------------------------------------------------------
// Lowercase: ['Lowercase', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TLowercaseMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Lowercase', '<', infer Type extends T.TSchema, '>']
  ? T.TLowercase<Type>
  : never
// prettier-ignore
export function LowercaseMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Lowercase', '<', T.TSchema, '>']
  return T.Lowercase(type)
}
// -------------------------------------------------------------------
// Capitalize: ['Capitalize', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TCapitalizeMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Capitalize', '<', infer Type extends T.TSchema, '>']
  ? T.TCapitalize<Type>
  : never
// prettier-ignore
export function CapitalizeMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Capitalize', '<', T.TSchema, '>']
  return T.Capitalize(type)
}
// -------------------------------------------------------------------
// Uncapitalize: ['Uncapitalize', '<', Type, '>']
// -------------------------------------------------------------------
// prettier-ignore
export type TUncapitalizeMapping<Input extends [unknown, unknown, unknown, unknown], Context extends T.TProperties>
  = Input extends ['Uncapitalize', '<', infer Type extends T.TSchema, '>']
  ? T.TUncapitalize<Type>
  : never
// prettier-ignore
export function UncapitalizeMapping(input: [unknown, unknown, unknown, unknown], context: unknown) {
  const [_name, _langle, type, _rangle] = input as ['Uncapitalize', '<', T.TSchema, '>']
  return T.Uncapitalize(type)
}
// -------------------------------------------------------------------
// Date: 'Date'
// -------------------------------------------------------------------
// prettier-ignore
export type TDateMapping<Input extends 'Date', Context extends T.TProperties>
  = T.TDate
// prettier-ignore
export function DateMapping(input: 'Date', context: unknown) {
  return T.Date()
}
// -------------------------------------------------------------------
// Uint8Array: 'Uint8Array'
// -------------------------------------------------------------------
// prettier-ignore
export type TUint8ArrayMapping<Input extends 'Uint8Array', Context extends T.TProperties>
  = T.TUint8Array
// prettier-ignore
export function Uint8ArrayMapping(input: 'Uint8Array', context: unknown) {
  return T.Uint8Array()
}
// -------------------------------------------------------------------
// Reference: <Ident>
// -------------------------------------------------------------------
// prettier-ignore
export type TReferenceMapping<Input extends string, Context extends T.TProperties> 
  = Context extends T.TProperties
      ? Input extends string
        ? TDereference<Context, Input>
        : never
      : never
// prettier-ignore
export function ReferenceMapping(input: string, context: unknown) {
  const target = Dereference(context as T.TProperties, input)
  return target
}
