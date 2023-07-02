import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// ---------------------------------------------------------------------------
// Note: Not is equivalent to Unknown with the exception of nested negation.
// ---------------------------------------------------------------------------
describe('type/extends/Not', () => {
  // -------------------------------------------------------------------------
  // Issue: type T = number extends not number ? true : false // true
  //        type T = number extends unknown ? true : false    // true
  //
  // TypeScript does not support type negation. The best TypeBox can do is
  // treat "not" as "unknown". From this standpoint, the extends assignability
  // check needs to return true for the following case to keep TypeBox aligned
  // with TypeScript static inference.
  // -------------------------------------------------------------------------
  it('Should extend with nested negation', () => {
    const A = Type.Number()
    const B = Type.Not(Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.isEqual(R, TypeExtendsResult.True) // we would expect false
  })
  // ---------------------------------------------------------------------------
  // Nested
  // ---------------------------------------------------------------------------
  it('Should extend with nested negation', () => {
    const T1 = Type.String()
    const T2 = Type.Not(T1)
    const T3 = Type.Not(T2)
    const T4 = Type.Not(T3)
    const T5 = Type.Not(T4)

    const R1 = TypeExtends.Extends(T1, Type.String())
    const R2 = TypeExtends.Extends(T2, Type.String())
    const R3 = TypeExtends.Extends(T3, Type.String())
    const R4 = TypeExtends.Extends(T4, Type.String())
    const R5 = TypeExtends.Extends(T5, Type.String())

    Assert.isEqual(R1, TypeExtendsResult.True)
    Assert.isEqual(R2, TypeExtendsResult.False)
    Assert.isEqual(R3, TypeExtendsResult.True)
    Assert.isEqual(R4, TypeExtendsResult.False)
    Assert.isEqual(R5, TypeExtendsResult.True)
  })

  // ---------------------------------------------------------------------------
  // Not as Unknown Tests
  // ---------------------------------------------------------------------------
  it('Should extend Any', () => {
    type T = unknown extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Any())
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Unknown', () => {
    type T = unknown extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Unknown())
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = unknown extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.String())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = unknown extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Boolean())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = unknown extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Number())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = unknown extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Integer())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Array 1', () => {
    type T = unknown extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Array(Type.Any()))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Array 2', () => {
    type T = unknown extends Array<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Array(Type.String()))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = unknown extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = unknown extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Object({}))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 2', () => {
    type T = unknown extends { a: number } ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Object({ a: Type.Number() }))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Union 1', () => {
    type T = unknown extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Union([Type.Number(), Type.String()]))
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = unknown extends any | number ? 1 : 2 // 1
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Union([Type.Any(), Type.String()]))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Union 3', () => {
    type T = unknown extends unknown | number ? 1 : 2 // 1
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Union([Type.Unknown(), Type.String()]))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Union 4', () => {
    type T = unknown extends unknown | any ? 1 : 2 // 1
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Union([Type.Unknown(), Type.String()]))
    Assert.isEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Null', () => {
    type T = unknown extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Null())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = unknown extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Undefined())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = unknown extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Void())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = unknown extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Not(Type.Number()), Type.Date())
    Assert.isEqual(R, TypeExtendsResult.False)
  })
})
