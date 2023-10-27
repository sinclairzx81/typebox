import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/strict/BigInt', () => {
  it('Should clean 1', () => {
    const T = Type.BigInt()
    const R = Value.Strict(T, null)
    Assert.IsEqual(R, null)
  })
})
