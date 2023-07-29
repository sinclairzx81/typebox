import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Composite', () => {
  const A = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number(),
  })
  const B = Type.Object({
    a: Type.String(),
    b: Type.String(),
    c: Type.String(),
  })
  const T = Type.Composite([A, B])
  it('Should pass composite', () => {
    const value = {
      x: 1,
      y: 1,
      z: 1,
      a: '1',
      b: '1',
      c: '1',
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
  it('Should fail intersect with invalid property', () => {
    const value = {
      x: true,
      y: 1,
      z: 1,
      a: '1',
      b: '1',
      c: '1',
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail intersect with missing property', () => {
    const value = {
      y: 1,
      z: 1,
      a: '1',
      b: '1',
      c: '1',
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail intersect with primitive value', () => {
    const value = 1
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should pass intersect with optional properties', () => {
    const A = Type.Object({
      x: Type.Optional(Type.Number()),
      y: Type.Optional(Type.Number()),
      z: Type.Optional(Type.Number()),
    })
    const B = Type.Object({
      a: Type.String(),
      b: Type.String(),
      c: Type.String(),
    })
    const T = Type.Composite([A, B])
    const value = {
      a: '1',
      b: '1',
      c: '1',
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
})
