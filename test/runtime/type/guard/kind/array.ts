import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TArray', () => {
  it('Should guard for TArray', () => {
    const R = KindGuard.IsArray(Type.Array(Type.Number()))
    Assert.IsTrue(R)
  })
  it('Should not guard for TArray', () => {
    const R = KindGuard.IsArray(null)
    Assert.IsFalse(R)
  })
})
