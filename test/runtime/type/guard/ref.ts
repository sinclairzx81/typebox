import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TRef', () => {
  it('Should guard for TRef', () => {
    const T = Type.Number({ $id: 'T' })
    const R = TypeGuard.TRef(Type.Ref(T))
    Assert.IsEqual(R, true)
  })
  it('Should not guard for TRef', () => {
    const R = TypeGuard.TRef(null)
    Assert.IsEqual(R, false)
  })
  it('Should not guard for TRef with invalid $ref', () => {
    const T = Type.Number({ $id: 'T' })
    const S = Type.Ref(T)
    // @ts-ignore
    S.$ref = 1
    const R = TypeGuard.TRef(S)
    Assert.IsEqual(R, false)
  })
})
