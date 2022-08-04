import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TNull', () => {
  it('should guard for TNull', () => {
    const R = TypeGuard.TNull(Type.Null())
    Assert.equal(R, true)
  })
  it('should not guard for TNull', () => {
    const R = TypeGuard.TNull(null)
    Assert.equal(R, false)
  })
  it('should not guard for TNull with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TNull(Type.Null({ $id: 1 }))
    Assert.equal(R, false)
  })
})
