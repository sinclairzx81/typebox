import { Structural, StructuralResult } from '@sinclair/typebox/conditional'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('conditional/structural/String', () => {
  it('Should extend Any', () => {
    type T = string extends any ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Any())
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Unknown', () => {
    type T = string extends unknown ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Unknown())
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend String', () => {
    type T = string extends string ? 1 : 2
    const R = Structural.Check(Type.String(), Type.String())
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Boolean', () => {
    type T = string extends boolean ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Boolean())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Number', () => {
    type T = string extends number ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Number())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Integer', () => {
    type T = string extends number ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Integer())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Array', () => {
    type T = string extends Array<any> ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Array(Type.Any()))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Tuple', () => {
    type T = string extends [number, number] ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Record 1', () => {
    type T = string extends Record<number, any> ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Record 2', () => {
    type T = string extends Record<number, unknown> ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Record(Type.Number(), Type.Unknown()))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Record 3', () => {
    type T = string extends Record<number, string> ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Record(Type.Number(), Type.String()))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Record 4', () => {
    type T = string extends Record<number, number> ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Record(Type.Number(), Type.Number()))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Record 5', () => {
    type T = string extends Record<any, number | string> ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Record(Type.Number(), Type.Union([Type.Number(), Type.String()])))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Record 6', () => {
    type T = string extends Record<any, {}> ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Object({}))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Object 1', () => {
    type T = string extends {} ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Object({}, { additionalProperties: false }))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Object 2', () => {
    type T = string extends { a: 10 } ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Object 3', () => {
    type T = string extends object ? 1 : 2
    const R = Structural.Check(Type.String(), Type.Object({}))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Union 1', () => {
    type T = number extends number | string ? 1 : 2
    const R = Structural.Check(Type.Number(), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Union 2', () => {
    type T = number extends any | number ? 1 : 2
    const R = Structural.Check(Type.Number(), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Union 3', () => {
    type T = number extends boolean | number ? 1 : 2
    const R = Structural.Check(Type.Number(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Null', () => {
    type T = number extends null ? 1 : 2
    const R = Structural.Check(Type.Number(), Type.Null())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Undefined', () => {
    type T = number extends undefined ? 1 : 2
    const R = Structural.Check(Type.Number(), Type.Undefined())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Void', () => {
    type T = number extends void ? 1 : 2
    const R = Structural.Check(Type.Number(), Type.Void())
    Assert.deepEqual(R, StructuralResult.False)
  })
})
