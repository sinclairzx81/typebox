/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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
// deno-lint-ignore-file

import { Memory } from '../../system/memory/index.ts'
import { Guard } from '../../guard/index.ts'
import * as C from '../action/index.ts'
import * as T from '../types/index.ts'

// ------------------------------------------------------------------
// IntrinsicOrCall
// ------------------------------------------------------------------
type TIntrinsicOrCall<Target extends string, Parameters extends T.TSchema[]> = (
  [Target, Parameters] extends ['Array', [infer Type extends T.TSchema]] ? T.TArray<Type> :
  [Target, Parameters] extends ['AsyncIterator', [infer Type extends T.TSchema]] ? T.TAsyncIterator<Type> :
  [Target, Parameters] extends ['Promise', [infer Type extends T.TSchema]] ? T.TPromise<Type> :
  [Target, Parameters] extends ['Iterator', [infer Type extends T.TSchema]] ? T.TIterator<Type> :
  [Target, Parameters] extends ['Awaited', [infer Type extends T.TSchema]] ? C.TAwaitedDeferred<Type> :
  [Target, Parameters] extends ['Capitalize', [infer Type extends T.TSchema]] ? C.TCapitalizeDeferred<Type> :
  [Target, Parameters] extends ['ConstructorParameters', [infer Type extends T.TSchema]] ? C.TConstructorParametersDeferred<Type> :
  [Target, Parameters] extends ['Evaluate', [infer Type extends T.TSchema]] ? C.TEvaluateDeferred<Type> :
  [Target, Parameters] extends ['Exclude', [infer Left extends T.TSchema, infer Right extends T.TSchema]] ? C.TExcludeDeferred<Left, Right> :
  [Target, Parameters] extends ['Extract', [infer Left extends T.TSchema, infer Right extends T.TSchema]] ? C.TExtractDeferred<Left, Right> :
  [Target, Parameters] extends ['Index', [infer Type extends T.TSchema, infer Indexer extends T.TSchema]] ? C.TIndexDeferred<Type, Indexer> :
  [Target, Parameters] extends ['InstanceType', [infer Type extends T.TSchema]] ? C.TInstanceTypeDeferred<Type> :
  [Target, Parameters] extends ['KeyOf', [infer Type extends T.TSchema]] ? C.TKeyOfDeferred<Type> :
  [Target, Parameters] extends ['Lowercase', [infer Type extends T.TSchema]] ? C.TLowercaseDeferred<Type> :
  [Target, Parameters] extends ['NonNullable', [infer Type extends T.TSchema]] ? C.TNonNullableDeferred<Type> :
  [Target, Parameters] extends ['Omit', [infer Type extends T.TSchema, infer Indexer extends T.TSchema]] ? C.TOmitDeferred<Type, Indexer> :
  [Target, Parameters] extends ['Options', [infer Type extends T.TSchema, infer Options extends T.TSchema]] ? C.TOptionsDeferred<Type, Options> :
  [Target, Parameters] extends ['Parameters', [infer Type extends T.TSchema]] ? C.TParametersDeferred<Type> :
  [Target, Parameters] extends ['Partial', [infer Type extends T.TSchema]] ? C.TPartialDeferred<Type> :
  [Target, Parameters] extends ['Pick', [infer Type extends T.TSchema, infer Indexer extends T.TSchema]] ? C.TPickDeferred<Type, Indexer> :
  [Target, Parameters] extends ['Record', [infer Key extends T.TSchema, infer Value extends T.TSchema]] ? T.TRecordDeferred<Key, Value> :
  [Target, Parameters] extends ['Required', [infer Type extends T.TSchema]] ? C.TRequiredDeferred<Type> :
  [Target, Parameters] extends ['ReturnType', [infer Type extends T.TSchema]] ? C.TReturnTypeDeferred<Type> :
  [Target, Parameters] extends ['Uncapitalize', [infer Type extends T.TSchema]] ? C.TUncapitalizeDeferred<Type> :
  [Target, Parameters] extends ['Uppercase', [infer Type extends T.TSchema]] ? C.TUppercaseDeferred<Type> :
  T.TCallConstruct<T.TRef<Target>, Parameters>
)
function IntrinsicOrCall<Ref extends string, Parameters extends T.TSchema[]>(ref: Ref, parameters: [...Parameters]): TIntrinsicOrCall<Ref, Parameters> {
  // deno-coverage-ignore-start
  //
  // Have extensively tested but reports show no Omit coverage (review)
  return (
    Guard.IsEqual(ref, 'Array') ? T.Array(parameters[0]) :
    Guard.IsEqual(ref, 'AsyncIterator') ? T.AsyncIterator(parameters[0]) :
    Guard.IsEqual(ref, 'Iterator') ? T.Iterator(parameters[0]) :
    Guard.IsEqual(ref, 'Promise') ? T.Promise(parameters[0]) :
    Guard.IsEqual(ref, 'Awaited') ? C.AwaitedDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Capitalize') ? C.CapitalizeDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'ConstructorParameters') ? C.ConstructorParametersDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Evaluate') ? C.EvaluateDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Exclude') ? C.ExcludeDeferred(parameters[0], parameters[1]) :
    Guard.IsEqual(ref, 'Extract') ? C.ExtractDeferred(parameters[0], parameters[1]) :
    Guard.IsEqual(ref, 'Index') ? C.IndexDeferred(parameters[0], parameters[1]) :
    Guard.IsEqual(ref, 'InstanceType') ? C.InstanceTypeDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Lowercase') ? C.LowercaseDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'NonNullable') ? C.NonNullableDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Omit') ? C.OmitDeferred(parameters[0], parameters[1]) :
    Guard.IsEqual(ref, 'Options') ? C.OptionsDeferred(parameters[0], parameters[1]) :
    Guard.IsEqual(ref, 'Parameters') ? C.ParametersDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Partial') ? C.PartialDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Pick') ? C.PickDeferred(parameters[0], parameters[1]) :
    Guard.IsEqual(ref, 'KeyOf') ? C.KeyOfDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Record') ? T.RecordDeferred(parameters[0], parameters[1]) :
    Guard.IsEqual(ref, 'Required') ? C.RequiredDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'ReturnType') ? C.ReturnTypeDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Uncapitalize') ? C.UncapitalizeDeferred(parameters[0]) :
    Guard.IsEqual(ref, 'Uppercase') ? C.UppercaseDeferred(parameters[0]) :
    T.CallConstruct(T.Ref(ref), parameters)
  ) as never
  // deno-coverage-ignore-stop
}
// ------------------------------------------------------------------
// Unreachable
// ------------------------------------------------------------------
// deno-coverage-ignore-start
function Unreachable(): never {
  throw Error('Unreachable')
}
// deno-coverage-ignore-stop
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
type TDelimitedDecode<Input extends ([unknown, unknown] | unknown)[], Result extends unknown[] = []> = (
  Input extends [infer Left, ...infer Right]
  ? Left extends [infer Item, infer _]
  ? TDelimitedDecode<Right, [...Result, Item]>
  : TDelimitedDecode<Right, [...Result, Left]>
  : Result
)
type TDelimited<Input extends [unknown, unknown]>
  = Input extends [infer Left extends unknown[], infer Right extends unknown[]]
  ? TDelimitedDecode<[...Left, ...Right]>
  : []
const DelimitedDecode = (input: ([unknown, unknown] | unknown)[], result: unknown[] = []) => {
  return input.reduce<unknown[]>((result, left) => {
    return Guard.IsArray(left) && Guard.IsEqual(left.length, 2)
      ? [...result, left[0]]
      : [...result, left]
  }, [])
}
const Delimited = (input: [unknown, unknown]) => {
  const [left, right] = input as [unknown[], unknown[]]
  return DelimitedDecode([...left, ...right])
}
// -------------------------------------------------------------------
// GenericParameterExtendsEquals: [<Ident>, 'extends', Type, '=', Type]
// -------------------------------------------------------------------
export type TGenericParameterExtendsEqualsMapping<Input extends [unknown, unknown, unknown, unknown, unknown]> = (
  Input extends [infer Name extends string, 'extends', infer Extends extends T.TSchema, '=', infer Equals extends T.TSchema]
  ? T.TParameter<Name, Extends, Equals>
  : never
)
export function GenericParameterExtendsEqualsMapping(input: [unknown, unknown, unknown, unknown, unknown]): unknown {
  return T.Parameter(input[0] as string, input[2] as T.TSchema, input[4] as T.TSchema)
}
// -------------------------------------------------------------------
// GenericParameterExtends. [<Ident>, 'extends', Type]
// -------------------------------------------------------------------
export type TGenericParameterExtendsMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends [infer Name extends string, 'extends', infer Extends extends T.TSchema]
    ? T.TParameter<Name, Extends, Extends>
    : never
)
export function GenericParameterExtendsMapping(input: [unknown, unknown, unknown]): unknown {
  return T.Parameter(input[0] as string, input[2] as T.TSchema, input[2] as T.TSchema)
}
// -------------------------------------------------------------------
// GenericParameterEquals: [<Ident>, '=', Type]
// -------------------------------------------------------------------
export type TGenericParameterEqualsMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends [infer Name extends string, '=', infer Equals extends T.TSchema]
  ? T.TParameter<Name, T.TUnknown, Equals>
  : never
)
export function GenericParameterEqualsMapping(input: [unknown, unknown, unknown]): unknown {
  return T.Parameter(input[0] as string, T.Unknown(), input[2] as T.TSchema)
}
// -------------------------------------------------------------------
// GenericParameterIdentifier: <Ident>
// -------------------------------------------------------------------
export type TGenericParameterIdentifierMapping<Input extends string,
  Result extends T.TSchema = T.TParameter<Input, T.TUnknown, T.TUnknown>
