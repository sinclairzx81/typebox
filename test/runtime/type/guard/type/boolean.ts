import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TBoolean', () => {
  it('Should guard for TBoolean', () => {
    const R = TypeGuard.IsBoolean(Type.Boolean())
    Assert.IsTrue(R)
  })
  it('Should not guard for TBoolean', () => {
    const R = TypeGuard.IsBoolean(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TBoolean with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsBoolean(Type.Boolean({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
