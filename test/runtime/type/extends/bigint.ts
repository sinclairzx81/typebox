import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/BigInt', () => {
  it('Should extend Any', () => {
    type T = bigint extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Unknown', () => {
    type T = bigint extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = bigint extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = bigint extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = bigint extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = bigint extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Array', () => {
    type T = bigint extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = bigint extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Record', () => {
    type T = bigint extends Record<number, any> ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = bigint extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = bigint extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Object({ a: Type.Literal(10) }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = bigint extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = bigint extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Union 3', () => {
    type T = bigint extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Union 4', () => {
    type T = bigint extends boolean | bigint ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Union([Type.Boolean(), Type.BigInt()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Null', () => {
    type T = bigint extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = bigint extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = bigint extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = bigint extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.BigInt(), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
})
