import { TypeExtends, TypeExtendsResult } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Object', () => {
  // ----------------------------------------------------------
  // Object
  // ----------------------------------------------------------
  it('Should extend Object 1', () => {
    type T = { x: number; y: number } extends { x: number } ? 1 : 2
    const A = Type.Object({ x: Type.Number(), y: Type.Number() })
    const B = Type.Object({ x: Type.Number() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = { x: number } extends { x: number; y: number } ? 1 : 2
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ x: Type.Number(), y: Type.Number() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 3', () => {
    type T = { x: number; y: string } extends { x: number } ? 1 : 2
    const A = Type.Object({ x: Type.Number(), y: Type.String() })
    const B = Type.Object({ x: Type.Number() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Object 4', () => {
    type T = { x: number } extends { x: number; y: string } ? 1 : 2
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ x: Type.Number(), y: Type.String() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 5', () => {
    type T = { x: number | string } extends { x: number } ? 1 : 2
    const A = Type.Object({ x: Type.Union([Type.Number(), Type.String()]) })
    const B = Type.Object({ x: Type.Number() })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 6', () => {
    type T = { x: number } extends { x: number | string } ? 1 : 2
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ x: Type.Union([Type.Number(), Type.String()]) })
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  // ----------------------------------------------------------
  // Record
  // ----------------------------------------------------------
  it('Should extend Record 2', () => {
    type T = { a: number; b: number } extends Record<string, number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.String(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Record 3', () => {
    type T = { a: number; b: number } extends Record<number, number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Number(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Record 4', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Record 5', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.String(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Record 6', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Number(), Type.Number())
    const R = TypeExtends.Extends(A, B)
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  // ----------------------------------------------------------
  // Standard
  // ----------------------------------------------------------
  it('Should extend Any', () => {
    type T = { a: number } extends any ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Any())
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = { a: number } extends string ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.String())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = { a: number } extends boolean ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Boolean())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = { a: number } extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Number())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = { a: number } extends number ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Integer())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Array', () => {
    type T = { a: number } extends Array<any> ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Array(Type.Any()))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = { a: number } extends [number, number] ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = { a: number } extends {} ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Object({}, { additionalProperties: false }))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = { a: number } extends { a: 10 } ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Object({ a: Type.Literal(10) }))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Object 3', () => {
    type T = { a: number } extends object ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Object({}))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Union 1', () => {
    type T = { a: number } extends number | string ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Union([Type.Null(), Type.String()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = { a: number } extends any | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = { a: number } extends boolean | number ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Null', () => {
    type T = { a: number } extends null ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Null())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = { a: number } extends undefined ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Undefined())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = { a: number } extends void ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Void())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = { a: number } extends Date ? 1 : 2
    const R = TypeExtends.Extends(Type.Object({ a: Type.Number() }), Type.Date())
    Assert.deepEqual(R, TypeExtendsResult.False)
  })
})
