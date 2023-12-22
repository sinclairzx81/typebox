import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Unknown', () => {
  it('Should extend Any', () => {
    type T = unknown extends any ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Unknown', () => {
    type T = unknown extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = unknown extends string ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = unknown extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = unknown extends number ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = unknown extends number ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array 1', () => {
    type T = unknown extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array 2', () => {
    type T = unknown extends Array<string> ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Array(Type.String()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = unknown extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = unknown extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 2', () => {
    type T = unknown extends { a: number } ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Object({ a: Type.Number() }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = unknown extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = unknown extends any | number ? 1 : 2 // 1
    const R = ExtendsCheck(Type.Unknown(), Type.Union([Type.Any(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 3', () => {
    type T = unknown extends unknown | number ? 1 : 2 // 1
    const R = ExtendsCheck(Type.Unknown(), Type.Union([Type.Unknown(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 4', () => {
    type T = unknown extends unknown | any ? 1 : 2 // 1
    const R = ExtendsCheck(Type.Unknown(), Type.Union([Type.Unknown(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Null', () => {
    type T = unknown extends null ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = unknown extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = unknown extends void ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Void())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = unknown extends Date ? 1 : 2
    const R = ExtendsCheck(Type.Unknown(), Type.Date())
    Assert.IsEqual(R, ExtendsResult.False)
  })
})