> = Result
export function GenericParameterIdentifierMapping(input: string): unknown {
  return T.Parameter(input, T.Unknown(), T.Unknown())
}
// -------------------------------------------------------------------
// GenericParameter: GenericParameterExtendsEquals | GenericParameterExtends | GenericParameterEquals | GenericParameterIdentifier
// -------------------------------------------------------------------
export type TGenericParameterMapping<Input extends unknown> = (
  Input
)
export function GenericParameterMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// GenericParameterList: [[GenericParameter, ','][], [GenericParameter] | []]
// -------------------------------------------------------------------
export type TGenericParameterListMapping<Input extends [unknown, unknown]> = (
  TDelimited<Input>
)
export function GenericParameterListMapping(input: [unknown, unknown]): unknown {
  return Delimited(input)
}
// -------------------------------------------------------------------
// GenericParameters: ['<', GenericParameterList, '>']
// -------------------------------------------------------------------
export type TGenericParametersMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends ['<', infer Parameters extends T.TParameter[], '>']
    ? Parameters
    : never
)
export function GenericParametersMapping(input: [unknown, unknown, unknown]): unknown {
  return input[1] as T.TParameter[]
}
// -------------------------------------------------------------------
// GenericCallArgumentList: [[Type, ','][], [Type] | []]
// -------------------------------------------------------------------
export type TGenericCallArgumentListMapping<Input extends [unknown, unknown]> = (
  TDelimited<Input>
)
export function GenericCallArgumentListMapping(input: [unknown, unknown]): unknown {
  return Delimited(input)
}
// -------------------------------------------------------------------
// GenericCallArguments: ['<', GenericCallArgumentList, '>']
// -------------------------------------------------------------------
export type TGenericCallArgumentsMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends ['<', infer Arguments extends T.TSchema[], '>']
    ? Arguments
    : never
)
export function GenericCallArgumentsMapping(input: [unknown, unknown, unknown]): unknown {
  return input[1] as T.TSchema[]
}
// -------------------------------------------------------------------
// GenericCall: [<Ident>, GenericCallArguments]
// -------------------------------------------------------------------
export type TGenericCallMapping<Input extends [unknown, unknown],
  Result = Input extends [infer Ref extends string, infer Arguments extends T.TSchema[]]
    ? TIntrinsicOrCall<Ref, Arguments>
    : never
> = Result
export function GenericCallMapping(input: [unknown, unknown]): unknown {
  return IntrinsicOrCall(input[0] as string, input[1] as T.TSchema[])
}
// -------------------------------------------------------------------
// OptionalSemiColon: [';'] | []
// -------------------------------------------------------------------
export type TOptionalSemiColonMapping<Input extends [unknown] | []>
  = null
export function OptionalSemiColonMapping(input: [unknown] | []): unknown {
  return null
}
// -------------------------------------------------------------------
// KeywordString: 'string'
// -------------------------------------------------------------------
export type TKeywordStringMapping<Input extends 'string'> = (
  T.TString
)
export function KeywordStringMapping(input: 'string'): unknown {
  return T.String()
}
// -------------------------------------------------------------------
// KeywordNumber: 'number'
// -------------------------------------------------------------------
export type TKeywordNumberMapping<Input extends 'number'> = (
  T.TNumber
)
export function KeywordNumberMapping(input: 'number'): unknown {
  return T.Number()
}
// -------------------------------------------------------------------
// KeywordBoolean: 'boolean'
// -------------------------------------------------------------------
export type TKeywordBooleanMapping<Input extends 'boolean'> = (
  T.TBoolean
)
export function KeywordBooleanMapping(input: 'boolean'): unknown {
  return T.Boolean()
}
// -------------------------------------------------------------------
// KeywordUndefined: 'undefined'
// -------------------------------------------------------------------
export type TKeywordUndefinedMapping<Input extends 'undefined'> = (
  T.TUndefined
)
export function KeywordUndefinedMapping(input: 'undefined'): unknown {
  return T.Undefined()
}
// -------------------------------------------------------------------
// KeywordNull: 'null'
// -------------------------------------------------------------------
export type TKeywordNullMapping<Input extends 'null'> = (
  T.TNull
)
export function KeywordNullMapping(input: 'null'): unknown {
  return T.Null()
}
// -------------------------------------------------------------------
// KeywordInteger: 'integer'
// -------------------------------------------------------------------
export type TKeywordIntegerMapping<Input extends 'integer'> = (
  T.TInteger
)
export function KeywordIntegerMapping(input: 'integer'): unknown {
  return T.Integer()
}
// -------------------------------------------------------------------
// KeywordBigInt: 'bigint'
// -------------------------------------------------------------------
export type TKeywordBigIntMapping<Input extends 'bigint'> = (
  T.TBigInt
)
export function KeywordBigIntMapping(input: 'bigint'): unknown {
  return T.BigInt()
}
// -------------------------------------------------------------------
// KeywordUnknown: 'unknown'
// -------------------------------------------------------------------
export type TKeywordUnknownMapping<Input extends 'unknown'> = (
  T.TUnknown
)
export function KeywordUnknownMapping(input: 'unknown'): unknown {
  return T.Unknown()
}
// -------------------------------------------------------------------
// KeywordAny: 'any'
// -------------------------------------------------------------------
export type TKeywordAnyMapping<Input extends 'any'> = (
  T.TAny
)
export function KeywordAnyMapping(input: 'any'): unknown {
  return T.Any()
}
// -------------------------------------------------------------------
// KeywordObject: 'object'
// -------------------------------------------------------------------
export type TKeywordObjectMapping<Input extends 'object'> = (
  T.TObject<{}>
)
export function KeywordObjectMapping(input: 'object'): unknown {
  return T.Object({})
}
// -------------------------------------------------------------------
// KeywordNever: 'never'
// -------------------------------------------------------------------
export type TKeywordNeverMapping<Input extends 'never'> = (
  T.TNever
)
export function KeywordNeverMapping(input: 'never'): unknown {
  return T.Never()
}
// -------------------------------------------------------------------
// KeywordSymbol: 'symbol'
// -------------------------------------------------------------------
export type TKeywordSymbolMapping<Input extends 'symbol'> = (
  T.TSymbol
)
export function KeywordSymbolMapping(input: 'symbol'): unknown {
  return T.Symbol()
}
// -------------------------------------------------------------------
// KeywordVoid: 'void'
// -------------------------------------------------------------------
export type TKeywordVoidMapping<Input extends 'void'> = (
  T.TVoid
)
export function KeywordVoidMapping(input: 'void'): unknown {
  return T.Void()
}
// -------------------------------------------------------------------
// KeywordThis: 'this'
// -------------------------------------------------------------------
export type TKeywordThisMapping<Input extends 'this'> = (
  T.TThis
)
export function KeywordThisMapping(input: 'this'): unknown {
  return T.This()
}
// -------------------------------------------------------------------
// Keyword: KeywordString | KeywordNumber | KeywordBoolean | KeywordUndefined | KeywordNull | KeywordInteger | KeywordBigInt | KeywordUnknown | KeywordAny | KeywordObject | KeywordNever | KeywordSymbol | KeywordVoid | KeywordThis
// -------------------------------------------------------------------
export type TKeywordMapping<Input extends unknown>
  = Input
export function KeywordMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// TemplateInterpolate: ['${', Type, '}']
// -------------------------------------------------------------------
export type TTemplateInterpolateMapping<Input extends [unknown, unknown, unknown]>
  = Input extends ['${', infer Type extends T.TSchema, '}'] ? Type : never
export function TemplateInterpolateMapping(input: [unknown, unknown, unknown]): unknown {
  return input[1]
}
// -------------------------------------------------------------------
// TemplateSpan: string
// -------------------------------------------------------------------
export type TTemplateSpanMapping<Input extends string,
  Result extends T.TSchema = T.TLiteral<Input>
