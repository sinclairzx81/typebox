import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TDate', () => {
  it('Should guard for TDate', () => {
    const R = TypeGuard.TDate(Type.Date())
    Assert.IsTrue(R)
  })
  it('Should not guard for TDate', () => {
    const R = TypeGuard.TDate(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Date({ $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid exclusiveMaximumTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Date({ exclusiveMaximumTimestamp: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid exclusiveMinimumTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Date({ exclusiveMinimumTimestamp: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid maximumTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Date({ maximumTimestamp: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid minimumTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Date({ minimumTimestamp: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid multipleOfTimestamp', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Date({ multipleOfTimestamp: '1' }))
    Assert.IsFalse(R)
  })
})
