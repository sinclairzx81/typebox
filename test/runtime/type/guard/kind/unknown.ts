import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TUnknown', () => {
  it('Should guard for TUnknown', () => {
    const R = KindGuard.IsUnknown(Type.Unknown())
    Assert.IsTrue(R)
  })
  it('Should not guard for TUnknown', () => {
    const R = KindGuard.IsUnknown(null)
    Assert.IsFalse(R)
  })
})
