import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TInteger', () => {
  it('Should guard for TInteger', () => {
    const R = TypeGuard.IsInteger(Type.Integer())
    Assert.IsTrue(R)
  })
  it('Should not guard for TInteger', () => {
    const R = TypeGuard.IsInteger(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TInteger with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsInteger(Type.Integer({ $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TInteger with invalid multipleOf', () => {
    // @ts-ignore
    const R = TypeGuard.IsInteger(Type.Integer({ multipleOf: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TInteger with invalid minimum', () => {
    // @ts-ignore
    const R = TypeGuard.IsInteger(Type.Integer({ minimum: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TInteger with invalid maximum', () => {
    // @ts-ignore
    const R = TypeGuard.IsInteger(Type.Integer({ maximum: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TInteger with invalid exclusiveMinimum', () => {
    // @ts-ignore
    const R = TypeGuard.IsInteger(Type.Integer({ exclusiveMinimum: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TInteger with invalid exclusiveMaximum', () => {
    // @ts-ignore
    const R = TypeGuard.IsInteger(Type.Integer({ exclusiveMaximum: '1' }))
    Assert.IsFalse(R)
  })
})
