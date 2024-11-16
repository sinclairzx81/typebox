/*--------------------------------------------------------------------------

@sinclair/typebox/syntax

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

import { Static } from './parsebox/index'
import * as Types from '../type/index'

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
//
// This type is used to perform a partial breadth match for repeated
// elements in a sequence. It used to mitigate depth+1 traversal for
// each element which helps prevent reaching instantiation limits. The
// technique works by infering as wide as possible on the sequence
// enabling TS to hoist interior matches, but does come at slight
// inference performance cost. The current (infer=9) is configured
// to match 64 terminal tuple elements.
//
// for the given sequence
//
// [a, b, c, d, e, f, g]
//
// ------------------------------------------------------------------
//
// without breadth mapping (infer=1, depth=6)
//
// [infer a,
//   [infer b,
//     [infer c,
//       [infer d,
//         [infer e,
//           [infer f,
//             [infer g,
//               []]]]]]]]
//
// ------------------------------------------------------------------
//
// with breadth mapping (infer=4, depth=2)
//
// [infer a, infer b, infer c, infer d,
//   [infer e, infer f, infer g,
//     []]]
//
//
// ------------------------------------------------------------------
// prettier-ignore
interface DelimitTailMapping<_ = unknown> extends Static.IMapping {
  output: (
    this['input'] extends [_, infer A, _, infer B, _, infer C, _, infer D, _, infer E, _, infer F, _, infer G, _, infer H, _, infer I, _, infer Rest extends unknown[]] ? [A, B, C, D, E, F, G, H, I, ...Rest] :
    this['input'] extends [_, infer A, _, infer B, _, infer C, _, infer D, _, infer E, _, infer F, _, infer G, _, infer H, _, infer Rest extends unknown[]] ? [A, B, C, D, E, F, G, H, ...Rest] :
    this['input'] extends [_, infer A, _, infer B, _, infer C, _, infer D, _, infer E, _, infer F, _, infer G, _, infer Rest extends unknown[]] ? [A, B, C, D, E, F, G, ...Rest] :
    this['input'] extends [_, infer A, _, infer B, _, infer C, _, infer D, _, infer E, _, infer F, _, infer Rest extends unknown[]] ? [A, B, C, D, E, F, ...Rest] :
    this['input'] extends [_, infer A, _, infer B, _, infer C, _, infer D, _, infer E, _, infer Rest extends unknown[]] ? [A, B, C, D, E, ...Rest] :
    this['input'] extends [_, infer A, _, infer B, _, infer C, _, infer D, _,  infer Rest extends unknown[]] ? [A, B, C, D, ...Rest] :
    this['input'] extends [_, infer A, _, infer B, _, infer C, _, infer Rest extends unknown[]] ? [A, B, C, ...Rest] :
    this['input'] extends [_, infer A, _, infer B, _, infer Rest extends unknown[]] ? [A, B, ...Rest] :
    this['input'] extends [_, infer A, _, infer Rest extends unknown[]] ? [A, ...Rest] :
    this['input'] extends [_, infer Rest extends unknown[]] ? [...Rest] : 
    this['input'] extends [_] ? [] :
    []
  )
}
// prettier-ignore
type DelimitTail<T extends Static.IParser, _ extends Static.IParser> = Static.Union<[
  Static.Tuple<[_, T, _, T, _, T, _, T, _, T, _, T, _, T, _, T, _, T, _, Delimit<T, _>]>,
  Static.Tuple<[_, T, _, T, _, T, _, T, _, T, _, T, _, T, _, T, _, Delimit<T, _>]>,
  Static.Tuple<[_, T, _, T, _, T, _, T, _, T, _, T, _, T, _, Delimit<T, _>]>,
  Static.Tuple<[_, T, _, T, _, T, _, T, _, T, _, T, _, Delimit<T, _>]>,
  Static.Tuple<[_, T, _, T, _, T, _, T, _, T, _, Delimit<T, _>]>,
  Static.Tuple<[_, T, _, T, _, T, _, T, _, Delimit<T, _>]>,
  Static.Tuple<[_, T, _, T, _, T, _,Delimit<T, _>]>,
  Static.Tuple<[_, T, _, T, _, Delimit<T, _>]>,
  Static.Tuple<[_, T, _, Delimit<T, _>]>,
  Static.Tuple<[_, Delimit<T, _>]>,
  Static.Tuple<[_]>,
  Static.Tuple<[]>
], DelimitTailMapping>
// prettier-ignore
interface DelimitMapping extends Static.IMapping {
  output: (
    this['input'] extends [infer Element extends unknown, infer Rest extends unknown[]] 
      ? [Element, ...Rest]
      : []
  )
}
// prettier-ignore
type Delimit<Parser extends Static.IParser, Delimiter extends Static.IParser> = (
  Static.Union<[
    Static.Tuple<[Parser, DelimitTail<Parser, Delimiter>]>,
    Static.Tuple<[]>
  ], DelimitMapping>
)
// ------------------------------------------------------------------
// Deref
// ------------------------------------------------------------------
// prettier-ignore
type Deref<Context extends Types.TProperties, Ref extends string> = (
  Ref extends keyof Context ? Context[Ref] : Types.TRef<Ref>
)
// ------------------------------------------------------------------
// ExportModifier
// ------------------------------------------------------------------
// prettier-ignore
interface ExportModifierMapping extends Static.IMapping {
  output: this['input'] extends [string] ? true : false
}
// prettier-ignore
type ExportModifier = Static.Union<[
  Static.Tuple<[Static.Const<'export'>]>,
  Static.Tuple<[]>,
], ExportModifierMapping>

// ------------------------------------------------------------------
// TypeAliasDeclaration
// ------------------------------------------------------------------
// prettier-ignore
interface TypeAliasDeclarationMapping extends Static.IMapping {
  output: this['input'] extends [infer _Export extends boolean, 'type', infer Ident extends string, Equals, infer Type extends Types.TSchema] 
    ? { [_ in Ident]: Type } 
    : never
}
// prettier-ignore
type TypeAliasDeclaration = Static.Tuple<[
  ExportModifier, Static.Const<'type'>, Static.Ident, Static.Const<Equals>, Type
], TypeAliasDeclarationMapping>

// ------------------------------------------------------------------
// HeritageList
// ------------------------------------------------------------------
// prettier-ignore (note, heritage list should disallow trailing comma)
type HeritageListDelimiter = Static.Union<[Static.Tuple<[Static.Const<Comma>, Static.Const<Newline>]>, Static.Tuple<[Static.Const<Comma>]>]>
// prettier-ignore
type HeritageListReduce<Values extends string[], Context extends Types.TProperties, Result extends Types.TSchema[] = []> = (
  Values extends [infer Ref extends string, ...infer Rest extends string[]]
    ? HeritageListReduce<Rest, Context, [...Result, Deref<Context, Ref>]>
    : Result
)
// prettier-ignore
interface HeritageListMapping extends Static.IMapping {
  output: (
    this['context'] extends Types.TProperties ?
    this['input'] extends string[] 
      ? HeritageListReduce<this['input'], this['context']> 
      : []
    : []
  )
}
// prettier-ignore
type HeritageList = Static.Union<[Delimit<Static.Ident, HeritageListDelimiter>], HeritageListMapping>
// ------------------------------------------------------------------
// Heritage
// ------------------------------------------------------------------
// prettier-ignore
interface HeritageMapping extends Static.IMapping {
  output: this['input'] extends ['extends', infer List extends Types.TSchema[]] ? List : []
}
// prettier-ignore
type Heritage = Static.Union<[
  Static.Tuple<[Static.Const<'extends'>, HeritageList]>,
  Static.Tuple<[]>
], HeritageMapping>
// ------------------------------------------------------------------
// InterfaceDeclaration
// ------------------------------------------------------------------
// prettier-ignore
interface InterfaceDeclarationMapping extends Static.IMapping {
  output: this['input'] extends [boolean, 'interface', infer Ident extends string, infer Heritage extends Types.TSchema[], LBrace, infer Properties extends Types.TProperties, RBrace]
    ? { [_ in Ident]: Types.TIntersectEvaluated<[...Heritage, Types.TObject<Properties>]> }
    : never
}
// prettier-ignore
type InterfaceDeclaration = Static.Tuple<[
  ExportModifier,
  Static.Const<'interface'>, 
  Static.Ident, 
  Heritage,
  Static.Const<LBrace>, 
  Properties,
  Static.Const<RBrace>, 
], InterfaceDeclarationMapping>
// ------------------------------------------------------------------
// ModuleType
// ------------------------------------------------------------------
// prettier-ignore
type ModuleType = Static.Union<[
  InterfaceDeclaration,
  TypeAliasDeclaration
]>
// ------------------------------------------------------------------
// ModuleProperties
// ------------------------------------------------------------------
// prettier-ignore
type ModulePropertiesDelimiter = Static.Union<[
  Static.Tuple<[Static.Const<SemiColon>, Static.Const<Newline>]>,
  Static.Tuple<[Static.Const<SemiColon>]>,
  Static.Tuple<[Static.Const<Newline>]>,
]>
// prettier-ignore
type ModulePropertiesReduce<Value extends unknown[], Result extends Types.TProperties = {}> = (
  Value extends [infer ModuleType extends Types.TProperties, unknown[], ...infer Rest extends unknown[]] ? ModulePropertiesReduce<Rest, Result & ModuleType> :
  Value extends [infer ModuleType extends Types.TProperties] ? ModulePropertiesReduce<[], Result & ModuleType> : 
  Types.Evaluate<Result>
)
// prettier-ignore
interface ModulePropertiesMapping extends Static.IMapping {
  output: this['input'] extends unknown[] ? ModulePropertiesReduce<this['input']> : never
}
// prettier-ignore
type ModuleProperties = Static.Union<[
  Static.Tuple<[ModuleType, ModulePropertiesDelimiter, ModuleProperties]>,
  Static.Tuple<[ModuleType]>,
  Static.Tuple<[]>,
], ModulePropertiesMapping>
// ------------------------------------------------------------------
// ModuleDeclaration
// ------------------------------------------------------------------
// prettier-ignore
type ModuleIdentifier = Static.Union<[
  Static.Tuple<[Static.Ident]>,
  Static.Tuple<[]>
]>
// prettier-ignore
interface ModuleDeclarationMapping extends Static.IMapping {
  output: this['input'] extends [boolean, 'module', infer _Ident extends string[], LBrace, infer Properties extends Types.TProperties, RBrace] 
    ? Types.TModule<Properties> 
    : never
}
// prettier-ignore
type ModuleDeclaration = Static.Tuple<[
  ExportModifier, Static.Const<'module'>, ModuleIdentifier, Static.Const<LBrace>, ModuleProperties, Static.Const<RBrace>
], ModuleDeclarationMapping>
// ------------------------------------------------------------------
// Reference
// ------------------------------------------------------------------
// prettier-ignore
interface ReferenceMapping extends Static.IMapping {
  output: this['context'] extends Types.TProperties
    ? this['input'] extends string
      ? Deref<this['context'], this['input']>
      : never
    : never  
}
type Reference = Static.Ident<ReferenceMapping>
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
// prettier-ignore
interface LiteralBooleanMapping extends Static.IMapping {
  output: this['input'] extends `${infer S extends boolean}` ? Types.TLiteral<S> : never
}
// prettier-ignore
interface LiteralNumberMapping extends Static.IMapping {
  output: this['input'] extends `${infer S extends number}` ? Types.TLiteral<S> : never
}
// prettier-ignore
interface LiteralStringMapping extends Static.IMapping {
  output: this['input'] extends `${infer S extends string}` ? Types.TLiteral<S> : never
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
  Static.Const<'any', Static.As<Types.TAny>>,
  Static.Const<'bigint', Static.As<Types.TBigInt>>,
  Static.Const<'boolean', Static.As<Types.TBoolean>>,
  Static.Const<'integer', Static.As<Types.TInteger>>,
  Static.Const<'never', Static.As<Types.TNever>>,
  Static.Const<'null', Static.As<Types.TNull>>,
  Static.Const<'number', Static.As<Types.TNumber>>,
  Static.Const<'string', Static.As<Types.TString>>,
  Static.Const<'symbol', Static.As<Types.TSymbol>>,
  Static.Const<'undefined', Static.As<Types.TUndefined>>,
  Static.Const<'unknown', Static.As<Types.TUnknown>>,
  Static.Const<'void', Static.As<Types.TVoid>>,
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
interface IndexArrayMapping extends Static.IMapping {
  output: (
    this['input'] extends [LBracket, infer Type extends Types.TSchema, RBracket, infer Rest extends unknown[]] ? [[Type], ...Rest] :
    this['input'] extends [LBracket, RBracket, infer Rest extends unknown[]] ? [[], ...Rest] :
    []
  )
}
// prettier-ignore
type IndexArray = Static.Union<[
  Static.Tuple<[Static.Const<LBracket>, Type, Static.Const<RBracket>, IndexArray]>,
  Static.Tuple<[Static.Const<LBracket>, Static.Const<RBracket>, IndexArray]>,
  Static.Tuple<[]>
], IndexArrayMapping>

// ------------------------------------------------------------------
// Extends
// ------------------------------------------------------------------
// prettier-ignore
interface ExtendsMapping extends Static.IMapping {
  output: this['input'] extends ['extends', infer Type extends Types.TSchema, Question, infer True extends Types.TSchema, Colon, infer False extends Types.TSchema]
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
    this['input'] extends [LParen, infer Type extends Types.TSchema, RParen] ? Type :
    this['input'] extends [infer Type extends Types.TSchema] ? Type :
    never
  )
}
// prettier-ignore
type Base = Static.Union<[
  Static.Tuple<[
    Static.Const<LParen>, 
    Type,
    Static.Const<RParen>
  ]>,
  Static.Tuple<[Static.Union<[
    Literal,
    Keyword,
    Object, 
    Tuple,
    Function,
    Constructor,
    Mapped,
    AsyncIterator,
    Iterator,
    ConstructorParameters,
    FunctionParameters,
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
    Reference
  ]>]>
], BaseMapping>
// ------------------------------------------------------------------
// Factor
// ------------------------------------------------------------------
// prettier-ignore
type FactorExtends<Type extends Types.TSchema, Extends extends unknown[]> = (
  Extends extends [infer Right extends Types.TSchema, infer True extends Types.TSchema, infer False extends Types.TSchema] 
    ? Types.TExtends<Type, Right, True, False>
    : Type
)
// prettier-ignore
type FactorIndexArray<Type extends Types.TSchema, IndexArray extends unknown[]> = (
  IndexArray extends [...infer Left extends unknown[], infer Right extends Types.TSchema[]] ? (
    Right extends [infer Indexer extends Types.TSchema] ? Types.TIndex<FactorIndexArray<Type, Left>, Types.TIndexPropertyKeys<Indexer>> : 
    Right extends [] ? Types.TArray<FactorIndexArray<Type, Left>> :
    Types.TNever
  ) : Type
)
// prettier-ignore
interface FactorMapping extends Static.IMapping {
  output: this['input'] extends [infer KeyOf extends boolean, infer Type extends Types.TSchema, infer IndexArray extends unknown[], infer Extends extends unknown[]]
  ? KeyOf extends true
    ? FactorExtends<Types.TKeyOf<FactorIndexArray<Type, IndexArray>>, Extends>
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
type ExprBinaryReduce<Left extends Types.TSchema, Rest extends unknown[]> = (
  Rest extends [infer Operator extends unknown, infer Right extends Types.TSchema, infer Next extends unknown[]] ? (
    ExprBinaryReduce<Right, Next> extends infer Schema extends Types.TSchema ? (
      Operator extends '&' ? (
        Schema extends Types.TIntersect<infer Types extends Types.TSchema[]>
        ? Types.TIntersect<[Left, ...Types]>
        : Types.TIntersect<[Left, Schema]>
      ) :
      Operator extends '|' ? (
        Schema extends Types.TUnion<infer Types extends Types.TSchema[]>
        ? Types.TUnion<[Left, ...Types]>
        : Types.TUnion<[Left, Schema]>
      ) : never
    ) : never
  ) : Left
)
// prettier-ignore
interface ExprBinaryMapping extends Static.IMapping {
  output: (
    this['input'] extends [infer Left extends Types.TSchema, infer Rest extends unknown[]]
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
type Type = Expr
// ------------------------------------------------------------------
// Properties
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
  output: this['input'] extends [infer IsReadonly extends boolean, infer Key extends string, infer IsOptional extends boolean, string, infer Type extends Types.TSchema]
  ? { 
    [_ in Key]: (
      [IsReadonly, IsOptional] extends [true, true] ? Types.TReadonlyOptional<Type> :
      [IsReadonly, IsOptional] extends [true, false] ? Types.TReadonly<Type> :
      [IsReadonly, IsOptional] extends [false, true] ? Types.TOptional<Type> :
      Type 
    ) 
  } : never
}
type Property = Static.Tuple<[Readonly, PropertyKey, Optional, Static.Const<Colon>, Type], PropertyMapping>
// prettier-ignore
type PropertyDelimiter = Static.Union<[
  Static.Tuple<[Static.Const<Comma>, Static.Const<Newline>]>,
  Static.Tuple<[Static.Const<SemiColon>, Static.Const<Newline>]>,
  Static.Tuple<[Static.Const<Comma>]>,
  Static.Tuple<[Static.Const<SemiColon>]>,
  Static.Tuple<[Static.Const<Newline>]>,
]>
// prettier-ignore
type PropertiesReduce<PropertiesArray extends Types.TProperties[], Result extends Types.TProperties = {}> = (
  PropertiesArray extends [infer Left extends Types.TProperties, ...infer Right extends Types.TProperties[]]
  ? PropertiesReduce<Right, Types.Evaluate<Result & Left>>
  : Result
)
// prettier-ignore
interface PropertiesMapping extends Static.IMapping {
  output: this['input'] extends Types.TProperties[] ? PropertiesReduce<this['input']> : never
}
type Properties = Static.Union<[Delimit<Property, PropertyDelimiter>], PropertiesMapping>
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
interface ObjectMapping extends Static.IMapping {
  output: this['input'] extends [unknown, infer Properties extends Types.TProperties, unknown] 
    ? Types.TObject<Properties> 
    : never
}
// prettier-ignore
type Object = Static.Tuple<[
  Static.Const<LBrace>, Properties, Static.Const<RBrace>
], ObjectMapping>
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
type Elements = Delimit<Type, Static.Const<Comma>>
// prettier-ignore
interface TupleMapping extends Static.IMapping {
  output: this['input'] extends [unknown, infer Elements extends Types.TSchema[], unknown] ? Types.TTuple<Elements> : never
}
// prettier-ignore
type Tuple = Static.Tuple<[
  Static.Const<LBracket>, Elements, Static.Const<RBracket>
], TupleMapping>
// ------------------------------------------------------------------
// Parameters
// ------------------------------------------------------------------
interface ParameterMapping extends Static.IMapping {
  output: this['input'] extends [string, Colon, infer Type extends Types.TSchema] ? Type : never
}
// prettier-ignore
type Parameter = Static.Tuple<[
  Static.Ident, Static.Const<Colon>, Type
], ParameterMapping>

type Parameters = Delimit<Parameter, Static.Const<Comma>>
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
interface FunctionMapping extends Static.IMapping {
  output: this['input'] extends [LParen, infer Parameters extends Types.TSchema[], RParen, '=>', infer ReturnType extends Types.TSchema]
    ? Types.TFunction<Parameters, ReturnType>
    : never
}
// prettier-ignore
type Function = Static.Tuple<[
  Static.Const<LParen>, Parameters, Static.Const<RParen>, Static.Const<'=>'>, Type
], FunctionMapping>
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
interface ConstructorMapping extends Static.IMapping {
  output: this['input'] extends ['new', LParen, infer Parameters extends Types.TSchema[], RParen, '=>', infer InstanceType extends Types.TSchema]
    ? Types.TConstructor<Parameters, InstanceType>
    : never
}
// prettier-ignore
type Constructor = Static.Tuple<[
  Static.Const<'new'>, Static.Const<LParen>, Parameters, Static.Const<RParen>, Static.Const<'=>'>, Type
], ConstructorMapping>
// ------------------------------------------------------------------
// Mapped (requires deferred types)
// ------------------------------------------------------------------
// prettier-ignore
interface MappedMapping extends Static.IMapping {
  output: this['input'] extends [LBrace, LBracket, infer _Key extends string, 'in', infer _Right extends Types.TSchema, RBracket, Colon, infer Type extends Types.TSchema, RBrace]
    ? Types.TLiteral<'Mapped types not supported'>
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
  output: this['input'] extends ['Array', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TArray<Type>
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
  output: this['input'] extends ['AsyncIterator', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TAsyncIterator<Type>
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
  output: this['input'] extends ['Iterator', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TIterator<Type>
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
  output: this['input'] extends ['ConstructorParameters', LAngle, infer Type extends Types.TConstructor, RAngle]
    ? Types.TConstructorParameters<Type>
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
  output: this['input'] extends ['Parameters', LAngle, infer Type extends Types.TFunction, RAngle]
    ? Types.TParameters<Type>
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
  output: this['input'] extends ['InstanceType', LAngle, infer Type extends Types.TConstructor, RAngle]
    ? Types.TInstanceType<Type>
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
  output: this['input'] extends ['ReturnType', LAngle, infer Type extends Types.TFunction, RAngle]
    ? Types.TReturnType<Type>
    : never
}
// prettier-ignore
type ReturnType = Static.Tuple<[
  Static.Const<'ReturnType'>, Static.Const<LAngle>, Type, Static.Const<RAngle>,
], ReturnTypeMapping>
// ------------------------------------------------------------------
// Awaited
// ------------------------------------------------------------------
// prettier-ignore
interface AwaitedMapping extends Static.IMapping {
  output: this['input'] extends ['Awaited', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TAwaited<Type>
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
  output: this['input'] extends ['Promise', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TPromise<Type>
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
  output: this['input'] extends ['Record', LAngle, infer Key extends Types.TSchema, Comma, infer Type extends Types.TSchema,  RAngle]
    ? Types.TRecord<Key, Type>
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
  output: this['input'] extends ['Partial', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TPartial<Type>
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
  output: this['input'] extends ['Required', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TRequired<Type>
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
  output: this['input'] extends ['Pick', LAngle, infer Type extends Types.TSchema, Comma, infer Key extends Types.TSchema, RAngle]
    ? Types.TPick<Type, Key>
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
  output: this['input'] extends ['Omit', LAngle, infer Type extends Types.TSchema, Comma, infer Key extends Types.TSchema, RAngle]
    ? Types.TOmit<Type, Key>
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
  output: this['input'] extends ['Exclude', LAngle, infer Type extends Types.TSchema, Comma, infer PropertyKey extends Types.TSchema, RAngle]
    ? Types.TExclude<Type, PropertyKey>
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
  output: this['input'] extends ['Extract', LAngle, infer Type extends Types.TSchema, Comma, infer PropertyKey extends Types.TSchema, RAngle]
    ? Types.TExtract<Type, PropertyKey>
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
  output: this['input'] extends ['Uppercase', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TUppercase<Type>
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
  output: this['input'] extends ['Lowercase', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TLowercase<Type>
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
  output: this['input'] extends ['Capitalize', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TCapitalize<Type>
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
  output: this['input'] extends ['Uncapitalize', LAngle, infer Type extends Types.TSchema, RAngle]
    ? Types.TUncapitalize<Type>
    : never
}
// prettier-ignore
type Uncapitalize = Static.Tuple<[
  Static.Const<'Uncapitalize'>,  Static.Const<LAngle>, Type, Static.Const<RAngle>,
], UncapitalizeMapping>
// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
type Date = Static.Const<'Date', Static.As<Types.TDate>>
// ------------------------------------------------------------------
// Uint8Array
// ------------------------------------------------------------------
type Uint8Array = Static.Const<'Uint8Array', Static.As<Types.TUint8Array>>

// ------------------------------------------------------------------
// Main
// ------------------------------------------------------------------
// prettier-ignore
export type Main = Static.Union<[
  ModuleDeclaration,
  TypeAliasDeclaration,
  InterfaceDeclaration,
  Type
]>
