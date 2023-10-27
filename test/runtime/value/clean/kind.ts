import { Value } from '@sinclair/typebox/value'
import { Type, Kind } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/clean/Kind', () => {
  it('Should clean 1', () => {
    const T = Type.Unsafe({ [Kind]: 'Unknown' })
    const R = Value.Clean(T, null)
    Assert.IsEqual(R, null)
  })
})
