import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Array', () => {
  it('Should pass number array', () => {
    const T = Type.Array(Type.Number())
    const value = [1, 2, 3]
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
  it('Should fail number array', () => {
    const T = Type.Array(Type.Number())
    const value = ['a', 'b', 'c']
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should pass object array', () => {
    const T = Type.Array(Type.Object({ x: Type.Number() }))
    const value = [{ x: 1 }, { x: 1 }, { x: 1 }]
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
  it('Should fail object array', () => {
    const T = Type.Array(Type.Object({ x: Type.Number() }))
    const value = [{ x: 1 }, { x: 1 }, 1]
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail Date', () => {
    const value = new Date()
    const result = Value.Check(Type.Array(Type.Any()), value)
    Assert.IsEqual(result, false)
  })
  it('Should validate array with unique primitive items', () => {
    const T = Type.Array(Type.Number(), { uniqueItems: true })
    const result = Value.Check(T, [0, 1, 2])
    Assert.IsEqual(result, true)
  })
  it('Should not validate array with non-unique primitive items', () => {
    const T = Type.Array(Type.Number(), { uniqueItems: true })
    const result = Value.Check(T, [0, 0, 2])
    Assert.IsEqual(result, false)
  })
  it('Should validate array with unique object items', () => {
    const T = Type.Array(Type.Object({ x: Type.Number(), y: Type.Number() }), { uniqueItems: true })
    const result = Value.Check(T, [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ])
    Assert.IsEqual(result, true)
  })
  it('Should not validate array with non-unique object items', () => {
    const T = Type.Array(Type.Object({ x: Type.Number(), y: Type.Number() }), { uniqueItems: true })
    const result = Value.Check(T, [
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 3, y: 3 },
    ])
    Assert.IsEqual(result, false)
  })
  // ---------------------------------------------------------
  // Contains
  // ---------------------------------------------------------
  it('Should validate for contains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1) })
    Assert.IsTrue(Value.Check(T, [1]))
    Assert.IsTrue(Value.Check(T, [1, 2]))
    Assert.IsFalse(Value.Check(T, []))
    Assert.IsFalse(Value.Check(T, [2]))
  })
  it('Should validate for minContains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1), minContains: 3 })
    Assert.IsTrue(Value.Check(T, [1, 1, 1, 2]))
    Assert.IsTrue(Value.Check(T, [2, 1, 1, 1, 2]))
    Assert.IsTrue(Value.Check(T, [1, 1, 1]))
    Assert.IsFalse(Value.Check(T, []))
    Assert.IsFalse(Value.Check(T, [1, 1]))
    Assert.IsFalse(Value.Check(T, [2]))
  })
  it('Should validate for maxContains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1), maxContains: 3 })
    Assert.IsTrue(Value.Check(T, [1, 1, 1]))
    Assert.IsTrue(Value.Check(T, [1, 1]))
    Assert.IsTrue(Value.Check(T, [2, 2, 2, 2, 1, 1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1, 1]))
  })
  it('Should validate for minContains and maxContains', () => {
    const T = Type.Array(Type.Number(), { contains: Type.Literal(1), minContains: 3, maxContains: 5 })
    Assert.IsFalse(Value.Check(T, [1, 1]))
    Assert.IsTrue(Value.Check(T, [1, 1, 1]))
    Assert.IsTrue(Value.Check(T, [1, 1, 1, 1]))
    Assert.IsTrue(Value.Check(T, [1, 1, 1, 1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1, 1, 1, 1]))
  })
  it('Should not validate minContains and maxContains when contains is unspecified', () => {
    const T = Type.Array(Type.Number(), { minContains: 3, maxContains: 5 })
    Assert.IsFalse(Value.Check(T, [1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1, 1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1, 1, 1, 1]))
  })
  it('Should produce illogical schema when contains is not sub type of items', () => {
    const T = Type.Array(Type.Number(), { contains: Type.String(), minContains: 3, maxContains: 5 })
    Assert.IsFalse(Value.Check(T, [1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1, 1, 1]))
    Assert.IsFalse(Value.Check(T, [1, 1, 1, 1, 1, 1]))
  })
  // ----------------------------------------------------------------
  // Issue: https://github.com/sinclairzx81/typebox/discussions/607
  // ----------------------------------------------------------------
  it('Should correctly handle undefined array properties', () => {
    const Answer = Type.Object({
      text: Type.String(),
      isCorrect: Type.Boolean(),
    })
    const Question = Type.Object({
      text: Type.String(),
      options: Type.Array(Answer, {
        minContains: 1,
        maxContains: 1,
        contains: Type.Object({
          text: Type.String(),
          isCorrect: Type.Literal(true),
        }),
      }),
    })
    Assert.IsFalse(Value.Check(Question, { text: 'A' }))
    Assert.IsFalse(Value.Check(Question, { text: 'A', options: [] }))
    Assert.IsTrue(Value.Check(Question, { text: 'A', options: [{ text: 'A', isCorrect: true }] }))
    Assert.IsTrue(
      Value.Check(Question, {
        text: 'A',
        options: [
          { text: 'A', isCorrect: true },
          { text: 'B', isCorrect: false },
        ],
      }),
    )
    Assert.IsFalse(Value.Check(Question, { text: 'A', options: [{ text: 'A', isCorrect: false }] }))
    Assert.IsFalse(
      Value.Check(Question, {
        text: 'A',
        options: [
          { text: 'A', isCorrect: true },
          { text: 'B', isCorrect: true },
        ],
      }),
    )
  })
})
