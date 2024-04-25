import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TRef', () => {
  it('Should guard for TRef', () => {
    const T = Type.Number({ $id: 'T' })
    const R = TypeGuard.IsRef(Type.Ref(T))
    Assert.IsTrue(R)
  })
  it('Should not guard for TRef', () => {
    const R = TypeGuard.IsRef(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TRef with invalid $ref', () => {
    const T = Type.Number({ $id: 'T' })
    const S = Type.Ref(T)
    // @ts-ignore
    S.$ref = 1
    const R = TypeGuard.IsRef(S)
    Assert.IsFalse(R)
  })
})
