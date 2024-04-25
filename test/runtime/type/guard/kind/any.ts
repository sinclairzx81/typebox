import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TAny', () => {
  it('Should guard for TAny', () => {
    const R = KindGuard.IsAny(Type.Any())
    Assert.IsTrue(R)
  })
  it('Should not guard for TAny', () => {
    const R = KindGuard.IsAny(null)
    Assert.IsFalse(R)
  })
})
