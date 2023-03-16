import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TDeref', () => {
  it('Should deref and guard Boolean', () => {
    const T = Type.Boolean({ $id: 'T' })
    const R = Type.Ref(T)
    const D = Type.Deref(R)
    Assert.equal(TypeGuard.TBoolean(D), true)
  })
})
