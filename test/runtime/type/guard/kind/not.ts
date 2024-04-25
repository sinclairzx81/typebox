import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TNot', () => {
  it('Should guard for TNot', () => {
    const R = KindGuard.IsNot(Type.Not(Type.String()))
    Assert.IsTrue(R)
  })
})
