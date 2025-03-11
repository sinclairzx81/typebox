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

import { Static } from '../parser/index'
import * as t from '../type/index'

// ------------------------------------------------------------------
// Tokens
// ------------------------------------------------------------------
type Newline = '\n'
type LBracket = '['
type RBracket = ']'
type LParen = '('
type RParen = ')'
type LBrace = '{'
type RBrace = '}'
type LAngle = '<'
type RAngle = '>'
type Question = '?'
type Colon = ':'
type Comma = ','
type SemiColon = ';'
type SingleQuote = "'"
type DoubleQuote = '"'
type Tilde = '`'
type Equals = '='

// ------------------------------------------------------------------
// Delimit
// ------------------------------------------------------------------
// prettier-ignore
type DelimitHeadReduce<Elements extends unknown[], Result extends unknown[] = []> = (
  Elements extends [infer Left extends unknown, ...infer Right extends unknown[]]
    ? Left extends [infer Element, infer _Delimiter]
      ? DelimitHeadReduce<Right, [...Result, Element]>
      : DelimitHeadReduce<Right, Result>
    : Result
)
// prettier-ignore
interface DelimitHeadMapping extends Static.IMapping {
  output: this['input'] extends unknown[] 
    ? DelimitHeadReduce<this['input']> 
    : []
}
// prettier-ignore
type DelimitHead<Element extends Static.IParser, Delimiter extends Static.IParser> = (
  Static.Array<Static.Tuple<[Element, Delimiter]>, DelimitHeadMapping>
)
// prettier-ignore
type DelimitTail<Element extends Static.IParser> = Static.Union<[
  Static.Tuple<[Element]>,
  Static.Tuple<[]>,
]>
// prettier-ignore
interface DelimitMapping extends Static.IMapping {
  output: this['input'] extends [infer Left extends unknown[], infer Right extends unknown[]]
    ? [...Left, ...Right]
    : []
}
// prettier-ignore
type Delimit<Element extends Static.IParser, Delimiter extends Static.IParser> = Static.Tuple<[
  DelimitHead<Element, Delimiter>,
  DelimitTail<Element>
], DelimitMapping>

// ------------------------------------------------------------------
// Dereference
// ------------------------------------------------------------------
// prettier-ignore
type Dereference<Context extends t.TProperties, Ref extends string> = (
  Ref extends keyof Context ? Context[Ref] : t.TRef<Ref>
)

// ------------------------------------------------------------------
// GenericArguments
// ------------------------------------------------------------------
// prettier-ignore
type GenericArgumentsContext<Args extends string[], Context extends t.TProperties, Result extends t.TProperties = {}> = (
  Args extends [...infer Left extends string[], infer Right extends string]
    ? GenericArgumentsContext<Left, Context, Result & { [_ in Right]: t.TArgument<Left['length']> }>
    : t.Evaluate<Result & Context>
)
// prettier-ignore
interface GenericArgumentsMapping extends Static.IMapping {
  output: this['input'] extends [LAngle, infer Args extends string[], RAngle]
    ? this['context'] extends infer Context extends t.TProperties
        ? GenericArgumentsContext<Args, Context>
        : never
    : never
}
type GenericArgumentsList = Delimit<Static.Ident, Static.Const<Comma>>
// prettier-ignore
type GenericArguments = Static.Tuple<[
  Static.Const<LAngle>,
  GenericArgumentsList,
  Static.Const<RAngle>,
], GenericArgumentsMapping>

// ------------------------------------------------------------------
// GenericReference
// ------------------------------------------------------------------
// prettier-ignore
interface GenericReferenceMapping extends Static.IMapping {
  output: this['context'] extends t.TProperties
    ? this['input'] extends [infer Reference extends string, LAngle, infer Args extends t.TSchema[], RAngle]
      ? t.TInstantiate<Dereference<this['context'], Reference>, Args>
      : never
    : never  
}
type GenericReferenceParameters = Delimit<Type, Static.Const<Comma>>
// prettier-ignore
type GenericReference = Static.Tuple<[
  Static.Ident,
  Static.Const<LAngle>,
  GenericReferenceParameters,
  Static.Const<RAngle>,
], GenericReferenceMapping>

