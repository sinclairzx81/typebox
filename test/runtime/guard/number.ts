import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TNumber', () => {
  it('should guard for TNumber', () => {
    const R = TypeGuard.TNumber(Type.Number())
    Assert.equal(R, true)
  })
  it('should not guard for TNumber', () => {
    const R = TypeGuard.TNumber(null)
    Assert.equal(R, false)
  })
  it('should not guard for invalid multipleOf', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ multipleOf: '1' }))
    Assert.equal(R, false)
  })
  it('should not guard for invalid minimum', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ minimum: '1' }))
    Assert.equal(R, false)
  })
  it('should not guard for invalid maximum', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ maximum: '1' }))
    Assert.equal(R, false)
  })
  it('should not guard for invalid exclusiveMinimum', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ exclusiveMinimum: '1' }))
    Assert.equal(R, false)
  })
  it('should not guard for invalid exclusiveMaximum', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ exclusiveMaximum: '1' }))
    Assert.equal(R, false)
  })
})
