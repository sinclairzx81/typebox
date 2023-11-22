import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Null', () => {
  it('Should extend Any', () => {
    type T = null extends any ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Unknown', () => {
    type T = null extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = null extends string ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = null extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = null extends number ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = null extends number ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array', () => {
    type T = null extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = null extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Record', () => {
    type T = null extends Record<number, any> ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Record(Type.Number(), Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = null extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Object({}, { additionalProperties: false }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 2', () => {
    type T = null extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 3', () => {
    type T = null extends object ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = null extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = null extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = null extends boolean | number ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Null', () => {
    type T = null extends null ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Null())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Undefined', () => {
    type T = null extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = null extends void ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Void())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = null extends Date ? 1 : 2
    const R = ExtendsCheck(Type.Null(), Type.Date())
    Assert.IsEqual(R, ExtendsResult.False)
  })
})