// ------------------------------------------------------------------
// Reference
// ------------------------------------------------------------------
// prettier-ignore
interface ReferenceMapping extends Static.IMapping {
  output: this['context'] extends t.TProperties
    ? this['input'] extends string
      ? Dereference<this['context'], this['input']>
      : never
    : never  
}
type Reference = Static.Ident<ReferenceMapping>

// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
// prettier-ignore
interface LiteralBooleanMapping extends Static.IMapping {
  output: this['input'] extends `${infer Value extends boolean}` ? t.TLiteral<Value> : never
}
// prettier-ignore
interface LiteralNumberMapping extends Static.IMapping {
  output: this['input'] extends `${infer Value extends number}` ? t.TLiteral<Value> : never
}
// prettier-ignore
interface LiteralStringMapping extends Static.IMapping {
  output: this['input'] extends `${infer Value extends string}` ? t.TLiteral<Value> : never
}
// prettier-ignore
type Literal = Static.Union<[
  Static.Union<[Static.Const<'true'>, Static.Const<'false'>], LiteralBooleanMapping>,
  Static.Number<LiteralNumberMapping>,
  Static.String<[DoubleQuote, SingleQuote, Tilde], LiteralStringMapping>,
]>

// ------------------------------------------------------------------
// Keyword
// ------------------------------------------------------------------
// prettier-ignore
type Keyword = Static.Union<[
  Static.Const<'string', Static.As<t.TString>>,
  Static.Const<'number', Static.As<t.TNumber>>,
  Static.Const<'boolean', Static.As<t.TBoolean>>,
  Static.Const<'undefined', Static.As<t.TUndefined>>,
  Static.Const<'null', Static.As<t.TNull>>,
  Static.Const<'integer', Static.As<t.TInteger>>,
  Static.Const<'bigint', Static.As<t.TBigInt>>,
  Static.Const<'unknown', Static.As<t.TUnknown>>,
  Static.Const<'any', Static.As<t.TAny>>,
  Static.Const<'never', Static.As<t.TNever>>,
  Static.Const<'symbol', Static.As<t.TSymbol>>,
  Static.Const<'void', Static.As<t.TVoid>>,
]>

// ------------------------------------------------------------------
// KeyOf
// ------------------------------------------------------------------
// prettier-ignore
interface KeyOfMapping extends Static.IMapping {
  output: this['input'] extends [] ? false : true
}
// prettier-ignore
type KeyOf = Static.Union<[
  Static.Tuple<[Static.Const<'keyof'>]>,
  Static.Tuple<[]>
], KeyOfMapping>

// ------------------------------------------------------------------
// IndexArray
// ------------------------------------------------------------------
// prettier-ignore
type IndexArrayReduce<Values extends unknown[], Result extends unknown[] = []> = (
  Values extends [infer Left extends unknown, ...infer Right extends unknown[]]
    ? Left extends [LBracket, infer Type extends t.TSchema, RBracket] 
      ? IndexArrayReduce<Right, [...Result, [Type]]>
      : IndexArrayReduce<Right, [...Result, []]>
    : Result
)
// prettier-ignore
interface IndexArrayMapping extends Static.IMapping {
  output: this['input'] extends unknown[] 
    ? IndexArrayReduce<this['input']> 
    : []
}
// prettier-ignore
type IndexArray = Static.Array<Static.Union<[
  Static.Tuple<[Static.Const<LBracket>, Type, Static.Const<RBracket>,]>,
  Static.Tuple<[Static.Const<LBracket>, Static.Const<RBracket>]>,
]>, IndexArrayMapping>

// ------------------------------------------------------------------
// Extends
// ------------------------------------------------------------------
// prettier-ignore
interface ExtendsMapping extends Static.IMapping {
  output: this['input'] extends ['extends', infer Type extends t.TSchema, Question, infer True extends t.TSchema, Colon, infer False extends t.TSchema]
    ? [Type, True, False]
    : []
}
// prettier-ignore
type Extends = Static.Union<[
  Static.Tuple<[Static.Const<'extends'>, Type, Static.Const<Question>, Type, Static.Const<Colon>, Type]>,
  Static.Tuple<[]>
], ExtendsMapping>