> = Result
export function TemplateSpanMapping(input: string): unknown {
  return T.Literal(input)
}
// -------------------------------------------------------------------
// TemplateBody: [TemplateSpan, TemplateInterpolate, TemplateBody] | [TemplateSpan] | [TemplateSpan]
// -------------------------------------------------------------------
export type TTemplateBodyMapping<Input extends [unknown, unknown, unknown] | [unknown]> = (
  Input extends [infer Text extends T.TSchema, infer Type extends T.TSchema, infer Rest extends T.TSchema[]] ? [Text, Type, ...Rest] :
  Input extends [infer Text extends T.TSchema] ? [Text] :
  []
)
export function TemplateBodyMapping(input: [unknown, unknown, unknown] | [unknown]): unknown {
  return (
    Guard.IsEqual(input.length, 3)
      ? [input[0], input[1], ...input[2] as unknown[]]
      : [input[0]]
  )
}
// -------------------------------------------------------------------
// TemplateLiteralTypes: ['`', TemplateBody, '`']
// -------------------------------------------------------------------
export type TTemplateLiteralTypesMapping<Input extends [unknown, unknown, unknown],
  Result extends T.TSchema = Input extends ['`', infer Types extends T.TSchema[], '`'] ? Types : []
> = Result
export function TemplateLiteralTypesMapping(input: [unknown, unknown, unknown]): unknown {
  return input[1] as T.TSchema[]
}
// -------------------------------------------------------------------
// TemplateLiteral: TemplateLiteralTypes
// -------------------------------------------------------------------
export type TTemplateLiteralMapping<Input extends unknown> = (
  Input extends infer Types extends T.TSchema[] ? T.TTemplateLiteralDeferred<Types> : never
)
export function TemplateLiteralMapping(input: unknown): unknown {
  return T.TemplateLiteralDeferred(input as T.TSchema[])
}
// -------------------------------------------------------------------
// LiteralBigInt: <BigInt>
// -------------------------------------------------------------------
export type TLiteralBigIntMapping<Input extends string> = (
  Input extends `${infer Value extends bigint}` ? T.TLiteral<Value> : never
)
export function LiteralBigIntMapping(input: string): unknown {
  return T.Literal(BigInt(input))
}
// -------------------------------------------------------------------
// LiteralBoolean: 'true' | 'false'
// -------------------------------------------------------------------
export type TLiteralBooleanMapping<Input extends 'true' | 'false'> = (
  Input extends 'true' ? T.TLiteral<true> : T.TLiteral<false>
)
export function LiteralBooleanMapping(input: 'true' | 'false'): unknown {
  return T.Literal(Guard.IsEqual(input, 'true'))
}
// -------------------------------------------------------------------
// LiteralNumber: <Number>
// -------------------------------------------------------------------
export type TLiteralNumberMapping<Input extends string> = (
  Input extends `${infer Value extends number}` ? T.TLiteral<Value> : never
)
export function LiteralNumberMapping(input: string): unknown {
  return T.Literal(parseFloat(input))
}
// -------------------------------------------------------------------
// LiteralString: <String>
// -------------------------------------------------------------------
export type TLiteralStringMapping<Input extends string> = (
  Input extends T.TLiteralValue ? T.TLiteral<Input> : never
)
export function LiteralStringMapping(input: string): unknown {
  return T.Literal(input)
}
// -------------------------------------------------------------------
// Literal: LiteralBigInt | LiteralBoolean | LiteralNumber | LiteralString
// -------------------------------------------------------------------
export type TLiteralMapping<Input extends unknown> = (
  Input
)
export function LiteralMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// KeyOf: ['keyof'] | []
// -------------------------------------------------------------------
export type TKeyOfMapping<Input extends [unknown] | []> = (
  Input extends [unknown] ? true : false
)
export function KeyOfMapping(input: [unknown] | []): unknown {
  return input.length > 0
}
// -------------------------------------------------------------------
// IndexArray: ['[', Type, ']'] | ['[', ']'][]
// -------------------------------------------------------------------
type TIndexArrayMappingReduce<Input extends unknown[], Result extends unknown[] = []> = (
  Input extends [infer Left extends unknown, ...infer Right extends unknown[]]
    ? Left extends ['[', infer Type extends T.TSchema, ']']
      ? TIndexArrayMappingReduce<Right, [...Result, [Type]]>
      : TIndexArrayMappingReduce<Right, [...Result, []]>
    : Result
)
export type TIndexArrayMapping<Input extends ([unknown, unknown, unknown] | [unknown, unknown])[]> = (
  Input extends unknown[]
    ? TIndexArrayMappingReduce<Input>
    : []
)
export function IndexArrayMapping(input: ([unknown, unknown, unknown] | [unknown, unknown])[]): unknown {
  return input.reduce((result: unknown[], current) => {
    return Guard.IsEqual(current.length, 3)
      ? [...result, [current[1]]]
      : [...result, []]
  }, [] as unknown[])
}
// -------------------------------------------------------------------
// Extends. ['extends', Type, '?', Type, ':', Type] | []
// -------------------------------------------------------------------
export type TExtendsMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown] | []> = (
  Input extends ['extends', infer Type extends T.TSchema, '?', infer True extends T.TSchema, ':', infer False extends T.TSchema]
    ? [Type, True, False]
    : []
)
export function ExtendsMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown] | []): unknown {
  return Guard.IsEqual(input.length, 6)
    ? [input[1] as T.TSchema, input[3] as T.TSchema, input[5] as T.TSchema]
    : []
}
// -------------------------------------------------------------------
// Base: ['(', Type, ')'] | Keyword | _Object_ | Tuple | TemplateLiteral | Literal | Constructor | Function | Mapped | Options | GenericCall | Reference
// -------------------------------------------------------------------
export type TBaseMapping<Input extends [unknown, unknown, unknown] | unknown> = (
  Input extends ['(', infer Type extends T.TSchema, ')'] ? Type :
  Input extends infer Type extends T.TSchema ? Type :
  never
)
export function BaseMapping(input: [unknown, unknown, unknown] | unknown): unknown {
  return Guard.IsArray(input) && Guard.IsEqual(input.length, 3)
    ? input[1] as T.TSchema
    : input as T.TSchema
}
// -------------------------------------------------------------------
// Factor: [KeyOf, Base, IndexArray, Extends]
// -------------------------------------------------------------------
type TFactorIndexArray<Type extends T.TSchema, IndexArray extends unknown[]> = (
  IndexArray extends [...infer Left extends unknown[], infer Right extends T.TSchema[]] ? (
    Right extends [infer Indexer extends T.TSchema] ? C.TIndexDeferred<TFactorIndexArray<Type, Left>, Indexer> :
    Right extends [] ? T.TArray<TFactorIndexArray<Type, Left>> :
    T.TNever
  ) : Type
)
type TFactorExtends<Type extends T.TSchema, Extends extends unknown[]> = (
  Extends extends [infer Right extends T.TSchema, infer True extends T.TSchema, infer False extends T.TSchema]
  ? C.TConditionalDeferred<Type, Right, True, False>
  : Type
)
export type TFactorMapping<Input extends [unknown, unknown, unknown, unknown]> = (
  Input extends [infer KeyOf extends boolean, infer Type extends T.TSchema, infer IndexArray extends unknown[], infer Extend extends unknown[]]
    ? KeyOf extends true
      ? TFactorExtends<C.TKeyOfDeferred<TFactorIndexArray<Type, IndexArray>>, Extend>
      : TFactorExtends<TFactorIndexArray<Type, IndexArray>, Extend>
    : never
)
// deno-coverage-ignore-start
// ...
const FactorIndexArray = (Type: T.TSchema, indexArray: unknown[]): T.TSchema => {
  return indexArray.reduceRight<T.TSchema>((result, right) => {
    const _right = right as T.TSchema[]
    return (
      Guard.IsEqual(_right.length, 1) ? C.IndexDeferred(result, _right[0]) :
      Guard.IsEqual(_right.length, 0) ? T.Array(result) :
      Unreachable()
    )
  }, Type)
}
// deno-coverage-ignore-stop
const FactorExtends = (type: T.TSchema, extend: T.TSchema[]) => {
  return Guard.IsEqual(extend.length, 3)
    ? C.ConditionalDeferred(type, extend[0], extend[1], extend[2])
    : type
}
export function FactorMapping(input: [unknown, unknown, unknown, unknown]): unknown {
  const [keyOf, type, indexArray, extend] = input as [boolean, T.TSchema, unknown[], T.TSchema[]]
  return keyOf
    ? FactorExtends(C.KeyOfDeferred(FactorIndexArray(type, indexArray)), extend)
    : FactorExtends(FactorIndexArray(type, indexArray), extend)
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
// deno-coverage-ignore-start
function ExprBinaryMapping(left: T.TSchema, rest: unknown[]): T.TSchema {
  return (
    Guard.IsEqual(rest.length, 3) ? (() => {
      const [operator, right, next] = rest as [string, T.TSchema, unknown[]]
      const Schema = ExprBinaryMapping(right, next)
      if (Guard.IsEqual(operator, '&')) {
        return T.IsIntersect(Schema)
          ? T.Intersect([left, ...Schema.allOf])
          : T.Intersect([left, Schema])
      }
      if (Guard.IsEqual(operator, '|')) {
        return T.IsUnion(Schema)
          ? T.Union([left, ...Schema.anyOf])
          : T.Union([left, Schema])
      }
      Unreachable()
    })() : left
  )
}
// deno-coverage-ignore-stop
// -------------------------------------------------------------------
// ExprTermTail: ['&', Factor, ExprTermTail] | []
// -------------------------------------------------------------------
export type TExprTermTailMapping<Input extends [unknown, unknown, unknown] | []> = (
  Input
)
export function ExprTermTailMapping(input: [unknown, unknown, unknown] | []): unknown {
  return input
}
// -------------------------------------------------------------------
// ExprTerm: [Factor, ExprTermTail]
// -------------------------------------------------------------------
export type TExprTermMapping<Input extends [unknown, unknown]> = (
  Input extends [infer Left extends T.TSchema, infer Rest extends unknown[]]
  ? TExprBinaryMapping<Left, Rest>
  : []
)
export function ExprTermMapping(input: [unknown, unknown]): unknown {
  const [left, rest] = input as [T.TSchema, unknown[]]
  return ExprBinaryMapping(left, rest)
}
// -------------------------------------------------------------------
// ExprTail: ['|', ExprTerm, ExprTail] | []
// -------------------------------------------------------------------
export type TExprTailMapping<Input extends [unknown, unknown, unknown] | []> = (
  Input
)
export function ExprTailMapping(input: [unknown, unknown, unknown] | []): unknown {
  return input
}
// -------------------------------------------------------------------
// Expr: [ExprTerm, ExprTail]
// -------------------------------------------------------------------
export type TExprMapping<Input extends [unknown, unknown]> = (
  Input extends [infer Left extends T.TSchema, infer Rest extends unknown[]]
    ? TExprBinaryMapping<Left, Rest>
    : []
)
export function ExprMapping(input: [unknown, unknown]): unknown {
  const [left, rest] = input as [T.TSchema, unknown[]]
  return ExprBinaryMapping(left, rest)
}
// -------------------------------------------------------------------
// ExprPipe: ['|', Expr]
// -------------------------------------------------------------------
export type TExprPipeMapping<Input extends [unknown, unknown]> = (
  Input extends ['|', infer Type extends T.TSchema]
    ? Type
    : never
)
export function ExprPipeMapping(input: [unknown, unknown]): unknown {
  return input[1]
}
// -------------------------------------------------------------------
// GenericType: [GenericParameters, '=', Type]
// -------------------------------------------------------------------
export type TGenericTypeMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends [infer Arguments extends T.TParameter[], '=', infer Type extends T.TSchema]
    ? T.TGeneric<Arguments, Type>
    : never
)
export function GenericTypeMapping(input: [unknown, unknown, unknown]): unknown {
  return T.Generic(input[0] as T.TParameter[], input[2] as T.TSchema)
}
// -------------------------------------------------------------------
// InferType: ['infer', <Ident>, 'extends', Expr] | ['infer', <Ident>]
// -------------------------------------------------------------------
export type TInferTypeMapping<Input extends [unknown, unknown, unknown, unknown] | [unknown, unknown]> = (
  Input extends ['infer', infer Name extends string, 'extends', infer Type extends T.TSchema] ? T.TInfer<Name, Type> :
  Input extends ['infer', infer Name extends string] ? T.TInfer<Name, T.TUnknown> :
  never
)
// deno-coverage-ignore-start
export function InferTypeMapping(input: [unknown, unknown, unknown, unknown] | [unknown, unknown]): unknown {
  return (
    Guard.IsEqual(input.length, 4) ? T.Infer(input[1] as string, input[3] as T.TSchema) :
    Guard.IsEqual(input.length, 2) ? T.Infer(input[1] as string, T.Unknown()) :
    Unreachable()
  )
}
// deno-coverage-ignore-stop
// -------------------------------------------------------------------
// Type: InferType | Expr
// -------------------------------------------------------------------
export type TTypeMapping<Input extends unknown> = (
  Input
)
export function TypeMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// PropertyKeyNumber: <Number>
// -------------------------------------------------------------------
export type TPropertyKeyNumberMapping<Input extends string> = (
  `${Input}`
)
export function PropertyKeyNumberMapping(input: string): unknown {
  return `${input}`
}
// -------------------------------------------------------------------
// PropertyKeyIdent: <Ident>
// -------------------------------------------------------------------
export type TPropertyKeyIdentMapping<Input extends string> = (
  Input
)
export function PropertyKeyIdentMapping(input: string): unknown {
  return input
}
// -------------------------------------------------------------------
// PropertyKeyQuoted: <String>
// -------------------------------------------------------------------
export type TPropertyKeyQuotedMapping<Input extends string> = (
  Input
)
export function PropertyKeyQuotedMapping(input: string): unknown {
  return input
}
// -------------------------------------------------------------------
// PropertyKeyIndex: ['[', <Ident>, ':', KeywordInteger | KeywordNumber | KeywordString | KeywordSymbol, ']']
// -------------------------------------------------------------------
export type TPropertyKeyIndexMapping<Input extends [unknown, unknown, unknown, unknown, unknown]> = (
  Input extends ['[', string, ':', T.TInteger, ']'] ? T.TIntegerKey :
  Input extends ['[', string, ':', T.TNumber, ']'] ? T.TNumberKey :
  Input extends ['[', string, ':', T.TString, ']'] ? T.TStringKey :
  Input extends ['[', string, ':', T.TSymbol, ']'] ? T.TStringKey :
  never
)
// deno-coverage-ignore-start
export function PropertyKeyIndexMapping(input: [unknown, unknown, unknown, unknown, unknown]): unknown {
  return (
    T.IsInteger(input[3]) ? T.IntegerKey :
    T.IsNumber(input[3]) ? T.NumberKey :
    T.IsSymbol(input[3]) ? T.StringKey :
    T.IsString(input[3]) ? T.StringKey :
    Unreachable()
  )
}
// deno-coverage-ignore-stop
// -------------------------------------------------------------------
// PropertyKey: PropertyKeyNumber | PropertyKeyIdent | PropertyKeyQuoted | PropertyKeyIndex
// -------------------------------------------------------------------
export type TPropertyKeyMapping<Input extends unknown> = (
  Input
)
export function PropertyKeyMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// Readonly: ['readonly'] | []
// -------------------------------------------------------------------
export type TReadonlyMapping<Input extends [unknown] | []> = (
  Input extends [unknown] ? true : false
)
export function ReadonlyMapping(input: [unknown] | []): unknown {
  return input.length > 0
}
// -------------------------------------------------------------------
// Optional: ['?'] | []
// -------------------------------------------------------------------
export type TOptionalMapping<Input extends [unknown] | []> = (
  Input extends [unknown] ? true : false
)
export function OptionalMapping(input: [unknown] | []): unknown {
  return input.length > 0
}
// -------------------------------------------------------------------
// Property: [Readonly, PropertyKey, Optional, ':', Type]
// -------------------------------------------------------------------
export type TPropertyMapping<Input extends [unknown, unknown, unknown, unknown, unknown]> = (
  Input extends [infer IsReadonly extends boolean, infer Key extends string, infer IsOptional extends boolean, string, infer Type extends T.TSchema] ? {
    [_ in Key]: (
      [IsReadonly, IsOptional] extends [true, true] ? T.TReadonlyAdd<T.TOptionalAdd<Type>> :
      [IsReadonly, IsOptional] extends [true, false] ? T.TReadonlyAdd<Type> :
      [IsReadonly, IsOptional] extends [false, true] ? T.TOptionalAdd<Type> :
      Type
    )
  } : never
)
export function PropertyMapping(input: [unknown, unknown, unknown, unknown, unknown]): unknown {
  const [isReadonly, key, isOptional, _colon, type] = input as [boolean, string, boolean, ':', T.TSchema]
  return {
    [key]: (
      isReadonly && isOptional ? T.ReadonlyAdd(T.OptionalAdd(type)) :
      isReadonly && !isOptional ? T.ReadonlyAdd(type) :
      !isReadonly && isOptional ? T.OptionalAdd(type) :
      type
    )
  }
}
// -------------------------------------------------------------------
// PropertyDelimiter: [',', '\n'] | [';', '\n'] | [','] | [';'] | ['\n']
// -------------------------------------------------------------------
export type TPropertyDelimiterMapping<Input extends [unknown, unknown] | [unknown]> = (
  Input
)
export function PropertyDelimiterMapping(input: [unknown, unknown] | [unknown]): unknown {
  return input
}
// -------------------------------------------------------------------
// PropertyList: [[Property, PropertyDelimiter][], [Property] | []]
// -------------------------------------------------------------------
export type TPropertyListMapping<Input extends [unknown, unknown]> = (
  TDelimited<Input>
)
export function PropertyListMapping(input: [unknown, unknown]): unknown {
  return Delimited(input)
}
// -------------------------------------------------------------------
// Properties: ['{', PropertyList, '}']
//
// The PropertyList is separated into two groups:
//
//   [0] - regular properties
//   [1] - [x: number] indexer properties (as patterns)
//
// The Properties action iterates over the keys and moves any entry
// that matches a known index pattern into group [1]. Interestingly,
// as group select is derived from property key match only, the 
// following definitions effectively become equivalent ...
//
//   const _0 = Type.Script('{ [x: string]: number }') // parsed
//   const _1 = Type.Script('{ "^.*$": number }')      // explicit
//
// Where both _0 and _1 are moved into patternProperties [1].
//
// -------------------------------------------------------------------

