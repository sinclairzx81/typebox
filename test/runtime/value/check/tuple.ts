import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Tuple', () => {
  it('Should pass tuple', () => {
    const T = Type.Tuple([Type.Number(), Type.Number()])
    const value = [1, 2]
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail when tuple is less than length', () => {
    const T = Type.Tuple([Type.Number(), Type.Number()])
    const value = [1]
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should fail when tuple is greater than length', () => {
    const T = Type.Tuple([Type.Number(), Type.Number()])
    const value = [1, 1, 2]
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })

  it('Should pass empty tuple', () => {
    const T = Type.Tuple([])
    const value = [] as any[]
    const result = Value.Check(T, value)
    Assert.equal(result, true)
  })

  it('Should fail empty tuple', () => {
    const T = Type.Tuple([])
    const value = [1]
    const result = Value.Check(T, value)
    Assert.equal(result, false)
  })
})
