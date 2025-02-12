import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TArgument', () => {
  it('Should guard for TArgument', () => {
    const R = KindGuard.IsArgument(Type.Argument(0))
    Assert.IsTrue(R)
  })
  it('Should not guard for TArgument', () => {
    const R = KindGuard.IsArgument(null)
    Assert.IsFalse(R)
  })
})
