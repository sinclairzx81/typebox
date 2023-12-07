import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Boolean', () => {
  it('Should extend Any', () => {
    type T = boolean extends any ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = boolean extends string ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = boolean extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Number', () => {
    type T = boolean extends number ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = boolean extends number ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array', () => {
    type T = boolean extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = boolean extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Record', () => {
    type T = boolean extends Record<number, any> ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Record(Type.Number(), Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = boolean extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Object({}, { additionalProperties: false }))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = boolean extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = boolean extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = boolean extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = boolean extends boolean | number ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Null', () => {
    type T = boolean extends null ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = boolean extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = boolean extends void ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Void())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = boolean extends Date ? 1 : 2
    const R = ExtendsCheck(Type.Boolean(), Type.Date())
    Assert.IsEqual(R, ExtendsResult.False)
  })
})
