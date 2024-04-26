import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TUnknown', () => {
  it('Should guard for TUnknown', () => {
    const R = TypeGuard.IsUnknown(Type.Unknown())
    Assert.IsTrue(R)
  })
  it('Should not guard for TUnknown', () => {
    const R = TypeGuard.IsUnknown(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TUnknown with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsUnknown(Type.Unknown({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