type TPropertiesReduce<PropertiesList extends T.TProperties[], Result extends [properties: T.TProperties, patternProperties: T.TProperties] = [{}, {}]> = (
  PropertiesList extends [infer Left extends T.TProperties, ...infer Right extends T.TProperties[]]
  ? (
    // [1] patternProperties
    Left extends { [_ in T.TIntegerKey]: T.TSchema } ? TPropertiesReduce<Right, [Result[0], Memory.TAssign<Result[1], Left>]> :
    Left extends { [_ in T.TNumberKey]: T.TSchema }  ? TPropertiesReduce<Right, [Result[0], Memory.TAssign<Result[1], Left>]> :
    Left extends { [_ in T.TStringKey]: T.TSchema }  ? TPropertiesReduce<Right, [Result[0], Memory.TAssign<Result[1], Left>]> :
    // [0] properties
    TPropertiesReduce<Right, [Memory.TAssign<Result[0], Left>, Result[1]]>
  ) : { [Key in keyof Result]: Result[Key] }
)
function PropertiesReduce<PropertyList extends T.TProperties[]>(propertyList: [...PropertyList]): TPropertiesReduce<PropertyList> {
  return propertyList.reduce<[T.TProperties, T.TProperties]>((result, left) => {
    const isPatternProperties = (Guard.HasPropertyKey(left, T.IntegerKey) || Guard.HasPropertyKey(left, T.NumberKey) || Guard.HasPropertyKey(left, T.StringKey))
    // @ts-ignore 5.0.4 - unable to observe ...left on right arm
    return (isPatternProperties 
      ? [result[0], Memory.Assign(result[1], left)]
      : [Memory.Assign(result[0], left), result[1]])
  }, [{}, {}]) as never
}
export type TPropertiesMapping<Input extends [unknown, unknown, unknown],
  Result extends [T.TProperties, T.TProperties] = Input extends ['{', infer PropertyList extends T.TProperties[], '}']
  ? TPropertiesReduce<PropertyList>
  : [{}, {}]
