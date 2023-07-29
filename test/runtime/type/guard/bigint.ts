import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TBigInt', () => {
  it('Should guard for TBigInt', () => {
    const R = TypeGuard.TBigInt(Type.BigInt())
    Assert.IsEqual(R, true)
  })
  it('Should not guard for TBigInt', () => {
    const R = TypeGuard.TBigInt(null)
    Assert.IsEqual(R, false)
  })
  it('Should not guard for BigInt with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TBigInt(Type.BigInt({ $id: 1 }))
    Assert.IsEqual(R, false)
  })
})
