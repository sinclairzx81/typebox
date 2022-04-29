import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TInteger', () => {
  it('should guard for TInteger', () => {
    const R = TypeGuard.TInteger(Type.Integer())
    Assert.equal(R, true)
  })
  it('should not guard for TInteger', () => {
    const R = TypeGuard.TInteger(null)
    Assert.equal(R, false)
  })
})
