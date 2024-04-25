import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TIterator', () => {
  it('Should guard for TIterator', () => {
    const T = Type.Iterator(Type.Any())
    const R = KindGuard.IsIterator(T)
    Assert.IsTrue(R)
  })
  it('Should not guard for TIterator', () => {
    const T = null
    const R = KindGuard.IsIterator(T)
    Assert.IsFalse(R)
  })
})
