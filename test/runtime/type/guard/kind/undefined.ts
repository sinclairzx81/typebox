import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TUndefined', () => {
  it('Should guard for TUndefined', () => {
    const R = KindGuard.IsUndefined(Type.Undefined())
    Assert.IsTrue(R)
  })
  it('Should not guard for TUndefined', () => {
    const R = KindGuard.IsUndefined(null)
    Assert.IsFalse(R)
  })
})
