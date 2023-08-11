import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Date', () => {
  const T = Type.Date()
  it('Should fail string', () => {
    const value = 'hello'
    const result = Value.Check(T, value)
    Assert.IsFalse(result)
  })
  it('Should fail number', () => {
    const value = 1
    const result = Value.Check(T, value)
    Assert.IsFalse(result)
  })
  it('Should fail boolean', () => {
    const value = true
    const result = Value.Check(T, value)
    Assert.IsFalse(result)
  })
  it('Should fail null', () => {
    const value = null
    const result = Value.Check(T, value)
    Assert.IsFalse(result)
  })
  it('Should fail undefined', () => {
    const value = undefined
    const result = Value.Check(T, value)
    Assert.IsFalse(result)
  })
  it('Should fail object', () => {
    const value = { a: 1 }
    const result = Value.Check(T, value)
    Assert.IsFalse(result)
  })
  it('Should fail array', () => {
    const value = [1, 2]
    const result = Value.Check(T, value)
    Assert.IsFalse(result)
  })
  it('Should pass Date', () => {
    const value = new Date()
    const result = Value.Check(T, value)
    Assert.IsTrue(result)
  })
  it('Should not validate Date if is invalid', () => {
    const value = new Date('not-a-valid-date')
    const result = Value.Check(T, value)
    Assert.IsFalse(result)
  })
  it('Should validate Date minimumTimestamp', () => {
    const T = Type.Date({ minimumTimestamp: 10 })
    const R1 = Value.Check(T, new Date(9))
    const R2 = Value.Check(T, new Date(10))
    Assert.IsFalse(R1)
    Assert.IsTrue(R2)
  })
  it('Should validate Date maximumTimestamp', () => {
    const T = Type.Date({ maximumTimestamp: 10 })
    const R1 = Value.Check(T, new Date(11))
    const R2 = Value.Check(T, new Date(10))
    Assert.IsFalse(R1)
    Assert.IsTrue(R2)
  })
  it('Should validate Date exclusiveMinimumTimestamp', () => {
    const T = Type.Date({ exclusiveMinimumTimestamp: 10 })
    const R1 = Value.Check(T, new Date(10))
    const R2 = Value.Check(T, new Date(11))
    Assert.IsFalse(R1)
    Assert.IsTrue(R2)
  })
  it('Should validate Date exclusiveMaximumTimestamp', () => {
    const T = Type.Date({ exclusiveMaximumTimestamp: 10 })
    const R1 = Value.Check(T, new Date(10))
    const R2 = Value.Check(T, new Date(9))
    Assert.IsFalse(R1)
    Assert.IsTrue(R2)
  })
  it('Should validate Date multipleOfTimestamp', () => {
    const T = Type.Date({ multipleOfTimestamp: 2 })
    const R1 = Value.Check(T, new Date(1))
    const R2 = Value.Check(T, new Date(2))
    Assert.IsFalse(R1)
    Assert.IsTrue(R2)
  })
})
