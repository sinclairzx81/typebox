import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TIterator', () => {
  it('Should guard for TIterator', () => {
    const T = Type.Iterator(Type.Any())
    const R = TypeGuard.TIterator(T)
    Assert.IsEqual(R, true)
  })
  it('Should not guard for TIterator', () => {
    const T = null
    const R = TypeGuard.TIterator(T)
    Assert.IsEqual(R, false)
  })
  it('Should not guard for TIterator with invalid $id', () => {
    //@ts-ignore
    const T = Type.Iterator(Type.Any(), { $id: 1 })
    const R = TypeGuard.TIterator(T)
    Assert.IsEqual(R, false)
  })
})
