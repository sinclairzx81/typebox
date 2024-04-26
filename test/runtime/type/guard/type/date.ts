import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TDate', () => {
  it('Should guard for TDate', () => {
    const R = TypeGuard.IsDate(Type.Date())
    Assert.IsTrue(R)
  })
  it('Should not guard for TDate', () => {
    const R = TypeGuard.IsDate(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsDate(Type.Date({ $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid exclusiveMaximumTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.IsDate(Type.Date({ exclusiveMaximumTimestamp: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid exclusiveMinimumTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.IsDate(Type.Date({ exclusiveMinimumTimestamp: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid maximumTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.IsDate(Type.Date({ maximumTimestamp: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid minimumTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.IsDate(Type.Date({ minimumTimestamp: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid multipleOfTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.IsDate(Type.Date({ multipleOfTimestamp: '1' }))
    Assert.IsFalse(R)
  })
})
