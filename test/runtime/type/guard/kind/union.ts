import { TSchema, KindGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

describe('guard/kind/TUnion', () => {
  it('Should guard for TUnion', () => {
    const R = KindGuard.IsUnion(
      Type.Union([
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
  it('Should not guard for TUnion', () => {
    const R = KindGuard.IsUnion(null)
    Assert.IsFalse(R)
  })
  it('Transform: Should transform to never for zero length union', () => {
    const T = Type.Union([])
    const R = KindGuard.IsNever(T)
    Assert.IsTrue(R)
  })
  it('Transform: Should unwrap union type for array of length === 1', () => {
    const T = Type.Union([Type.String()])
    const R = KindGuard.IsString(T)
    Assert.IsTrue(R)
  })
  it('Transform: Should retain union if array length > 1', () => {
    const T = Type.Union([Type.String(), Type.Number()])
    const R1 = KindGuard.IsUnion(T)
    const R2 = KindGuard.IsString(T.anyOf[0])
    const R3 = KindGuard.IsNumber(T.anyOf[1])
    Assert.IsTrue(R1)
    Assert.IsTrue(R2)
    Assert.IsTrue(R3)
  })
})
