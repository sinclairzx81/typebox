import { TypeGuard, Kind } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TKind', () => {
  it('Should guard 1', () => {
    const T = { [Kind]: 'Kind' }
    Assert.IsTrue(TypeGuard.TKind(T))
  })
  it('Should guard 2', () => {
    const T = {}
    Assert.IsFalse(TypeGuard.TKind(T))
  })
})
