import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Union', () => {
  it('Should extend Any', () => {
    type T = number | string extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Any())
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = number | string extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.String())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = number | string extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Boolean())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = number | string extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Number())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = number | string extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Integer())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Array', () => {
    type T = number | string extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Array(Type.Any()))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = number | string extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = number | string extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Object({}, { additionalProperties: false }))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = number | string extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = number | string extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Union([Type.Number(), Type.String()]))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = number | string extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Union([Type.Any(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Union 3', () => {
    type T = number | string extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Union 4', () => {
    type T = any | boolean extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Any(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.Union)
  })
  it('Should extend Union 5', () => {
    type T = any | string extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Any(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.Union)
  })
  it('Should extend Union 6', () => {
    type T = any | {} extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Any(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.Union)
  })
  it('Should extend Union 7', () => {
    type T = any extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Any(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.Union)
  })
  it('Should extend Union 8', () => {
    type T = unknown | string extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Unknown(), Type.String()]), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Union 9', () => {
    type T = unknown extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Unknown(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Null', () => {
    type T = number | string extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Null())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = number | string extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Undefined())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = number | string extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Void())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Void 2', () => {
    type T = number | string | void extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Void())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = number | string | void extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Number(), Type.String()]), Type.Date())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Date 2', () => {
    type T = Date | number | string | void extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Date(), Type.Number(), Type.String()]), Type.Date())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend BigInt', () => {
    type T = bigint | number | string | void extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.BigInt(), Type.Number(), Type.String()]), Type.Date())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Symbol', () => {
    type T = symbol | number | string | void extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Union([Type.Symbol(), Type.Number(), Type.String()]), Type.Date())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
})
