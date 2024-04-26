import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TNull', () => {
  it('Should guard for TNull', () => {
    const R = TypeGuard.IsNull(Type.Null())
    Assert.IsTrue(R)
  })
  it('Should not guard for TNull', () => {
    const R = TypeGuard.IsNull(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TNull with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsNull(Type.Null({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