// ------------------------------------------------------------------
// Base
// ------------------------------------------------------------------
// prettier-ignore
interface BaseMapping extends Static.IMapping {
  output: (
    this['input'] extends [LParen, infer Type extends t.TSchema, RParen] ? Type :
    this['input'] extends infer Type extends t.TSchema ? Type :
    never
  )
}
// prettier-ignore
type Base = Static.Union<[
  Static.Tuple<[Static.Const<LParen>, Type, Static.Const<RParen>]>,
  Keyword,
  Object, 
  Tuple,
  Literal,
  Function,
  Constructor,
  Mapped,
  AsyncIterator,
  Iterator,
  ConstructorParameters,
  FunctionParameters,
  Argument,
  InstanceType,
  ReturnType,
  Awaited,
  Array,
  Record,
  Promise,
  Partial,
  Required,
  Pick,
  Omit,
  Exclude,
  Extract,
  Lowercase,
  Uppercase,
  Capitalize,
  Uncapitalize,
  Date,
  Uint8Array,
  GenericReference,
  Reference
], BaseMapping>

// ------------------------------------------------------------------
// Factor
// ------------------------------------------------------------------
// prettier-ignore
type FactorExtends<Type extends t.TSchema, Extends extends unknown[]> = (
  Extends extends [infer Right extends t.TSchema, infer True extends t.TSchema, infer False extends t.TSchema] 
    ? t.TExtends<Type, Right, True, False>
    : Type
)
// prettier-ignore
type FactorIndexArray<Type extends t.TSchema, IndexArray extends unknown[]> = (
  IndexArray extends [...infer Left extends unknown[], infer Right extends t.TSchema[]] ? (
    Right extends [infer Indexer extends t.TSchema] ? t.TIndex<FactorIndexArray<Type, Left>, t.TIndexPropertyKeys<Indexer>> : 
    Right extends [] ? t.TArray<FactorIndexArray<Type, Left>> :
    t.TNever
  ) : Type
)
// prettier-ignore
interface FactorMapping extends Static.IMapping {
  output: this['input'] extends [infer KeyOf extends boolean, infer Type extends t.TSchema, infer IndexArray extends unknown[], infer Extends extends unknown[]]
  ? KeyOf extends true
    ? FactorExtends<t.TKeyOf<FactorIndexArray<Type, IndexArray>>, Extends>
    : FactorExtends<FactorIndexArray<Type, IndexArray>, Extends>
  : never
}
// prettier-ignore
type Factor = Static.Tuple<[
  KeyOf, Base, IndexArray, Extends
], FactorMapping>

// ------------------------------------------------------------------
// Expr
// ------------------------------------------------------------------
// prettier-ignore
type ExprBinaryReduce<Left extends t.TSchema, Rest extends unknown[]> = (
  Rest extends [infer Operator extends unknown, infer Right extends t.TSchema, infer Next extends unknown[]] ? (
    ExprBinaryReduce<Right, Next> extends infer Schema extends t.TSchema ? (
      Operator extends '&' ? (
        Schema extends t.TIntersect<infer Types extends t.TSchema[]>
        ? t.TIntersect<[Left, ...Types]>
        : t.TIntersect<[Left, Schema]>
      ) :
      Operator extends '|' ? (
        Schema extends t.TUnion<infer Types extends t.TSchema[]>
        ? t.TUnion<[Left, ...Types]>
        : t.TUnion<[Left, Schema]>
      ) : never
    ) : never
  ) : Left
)
// prettier-ignore
interface ExprBinaryMapping extends Static.IMapping {
  output: (
    this['input'] extends [infer Left extends t.TSchema, infer Rest extends unknown[]]
    ? ExprBinaryReduce<Left, Rest>
    : []
  )
}
// prettier-ignore
type ExprTermTail = Static.Union<[
  Static.Tuple<[Static.Const<'&'>, Factor, ExprTermTail]>,
  Static.Tuple<[]>
]>
// prettier-ignore
type ExprTerm = Static.Tuple<[
  Factor, ExprTermTail
], ExprBinaryMapping>
// prettier-ignore
type ExprTail = Static.Union<[
  Static.Tuple<[Static.Const<'|'>, ExprTerm, ExprTail]>,
  Static.Tuple<[]>
]>
// prettier-ignore
type Expr = Static.Tuple<[
  ExprTerm, ExprTail
], ExprBinaryMapping>

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
export type Type = Static.Union<[
  Static.Context<GenericArguments, Expr>, 
  Expr
]>