> = Result
export function PropertiesMapping(input: [unknown, unknown, unknown]): unknown {
  return PropertiesReduce(input[1] as T.TProperties[])
}
// -------------------------------------------------------------------
// _Object_: Properties
// -------------------------------------------------------------------
export type T_Object_Mapping<Input extends unknown> = (
  Input extends [infer Properties extends T.TProperties, infer _PatternProperties extends T.TProperties]
  ? T.TObject<Properties>
  : never
)
export function _Object_Mapping(input: unknown): unknown {
  const [properties, patternProperties] = input as [T.TProperties, T.TProperties]
  const options = Guard.IsEqual(Guard.Keys(patternProperties).length, 0) ? {} : { patternProperties }
  return T.Object(properties, options)
}
// -------------------------------------------------------------------
// ElementNamed: [<Ident>, '?', ':', 'readonly', Type] | [<Ident>, ':', 'readonly', Type] | [<Ident>, '?', ':', Type] | [<Ident>, ':', Type]
// -------------------------------------------------------------------
export type TElementNamedMapping<Input extends [unknown, unknown, unknown, unknown, unknown] | [unknown, unknown, unknown, unknown] | [unknown, unknown, unknown]> = (
  Input extends [string, '?', ':', 'readonly', infer Type extends T.TSchema] ? T.TReadonlyAdd<T.TOptionalAdd<Type>> :
  Input extends [string, /**/ ':', 'readonly', infer Type extends T.TSchema] ? T.TReadonlyAdd<Type> :
  Input extends [string, '?', ':', /*      */  infer Type extends T.TSchema] ? T.TOptionalAdd<Type> :
  Input extends [string, /**/ ':', /*      */  infer Type extends T.TSchema] ? Type :
  never
)
// deno-coverage-ignore-start
export function ElementNamedMapping(input: [unknown, unknown, unknown, unknown, unknown] | [unknown, unknown, unknown, unknown] | [unknown, unknown, unknown]): unknown {
  return (
    Guard.IsEqual(input.length, 5) ? T.ReadonlyAdd(T.OptionalAdd(input[4] as T.TSchema)) :
    Guard.IsEqual(input.length, 3) ? input[2] as T.TSchema :
    Guard.IsEqual(input.length, 4) ? (Guard.IsEqual(input[2], 'readonly') ? T.ReadonlyAdd(input[3] as T.TSchema) : T.OptionalAdd(input[3] as T.TSchema)) :
    Unreachable()
  )
}
// deno-coverage-ignore-stop
// -------------------------------------------------------------------
// ElementReadonlyOptional: ['readonly', Type, '?']
// -------------------------------------------------------------------
export type TElementReadonlyOptionalMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends ['readonly', infer Type extends T.TSchema, '?'] ? T.TReadonlyAdd<T.TOptionalAdd<Type>> : never
)
export function ElementReadonlyOptionalMapping(input: [unknown, unknown, unknown]): unknown {
  return T.ReadonlyAdd(T.OptionalAdd(input[1] as T.TSchema))
}
// -------------------------------------------------------------------
// ElementReadonly: ['readonly', Type]
// -------------------------------------------------------------------
export type TElementReadonlyMapping<Input extends [unknown, unknown]> = (
  Input extends ['readonly', infer Type extends T.TSchema] ? T.TReadonlyAdd<Type> : never
)
export function ElementReadonlyMapping(input: [unknown, unknown]): unknown {
  return T.ReadonlyAdd(input[1] as T.TSchema)
}
// -------------------------------------------------------------------
// ElementOptional: [Type, '?']
// -------------------------------------------------------------------
export type TElementOptionalMapping<Input extends [unknown, unknown]> = (
  Input extends [infer Type extends T.TSchema, '?'] ? T.TOptionalAdd<Type> : never
)
export function ElementOptionalMapping(input: [unknown, unknown]): unknown {
  return T.OptionalAdd(input[0] as T.TSchema)
}
// -------------------------------------------------------------------
// ElementBase: ElementNamed | ElementReadonlyOptional | ElementReadonly | ElementOptional | Type
// -------------------------------------------------------------------
export type TElementBaseMapping<Input extends unknown> = (
  Input
)
export function ElementBaseMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// Element: ['...', ElementBase] | [ElementBase]
// -------------------------------------------------------------------
export type TElementMapping<Input extends [unknown, unknown] | [unknown]> = (
  Input extends ['...', infer Type extends T.TSchema] ? T.TRest<Type> :
  Input extends [infer Type extends T.TSchema] ? Type :
  never
)
// deno-coverage-ignore-start
export function ElementMapping(input: [unknown, unknown] | [unknown]): unknown {
  return (
    Guard.IsEqual(input.length, 2) ? T.Rest(input[1] as T.TSchema) :
    Guard.IsEqual(input.length, 1) ? input[0] as T.TSchema :
    Unreachable()
  )
}
// deno-coverage-ignore-stop
// -------------------------------------------------------------------
// ElementList: [[Element, ','][], [Element] | []]
// -------------------------------------------------------------------
export type TElementListMapping<Input extends [unknown, unknown]> = (
  TDelimited<Input>
)
export function ElementListMapping(input: [unknown, unknown]): unknown {
  return Delimited(input)
}
// -------------------------------------------------------------------
// Tuple: ['[', ElementList, ']']
// -------------------------------------------------------------------
export type TTupleMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends ['[', infer Types extends T.TSchema[], ']'] ? T.TTuple<Types> : never
)
export function TupleMapping(input: [unknown, unknown, unknown]): unknown {
  return T.Tuple(input[1] as T.TSchema[])
}
// -------------------------------------------------------------------
// ParameterReadonlyOptional: [<Ident>, '?', ':', 'readonly', Type]
// -------------------------------------------------------------------
export type TParameterReadonlyOptionalMapping<Input extends [unknown, unknown, unknown, unknown, unknown]> = (
  Input extends [string, '?', ':', 'readonly', infer Type extends T.TSchema] ? T.TReadonlyAdd<T.TOptionalAdd<Type>> : never
)
export function ParameterReadonlyOptionalMapping(input: [unknown, unknown, unknown, unknown, unknown]): unknown {
  return T.ReadonlyAdd(T.OptionalAdd(input[4] as T.TSchema))
}
// -------------------------------------------------------------------
// ParameterReadonly: [<Ident>, ':', 'readonly', Type]
// -------------------------------------------------------------------
export type TParameterReadonlyMapping<Input extends [unknown, unknown, unknown, unknown]> = (
  Input extends [string, ':', 'readonly', infer Type extends T.TSchema] ? T.TReadonlyAdd<Type> : never
)
export function ParameterReadonlyMapping(input: [unknown, unknown, unknown, unknown]): unknown {
  return T.ReadonlyAdd(input[3] as T.TSchema)
}
// -------------------------------------------------------------------
// ParameterOptional: [<Ident>, '?', ':', Type]
// -------------------------------------------------------------------
export type TParameterOptionalMapping<Input extends [unknown, unknown, unknown, unknown]> = (
  Input extends [string, '?', ':', infer Type extends T.TSchema] ? T.TOptionalAdd<Type> : never
)
export function ParameterOptionalMapping(input: [unknown, unknown, unknown, unknown]): unknown {
  return T.OptionalAdd(input[3] as T.TSchema)
}
// -------------------------------------------------------------------
// ParameterType: [<Ident>, ':', Type]
// -------------------------------------------------------------------
export type TParameterTypeMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends [string, ':', infer Type extends T.TSchema] ? Type : never
)
export function ParameterTypeMapping(input: [unknown, unknown, unknown]): unknown {
  return input[2] as T.TSchema
}
// -------------------------------------------------------------------
// ParameterBase: ParameterReadonlyOptional | ParameterReadonly | ParameterOptional | ParameterType
// -------------------------------------------------------------------
export type TParameterBaseMapping<Input extends unknown> = (
  Input
)
export function ParameterBaseMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// Parameter: ['...', ParameterBase] | [ParameterBase]
// -------------------------------------------------------------------
export type TParameterMapping<Input extends [unknown, unknown] | [unknown]> = (
  Input extends ['...', infer Type extends T.TSchema] ? T.TRest<Type> :
  Input extends [infer Type extends T.TSchema] ? Type :
  never
)
// deno-coverage-ignore-start
export function ParameterMapping(input: [unknown, unknown] | [unknown]): unknown {
  return (
    Guard.IsEqual(input.length, 2) ? T.Rest(input[1] as T.TSchema) :
    Guard.IsEqual(input.length, 1) ? input[0] as T.TSchema :
    Unreachable()
  )
}
// deno-coverage-ignore-stop
// -------------------------------------------------------------------
// ParameterList: [[Parameter, ','][], [Parameter] | []]
// -------------------------------------------------------------------
export type TParameterListMapping<Input extends [unknown, unknown]> = (
  TDelimited<Input>
)
export function ParameterListMapping(input: [unknown, unknown]): unknown {
  return Delimited(input)
}
// -------------------------------------------------------------------
// Function: ['(', ParameterList, ')', '=>', Type]
// -------------------------------------------------------------------
export type TFunctionMapping<Input extends [unknown, unknown, unknown, unknown, unknown]> = (
  Input extends ['(', infer ParameterList extends T.TSchema[], ')', '=>', infer ReturnType extends T.TSchema]
    ? T.TFunction<ParameterList, ReturnType>
    : never
)
export function FunctionMapping(input: [unknown, unknown, unknown, unknown, unknown]): unknown {
  return T.Function(input[1] as T.TSchema[], input[4] as T.TSchema)
}
// -------------------------------------------------------------------
// Constructor: ['new', '(', ParameterList, ')', '=>', Type]
// -------------------------------------------------------------------
export type TConstructorMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown]> = (
  Input extends ['new', '(', infer ParameterList extends T.TSchema[], ')', '=>', infer InstanceType extends T.TSchema]
    ? T.TConstructor<ParameterList, InstanceType>
    : never
)
export function ConstructorMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown]): unknown {
  return T.Constructor(input[2] as T.TSchema[], input[5] as T.TSchema)
}
// -------------------------------------------------------------------
// TModifierOperation
// -------------------------------------------------------------------
type TModifierOperation = 'add' | 'remove' | 'none'
// -------------------------------------------------------------------
// MappedReadonly: ['+', 'readonly'] | ['-', 'readonly'] | ['readonly'] | []
// -------------------------------------------------------------------
type TApplyReadonly<Readonly extends TModifierOperation, Type extends T.TSchema> = (
  Readonly extends 'remove' ? C.TReadonlyRemoveAction<Type> :
  Readonly extends 'add' ? C.TReadonlyAddAction<Type> :
  Type
)
function ApplyReadonly(state: TModifierOperation, type: T.TSchema) {
  return (
    Guard.IsEqual(state, 'remove') ? C.ReadonlyRemoveAction(type) :
    Guard.IsEqual(state, 'add') ? C.ReadonlyAddAction(type) :
    type
  )
}
export type TMappedReadonlyMapping<Input extends [unknown, unknown] | [unknown] | []> = (
  Input extends ['-', 'readonly'] ? 'remove' :
  Input extends ['+', 'readonly'] ? 'add' :
  Input extends ['readonly'] ? 'add' :
  'none'
)
export function MappedReadonlyMapping(input: [unknown, unknown] | [unknown] | []): unknown {
  return (
    Guard.IsEqual(input.length, 2) && Guard.IsEqual(input[0], '-') ? 'remove' :
    Guard.IsEqual(input.length, 2) && Guard.IsEqual(input[0], '+') ? 'add' :
    Guard.IsEqual(input.length, 1) ? 'add' :
    'none'
  )
}
// -------------------------------------------------------------------
// MappedOptional: ['+', '?'] | ['-', '?'] | ['?'] | []
// -------------------------------------------------------------------
type TApplyOptional<Optional extends TModifierOperation, Type extends T.TSchema> = (
  Optional extends 'remove' ? C.TOptionalRemoveAction<Type> :
  Optional extends 'add' ? C.TOptionalAddAction<Type> :
  Type
)
function ApplyOptional(state: TModifierOperation, type: T.TSchema) {
  return (
    Guard.IsEqual(state, 'remove') ? C.OptionalRemoveAction(type) :
    Guard.IsEqual(state, 'add') ? C.OptionalAddAction(type) :
    type
  )
}
export type TMappedOptionalMapping<Input extends [unknown, unknown] | [unknown] | []> = (
  Input extends ['-', '?'] ? 'remove' :
  Input extends ['+', '?'] ? 'add' :
  Input extends ['?'] ? 'add' :
  'none'
)
export function MappedOptionalMapping(input: [unknown, unknown] | [unknown] | []): unknown {
  return (
    Guard.IsEqual(input.length, 2) && Guard.IsEqual(input[0], '-') ? 'remove' :
    Guard.IsEqual(input.length, 2) && Guard.IsEqual(input[0], '+') ? 'add' :
    Guard.IsEqual(input.length, 1) ? 'add' :
    'none'
  )
}
// -------------------------------------------------------------------
// MappedAs: ['as', Type] | []
// -------------------------------------------------------------------
export type TMappedAsMapping<Input extends [unknown, unknown] | []> = (
  Input extends ['as', infer Type extends T.TSchema] ? [Type] : []
)
export function MappedAsMapping(input: [unknown, unknown] | []): unknown {
  return Guard.IsEqual(input.length, 2) ? [input[1]] : []
}
// -------------------------------------------------------------------
// Mapped: ['{', MappedReadonly, '[', <Ident>, 'in', Type, MappedAs, ']', MappedOptional, ':', Type, OptionalSemiColon, '}']
// -------------------------------------------------------------------
export type TMappedMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]> = (
  Input extends ['{', infer Readonly extends TModifierOperation, '[', infer Key extends string, 'in', infer Union extends T.TSchema, infer As extends T.TSchema[], ']', infer Optional extends TModifierOperation, ':', infer Type extends T.TSchema, null, '}']
    ? (As extends [infer As extends T.TSchema]
      ? C.TMappedDeferred<T.TIdentifier<Key>, Union, As, TApplyReadonly<Readonly, TApplyOptional<Optional, Type>>>
      : C.TMappedDeferred<T.TIdentifier<Key>, Union, T.TRef<Key>, TApplyReadonly<Readonly, TApplyOptional<Optional, Type>>>
    ) : never
)
export function MappedMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]): unknown {
  return (
    Guard.IsArray(input[6]) && Guard.IsEqual(input[6].length, 1)
      ? C.MappedDeferred(T.Identifier(input[3] as string), input[5] as T.TSchema, input[6][0] as T.TSchema, ApplyReadonly(input[1] as TModifierOperation, ApplyOptional(input[8] as TModifierOperation, input[10] as T.TSchema)))
      : C.MappedDeferred(T.Identifier(input[3] as string), input[5] as T.TSchema, T.Ref(input[3] as string), ApplyReadonly(input[1] as TModifierOperation, ApplyOptional(input[8] as TModifierOperation, input[10] as T.TSchema)))
  )
}
// -------------------------------------------------------------------
// Reference: <Ident>
// -------------------------------------------------------------------
export type TReferenceMapping<Input extends string,
  Result extends T.TSchema = T.TRef<Input>
