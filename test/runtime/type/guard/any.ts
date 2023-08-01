import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TAny', () => {
  it('Should guard for TAny', () => {
    const R = TypeGuard.TAny(Type.Any())
    Assert.IsTrue(R)
  })
  it('Should not guard for TAny', () => {
    const R = TypeGuard.TAny(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TAny with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TAny(Type.Any({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
