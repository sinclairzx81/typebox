import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TUndefined', () => {
  it('should guard for TUndefined', () => {
    const R = TypeGuard.TUndefined(Type.Undefined())
    Assert.equal(R, true)
  })
  it('should not guard for TUndefined', () => {
    const R = TypeGuard.TUndefined(null)
    Assert.equal(R, false)
  })
  it('should not guard for TUndefined with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TUndefined(Type.Undefined({ $id: 1 }))
    Assert.equal(R, false)
  })
})
