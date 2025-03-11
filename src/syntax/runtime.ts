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

import { Runtime } from '../parser/index'
import * as t from '../type/index'

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
const Question = '?'
const Colon = ':'
const Comma = ','
const SemiColon = ';'
const SingleQuote = "'"
const DoubleQuote = '"'
const Tilde = '`'
const Equals = '='

// ------------------------------------------------------------------
// DestructureRight
// ------------------------------------------------------------------
// prettier-ignore
function DestructureRight<T>(values: T[]): [T[], T | undefined] {
  return (values.length > 0)
    ? [values.slice(0, values.length - 1), values[values.length - 1]]
    : [values, undefined]
}

// ------------------------------------------------------------------
// Delimit
// ------------------------------------------------------------------
// prettier-ignore
const DelimitHeadMapping = (results: unknown[]) => results.reduce((result: unknown[], value) => {
  const [element, _delimiter] = value as [unknown, unknown]
  return [...result, element]
}, [] as unknown[])
// prettier-ignore
const DelimitHead = <Element extends Runtime.IParser, Delimiter extends Runtime.IParser>(element: Element, delimiter: Delimiter) => (
  Runtime.Array(Runtime.Tuple([element, delimiter]), DelimitHeadMapping)
)
// prettier-ignore
const DelimitTail = <Element extends Runtime.IParser>(element: Element) => Runtime.Union([
  Runtime.Tuple([element]),
  Runtime.Tuple([]),
])
// prettier-ignore
const DelimitMapping = (results: [unknown[], unknown[]]) => {
  return [...results[0], ...results[1]]
}
// prettier-ignore
const Delimit = <Element extends Runtime.IParser, Delimiter extends Runtime.IParser>(element: Element, delimiter: Delimiter) => Runtime.Tuple([
  DelimitHead(element, delimiter),
  DelimitTail(element),
], DelimitMapping)

// ------------------------------------------------------------------
// Dereference
// ------------------------------------------------------------------
const Dereference = (context: t.TProperties, key: string): t.TSchema => {
  return key in context ? context[key] : t.Ref(key)
}

// ------------------------------------------------------------------
// GenericArgumentsList
// ------------------------------------------------------------------
// prettier-ignore
const GenericArgumentsList = Delimit(Runtime.Ident(), Runtime.Const(Comma))

// ------------------------------------------------------------------
// GenericArguments
// ------------------------------------------------------------------
// prettier-ignore
const GenericArgumentsContext = (args: string[], context: t.TProperties) => {
  return args.reduce((result, arg, index) => {
    return { ...result, [arg]: t.Argument(index) }
  }, context)
}
// prettier-ignore
const GenericArgumentsMapping = (results: unknown[], context: t.TProperties) => {
  return results.length === 3
    ? GenericArgumentsContext(results[1] as string[], context)
    : {}
}
// prettier-ignore
const GenericArguments = Runtime.Tuple([
  Runtime.Const(LAngle),
  Runtime.Ref('GenericArgumentsList'),
  Runtime.Const(RAngle),
], (results, context) => GenericArgumentsMapping(results, context))

// ------------------------------------------------------------------
// GenericReference
// ------------------------------------------------------------------
function GenericReferenceMapping(results: unknown[], context: t.TProperties) {
  const type = Dereference(context, results[0] as string)
  const args = results[2] as t.TSchema[]
  return t.Instantiate(type, args)
}
const GenericReferenceParameters = Delimit(Runtime.Ref('Type'), Runtime.Const(Comma))
// prettier-ignore
const GenericReference = Runtime.Tuple([
  Runtime.Ident(), 
  Runtime.Const(LAngle), 
  Runtime.Ref('GenericReferenceParameters'),
  Runtime.Const(RAngle)
], (results, context) => GenericReferenceMapping(results, context))

