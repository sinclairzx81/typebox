import { TypeGuard } from '@sinclair/typebox/guard'
import { Type } from '@sinclair/typebox'
import { Assert } from '../assert/index'

describe('type/guard/TString', () => {
  it('should guard for TString', () => {
    const R = TypeGuard.TString(Type.String())
    Assert.equal(R, true)
  })
  it('should not guard for TString', () => {
    const R = TypeGuard.TString(null)
    Assert.equal(R, false)
  })
})
