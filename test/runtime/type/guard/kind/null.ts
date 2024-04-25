import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TNull', () => {
  it('Should guard for TNull', () => {
    const R = KindGuard.IsNull(Type.Null())
    Assert.IsTrue(R)
  })
  it('Should not guard for TNull', () => {
    const R = KindGuard.IsNull(null)
    Assert.IsFalse(R)
  })
})
