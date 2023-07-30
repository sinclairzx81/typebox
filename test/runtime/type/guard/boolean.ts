import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TBoolean', () => {
  it('Should guard for TBoolean', () => {
    const R = TypeGuard.TBoolean(Type.Boolean())
    Assert.IsTrue(R)
  })
  it('Should not guard for TBoolean', () => {
    const R = TypeGuard.TBoolean(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TBoolean with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TBoolean(Type.Boolean({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
