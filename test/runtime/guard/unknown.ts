import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TUnknown', () => {
  it('should guard for TUnknown', () => {
    const R = TypeGuard.TUnknown(Type.Unknown())
    Assert.equal(R, true)
  })
  it('should not guard for TUnknown', () => {
    const R = TypeGuard.TUnknown(null)
    Assert.equal(R, false)
  })
})
