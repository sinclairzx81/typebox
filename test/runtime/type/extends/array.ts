import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Array', () => {
  // ----------------------------------------------
  // Generic Varying
  // ----------------------------------------------
  it('Should extend Array Varying 1', () => {
    type T = Array<any> extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Array Varying 2', () => {
    type T = Array<string> extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Array Varying 3', () => {
    type T = Array<any> extends Array<string> ? 1 : 2 // 1
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Array(Type.String()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Array Varying 4', () => {
    type T = Array<number> extends Array<string> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Number()), Type.Array(Type.String()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  // ----------------------------------------------
  // Any
  // ----------------------------------------------
  it('Should extend Any', () => {
    type T = Array<any> extends any ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Unknown', () => {
    type T = Array<any> extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = Array<any> extends string ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = Array<any> extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = Array<any> extends number ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = Array<any> extends number ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array 1', () => {
    type T = Array<any> extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Array 2', () => {
    type T = Array<string> extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Array 3', () => {
    type T = Array<any> extends Array<string> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Tuple', () => {
    type T = Array<any> extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = Array<any> extends object ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = Array<any> extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 3', () => {
    type T = Array<any> extends { a: number } ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Object({ a: Type.Number() }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 4', () => {
    type T = Array<any> extends { length: '1' } ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Object({ length: Type.Literal('1') }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 5', () => {
    type T = Array<any> extends { length: number } ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Object({ length: Type.Number() }))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 1', () => {
    type T = Array<any> extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Union([Type.Number(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = Array<any> extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 3', () => {
    type T = Array<any> extends any | Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Union([Type.Any(), Type.Array(Type.Any())]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 4', () => {
    type T = Array<string> extends any | Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Union([Type.Any(), Type.Array(Type.Any())]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 5', () => {
    type T = Array<any> extends any | Array<string> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Union([Type.Any(), Type.Array(Type.String())]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Null', () => {
    type T = Array<any> extends null ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = Array<any> extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.Any()), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  // ----------------------------------------------
  // Constrained
  // ----------------------------------------------
  it('Should extend constrained Any', () => {
    type T = Array<string> extends any ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Unknown', () => {
    type T = Array<string> extends unknown ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Unknown())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained String', () => {
    type T = Array<string> extends string ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Boolean', () => {
    type T = Array<string> extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Number', () => {
    type T = Array<string> extends number ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Integer', () => {
    type T = Array<string> extends number ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Array 1', () => {
    type T = Array<string> extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Array 2', () => {
    type T = Array<string> extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Array 3', () => {
    type T = Array<string> extends Array<string> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Tuple', () => {
    type T = Array<string> extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Object 1', () => {
    type T = Array<string> extends object ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Object 2', () => {
    type T = Array<string> extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Object 3', () => {
    type T = Array<string> extends { a: number } ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Object({ a: Type.Number() }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Object 4', () => {
    type T = Array<string> extends { length: '1' } ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Object({ length: Type.Literal('1') }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Object 5', () => {
    type T = Array<string> extends { length: number } ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Object({ length: Type.Number() }))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Union 1', () => {
    type T = Array<string> extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Union([Type.Null(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Union 2', () => {
    type T = Array<string> extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Union([Type.Any(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Union 3', () => {
    type T = Array<string> extends any | Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Union([Type.Any(), Type.Array(Type.Any())]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Union 4', () => {
    type T = Array<string> extends any | Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Union([Type.Any(), Type.Array(Type.Any())]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Union 5', () => {
    type T = Array<string> extends any | Array<string> ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Union([Type.Any(), Type.Array(Type.String())]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend constrained Null', () => {
    type T = Array<string> extends null ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Undefined', () => {
    type T = Array<string> extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend constrained Void', () => {
    type T = Array<string> extends void ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Void())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = Array<string> extends Date ? 1 : 2
    const R = ExtendsCheck(Type.Array(Type.String()), Type.Date())
    Assert.IsEqual(R, ExtendsResult.False)
  })
})
