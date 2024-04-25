import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TDate', () => {
  it('Should guard for TDate', () => {
    const R = KindGuard.IsDate(Type.Date())
    Assert.IsTrue(R)
  })
  it('Should not guard for TDate', () => {
    const R = KindGuard.IsDate(null)
    Assert.IsFalse(R)
  })
})
