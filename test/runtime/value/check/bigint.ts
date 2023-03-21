import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/BigInt', () => {
  const T = Type.BigInt()
  it('Should not validate NaN', () => {
    const T = Type.BigInt()
    const result = Value.Check(T, NaN)
    Assert.equal(result, false)
  })
  it('Should not validate +Infinity', () => {
    const T = Type.BigInt()
    const result = Value.Check(T, Infinity)
    Assert.equal(result, false)
  })
  it('Should not validate -Infinity', () => {
    const T = Type.BigInt()
    const result = Value.Check(T, -Infinity)
    Assert.equal(result, false)
  })
  it('Should fail integer', () => {
    const value = 1
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail integer', () => {
    const value = 3.14
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail Date', () => {
    const value = new Date()
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should pass bigint', () => {
    const result = Value.Check(T, BigInt(0))
    Assert.equal(result, true)
  })
})
