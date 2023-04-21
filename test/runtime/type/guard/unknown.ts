import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TUnknown', () => {
  it('Should guard for TUnknown', () => {
    const R = TypeGuard.TUnknown(Type.Unknown())
    Assert.isEqual(R, true)
  })
  it('Should not guard for TUnknown', () => {
    const R = TypeGuard.TUnknown(null)
    Assert.isEqual(R, false)
  })
  it('Should not guard for TUnknown with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TUnknown(Type.Unknown({ $id: 1 }))
    Assert.isEqual(R, false)
  })
})
