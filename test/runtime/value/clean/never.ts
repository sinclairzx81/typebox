import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/clean/Never', () => {
  it('Should clean 1', () => {
    const T = Type.Never()
    const R = Value.Clean(T, null)
    Assert.IsEqual(R, null)
  })
})
