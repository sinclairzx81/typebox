import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TInteger', () => {
  it('Should guard for TInteger', () => {
    const R = KindGuard.IsInteger(Type.Integer())
    Assert.IsTrue(R)
  })
  it('Should not guard for TInteger', () => {
    const R = KindGuard.IsInteger(null)
    Assert.IsFalse(R)
  })
})
