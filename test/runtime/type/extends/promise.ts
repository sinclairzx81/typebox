import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Promise', () => {
  // ----------------------------------------------
  // Generic Varying
  // ----------------------------------------------

  it('Should extend Promise Varying 1', () => {
    type T = Promise<any> extends Promise<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Promise(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Promise Varying 2', () => {
    type T = Promise<string> extends Promise<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.String()), Type.Promise(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Promise Varying 3', () => {
    type T = Promise<any> extends Promise<string> ? 1 : 2 // 1
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Promise(Type.String()))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Promise Varying 4', () => {
    type T = Promise<number> extends Promise<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Promise(Type.String()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  // ----------------------------------------------
  // Any
  // ----------------------------------------------

  it('Should extend Any', () => {
    type T = Promise<any> extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Unknown', () => {
    type T = Promise<any> extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String', () => {
    type T = Promise<any> extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Boolean', () => {
    type T = Promise<any> extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Number', () => {
    type T = Promise<any> extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Integer', () => {
    type T = Promise<any> extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array', () => {
    type T = Promise<any> extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Tuple', () => {
    type T = Promise<any> extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record', () => {
    type T = Promise<any> extends Record<number, any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 1', () => {
    type T = Promise<any> extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Object({}, { additionalProperties: false }))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 2', () => {
    type T = Promise<any> extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 3', () => {
    type T = Promise<any> extends object ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 1', () => {
    type T = Promise<any> extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 2', () => {
    type T = Promise<any> extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 2', () => {
    type T = Promise<any> extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Null', () => {
    type T = Promise<any> extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Undefined', () => {
    type T = Promise<any> extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  // ----------------------------------------------
  // Constrained
  // ----------------------------------------------

  it('Should extend constrained Any', () => {
    type T = Promise<number> extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend constrained Unknown', () => {
    type T = Promise<number> extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend constrained String', () => {
    type T = Promise<number> extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Boolean', () => {
    type T = Promise<number> extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Number', () => {
    type T = Promise<number> extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Any()), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Integer', () => {
    type T = Promise<number> extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Array', () => {
    type T = Promise<number> extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Tuple', () => {
    type T = Promise<number> extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Object 1', () => {
    type T = Promise<number> extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Object({}, { additionalProperties: false }))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend constrained Object 2', () => {
    type T = Promise<number> extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Object 3', () => {
    type T = Promise<number> extends object ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend constrained Union 1', () => {
    type T = Promise<number> extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Union 2', () => {
    type T = Promise<number> extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend constrained Union 2', () => {
    type T = Promise<number> extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Null', () => {
    type T = Promise<number> extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend constrained Undefined', () => {
    type T = Promise<number> extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Void', () => {
    type T = Promise<number> extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Date', () => {
    type T = Promise<number> extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Promise(Type.Number()), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
})
