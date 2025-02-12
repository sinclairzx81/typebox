import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TArgument', () => {
  it('Should guard for TArgument', () => {
    const R = TypeGuard.IsArgument(Type.Argument(0))
    Assert.IsTrue(R)
  })
  it('Should not guard for TArgument', () => {
    const R = TypeGuard.IsArgument(null)
    Assert.IsFalse(R)
  })
})
