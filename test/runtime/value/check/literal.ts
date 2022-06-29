import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Literal', () => {
  const T = Type.Literal('hello')
  it('Should pass literal', () => {
    const value = 'hello'
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })
  it('Should fail literal', () => {
    const value = 1
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
  it('Should fail literal with undefined', () => {
    const value = undefined
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
  it('Should fail literal with null', () => {
    const value = null
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
})