// ------------------------------------------------------------------
// Reference
// ------------------------------------------------------------------
function ReferenceMapping(result: string, context: t.TProperties) {
  const target = Dereference(context, result)
  return target
}
// prettier-ignore
const Reference = Runtime.Ident((result, context) => ReferenceMapping(result, context))

// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
// prettier-ignore
const Literal = Runtime.Union([
  Runtime.Union([Runtime.Const('true'), Runtime.Const('false')], value => t.Literal(value === 'true')),
  Runtime.Number(value => t.Literal(parseFloat(value))),
  Runtime.String([SingleQuote, DoubleQuote, Tilde], value => t.Literal(value))
])

// ------------------------------------------------------------------
// Keyword
// ------------------------------------------------------------------
// prettier-ignore
const Keyword = Runtime.Union([
  Runtime.Const('string', Runtime.As(t.String())),
  Runtime.Const('number', Runtime.As(t.Number())),
  Runtime.Const('boolean', Runtime.As(t.Boolean())),
  Runtime.Const('undefined', Runtime.As(t.Undefined())),
  Runtime.Const('null', Runtime.As(t.Null())),
  Runtime.Const('integer', Runtime.As(t.Integer())),
  Runtime.Const('bigint', Runtime.As(t.BigInt())),
  Runtime.Const('unknown', Runtime.As(t.Unknown())),
  Runtime.Const('any', Runtime.As(t.Any())),
  Runtime.Const('never', Runtime.As(t.Never())),
  Runtime.Const('symbol', Runtime.As(t.Symbol())),
  Runtime.Const('void', Runtime.As(t.Void())),
])

// ------------------------------------------------------------------
// KeyOf
// ------------------------------------------------------------------
// prettier-ignore
const KeyOfMapping = (values: unknown[]) => (
  values.length > 0
)
// prettier-ignore
const KeyOf = Runtime.Union([
  Runtime.Tuple([Runtime.Const('keyof')]), Runtime.Tuple([])
], KeyOfMapping)

// ------------------------------------------------------------------
// IndexArray
// ------------------------------------------------------------------
// prettier-ignore
const IndexArrayMapping = (results: ([unknown, unknown, unknown] | [unknown, unknown])[]) => {
  return results.reduce((result: unknown[], current) => {
    return current.length === 3 
      ? [...result, [current[1]]] 
      : [...result, []]
  }, [] as unknown[])
}
// prettier-ignore
const IndexArray = Runtime.Array(Runtime.Union([
  Runtime.Tuple([Runtime.Const(LBracket), Runtime.Ref('Type'), Runtime.Const(RBracket)]),
  Runtime.Tuple([Runtime.Const(LBracket), Runtime.Const(RBracket)]),
]), IndexArrayMapping)

// ------------------------------------------------------------------
// Extends
// ------------------------------------------------------------------
// prettier-ignore
const ExtendsMapping = (values: unknown[]) => {
  return values.length === 6
    ? [values[1], values[3], values[5]]
    : []
}
// prettier-ignore
const Extends = Runtime.Union([
  Runtime.Tuple([Runtime.Const('extends'), Runtime.Ref('Type'), Runtime.Const(Question), Runtime.Ref('Type'), Runtime.Const(Colon), Runtime.Ref('Type')]),
  Runtime.Tuple([])
], ExtendsMapping)

