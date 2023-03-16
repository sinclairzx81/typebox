import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Integer', () => {
  it('Should extend Any', () => {
    type T = number extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Unknown', () => {
    type T = number extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String', () => {
    type T = number extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Boolean', () => {
    type T = number extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Number', () => {
    type T = number extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Integer', () => {
    type T = number extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Array', () => {
    type T = number extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Tuple', () => {
    type T = number extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record', () => {
    type T = number extends Record<number, any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 1', () => {
    type T = number extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 2', () => {
    type T = number extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Object({ a: Type.Literal(10) }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 1', () => {
    type T = number extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 2', () => {
    type T = number extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 2', () => {
    type T = number extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Null', () => {
    type T = number extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Undefined', () => {
    type T = number extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Void', () => {
    type T = number extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Integer(), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Date', () => {
    type T = number extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Number(), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
})
