import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TBoolean', () => {
  it('should guard for TBoolean', () => {
    const R = TypeGuard.TBoolean(Type.Boolean())
    Assert.equal(R, true)
  })
  it('should not guard for TBoolean', () => {
    const R = TypeGuard.TBoolean(null)
    Assert.equal(R, false)
  })
})
