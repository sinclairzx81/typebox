import { JavaScriptTypeBuilder } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

const Type = new JavaScriptTypeBuilder()

// TypeBuilder will proxy calls through to the raw function API
describe('type/options/AssignTypeBuilder', () => {
  it('Should assign options for Any', () => {
    const T = Type.Any({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Array', () => {
    const T = Type.Array(Type.String(), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for AsyncIterator', () => {
    const T = Type.AsyncIterator(Type.String(), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Awaited', () => {
    const T = Type.Awaited(Type.String(), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for BigInt', () => {
    const T = Type.BigInt({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Boolean', () => {
    const T = Type.Boolean({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Capitalize', () => {
    const T = Type.Capitalize(Type.Literal('hello'), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Composite', () => {
    const T = Type.Composite([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Const', () => {
    const T = Type.Const(1, { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Constructor', () => {
    const T = Type.Constructor([], Type.Any(), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Date', () => {
    const T = Type.Date({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Enum', () => {
    const T = Type.Enum({}, { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Exclude', () => {
    const T = Type.Exclude(Type.Union([Type.Literal(1), Type.Literal(2)]), Type.Literal(2), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Extends', () => {
    const T = Type.Extends(Type.String(), Type.String(), Type.Number(), Type.Null(), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Extract', () => {
    const T = Type.Extract(Type.Union([Type.Literal(1), Type.Literal(2)]), Type.Literal(2), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Function', () => {
    const T = Type.Function([], Type.Any(), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Integer', () => {
    const T = Type.Integer({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Intersect 1', () => {
    const T = Type.Intersect([], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Intersect 2', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() })], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Intersect 3', () => {
    const T = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Iterator', () => {
    const T = Type.Iterator(Type.String(), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for KeyOf', () => {
    const T = Type.KeyOf(Type.Object({ x: Type.Number() }), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Literal', () => {
    const T = Type.Literal(1, { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Lowercase', () => {
    const T = Type.Lowercase(Type.Literal('hello'), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Mapped 1', () => {
    const M = Type.Mapped(Type.TemplateLiteral('${1|2|3}'), (K) => K, { foo: 'bar' })
    Assert.IsEqual(M.foo, 'bar')
  })
  it('Should assign options for Mapped 2', () => {
    const T = Type.Object({ x: Type.Number() })
    const M = Type.Mapped(Type.KeyOf(T), (K) => Type.Index(T, K), { foo: 'bar' })
    Assert.IsEqual(M.foo, 'bar')
  })
  it('Should assign options for Never', () => {
    const T = Type.Never({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Not', () => {
    const T = Type.Not(Type.String(), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Null', () => {
    const T = Type.Null({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Number', () => {
    const T = Type.Number({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Object', () => {
    const T = Type.Object(
      {
        x: Type.String(),
      },
      { foo: 'bar' },
    )
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Omit', () => {
    const T = Type.Omit(
      Type.Object({
        x: Type.String(),
        y: Type.String(),
      }),
      ['x'],
      { foo: 'bar' },
    )
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Partial', () => {
    const T = Type.Partial(
      Type.Object({
        x: Type.String(),
      }),
      { foo: 'bar' },
    )
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Pick', () => {
    const T = Type.Pick(
      Type.Object({
        x: Type.String(),
        y: Type.String(),
      }),
      ['x'],
      { foo: 'bar' },
    )
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Record', () => {
    const T = Type.Record(Type.String(), Type.Number(), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Recursive', () => {
    const T = Type.Recursive(
      (This) =>
        Type.Object({
          x: Type.Number(),
          y: Type.Array(This),
        }),
      { foo: 'bar' },
    )
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Ref 1', () => {
    const T = Type.Object({ x: Type.Number() }, { $id: 'T' })
    const R = Type.Ref(T, { foo: 'bar' })
    Assert.IsEqual(R.foo, 'bar')
  })
  it('Should assign options for Ref 2', () => {
    const R = Type.Ref('T', { foo: 'bar' })
    Assert.IsEqual(R.foo, 'bar')
  })
  it('Should assign options for RegExp', () => {
    const R = Type.RegExp(/xyz/, { foo: 'bar' })
    Assert.IsEqual(R.foo, 'bar')
  })
  it('Should assign options for Partial', () => {
    const T = Type.Required(
      Type.Object({
        x: Type.String(),
      }),
      { foo: 'bar' },
    )
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for String', () => {
    const T = Type.String({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Symbol', () => {
    const T = Type.Symbol({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for TemplateLiteral 1', () => {
    const T = Type.TemplateLiteral('hello${1|2|3}', { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for TemplateLiteral 2', () => {
    const T = Type.TemplateLiteral([Type.Literal('hello'), Type.Union([Type.Literal('1'), Type.Literal('2'), Type.Literal('3')])], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Tuple 1', () => {
    const T = Type.Tuple([], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Tuple 2', () => {
    const T = Type.Tuple([Type.String(), Type.Number()], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Uint8Array', () => {
    const T = Type.Uint8Array({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Uncapitalize', () => {
    const T = Type.Uncapitalize(Type.Literal('hello'), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Undefined', () => {
    const T = Type.Undefined({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Union 1', () => {
    const T = Type.Union([], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Union 1', () => {
    const T = Type.Union([Type.String()], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Union 1', () => {
    const T = Type.Union([Type.String(), Type.Boolean()], { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Unknown', () => {
    const T = Type.Unknown({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Uppercase', () => {
    const T = Type.Uppercase(Type.Literal('hello'), { foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
  it('Should assign options for Void', () => {
    const T = Type.Void({ foo: 'bar' })
    Assert.IsEqual(T.foo, 'bar')
  })
})
