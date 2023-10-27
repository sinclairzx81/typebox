import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/strict/Enum', () => {
  it('Should clean 1', () => {
    const T = Type.Enum({ x: 1, y: 2 })
    const R = Value.Strict(T, null)
    Assert.IsEqual(R, null)
  })
})
