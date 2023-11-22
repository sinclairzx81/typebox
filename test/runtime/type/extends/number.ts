import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Number', () => {
  it('Should extend Any', () => {
    type T = number extends any ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Unknown', () => {
    type T = number extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = number extends string ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = number extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = number extends number ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Number())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Integer', () => {
    type T = number extends number ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Array', () => {
    type T = number extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = number extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Record', () => {
    type T = number extends Record<number, any> ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Record(Type.Number(), Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = number extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Object({}, { additionalProperties: false }))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = number extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = number extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = number extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = number extends boolean | number ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Null', () => {
    type T = number extends null ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = number extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = number extends void ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Void())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = number extends Date ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Date())
    Assert.IsEqual(R, ExtendsResult.False)
  })
})
