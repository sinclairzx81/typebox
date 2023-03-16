import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TNumber', () => {
  it('Should guard for TNumber', () => {
    const R = TypeGuard.TNumber(Type.Number())
    Assert.equal(R, true)
  })
  it('Should not guard for TNumber', () => {
    const R = TypeGuard.TNumber(null)
    Assert.equal(R, false)
  })
  it('Should not guard for TNumber with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ $id: 1 }))
    Assert.equal(R, false)
  })
  it('Should not guard for TNumber with invalid multipleOf', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ multipleOf: '1' }))
    Assert.equal(R, false)
  })
  it('Should not guard for TNumber with invalid minimum', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ minimum: '1' }))
    Assert.equal(R, false)
  })
  it('Should not guard for TNumber with invalid maximum', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ maximum: '1' }))
    Assert.equal(R, false)
  })
  it('Should not guard for TNumber with invalid exclusiveMinimum', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ exclusiveMinimum: '1' }))
    Assert.equal(R, false)
  })
  it('Should not guard for TNumber with invalid exclusiveMaximum', () => {
    // @ts-ignore
    const R = TypeGuard.TNumber(Type.Number({ exclusiveMaximum: '1' }))
    Assert.equal(R, false)
  })
})
