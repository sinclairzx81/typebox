import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TVoid', () => {
  it('Should guard for TVoid', () => {
    const R = KindGuard.IsVoid(Type.Void())
    Assert.IsTrue(R)
  })
  it('Should not guard for TVoid', () => {
    const R = KindGuard.IsVoid(null)
    Assert.IsFalse(R)
  })
})
