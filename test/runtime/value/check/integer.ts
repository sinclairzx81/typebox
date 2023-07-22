import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Integer', () => {
  const T = Type.Integer()
  it('Should not validate NaN', () => {
    const T = Type.Integer()
    const result = Value.Check(T, NaN)
    Assert.IsEqual(result, false)
  })
  it('Should not validate +Infinity', () => {
    const T = Type.Integer()
    const result = Value.Check(T, Infinity)
    Assert.IsEqual(result, false)
  })
  it('Should not validate -Infinity', () => {
    const T = Type.Integer()
    const result = Value.Check(T, -Infinity)
    Assert.IsEqual(result, false)
  })
  it('Should pass integer', () => {
    const value = 1
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
  it('Should fail integer', () => {
    const value = 3.14
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail Date', () => {
    const value = new Date()
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
})
