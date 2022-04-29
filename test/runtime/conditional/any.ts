import { Structural, StructuralResult } from '@sinclair/typebox/conditional'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('conditional/structural/Any', () => {
  it('Should extend Any', () => {
    type T = any extends any ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Any())
    Assert.deepEqual(R, StructuralResult.True)
  })
  it('Should extend Unknown', () => {
    type T = any extends unknown ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Unknown())
    Assert.deepEqual(R, StructuralResult.True)
  })

  it('Should extend String', () => {
    type T = any extends string ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.String())
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Boolean', () => {
    type T = any extends boolean ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Boolean())
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Number', () => {
    type T = any extends number ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Number())
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Integer', () => {
    type T = any extends number ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Integer())
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Array 1', () => {
    type T = any extends Array<any> ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Array(Type.Any()))
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Array 2', () => {
    type T = any extends Array<string> ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Array(Type.String()))
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Tuple', () => {
    type T = any extends [number, number] ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Tuple([Type.Number(), Type.Number()]))
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Object 1', () => {
    type T = any extends object ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Object({}))
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Object 2', () => {
    type T = any extends {} ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Object({}))
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Object 3', () => {
    type T = any extends { a: number } ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Object({ a: Type.Number() }))
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Union 1', () => {
    type T = any extends number | string ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Union([Type.Number(), Type.String()]))
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Union 2', () => {
    type T = any extends any | number ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Union([Type.Any(), Type.String()]))
    Assert.deepEqual(R, StructuralResult.True)
  })
  it('Should extend Null', () => {
    type T = any extends null ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Null())
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Undefined', () => {
    type T = any extends undefined ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Undefined())
    Assert.deepEqual(R, StructuralResult.Union)
  })
  it('Should extend Void', () => {
    type T = any extends void ? 1 : 2
    const R = Structural.Check(Type.Any(), Type.Void())
    Assert.deepEqual(R, StructuralResult.Union)
  })
})
