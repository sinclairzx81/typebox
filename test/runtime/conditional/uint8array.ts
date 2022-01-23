import { Structural, StructuralResult } from '@sinclair/typebox/conditional'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('conditional/structural/Uint8Array', () => {
  it('Should extend Any', () => {
    type T = Uint8Array extends any ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Any())
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Unknown', () => {
    type T = Uint8Array extends unknown ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Unknown())
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend String', () => {
    type T = Uint8Array extends string ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.String())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Boolean', () => {
    type T = Uint8Array extends boolean ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Boolean())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Number', () => {
    type T = Uint8Array extends number ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Number())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Integer', () => {
    type T = Uint8Array extends number ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Integer())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Array', () => {
    type T = Uint8Array extends Array<any> ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Array(Type.Any()))
    Assert.deepEqual(R, StructuralResult.False)
  })
  it('Should extend Tuple', () => {
    type T = Uint8Array extends [number, number] ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Record', () => {
    type T = Uint8Array extends Record<number, any> ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Record(Type.Number(), Type.Any()))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Object 1', () => {
    type T = Uint8Array extends {} ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Object({}, { additionalProperties: false }))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Object 2', () => {
    type T = Uint8Array extends { a: 10 } ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Object({ a: Type.Literal(10) }, { additionalProperties: true }))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Object 3', () => {
    type T = Uint8Array extends object ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Object({}))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Union 1', () => {
    type T = Uint8Array extends number | string ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Union 2', () => {
    type T = Uint8Array extends any | number ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Union([Type.Any(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend Union 3', () => {
    type T = Uint8Array extends boolean | number ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Union([Type.Boolean(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Null', () => {
    type T = Uint8Array extends null ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Null())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Undefined', () => {
    type T = Uint8Array extends undefined ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Undefined())
    Assert.deepEqual(R, StructuralResult.False)
  })

  it('Should extend Void', () => {
    type T = Uint8Array extends void ? 1 : 2
    const R = Structural.Check(Type.Uint8Array(), Type.Void())
    Assert.deepEqual(R, StructuralResult.False)
  })
})
