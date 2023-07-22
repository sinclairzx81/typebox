import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Array', () => {
  it('Should pass number array', () => {
    const T = Type.Array(Type.Number())
    const value = [1, 2, 3]
    const result = Value.Check(T, value)
    Assert.isEqual(result, true)
  })

  it('Should fail number array', () => {
    const T = Type.Array(Type.Number())
    const value = ['a', 'b', 'c']
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })

  it('Should pass object array', () => {
    const T = Type.Array(Type.Object({ x: Type.Number() }))
    const value = [{ x: 1 }, { x: 1 }, { x: 1 }]
    const result = Value.Check(T, value)
    Assert.isEqual(result, true)
  })

  it('Should fail object array', () => {
    const T = Type.Array(Type.Object({ x: Type.Number() }))
    const value = [{ x: 1 }, { x: 1 }, 1]
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })

  it('Should fail Date', () => {
    const value = new Date()
    const result = Value.Check(Type.Array(Type.Any()), value)
    Assert.isEqual(result, false)
  })

  it('Should validate array with unique primitive items', () => {
    const T = Type.Array(Type.Number(), { uniqueItems: true })
    const result = Value.Check(T, [0, 1, 2])
    Assert.isEqual(result, true)
  })

  it('Should not validate array with non-unique primitive items', () => {
    const T = Type.Array(Type.Number(), { uniqueItems: true })
    const result = Value.Check(T, [0, 0, 2])
    Assert.isEqual(result, false)
  })

  it('Should validate array with unique object items', () => {
    const T = Type.Array(Type.Object({ x: Type.Number(), y: Type.Number() }), { uniqueItems: true })
    const result = Value.Check(T, [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ])
    Assert.isEqual(result, true)
  })

  it('Should not validate array with non-unique object items', () => {
    const T = Type.Array(Type.Object({ x: Type.Number(), y: Type.Number() }), { uniqueItems: true })
    const result = Value.Check(T, [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 3, y: 3 },
    ])
    Assert.isEqual(result, false)
  })
  // ---------------------------------------------------------
  // Contains
  // ---------------------------------------------------------
  it('Should validate for contains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1) })
    Assert.isTrue(Value.Check(T, [1]))
    Assert.isTrue(Value.Check(T, [1, 2]))
    Assert.isFalse(Value.Check(T, []))
    Assert.isFalse(Value.Check(T, [2]))
  })
  it('Should validate for minContains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1), minContains: 3 })
    Assert.isTrue(Value.Check(T, [1, 1, 1, 2]))
    Assert.isTrue(Value.Check(T, [2, 1, 1, 1, 2]))
    Assert.isTrue(Value.Check(T, [1, 1, 1]))
    Assert.isFalse(Value.Check(T, []))
    Assert.isFalse(Value.Check(T, [1, 1]))
    Assert.isFalse(Value.Check(T, [2]))
  })
  it('Should validate for maxContains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1), maxContains: 3 })
    Assert.isTrue(Value.Check(T, [1, 1, 1]))
    Assert.isTrue(Value.Check(T, [1, 1]))
    Assert.isTrue(Value.Check(T, [2, 2, 2, 2, 1, 1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1, 1]))
  })
  it('Should validate for minContains and maxContains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1), minContains: 3, maxContains: 5 })
    Assert.isFalse(Value.Check(T, [1, 1]))
    Assert.isTrue(Value.Check(T, [1, 1, 1]))
    Assert.isTrue(Value.Check(T, [1, 1, 1, 1]))
    Assert.isTrue(Value.Check(T, [1, 1, 1, 1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1, 1, 1, 1]))
  })
  it('Should not validate minContains and maxContains when contains is unspecified', () => {
    const T = Type.Array(Type.Number(), { minContains: 3, maxContains: 5 })
    Assert.isFalse(Value.Check(T, [1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1, 1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1, 1, 1, 1]))
  })
  it('Should produce illogical schema when contains is not sub type of items', () => {
    const T = Type.Array(Type.Number(), { contains: Type.String(), minContains: 3, maxContains: 5 })
    Assert.isFalse(Value.Check(T, [1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1, 1, 1]))
    Assert.isFalse(Value.Check(T, [1, 1, 1, 1, 1, 1]))
  })
})
