import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TBoolean', () => {
  it('Should guard for TBoolean', () => {
    const R = TypeGuard.TBoolean(Type.Boolean())
    Assert.IsEqual(R, true)
  })
  it('Should not guard for TBoolean', () => {
    const R = TypeGuard.TBoolean(null)
    Assert.IsEqual(R, false)
  })
  it('Should not guard for TBoolean with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TBoolean(Type.Boolean({ $id: 1 }))
    Assert.IsEqual(R, false)
  })
})
