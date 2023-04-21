import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('type/guard/TUnion', () => {
  it('Should guard for TUnion', () => {
    const R = TypeGuard.TUnion(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: Type.Number(),
        }),
      ]),
    )
    Assert.isEqual(R, true)
  })
  it('Should not guard for TUnion', () => {
    const R = TypeGuard.TUnion(null)
    Assert.isEqual(R, false)
  })
  it('Should guard for TUnion with invalid $id', () => {
    const R = TypeGuard.TUnion(
      // @ts-ignore
      Type.Union(
        [
          Type.Object({
            x: Type.Number(),
          }),
          Type.Object({
            y: Type.Number(),
          }),
        ],
        {
          // @ts-ignore
          $id: 1,
        },
      ),
    )
    Assert.isEqual(R, false)
  })
  it('Should not guard for TUnion with invalid variant', () => {
    const R = TypeGuard.TUnion(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        {} as any,
      ]),
    )
    Assert.isEqual(R, false)
  })
  it('Should not guard for TUnion with invalid object variant', () => {
    const R = TypeGuard.TUnion(
      Type.Union([
        Type.Object({
          x: Type.Number(),
        }),
        Type.Object({
          y: {} as any,
        }),
      ]),
    )
    Assert.isEqual(R, false)
  })
  it('Transform: Should transform to never for zero length union', () => {
    const T = Type.Union([])
    const R = TypeGuard.TNever(T)
    Assert.isEqual(R, true)
  })
  it('Transform: Should unwrap union type for array of length === 1', () => {
    const T = Type.Union([Type.String()])
    const R = TypeGuard.TString(T)
    Assert.isEqual(R, true)
  })
  it('Transform: Should retain union if array length > 1', () => {
    const T = Type.Union([Type.String(), Type.Number()])
    const R1 = TypeGuard.TUnion(T)
    const R2 = TypeGuard.TString(T.anyOf[0])
    const R3 = TypeGuard.TNumber(T.anyOf[1])
    Assert.isEqual(R1, true)
    Assert.isEqual(R2, true)
    Assert.isEqual(R3, true)
  })
})