> = Result
export function ReferenceMapping(input: string): unknown {
  return T.Ref(input)
}
// -------------------------------------------------------------------
// Options: ['Options', '<', Type, ',', JsonObject, '>']
// -------------------------------------------------------------------
export type TOptionsMapping<Input extends [unknown, unknown, unknown, unknown, unknown, unknown]> = (
  Input extends ['Options', '<', infer Type extends T.TSchema, ',', infer Options extends T.TSchemaOptions, '>']
    ? C.TOptionsDeferred<Type, Options>
    : never
)
export function OptionsMapping(input: [unknown, unknown, unknown, unknown, unknown, unknown]): unknown {
  return C.OptionsDeferred(input[2] as T.TSchema, input[4] as T.TSchema)
}
// -------------------------------------------------------------------
// JsonNumber: <Number>
// -------------------------------------------------------------------
export type TJsonNumberMapping<Input extends string> = (
  Input extends `${infer Value extends number}` ? Value : never
)
export function JsonNumberMapping(input: string): unknown {
  return parseFloat(input)
}
// -------------------------------------------------------------------
// JsonBoolean: 'true' | 'false'
// -------------------------------------------------------------------
export type TJsonBooleanMapping<Input extends 'true' | 'false'> = (
  Input extends 'true' ? true : false
)
export function JsonBooleanMapping(input: 'true' | 'false'): unknown {
  return Guard.IsEqual(input, 'true')
}
// -------------------------------------------------------------------
// JsonString: <String>
// -------------------------------------------------------------------
export type TJsonStringMapping<Input extends string> = (
  Input
)
export function JsonStringMapping(input: string): unknown {
  return input
}
// -------------------------------------------------------------------
// JsonNull: 'null'
// -------------------------------------------------------------------
export type TJsonNullMapping<Input extends 'null'> = (
  null
)
export function JsonNullMapping(input: 'null'): unknown {
  return null
}
// -------------------------------------------------------------------
// JsonProperty: [PropertyKey, ':', Json]
// -------------------------------------------------------------------
export type TJsonPropertyMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends [infer Key extends string, ':', infer Value extends unknown]
    ? { [_ in Key]: Value }
    : never
)
export function JsonPropertyMapping(input: [unknown, unknown, unknown]): unknown {
  return { [input[0] as string]: input[2] as unknown }
}
// -------------------------------------------------------------------
// JsonPropertyList: [[JsonProperty, PropertyDelimiter][], [JsonProperty] | []]
// -------------------------------------------------------------------
export type TJsonPropertyListMapping<Input extends [unknown, unknown]> = (
  TDelimited<Input>
)
export function JsonPropertyListMapping(input: [unknown, unknown]): unknown {
  return Delimited(input)
}
// -------------------------------------------------------------------
// JsonObject: ['{', JsonPropertyList, '}']
// -------------------------------------------------------------------
type TJsonObjectMappingReduce<PropertyList extends Record<PropertyKey, unknown>[], Result extends Record<PropertyKey, unknown> = {}> = (
  PropertyList extends [infer Left extends Record<PropertyKey, unknown>, ...infer Right extends Record<PropertyKey, unknown>[]]
    ? TJsonObjectMappingReduce<Right, Memory.TAssign<Result, Left>>
    : { [Key in keyof Result]: Result[Key] }
)
function JsonObjectMappingReduce<PropertyList extends Record<PropertyKey, unknown>[]>(propertyList: [...PropertyList]): TJsonObjectMappingReduce<PropertyList> {
  return propertyList.reduce((result, left) => {
    return Memory.Assign(result, left)
  }, {} as T.TProperties) as never
}
// ...
export type TJsonObjectMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends ['{', infer PropertyList extends Record<PropertyKey, unknown>[], '}']
    ? TJsonObjectMappingReduce<PropertyList>
    : {}
)
export function JsonObjectMapping(input: [unknown, unknown, unknown]): unknown {
  return JsonObjectMappingReduce(input[1] as Record<PropertyKey, unknown>[])
}
// -------------------------------------------------------------------
// JsonElementList: [[Json, ','][], [Json] | []]
// -------------------------------------------------------------------
export type TJsonElementListMapping<Input extends [unknown, unknown]> = (
  TDelimited<Input>
)
export function JsonElementListMapping(input: [unknown, unknown]): unknown {
  return Delimited(input)
}
// -------------------------------------------------------------------
// JsonArray: ['[', JsonElementList, ']']
// -------------------------------------------------------------------
export type TJsonArrayMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends ['[', infer Elements extends unknown[], ']']
    ? Elements
    : never
)
export function JsonArrayMapping(input: [unknown, unknown, unknown]): unknown {
  return input[1] as unknown[]
}
// -------------------------------------------------------------------
// Json: JsonNumber | JsonBoolean | JsonString | JsonNull | JsonObject | JsonArray
// -------------------------------------------------------------------
export type TJsonMapping<Input extends unknown> = (
  Input
)
export function JsonMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// PatternBigInt: '-?(?:0|[1-9][0-9]*)n'
// -------------------------------------------------------------------
export type TPatternBigIntMapping<Input extends '-?(?:0|[1-9][0-9]*)n'> = (
  T.TBigInt
)
export function PatternBigIntMapping(input: '-?(?:0|[1-9][0-9]*)n'): unknown {
  return T.BigInt()
}
// -------------------------------------------------------------------
// PatternString: '.*'
// -------------------------------------------------------------------
export type TPatternStringMapping<Input extends '.*'> = (
  T.TString
)
export function PatternStringMapping(input: '.*'): unknown {
  return T.String()
}
// -------------------------------------------------------------------
// PatternNumber: '-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?'
// -------------------------------------------------------------------
export type TPatternNumberMapping<Input extends '-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?'> = (
  T.TNumber
)
export function PatternNumberMapping(input: '-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?'): unknown {
  return T.Number()
}
// -------------------------------------------------------------------
// PatternInteger: '-?(?:0|[1-9][0-9]*)'
// -------------------------------------------------------------------
export type TPatternIntegerMapping<Input extends '-?(?:0|[1-9][0-9]*)'> = (
  T.TInteger
)
export function PatternIntegerMapping(input: '-?(?:0|[1-9][0-9]*)'): unknown {
  return T.Integer()
}
// -------------------------------------------------------------------
// PatternNever: '(?!)'
// -------------------------------------------------------------------
export type TPatternNeverMapping<Input extends '(?!)'> = (
  T.TNever
)
export function PatternNeverMapping(input: '(?!)'): unknown {
  return T.Never()
}
// -------------------------------------------------------------------
// PatternText: string
// -------------------------------------------------------------------
export type TPatternTextMapping<Input extends string,
  Result extends T.TSchema = T.TLiteral<Input>
