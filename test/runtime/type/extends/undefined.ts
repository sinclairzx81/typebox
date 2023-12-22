import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Undefined', () => {
  it('Should extend Any', () => {
    type T = undefined extends any ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = undefined extends string ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = undefined extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = undefined extends number ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = undefined extends number ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array', () => {
    type T = undefined extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = undefined extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = undefined extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Object({}, { additionalProperties: false }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 2', () => {
    type T = undefined extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 3', () => {
    type T = undefined extends object ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = undefined extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = undefined extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = undefined extends boolean | number ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Null', () => {
    type T = undefined extends null ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = undefined extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Void', () => {
    type T = undefined extends void ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Void())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Date', () => {
    type T = undefined extends Date ? 1 : 2
    const R = ExtendsCheck(Type.Undefined(), Type.Date())
    Assert.IsEqual(R, ExtendsResult.False)
  })
})
