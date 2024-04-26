import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TBigInt', () => {
  it('Should guard for TBigInt', () => {
    const R = TypeGuard.IsBigInt(Type.BigInt())
    Assert.IsTrue(R)
  })
  it('Should not guard for TBigInt', () => {
    const R = TypeGuard.IsBigInt(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for BigInt with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsBigInt(Type.BigInt({ $id: 1 }))
    Assert.IsFalse(R)
  })
})
