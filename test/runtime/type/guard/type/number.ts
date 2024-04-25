import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TNumber', () => {
  it('Should guard for TNumber', () => {
    const R = TypeGuard.IsNumber(Type.Number())
    Assert.IsTrue(R)
  })
  it('Should not guard for TNumber', () => {
    const R = TypeGuard.IsNumber(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TNumber with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsNumber(Type.Number({ $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TNumber with invalid multipleOf', () => {
    // @ts-ignore
    const R = TypeGuard.IsNumber(Type.Number({ multipleOf: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TNumber with invalid minimum', () => {
    // @ts-ignore
    const R = TypeGuard.IsNumber(Type.Number({ minimum: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TNumber with invalid maximum', () => {
    // @ts-ignore
    const R = TypeGuard.IsNumber(Type.Number({ maximum: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TNumber with invalid exclusiveMinimum', () => {
    // @ts-ignore
    const R = TypeGuard.IsNumber(Type.Number({ exclusiveMinimum: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TNumber with invalid exclusiveMaximum', () => {
    // @ts-ignore
    const R = TypeGuard.IsNumber(Type.Number({ exclusiveMaximum: '1' }))
    Assert.IsFalse(R)
  })
})
