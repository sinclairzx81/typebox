import { KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TObject', () => {
  it('Should guard for TObject', () => {
    const R = KindGuard.IsObject(
      Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    )
    Assert.IsTrue(R)
  })
  it('Should not guard for TObject', () => {
    const R = KindGuard.IsObject(null)
    Assert.IsFalse(R)
  })
})
