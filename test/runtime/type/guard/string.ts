import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TString', () => {
  it('Should guard for TString', () => {
    const R = TypeGuard.TString(Type.String())
    Assert.equal(R, true)
  })

  it('Should not guard for TString', () => {
    const R = TypeGuard.TString(null)
    Assert.equal(R, false)
  })

  it('Should not guard for TString with invalid $id', () => {
    // @ts-ignore
    const R = TypeGuard.TString(Type.String({ $id: 1 }))
    Assert.equal(R, false)
  })

  it('Should not guard for TString with invalid minLength', () => {
    // @ts-ignore
    const R = TypeGuard.TString(Type.String({ minLength: '1' }))
    Assert.equal(R, false)
  })

  it('Should not guard for TString with invalid maxLength', () => {
    // @ts-ignore
    const R = TypeGuard.TString(Type.String({ maxLength: '1' }))
    Assert.equal(R, false)
  })

  it('Should not guard for TString with invalid pattern', () => {
    // @ts-ignore
    const R = TypeGuard.TString(Type.String({ pattern: 1 }))
    Assert.equal(R, false)
  })
})
