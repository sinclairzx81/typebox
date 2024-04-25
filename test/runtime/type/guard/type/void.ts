import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TVoid', () => {
  it('Should guard for TVoid', () => {
    const R = TypeGuard.IsVoid(Type.Void())
    Assert.IsTrue(R)
  })
  it('Should not guard for TVoid', () => {
    const R = TypeGuard.IsVoid(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TVoid with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsVoid(Type.Void({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
