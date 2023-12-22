import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Symbol', () => {
  it('Should extend Any', () => {
    type T = symbol extends any ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Unknown', () => {
    type T = symbol extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = symbol extends string ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = symbol extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = symbol extends number ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = symbol extends number ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array', () => {
    type T = symbol extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = symbol extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Record', () => {
    type T = symbol extends Record<number, any> ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Record(Type.Number(), Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = symbol extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = symbol extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Object({ a: Type.Literal(10) }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = symbol extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = symbol extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 3', () => {
    type T = symbol extends boolean | number ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 4', () => {
    type T = symbol extends boolean | symbol ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Union([Type.Boolean(), Type.Symbol()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Null', () => {
    type T = symbol extends null ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = symbol extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = symbol extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Void())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = symbol extends Date ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Date())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Symbol', () => {
    type T = symbol extends symbol ? 1 : 2
    const R = ExtendsCheck(Type.Symbol(), Type.Symbol())
    Assert.IsEqual(R, ExtendsResult.True)
  })
})