// ------------------------------------------------------------------
// Base
// ------------------------------------------------------------------
// prettier-ignore
const BaseMapping = (value: unknown) => {
  return t.ValueGuard.IsArray(value) && value.length === 3 
    ? value[1] 
    : value
}
// prettier-ignore
const Base = Runtime.Union([
  Runtime.Tuple([Runtime.Const(LParen), Runtime.Ref('Type'), Runtime.Const(RParen)]),
  Runtime.Ref('Keyword'),
  Runtime.Ref('Object'),
  Runtime.Ref('Tuple'),
  Runtime.Ref('Literal'),
  Runtime.Ref('Constructor'),
  Runtime.Ref('Function'),
  Runtime.Ref('Mapped'),
  Runtime.Ref('AsyncIterator'),
  Runtime.Ref('Iterator'),
  Runtime.Ref('ConstructorParameters'),
  Runtime.Ref('FunctionParameters'),
  Runtime.Ref('InstanceType'),
  Runtime.Ref('ReturnType'),
  Runtime.Ref('Argument'),
  Runtime.Ref('Awaited'),
  Runtime.Ref('Array'),
  Runtime.Ref('Record'),
  Runtime.Ref('Promise'),
  Runtime.Ref('Partial'),
  Runtime.Ref('Required'),
  Runtime.Ref('Pick'),
  Runtime.Ref('Omit'),
  Runtime.Ref('Exclude'),
  Runtime.Ref('Extract'),
  Runtime.Ref('Uppercase'),
  Runtime.Ref('Lowercase'),
  Runtime.Ref('Capitalize'),
  Runtime.Ref('Uncapitalize'),
  Runtime.Ref('Date'),
  Runtime.Ref('Uint8Array'),
  Runtime.Ref('GenericReference'),
  Runtime.Ref('Reference')
], BaseMapping)

// ------------------------------------------------------------------
// Factor
// ------------------------------------------------------------------
// prettier-ignore
const FactorExtends = (Type: t.TSchema, Extends: t.TSchema[]) => {
  return Extends.length === 3
    ? t.Extends(Type, Extends[0], Extends[1], Extends[2])
    : Type
}
// prettier-ignore
const FactorIndexArray = (Type: t.TSchema, IndexArray: unknown[]): t.TSchema => {
  const [Left, Right] = DestructureRight(IndexArray) as [unknown[], t.TSchema[]]
  return (
    !t.ValueGuard.IsUndefined(Right) ? (
      // note: Indexed types require reimplementation to replace `[number]` indexers
      Right.length === 1 ? t.Index(FactorIndexArray(Type, Left), Right[0]) as never :
      Right.length === 0 ? t.Array(FactorIndexArray(Type, Left)) :
      t.Never()
    ) : Type
  ) 
}
// prettier-ignore
const FactorMapping = (KeyOf: boolean, Type: t.TSchema, IndexArray: unknown[], Extends: t.TSchema[]) => {
  return KeyOf
    ? FactorExtends(t.KeyOf(FactorIndexArray(Type, IndexArray)), Extends)
    : FactorExtends(FactorIndexArray(Type, IndexArray), Extends)
}
// prettier-ignore
const Factor = Runtime.Tuple([
  Runtime.Ref<boolean>('KeyOf'), 
  Runtime.Ref<t.TSchema>('Base'),
  Runtime.Ref<unknown[]>('IndexArray'),
  Runtime.Ref<t.TSchema[]>('Extends')
], results => FactorMapping(...results))

// ------------------------------------------------------------------
// Expr
// ------------------------------------------------------------------
// prettier-ignore
function ExprBinaryMapping(Left: t.TSchema, Rest: unknown[]): t.TSchema {
  return (
    Rest.length === 3 ? (() => {
      const [Operator, Right, Next] = Rest as [string, t.TSchema, unknown[]]
      const Schema = ExprBinaryMapping(Right, Next)
      if (Operator === '&') {
        return t.TypeGuard.IsIntersect(Schema)
          ? t.Intersect([Left, ...Schema.allOf])
          : t.Intersect([Left, Schema])
      }
      if (Operator === '|') {
        return t.TypeGuard.IsUnion(Schema)
          ? t.Union([Left, ...Schema.anyOf])
          : t.Union([Left, Schema])
      }
      throw 1
    })() : Left
  )
}
// prettier-ignore
const ExprTermTail = Runtime.Union([
  Runtime.Tuple([Runtime.Const('&'), Runtime.Ref('Factor'), Runtime.Ref('ExprTermTail')]),
  Runtime.Tuple([])
])
// prettier-ignore
const ExprTerm = Runtime.Tuple([
  Runtime.Ref<t.TSchema>('Factor'), Runtime.Ref<unknown[]>('ExprTermTail')
], results => ExprBinaryMapping(...results))
// prettier-ignore
const ExprTail = Runtime.Union([
  Runtime.Tuple([Runtime.Const('|'), Runtime.Ref('ExprTerm'), Runtime.Ref('ExprTail')]),
  Runtime.Tuple([])
])
// prettier-ignore
const Expr = Runtime.Tuple([
  Runtime.Ref<t.TSchema>('ExprTerm'), Runtime.Ref<unknown[]>('ExprTail')
], results => ExprBinaryMapping(...results))

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
// prettier-ignore
const Type = Runtime.Union([
  Runtime.Context(Runtime.Ref('GenericArguments'), Runtime.Ref('Expr')), 
  Runtime.Ref('Expr')
])

