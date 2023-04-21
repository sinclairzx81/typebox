import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Number', () => {
  const T = Type.Number()
  it('Should not validate NaN', () => {
    const T = Type.Number()
    const result = Value.Check(T, NaN)
    Assert.isEqual(result, false)
  })
  it('Should not validate +Infinity', () => {
    const T = Type.Number()
    const result = Value.Check(T, Infinity)
    Assert.isEqual(result, false)
  })
  it('Should not validate -Infinity', () => {
    const T = Type.Number()
    const result = Value.Check(T, -Infinity)
    Assert.isEqual(result, false)
  })
  it('Should fail string', () => {
    const value = 'hello'
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  it('Should pass number', () => {
    const value = 1
    const result = Value.Check(T, value)
    Assert.isEqual(result, true)
  })
  it('Should fail boolean', () => {
    const value = true
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  it('Should fail null', () => {
    const value = null
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  it('Should fail undefined', () => {
    const value = undefined
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  it('Should fail object', () => {
    const value = { a: 1 }
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  it('Should fail array', () => {
    const value = [1, 2]
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })
  it('Should fail Date', () => {
    const value = new Date()
    const result = Value.Check(T, value)
    Assert.isEqual(result, false)
  })

  it('Should fail NaN', () => {
    const result = Value.Check(Type.Number(), NaN)
    Assert.isEqual(result, false)
  })
})
