import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TAsyncIterator', () => {
  it('Should guard for TAsyncIterator', () => {
    const T = Type.AsyncIterator(Type.Any())
    const R = KindGuard.IsAsyncIterator(T)
    Assert.IsTrue(R)
  })
  it('Should not guard for TAsyncIterator', () => {
    const T = null
    const R = KindGuard.IsAsyncIterator(T)
    Assert.IsFalse(R)
  })
})