// ------------------------------------------------------------------
// Property
// ------------------------------------------------------------------
// prettier-ignore
interface PropertyKeyStringMapping extends Static.IMapping {
  output: this['input']
}
type PropertyKeyString = Static.String<[SingleQuote, DoubleQuote], PropertyKeyStringMapping>
type PropertyKey = Static.Union<[Static.Ident, PropertyKeyString]>
// prettier-ignore
interface ReadonlyMapping extends Static.IMapping {
  output: this['input'] extends ['readonly'] ? true : false
}
type Readonly = Static.Union<[Static.Tuple<[Static.Const<'readonly'>]>, Static.Tuple<[]>], ReadonlyMapping>
// prettier-ignore
interface OptionalMapping extends Static.IMapping {
  output: this['input'] extends [Question] ? true : false
}
type Optional = Static.Union<[Static.Tuple<[Static.Const<Question>]>, Static.Tuple<[]>], OptionalMapping>
// prettier-ignore
interface PropertyMapping extends Static.IMapping {
  output: this['input'] extends [infer IsReadonly extends boolean, infer Key extends string, infer IsOptional extends boolean, string, infer Type extends t.TSchema]
  ? { 
    [_ in Key]: (
      [IsReadonly, IsOptional] extends [true, true] ? t.TReadonlyOptional<Type> :
      [IsReadonly, IsOptional] extends [true, false] ? t.TReadonly<Type> :
      [IsReadonly, IsOptional] extends [false, true] ? t.TOptional<Type> :
      Type 
    ) 
  } : never
}
type Property = Static.Tuple<[Readonly, PropertyKey, Optional, Static.Const<Colon>, Type], PropertyMapping>

// ------------------------------------------------------------------
// PropertyDelimiter
// ------------------------------------------------------------------
// prettier-ignore
type PropertyDelimiter = Static.Union<[
  Static.Tuple<[Static.Const<Comma>, Static.Const<Newline>]>,
  Static.Tuple<[Static.Const<SemiColon>, Static.Const<Newline>]>,
  Static.Tuple<[Static.Const<Comma>]>,
  Static.Tuple<[Static.Const<SemiColon>]>,
  Static.Tuple<[Static.Const<Newline>]>,
]>

// ------------------------------------------------------------------
// PropertyList
// ------------------------------------------------------------------
type PropertyList = Delimit<Property, PropertyDelimiter>

// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
type ObjectReduce<PropertiesList extends t.TProperties[], Result extends t.TProperties = {}> = (
  PropertiesList extends [infer Left extends t.TProperties, ...infer Right extends t.TProperties[]]
  ? ObjectReduce<Right, Result & Left>
  : t.Evaluate<Result>
)
// prettier-ignore
interface ObjectMapping extends Static.IMapping {
  output: this['input'] extends [LBrace, infer PropertyList extends t.TProperties[], RBrace] 
    ? t.TObject<ObjectReduce<PropertyList>> 
    : never
}
// prettier-ignore
type Object = Static.Tuple<[
  Static.Const<LBrace>,
  PropertyList, 
  Static.Const<RBrace>
], ObjectMapping>

// ------------------------------------------------------------------
// ElementList
// ------------------------------------------------------------------
type ElementList = Delimit<Type, Static.Const<Comma>>

// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
interface TupleMapping extends Static.IMapping {
  output: this['input'] extends [unknown, infer ElementList extends t.TSchema[], unknown] 
    ? t.TTuple<ElementList> 
    : never
}
// prettier-ignore
type Tuple = Static.Tuple<[
  Static.Const<LBracket>, ElementList, Static.Const<RBracket>
], TupleMapping>

// ------------------------------------------------------------------
// Parameter
// ------------------------------------------------------------------
interface ParameterMapping extends Static.IMapping {
  output: this['input'] extends [string, Colon, infer Type extends t.TSchema] ? Type : never
}
// prettier-ignore
type Parameter = Static.Tuple<[
  Static.Ident, Static.Const<Colon>, Type
], ParameterMapping>

// ------------------------------------------------------------------
// ParameterList
// ------------------------------------------------------------------
type ParameterList = Delimit<Parameter, Static.Const<Comma>>

// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
interface FunctionMapping extends Static.IMapping {
  output: this['input'] extends [LParen, infer ParameterList extends t.TSchema[], RParen, '=>', infer ReturnType extends t.TSchema]
    ? t.TFunction<ParameterList, ReturnType>
    : never
}
// prettier-ignore
type Function = Static.Tuple<[
  Static.Const<LParen>, ParameterList, Static.Const<RParen>, Static.Const<'=>'>, Type
], FunctionMapping>

// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
interface ConstructorMapping extends Static.IMapping {
  output: this['input'] extends ['new', LParen, infer ParameterList extends t.TSchema[], RParen, '=>', infer InstanceType extends t.TSchema]
    ? t.TConstructor<ParameterList, InstanceType>
    : never
}
// prettier-ignore
type Constructor = Static.Tuple<[
  Static.Const<'new'>, Static.Const<LParen>, ParameterList, Static.Const<RParen>, Static.Const<'=>'>, Type
], ConstructorMapping>

// ------------------------------------------------------------------
// Mapped (requires deferred types)
// ------------------------------------------------------------------
// prettier-ignore
interface MappedMapping extends Static.IMapping {
  output: this['input'] extends [LBrace, LBracket, infer _Key extends string, 'in', infer _Right extends t.TSchema, RBracket, Colon, infer Type extends t.TSchema, RBrace]
    ? t.TLiteral<'Mapped types not supported'>
    : this['input']
}
// prettier-ignore
type Mapped = Static.Tuple<[
  Static.Const<LBrace>, Static.Const<LBracket>, Static.Ident, Static.Const<'in'>, Type, Static.Const<RBracket>, Static.Const<Colon>, Type, Static.Const<RBrace>
], MappedMapping>

// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
interface ArrayMapping extends Static.IMapping {
  output: this['input'] extends ['Array', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TArray<Type>
    : never
}
// prettier-ignore
type Array = Static.Tuple<[
  Static.Const<'Array'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], ArrayMapping>

// ------------------------------------------------------------------
// AsyncIterator
// ------------------------------------------------------------------
// prettier-ignore
interface AsyncIteratorMapping extends Static.IMapping {
  output: this['input'] extends ['AsyncIterator', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TAsyncIterator<Type>
    : never
}
// prettier-ignore
type AsyncIterator = Static.Tuple<[
  Static.Const<'AsyncIterator'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], AsyncIteratorMapping>

// ------------------------------------------------------------------
// Iterator
// ------------------------------------------------------------------
// prettier-ignore
interface IteratorMapping extends Static.IMapping {
  output: this['input'] extends ['Iterator', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TIterator<Type>
    : never
}
// prettier-ignore
type Iterator = Static.Tuple<[
  Static.Const<'Iterator'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], IteratorMapping>

// ------------------------------------------------------------------
// ConstructorParameters
// ------------------------------------------------------------------
// prettier-ignore
interface ConstructorParametersMapping extends Static.IMapping {
  output: this['input'] extends ['ConstructorParameters', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TConstructorParameters<Type>
    : never
}
// prettier-ignore
type ConstructorParameters = Static.Tuple<[
  Static.Const<'ConstructorParameters'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], ConstructorParametersMapping>

// ------------------------------------------------------------------
// FunctionParameters
// ------------------------------------------------------------------
// prettier-ignore
interface FunctionParametersMapping extends Static.IMapping {
  output: this['input'] extends ['Parameters', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TParameters<Type>
    : never
}
// prettier-ignore
type FunctionParameters = Static.Tuple<[
  Static.Const<'Parameters'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], FunctionParametersMapping>

// ------------------------------------------------------------------
// InstanceType
// ------------------------------------------------------------------
// prettier-ignore
interface InstanceTypeMapping extends Static.IMapping {
  output: this['input'] extends ['InstanceType', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TInstanceType<Type>
    : never
}
// prettier-ignore
type InstanceType = Static.Tuple<[
  Static.Const<'InstanceType'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], InstanceTypeMapping>

// ------------------------------------------------------------------
// ReturnType
// ------------------------------------------------------------------
// prettier-ignore
interface ReturnTypeMapping extends Static.IMapping {
  output: this['input'] extends ['ReturnType', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TReturnType<Type>
    : never
}
// prettier-ignore
type ReturnType = Static.Tuple<[
  Static.Const<'ReturnType'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], ReturnTypeMapping>

// ------------------------------------------------------------------
// Argument
// ------------------------------------------------------------------
// prettier-ignore
interface ArgumentMapping extends Static.IMapping {
  output: this['input'] extends ['Argument', LAngle, infer Type extends t.TSchema, RAngle]
    ? Type extends t.TLiteral<infer Index extends number>
      ? t.TArgument<Index>
      : t.TNever
    : never
}
// prettier-ignore
type Argument = Static.Tuple<[
  Static.Const<'Argument'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], ArgumentMapping>

// ------------------------------------------------------------------
// Awaited
// ------------------------------------------------------------------
// prettier-ignore
interface AwaitedMapping extends Static.IMapping {
  output: this['input'] extends ['Awaited', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TAwaited<Type>
    : never
}
// prettier-ignore
type Awaited = Static.Tuple<[
  Static.Const<'Awaited'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], AwaitedMapping>

// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
// prettier-ignore
interface PromiseMapping extends Static.IMapping {
  output: this['input'] extends ['Promise', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TPromise<Type>
    : never
}
// prettier-ignore
type Promise = Static.Tuple<[
  Static.Const<'Promise'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], PromiseMapping>

// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
// prettier-ignore
interface RecordMapping extends Static.IMapping {
  output: this['input'] extends ['Record', LAngle, infer Key extends t.TSchema, Comma, infer Type extends t.TSchema,  RAngle]
    ? t.TRecord<Key, Type>
    : never
}
// prettier-ignore
type Record = Static.Tuple<[
  Static.Const<'Record'>, Static.Const<LAngle>, Type, Static.Const<Comma>, Type, Static.Const<RAngle>,
], RecordMapping>

// ------------------------------------------------------------------
// Partial
// ------------------------------------------------------------------
// prettier-ignore
interface PartialMapping extends Static.IMapping {
  output: this['input'] extends ['Partial', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TPartial<Type>
    : never
}
// prettier-ignore
type Partial = Static.Tuple<[
  Static.Const<'Partial'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], PartialMapping>

// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
// prettier-ignore
interface RequiredMapping extends Static.IMapping {
  output: this['input'] extends ['Required', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TRequired<Type>
    : never
}
// prettier-ignore
type Required = Static.Tuple<[
  Static.Const<'Required'>,  Static.Const<LAngle>, Type, Static.Const<RAngle>,
], RequiredMapping>

// ------------------------------------------------------------------
// Pick
// ------------------------------------------------------------------
// prettier-ignore
interface PickMapping extends Static.IMapping {
  output: this['input'] extends ['Pick', LAngle, infer Type extends t.TSchema, Comma, infer Key extends t.TSchema, RAngle]
    ? t.TPick<Type, Key>
    : never
}
// prettier-ignore
type Pick = Static.Tuple<[
  Static.Const<'Pick'>, Static.Const<LAngle>, Type, Static.Const<Comma>, Type, Static.Const<RAngle>,
], PickMapping>

// ------------------------------------------------------------------
// Omit
// ------------------------------------------------------------------
// prettier-ignore
interface OmitMapping extends Static.IMapping {
  output: this['input'] extends ['Omit', LAngle, infer Type extends t.TSchema, Comma, infer Key extends t.TSchema, RAngle]
    ? t.TOmit<Type, Key>
    : never
}
// prettier-ignore
type Omit = Static.Tuple<[
  Static.Const<'Omit'>, Static.Const<LAngle>, Type, Static.Const<Comma>, Type, Static.Const<RAngle>
], OmitMapping>

// ------------------------------------------------------------------
// Exclude
// ------------------------------------------------------------------
// prettier-ignore
interface ExcludeMapping extends Static.IMapping {
  output: this['input'] extends ['Exclude', LAngle, infer Type extends t.TSchema, Comma, infer PropertyKey extends t.TSchema, RAngle]
    ? t.TExclude<Type, PropertyKey>
    : never
}
// prettier-ignore
type Exclude = Static.Tuple<[
  Static.Const<'Exclude'>, Static.Const<LAngle>, Type, Static.Const<Comma>, Type, Static.Const<RAngle>
], ExcludeMapping>

// ------------------------------------------------------------------
// Extract
// ------------------------------------------------------------------
// prettier-ignore
interface ExtractMapping extends Static.IMapping {
  output: this['input'] extends ['Extract', LAngle, infer Type extends t.TSchema, Comma, infer PropertyKey extends t.TSchema, RAngle]
    ? t.TExtract<Type, PropertyKey>
    : never
}
// prettier-ignore
type Extract = Static.Tuple<[
  Static.Const<'Extract'>, Static.Const<LAngle>, Type, Static.Const<Comma>, Type, Static.Const<RAngle>
], ExtractMapping>

// ------------------------------------------------------------------
// Uppercase
// ------------------------------------------------------------------
// prettier-ignore
interface UppercaseMapping extends Static.IMapping {
  output: this['input'] extends ['Uppercase', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TUppercase<Type>
    : never
}
// prettier-ignore
type Uppercase = Static.Tuple<[
  Static.Const<'Uppercase'>,  Static.Const<LAngle>, Type, Static.Const<RAngle>,
], UppercaseMapping>

// ------------------------------------------------------------------
// Lowercase
// ------------------------------------------------------------------
// prettier-ignore
interface LowercaseMapping extends Static.IMapping {
  output: this['input'] extends ['Lowercase', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TLowercase<Type>
    : never
}
// prettier-ignore
type Lowercase = Static.Tuple<[
  Static.Const<'Lowercase'>,  Static.Const<LAngle>, Type, Static.Const<RAngle>,
], LowercaseMapping>

// ------------------------------------------------------------------
// Capitalize
// ------------------------------------------------------------------
// prettier-ignore
interface CapitalizeMapping extends Static.IMapping {
  output: this['input'] extends ['Capitalize', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TCapitalize<Type>
    : never
}
// prettier-ignore
type Capitalize = Static.Tuple<[
  Static.Const<'Capitalize'>,  Static.Const<LAngle>, Type, Static.Const<RAngle>,
], CapitalizeMapping>

// ------------------------------------------------------------------
// Uncapitalize
// ------------------------------------------------------------------
// prettier-ignore
interface UncapitalizeMapping extends Static.IMapping {
  output: this['input'] extends ['Uncapitalize', LAngle, infer Type extends t.TSchema, RAngle]
    ? t.TUncapitalize<Type>
    : never
}
// prettier-ignore
type Uncapitalize = Static.Tuple<[
  Static.Const<'Uncapitalize'>,  Static.Const<LAngle>, Type, Static.Const<RAngle>,
], UncapitalizeMapping>

// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
type Date = Static.Const<'Date', Static.As<t.TDate>>

// ------------------------------------------------------------------
// Uint8Array
// ------------------------------------------------------------------
type Uint8Array = Static.Const<'Uint8Array', Static.As<t.TUint8Array>>
