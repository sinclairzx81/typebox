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
    const R = TypeGuard.TDate(Type.Number({ $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid minimum', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Number({ minimum: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid maximum', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Number({ maximum: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid exclusiveMinimum', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Number({ exclusiveMinimum: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TDate with invalid exclusiveMaximum', () => {
    // @ts-ignore
    const R = TypeGuard.TDate(Type.Number({ exclusiveMaximum: '1' }))
    Assert.IsFalse(R)
  })
})
