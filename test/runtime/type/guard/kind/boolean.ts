import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TBoolean', () => {
  it('Should guard for TBoolean', () => {
    const R = KindGuard.IsBoolean(Type.Boolean())
    Assert.IsTrue(R)
  })
  it('Should not guard for TBoolean', () => {
    const R = KindGuard.IsBoolean(null)
    Assert.IsFalse(R)
  })
})
