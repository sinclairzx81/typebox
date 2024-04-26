import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TPromise', () => {
  it('Should guard for TPromise', () => {
    const R = KindGuard.IsPromise(Type.Promise(Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TPromise', () => {
    const R = KindGuard.IsPromise(null)
    Assert.IsFalse(R)
  })
})
