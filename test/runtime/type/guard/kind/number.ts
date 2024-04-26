import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TNumber', () => {
  it('Should guard for TNumber', () => {
    const R = KindGuard.IsNumber(Type.Number())
    Assert.IsTrue(R)
  })
  it('Should not guard for TNumber', () => {
    const R = KindGuard.IsNumber(null)
    Assert.IsFalse(R)
  })
})
