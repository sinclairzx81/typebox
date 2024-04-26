import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TConstructor', () => {
  it('Should guard for TConstructor', () => {
    const R = KindGuard.IsConstructor(Type.Constructor([], Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TConstructor', () => {
    const R = KindGuard.IsConstructor(null)
    Assert.IsFalse(R)
  })
})
