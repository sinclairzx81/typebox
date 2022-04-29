import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TAny', () => {
  it('should guard for TAny', () => {
    const R = TypeGuard.TAny(Type.Any())
    Assert.equal(R, true)
  })
  it('should not guard for TAny', () => {
    const R = TypeGuard.TAny(null)
    Assert.equal(R, false)
  })
  it('should not guard for TAny with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TAny(Type.Any({ $id: 1 }))
    Assert.equal(R, false)
  })
})
