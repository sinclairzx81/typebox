import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TUnknown', () => {
  it('Should guard for TUnknown', () => {
    const R = TypeGuard.TUnknown(Type.Unknown())
    Assert.IsTrue(R)
  })
  it('Should not guard for TUnknown', () => {
    const R = TypeGuard.TUnknown(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TUnknown with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TUnknown(Type.Unknown({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
