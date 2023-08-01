import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Symbol', () => {
  const T = Type.Symbol()
  it('Should fail string', () => {
    const value = 'hello'
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail number', () => {
    const value = 1
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail boolean', () => {
    const value = true
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail null', () => {
    const value = null
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail undefined', () => {
    const value = undefined
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail object', () => {
    const value = { a: 1 }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail array', () => {
    const value = [1, 2]
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should fail Date', () => {
    const value = new Date()
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  it('Should pass symbol', () => {
    const value = Symbol(1)
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
})
