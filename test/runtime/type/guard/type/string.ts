import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TString', () => {
  it('Should guard for TString', () => {
    const R = TypeGuard.IsString(Type.String())
    Assert.IsTrue(R)
  })
  it('Should not guard for TString', () => {
    const R = TypeGuard.IsString(null)
    Assert.IsFalse(R)
  })
  it('Should not guard for TString with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.IsString(Type.String({ $id: 1 }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TString with invalid minLength', () => {
    // @ts-ignore
    const R = TypeGuard.IsString(Type.String({ minLength: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TString with invalid maxLength', () => {
    // @ts-ignore
    const R = TypeGuard.IsString(Type.String({ maxLength: '1' }))
    Assert.IsFalse(R)
  })
  it('Should not guard for TString with invalid pattern', () => {
    // @ts-ignore
    const R = TypeGuard.IsString(Type.String({ pattern: 1 }))
    Assert.IsFalse(R)
  })
})
