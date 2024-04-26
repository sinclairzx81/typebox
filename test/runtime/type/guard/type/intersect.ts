import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/type/TIntersect', () => {
  it('Should guard for TIntersect', () => {
    const R = TypeGuard.IsIntersect(
      Type.Intersect([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: Type.Number(),
        }),
      ]),
    )
    Assert.IsTrue(R)
  })
  it('Should not guard for TIntersect', () => {
    const R = TypeGuard.IsIntersect(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: Type.Number(),
        }),
      ]),
    )
    Assert.IsFalse(R)
  })
  it('Should throw for intersected transform types', () => {
    const N = Type.Transform(Type.Number())
      .Decode((value) => value)
      .Encode((value) => value)

    Assert.Throws(() => Type.Intersect([N, N]))
  })
})
