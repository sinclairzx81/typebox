import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Date', () => {
  it('Should extend Any', () => {
    type T = Date extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Unknown', () => {
    type T = Date extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String', () => {
    type T = Date extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Boolean', () => {
    type T = Date extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Number', () => {
    type T = Date extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Integer', () => {
    type T = Date extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array', () => {
    type T = Date extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = Date extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record', () => {
    type T = Date extends Record<number, any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 1', () => {
    type T = Date extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 2', () => {
    type T = Date extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 1', () => {
    type T = Date extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 2', () => {
    type T = Date extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 3', () => {
    type T = Date extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Null', () => {
    type T = Date extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Undefined', () => {
    type T = Date extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Void', () => {
    type T = Date extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Date', () => {
    type T = Date extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Date(), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
})
