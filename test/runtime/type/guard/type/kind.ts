import { TypeGuard, Kind } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TKind', () => {
  it('Should guard 1', () => {
    const T = { [Kind]: 'Kind' }
    Assert.IsTrue(TypeGuard.IsKind(T))
  })
  it('Should guard 2', () => {
    const T = {}
    Assert.IsFalse(TypeGuard.IsKind(T))
  })
})
