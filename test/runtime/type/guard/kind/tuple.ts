import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TTuple', () => {
  it('Should guard for TTuple', () => {
    const R = KindGuard.IsTuple(Type.Tuple([Type.Number(), Type.Number()]))
    Assert.IsTrue(R)
  })
  it('Should not guard for TTuple', () => {
    const R = KindGuard.IsTuple(null)
    Assert.IsFalse(R)
  })
})
