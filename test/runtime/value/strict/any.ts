import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/strict/Any', () => {
  it('Should clean 1', () => {
    const T = Type.Any()
    const R = Value.Strict(T, null)
    Assert.IsEqual(R, null)
  })
})