> = Result
export function PatternTextMapping(input: string): unknown {
  return T.Literal(input)
}
// -------------------------------------------------------------------
// PatternBase: PatternBigInt | PatternString | PatternNumber | PatternInteger | PatternNever | PatternGroup | PatternText
// -------------------------------------------------------------------
export type TPatternBaseMapping<Input extends unknown> = (
  Input
)
export function PatternBaseMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// PatternGroup: ['(', PatternBody, ')']
// -------------------------------------------------------------------
export type TPatternGroupMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends ['(', infer Body extends T.TSchema[], ')'] ? T.TUnion<Body> : never
)
export function PatternGroupMapping(input: [unknown, unknown, unknown]): unknown {
  return T.Union(input[1] as T.TSchema[])
}
// -------------------------------------------------------------------
// PatternUnion: [PatternTerm, '|', PatternUnion] | [PatternTerm] | []
// -------------------------------------------------------------------
export type TPatternUnionMapping<Input extends [unknown, unknown, unknown] | [unknown] | []> = (
  Input extends [infer Term extends T.TSchema[], '|', infer Union extends T.TSchema[]] ? [...Term, ...Union] :
  Input extends [infer Term extends T.TSchema[]] ? [...Term] :
  []
)
export function PatternUnionMapping(input: [unknown, unknown, unknown] | [unknown] | []): unknown {
  return (
    input.length === 3 ? [...input[0] as unknown[], ...input[2] as unknown[]] :
    input.length === 1 ? [...input[0] as unknown[]] :
    []
  )
}
// -------------------------------------------------------------------
// PatternTerm: [PatternBase, PatternBody]
// -------------------------------------------------------------------
export type TPatternTermMapping<Input extends [unknown, unknown]> = (
  Input extends [infer Left extends T.TSchema, infer Right extends T.TSchema[]]
  ? [Left, ...Right]
  : never
)
export function PatternTermMapping(input: [unknown, unknown]): unknown {
  return [input[0], ...input[1] as unknown[]]
}
// -------------------------------------------------------------------
// PatternBody: PatternUnion | PatternTerm
// -------------------------------------------------------------------
export type TPatternBodyMapping<Input extends unknown> = (
  Input
)
export function PatternBodyMapping(input: unknown): unknown {
  return input
}
// -------------------------------------------------------------------
// Pattern: ['^', PatternBody, '$']
// -------------------------------------------------------------------
export type TPatternMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends ['^', infer Body extends T.TSchema[], '$'] ? Body : never
)
export function PatternMapping(input: [unknown, unknown, unknown]): unknown {
  return input[1]
}
// -------------------------------------------------------------------
// InterfaceDeclarationHeritageList: [[Type, ','][], [Type] | []]
// -------------------------------------------------------------------
export type TInterfaceDeclarationHeritageListMapping<Input extends [unknown, unknown]> = (
  TDelimited<Input>
)
export function InterfaceDeclarationHeritageListMapping(input: [unknown, unknown]): unknown {
  return Delimited(input)
}
// -------------------------------------------------------------------
// InterfaceDeclarationHeritage: ['extends', InterfaceDeclarationHeritageList] | []
// -------------------------------------------------------------------
export type TInterfaceDeclarationHeritageMapping<Input extends [unknown, unknown] | []> = (
  Input extends ['extends', infer Heritage extends T.TSchema[]]
    ? Heritage
    : []
)
export function InterfaceDeclarationHeritageMapping(input: [unknown, unknown] | []): unknown {
  return Guard.IsEqual(input.length, 2) ? input[1] as T.TSchema : []
}
// -------------------------------------------------------------------
// InterfaceDeclarationGeneric: ['interface', <Ident>, GenericParameters, InterfaceDeclarationHeritage, Properties]
// -------------------------------------------------------------------
export type TInterfaceDeclarationGenericMapping<Input extends [unknown, unknown, unknown, unknown, unknown]> = (
  Input extends ['interface', infer Name extends string, infer Parameters extends T.TParameter[], infer Heritage extends T.TSchema[], infer Properties extends [T.TProperties, T.TProperties]]
    ? { [_ in Name]: T.TGeneric<Parameters, C.TInterfaceDeferred<Heritage, Properties[0]>> }
    : never
)
export function InterfaceDeclarationGenericMapping(input: [unknown, unknown, unknown, unknown, unknown]): unknown {
  const parameters = input[2] as T.TParameter[]
  const heritage = input[3] as T.TSchema[]
  const [properties, patternProperties] = input[4] as [T.TProperties, T.TProperties]
  const options = Guard.IsEqual(Guard.Keys(patternProperties).length, 0) ? {} : { patternProperties }
  return { [input[1] as string]: T.Generic(parameters, C.InterfaceDeferred(heritage, properties, options)) }
}
// -------------------------------------------------------------------
// InterfaceDeclaration: ['interface', <Ident>, InterfaceDeclarationHeritage, Properties]
// -------------------------------------------------------------------
export type TInterfaceDeclarationMapping<Input extends [unknown, unknown, unknown, unknown]> = (
  Input extends ['interface', infer Name extends string, infer Heritage extends T.TSchema[], infer Properties extends [T.TProperties, T.TProperties]]
  ? { [_ in Name]: C.TInterfaceDeferred<Heritage, Properties[0]> }
  : never
)
export function InterfaceDeclarationMapping(input: [unknown, unknown, unknown, unknown]): unknown {
  const heritage = input[2] as T.TSchema[]
  const [properties, patternProperties] =  input[3] as [T.TProperties, T.TProperties]
  const options = Guard.IsEqual(Guard.Keys(patternProperties).length, 0) ? {} : { patternProperties }
  return { [input[1] as string]: C.InterfaceDeferred(heritage, properties, options) }
}
// -------------------------------------------------------------------
// TypeAliasDeclarationGeneric: ['type', <Ident>, GenericParameters, '=', Type]
// -------------------------------------------------------------------
export type TTypeAliasDeclarationGenericMapping<Input extends [unknown, unknown, unknown, unknown, unknown]> = (
  Input extends ['type', infer Name extends string, infer Parameters extends T.TParameter[], '=', infer Type extends T.TSchema]
    ? { [_ in Name]: T.TGeneric<Parameters, Type> }
    : never
)
export function TypeAliasDeclarationGenericMapping(input: [unknown, unknown, unknown, unknown, unknown]): unknown {
  return { [input[1] as string]: T.Generic(input[2] as T.TParameter[], input[4] as T.TSchema) }
}
// -------------------------------------------------------------------
// TypeAliasDeclaration: ['type', <Ident>, '=', Type]
// -------------------------------------------------------------------
export type TTypeAliasDeclarationMapping<Input extends [unknown, unknown, unknown, unknown]> = (
  Input extends ['type', infer Name extends string, '=', infer Type extends T.TSchema]
    ? { [_ in Name]: Type }
    : never
)
export function TypeAliasDeclarationMapping(input: [unknown, unknown, unknown, unknown]): unknown {
  return { [input[1] as string]: input[3] }
}
// -------------------------------------------------------------------
// ExportKeyword: ['export'] | []
// -------------------------------------------------------------------
export type TExportKeywordMapping<Input extends [unknown] | []> = (
  null // ignored-dont-care
)
export function ExportKeywordMapping(input: [unknown] | []): unknown {
  return null // ignored-dont-care
}

