import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TBigInt', () => {
  it('Should guard for TBigInt', () => {
    const R = TypeGuard.TBigInt(Type.BigInt())
    Assert.IsTrue(R)
  })
  it('Should not guard for TBigInt', () => {
    const R = TypeGuard.TBigInt(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for BigInt with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TBigInt(Type.BigInt({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
