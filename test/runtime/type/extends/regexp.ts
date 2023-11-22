import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// ------------------------------------------------------------------
// Note: RegExp infers as type String
// ------------------------------------------------------------------
describe('type/extends/RegExp', () => {
  it('Should extend Any', () => {
    type T = string extends any ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Unknown', () => {
    type T = string extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = string extends string ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.RegExp(/xyz/))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Boolean', () => {
    type T = string extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = string extends number ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = string extends number ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array', () => {
    type T = string extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = string extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Record 1', () => {
    type T = string extends Record<number, any> ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Record(Type.Number(), Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 2', () => {
    type T = string extends Record<number, unknown> ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Record(Type.Number(), Type.Unknown()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 3', () => {
    type T = string extends Record<number, string> ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Record(Type.Number(), Type.RegExp(/xyz/)))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 4', () => {
    type T = string extends Record<number, number> ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Record(Type.Number(), Type.Number()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = string extends {} ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Object({}, { additionalProperties: false }))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = string extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.RegExp(/xyz/), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = number extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Union([Type.Number(), Type.RegExp(/xyz/)]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = number extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Number(), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 3', () => {
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
