import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Void', () => {
  it('Should extend Any', () => {
    type T = void extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Unknown', () => {
    type T = void extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String', () => {
    type T = void extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Boolean', () => {
    type T = void extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Number', () => {
    type T = void extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Integer', () => {
    type T = void extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 1', () => {
    type T = void extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 2', () => {
    type T = void extends Array<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Array(Type.String()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Tuple', () => {
    type T = void extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 1', () => {
    type T = void extends object ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 2', () => {
    type T = void extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 3', () => {
    type T = void extends { a: number } ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Object({ a: Type.Number() }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 1', () => {
    type T = void extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 2', () => {
    type T = void extends any | number ? 1 : 2 // 1
    const R = TypeExtends.Extends(Type.Void(), Type.Union([Type.Any(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 3', () => {
    type T = void extends unknown | number ? 1 : 2 // 1
    const R = TypeExtends.Extends(Type.Void(), Type.Union([Type.Unknown(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Union 4', () => {
    type T = void extends unknown | any ? 1 : 2 // 1
    const R = TypeExtends.Extends(Type.Void(), Type.Union([Type.Unknown(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Null', () => {
    type T = void extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Undefined', () => {
    type T = void extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Void', () => {
    type T = void extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Date', () => {
    type T = void extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Void(), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
})
