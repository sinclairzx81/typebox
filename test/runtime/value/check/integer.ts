import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Integer', () => {
  const T = Type.Integer()

  it('Should pass integer', () => {
    const value = 1
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail integer', () => {
    const value = 3.14
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
})
