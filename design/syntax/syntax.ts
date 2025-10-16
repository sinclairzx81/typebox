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


import { Runtime } from 'parsebox'

// ------------------------------------------------------------------
// Pattern Literals: Rebuild on Change
// ------------------------------------------------------------------
import { BigIntPattern, StringPattern, NumberPattern, IntegerPattern, NeverPattern } from '../../src/type/index.ts'

// ------------------------------------------------------------------
// Tokens
// ------------------------------------------------------------------
const Newline = '\n'
const LBracket = '['
const RBracket = ']'
const LParen = '('
const RParen = ')'
const LBrace = '{'
const RBrace = '}'
const LAngle = '<'
const RAngle = '>'
const Dollar = '$'
const Pipe = '|'
const Caret = '^'
const Question = '?'
const Hyphen = '-'
const Plus = '+'
const Colon = ':'
const Comma = ','
const SemiColon = ';'
const SingleQuote = "'"
const DoubleQuote = '"'
const Backtick = '`'
const Equals = '='
// ------------------------------------------------------------------
// Delimit: Generic Parser. Instanced for Sequences
// ------------------------------------------------------------------
const DelimitHead = <Element extends Runtime.IParser, Delimiter extends Runtime.IParser>(element: Element, delimiter: Delimiter) =>
  Runtime.Array(Runtime.Tuple([element, delimiter]))
const DelimitTail = <Element extends Runtime.IParser>(element: Element) =>
  Runtime.Union([Runtime.Tuple([element]), Runtime.Tuple([])])
const Delimit = <Element extends Runtime.IParser, Delimiter extends Runtime.IParser>(element: Element, delimiter: Delimiter) =>
  Runtime.Tuple([DelimitHead(element, delimiter), DelimitTail(element)])
