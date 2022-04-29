import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Union', () => {
  const A = Type.Object({
    type: Type.Literal('A'),
    x: Type.Number(),
    y: Type.Number(),
  })

  const B = Type.Object({
    type: Type.Literal('B'),
    x: Type.Boolean(),
    y: Type.Boolean(),
  })

  const T = Type.Union([A, B])

  it('Should pass union A', () => {
    const value = { type: 'A', x: 1, y: 1 }
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should pass union B', () => {
    const value = { type: 'B', x: true, y: false }
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail union A', () => {
    const value = { type: 'A', x: true, y: false }
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail union B', () => {
    const value = { type: 'B', x: 1, y: 1 }
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should pass union A with optional properties', () => {
    const A = Type.Object({
      type: Type.Literal('A'),
      x: Type.Optional(Type.Number()),
      y: Type.Optional(Type.Number()),
    })
    const B = Type.Object({
      type: Type.Literal('B'),
      x: Type.Boolean(),
      y: Type.Boolean(),
    })
    const T = Type.Union([A, B])
    const value = { type: 'A' }
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail union A with invalid optional properties', () => {
    const A = Type.Object({
      type: Type.Literal('A'),
      x: Type.Optional(Type.Number()),
      y: Type.Optional(Type.Number()),
    })
    const B = Type.Object({
      type: Type.Literal('B'),
      x: Type.Boolean(),
      y: Type.Boolean(),
    })
    const T = Type.Union([A, B])
    const value = { type: 'A', x: true, y: false }
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
})
