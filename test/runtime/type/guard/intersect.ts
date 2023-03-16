import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TUnion', () => {
  it('Should guard for TIntersect', () => {
    const R = TypeGuard.TIntersect(
      Type.Intersect([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: Type.Number(),
        }),
      ]),
    )
    Assert.equal(R, true)
  })
  it('Should not guard for TIntersect', () => {
    const R = TypeGuard.TIntersect(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: Type.Number(),
        }),
      ]),
    )
    Assert.equal(R, false)
  })
})
