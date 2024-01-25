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
  it('Should validate with minLength constraint', () => {
    const T = Type.RegExp(/(.*)/, {
      minLength: 3,
    })
    Assert.IsTrue(Value.Check(T, 'xxx'))
    Assert.IsFalse(Value.Check(T, 'xx'))
  })
  it('Should validate with maxLength constraint', () => {
    const T = Type.RegExp(/(.*)/, {
      maxLength: 3,
    })
    Assert.IsTrue(Value.Check(T, 'xxx'))
    Assert.IsFalse(Value.Check(T, 'xxxx'))
  })
})
