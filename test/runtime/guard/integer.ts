import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TInteger', () => {
  it('should guard for TInteger', () => {
    const R = TypeGuard.TInteger(Type.Integer())
    Assert.equal(R, true)
  })
  it('should not guard for TInteger', () => {
    const R = TypeGuard.TInteger(null)
    Assert.equal(R, false)
  })
  it('should not guard for TInteger with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TInteger(Type.Integer({ $id: 1 }))
    Assert.equal(R, false)
  })
  it('should not guard for TInteger with invalid multipleOf', () => {
    // @ts-ignore
    const R = TypeGuard.TInteger(Type.Integer({ multipleOf: '1' }))
    Assert.equal(R, false)
  })
  it('should not guard for TInteger with invalid minimum', () => {
    // @ts-ignore
    const R = TypeGuard.TInteger(Type.Integer({ minimum: '1' }))
    Assert.equal(R, false)
  })
  it('should not guard for TInteger with invalid maximum', () => {
    // @ts-ignore
    const R = TypeGuard.TInteger(Type.Integer({ maximum: '1' }))
    Assert.equal(R, false)
  })
  it('should not guard for TInteger with invalid exclusiveMinimum', () => {
    // @ts-ignore
    const R = TypeGuard.TInteger(Type.Integer({ exclusiveMinimum: '1' }))
    Assert.equal(R, false)
  })
  it('should not guard for TInteger with invalid exclusiveMaximum', () => {
    // @ts-ignore
    const R = TypeGuard.TInteger(Type.Integer({ exclusiveMaximum: '1' }))
    Assert.equal(R, false)
  })
})
