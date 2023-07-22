import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/RegExp', () => {
  // -------------------------------------------------
  // Regular Expression
  // -------------------------------------------------
  it('Should pass regular expression 1', () => {
    const T = Type.RegExp(/foo/)
    const value = 'foo'
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
  it('Should pass regular expression 2', () => {
    const T = Type.RegExp(/foo/)
    const value = 'bar'
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
  // -------------------------------------------------
  // Pattern
  // -------------------------------------------------
  it('Should pass pattern 1', () => {
    const T = Type.RegExp('foo')
    const value = 'foo'
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })
  it('Should pass pattern 2', () => {
    const T = Type.RegExp('foo')
    const value = 'bar'
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })
})