// ------------------------------------------------------------------
// Property
// ------------------------------------------------------------------
const PropertyKey = Runtime.Union([Runtime.Ident(), Runtime.String([SingleQuote, DoubleQuote])])
const Readonly = Runtime.Union([Runtime.Tuple([Runtime.Const('readonly')]), Runtime.Tuple([])], (value) => value.length > 0)
const Optional = Runtime.Union([Runtime.Tuple([Runtime.Const(Question)]), Runtime.Tuple([])], (value) => value.length > 0)
// prettier-ignore
const PropertyMapping = (IsReadonly: boolean, Key: string, IsOptional: boolean, _: typeof Colon, Type: t.TSchema) => ({
  [Key]: (
    IsReadonly && IsOptional ? t.ReadonlyOptional(Type) :
    IsReadonly && !IsOptional ? t.Readonly(Type) :
    !IsReadonly && IsOptional ? t.Optional(Type) :
    Type
  )
})
// prettier-ignore
const Property = Runtime.Tuple([
  Runtime.Ref<boolean>('Readonly'),
  Runtime.Ref<string>('PropertyKey'),
  Runtime.Ref<boolean>('Optional'),
  Runtime.Const(Colon),
  Runtime.Ref<t.TSchema>('Type'),
], results => PropertyMapping(...results))

// ------------------------------------------------------------------
// PropertyDelimiter
// ------------------------------------------------------------------
// prettier-ignore
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
const PropertyList = Delimit(Runtime.Ref('Property'), Runtime.Ref('PropertyDelimiter'))

// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
const ObjectMapping = (results: unknown[]) => {
  const propertyList = results[1] as t.TProperties[]
  return t.Object(propertyList.reduce((result, property) => {
    return { ...result, ...property }
  }, {} as t.TProperties))
}
// prettier-ignore
const _Object = Runtime.Tuple([
  Runtime.Const(LBrace),
  Runtime.Ref('PropertyList'),
  Runtime.Const(RBrace)
], ObjectMapping)

// ------------------------------------------------------------------
// ElementList
// ------------------------------------------------------------------
const ElementList = Delimit(Runtime.Ref('Type'), Runtime.Const(Comma))

// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
const Tuple = Runtime.Tuple([
  Runtime.Const(LBracket),
  Runtime.Ref<t.TSchema[]>('ElementList'),
  Runtime.Const(RBracket)
], results => t.Tuple(results[1]))

// ------------------------------------------------------------------
// Parameters
// ------------------------------------------------------------------
// prettier-ignore
const Parameter = Runtime.Tuple([
  Runtime.Ident(), Runtime.Const(Colon), Runtime.Ref<t.TSchema>('Type')
], results => results[2])

// ------------------------------------------------------------------
// ParameterList
// ------------------------------------------------------------------
const ParameterList = Delimit(Runtime.Ref('Parameter'), Runtime.Const(Comma))

// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
const Constructor = Runtime.Tuple([
  Runtime.Const('new'), 
  Runtime.Const(LParen), 
  Runtime.Ref<t.TSchema[]>('ParameterList'), 
  Runtime.Const(RParen), 
  Runtime.Const('=>'), 
  Runtime.Ref<t.TSchema>('Type')
], results => t.Constructor(results[2], results[5]))

// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
const Function = Runtime.Tuple([
  Runtime.Const(LParen), 
  Runtime.Ref<t.TSchema[]>('ParameterList'), 
  Runtime.Const(RParen), 
  Runtime.Const('=>'), 
  Runtime.Ref<t.TSchema>('Type')
], results => t.Function(results[1], results[4]))

// ------------------------------------------------------------------
// Mapped (requires deferred types)
// ------------------------------------------------------------------
// prettier-ignore
const MappedMapping = (results: unknown[]) => {
  return t.Literal('Mapped types not supported')
}
// prettier-ignore
const Mapped = Runtime.Tuple([
  Runtime.Const(LBrace), 
  Runtime.Const(LBracket), 
  Runtime.Ident(), 
  Runtime.Const('in'), 
  Runtime.Ref('Type'), 
  Runtime.Const(RBracket), 
  Runtime.Const(Colon), 
  Runtime.Ref('Type'), 
  Runtime.Const(RBrace)
], MappedMapping)

// ------------------------------------------------------------------
// AsyncIterator
// ------------------------------------------------------------------
// prettier-ignore
const AsyncIterator = Runtime.Tuple([
  Runtime.Const('AsyncIterator'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),
], results => t.AsyncIterator(results[2]))

// ------------------------------------------------------------------
// Iterator
// ------------------------------------------------------------------
// prettier-ignore
const Iterator = Runtime.Tuple([
  Runtime.Const('Iterator'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),
], results => t.Iterator(results[2]))

