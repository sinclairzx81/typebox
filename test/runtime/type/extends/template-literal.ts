import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/TemplateLiteral', () => {
  // -------------------------------------------------------------------
  // String Literal 'hello'
  // -------------------------------------------------------------------
  it('Should extend Any (hello)', () => {
    type T = 'hello' extends any ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Unknown (hello)', () => {
    type T = 'hello' extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String (hello)', () => {
    type T = 'hello' extends string ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.String())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Boolean (hello)', () => {
    type T = 'hello' extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number (hello)', () => {
    type T = 'hello' extends number ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer (hello)', () => {
    type T = 'hello' extends number ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array (hello)', () => {
    type T = 'hello' extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple (hello)', () => {
    type T = 'hello' extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1 (hello)', () => {
    type T = 'hello' extends {} ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Object({}, { additionalProperties: false }))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2 (hello)', () => {
    type T = 'hello' extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 1 (hello)', () => {
    type T = 'hello' extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2 (hello)', () => {
    type T = 'hello' extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 3 (hello)', () => {
    type T = 'hello' extends boolean | number ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Null (hello)', () => {
    type T = 'hello' extends null ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined (hello)', () => {
    type T = 'hello' extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Literal('hello')]), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  // -------------------------------------------------------------------
  // String Literal 'hello' | 'world'
  // -------------------------------------------------------------------
  it('Should extend Any (hello | world)', () => {
    type T = 'hello' | 'world' extends any ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Unknown (hello | world)', () => {
    type T = 'hello' | 'world' extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String (hello | world)', () => {
    type T = 'hello' | 'world' extends string ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.String())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Boolean (hello | world)', () => {
    type T = 'hello' | 'world' extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number (hello | world)', () => {
    type T = 'hello' | 'world' extends number ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer (hello | world)', () => {
    type T = 'hello' | 'world' extends number ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array (hello | world)', () => {
    type T = 'hello' | 'world' extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple (hello | world)', () => {
    type T = 'hello' | 'world' extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1 (hello | world)', () => {
    type T = 'hello' | 'world' extends {} ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Object({}, { additionalProperties: false }))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2 (hello | world)', () => {
    type T = 'hello' | 'world' extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 1 (hello | world)', () => {
    type T = 'hello' | 'world' extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2 (hello | world)', () => {
    type T = 'hello' | 'world' extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 3 (hello | world)', () => {
    type T = 'hello' | 'world' extends boolean | number ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Null (hello | world)', () => {
    type T = 'hello' | 'world' extends null ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined (hello | world)', () => {
    type T = 'hello' | 'world' extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.TemplateLiteral([Type.Union([Type.Literal('hello'), Type.Literal('world')])]), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
})
