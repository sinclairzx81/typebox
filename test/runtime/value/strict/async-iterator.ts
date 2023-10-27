import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/strict/AsyncIterator', () => {
  it('Should clean 1', () => {
    const T = Type.AsyncIterator(Type.Number())
    const R = Value.Strict(T, null)
    Assert.IsEqual(R, null)
  })
})
