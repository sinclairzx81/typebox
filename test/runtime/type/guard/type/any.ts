import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TAny', () => {
  it('Should guard for TAny', () => {
    const R = TypeGuard.IsAny(Type.Any())
    Assert.IsTrue(R)
  })
  it('Should not guard for TAny', () => {
    const R = TypeGuard.IsAny(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TAny with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsAny(Type.Any({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
