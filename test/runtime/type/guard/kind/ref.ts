import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TRef', () => {
  it('Should guard for TRef', () => {
    const T = Type.Number({ $id: 'T' })
    const R = KindGuard.IsRef(Type.Ref(T))
    Assert.IsTrue(R)
  })
  it('Should not guard for TRef', () => {
    const R = KindGuard.IsRef(null)
    Assert.IsFalse(R)
  })
})