// ------------------------------------------------------------------
// ConstructorParameters
// ------------------------------------------------------------------
// prettier-ignore
const ConstructorParameters = Runtime.Tuple([
  Runtime.Const('ConstructorParameters'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TConstructor>('Type'), 
  Runtime.Const(RAngle),
], results => t.ConstructorParameters(results[2]))

// ------------------------------------------------------------------
// Parameters
// ------------------------------------------------------------------
// prettier-ignore
const FunctionParameters = Runtime.Tuple([
  Runtime.Const('Parameters'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TFunction>('Type'), 
  Runtime.Const(RAngle),
], results => t.Parameters(results[2]))

// ------------------------------------------------------------------
// InstanceType
// ------------------------------------------------------------------
// prettier-ignore
const InstanceType = Runtime.Tuple([
  Runtime.Const('InstanceType'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TConstructor>('Type'), 
  Runtime.Const(RAngle),
], results => t.InstanceType(results[2]))

// ------------------------------------------------------------------
// ReturnType
// ------------------------------------------------------------------
// prettier-ignore
const ReturnType = Runtime.Tuple([
  Runtime.Const('ReturnType'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TFunction>('Type'), 
  Runtime.Const(RAngle),
], results => t.ReturnType(results[2]))

// ------------------------------------------------------------------
// Argument
// ------------------------------------------------------------------
// prettier-ignore
const Argument = Runtime.Tuple([
  Runtime.Const('Argument'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),
], results => {
  return t.KindGuard.IsLiteralNumber(results[2])
    ? t.Argument(Math.trunc(results[2].const))
    : t.Never()
})

// ------------------------------------------------------------------
// Awaited
// ------------------------------------------------------------------
// prettier-ignore
const Awaited = Runtime.Tuple([
  Runtime.Const('Awaited'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),
], results => t.Awaited(results[2]))

// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
const Array = Runtime.Tuple([
  Runtime.Const('Array'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),
], results => t.Array(results[2]))

// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
// prettier-ignore
const Record = Runtime.Tuple([
  Runtime.Const('Record'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'),
  Runtime.Const(Comma), 
  Runtime.Ref<t.TSchema>('Type'),
  Runtime.Const(RAngle),  
], results => t.Record(results[2], results[4]))

// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
// prettier-ignore
const Promise = Runtime.Tuple([
  Runtime.Const('Promise'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Promise(results[2]))

// ------------------------------------------------------------------
// Partial
// ------------------------------------------------------------------
// prettier-ignore
const Partial = Runtime.Tuple([
  Runtime.Const('Partial'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Partial(results[2]))

// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
// prettier-ignore
const Required = Runtime.Tuple([
  Runtime.Const('Required'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Required(results[2]))

// ------------------------------------------------------------------
// Pick
// ------------------------------------------------------------------
// prettier-ignore
const Pick = Runtime.Tuple([
  Runtime.Const('Pick'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(Comma), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Pick(results[2], results[4]))

// ------------------------------------------------------------------
// Omit
// ------------------------------------------------------------------
// prettier-ignore
const Omit = Runtime.Tuple([
  Runtime.Const('Omit'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(Comma), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Omit(results[2], results[4]))

// ------------------------------------------------------------------
// Exclude
// ------------------------------------------------------------------
// prettier-ignore
const Exclude = Runtime.Tuple([
  Runtime.Const('Exclude'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(Comma), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Exclude(results[2], results[4]))

// ------------------------------------------------------------------
// Extract
// ------------------------------------------------------------------
// prettier-ignore
const Extract = Runtime.Tuple([
  Runtime.Const('Extract'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(Comma), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Extract(results[2], results[4]))

// ------------------------------------------------------------------
// Uppercase
// ------------------------------------------------------------------
// prettier-ignore
const Uppercase = Runtime.Tuple([
  Runtime.Const('Uppercase'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Uppercase(results[2]))

// ------------------------------------------------------------------
// Lowercase
// ------------------------------------------------------------------
// prettier-ignore
const Lowercase = Runtime.Tuple([
  Runtime.Const('Lowercase'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Lowercase(results[2]))

// ------------------------------------------------------------------
// Capitalize
// ------------------------------------------------------------------
// prettier-ignore
const Capitalize = Runtime.Tuple([
  Runtime.Const('Capitalize'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Capitalize(results[2]))

// ------------------------------------------------------------------
// Uncapitalize
// ------------------------------------------------------------------
// prettier-ignore
const Uncapitalize = Runtime.Tuple([
  Runtime.Const('Uncapitalize'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], results => t.Uncapitalize(results[2]))

// ------------------------------------------------------------------
// Date
// ------------------------------------------------------------------
const Date = Runtime.Const('Date', Runtime.As(t.Date()))

// ------------------------------------------------------------------
// Uint8Array
// ------------------------------------------------------------------
const Uint8Array = Runtime.Const('Uint8Array', Runtime.As(t.Uint8Array()))

// ------------------------------------------------------------------
// Module
// ------------------------------------------------------------------
// prettier-ignore
export const Module = new Runtime.Module({
  GenericArgumentsList,
  GenericArguments,
  Literal,
  Keyword,
  KeyOf,
  IndexArray,
  Extends,
  Base,
  Factor,
  ExprTermTail,
  ExprTerm,
  ExprTail,
  Expr,
  Type,
  PropertyKey,
  Readonly,
  Optional,
  Property,
  PropertyDelimiter,
  PropertyList,
  Object: _Object,
  ElementList,
  Tuple,
  Parameter,
  ParameterList,
  Function,
  Constructor,
  Mapped,
  AsyncIterator,
  Iterator,
  Argument,
  Awaited,
  Array,
  Record,
  Promise,
  ConstructorParameters,
  FunctionParameters,
  InstanceType,
  ReturnType,
  Partial,
  Required,
  Pick,
  Omit,
  Exclude,
  Extract,
  Uppercase,
  Lowercase,
  Capitalize,
  Uncapitalize,
  Date,
  Uint8Array,
  GenericReferenceParameters,
  GenericReference,
  Reference,
})
