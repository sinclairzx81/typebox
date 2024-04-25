import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TSymbol', () => {
  it('Should guard for TSymbol', () => {
    const R = KindGuard.IsSymbol(Type.Symbol())
    Assert.IsTrue(R)
  })
  it('Should not guard for TSymbol', () => {
    const R = KindGuard.IsSymbol(null)
    Assert.IsFalse(R)
  })
})