// ------------------------------------------------------------------
// GenericParameterExtendsEquals
// ------------------------------------------------------------------
const GenericParameterExtendsEquals = Runtime.Tuple([
  Runtime.Ident(),
  Runtime.Const('extends'),
  Runtime.Ref('Type'),
  Runtime.Const(Equals),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// GenericParameterExtends
// ------------------------------------------------------------------
const GenericParameterExtends = Runtime.Tuple([
  Runtime.Ident(),
  Runtime.Const('extends'),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// GenericParameterEquals
// ------------------------------------------------------------------
const GenericParameterEquals = Runtime.Tuple([
  Runtime.Ident(),
  Runtime.Const(Equals),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// GenericParameterIdentifier
// ------------------------------------------------------------------
const GenericParameterIdentifier = Runtime.Ident()
// ------------------------------------------------------------------
// GenericParameter
// ------------------------------------------------------------------
const GenericParameter = Runtime.Union([
  Runtime.Ref('GenericParameterExtendsEquals'),
  Runtime.Ref('GenericParameterExtends'),
  Runtime.Ref('GenericParameterEquals'),
  Runtime.Ref('GenericParameterIdentifier')
])
// ------------------------------------------------------------------
// GenericParameterList
// ------------------------------------------------------------------
const GenericParameterList = Delimit(
  Runtime.Ref('GenericParameter'),
  Runtime.Const(Comma)
)
// ------------------------------------------------------------------
// GenericParameters
// ------------------------------------------------------------------
const GenericParameters = Runtime.Tuple([
  Runtime.Const(LAngle),
  Runtime.Ref('GenericParameterList'),
  Runtime.Const(RAngle)
])
// ------------------------------------------------------------------
// GenericCallArgumentList
// ------------------------------------------------------------------
const GenericCallArgumentList = Delimit(
  Runtime.Ref('Type'),
  Runtime.Const(Comma)
)
// ------------------------------------------------------------------
// GenericCallArguments
// ------------------------------------------------------------------
const GenericCallArguments = Runtime.Tuple([
  Runtime.Const(LAngle),
  Runtime.Ref('GenericCallArgumentList'),
  Runtime.Const(RAngle)
])
// ------------------------------------------------------------------
// GenericCall
// ------------------------------------------------------------------
const GenericCall = Runtime.Tuple([
  Runtime.Ident(),
  Runtime.Ref('GenericCallArguments'),
])
// ------------------------------------------------------------------
// OptionalSemiColon
// ------------------------------------------------------------------
const OptionalSemiColon = Runtime.Union([
  Runtime.Tuple([Runtime.Const(SemiColon)]),
  Runtime.Tuple([])
])
// ------------------------------------------------------------------
// Reference
// ------------------------------------------------------------------
const Reference = Runtime.Ident()
// ------------------------------------------------------------------
// TemplateSpan
// ------------------------------------------------------------------
const TemplateSpan = Runtime.Until(['${', '`'])
// ------------------------------------------------------------------
// TemplateInterpolate
// ------------------------------------------------------------------
const TemplateInterpolate = Runtime.Tuple([
  Runtime.Const('${'),
  Runtime.Ref('Type'),
  Runtime.Const('}')
])
// ------------------------------------------------------------------
// TemplateBody
// ------------------------------------------------------------------
const TemplateBody = Runtime.Union([
  Runtime.Tuple([Runtime.Ref('TemplateSpan'), Runtime.Ref('TemplateInterpolate'), Runtime.Ref('TemplateBody')]),
  Runtime.Tuple([Runtime.Ref('TemplateSpan')]),
  Runtime.Tuple([Runtime.Ref('TemplateSpan')]),
])
// ------------------------------------------------------------------
// TemplateLiteralTypes
//
// This combinator provides an intermediate way to extract types only
// from the underlying template. This enables parsers to have at the
// unevaluated types vs needing to decode from the generated pattern.  
//
// ------------------------------------------------------------------
const TemplateLiteralTypes = Runtime.Tuple([
  Runtime.Const('`'),
  Runtime.Ref('TemplateBody'),
  Runtime.Const('`'),
])
// ------------------------------------------------------------------
// TemplateLiteral
//
// This combinator references the TemplateLiteralTypes where the types
// are embedded in an actual TemplateLiteral structure.
//
// ------------------------------------------------------------------
const TemplateLiteral = Runtime.Ref('TemplateLiteralTypes')
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
const LiteralBigInt = Runtime.BigInt()
const LiteralBoolean = Runtime.Union([Runtime.Const('true'), Runtime.Const('false')])
const LiteralNumber = Runtime.Number()
const LiteralString = Runtime.String([SingleQuote, DoubleQuote])
const Literal = Runtime.Union([
  Runtime.Ref('LiteralBigInt'),
  Runtime.Ref('LiteralBoolean'),
  Runtime.Ref('LiteralNumber'),
  Runtime.Ref('LiteralString'),
])
// ------------------------------------------------------------------
// Keyword
// ------------------------------------------------------------------
const KeywordString = Runtime.Const('string')
const KeywordNumber = Runtime.Const('number')
const KeywordBoolean = Runtime.Const('boolean')
const KeywordUndefined = Runtime.Const('undefined')
const KeywordNull = Runtime.Const('null')
const KeywordInteger = Runtime.Const('integer')
const KeywordBigInt = Runtime.Const('bigint')
const KeywordUnknown = Runtime.Const('unknown')
const KeywordAny = Runtime.Const('any')
const KeywordObject = Runtime.Const('object')
const KeywordNever = Runtime.Const('never')
const KeywordSymbol = Runtime.Const('symbol')
const KeywordVoid = Runtime.Const('void')
const KeywordThis = Runtime.Const('this')
const Keyword = Runtime.Union([
  Runtime.Ref('KeywordString'),
  Runtime.Ref('KeywordNumber'),
  Runtime.Ref('KeywordBoolean'),
  Runtime.Ref('KeywordUndefined'),
  Runtime.Ref('KeywordNull'),
  Runtime.Ref('KeywordInteger'),
  Runtime.Ref('KeywordBigInt'),
  Runtime.Ref('KeywordUnknown'),
  Runtime.Ref('KeywordAny'),
  Runtime.Ref('KeywordObject'),
  Runtime.Ref('KeywordNever'),
  Runtime.Ref('KeywordSymbol'),
  Runtime.Ref('KeywordVoid'),
  Runtime.Ref('KeywordThis')
])
// ------------------------------------------------------------------
// KeyOf
// ------------------------------------------------------------------
const KeyOf = Runtime.Union([
  Runtime.Tuple([Runtime.Const('keyof')]),
  Runtime.Tuple([])
])
// ------------------------------------------------------------------
// IndexArray
// ------------------------------------------------------------------
const IndexArray = Runtime.Array(Runtime.Union([
  Runtime.Tuple([Runtime.Const(LBracket), Runtime.Ref('Type'), Runtime.Const(RBracket)]),
  Runtime.Tuple([Runtime.Const(LBracket), Runtime.Const(RBracket)]),
]))
// ------------------------------------------------------------------
// Extends
// ------------------------------------------------------------------
const Extends = Runtime.Union([
  Runtime.Tuple([
    Runtime.Const('extends'),
    Runtime.Ref('Type'),
    Runtime.Const(Question),
    Runtime.Ref('Type'),
    Runtime.Const(Colon),
    Runtime.Ref('Type')
  ]),
  Runtime.Tuple([])
])
// ------------------------------------------------------------------
// Base
// ------------------------------------------------------------------
const Base = Runtime.Union([
  Runtime.Tuple([Runtime.Const(LParen), Runtime.Ref('Type'), Runtime.Const(RParen)]),
  Runtime.Ref('Keyword'),
  Runtime.Ref('_Object_'),
  Runtime.Ref('Tuple'),
  Runtime.Ref('TemplateLiteral'),
  Runtime.Ref('Literal'),
  Runtime.Ref('Constructor'),
  Runtime.Ref('Function'),
  Runtime.Ref('Mapped'),
  Runtime.Ref('Options'),
  Runtime.Ref('GenericCall'),
  Runtime.Ref('Reference')
])
// ------------------------------------------------------------------
// Factor
// ------------------------------------------------------------------
const Factor = Runtime.Tuple([
  Runtime.Ref('KeyOf'),
  Runtime.Ref('Base'),
  Runtime.Ref('IndexArray'),
  Runtime.Ref('Extends')
])
// ------------------------------------------------------------------
// Expr
// ------------------------------------------------------------------
const ExprTermTail = Runtime.Union([
  Runtime.Tuple([Runtime.Const('&'), Runtime.Ref('Factor'), Runtime.Ref('ExprTermTail')]),
  Runtime.Tuple([])
])
const ExprTerm = Runtime.Tuple([
  Runtime.Ref('Factor'),
  Runtime.Ref('ExprTermTail')
])
const ExprTail = Runtime.Union([
  Runtime.Tuple([Runtime.Const('|'), Runtime.Ref('ExprTerm'), Runtime.Ref('ExprTail')]),
  Runtime.Tuple([])
])
const Expr = Runtime.Tuple([
  Runtime.Ref('ExprTerm'),
  Runtime.Ref('ExprTail')
])

// ------------------------------------------------------------------
// ExprReadonly
// ------------------------------------------------------------------
const ExprReadonly = Runtime.Tuple([
  Runtime.Const('readonly'),
  Runtime.Ref('Expr')
])
// ------------------------------------------------------------------
// ExprPipe
// ------------------------------------------------------------------
const ExprPipe = Runtime.Tuple([
  Runtime.Const(Pipe),
  Runtime.Ref('Expr')
])
// ------------------------------------------------------------------
// InferType
// ------------------------------------------------------------------
const InferType = Runtime.Union([
  Runtime.Tuple([Runtime.Const('infer'), Runtime.Ident(), Runtime.Const('extends'), Runtime.Ref('Expr')]),
  Runtime.Tuple([Runtime.Const('infer'), Runtime.Ident()]),
])
// ------------------------------------------------------------------
// Type: Entry
// ------------------------------------------------------------------
const Type = Runtime.Union([
  Runtime.Ref('InferType'),
  Runtime.Ref('ExprPipe'),
  Runtime.Ref('ExprReadonly'),
  Runtime.Ref('Expr')
])
// ------------------------------------------------------------------
// GenericType: Entry
// ------------------------------------------------------------------
const GenericType = Runtime.Tuple([
  Runtime.Ref('GenericParameters'),
  Runtime.Const(Equals),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// PropertyKeyNumber
// ------------------------------------------------------------------
const PropertyKeyNumber = Runtime.Number()
// ------------------------------------------------------------------
// PropertyKeyIdent
// ------------------------------------------------------------------
const PropertyKeyIdent = Runtime.Ident()
// ------------------------------------------------------------------
// PropertyKeyQuoted
// ------------------------------------------------------------------
const PropertyKeyQuoted = Runtime.String([SingleQuote, DoubleQuote])
// ------------------------------------------------------------------
// PropertyKeyIndex
// ------------------------------------------------------------------
const PropertyKeyIndex = Runtime.Tuple([
  Runtime.Const('['),
  Runtime.Ident(),
  Runtime.Const(Colon),
  Runtime.Union([
    Runtime.Ref('KeywordInteger'),
    Runtime.Ref('KeywordNumber'),
    Runtime.Ref('KeywordString'),
    Runtime.Ref('KeywordSymbol'),
  ]),
  Runtime.Const(']'),
])
// ------------------------------------------------------------------
// PropertyKey
// ------------------------------------------------------------------
const PropertyKey = Runtime.Union([
  Runtime.Ref('PropertyKeyNumber'),
  Runtime.Ref('PropertyKeyIdent'),
  Runtime.Ref('PropertyKeyQuoted'),
  Runtime.Ref('PropertyKeyIndex')
])
// ------------------------------------------------------------------
// Readonly
// ------------------------------------------------------------------
const Readonly = Runtime.Union([
  Runtime.Tuple([Runtime.Const('readonly')]),
  Runtime.Tuple([])
])
// ------------------------------------------------------------------
// Optional
// ------------------------------------------------------------------
const Optional = Runtime.Union([
  Runtime.Tuple([Runtime.Const(Question)]),
  Runtime.Tuple([])
])
// ------------------------------------------------------------------
// Property
// ------------------------------------------------------------------
const Property = Runtime.Tuple([
  Runtime.Ref('Readonly'),
  Runtime.Ref('PropertyKey'),
  Runtime.Ref('Optional'),
  Runtime.Const(Colon),
  Runtime.Ref('Type'),
])
// ------------------------------------------------------------------
// PropertyDelimiter
// ------------------------------------------------------------------
const PropertyDelimiter = Runtime.Union([
  Runtime.Tuple([Runtime.Const(Comma), Runtime.Const(Newline)]),
  Runtime.Tuple([Runtime.Const(SemiColon), Runtime.Const(Newline)]),
  Runtime.Tuple([Runtime.Const(Comma)]),
  Runtime.Tuple([Runtime.Const(SemiColon)]),
  Runtime.Tuple([Runtime.Const(Newline)]),
])
// ------------------------------------------------------------------
// PropertyList
// ------------------------------------------------------------------
const PropertyList = Delimit(
  Runtime.Ref('Property'),
  Runtime.Ref('PropertyDelimiter')
)
// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------
const Properties = Runtime.Tuple([
  Runtime.Const(LBrace),
  Runtime.Ref('PropertyList'),
  Runtime.Const(RBrace),
])
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
const _Object_ = Runtime.Ref('Properties')
// ------------------------------------------------------------------
// ElementNamed
// ------------------------------------------------------------------
const ElementNamed = Runtime.Union([
  Runtime.Tuple([Runtime.Ident(), Runtime.Const(Question), Runtime.Const(Colon), Runtime.Const('readonly'), Runtime.Ref('Type')]),
  Runtime.Tuple([Runtime.Ident(), Runtime.Const(Colon), Runtime.Const('readonly'), Runtime.Ref('Type')]),
  Runtime.Tuple([Runtime.Ident(), Runtime.Const(Question), Runtime.Const(Colon), Runtime.Ref('Type')]),
  Runtime.Tuple([Runtime.Ident(), Runtime.Const(Colon), Runtime.Ref('Type')]),
])
// ------------------------------------------------------------------
// ElementReadonlyOptional
// ------------------------------------------------------------------
const ElementReadonlyOptional = Runtime.Tuple([
  Runtime.Const('readonly'),
  Runtime.Ref('Type'),
  Runtime.Const(Question)
])
// ------------------------------------------------------------------
// ElementReadonly
// ------------------------------------------------------------------
const ElementReadonly = Runtime.Tuple([
  Runtime.Const('readonly'),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// ElementOptional
// ------------------------------------------------------------------
const ElementOptional = Runtime.Tuple([
  Runtime.Ref('Type'),
  Runtime.Const(Question)
])
// ------------------------------------------------------------------
// ElementBase
// ------------------------------------------------------------------
const ElementBase = Runtime.Union([
  Runtime.Ref('ElementNamed'),
  Runtime.Ref('ElementReadonlyOptional'),
  Runtime.Ref('ElementReadonly'),
  Runtime.Ref('ElementOptional'),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// Element
// ------------------------------------------------------------------
const Element = Runtime.Union([
  Runtime.Tuple([Runtime.Const('...'), Runtime.Ref('ElementBase')]),
  Runtime.Tuple([Runtime.Ref('ElementBase')])
])
// ------------------------------------------------------------------
// ElementList
// ------------------------------------------------------------------
const ElementList = Delimit(
  Runtime.Ref('Element'),
  Runtime.Const(Comma)
)
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
const Tuple = Runtime.Tuple([
  Runtime.Const(LBracket),
  Runtime.Ref('ElementList'),
  Runtime.Const(RBracket)
])
// ------------------------------------------------------------------
// ParameterReadonlyOptional
// ------------------------------------------------------------------
const ParameterReadonlyOptional = Runtime.Tuple([
  Runtime.Ident(),
  Runtime.Const(Question),
  Runtime.Const(Colon),
  Runtime.Const('readonly'),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// ParameterReadonly
// ------------------------------------------------------------------
const ParameterReadonly = Runtime.Tuple([
  Runtime.Ident(),
  Runtime.Const(Colon),
  Runtime.Const('readonly'),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// ParameterOptional
// ------------------------------------------------------------------
const ParameterOptional = Runtime.Tuple([
  Runtime.Ident(),
  Runtime.Const(Question),
  Runtime.Const(Colon),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// ParameterType
// ------------------------------------------------------------------
const ParameterType = Runtime.Tuple([
  Runtime.Ident(),
  Runtime.Const(Colon),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// ParameterType
// ------------------------------------------------------------------
const ParameterBase = Runtime.Union([
  Runtime.Ref('ParameterReadonlyOptional'),
  Runtime.Ref('ParameterReadonly'),
  Runtime.Ref('ParameterOptional'),
  Runtime.Ref('ParameterType'),
])
// ------------------------------------------------------------------
// Parameter
// ------------------------------------------------------------------
const Parameter = Runtime.Union([
  Runtime.Tuple([Runtime.Const('...'), Runtime.Ref('ParameterBase')]),
  Runtime.Tuple([Runtime.Ref('ParameterBase')]),
])
// ------------------------------------------------------------------
// ParameterList
// ------------------------------------------------------------------
const ParameterList = Delimit(
  Runtime.Ref('Parameter'),
  Runtime.Const(Comma)
)
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
const Constructor = Runtime.Tuple([
  Runtime.Const('new'),
  Runtime.Const(LParen),
  Runtime.Ref('ParameterList'),
  Runtime.Const(RParen),
  Runtime.Const('=>'),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
const Function = Runtime.Tuple([
  Runtime.Const(LParen),
  Runtime.Ref('ParameterList'),
  Runtime.Const(RParen),
  Runtime.Const('=>'),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// MappedReadonly
// ------------------------------------------------------------------
const MappedReadonly = Runtime.Union([
  Runtime.Tuple([Runtime.Const(Plus), Runtime.Const('readonly')]),
  Runtime.Tuple([Runtime.Const(Hyphen), Runtime.Const('readonly')]),
  Runtime.Tuple([Runtime.Const('readonly')]),
  Runtime.Tuple([]),
])
// ------------------------------------------------------------------
// MappedOptional
// ------------------------------------------------------------------
const MappedOptional = Runtime.Union([
  Runtime.Tuple([Runtime.Const(Plus), Runtime.Const(Question)]),
  Runtime.Tuple([Runtime.Const(Hyphen), Runtime.Const(Question)]),
  Runtime.Tuple([Runtime.Const(Question)]),
  Runtime.Tuple([]),
])
// ------------------------------------------------------------------
// MappedAs
// ------------------------------------------------------------------
const MappedAs = Runtime.Union([
  Runtime.Tuple([Runtime.Const('as'), Runtime.Ref('Type')]),
  Runtime.Tuple([]),
])
// ------------------------------------------------------------------
// Mapped
// ------------------------------------------------------------------
const Mapped = Runtime.Tuple([
  Runtime.Const(LBrace),
  Runtime.Ref('MappedReadonly'),
  Runtime.Const(LBracket),
  Runtime.Ident(),
  Runtime.Const('in'),
  Runtime.Ref('Type'),
  Runtime.Ref('MappedAs'),
  Runtime.Const(RBracket),
  Runtime.Ref('MappedOptional'),
  Runtime.Const(Colon),
  Runtime.Ref('Type'),
  Runtime.Ref('OptionalSemiColon'),
  Runtime.Const(RBrace),
])
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
const Options = Runtime.Tuple([
  Runtime.Const('Options'),
  Runtime.Const(LAngle),
  Runtime.Ref('Type'),
  Runtime.Const(Comma),
  Runtime.Ref('JsonObject'),
  Runtime.Const(RAngle),
])
// ------------------------------------------------------------------
//
// Json
//
// These combinators parse Json strings into constant JavaScript
// structures. These combinators are used in tandem with the
// Options generic type, and thus span multiple parsing contexts
// 
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// JsonNumber
// ------------------------------------------------------------------
const JsonNumber = Runtime.Number()
// ------------------------------------------------------------------
// JsonString
// ------------------------------------------------------------------
const JsonString = Runtime.String(['"', "'"])
// ------------------------------------------------------------------
// JsonBoolean
// ------------------------------------------------------------------
const JsonBoolean = Runtime.Union([
  Runtime.Const('true'),
  Runtime.Const('false'),
])
// ------------------------------------------------------------------
// JsonNull
// ------------------------------------------------------------------
const JsonNull = Runtime.Const('null')
// ------------------------------------------------------------------
// JsonProperty
// ------------------------------------------------------------------
const JsonProperty = Runtime.Tuple([
  Runtime.Ref('PropertyKey'),
  Runtime.Const(':'),
  Runtime.Ref('Json')
])
// ------------------------------------------------------------------
// JsonPropertyList
// ------------------------------------------------------------------
const JsonPropertyList = Delimit(
  Runtime.Ref('JsonProperty'),
  Runtime.Ref('PropertyDelimiter')
)
// ------------------------------------------------------------------
// JsonObject
// ------------------------------------------------------------------
const JsonObject = Runtime.Tuple([
  Runtime.Const(LBrace),
  Runtime.Ref('JsonPropertyList'),
  Runtime.Const(RBrace)
])
// ------------------------------------------------------------------
// JsonElementList
// ------------------------------------------------------------------
const JsonElementList = Delimit(
  Runtime.Ref('Json'),
  Runtime.Const(Comma)
)
// ------------------------------------------------------------------
// JsonArray
// ------------------------------------------------------------------
const JsonArray = Runtime.Tuple([
  Runtime.Const(LBracket),
  Runtime.Ref('JsonElementList'),
  Runtime.Const(RBracket)
])
// ------------------------------------------------------------------
// Json
// ------------------------------------------------------------------
const Json = Runtime.Union([
  Runtime.Ref('JsonNumber'),
  Runtime.Ref('JsonBoolean'),
  Runtime.Ref('JsonString'),
  Runtime.Ref('JsonNull'),
  Runtime.Ref('JsonObject'),
  Runtime.Ref('JsonArray')
])
// ------------------------------------------------------------------
//
// Pattern
//
// These combinators are used to derive TypeBox schematics by parsing
// the TemplateLiteral encoding. They are specifically used by the 
// TemplateLiteralDecoder to re-construct types from encoded pattern
// representations.
// 
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// PatternTypes
// ------------------------------------------------------------------
const PatternBigInt = Runtime.Const(BigIntPattern)
const PatternString = Runtime.Const(StringPattern)
const PatternNumber = Runtime.Const(NumberPattern)
const PatternInteger = Runtime.Const(IntegerPattern)
const PatternNever = Runtime.Const(NeverPattern)
// ------------------------------------------------------------------
// PatternText
// ------------------------------------------------------------------
const PatternText = Runtime.Until_1([
  BigIntPattern,
  StringPattern,
  NumberPattern,
  IntegerPattern,
  NeverPattern,
  LParen,
  RParen,
  Dollar,
  Pipe
])
// ------------------------------------------------------------------
// PatternGroup
// ------------------------------------------------------------------
const PatternGroup = Runtime.Tuple([
  Runtime.Const(LParen),
  Runtime.Ref('PatternBody'),
  Runtime.Const(RParen),
])
// ------------------------------------------------------------------
// PatternBase
// ------------------------------------------------------------------
const PatternBase = Runtime.Union([
  Runtime.Ref('PatternBigInt'),
  Runtime.Ref('PatternString'),
  Runtime.Ref('PatternNumber'),
  Runtime.Ref('PatternInteger'),
  Runtime.Ref('PatternNever'),
  Runtime.Ref('PatternGroup'),
  Runtime.Ref('PatternText'),
])
// ------------------------------------------------------------------
// PatternTerm
// ------------------------------------------------------------------
const PatternTerm = Runtime.Tuple([
  Runtime.Ref('PatternBase'),
  Runtime.Ref('PatternBody')
])
// ------------------------------------------------------------------
// PatternUnion
// ------------------------------------------------------------------
const PatternUnion = Runtime.Union([
  Runtime.Tuple([Runtime.Ref('PatternTerm'), Runtime.Const(Pipe), Runtime.Ref('PatternUnion')]),
  Runtime.Tuple([Runtime.Ref('PatternTerm')]),
  Runtime.Tuple([])
])
// ------------------------------------------------------------------
// PatternBody
// ------------------------------------------------------------------
const PatternBody = Runtime.Union([
  Runtime.Ref('PatternUnion'),
  Runtime.Ref('PatternTerm')
])
// ------------------------------------------------------------------
// Pattern
// ------------------------------------------------------------------
const Pattern = Runtime.Tuple([
  Runtime.Const(Caret),
  Runtime.Ref('PatternBody'),
  Runtime.Const(Dollar)
])
// ------------------------------------------------------------------
// InterfaceDeclarationHeritageList
// ------------------------------------------------------------------
const InterfaceDeclarationHeritageList = Delimit(Runtime.Ref('Type'), Runtime.Const(Comma))
// ------------------------------------------------------------------
// InterfaceDeclarationHeritage
// ------------------------------------------------------------------
const InterfaceDeclarationHeritage = Runtime.Union([
  Runtime.Tuple([Runtime.Const('extends'), Runtime.Ref('InterfaceDeclarationHeritageList')]),
  Runtime.Tuple([])
])
// ------------------------------------------------------------------
// InterfaceDeclaration
// ------------------------------------------------------------------
const InterfaceDeclaration = Runtime.Tuple([
  Runtime.Const('interface'),
  Runtime.Ident(),
  Runtime.Ref('InterfaceDeclarationHeritage'),
  Runtime.Ref('Properties')
])
// ------------------------------------------------------------------
// InterfaceDeclaration
// ------------------------------------------------------------------
const InterfaceDeclarationGeneric = Runtime.Tuple([
  Runtime.Const('interface'),
  Runtime.Ident(),
  Runtime.Ref('GenericParameters'),
  Runtime.Ref('InterfaceDeclarationHeritage'),
  Runtime.Ref('Properties')
])
// ------------------------------------------------------------------
// TypeAliasDeclarationGeneric
// ------------------------------------------------------------------
const TypeAliasDeclarationGeneric = Runtime.Tuple([
  Runtime.Const('type'),
  Runtime.Ident(),
  Runtime.Ref('GenericParameters'),
  Runtime.Const(Equals),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// TypeAliasDeclaration
// ------------------------------------------------------------------
const TypeAliasDeclaration = Runtime.Tuple([
  Runtime.Const('type'),
  Runtime.Ident(),
  Runtime.Const(Equals),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// ExportKeyword
// ------------------------------------------------------------------
const ExportKeyword = Runtime.Union([
  Runtime.Tuple([Runtime.Const('export')]),
  Runtime.Tuple([]),
])
// ------------------------------------------------------------------
// ModuleDeclarationDelimiter
// ------------------------------------------------------------------
const ModuleDeclarationDelimiter = Runtime.Union([
  Runtime.Tuple([Runtime.Const(SemiColon), Runtime.Const(Newline)]),
  Runtime.Tuple([Runtime.Const(SemiColon)]),
  Runtime.Tuple([Runtime.Const(Newline)]),
])
// ------------------------------------------------------------------
// ModuleDeclarationList
// ------------------------------------------------------------------
const ModuleDeclarationList = Delimit(
  Runtime.Ref('ModuleDeclaration'),
  Runtime.Ref('ModuleDeclarationDelimiter')
)
// ------------------------------------------------------------------
// ModuleDeclaration
// ------------------------------------------------------------------
const ModuleDeclaration = Runtime.Tuple([
  Runtime.Ref('ExportKeyword'),
  Runtime.Union([
    Runtime.Ref('InterfaceDeclarationGeneric'),
    Runtime.Ref('InterfaceDeclaration'),
    Runtime.Ref('TypeAliasDeclarationGeneric'),
    Runtime.Ref('TypeAliasDeclaration'),
  ]),
  Runtime.Ref('OptionalSemiColon')
])
// ------------------------------------------------------------------
// Module
// ------------------------------------------------------------------
const Module = Runtime.Tuple([
  Runtime.Ref('ModuleDeclaration'),
  Runtime.Ref('ModuleDeclarationList')
])
// ------------------------------------------------------------------
// Script
// ------------------------------------------------------------------
const Script = Runtime.Union([
  Runtime.Ref('Module'),
  Runtime.Ref('GenericType'),
  Runtime.Ref('Type')
])
// ------------------------------------------------------------------
// SyntaxModule
// ------------------------------------------------------------------
export const SyntaxModule = new Runtime.Module({
  // ----------------------------------------------------------------
  // Core
  // ----------------------------------------------------------------
  GenericParameterExtendsEquals,
  GenericParameterExtends,
  GenericParameterEquals,
  GenericParameterIdentifier,
  GenericParameter,
  GenericParameterList,
  GenericParameters,

  GenericCallArgumentList,
  GenericCallArguments,
  GenericCall,

  OptionalSemiColon,

  KeywordString,
  KeywordNumber,
  KeywordBoolean,
  KeywordUndefined,
  KeywordNull,
  KeywordInteger,
  KeywordBigInt,
  KeywordUnknown,
  KeywordAny,
  KeywordObject,
  KeywordNever,
  KeywordSymbol,
  KeywordVoid,
  KeywordThis,
  Keyword,

  TemplateInterpolate,
  TemplateSpan,
  TemplateBody,
  TemplateLiteralTypes,
  TemplateLiteral,

  LiteralBigInt,
  LiteralBoolean,
  LiteralNumber,
  LiteralString,
  Literal,

  KeyOf,
  IndexArray,
  Extends,
  Base,
  Factor,
  ExprTermTail,
  ExprTerm,
  ExprTail,
  Expr,
  ExprReadonly,
  ExprPipe,
  GenericType,
  InferType,
  Type,

  PropertyKeyNumber,
  PropertyKeyIdent,
  PropertyKeyQuoted,
  PropertyKeyIndex,
  PropertyKey,
  Readonly,
  Optional,
  Property,
  PropertyDelimiter,
  PropertyList,
  Properties,
  _Object_,

  ElementNamed,
  ElementReadonlyOptional,
  ElementReadonly,
  ElementOptional,
  ElementBase,
  Element,
  ElementList,
  Tuple,

  ParameterReadonlyOptional,
  ParameterReadonly,
  ParameterOptional,
  ParameterType,
  ParameterBase,
  Parameter,
  ParameterList,
  Function,
  Constructor,

  MappedReadonly,
  MappedOptional,
  MappedAs,
  Mapped,
  Reference,
  Options,

  // ----------------------------------------------------------------
  // Json
  // ----------------------------------------------------------------
  JsonNumber,
  JsonBoolean,
  JsonString,
  JsonNull,
  JsonProperty,
  JsonPropertyList,
  JsonObject,
  JsonElementList,
  JsonArray,
  Json,

  // ----------------------------------------------------------------
  // Pattern
  // ----------------------------------------------------------------
  PatternBigInt,
  PatternString,
  PatternNumber,
  PatternInteger,
  PatternNever,
  PatternText,
  PatternBase,
  PatternGroup,
  PatternUnion,
  PatternTerm,
  PatternBody,
  Pattern,

  // ----------------------------------------------------------------
  // Declarations
  // ----------------------------------------------------------------
  InterfaceDeclarationHeritageList,
  InterfaceDeclarationHeritage,
  InterfaceDeclarationGeneric,
  InterfaceDeclaration,
  TypeAliasDeclarationGeneric,
  TypeAliasDeclaration,
  ExportKeyword,

  // ----------------------------------------------------------------
  // Module
  // ----------------------------------------------------------------
  ModuleDeclarationDelimiter,
  ModuleDeclarationList,
  ModuleDeclaration,
  Module,

  // ----------------------------------------------------------------
  // Script
  // ----------------------------------------------------------------
  Script
})