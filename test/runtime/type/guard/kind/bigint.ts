import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TBigInt', () => {
  it('Should guard for TBigInt', () => {
    const R = KindGuard.IsBigInt(Type.BigInt())
    Assert.IsTrue(R)
  })
  it('Should not guard for TBigInt', () => {
    const R = KindGuard.IsBigInt(null)
    Assert.IsFalse(R)
  })
})
