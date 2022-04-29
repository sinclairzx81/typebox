import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/RegEx', () => {
  it('Should pass regex', () => {
    const T = Type.RegEx(/foo/)
    const value = 'foo'
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail regex', () => {
    const T = Type.RegEx(/foo/)
    const value = 'bar'
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
})
