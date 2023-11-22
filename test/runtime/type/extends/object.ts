import { Type, ExtendsCheck, ExtendsResult } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/extends/Object', () => {
  // ----------------------------------------------------------
  // Object
  // ----------------------------------------------------------
  it('Should extend Object 1', () => {
    type T = { x: number; y: number } extends { x: number } ? 1 : 2
    const A = Type.Object({ x: Type.Number(), y: Type.Number() })
    const B = Type.Object({ x: Type.Number() })
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = { x: number } extends { x: number; y: number } ? 1 : 2
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ x: Type.Number(), y: Type.Number() })
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 3', () => {
    type T = { x: number; y: string } extends { x: number } ? 1 : 2
    const A = Type.Object({ x: Type.Number(), y: Type.String() })
    const B = Type.Object({ x: Type.Number() })
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 4', () => {
    type T = { x: number } extends { x: number; y: string } ? 1 : 2
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ x: Type.Number(), y: Type.String() })
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 5', () => {
    type T = { x: number | string } extends { x: number } ? 1 : 2
    const A = Type.Object({ x: Type.Union([Type.Number(), Type.String()]) })
    const B = Type.Object({ x: Type.Number() })
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 6', () => {
    type T = { x: number } extends { x: number | string } ? 1 : 2
    const A = Type.Object({ x: Type.Number() })
    const B = Type.Object({ x: Type.Union([Type.Number(), Type.String()]) })
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.True)
  })
  // ----------------------------------------------------------
  // Record
  // ----------------------------------------------------------
  it('Should extend Record 2', () => {
    type T = { a: number; b: number } extends Record<string, number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.String(), Type.Number())
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 3', () => {
    type T = { a: number; b: number } extends Record<number, number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Number(), Type.Number())
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 4', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 5', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.String(), Type.Number())
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Record 6', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Number(), Type.Number())
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.True)
  })
  // ----------------------------------------------------------
  // Standard
  // ----------------------------------------------------------
  it('Should extend Any', () => {
    type T = { a: number } extends any ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Any())
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend String', () => {
    type T = { a: number } extends string ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.String())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Boolean', () => {
    type T = { a: number } extends boolean ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Boolean())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Number', () => {
    type T = { a: number } extends number ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Number())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Integer', () => {
    type T = { a: number } extends number ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Integer())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Array', () => {
    type T = { a: number } extends Array<any> ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Array(Type.Any()))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Tuple', () => {
    type T = { a: number } extends [number, number] ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 1', () => {
    type T = { a: number } extends {} ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Object({}, { additionalProperties: false }))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Object 2', () => {
    type T = { a: number } extends { a: 10 } ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Object({ a: Type.Literal(10) }))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Object 3', () => {
    type T = { a: number } extends object ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Object({}))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 1', () => {
    type T = { a: number } extends number | string ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Union([Type.Null(), Type.String()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Union 2', () => {
    type T = { a: number } extends any | number ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Union([Type.Any(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.True)
  })
  it('Should extend Union 2', () => {
    type T = { a: number } extends boolean | number ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Null', () => {
    type T = { a: number } extends null ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Null())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Undefined', () => {
    type T = { a: number } extends undefined ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Undefined())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Void', () => {
    type T = { a: number } extends void ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Void())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend Date', () => {
    type T = { a: number } extends Date ? 1 : 2
    const R = ExtendsCheck(Type.Object({ a: Type.Number() }), Type.Date())
    Assert.IsEqual(R, ExtendsResult.False)
  })
  // ----------------------------------------------------------------
  // Optional
  // ----------------------------------------------------------------
  it('Should extend optional 1', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.Optional(Type.Number()) })
    const C = ExtendsCheck(A, B)
    Assert.IsEqual(C, ExtendsResult.True)
  })
  it('Should extend optional 2', () => {
    const A = Type.Object({ a: Type.Number() })
    const B = Type.Object({ a: Type.Optional(Type.Number()) })
    const C = ExtendsCheck(B, A)
    Assert.IsEqual(C, ExtendsResult.False)
  })
  it('Should extend optional 3', () => {
    const A = Type.Object({
      x: Type.Optional(Type.Number()),
      y: Type.Number(),
    })
    const B = Type.Object({
      y: Type.Number(),
      z: Type.Number(),
    })
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend optional 4', () => {
    const A = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })
    const B = Type.Object({
      y: Type.Number(),
      z: Type.Number(),
    })
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.False)
  })
  it('Should extend optional 5', () => {
    const A = Type.Object({
      x: Type.Number(),
      y: Type.Number(),
    })
    const B = Type.Object({
      y: Type.Number(),
      z: Type.Optional(Type.Number()),
    })
    const R = ExtendsCheck(A, B)
    Assert.IsEqual(R, ExtendsResult.True)
  })
})