// -------------------------------------------------------------------
// ModuleDeclarationDelimiter: [';', '\n'] | [';'] | ['\n']
// -------------------------------------------------------------------
export type TModuleDeclarationDelimiterMapping<Input extends [unknown, unknown] | [unknown]> = (
  Input
)
export function ModuleDeclarationDelimiterMapping(input: [unknown, unknown] | [unknown]): unknown {
  return input
}
// -------------------------------------------------------------------
// ModuleDeclarationList: [[ModuleDeclaration, ModuleDeclarationDelimiter][], [ModuleDeclaration] | []]
// -------------------------------------------------------------------
export type TModuleDeclarationListMapping<Input extends [unknown, unknown]> = (
  TPropertiesReduce<TDelimited<Input>>
)
export function ModuleDeclarationListMapping(input: [unknown, unknown]): unknown {
  return PropertiesReduce(Delimited(input) as never)
}
// -------------------------------------------------------------------
// ModuleDeclaration: [ExportKeyword, InterfaceDeclarationGeneric | InterfaceDeclaration | TypeAliasDeclarationGeneric | TypeAliasDeclaration, OptionalSemiColon]
// -------------------------------------------------------------------
export type TModuleDeclarationMapping<Input extends [unknown, unknown, unknown]> = (
  Input extends [null, infer ModuleDeclaration extends T.TProperties, null]
    ? ModuleDeclaration
    : never
)
export function ModuleDeclarationMapping(input: [unknown, unknown, unknown]): unknown {
  return input[1] as T.TProperties
}
// -------------------------------------------------------------------
// Module: [ModuleDeclaration, ModuleDeclarationList]
// -------------------------------------------------------------------
export type TModuleMapping<Input extends [unknown, unknown]> = (
  Input extends [infer ModuleDeclaration extends T.TProperties, infer ModuleDeclarationList extends [T.TProperties, T.TProperties]]
    ? C.TModuleDeferred<Memory.TAssign<ModuleDeclaration, ModuleDeclarationList[0]>>
    : never
)
export function ModuleMapping(input: [unknown, unknown]): unknown {
  const moduleDeclaration = input[0] as T.TProperties
  const moduleDeclarationList = input[1] as [T.TProperties, T.TProperties]
  return C.ModuleDeferred(Memory.Assign(moduleDeclaration, moduleDeclarationList[0]))
}
// -------------------------------------------------------------------
// Script: Module | GenericType | Type
// -------------------------------------------------------------------
export type TScriptMapping<Input extends unknown> = (
  Input
)
export function ScriptMapping(input: unknown): unknown {
  return input
}