import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/KeyOf', () => {
  const T = Type.KeyOf(
    Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    }),
  )

  it('Should pass keyof', () => {
    const value = 'x'
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail keyof', () => {
    const value = 'w'
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail keyof with undefined', () => {
    const value = undefined
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail keyof with null', () => {
    const value = null
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
})
