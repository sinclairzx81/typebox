import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TFunction', () => {
  it('Should guard for TFunction', () => {
    const R = KindGuard.IsFunction(Type.Function([], Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TFunction', () => {
    const R = KindGuard.IsFunction(null)
    Assert.IsFalse(R)
  })
})
