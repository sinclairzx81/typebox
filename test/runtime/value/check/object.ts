import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Object', () => {
  const T = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number(),
    a: Type.String(),
    b: Type.String(),
    c: Type.String(),
  })

  it('Should pass object', () => {
    const value = {
      x: 1,
      y: 1,
      z: 1,
      a: '1',
      b: '1',
      c: '1',
    }
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail object with additional properties', () => {
    const T = Type.Object(
      {
        x: Type.Number(),
        y: Type.Number(),
        z: Type.Number(),
      },
      { additionalProperties: false },
    )
    const value = {
      x: 1,
      y: 1,
      z: 1,
      a: 1,
    }
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail object with invalid property', () => {
    const value = {
      x: true,
      y: 1,
      z: 1,
      a: '1',
      b: '1',
      c: '1',
    }
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail object with missing property', () => {
    const value = {
      y: 1,
      z: 1,
      a: '1',
      b: '1',
      c: '1',
    }
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should pass object with optional properties', () => {
    const T = Type.Object({
      x: Type.Optional(Type.Number()),
      y: Type.Optional(Type.Number()),
      z: Type.Optional(Type.Number()),
      a: Type.String(),
      b: Type.String(),
      c: Type.String(),
    })
    const value = {
      a: '1',
      b: '1',
      c: '1',
    }
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail object with null', () => {
    const value = null
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail object with undefined', () => {
    const value = undefined
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
})
