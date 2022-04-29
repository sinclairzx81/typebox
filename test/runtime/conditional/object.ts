import { Structural, StructuralResult } from '@sinclair/typebox/conditional'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('conditional/structural/Object', () => {
  // ----------------------------------------------------------
  // Record
  // ----------------------------------------------------------

  it('Should extend Record 1', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const R = Structural.Check(A, B)
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Record 2', () => {
    type T = { a: number; b: number } extends Record<string, number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.String(), Type.Number())
    const R = Structural.Check(A, B)
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Record 3', () => {
    type T = { a: number; b: number } extends Record<number, number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Number(), Type.Number())
    const R = Structural.Check(A, B)
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Record 4', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Union([Type.Literal('a'), Type.Literal('b')]), Type.Number())
    const R = Structural.Check(A, B)
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Record 5', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.String(), Type.Number())
    const R = Structural.Check(A, B)
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Record 6', () => {
    type T = { a: number; b: number } extends Record<'a' | 'b', number> ? 1 : 2
    const A = Type.Object({ a: Type.Number(), b: Type.Number() })
    const B = Type.Record(Type.Number(), Type.Number())
    const R = Structural.Check(A, B)
    Assert.deepEqual(R, StructuralResult.True)
  })

  // ----------------------------------------------------------
  // Standard
  // ----------------------------------------------------------

  it('Should extend Any', () => {
    type T = { a: number } extends any ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Any())
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend String', () => {
    type T = { a: number } extends string ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.String())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Boolean', () => {
    type T = { a: number } extends boolean ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Boolean())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Number', () => {
    type T = { a: number } extends number ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Number())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Integer', () => {
    type T = { a: number } extends number ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Integer())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Array', () => {
    type T = { a: number } extends Array<any> ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Array(Type.Any()))
    Assert.deepEqual(R, StructuralResult.False)
  })
  it('Should extend Tuple', () => {
    type T = { a: number } extends [number, number] ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.False)
  })
  it('Should extend Object 1', () => {
    type T = { a: number } extends {} ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Object({}, { additionalProperties: false }))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Object 2', () => {
    type T = { a: number } extends { a: 10 } ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Object({ a: Type.Literal(10) }))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Object 3', () => {
    type T = { a: number } extends object ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Object({}))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Union 1', () => {
    type T = { a: number } extends number | string ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Union([Type.Null(), Type.String()]))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Union 2', () => {
    type T = { a: number } extends any | number ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Union 2', () => {
    type T = { a: number } extends boolean | number ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Null', () => {
    type T = { a: number } extends null ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Null())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Undefined', () => {
    type T = { a: number } extends undefined ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Undefined())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Void', () => {
    type T = { a: number } extends void ? 1 : 2
    const R = Structural.Check(Type.Object({ a: Type.Number() }), Type.Void())
    Assert.deepEqual(R, StructuralResult.False)
  })
})
