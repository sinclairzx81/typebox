import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Record', () => {
  it('Should extend Record 1', () => {
    type T = Record<'a' | 'b', number> extends { a: number; b: number } ? 1 : 2
    const A = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const B = Type.Object({ a: Type.Number(), b: Type.Number() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 2', () => {
    type T = Record<string, number> extends { a: number; b: number } ? 1 : 2
    const A = Type.Record(Type.String(), Type.Number())
    const B = Type.Object({ a: Type.Number(), b: Type.Number() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record 3', () => {
    type T = Record<number, number> extends { a: number; b: number } ? 1 : 2
    const A = Type.Record(Type.Number(), Type.Number())
    const B = Type.Object({ a: Type.Number(), b: Type.Number() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record 4', () => {
    type T = Record<'a' | 'b', number> extends { a: number; b: number } ? 1 : 2
    const A = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const B = Type.Object({ a: Type.Number(), b: Type.Number() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 5', () => {
    type T = Record<'a' | 'b', number> extends { a: number; b: number } ? 1 : 2
    const A = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const B = Type.Object({ a: Type.Number(), b: Type.Number() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 6', () => {
    type T = Record<string, number> extends Record<'a' | 'b', number> ? true : false
    const A = Type.Record(Type.String(), Type.Number())
    const B = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 7', () => {
    type T = Record<string, number> extends Record<string, number> ? 1 : 2
    const A = Type.Record(Type.String(), Type.Number())
    const B = Type.Record(Type.String(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 8', () => {
    type T = Record<string, number> extends Record<number, number> ? 1 : 2
    const A = Type.Record(Type.String(), Type.Number())
    const B = Type.Record(Type.Number(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 9', () => {
    type T = Record<number, number> extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Record(Type.Number(), Type.Number())
    const B = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record 10', () => {
    type T = Record<number, number> extends Record<string, number> ? 1 : 2
    const A = Type.Record(Type.Number(), Type.Number())
    const B = Type.Record(Type.String(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 11', () => {
    type T = Record<number, number> extends Record<number, number> ? 1 : 2
    const A = Type.Record(Type.Number(), Type.Number())
    const B = Type.Record(Type.Number(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  // -----

  it('Should extend Record 12', () => {
    type T = Record<string, number> extends Record<number, number> ? 1 : 2
    const A = Type.Record(Type.String(), Type.Number())
    const B = Type.Record(Type.Integer(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 13', () => {
    type T = Record<number, number> extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Record(Type.Integer(), Type.Number())
    const B = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Record 14', () => {
    type T = Record<number, number> extends Record<string, number> ? 1 : 2
    const A = Type.Record(Type.Integer(), Type.Number())
    const B = Type.Record(Type.String(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Record 15', () => {
    type T = Record<number, number> extends Record<number, number> ? 1 : 2
    const A = Type.Record(Type.Integer(), Type.Number())
    const B = Type.Record(Type.Integer(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  // -------------------------------------------------------------------
  // Standard
  // -------------------------------------------------------------------

  it('Should extend Any', () => {
    type T = Record<number, number> extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Unknown', () => {
    type T = Record<number, number> extends unknown ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Unknown())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend String', () => {
    type T = Record<number, number> extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Boolean', () => {
    type T = Record<number, number> extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Number', () => {
    type T = Record<number, number> extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Integer', () => {
    type T = Record<number, number> extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 1', () => {
    type T = Record<number, number> extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Array 2', () => {
    type T = Record<number, number> extends Array<string> ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Array(Type.String()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Tuple', () => {
    type T = Record<number, number> extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Object 2', () => {
    type T = Record<number, number> extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Object 3', () => {
    type T = Record<number, number> extends { a: number } ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Object({ a: Type.Number() }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 1', () => {
    type T = Record<number, number> extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Union 2', () => {
    type T = Record<number, number> extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Union([Type.Any(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })

  it('Should extend Null', () => {
    type T = Record<number, number> extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Undefined', () => {
    type T = Record<number, number> extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Void', () => {
    type T = Record<number, number> extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })

  it('Should extend Date', () => {
    type T = Record<number, number> extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Record(Type.Number(), Type.Number()), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
})
