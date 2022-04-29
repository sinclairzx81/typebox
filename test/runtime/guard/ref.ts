import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TRef', () => {
  it('should guard for TRef', () => {
    const T = Type.Number({ $id: 'T' })
    const R = TypeGuard.TRef(Type.Ref(T))
    Assert.equal(R, true)
  })
  it('should not guard for TAny', () => {
    const R = TypeGuard.TRef(null)
    Assert.equal(R, false)
  })
})
