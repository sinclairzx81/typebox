import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Any', () => {
  const T = Type.Any()
  it('Should pass string', () => {
    const value = 'hello'
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })
  it('Should pass number', () => {
    const value = 1
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })
  it('Should pass boolean', () => {
    const value = true
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })
  it('Should pass null', () => {
    const value = null
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })
  it('Should pass undefined', () => {
    const value = undefined
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })
  it('Should pass object', () => {
    const value = { a: 1 }
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })
  it('Should pass array', () => {
    const value = [1, 2]
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })
})
