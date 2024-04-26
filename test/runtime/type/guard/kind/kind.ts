import { KindGuard, Kind } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TKind', () => {
  it('Should guard 1', () => {
    const T = { [Kind]: 'Kind' }
    Assert.IsTrue(KindGuard.IsKind(T))
  })
  it('Should guard 2', () => {
    const T = {}
    Assert.IsFalse(KindGuard.IsKind(T))
  })
})
