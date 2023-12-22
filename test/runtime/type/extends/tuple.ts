import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Tuple', () => {
  it('Should extend Any', () => {
    type T = [string, number] extends any ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = [string, number] extends string ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = [string, number] extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = [string, number] extends number ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = [string, number] extends number ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array 1', () => {
    type T = [string, number] extends Array<any> ? 1 : 2 // 1
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Array 2', () => {
    type T = [string, number] extends Array<string> ? 1 : 2 // 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Array(Type.String()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array 3', () => {
    type T = [string, number] extends Array<string | number> ? 1 : 2 // 1
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Array(Type.Union([Type.String(), Type.Number()])))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Array 4', () => {
    type T = [string, number] extends Array<string | number | boolean> ? 1 : 2 // 1
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Array(Type.Union([Type.String(), Type.Number(), Type.Boolean()])))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Tuple 1', () => {
    type T = [string, number] extends [string, number] ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Tuple([Type.String(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Tuple 2', () => {
    type T = [string, number] extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple 3', () => {
    type T = [string, any] extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Any()]), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple 4', () => {
    type T = [string, number] extends [string, any] ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Tuple([Type.String(), Type.Any()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Tuple 5', () => {
    type T = [string, unknown] extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Unknown()]), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple 6', () => {
    type T = [string, number] extends [string, unknown] ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Tuple([Type.String(), Type.Unknown()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Tuple 7', () => {
    type T = [] extends [string, number] ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([]), Type.Tuple([Type.String(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple 8', () => {
    type T = [string, number] extends [] ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Tuple([]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Record 1', () => {
    type T = [string, number] extends Record<number, any> ? 1 : 2
    const R = ExtendsCheck(Type.String(), Type.Record(Type.Number(), Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 2', () => {
    type T = [string, number] extends Record<number, unknown> ? 1 : 2
    const R = ExtendsCheck(Type.String(), Type.Record(Type.Number(), Type.Unknown()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 3', () => {
    type T = [string, number] extends Record<number, string> ? 1 : 2
    const R = ExtendsCheck(Type.String(), Type.Record(Type.Number(), Type.String()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 4', () => {
    type T = [string, number] extends Record<number, number> ? 1 : 2
    const R = ExtendsCheck(Type.String(), Type.Record(Type.Number(), Type.Number()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = [string, number] extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Object({}, { additionalProperties: false }))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = [string, number] extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 3', () => {
    type T = [string, number] extends object ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 1', () => {
    type T = [string, number] extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = [string, number] extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = [string, number] extends boolean | number ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Null', () => {
    type T = [string, number] extends null ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = [string, number] extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = [string, number] extends void ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Void())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = [string, number] extends Date ? 1 : 2
    const R = ExtendsCheck(Type.Tuple([Type.String(), Type.Number()]), Type.Date())
    Assert.IsEqual(R, ExtendsResult.False)
  })
})
