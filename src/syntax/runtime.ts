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
// Deref
// ------------------------------------------------------------------
const Deref = (context: t.TProperties, key: string): t.TSchema => {
  return key in context ? context[key] : t.Ref(key)
}
// ------------------------------------------------------------------
// Reference
// ------------------------------------------------------------------
// prettier-ignore
const Reference = Runtime.Ident((value, context: t.TProperties) => Deref(context, value))
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
  Runtime.Const('any', Runtime.As(t.Any())),
  Runtime.Const('bigint', Runtime.As(t.BigInt())),
  Runtime.Const('boolean', Runtime.As(t.Boolean())),
  Runtime.Const('integer', Runtime.As(t.Integer())),
  Runtime.Const('never', Runtime.As(t.Never())),
  Runtime.Const('null', Runtime.As(t.Null())),
  Runtime.Const('number', Runtime.As(t.Number())),
  Runtime.Const('string', Runtime.As(t.String())),
  Runtime.Const('symbol', Runtime.As(t.Symbol())),
  Runtime.Const('undefined', Runtime.As(t.Undefined())),
  Runtime.Const('unknown', Runtime.As(t.Unknown())),
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
const IndexArrayMapping = (values: unknown[]) => (
  values.length === 4 ? [[values[1]], ...values[3] as unknown[]] :
  values.length === 3 ? [[], ...values[2] as unknown[]] :
  []
)
// prettier-ignore
const IndexArray = Runtime.Union([
  Runtime.Tuple([Runtime.Const(LBracket), Runtime.Ref('Type'), Runtime.Const(RBracket), Runtime.Ref('IndexArray')]),
  Runtime.Tuple([Runtime.Const(LBracket), Runtime.Const(RBracket), Runtime.Ref('IndexArray')]),
  Runtime.Tuple([])
], value => IndexArrayMapping(value))

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
const BaseMapping = (values: unknown[]) => {
  return values.length === 3 ? values[1] : values[0]
}
// prettier-ignore
const Base = Runtime.Union([
  Runtime.Tuple([
    Runtime.Const(LParen), 
    Runtime.Ref('Type'), 
    Runtime.Const(RParen)
  ]),
  Runtime.Tuple([Runtime.Union([
    Runtime.Ref('Literal'),
    Runtime.Ref('Keyword'),
    Runtime.Ref('Object'),
    Runtime.Ref('Tuple'),
    Runtime.Ref('Constructor'),
    Runtime.Ref('Function'),
    Runtime.Ref('Mapped'),
    Runtime.Ref('AsyncIterator'),
    Runtime.Ref('Iterator'),
    Runtime.Ref('ConstructorParameters'),
    Runtime.Ref('FunctionParameters'),
    Runtime.Ref('InstanceType'),
    Runtime.Ref('ReturnType'),
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
    Runtime.Ref('Reference')
  ])])
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
], values => FactorMapping(...values))
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
], value => ExprBinaryMapping(...value))
// prettier-ignore
const ExprTail = Runtime.Union([
  Runtime.Tuple([Runtime.Const('|'), Runtime.Ref('ExprTerm'), Runtime.Ref('ExprTail')]),
  Runtime.Tuple([])
])
// prettier-ignore
const Expr = Runtime.Tuple([
  Runtime.Ref<t.TSchema>('ExprTerm'), Runtime.Ref<unknown[]>('ExprTail')
], value => ExprBinaryMapping(...value))

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
const Type = Runtime.Ref('Expr')
// ------------------------------------------------------------------
// Properties
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
], value => PropertyMapping(...value))
// prettier-ignore
const PropertyDelimiter = Runtime.Union([
  Runtime.Tuple([Runtime.Const(Comma), Runtime.Const(Newline)]),
  Runtime.Tuple([Runtime.Const(SemiColon), Runtime.Const(Newline)]),
  Runtime.Tuple([Runtime.Const(Comma)]),
  Runtime.Tuple([Runtime.Const(SemiColon)]),
  Runtime.Tuple([Runtime.Const(Newline)]),
])
// prettier-ignore
const Properties = Runtime.Union([
  Runtime.Tuple([Runtime.Ref<t.TProperties>('Property'), Runtime.Ref('PropertyDelimiter'), Runtime.Ref<t.TProperties>('Properties')]),
  Runtime.Tuple([Runtime.Ref<t.TProperties>('Property'), Runtime.Ref('PropertyDelimiter')]),
  Runtime.Tuple([Runtime.Ref<t.TProperties>('Property')]),
  Runtime.Tuple([])
], values => (
  values.length === 3 ? { ...values[0], ...values[2] } :
  values.length === 2 ? values[0] :
  values.length === 1 ? values[0] :
  {}
))
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
// prettier-ignore
const ObjectMapping = (_0: typeof LBrace, Properties: t.TProperties, _2: typeof RBrace) => t.Object(Properties)
// prettier-ignore
const _Object = Runtime.Tuple([
  Runtime.Const(LBrace),
  Runtime.Ref<t.TProperties>('Properties'),
  Runtime.Const(RBrace)
], values => ObjectMapping(...values))

// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
// prettier-ignore
const Elements = Runtime.Union([
  Runtime.Tuple([Runtime.Ref('Type'), Runtime.Const(Comma), Runtime.Ref<unknown[]>('Elements')]),
  Runtime.Tuple([Runtime.Ref('Type'), Runtime.Const(Comma)]),
  Runtime.Tuple([Runtime.Ref('Type')]),
  Runtime.Tuple([]),
], value => (
  value.length === 3 ? [value[0], ...value[2]] :
  value.length === 2 ? [value[0]] :
  value.length === 1 ? [value[0]] :
  []
))
// prettier-ignore
const Tuple = Runtime.Tuple([
  Runtime.Const(LBracket),
  Runtime.Ref<t.TSchema[]>('Elements'),
  Runtime.Const(RBracket)
], value => t.Tuple(value[1]))

// ------------------------------------------------------------------
// Parameters
// ------------------------------------------------------------------
// prettier-ignore
const Parameter = Runtime.Tuple([
  Runtime.Ident(), Runtime.Const(Colon), Runtime.Ref<t.TSchema>('Type')
], value => value[2])
// prettier-ignore
const Parameters = Runtime.Union([
  Runtime.Tuple([Runtime.Ref('Parameter'), Runtime.Const(Comma), Runtime.Ref<unknown[]>('Parameters')]),
  Runtime.Tuple([Runtime.Ref('Parameter'), Runtime.Const(Comma)]),
  Runtime.Tuple([Runtime.Ref('Parameter')]),
  Runtime.Tuple([]),
], value => (
  value.length === 3 ? [value[0], ...value[2]] :
  value.length === 2 ? [value[0]] :
  value.length === 1 ? [value[0]] :
  []
))
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
// prettier-ignore
const Constructor = Runtime.Tuple([
  Runtime.Const('new'), 
  Runtime.Const(LParen), 
  Runtime.Ref<t.TSchema[]>('Parameters'), 
  Runtime.Const(RParen), 
  Runtime.Const('=>'), 
  Runtime.Ref<t.TSchema>('Type')
], value => t.Constructor(value[2], value[5]))
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
// prettier-ignore
const Function = Runtime.Tuple([
  Runtime.Const(LParen), 
  Runtime.Ref<t.TSchema[]>('Parameters'), 
  Runtime.Const(RParen), 
  Runtime.Const('=>'), 
  Runtime.Ref<t.TSchema>('Type')
], value => t.Function(value[1], value[4]))
// ------------------------------------------------------------------
// Mapped (requires deferred types)
// ------------------------------------------------------------------
// prettier-ignore
const MappedMapping = (values: unknown[]) => {
  return t.Literal('Mapped types not supported')
}
// prettier-ignore
const Mapped = Runtime.Tuple([
  Runtime.Const(LBrace), 
  Runtime.Const(LBracket), 
  Runtime.Ident(), 
  Runtime.Const('in'), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RBracket), 
  Runtime.Const(Colon), 
  Runtime.Ref<t.TSchema>('Type'), 
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
], value => t.AsyncIterator(value[2]))
// ------------------------------------------------------------------
// Iterator
// ------------------------------------------------------------------
// prettier-ignore
const Iterator = Runtime.Tuple([
  Runtime.Const('Iterator'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),
], value => t.Iterator(value[2]))
// ------------------------------------------------------------------
// ConstructorParameters
// ------------------------------------------------------------------
// prettier-ignore
const ConstructorParameters = Runtime.Tuple([
  Runtime.Const('ConstructorParameters'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TConstructor>('Type'), 
  Runtime.Const(RAngle),
], value => t.ConstructorParameters(value[2]))
// ------------------------------------------------------------------
// Parameters
// ------------------------------------------------------------------
// prettier-ignore
const FunctionParameters = Runtime.Tuple([
  Runtime.Const('Parameters'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TFunction>('Type'), 
  Runtime.Const(RAngle),
], value => t.Parameters(value[2]))
// ------------------------------------------------------------------
// InstanceType
// ------------------------------------------------------------------
// prettier-ignore
const InstanceType = Runtime.Tuple([
  Runtime.Const('InstanceType'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TConstructor>('Type'), 
  Runtime.Const(RAngle),
], value => t.InstanceType(value[2]))
// ------------------------------------------------------------------
// ReturnType
// ------------------------------------------------------------------
// prettier-ignore
const ReturnType = Runtime.Tuple([
  Runtime.Const('ReturnType'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TFunction>('Type'), 
  Runtime.Const(RAngle),
], value => t.ReturnType(value[2]))
// ------------------------------------------------------------------
// Awaited
// ------------------------------------------------------------------
// prettier-ignore
const Awaited = Runtime.Tuple([
  Runtime.Const('Awaited'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),
], value => t.Awaited(value[2]))
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
// prettier-ignore
const Array = Runtime.Tuple([
  Runtime.Const('Array'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),
], value => t.Array(value[2]))
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
], value => t.Record(value[2], value[4]))
// ------------------------------------------------------------------
// Promise
// ------------------------------------------------------------------
// prettier-ignore
const Promise = Runtime.Tuple([
  Runtime.Const('Promise'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], value => t.Promise(value[2]))
// ------------------------------------------------------------------
// Partial
// ------------------------------------------------------------------
// prettier-ignore
const Partial = Runtime.Tuple([
  Runtime.Const('Partial'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], value => t.Partial(value[2]))
// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
// prettier-ignore
const Required = Runtime.Tuple([
  Runtime.Const('Required'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], value => t.Required(value[2]))
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
], value => t.Pick(value[2], value[4]))
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
], value => t.Omit(value[2], value[4]))
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
], value => t.Exclude(value[2], value[4]))
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
], value => t.Extract(value[2], value[4]))
// ------------------------------------------------------------------
// Uppercase
// ------------------------------------------------------------------
// prettier-ignore
const Uppercase = Runtime.Tuple([
  Runtime.Const('Uppercase'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], value => t.Uppercase(value[2]))
// ------------------------------------------------------------------
// Lowercase
// ------------------------------------------------------------------
// prettier-ignore
const Lowercase = Runtime.Tuple([
  Runtime.Const('Lowercase'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], value => t.Lowercase(value[2]))
// ------------------------------------------------------------------
// Capitalize
// ------------------------------------------------------------------
// prettier-ignore
const Capitalize = Runtime.Tuple([
  Runtime.Const('Capitalize'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], value => t.Capitalize(value[2]))
// ------------------------------------------------------------------
// Uncapitalize
// ------------------------------------------------------------------
// prettier-ignore
const Uncapitalize = Runtime.Tuple([
  Runtime.Const('Uncapitalize'), 
  Runtime.Const(LAngle), 
  Runtime.Ref<t.TSchema>('Type'), 
  Runtime.Const(RAngle),  
], value => t.Uncapitalize(value[2]))
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
  // ----------------------------------------------------------------
  // Type Expressions
  // ----------------------------------------------------------------
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
  Type, // Alias for Expr
  PropertyKey,
  Readonly,
  Optional,
  Property,
  PropertyDelimiter,
  Properties,
  Object: _Object,
  Elements,
  Tuple,
  Parameter,
  Function,
  Parameters,
  Constructor,
  Mapped,
  AsyncIterator,
  Iterator,
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
  Reference,
})
