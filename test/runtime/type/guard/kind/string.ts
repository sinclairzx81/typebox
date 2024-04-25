import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TString', () => {
  it('Should guard for TString', () => {
    const R = KindGuard.IsString(Type.String())
    Assert.IsTrue(R)
  })
  it('Should not guard for TString', () => {
    const R = KindGuard.IsString(null)
    Assert.IsFalse(R)
  })
})
