import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TAsyncIterator', () => {
  it('Should guard for TAsyncIterator', () => {
    const T = Type.AsyncIterator(Type.Any())
    const R = TypeGuard.IsAsyncIterator(T)
    Assert.IsTrue(R)
  })
  it('Should not guard for TAsyncIterator', () => {
    const T = null
    const R = TypeGuard.IsAsyncIterator(T)
    Assert.IsFalse(R)
  })
  it('Should not guard for TAsyncIterator with invalid $id', () => {
    //@ts-ignore
    const T = Type.AsyncIterator(Type.Any(), { $id: 1 })
    const R = TypeGuard.IsAsyncIterator(T)
    Assert.IsFalse(R)
  })
})
